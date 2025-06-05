# `strands.event_loop`

This package provides the core event loop implementation for the agents SDK.

The event loop enables conversational AI agents to process messages, execute tools, and handle errors in a controlled, iterative manner.

## `strands.event_loop.event_loop`

This module implements the central event loop.

The event loop allows agents to:

1. Process conversation messages
1. Execute tools based on model requests
1. Handle errors and recovery strategies
1. Manage recursive execution cycles

### `event_loop_cycle(model, system_prompt, messages, tool_config, callback_handler, tool_handler, tool_execution_handler=None, **kwargs)`

Execute a single cycle of the event loop.

This core function processes a single conversation turn, handling model inference, tool execution, and error recovery. It manages the entire lifecycle of a conversation turn, including:

1. Initializing cycle state and metrics
1. Checking execution limits
1. Processing messages with the model
1. Handling tool execution requests
1. Managing recursive calls for multi-turn tool interactions
1. Collecting and reporting metrics
1. Error handling and recovery

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `model` | `Model` | Provider for running model inference. | *required* | | `system_prompt` | `Optional[str]` | System prompt instructions for the model. | *required* | | `messages` | `Messages` | Conversation history messages. | *required* | | `tool_config` | `Optional[ToolConfig]` | Configuration for available tools. | *required* | | `callback_handler` | `Callable[..., Any]` | Callback for processing events as they happen. | *required* | | `tool_handler` | `Optional[ToolHandler]` | Handler for executing tools. | *required* | | `tool_execution_handler` | `Optional[ParallelToolExecutorInterface]` | Optional handler for parallel tool execution. | `None` | | `**kwargs` | `Any` | Additional arguments including: event_loop_metrics: Metrics tracking object request_state: State maintained across cycles event_loop_cycle_id: Unique ID for this cycle event_loop_cycle_span: Current tracing Span for this cycle event_loop_parent_span: Parent tracing Span for this cycle | `{}` |

Returns:

| Type | Description | | --- | --- | | `Tuple[StopReason, Message, EventLoopMetrics, Any]` | A tuple containing: StopReason: Reason the model stopped generating (e.g., "tool_use") Message: The generated message from the model EventLoopMetrics: Updated metrics for the event loop Any: Updated request state |

Raises:

| Type | Description | | --- | --- | | `EventLoopException` | If an error occurs during execution | | `ContextWindowOverflowException` | If the input is too large for the model |

Source code in `strands/event_loop/event_loop.py`

```
def event_loop_cycle(
    model: Model,
    system_prompt: Optional[str],
    messages: Messages,
    tool_config: Optional[ToolConfig],
    callback_handler: Callable[..., Any],
    tool_handler: Optional[ToolHandler],
    tool_execution_handler: Optional[ParallelToolExecutorInterface] = None,
    **kwargs: Any,
) -> Tuple[StopReason, Message, EventLoopMetrics, Any]:
    """Execute a single cycle of the event loop.

    This core function processes a single conversation turn, handling model inference, tool execution, and error
    recovery. It manages the entire lifecycle of a conversation turn, including:

    1. Initializing cycle state and metrics
    2. Checking execution limits
    3. Processing messages with the model
    4. Handling tool execution requests
    5. Managing recursive calls for multi-turn tool interactions
    6. Collecting and reporting metrics
    7. Error handling and recovery

    Args:
        model: Provider for running model inference.
        system_prompt: System prompt instructions for the model.
        messages: Conversation history messages.
        tool_config: Configuration for available tools.
        callback_handler: Callback for processing events as they happen.
        tool_handler: Handler for executing tools.
        tool_execution_handler: Optional handler for parallel tool execution.
        **kwargs: Additional arguments including:

            - event_loop_metrics: Metrics tracking object
            - request_state: State maintained across cycles
            - event_loop_cycle_id: Unique ID for this cycle
            - event_loop_cycle_span: Current tracing Span for this cycle
            - event_loop_parent_span: Parent tracing Span for this cycle

    Returns:
        A tuple containing:

            - StopReason: Reason the model stopped generating (e.g., "tool_use")
            - Message: The generated message from the model
            - EventLoopMetrics: Updated metrics for the event loop
            - Any: Updated request state

    Raises:
        EventLoopException: If an error occurs during execution
        ContextWindowOverflowException: If the input is too large for the model
    """
    # Initialize cycle state
    kwargs["event_loop_cycle_id"] = uuid.uuid4()

    event_loop_metrics: EventLoopMetrics = kwargs.get("event_loop_metrics", EventLoopMetrics())

    # Initialize state and get cycle trace
    kwargs = initialize_state(**kwargs)
    cycle_start_time, cycle_trace = event_loop_metrics.start_cycle()
    kwargs["event_loop_cycle_trace"] = cycle_trace

    callback_handler(start=True)
    callback_handler(start_event_loop=True)

    # Create tracer span for this event loop cycle
    tracer = get_tracer()
    parent_span = kwargs.get("event_loop_parent_span")
    cycle_span = tracer.start_event_loop_cycle_span(
        event_loop_kwargs=kwargs, parent_span=parent_span, messages=messages
    )
    kwargs["event_loop_cycle_span"] = cycle_span

    # Create a trace for the stream_messages call
    stream_trace = Trace("stream_messages", parent_id=cycle_trace.id)
    cycle_trace.add_child(stream_trace)

    # Clean up orphaned empty tool uses
    clean_orphaned_empty_tool_uses(messages)

    # Process messages with exponential backoff for throttling
    message: Message
    stop_reason: StopReason
    usage: Any
    metrics: Metrics

    # Retry loop for handling throttling exceptions
    for attempt in range(MAX_ATTEMPTS):
        model_id = model.config.get("model_id") if hasattr(model, "config") else None
        model_invoke_span = tracer.start_model_invoke_span(
            parent_span=cycle_span,
            messages=messages,
            model_id=model_id,
        )

        try:
            stop_reason, message, usage, metrics, kwargs["request_state"] = stream_messages(
                model,
                system_prompt,
                messages,
                tool_config,
                callback_handler,
                **kwargs,
            )
            if model_invoke_span:
                tracer.end_model_invoke_span(model_invoke_span, message, usage)
            break  # Success! Break out of retry loop

        except ContextWindowOverflowException as e:
            if model_invoke_span:
                tracer.end_span_with_error(model_invoke_span, str(e), e)
            return handle_input_too_long_error(
                e,
                messages,
                model,
                system_prompt,
                tool_config,
                callback_handler,
                tool_handler,
                kwargs,
            )

        except ModelThrottledException as e:
            if model_invoke_span:
                tracer.end_span_with_error(model_invoke_span, str(e), e)

            # Handle throttling errors with exponential backoff
            should_retry, current_delay = handle_throttling_error(
                e, attempt, MAX_ATTEMPTS, INITIAL_DELAY, MAX_DELAY, callback_handler, kwargs
            )
            if should_retry:
                continue

            # If not a throttling error or out of retries, re-raise
            raise e
        except Exception as e:
            if model_invoke_span:
                tracer.end_span_with_error(model_invoke_span, str(e), e)
            raise e

    try:
        # Add message in trace and mark the end of the stream messages trace
        stream_trace.add_message(message)
        stream_trace.end()

        # Add the response message to the conversation
        messages.append(message)
        callback_handler(message=message)

        # Update metrics
        event_loop_metrics.update_usage(usage)
        event_loop_metrics.update_metrics(metrics)

        # If the model is requesting to use tools
        if stop_reason == "tool_use":
            if not tool_handler:
                raise EventLoopException(
                    Exception("Model requested tool use but no tool handler provided"),
                    kwargs["request_state"],
                )

            if tool_config is None:
                raise EventLoopException(
                    Exception("Model requested tool use but no tool config provided"),
                    kwargs["request_state"],
                )

            # Handle tool execution
            return _handle_tool_execution(
                stop_reason,
                message,
                model,
                system_prompt,
                messages,
                tool_config,
                tool_handler,
                callback_handler,
                tool_execution_handler,
                event_loop_metrics,
                cycle_trace,
                cycle_span,
                cycle_start_time,
                kwargs,
            )

        # End the cycle and return results
        event_loop_metrics.end_cycle(cycle_start_time, cycle_trace)
        if cycle_span:
            tracer.end_event_loop_cycle_span(
                span=cycle_span,
                message=message,
            )
    except EventLoopException as e:
        if cycle_span:
            tracer.end_span_with_error(cycle_span, str(e), e)

        # Don't invoke the callback_handler or log the exception - we already did it when we
        # raised the exception and we don't need that duplication.
        raise
    except Exception as e:
        if cycle_span:
            tracer.end_span_with_error(cycle_span, str(e), e)

        # Handle any other exceptions
        callback_handler(force_stop=True, force_stop_reason=str(e))
        logger.exception("cycle failed")
        raise EventLoopException(e, kwargs["request_state"]) from e

    return stop_reason, message, event_loop_metrics, kwargs["request_state"]

```

### `initialize_state(**kwargs)`

Initialize the request state if not present.

Creates an empty request_state dictionary if one doesn't already exist in the provided keyword arguments.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `**kwargs` | `Any` | Keyword arguments that may contain a request_state. | `{}` |

Returns:

| Type | Description | | --- | --- | | `Any` | The updated kwargs dictionary with request_state initialized if needed. |

Source code in `strands/event_loop/event_loop.py`

```
def initialize_state(**kwargs: Any) -> Any:
    """Initialize the request state if not present.

    Creates an empty request_state dictionary if one doesn't already exist in the
    provided keyword arguments.

    Args:
        **kwargs: Keyword arguments that may contain a request_state.

    Returns:
        The updated kwargs dictionary with request_state initialized if needed.
    """
    if "request_state" not in kwargs:
        kwargs["request_state"] = {}
    return kwargs

```

### `prepare_next_cycle(kwargs, event_loop_metrics)`

Prepare state for the next event loop cycle.

Updates the keyword arguments with the current event loop metrics and stores the current cycle ID as the parent cycle ID for the next cycle. This maintains the parent-child relationship between cycles for tracing and metrics.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `kwargs` | `Dict[str, Any]` | Current keyword arguments containing event loop state. | *required* | | `event_loop_metrics` | `EventLoopMetrics` | The metrics object tracking event loop execution. | *required* |

Returns:

| Type | Description | | --- | --- | | `Dict[str, Any]` | Updated keyword arguments ready for the next cycle. |

Source code in `strands/event_loop/event_loop.py`

```
def prepare_next_cycle(kwargs: Dict[str, Any], event_loop_metrics: EventLoopMetrics) -> Dict[str, Any]:
    """Prepare state for the next event loop cycle.

    Updates the keyword arguments with the current event loop metrics and stores the current cycle ID as the parent
    cycle ID for the next cycle. This maintains the parent-child relationship between cycles for tracing and metrics.

    Args:
        kwargs: Current keyword arguments containing event loop state.
        event_loop_metrics: The metrics object tracking event loop execution.

    Returns:
        Updated keyword arguments ready for the next cycle.
    """
    # Store parent cycle ID
    kwargs["event_loop_metrics"] = event_loop_metrics
    kwargs["event_loop_parent_cycle_id"] = kwargs["event_loop_cycle_id"]

    return kwargs

```

### `recurse_event_loop(**kwargs)`

Make a recursive call to event_loop_cycle with the current state.

This function is used when the event loop needs to continue processing after tool execution.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `**kwargs` | `Any` | Arguments to pass to event_loop_cycle, including: model: Provider for running model inference system_prompt: System prompt instructions for the model messages: Conversation history messages tool_config: Configuration for available tools callback_handler: Callback for processing events as they happen tool_handler: Handler for tool execution event_loop_cycle_trace: Trace for the current cycle event_loop_metrics: Metrics tracking object | `{}` |

Returns:

| Type | Description | | --- | --- | | `Tuple[StopReason, Message, EventLoopMetrics, Any]` | Results from event_loop_cycle: StopReason: Reason the model stopped generating Message: The generated message from the model EventLoopMetrics: Updated metrics for the event loop Any: Updated request state |

Source code in `strands/event_loop/event_loop.py`

```
def recurse_event_loop(
    **kwargs: Any,
) -> Tuple[StopReason, Message, EventLoopMetrics, Any]:
    """Make a recursive call to event_loop_cycle with the current state.

    This function is used when the event loop needs to continue processing after tool execution.

    Args:
        **kwargs: Arguments to pass to event_loop_cycle, including:

            - model: Provider for running model inference
            - system_prompt: System prompt instructions for the model
            - messages: Conversation history messages
            - tool_config: Configuration for available tools
            - callback_handler: Callback for processing events as they happen
            - tool_handler: Handler for tool execution
            - event_loop_cycle_trace: Trace for the current cycle
            - event_loop_metrics: Metrics tracking object

    Returns:
        Results from event_loop_cycle:

            - StopReason: Reason the model stopped generating
            - Message: The generated message from the model
            - EventLoopMetrics: Updated metrics for the event loop
            - Any: Updated request state
    """
    cycle_trace = kwargs["event_loop_cycle_trace"]
    callback_handler = kwargs["callback_handler"]

    # Recursive call trace
    recursive_trace = Trace("Recursive call", parent_id=cycle_trace.id)
    cycle_trace.add_child(recursive_trace)

    callback_handler(start=True)

    # Make recursive call
    (
        recursive_stop_reason,
        recursive_message,
        recursive_event_loop_metrics,
        recursive_request_state,
    ) = event_loop_cycle(**kwargs)

    recursive_trace.end()

    return (
        recursive_stop_reason,
        recursive_message,
        recursive_event_loop_metrics,
        recursive_request_state,
    )

```

## `strands.event_loop.error_handler`

This module provides specialized error handlers for common issues that may occur during event loop execution.

Examples include throttling exceptions and context window overflow errors. These handlers implement recovery strategies like exponential backoff for throttling and message truncation for context window limitations.

### `handle_input_too_long_error(e, messages, model, system_prompt, tool_config, callback_handler, tool_handler, kwargs)`

Handle 'Input is too long' errors by truncating tool results.

When a context window overflow exception occurs (input too long for the model), this function attempts to recover by finding and truncating the most recent tool results in the conversation history. If truncation is successful, the function will make a call to the event loop.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `e` | `ContextWindowOverflowException` | The ContextWindowOverflowException that occurred. | *required* | | `messages` | `Messages` | The conversation message history. | *required* | | `model` | `Model` | Model provider for running inference. | *required* | | `system_prompt` | `Optional[str]` | System prompt for the model. | *required* | | `tool_config` | `Any` | Tool configuration for the conversation. | *required* | | `callback_handler` | `Any` | Callback for processing events as they happen. | *required* | | `tool_handler` | `Any` | Handler for tool execution. | *required* | | `kwargs` | `Dict[str, Any]` | Additional arguments for the event loop. | *required* |

Returns:

| Type | Description | | --- | --- | | `Tuple[StopReason, Message, EventLoopMetrics, Any]` | The results from the event loop call if successful. |

Raises:

| Type | Description | | --- | --- | | `ContextWindowOverflowException` | If messages cannot be truncated. |

Source code in `strands/event_loop/error_handler.py`

```
def handle_input_too_long_error(
    e: ContextWindowOverflowException,
    messages: Messages,
    model: Model,
    system_prompt: Optional[str],
    tool_config: Any,
    callback_handler: Any,
    tool_handler: Any,
    kwargs: Dict[str, Any],
) -> Tuple[StopReason, Message, EventLoopMetrics, Any]:
    """Handle 'Input is too long' errors by truncating tool results.

    When a context window overflow exception occurs (input too long for the model), this function attempts to recover
    by finding and truncating the most recent tool results in the conversation history. If truncation is successful, the
    function will make a call to the event loop.

    Args:
        e: The ContextWindowOverflowException that occurred.
        messages: The conversation message history.
        model: Model provider for running inference.
        system_prompt: System prompt for the model.
        tool_config: Tool configuration for the conversation.
        callback_handler: Callback for processing events as they happen.
        tool_handler: Handler for tool execution.
        kwargs: Additional arguments for the event loop.

    Returns:
        The results from the event loop call if successful.

    Raises:
        ContextWindowOverflowException: If messages cannot be truncated.
    """
    from .event_loop import recurse_event_loop  # Import here to avoid circular imports

    # Find the last message with tool results
    last_message_with_tool_results = find_last_message_with_tool_results(messages)

    # If we found a message with toolResult
    if last_message_with_tool_results is not None:
        logger.debug("message_index=<%s> | found message with tool results at index", last_message_with_tool_results)

        # Truncate the tool results in this message
        truncate_tool_results(messages, last_message_with_tool_results)

        return recurse_event_loop(
            model=model,
            system_prompt=system_prompt,
            messages=messages,
            tool_config=tool_config,
            callback_handler=callback_handler,
            tool_handler=tool_handler,
            **kwargs,
        )

    # If we can't handle this error, pass it up
    callback_handler(force_stop=True, force_stop_reason=str(e))
    logger.error("an exception occurred in event_loop_cycle | %s", e)
    raise ContextWindowOverflowException() from e

```

### `handle_throttling_error(e, attempt, max_attempts, current_delay, max_delay, callback_handler, kwargs)`

Handle throttling exceptions from the model provider with exponential backoff.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `e` | `ModelThrottledException` | The exception that occurred during model invocation. | *required* | | `attempt` | `int` | Number of times event loop has attempted model invocation. | *required* | | `max_attempts` | `int` | Maximum number of retry attempts allowed. | *required* | | `current_delay` | `int` | Current delay in seconds before retrying. | *required* | | `max_delay` | `int` | Maximum delay in seconds (cap for exponential growth). | *required* | | `callback_handler` | `Any` | Callback for processing events as they happen. | *required* | | `kwargs` | `Dict[str, Any]` | Additional arguments to pass to the callback handler. | *required* |

Returns:

| Type | Description | | --- | --- | | `Tuple[bool, int]` | A tuple containing: - bool: True if retry should be attempted, False otherwise - int: The new delay to use for the next retry attempt |

Source code in `strands/event_loop/error_handler.py`

```
def handle_throttling_error(
    e: ModelThrottledException,
    attempt: int,
    max_attempts: int,
    current_delay: int,
    max_delay: int,
    callback_handler: Any,
    kwargs: Dict[str, Any],
) -> Tuple[bool, int]:
    """Handle throttling exceptions from the model provider with exponential backoff.

    Args:
        e: The exception that occurred during model invocation.
        attempt: Number of times event loop has attempted model invocation.
        max_attempts: Maximum number of retry attempts allowed.
        current_delay: Current delay in seconds before retrying.
        max_delay: Maximum delay in seconds (cap for exponential growth).
        callback_handler: Callback for processing events as they happen.
        kwargs: Additional arguments to pass to the callback handler.

    Returns:
        A tuple containing:
            - bool: True if retry should be attempted, False otherwise
            - int: The new delay to use for the next retry attempt
    """
    if attempt < max_attempts - 1:  # Don't sleep on last attempt
        logger.debug(
            "retry_delay_seconds=<%s>, max_attempts=<%s>, current_attempt=<%s> "
            "| throttling exception encountered "
            "| delaying before next retry",
            current_delay,
            max_attempts,
            attempt + 1,
        )
        callback_handler(event_loop_throttled_delay=current_delay, **kwargs)
        time.sleep(current_delay)
        new_delay = min(current_delay * 2, max_delay)  # Double delay each retry
        return True, new_delay

    callback_handler(force_stop=True, force_stop_reason=str(e))
    return False, current_delay

```

## `strands.event_loop.message_processor`

This module provides utilities for processing and manipulating conversation messages within the event loop.

It includes functions for cleaning up orphaned tool uses, finding messages with specific content types, and truncating large tool results to prevent context window overflow.

### `clean_orphaned_empty_tool_uses(messages)`

Clean up orphaned empty tool uses in conversation messages.

This function identifies and removes any toolUse entries with empty input that don't have a corresponding toolResult. This prevents validation errors that occur when the model expects matching toolResult blocks for each toolUse.

The function applies fixes by either:

1. Replacing a message containing only an orphaned toolUse with a context message
1. Removing the orphaned toolUse entry from a message with multiple content items

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `messages` | `Messages` | The conversation message history. | *required* |

Returns:

| Type | Description | | --- | --- | | `bool` | True if any fixes were applied, False otherwise. |

Source code in `strands/event_loop/message_processor.py`

```
def clean_orphaned_empty_tool_uses(messages: Messages) -> bool:
    """Clean up orphaned empty tool uses in conversation messages.

    This function identifies and removes any toolUse entries with empty input that don't have a corresponding
    toolResult. This prevents validation errors that occur when the model expects matching toolResult blocks for each
    toolUse.

    The function applies fixes by either:

    1. Replacing a message containing only an orphaned toolUse with a context message
    2. Removing the orphaned toolUse entry from a message with multiple content items

    Args:
        messages: The conversation message history.

    Returns:
        True if any fixes were applied, False otherwise.
    """
    if not messages:
        return False

    # Dictionary to track empty toolUse entries: {tool_id: (msg_index, content_index, tool_name)}
    empty_tool_uses: Dict[str, Tuple[int, int, str]] = {}

    # Set to track toolResults that have been seen
    tool_results: Set[str] = set()

    # Identify empty toolUse entries
    for i, msg in enumerate(messages):
        if msg.get("role") != "assistant":
            continue

        for j, content in enumerate(msg.get("content", [])):
            if isinstance(content, dict) and "toolUse" in content:
                tool_use = content.get("toolUse", {})
                tool_id = tool_use.get("toolUseId")
                tool_input = tool_use.get("input", {})
                tool_name = tool_use.get("name", "unknown tool")

                # Check if this is an empty toolUse
                if tool_id and (not tool_input or tool_input == {}):
                    empty_tool_uses[tool_id] = (i, j, tool_name)

    # Identify toolResults
    for msg in messages:
        if msg.get("role") != "user":
            continue

        for content in msg.get("content", []):
            if isinstance(content, dict) and "toolResult" in content:
                tool_result = content.get("toolResult", {})
                tool_id = tool_result.get("toolUseId")
                if tool_id:
                    tool_results.add(tool_id)

    # Filter for orphaned empty toolUses (no corresponding toolResult)
    orphaned_tool_uses = {tool_id: info for tool_id, info in empty_tool_uses.items() if tool_id not in tool_results}

    # Apply fixes in reverse order of occurrence (to avoid index shifting)
    if not orphaned_tool_uses:
        return False

    # Sort by message index and content index in reverse order
    sorted_orphaned = sorted(orphaned_tool_uses.items(), key=lambda x: (x[1][0], x[1][1]), reverse=True)

    # Apply fixes
    for tool_id, (msg_idx, content_idx, tool_name) in sorted_orphaned:
        logger.debug(
            "tool_name=<%s>, tool_id=<%s>, message_index=<%s>, content_index=<%s> "
            "fixing orphaned empty tool use at message index",
            tool_name,
            tool_id,
            msg_idx,
            content_idx,
        )
        try:
            # Check if this is the sole content in the message
            if len(messages[msg_idx]["content"]) == 1:
                # Replace with a message indicating the attempted tool
                messages[msg_idx]["content"] = [{"text": f"[Attempted to use {tool_name}, but operation was canceled]"}]
                logger.debug("message_index=<%s> | replaced content with context message", msg_idx)
            else:
                # Simply remove the orphaned toolUse entry
                messages[msg_idx]["content"].pop(content_idx)
                logger.debug(
                    "message_index=<%s>, content_index=<%s> | removed content item from message", msg_idx, content_idx
                )
        except Exception as e:
            logger.warning("failed to fix orphaned tool use | %s", e)

    return True

```

### `find_last_message_with_tool_results(messages)`

Find the index of the last message containing tool results.

This is useful for identifying messages that might need to be truncated to reduce context size.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `messages` | `Messages` | The conversation message history. | *required* |

Returns:

| Type | Description | | --- | --- | | `Optional[int]` | Index of the last message with tool results, or None if no such message exists. |

Source code in `strands/event_loop/message_processor.py`

```
def find_last_message_with_tool_results(messages: Messages) -> Optional[int]:
    """Find the index of the last message containing tool results.

    This is useful for identifying messages that might need to be truncated to reduce context size.

    Args:
        messages: The conversation message history.

    Returns:
        Index of the last message with tool results, or None if no such message exists.
    """
    # Iterate backwards through all messages (from newest to oldest)
    for idx in range(len(messages) - 1, -1, -1):
        # Check if this message has any content with toolResult
        current_message = messages[idx]
        has_tool_result = False

        for content in current_message.get("content", []):
            if isinstance(content, dict) and "toolResult" in content:
                has_tool_result = True
                break

        if has_tool_result:
            return idx

    return None

```

### `truncate_tool_results(messages, msg_idx)`

Truncate tool results in a message to reduce context size.

When a message contains tool results that are too large for the model's context window, this function replaces the content of those tool results with a simple error message.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `messages` | `Messages` | The conversation message history. | *required* | | `msg_idx` | `int` | Index of the message containing tool results to truncate. | *required* |

Returns:

| Type | Description | | --- | --- | | `bool` | True if any changes were made to the message, False otherwise. |

Source code in `strands/event_loop/message_processor.py`

```
def truncate_tool_results(messages: Messages, msg_idx: int) -> bool:
    """Truncate tool results in a message to reduce context size.

    When a message contains tool results that are too large for the model's context window, this function replaces the
    content of those tool results with a simple error message.

    Args:
        messages: The conversation message history.
        msg_idx: Index of the message containing tool results to truncate.

    Returns:
        True if any changes were made to the message, False otherwise.
    """
    if msg_idx >= len(messages) or msg_idx < 0:
        return False

    message = messages[msg_idx]
    changes_made = False

    for i, content in enumerate(message.get("content", [])):
        if isinstance(content, dict) and "toolResult" in content:
            # Update status to error with informative message
            message["content"][i]["toolResult"]["status"] = "error"
            message["content"][i]["toolResult"]["content"] = [{"text": "The tool result was too large!"}]
            changes_made = True

    return changes_made

```

## `strands.event_loop.streaming`

Utilities for handling streaming responses from language models.

### `extract_usage_metrics(event)`

Extracts usage metrics from the metadata chunk.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `MetadataEvent` | metadata. | *required* |

Returns:

| Type | Description | | --- | --- | | `Tuple[Usage, Metrics]` | The extracted usage metrics and latency. |

Source code in `strands/event_loop/streaming.py`

```
def extract_usage_metrics(event: MetadataEvent) -> Tuple[Usage, Metrics]:
    """Extracts usage metrics from the metadata chunk.

    Args:
        event: metadata.

    Returns:
        The extracted usage metrics and latency.
    """
    usage = Usage(**event["usage"])
    metrics = Metrics(**event["metrics"])

    return usage, metrics

```

### `handle_content_block_delta(event, state, callback_handler, **kwargs)`

Handles content block delta updates by appending text, tool input, or reasoning content to the state.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `ContentBlockDeltaEvent` | Delta event. | *required* | | `state` | `Dict[str, Any]` | The current state of message processing. | *required* | | `callback_handler` | `Any` | Callback for processing events as they happen. | *required* | | `**kwargs` | `Any` | Additional keyword arguments to pass to the callback handler. | `{}` |

Returns:

| Type | Description | | --- | --- | | `Dict[str, Any]` | Updated state with appended text or tool input. |

Source code in `strands/event_loop/streaming.py`

```
def handle_content_block_delta(
    event: ContentBlockDeltaEvent, state: Dict[str, Any], callback_handler: Any, **kwargs: Any
) -> Dict[str, Any]:
    """Handles content block delta updates by appending text, tool input, or reasoning content to the state.

    Args:
        event: Delta event.
        state: The current state of message processing.
        callback_handler: Callback for processing events as they happen.
        **kwargs: Additional keyword arguments to pass to the callback handler.

    Returns:
        Updated state with appended text or tool input.
    """
    delta_content = event["delta"]

    if "toolUse" in delta_content:
        if "input" not in state["current_tool_use"]:
            state["current_tool_use"]["input"] = ""

        state["current_tool_use"]["input"] += delta_content["toolUse"]["input"]
        callback_handler(delta=delta_content, current_tool_use=state["current_tool_use"], **kwargs)

    elif "text" in delta_content:
        state["text"] += delta_content["text"]
        callback_handler(data=delta_content["text"], delta=delta_content, **kwargs)

    elif "reasoningContent" in delta_content:
        if "text" in delta_content["reasoningContent"]:
            if "reasoningText" not in state:
                state["reasoningText"] = ""

            state["reasoningText"] += delta_content["reasoningContent"]["text"]
            callback_handler(
                reasoningText=delta_content["reasoningContent"]["text"],
                delta=delta_content,
                reasoning=True,
                **kwargs,
            )

        elif "signature" in delta_content["reasoningContent"]:
            if "signature" not in state:
                state["signature"] = ""

            state["signature"] += delta_content["reasoningContent"]["signature"]
            callback_handler(
                reasoning_signature=delta_content["reasoningContent"]["signature"],
                delta=delta_content,
                reasoning=True,
                **kwargs,
            )

    return state

```

### `handle_content_block_start(event)`

Handles the start of a content block by extracting tool usage information if any.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `ContentBlockStartEvent` | Start event. | *required* |

Returns:

| Type | Description | | --- | --- | | `Dict[str, Any]` | Dictionary with tool use id and name if tool use request, empty dictionary otherwise. |

Source code in `strands/event_loop/streaming.py`

```
def handle_content_block_start(event: ContentBlockStartEvent) -> Dict[str, Any]:
    """Handles the start of a content block by extracting tool usage information if any.

    Args:
        event: Start event.

    Returns:
        Dictionary with tool use id and name if tool use request, empty dictionary otherwise.
    """
    start: ContentBlockStart = event["start"]
    current_tool_use = {}

    if "toolUse" in start and start["toolUse"]:
        tool_use_data = start["toolUse"]
        current_tool_use["toolUseId"] = tool_use_data["toolUseId"]
        current_tool_use["name"] = tool_use_data["name"]
        current_tool_use["input"] = ""

    return current_tool_use

```

### `handle_content_block_stop(state)`

Handles the end of a content block by finalizing tool usage, text content, or reasoning content.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `state` | `Dict[str, Any]` | The current state of message processing. | *required* |

Returns:

| Type | Description | | --- | --- | | `Dict[str, Any]` | Updated state with finalized content block. |

Source code in `strands/event_loop/streaming.py`

```
def handle_content_block_stop(state: Dict[str, Any]) -> Dict[str, Any]:
    """Handles the end of a content block by finalizing tool usage, text content, or reasoning content.

    Args:
        state: The current state of message processing.

    Returns:
        Updated state with finalized content block.
    """
    content: List[ContentBlock] = state["content"]

    current_tool_use = state["current_tool_use"]
    text = state["text"]
    reasoning_text = state["reasoningText"]

    if current_tool_use:
        if "input" not in current_tool_use:
            current_tool_use["input"] = ""

        try:
            current_tool_use["input"] = json.loads(current_tool_use["input"])
        except ValueError:
            current_tool_use["input"] = {}

        tool_use_id = current_tool_use["toolUseId"]
        tool_use_name = current_tool_use["name"]

        tool_use = ToolUse(
            toolUseId=tool_use_id,
            name=tool_use_name,
            input=current_tool_use["input"],
        )
        content.append({"toolUse": tool_use})
        state["current_tool_use"] = {}

    elif text:
        content.append({"text": text})
        state["text"] = ""

    elif reasoning_text:
        content.append(
            {
                "reasoningContent": {
                    "reasoningText": {
                        "text": state["reasoningText"],
                        "signature": state["signature"],
                    }
                }
            }
        )
        state["reasoningText"] = ""

    return state

```

### `handle_message_start(event, message)`

Handles the start of a message by setting the role in the message dictionary.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `MessageStartEvent` | A message start event. | *required* | | `message` | `Message` | The message dictionary being constructed. | *required* |

Returns:

| Type | Description | | --- | --- | | `Message` | Updated message dictionary with the role set. |

Source code in `strands/event_loop/streaming.py`

```
def handle_message_start(event: MessageStartEvent, message: Message) -> Message:
    """Handles the start of a message by setting the role in the message dictionary.

    Args:
        event: A message start event.
        message: The message dictionary being constructed.

    Returns:
        Updated message dictionary with the role set.
    """
    message["role"] = event["role"]
    return message

```

### `handle_message_stop(event)`

Handles the end of a message by returning the stop reason.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `MessageStopEvent` | Stop event. | *required* |

Returns:

| Type | Description | | --- | --- | | `StopReason` | The reason for stopping the stream. |

Source code in `strands/event_loop/streaming.py`

```
def handle_message_stop(event: MessageStopEvent) -> StopReason:
    """Handles the end of a message by returning the stop reason.

    Args:
        event: Stop event.

    Returns:
        The reason for stopping the stream.
    """
    return event["stopReason"]

```

### `handle_redact_content(event, messages, state)`

Handles redacting content from the input or output.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `RedactContentEvent` | Redact Content Event. | *required* | | `messages` | `Messages` | Agent messages. | *required* | | `state` | `Dict[str, Any]` | The current state of message processing. | *required* |

Source code in `strands/event_loop/streaming.py`

```
def handle_redact_content(event: RedactContentEvent, messages: Messages, state: Dict[str, Any]) -> None:
    """Handles redacting content from the input or output.

    Args:
        event: Redact Content Event.
        messages: Agent messages.
        state: The current state of message processing.
    """
    if event.get("redactUserContentMessage") is not None:
        messages[-1]["content"] = [{"text": event["redactUserContentMessage"]}]  # type: ignore

    if event.get("redactAssistantContentMessage") is not None:
        state["message"]["content"] = [{"text": event["redactAssistantContentMessage"]}]

```

### `process_stream(chunks, callback_handler, messages, **kwargs)`

Processes the response stream from the API, constructing the final message and extracting usage metrics.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `chunks` | `Iterable[StreamEvent]` | The chunks of the response stream from the model. | *required* | | `callback_handler` | `Any` | Callback for processing events as they happen. | *required* | | `messages` | `Messages` | The agents messages. | *required* | | `**kwargs` | `Any` | Additional keyword arguments that will be passed to the callback handler. And also returned in the request_state. | `{}` |

Returns:

| Type | Description | | --- | --- | | `Tuple[StopReason, Message, Usage, Metrics, Any]` | The reason for stopping, the constructed message, the usage metrics, and the updated request state. |

Source code in `strands/event_loop/streaming.py`

```
def process_stream(
    chunks: Iterable[StreamEvent],
    callback_handler: Any,
    messages: Messages,
    **kwargs: Any,
) -> Tuple[StopReason, Message, Usage, Metrics, Any]:
    """Processes the response stream from the API, constructing the final message and extracting usage metrics.

    Args:
        chunks: The chunks of the response stream from the model.
        callback_handler: Callback for processing events as they happen.
        messages: The agents messages.
        **kwargs: Additional keyword arguments that will be passed to the callback handler.
            And also returned in the request_state.

    Returns:
        The reason for stopping, the constructed message, the usage metrics, and the updated request state.
    """
    stop_reason: StopReason = "end_turn"

    state: Dict[str, Any] = {
        "message": {"role": "assistant", "content": []},
        "text": "",
        "current_tool_use": {},
        "reasoningText": "",
        "signature": "",
    }
    state["content"] = state["message"]["content"]

    usage: Usage = Usage(inputTokens=0, outputTokens=0, totalTokens=0)
    metrics: Metrics = Metrics(latencyMs=0)

    kwargs.setdefault("request_state", {})

    for chunk in chunks:
        # Callback handler call here allows each event to be visible to the caller
        callback_handler(event=chunk)

        if "messageStart" in chunk:
            state["message"] = handle_message_start(chunk["messageStart"], state["message"])
        elif "contentBlockStart" in chunk:
            state["current_tool_use"] = handle_content_block_start(chunk["contentBlockStart"])
        elif "contentBlockDelta" in chunk:
            state = handle_content_block_delta(chunk["contentBlockDelta"], state, callback_handler, **kwargs)
        elif "contentBlockStop" in chunk:
            state = handle_content_block_stop(state)
        elif "messageStop" in chunk:
            stop_reason = handle_message_stop(chunk["messageStop"])
        elif "metadata" in chunk:
            usage, metrics = extract_usage_metrics(chunk["metadata"])
        elif "redactContent" in chunk:
            handle_redact_content(chunk["redactContent"], messages, state)

    return stop_reason, state["message"], usage, metrics, kwargs["request_state"]

```

### `remove_blank_messages_content_text(messages)`

Remove or replace blank text in message content.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `messages` | `Messages` | Conversation messages to update. | *required* |

Returns:

| Type | Description | | --- | --- | | `Messages` | Updated messages. |

Source code in `strands/event_loop/streaming.py`

```
def remove_blank_messages_content_text(messages: Messages) -> Messages:
    """Remove or replace blank text in message content.

    Args:
        messages: Conversation messages to update.

    Returns:
        Updated messages.
    """
    removed_blank_message_content_text = False
    replaced_blank_message_content_text = False

    for message in messages:
        # only modify assistant messages
        if "role" in message and message["role"] != "assistant":
            continue

        if "content" in message:
            content = message["content"]
            has_tool_use = any("toolUse" in item for item in content)

            if has_tool_use:
                # Remove blank 'text' items for assistant messages
                before_len = len(content)
                content[:] = [item for item in content if "text" not in item or item["text"].strip()]
                if not removed_blank_message_content_text and before_len != len(content):
                    removed_blank_message_content_text = True
            else:
                # Replace blank 'text' with '[blank text]' for assistant messages
                for item in content:
                    if "text" in item and not item["text"].strip():
                        replaced_blank_message_content_text = True
                        item["text"] = "[blank text]"

    if removed_blank_message_content_text:
        logger.debug("removed blank message context text")
    if replaced_blank_message_content_text:
        logger.debug("replaced blank message context text")

    return messages

```

### `stream_messages(model, system_prompt, messages, tool_config, callback_handler, **kwargs)`

Streams messages to the model and processes the response.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `model` | `Model` | Model provider. | *required* | | `system_prompt` | `Optional[str]` | The system prompt to send. | *required* | | `messages` | `Messages` | List of messages to send. | *required* | | `tool_config` | `Optional[ToolConfig]` | Configuration for the tools to use. | *required* | | `callback_handler` | `Any` | Callback for processing events as they happen. | *required* | | `**kwargs` | `Any` | Additional keyword arguments that will be passed to the callback handler. And also returned in the request_state. | `{}` |

Returns:

| Type | Description | | --- | --- | | `Tuple[StopReason, Message, Usage, Metrics, Any]` | The reason for stopping, the final message, the usage metrics, and updated request state. |

Source code in `strands/event_loop/streaming.py`

```
def stream_messages(
    model: Model,
    system_prompt: Optional[str],
    messages: Messages,
    tool_config: Optional[ToolConfig],
    callback_handler: Any,
    **kwargs: Any,
) -> Tuple[StopReason, Message, Usage, Metrics, Any]:
    """Streams messages to the model and processes the response.

    Args:
        model: Model provider.
        system_prompt: The system prompt to send.
        messages: List of messages to send.
        tool_config: Configuration for the tools to use.
        callback_handler: Callback for processing events as they happen.
        **kwargs: Additional keyword arguments that will be passed to the callback handler.
            And also returned in the request_state.

    Returns:
        The reason for stopping, the final message, the usage metrics, and updated request state.
    """
    logger.debug("model=<%s> | streaming messages", model)

    messages = remove_blank_messages_content_text(messages)
    tool_specs = [tool["toolSpec"] for tool in tool_config.get("tools", [])] or None if tool_config else None

    chunks = model.converse(messages, tool_specs, system_prompt)
    return process_stream(chunks, callback_handler, messages, **kwargs)

```
