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
    if "request_state" not in kwargs:
        kwargs["request_state"] = {}
    attributes = {"event_loop_cycle_id": str(kwargs.get("event_loop_cycle_id"))}
    cycle_start_time, cycle_trace = event_loop_metrics.start_cycle(attributes=attributes)
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
    current_delay = INITIAL_DELAY
    for attempt in range(MAX_ATTEMPTS):
        model_id = model.config.get("model_id") if hasattr(model, "config") else None
        model_invoke_span = tracer.start_model_invoke_span(
            parent_span=cycle_span,
            messages=messages,
            model_id=model_id,
        )

        try:
            # TODO: As part of the migration to async-iterator, we will continue moving callback_handler calls up the
            #       call stack. At this point, we converted all events that were previously passed to the handler in
            #       `stream_messages` into yielded events that now have the "callback" key. To maintain backwards
            #       compatability, we need to combine the event with kwargs before passing to the handler. This we will
            #       revisit when migrating to strongly typed events.
            for event in stream_messages(model, system_prompt, messages, tool_config):
                if "callback" in event:
                    inputs = {**event["callback"], **(kwargs if "delta" in event["callback"] else {})}
                    callback_handler(**inputs)
            else:
                stop_reason, message, usage, metrics = event["stop"]
                kwargs.setdefault("request_state", {})

            if model_invoke_span:
                tracer.end_model_invoke_span(model_invoke_span, message, usage)
            break  # Success! Break out of retry loop

        except ContextWindowOverflowException as e:
            if model_invoke_span:
                tracer.end_span_with_error(model_invoke_span, str(e), e)
            raise e

        except ModelThrottledException as e:
            if model_invoke_span:
                tracer.end_span_with_error(model_invoke_span, str(e), e)

            # Handle throttling errors with exponential backoff
            should_retry, current_delay = handle_throttling_error(
                e, attempt, MAX_ATTEMPTS, current_delay, MAX_DELAY, callback_handler, kwargs
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
        event_loop_metrics.end_cycle(cycle_start_time, cycle_trace, attributes)
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
    except ContextWindowOverflowException as e:
        if cycle_span:
            tracer.end_span_with_error(cycle_span, str(e), e)
        raise e
    except Exception as e:
        if cycle_span:
            tracer.end_span_with_error(cycle_span, str(e), e)

        # Handle any other exceptions
        callback_handler(force_stop=True, force_stop_reason=str(e))
        logger.exception("cycle failed")
        raise EventLoopException(e, kwargs["request_state"]) from e

    return stop_reason, message, event_loop_metrics, kwargs["request_state"]

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

## `strands.event_loop.streaming`

Utilities for handling streaming responses from language models.

### `extract_usage_metrics(event)`

Extracts usage metrics from the metadata chunk.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `MetadataEvent` | metadata. | *required* |

Returns:

| Type | Description | | --- | --- | | `tuple[Usage, Metrics]` | The extracted usage metrics and latency. |

Source code in `strands/event_loop/streaming.py`

```
def extract_usage_metrics(event: MetadataEvent) -> tuple[Usage, Metrics]:
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

### `handle_content_block_delta(event, state)`

Handles content block delta updates by appending text, tool input, or reasoning content to the state.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `ContentBlockDeltaEvent` | Delta event. | *required* | | `state` | `dict[str, Any]` | The current state of message processing. | *required* |

Returns:

| Type | Description | | --- | --- | | `tuple[dict[str, Any], dict[str, Any]]` | Updated state with appended text or tool input. |

Source code in `strands/event_loop/streaming.py`

```
def handle_content_block_delta(
    event: ContentBlockDeltaEvent, state: dict[str, Any]
) -> tuple[dict[str, Any], dict[str, Any]]:
    """Handles content block delta updates by appending text, tool input, or reasoning content to the state.

    Args:
        event: Delta event.
        state: The current state of message processing.

    Returns:
        Updated state with appended text or tool input.
    """
    delta_content = event["delta"]

    callback_event = {}

    if "toolUse" in delta_content:
        if "input" not in state["current_tool_use"]:
            state["current_tool_use"]["input"] = ""

        state["current_tool_use"]["input"] += delta_content["toolUse"]["input"]
        callback_event["callback"] = {"delta": delta_content, "current_tool_use": state["current_tool_use"]}

    elif "text" in delta_content:
        state["text"] += delta_content["text"]
        callback_event["callback"] = {"data": delta_content["text"], "delta": delta_content}

    elif "reasoningContent" in delta_content:
        if "text" in delta_content["reasoningContent"]:
            if "reasoningText" not in state:
                state["reasoningText"] = ""

            state["reasoningText"] += delta_content["reasoningContent"]["text"]
            callback_event["callback"] = {
                "reasoningText": delta_content["reasoningContent"]["text"],
                "delta": delta_content,
                "reasoning": True,
            }

        elif "signature" in delta_content["reasoningContent"]:
            if "signature" not in state:
                state["signature"] = ""

            state["signature"] += delta_content["reasoningContent"]["signature"]
            callback_event["callback"] = {
                "reasoning_signature": delta_content["reasoningContent"]["signature"],
                "delta": delta_content,
                "reasoning": True,
            }

    return state, callback_event

```

### `handle_content_block_start(event)`

Handles the start of a content block by extracting tool usage information if any.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `ContentBlockStartEvent` | Start event. | *required* |

Returns:

| Type | Description | | --- | --- | | `dict[str, Any]` | Dictionary with tool use id and name if tool use request, empty dictionary otherwise. |

Source code in `strands/event_loop/streaming.py`

```
def handle_content_block_start(event: ContentBlockStartEvent) -> dict[str, Any]:
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

| Name | Type | Description | Default | | --- | --- | --- | --- | | `state` | `dict[str, Any]` | The current state of message processing. | *required* |

Returns:

| Type | Description | | --- | --- | | `dict[str, Any]` | Updated state with finalized content block. |

Source code in `strands/event_loop/streaming.py`

```
def handle_content_block_stop(state: dict[str, Any]) -> dict[str, Any]:
    """Handles the end of a content block by finalizing tool usage, text content, or reasoning content.

    Args:
        state: The current state of message processing.

    Returns:
        Updated state with finalized content block.
    """
    content: list[ContentBlock] = state["content"]

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

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `RedactContentEvent` | Redact Content Event. | *required* | | `messages` | `Messages` | Agent messages. | *required* | | `state` | `dict[str, Any]` | The current state of message processing. | *required* |

Source code in `strands/event_loop/streaming.py`

```
def handle_redact_content(event: RedactContentEvent, messages: Messages, state: dict[str, Any]) -> None:
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

### `process_stream(chunks, messages)`

Processes the response stream from the API, constructing the final message and extracting usage metrics.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `chunks` | `Iterable[StreamEvent]` | The chunks of the response stream from the model. | *required* | | `messages` | `Messages` | The agents messages. | *required* |

Returns:

| Type | Description | | --- | --- | | `None` | The reason for stopping, the constructed message, and the usage metrics. |

Source code in `strands/event_loop/streaming.py`

```
def process_stream(
    chunks: Iterable[StreamEvent],
    messages: Messages,
) -> Generator[dict[str, Any], None, None]:
    """Processes the response stream from the API, constructing the final message and extracting usage metrics.

    Args:
        chunks: The chunks of the response stream from the model.
        messages: The agents messages.

    Returns:
        The reason for stopping, the constructed message, and the usage metrics.
    """
    stop_reason: StopReason = "end_turn"

    state: dict[str, Any] = {
        "message": {"role": "assistant", "content": []},
        "text": "",
        "current_tool_use": {},
        "reasoningText": "",
        "signature": "",
    }
    state["content"] = state["message"]["content"]

    usage: Usage = Usage(inputTokens=0, outputTokens=0, totalTokens=0)
    metrics: Metrics = Metrics(latencyMs=0)

    for chunk in chunks:
        yield {"callback": {"event": chunk}}

        if "messageStart" in chunk:
            state["message"] = handle_message_start(chunk["messageStart"], state["message"])
        elif "contentBlockStart" in chunk:
            state["current_tool_use"] = handle_content_block_start(chunk["contentBlockStart"])
        elif "contentBlockDelta" in chunk:
            state, callback_event = handle_content_block_delta(chunk["contentBlockDelta"], state)
            yield callback_event
        elif "contentBlockStop" in chunk:
            state = handle_content_block_stop(state)
        elif "messageStop" in chunk:
            stop_reason = handle_message_stop(chunk["messageStop"])
        elif "metadata" in chunk:
            usage, metrics = extract_usage_metrics(chunk["metadata"])
        elif "redactContent" in chunk:
            handle_redact_content(chunk["redactContent"], messages, state)

    yield {"stop": (stop_reason, state["message"], usage, metrics)}

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

### `stream_messages(model, system_prompt, messages, tool_config)`

Streams messages to the model and processes the response.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `model` | `Model` | Model provider. | *required* | | `system_prompt` | `Optional[str]` | The system prompt to send. | *required* | | `messages` | `Messages` | List of messages to send. | *required* | | `tool_config` | `Optional[ToolConfig]` | Configuration for the tools to use. | *required* |

Returns:

| Type | Description | | --- | --- | | `None` | The reason for stopping, the final message, and the usage metrics |

Source code in `strands/event_loop/streaming.py`

```
def stream_messages(
    model: Model,
    system_prompt: Optional[str],
    messages: Messages,
    tool_config: Optional[ToolConfig],
) -> Generator[dict[str, Any], None, None]:
    """Streams messages to the model and processes the response.

    Args:
        model: Model provider.
        system_prompt: The system prompt to send.
        messages: List of messages to send.
        tool_config: Configuration for the tools to use.

    Returns:
        The reason for stopping, the final message, and the usage metrics
    """
    logger.debug("model=<%s> | streaming messages", model)

    messages = remove_blank_messages_content_text(messages)
    tool_specs = [tool["toolSpec"] for tool in tool_config.get("tools", [])] or None if tool_config else None

    chunks = model.converse(messages, tool_specs, system_prompt)
    yield from process_stream(chunks, messages)

```
