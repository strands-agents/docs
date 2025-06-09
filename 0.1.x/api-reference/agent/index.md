# `strands.agent`

This package provides the core Agent interface and supporting components for building AI agents with the SDK.

It includes:

- Agent: The main interface for interacting with AI models and tools
- ConversationManager: Classes for managing conversation history and context windows

## `strands.agent.agent`

Agent Interface.

This module implements the core Agent class that serves as the primary entry point for interacting with foundation models and tools in the SDK.

The Agent interface supports two complementary interaction patterns:

1. Natural language for conversation: `agent("Analyze this data")`
1. Method-style for direct tool access: `agent.tool.tool_name(param1="value")`

### `Agent`

Core Agent interface.

An agent orchestrates the following workflow:

1. Receives user input
1. Processes the input using a language model
1. Decides whether to use tools to gather information or perform actions
1. Executes those tools and receives results
1. Continues reasoning with the new information
1. Produces a final response

Source code in `strands/agent/agent.py`

````
class Agent:
    """Core Agent interface.

    An agent orchestrates the following workflow:

    1. Receives user input
    2. Processes the input using a language model
    3. Decides whether to use tools to gather information or perform actions
    4. Executes those tools and receives results
    5. Continues reasoning with the new information
    6. Produces a final response
    """

    class ToolCaller:
        """Call tool as a function."""

        def __init__(self, agent: "Agent") -> None:
            """Initialize instance.

            Args:
                agent: Agent reference that will accept tool results.
            """
            # WARNING: Do not add any other member variables or methods as this could result in a name conflict with
            #          agent tools and thus break their execution.
            self._agent = agent

        def __getattr__(self, name: str) -> Callable[..., Any]:
            """Call tool as a function.

            This method enables the method-style interface (e.g., `agent.tool.tool_name(param="value")`).

            Args:
                name: The name of the attribute (tool) being accessed.

            Returns:
                A function that when called will execute the named tool.

            Raises:
                AttributeError: If no tool with the given name exists.
            """

            def caller(**kwargs: Any) -> Any:
                """Call a tool directly by name.

                Args:
                    **kwargs: Keyword arguments to pass to the tool.

                        - user_message_override: Custom message to record instead of default
                        - tool_execution_handler: Custom handler for tool execution
                        - event_loop_metrics: Custom metrics collector
                        - messages: Custom message history to use
                        - tool_config: Custom tool configuration
                        - callback_handler: Custom callback handler
                        - record_direct_tool_call: Whether to record this call in history

                Returns:
                    The result returned by the tool.

                Raises:
                    AttributeError: If the tool doesn't exist.
                """
                if name not in self._agent.tool_registry.registry:
                    raise AttributeError(f"Tool '{name}' not found")

                # Create unique tool ID and set up the tool request
                tool_id = f"tooluse_{name}_{random.randint(100000000, 999999999)}"
                tool_use = {
                    "toolUseId": tool_id,
                    "name": name,
                    "input": kwargs.copy(),
                }

                # Extract tool execution parameters
                user_message_override = kwargs.get("user_message_override", None)
                tool_execution_handler = kwargs.get("tool_execution_handler", self._agent.thread_pool_wrapper)
                event_loop_metrics = kwargs.get("event_loop_metrics", self._agent.event_loop_metrics)
                messages = kwargs.get("messages", self._agent.messages)
                tool_config = kwargs.get("tool_config", self._agent.tool_config)
                callback_handler = kwargs.get("callback_handler", self._agent.callback_handler)
                record_direct_tool_call = kwargs.get("record_direct_tool_call", self._agent.record_direct_tool_call)

                # Process tool call
                handler_kwargs = {
                    k: v
                    for k, v in kwargs.items()
                    if k
                    not in [
                        "tool_execution_handler",
                        "event_loop_metrics",
                        "messages",
                        "tool_config",
                        "callback_handler",
                        "tool_handler",
                        "system_prompt",
                        "model",
                        "model_id",
                        "user_message_override",
                        "agent",
                        "record_direct_tool_call",
                    ]
                }

                # Execute the tool
                tool_result = self._agent.tool_handler.process(
                    tool=tool_use,
                    model=self._agent.model,
                    system_prompt=self._agent.system_prompt,
                    messages=messages,
                    tool_config=tool_config,
                    callback_handler=callback_handler,
                    tool_execution_handler=tool_execution_handler,
                    event_loop_metrics=event_loop_metrics,
                    agent=self._agent,
                    **handler_kwargs,
                )

                if record_direct_tool_call:
                    # Create a record of this tool execution in the message history
                    self._agent._record_tool_execution(tool_use, tool_result, user_message_override, messages)

                # Apply window management
                self._agent.conversation_manager.apply_management(self._agent)

                return tool_result

            return caller

    def __init__(
        self,
        model: Union[Model, str, None] = None,
        messages: Optional[Messages] = None,
        tools: Optional[List[Union[str, Dict[str, str], Any]]] = None,
        system_prompt: Optional[str] = None,
        callback_handler: Optional[
            Union[Callable[..., Any], _DefaultCallbackHandlerSentinel]
        ] = _DEFAULT_CALLBACK_HANDLER,
        conversation_manager: Optional[ConversationManager] = None,
        max_parallel_tools: int = os.cpu_count() or 1,
        record_direct_tool_call: bool = True,
        load_tools_from_directory: bool = True,
        trace_attributes: Optional[Mapping[str, AttributeValue]] = None,
    ):
        """Initialize the Agent with the specified configuration.

        Args:
            model: Provider for running inference or a string representing the model-id for Bedrock to use.
                Defaults to strands.models.BedrockModel if None.
            messages: List of initial messages to pre-load into the conversation.
                Defaults to an empty list if None.
            tools: List of tools to make available to the agent.
                Can be specified as:

                - String tool names (e.g., "retrieve")
                - File paths (e.g., "/path/to/tool.py")
                - Imported Python modules (e.g., from strands_tools import current_time)
                - Dictionaries with name/path keys (e.g., {"name": "tool_name", "path": "/path/to/tool.py"})
                - Functions decorated with `@strands.tool` decorator.

                If provided, only these tools will be available. If None, all tools will be available.
            system_prompt: System prompt to guide model behavior.
                If None, the model will behave according to its default settings.
            callback_handler: Callback for processing events as they happen during agent execution.
                If not provided (using the default), a new PrintingCallbackHandler instance is created.
                If explicitly set to None, null_callback_handler is used.
            conversation_manager: Manager for conversation history and context window.
                Defaults to strands.agent.conversation_manager.SlidingWindowConversationManager if None.
            max_parallel_tools: Maximum number of tools to run in parallel when the model returns multiple tool calls.
                Defaults to os.cpu_count() or 1.
            record_direct_tool_call: Whether to record direct tool calls in message history.
                Defaults to True.
            load_tools_from_directory: Whether to load and automatically reload tools in the `./tools/` directory.
                Defaults to True.
            trace_attributes: Custom trace attributes to apply to the agent's trace span.

        Raises:
            ValueError: If max_parallel_tools is less than 1.
        """
        self.model = BedrockModel() if not model else BedrockModel(model_id=model) if isinstance(model, str) else model
        self.messages = messages if messages is not None else []

        self.system_prompt = system_prompt

        # If not provided, create a new PrintingCallbackHandler instance
        # If explicitly set to None, use null_callback_handler
        # Otherwise use the passed callback_handler
        self.callback_handler: Union[Callable[..., Any], PrintingCallbackHandler]
        if isinstance(callback_handler, _DefaultCallbackHandlerSentinel):
            self.callback_handler = PrintingCallbackHandler()
        elif callback_handler is None:
            self.callback_handler = null_callback_handler
        else:
            self.callback_handler = callback_handler

        self.conversation_manager = conversation_manager if conversation_manager else SlidingWindowConversationManager()

        # Process trace attributes to ensure they're of compatible types
        self.trace_attributes: Dict[str, AttributeValue] = {}
        if trace_attributes:
            for k, v in trace_attributes.items():
                if isinstance(v, (str, int, float, bool)) or (
                    isinstance(v, list) and all(isinstance(x, (str, int, float, bool)) for x in v)
                ):
                    self.trace_attributes[k] = v

        # If max_parallel_tools is 1, we execute tools sequentially
        self.thread_pool = None
        self.thread_pool_wrapper = None
        if max_parallel_tools > 1:
            self.thread_pool = ThreadPoolExecutor(max_workers=max_parallel_tools)
            self.thread_pool_wrapper = ThreadPoolExecutorWrapper(self.thread_pool)
        elif max_parallel_tools < 1:
            raise ValueError("max_parallel_tools must be greater than 0")

        self.record_direct_tool_call = record_direct_tool_call
        self.load_tools_from_directory = load_tools_from_directory

        self.tool_registry = ToolRegistry()
        self.tool_handler = AgentToolHandler(tool_registry=self.tool_registry)

        # Process tool list if provided
        if tools is not None:
            self.tool_registry.process_tools(tools)

        # Initialize tools and configuration
        self.tool_registry.initialize_tools(self.load_tools_from_directory)
        if load_tools_from_directory:
            self.tool_watcher = ToolWatcher(tool_registry=self.tool_registry)

        self.event_loop_metrics = EventLoopMetrics()

        # Initialize tracer instance (no-op if not configured)
        self.tracer = get_tracer()
        self.trace_span: Optional[trace.Span] = None

        self.tool_caller = Agent.ToolCaller(self)

    @property
    def tool(self) -> ToolCaller:
        """Call tool as a function.

        Returns:
            Tool caller through which user can invoke tool as a function.

        Example:
            ```
            agent = Agent(tools=[calculator])
            agent.tool.calculator(...)
            ```
        """
        return self.tool_caller

    @property
    def tool_names(self) -> List[str]:
        """Get a list of all registered tool names.

        Returns:
            Names of all tools available to this agent.
        """
        all_tools = self.tool_registry.get_all_tools_config()
        return list(all_tools.keys())

    @property
    def tool_config(self) -> ToolConfig:
        """Get the tool configuration for this agent.

        Returns:
            The complete tool configuration.
        """
        return self.tool_registry.initialize_tool_config()

    def __del__(self) -> None:
        """Clean up resources when Agent is garbage collected.

        Ensures proper shutdown of the thread pool executor if one exists.
        """
        if self.thread_pool_wrapper and hasattr(self.thread_pool_wrapper, "shutdown"):
            self.thread_pool_wrapper.shutdown(wait=False)
            logger.debug("thread pool executor shutdown complete")

    def __call__(self, prompt: str, **kwargs: Any) -> AgentResult:
        """Process a natural language prompt through the agent's event loop.

        This method implements the conversational interface (e.g., `agent("hello!")`). It adds the user's prompt to
        the conversation history, processes it through the model, executes any tool calls, and returns the final result.

        Args:
            prompt: The natural language prompt from the user.
            **kwargs: Additional parameters to pass to the event loop.

        Returns:
            Result object containing:

                - stop_reason: Why the event loop stopped (e.g., "end_turn", "max_tokens")
                - message: The final message from the model
                - metrics: Performance metrics from the event loop
                - state: The final state of the event loop
        """
        self._start_agent_trace_span(prompt)

        try:
            # Run the event loop and get the result
            result = self._run_loop(prompt, kwargs)

            self._end_agent_trace_span(response=result)

            return result
        except Exception as e:
            self._end_agent_trace_span(error=e)

            # Re-raise the exception to preserve original behavior
            raise

    async def stream_async(self, prompt: str, **kwargs: Any) -> AsyncIterator[Any]:
        """Process a natural language prompt and yield events as an async iterator.

        This method provides an asynchronous interface for streaming agent events, allowing
        consumers to process stream events programmatically through an async iterator pattern
        rather than callback functions. This is particularly useful for web servers and other
        async environments.

        Args:
            prompt: The natural language prompt from the user.
            **kwargs: Additional parameters to pass to the event loop.

        Returns:
            An async iterator that yields events. Each event is a dictionary containing
            information about the current state of processing, such as:
            - data: Text content being generated
            - complete: Whether this is the final chunk
            - current_tool_use: Information about tools being executed
            - And other event data provided by the callback handler

        Raises:
            Exception: Any exceptions from the agent invocation will be propagated to the caller.

        Example:
            ```python
            async for event in agent.stream_async("Analyze this data"):
                if "data" in event:
                    yield event["data"]
            ```
        """
        self._start_agent_trace_span(prompt)

        _stop_event = uuid4()

        queue = asyncio.Queue[Any]()
        loop = asyncio.get_event_loop()

        def enqueue(an_item: Any) -> None:
            nonlocal queue
            nonlocal loop
            loop.call_soon_threadsafe(queue.put_nowait, an_item)

        def queuing_callback_handler(**handler_kwargs: Any) -> None:
            enqueue(handler_kwargs.copy())

        def target_callback() -> None:
            nonlocal kwargs

            try:
                result = self._run_loop(prompt, kwargs, supplementary_callback_handler=queuing_callback_handler)
                self._end_agent_trace_span(response=result)
            except Exception as e:
                self._end_agent_trace_span(error=e)
                enqueue(e)
            finally:
                enqueue(_stop_event)

        thread = Thread(target=target_callback, daemon=True)
        thread.start()

        try:
            while True:
                item = await queue.get()
                if item == _stop_event:
                    break
                if isinstance(item, Exception):
                    raise item
                yield item
        finally:
            thread.join()

    def _run_loop(
        self, prompt: str, kwargs: Dict[str, Any], supplementary_callback_handler: Optional[Callable[..., Any]] = None
    ) -> AgentResult:
        """Execute the agent's event loop with the given prompt and parameters."""
        try:
            # If the call had a callback_handler passed in, then for this event_loop
            # cycle we call both handlers as the callback_handler
            invocation_callback_handler = (
                CompositeCallbackHandler(self.callback_handler, supplementary_callback_handler)
                if supplementary_callback_handler is not None
                else self.callback_handler
            )

            # Extract key parameters
            invocation_callback_handler(init_event_loop=True, **kwargs)

            # Set up the user message with optional knowledge base retrieval
            message_content: List[ContentBlock] = [{"text": prompt}]
            new_message: Message = {"role": "user", "content": message_content}
            self.messages.append(new_message)

            # Execute the event loop cycle with retry logic for context limits
            return self._execute_event_loop_cycle(invocation_callback_handler, kwargs)

        finally:
            self.conversation_manager.apply_management(self)

    def _execute_event_loop_cycle(self, callback_handler: Callable[..., Any], kwargs: Dict[str, Any]) -> AgentResult:
        """Execute the event loop cycle with retry logic for context window limits.

        This internal method handles the execution of the event loop cycle and implements
        retry logic for handling context window overflow exceptions by reducing the
        conversation context and retrying.

        Returns:
            The result of the event loop cycle.
        """
        # Extract parameters with fallbacks to instance values
        system_prompt = kwargs.pop("system_prompt", self.system_prompt)
        model = kwargs.pop("model", self.model)
        tool_execution_handler = kwargs.pop("tool_execution_handler", self.thread_pool_wrapper)
        event_loop_metrics = kwargs.pop("event_loop_metrics", self.event_loop_metrics)
        callback_handler_override = kwargs.pop("callback_handler", callback_handler)
        tool_handler = kwargs.pop("tool_handler", self.tool_handler)
        messages = kwargs.pop("messages", self.messages)
        tool_config = kwargs.pop("tool_config", self.tool_config)
        kwargs.pop("agent", None)  # Remove agent to avoid conflicts

        try:
            # Execute the main event loop cycle
            stop_reason, message, metrics, state = event_loop_cycle(
                model=model,
                system_prompt=system_prompt,
                messages=messages,  # will be modified by event_loop_cycle
                tool_config=tool_config,
                callback_handler=callback_handler_override,
                tool_handler=tool_handler,
                tool_execution_handler=tool_execution_handler,
                event_loop_metrics=event_loop_metrics,
                agent=self,
                event_loop_parent_span=self.trace_span,
                **kwargs,
            )

            return AgentResult(stop_reason, message, metrics, state)

        except ContextWindowOverflowException as e:
            # Try reducing the context size and retrying

            self.conversation_manager.reduce_context(self, e=e)
            return self._execute_event_loop_cycle(callback_handler_override, kwargs)

    def _record_tool_execution(
        self,
        tool: Dict[str, Any],
        tool_result: Dict[str, Any],
        user_message_override: Optional[str],
        messages: List[Dict[str, Any]],
    ) -> None:
        """Record a tool execution in the message history.

        Creates a sequence of messages that represent the tool execution:

        1. A user message describing the tool call
        2. An assistant message with the tool use
        3. A user message with the tool result
        4. An assistant message acknowledging the tool call

        Args:
            tool: The tool call information.
            tool_result: The result returned by the tool.
            user_message_override: Optional custom message to include.
            messages: The message history to append to.
        """
        # Create user message describing the tool call
        user_msg_content = [
            {"text": (f"agent.tool.{tool['name']} direct tool call.\nInput parameters: {json.dumps(tool['input'])}\n")}
        ]

        # Add override message if provided
        if user_message_override:
            user_msg_content.insert(0, {"text": f"{user_message_override}\n"})

        # Create the message sequence
        user_msg = {
            "role": "user",
            "content": user_msg_content,
        }
        tool_use_msg = {
            "role": "assistant",
            "content": [{"toolUse": tool}],
        }
        tool_result_msg = {
            "role": "user",
            "content": [{"toolResult": tool_result}],
        }
        assistant_msg = {
            "role": "assistant",
            "content": [{"text": f"agent.{tool['name']} was called"}],
        }

        # Add to message history
        messages.append(user_msg)
        messages.append(tool_use_msg)
        messages.append(tool_result_msg)
        messages.append(assistant_msg)

    def _start_agent_trace_span(self, prompt: str) -> None:
        """Starts a trace span for the agent.

        Args:
            prompt: The natural language prompt from the user.
        """
        model_id = self.model.config.get("model_id") if hasattr(self.model, "config") else None

        self.trace_span = self.tracer.start_agent_span(
            prompt=prompt,
            model_id=model_id,
            tools=self.tool_names,
            system_prompt=self.system_prompt,
            custom_trace_attributes=self.trace_attributes,
        )

    def _end_agent_trace_span(
        self,
        response: Optional[AgentResult] = None,
        error: Optional[Exception] = None,
    ) -> None:
        """Ends a trace span for the agent.

        Args:
            span: The span to end.
            response: Response to record as a trace attribute.
            error: Error to record as a trace attribute.
        """
        if self.trace_span:
            trace_attributes: Dict[str, Any] = {
                "span": self.trace_span,
            }

            if response:
                trace_attributes["response"] = response
            if error:
                trace_attributes["error"] = error

            self.tracer.end_agent_span(**trace_attributes)

````

#### `tool`

Call tool as a function.

Returns:

| Type | Description | | --- | --- | | `ToolCaller` | Tool caller through which user can invoke tool as a function. |

Example

```
agent = Agent(tools=[calculator])
agent.tool.calculator(...)

```

#### `tool_config`

Get the tool configuration for this agent.

Returns:

| Type | Description | | --- | --- | | `ToolConfig` | The complete tool configuration. |

#### `tool_names`

Get a list of all registered tool names.

Returns:

| Type | Description | | --- | --- | | `List[str]` | Names of all tools available to this agent. |

#### `ToolCaller`

Call tool as a function.

Source code in `strands/agent/agent.py`

```
class ToolCaller:
    """Call tool as a function."""

    def __init__(self, agent: "Agent") -> None:
        """Initialize instance.

        Args:
            agent: Agent reference that will accept tool results.
        """
        # WARNING: Do not add any other member variables or methods as this could result in a name conflict with
        #          agent tools and thus break their execution.
        self._agent = agent

    def __getattr__(self, name: str) -> Callable[..., Any]:
        """Call tool as a function.

        This method enables the method-style interface (e.g., `agent.tool.tool_name(param="value")`).

        Args:
            name: The name of the attribute (tool) being accessed.

        Returns:
            A function that when called will execute the named tool.

        Raises:
            AttributeError: If no tool with the given name exists.
        """

        def caller(**kwargs: Any) -> Any:
            """Call a tool directly by name.

            Args:
                **kwargs: Keyword arguments to pass to the tool.

                    - user_message_override: Custom message to record instead of default
                    - tool_execution_handler: Custom handler for tool execution
                    - event_loop_metrics: Custom metrics collector
                    - messages: Custom message history to use
                    - tool_config: Custom tool configuration
                    - callback_handler: Custom callback handler
                    - record_direct_tool_call: Whether to record this call in history

            Returns:
                The result returned by the tool.

            Raises:
                AttributeError: If the tool doesn't exist.
            """
            if name not in self._agent.tool_registry.registry:
                raise AttributeError(f"Tool '{name}' not found")

            # Create unique tool ID and set up the tool request
            tool_id = f"tooluse_{name}_{random.randint(100000000, 999999999)}"
            tool_use = {
                "toolUseId": tool_id,
                "name": name,
                "input": kwargs.copy(),
            }

            # Extract tool execution parameters
            user_message_override = kwargs.get("user_message_override", None)
            tool_execution_handler = kwargs.get("tool_execution_handler", self._agent.thread_pool_wrapper)
            event_loop_metrics = kwargs.get("event_loop_metrics", self._agent.event_loop_metrics)
            messages = kwargs.get("messages", self._agent.messages)
            tool_config = kwargs.get("tool_config", self._agent.tool_config)
            callback_handler = kwargs.get("callback_handler", self._agent.callback_handler)
            record_direct_tool_call = kwargs.get("record_direct_tool_call", self._agent.record_direct_tool_call)

            # Process tool call
            handler_kwargs = {
                k: v
                for k, v in kwargs.items()
                if k
                not in [
                    "tool_execution_handler",
                    "event_loop_metrics",
                    "messages",
                    "tool_config",
                    "callback_handler",
                    "tool_handler",
                    "system_prompt",
                    "model",
                    "model_id",
                    "user_message_override",
                    "agent",
                    "record_direct_tool_call",
                ]
            }

            # Execute the tool
            tool_result = self._agent.tool_handler.process(
                tool=tool_use,
                model=self._agent.model,
                system_prompt=self._agent.system_prompt,
                messages=messages,
                tool_config=tool_config,
                callback_handler=callback_handler,
                tool_execution_handler=tool_execution_handler,
                event_loop_metrics=event_loop_metrics,
                agent=self._agent,
                **handler_kwargs,
            )

            if record_direct_tool_call:
                # Create a record of this tool execution in the message history
                self._agent._record_tool_execution(tool_use, tool_result, user_message_override, messages)

            # Apply window management
            self._agent.conversation_manager.apply_management(self._agent)

            return tool_result

        return caller

```

##### `__getattr__(name)`

Call tool as a function.

This method enables the method-style interface (e.g., `agent.tool.tool_name(param="value")`).

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `name` | `str` | The name of the attribute (tool) being accessed. | *required* |

Returns:

| Type | Description | | --- | --- | | `Callable[..., Any]` | A function that when called will execute the named tool. |

Raises:

| Type | Description | | --- | --- | | `AttributeError` | If no tool with the given name exists. |

Source code in `strands/agent/agent.py`

```
def __getattr__(self, name: str) -> Callable[..., Any]:
    """Call tool as a function.

    This method enables the method-style interface (e.g., `agent.tool.tool_name(param="value")`).

    Args:
        name: The name of the attribute (tool) being accessed.

    Returns:
        A function that when called will execute the named tool.

    Raises:
        AttributeError: If no tool with the given name exists.
    """

    def caller(**kwargs: Any) -> Any:
        """Call a tool directly by name.

        Args:
            **kwargs: Keyword arguments to pass to the tool.

                - user_message_override: Custom message to record instead of default
                - tool_execution_handler: Custom handler for tool execution
                - event_loop_metrics: Custom metrics collector
                - messages: Custom message history to use
                - tool_config: Custom tool configuration
                - callback_handler: Custom callback handler
                - record_direct_tool_call: Whether to record this call in history

        Returns:
            The result returned by the tool.

        Raises:
            AttributeError: If the tool doesn't exist.
        """
        if name not in self._agent.tool_registry.registry:
            raise AttributeError(f"Tool '{name}' not found")

        # Create unique tool ID and set up the tool request
        tool_id = f"tooluse_{name}_{random.randint(100000000, 999999999)}"
        tool_use = {
            "toolUseId": tool_id,
            "name": name,
            "input": kwargs.copy(),
        }

        # Extract tool execution parameters
        user_message_override = kwargs.get("user_message_override", None)
        tool_execution_handler = kwargs.get("tool_execution_handler", self._agent.thread_pool_wrapper)
        event_loop_metrics = kwargs.get("event_loop_metrics", self._agent.event_loop_metrics)
        messages = kwargs.get("messages", self._agent.messages)
        tool_config = kwargs.get("tool_config", self._agent.tool_config)
        callback_handler = kwargs.get("callback_handler", self._agent.callback_handler)
        record_direct_tool_call = kwargs.get("record_direct_tool_call", self._agent.record_direct_tool_call)

        # Process tool call
        handler_kwargs = {
            k: v
            for k, v in kwargs.items()
            if k
            not in [
                "tool_execution_handler",
                "event_loop_metrics",
                "messages",
                "tool_config",
                "callback_handler",
                "tool_handler",
                "system_prompt",
                "model",
                "model_id",
                "user_message_override",
                "agent",
                "record_direct_tool_call",
            ]
        }

        # Execute the tool
        tool_result = self._agent.tool_handler.process(
            tool=tool_use,
            model=self._agent.model,
            system_prompt=self._agent.system_prompt,
            messages=messages,
            tool_config=tool_config,
            callback_handler=callback_handler,
            tool_execution_handler=tool_execution_handler,
            event_loop_metrics=event_loop_metrics,
            agent=self._agent,
            **handler_kwargs,
        )

        if record_direct_tool_call:
            # Create a record of this tool execution in the message history
            self._agent._record_tool_execution(tool_use, tool_result, user_message_override, messages)

        # Apply window management
        self._agent.conversation_manager.apply_management(self._agent)

        return tool_result

    return caller

```

##### `__init__(agent)`

Initialize instance.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `agent` | `Agent` | Agent reference that will accept tool results. | *required* |

Source code in `strands/agent/agent.py`

```
def __init__(self, agent: "Agent") -> None:
    """Initialize instance.

    Args:
        agent: Agent reference that will accept tool results.
    """
    # WARNING: Do not add any other member variables or methods as this could result in a name conflict with
    #          agent tools and thus break their execution.
    self._agent = agent

```

#### `__call__(prompt, **kwargs)`

Process a natural language prompt through the agent's event loop.

This method implements the conversational interface (e.g., `agent("hello!")`). It adds the user's prompt to the conversation history, processes it through the model, executes any tool calls, and returns the final result.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `prompt` | `str` | The natural language prompt from the user. | *required* | | `**kwargs` | `Any` | Additional parameters to pass to the event loop. | `{}` |

Returns:

| Type | Description | | --- | --- | | `AgentResult` | Result object containing: stop_reason: Why the event loop stopped (e.g., "end_turn", "max_tokens") message: The final message from the model metrics: Performance metrics from the event loop state: The final state of the event loop |

Source code in `strands/agent/agent.py`

```
def __call__(self, prompt: str, **kwargs: Any) -> AgentResult:
    """Process a natural language prompt through the agent's event loop.

    This method implements the conversational interface (e.g., `agent("hello!")`). It adds the user's prompt to
    the conversation history, processes it through the model, executes any tool calls, and returns the final result.

    Args:
        prompt: The natural language prompt from the user.
        **kwargs: Additional parameters to pass to the event loop.

    Returns:
        Result object containing:

            - stop_reason: Why the event loop stopped (e.g., "end_turn", "max_tokens")
            - message: The final message from the model
            - metrics: Performance metrics from the event loop
            - state: The final state of the event loop
    """
    self._start_agent_trace_span(prompt)

    try:
        # Run the event loop and get the result
        result = self._run_loop(prompt, kwargs)

        self._end_agent_trace_span(response=result)

        return result
    except Exception as e:
        self._end_agent_trace_span(error=e)

        # Re-raise the exception to preserve original behavior
        raise

```

#### `__del__()`

Clean up resources when Agent is garbage collected.

Ensures proper shutdown of the thread pool executor if one exists.

Source code in `strands/agent/agent.py`

```
def __del__(self) -> None:
    """Clean up resources when Agent is garbage collected.

    Ensures proper shutdown of the thread pool executor if one exists.
    """
    if self.thread_pool_wrapper and hasattr(self.thread_pool_wrapper, "shutdown"):
        self.thread_pool_wrapper.shutdown(wait=False)
        logger.debug("thread pool executor shutdown complete")

```

#### `__init__(model=None, messages=None, tools=None, system_prompt=None, callback_handler=_DEFAULT_CALLBACK_HANDLER, conversation_manager=None, max_parallel_tools=os.cpu_count() or 1, record_direct_tool_call=True, load_tools_from_directory=True, trace_attributes=None)`

Initialize the Agent with the specified configuration.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `model` | `Union[Model, str, None]` | Provider for running inference or a string representing the model-id for Bedrock to use. Defaults to strands.models.BedrockModel if None. | `None` | | `messages` | `Optional[Messages]` | List of initial messages to pre-load into the conversation. Defaults to an empty list if None. | `None` | | `tools` | `Optional[List[Union[str, Dict[str, str], Any]]]` | List of tools to make available to the agent. Can be specified as: String tool names (e.g., "retrieve") File paths (e.g., "/path/to/tool.py") Imported Python modules (e.g., from strands_tools import current_time) Dictionaries with name/path keys (e.g., {"name": "tool_name", "path": "/path/to/tool.py"}) Functions decorated with @strands.tool decorator. If provided, only these tools will be available. If None, all tools will be available. | `None` | | `system_prompt` | `Optional[str]` | System prompt to guide model behavior. If None, the model will behave according to its default settings. | `None` | | `callback_handler` | `Optional[Union[Callable[..., Any], _DefaultCallbackHandlerSentinel]]` | Callback for processing events as they happen during agent execution. If not provided (using the default), a new PrintingCallbackHandler instance is created. If explicitly set to None, null_callback_handler is used. | `_DEFAULT_CALLBACK_HANDLER` | | `conversation_manager` | `Optional[ConversationManager]` | Manager for conversation history and context window. Defaults to strands.agent.conversation_manager.SlidingWindowConversationManager if None. | `None` | | `max_parallel_tools` | `int` | Maximum number of tools to run in parallel when the model returns multiple tool calls. Defaults to os.cpu_count() or 1. | `cpu_count() or 1` | | `record_direct_tool_call` | `bool` | Whether to record direct tool calls in message history. Defaults to True. | `True` | | `load_tools_from_directory` | `bool` | Whether to load and automatically reload tools in the ./tools/ directory. Defaults to True. | `True` | | `trace_attributes` | `Optional[Mapping[str, AttributeValue]]` | Custom trace attributes to apply to the agent's trace span. | `None` |

Raises:

| Type | Description | | --- | --- | | `ValueError` | If max_parallel_tools is less than 1. |

Source code in `strands/agent/agent.py`

```
def __init__(
    self,
    model: Union[Model, str, None] = None,
    messages: Optional[Messages] = None,
    tools: Optional[List[Union[str, Dict[str, str], Any]]] = None,
    system_prompt: Optional[str] = None,
    callback_handler: Optional[
        Union[Callable[..., Any], _DefaultCallbackHandlerSentinel]
    ] = _DEFAULT_CALLBACK_HANDLER,
    conversation_manager: Optional[ConversationManager] = None,
    max_parallel_tools: int = os.cpu_count() or 1,
    record_direct_tool_call: bool = True,
    load_tools_from_directory: bool = True,
    trace_attributes: Optional[Mapping[str, AttributeValue]] = None,
):
    """Initialize the Agent with the specified configuration.

    Args:
        model: Provider for running inference or a string representing the model-id for Bedrock to use.
            Defaults to strands.models.BedrockModel if None.
        messages: List of initial messages to pre-load into the conversation.
            Defaults to an empty list if None.
        tools: List of tools to make available to the agent.
            Can be specified as:

            - String tool names (e.g., "retrieve")
            - File paths (e.g., "/path/to/tool.py")
            - Imported Python modules (e.g., from strands_tools import current_time)
            - Dictionaries with name/path keys (e.g., {"name": "tool_name", "path": "/path/to/tool.py"})
            - Functions decorated with `@strands.tool` decorator.

            If provided, only these tools will be available. If None, all tools will be available.
        system_prompt: System prompt to guide model behavior.
            If None, the model will behave according to its default settings.
        callback_handler: Callback for processing events as they happen during agent execution.
            If not provided (using the default), a new PrintingCallbackHandler instance is created.
            If explicitly set to None, null_callback_handler is used.
        conversation_manager: Manager for conversation history and context window.
            Defaults to strands.agent.conversation_manager.SlidingWindowConversationManager if None.
        max_parallel_tools: Maximum number of tools to run in parallel when the model returns multiple tool calls.
            Defaults to os.cpu_count() or 1.
        record_direct_tool_call: Whether to record direct tool calls in message history.
            Defaults to True.
        load_tools_from_directory: Whether to load and automatically reload tools in the `./tools/` directory.
            Defaults to True.
        trace_attributes: Custom trace attributes to apply to the agent's trace span.

    Raises:
        ValueError: If max_parallel_tools is less than 1.
    """
    self.model = BedrockModel() if not model else BedrockModel(model_id=model) if isinstance(model, str) else model
    self.messages = messages if messages is not None else []

    self.system_prompt = system_prompt

    # If not provided, create a new PrintingCallbackHandler instance
    # If explicitly set to None, use null_callback_handler
    # Otherwise use the passed callback_handler
    self.callback_handler: Union[Callable[..., Any], PrintingCallbackHandler]
    if isinstance(callback_handler, _DefaultCallbackHandlerSentinel):
        self.callback_handler = PrintingCallbackHandler()
    elif callback_handler is None:
        self.callback_handler = null_callback_handler
    else:
        self.callback_handler = callback_handler

    self.conversation_manager = conversation_manager if conversation_manager else SlidingWindowConversationManager()

    # Process trace attributes to ensure they're of compatible types
    self.trace_attributes: Dict[str, AttributeValue] = {}
    if trace_attributes:
        for k, v in trace_attributes.items():
            if isinstance(v, (str, int, float, bool)) or (
                isinstance(v, list) and all(isinstance(x, (str, int, float, bool)) for x in v)
            ):
                self.trace_attributes[k] = v

    # If max_parallel_tools is 1, we execute tools sequentially
    self.thread_pool = None
    self.thread_pool_wrapper = None
    if max_parallel_tools > 1:
        self.thread_pool = ThreadPoolExecutor(max_workers=max_parallel_tools)
        self.thread_pool_wrapper = ThreadPoolExecutorWrapper(self.thread_pool)
    elif max_parallel_tools < 1:
        raise ValueError("max_parallel_tools must be greater than 0")

    self.record_direct_tool_call = record_direct_tool_call
    self.load_tools_from_directory = load_tools_from_directory

    self.tool_registry = ToolRegistry()
    self.tool_handler = AgentToolHandler(tool_registry=self.tool_registry)

    # Process tool list if provided
    if tools is not None:
        self.tool_registry.process_tools(tools)

    # Initialize tools and configuration
    self.tool_registry.initialize_tools(self.load_tools_from_directory)
    if load_tools_from_directory:
        self.tool_watcher = ToolWatcher(tool_registry=self.tool_registry)

    self.event_loop_metrics = EventLoopMetrics()

    # Initialize tracer instance (no-op if not configured)
    self.tracer = get_tracer()
    self.trace_span: Optional[trace.Span] = None

    self.tool_caller = Agent.ToolCaller(self)

```

#### `stream_async(prompt, **kwargs)`

Process a natural language prompt and yield events as an async iterator.

This method provides an asynchronous interface for streaming agent events, allowing consumers to process stream events programmatically through an async iterator pattern rather than callback functions. This is particularly useful for web servers and other async environments.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `prompt` | `str` | The natural language prompt from the user. | *required* | | `**kwargs` | `Any` | Additional parameters to pass to the event loop. | `{}` |

Returns:

| Type | Description | | --- | --- | | `AsyncIterator[Any]` | An async iterator that yields events. Each event is a dictionary containing | | `AsyncIterator[Any]` | information about the current state of processing, such as: | | `AsyncIterator[Any]` | data: Text content being generated | | `AsyncIterator[Any]` | complete: Whether this is the final chunk | | `AsyncIterator[Any]` | current_tool_use: Information about tools being executed | | `AsyncIterator[Any]` | And other event data provided by the callback handler |

Raises:

| Type | Description | | --- | --- | | `Exception` | Any exceptions from the agent invocation will be propagated to the caller. |

Example

```
async for event in agent.stream_async("Analyze this data"):
    if "data" in event:
        yield event["data"]

```

Source code in `strands/agent/agent.py`

````
async def stream_async(self, prompt: str, **kwargs: Any) -> AsyncIterator[Any]:
    """Process a natural language prompt and yield events as an async iterator.

    This method provides an asynchronous interface for streaming agent events, allowing
    consumers to process stream events programmatically through an async iterator pattern
    rather than callback functions. This is particularly useful for web servers and other
    async environments.

    Args:
        prompt: The natural language prompt from the user.
        **kwargs: Additional parameters to pass to the event loop.

    Returns:
        An async iterator that yields events. Each event is a dictionary containing
        information about the current state of processing, such as:
        - data: Text content being generated
        - complete: Whether this is the final chunk
        - current_tool_use: Information about tools being executed
        - And other event data provided by the callback handler

    Raises:
        Exception: Any exceptions from the agent invocation will be propagated to the caller.

    Example:
        ```python
        async for event in agent.stream_async("Analyze this data"):
            if "data" in event:
                yield event["data"]
        ```
    """
    self._start_agent_trace_span(prompt)

    _stop_event = uuid4()

    queue = asyncio.Queue[Any]()
    loop = asyncio.get_event_loop()

    def enqueue(an_item: Any) -> None:
        nonlocal queue
        nonlocal loop
        loop.call_soon_threadsafe(queue.put_nowait, an_item)

    def queuing_callback_handler(**handler_kwargs: Any) -> None:
        enqueue(handler_kwargs.copy())

    def target_callback() -> None:
        nonlocal kwargs

        try:
            result = self._run_loop(prompt, kwargs, supplementary_callback_handler=queuing_callback_handler)
            self._end_agent_trace_span(response=result)
        except Exception as e:
            self._end_agent_trace_span(error=e)
            enqueue(e)
        finally:
            enqueue(_stop_event)

    thread = Thread(target=target_callback, daemon=True)
    thread.start()

    try:
        while True:
            item = await queue.get()
            if item == _stop_event:
                break
            if isinstance(item, Exception):
                raise item
            yield item
    finally:
        thread.join()

````

## `strands.agent.agent_result`

Agent result handling for SDK.

This module defines the AgentResult class which encapsulates the complete response from an agent's processing cycle.

### `AgentResult`

Represents the last result of invoking an agent with a prompt.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `stop_reason` | `StopReason` | The reason why the agent's processing stopped. | | `message` | `Message` | The last message generated by the agent. | | `metrics` | `EventLoopMetrics` | Performance metrics collected during processing. | | `state` | `Any` | Additional state information from the event loop. |

Source code in `strands/agent/agent_result.py`

```
@dataclass
class AgentResult:
    """Represents the last result of invoking an agent with a prompt.

    Attributes:
        stop_reason: The reason why the agent's processing stopped.
        message: The last message generated by the agent.
        metrics: Performance metrics collected during processing.
        state: Additional state information from the event loop.
    """

    stop_reason: StopReason
    message: Message
    metrics: EventLoopMetrics
    state: Any

    def __str__(self) -> str:
        """Get the agent's last message as a string.

        This method extracts and concatenates all text content from the final message, ignoring any non-text content
        like images or structured data.

        Returns:
            The agent's last message as a string.
        """
        content_array = self.message.get("content", [])

        result = ""
        for item in content_array:
            if isinstance(item, dict) and "text" in item:
                result += item.get("text", "") + "\n"

        return result

```

#### `__str__()`

Get the agent's last message as a string.

This method extracts and concatenates all text content from the final message, ignoring any non-text content like images or structured data.

Returns:

| Type | Description | | --- | --- | | `str` | The agent's last message as a string. |

Source code in `strands/agent/agent_result.py`

```
def __str__(self) -> str:
    """Get the agent's last message as a string.

    This method extracts and concatenates all text content from the final message, ignoring any non-text content
    like images or structured data.

    Returns:
        The agent's last message as a string.
    """
    content_array = self.message.get("content", [])

    result = ""
    for item in content_array:
        if isinstance(item, dict) and "text" in item:
            result += item.get("text", "") + "\n"

    return result

```

## `strands.agent.conversation_manager`

This package provides classes for managing conversation history during agent execution.

It includes:

- ConversationManager: Abstract base class defining the conversation management interface
- NullConversationManager: A no-op implementation that does not modify conversation history
- SlidingWindowConversationManager: An implementation that maintains a sliding window of messages to control context size while preserving conversation coherence

Conversation managers help control memory usage and context length while maintaining relevant conversation state, which is critical for effective agent interactions.

### `strands.agent.conversation_manager.conversation_manager`

Abstract interface for conversation history management.

#### `ConversationManager`

Bases: `ABC`

Abstract base class for managing conversation history.

This class provides an interface for implementing conversation management strategies to control the size of message arrays/conversation histories, helping to:

- Manage memory usage
- Control context length
- Maintain relevant conversation state

Source code in `strands/agent/conversation_manager/conversation_manager.py`

```
class ConversationManager(ABC):
    """Abstract base class for managing conversation history.

    This class provides an interface for implementing conversation management strategies to control the size of message
    arrays/conversation histories, helping to:

    - Manage memory usage
    - Control context length
    - Maintain relevant conversation state
    """

    @abstractmethod
    # pragma: no cover
    def apply_management(self, agent: "Agent") -> None:
        """Applies management strategy to the provided agent.

        Processes the conversation history to maintain appropriate size by modifying the messages list in-place.
        Implementations should handle message pruning, summarization, or other size management techniques to keep the
        conversation context within desired bounds.

        Args:
            agent: The agent whose conversation history will be manage.
                This list is modified in-place.
        """
        pass

    @abstractmethod
    # pragma: no cover
    def reduce_context(self, agent: "Agent", e: Optional[Exception] = None) -> None:
        """Called when the model's context window is exceeded.

        This method should implement the specific strategy for reducing the window size when a context overflow occurs.
        It is typically called after a ContextWindowOverflowException is caught.

        Implementations might use strategies such as:

        - Removing the N oldest messages
        - Summarizing older context
        - Applying importance-based filtering
        - Maintaining critical conversation markers

        Args:
            agent: The agent whose conversation history will be reduced.
                This list is modified in-place.
            e: The exception that triggered the context reduction, if any.
        """
        pass

```

##### `apply_management(agent)`

Applies management strategy to the provided agent.

Processes the conversation history to maintain appropriate size by modifying the messages list in-place. Implementations should handle message pruning, summarization, or other size management techniques to keep the conversation context within desired bounds.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `agent` | `Agent` | The agent whose conversation history will be manage. This list is modified in-place. | *required* |

Source code in `strands/agent/conversation_manager/conversation_manager.py`

```
@abstractmethod
# pragma: no cover
def apply_management(self, agent: "Agent") -> None:
    """Applies management strategy to the provided agent.

    Processes the conversation history to maintain appropriate size by modifying the messages list in-place.
    Implementations should handle message pruning, summarization, or other size management techniques to keep the
    conversation context within desired bounds.

    Args:
        agent: The agent whose conversation history will be manage.
            This list is modified in-place.
    """
    pass

```

##### `reduce_context(agent, e=None)`

Called when the model's context window is exceeded.

This method should implement the specific strategy for reducing the window size when a context overflow occurs. It is typically called after a ContextWindowOverflowException is caught.

Implementations might use strategies such as:

- Removing the N oldest messages
- Summarizing older context
- Applying importance-based filtering
- Maintaining critical conversation markers

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `agent` | `Agent` | The agent whose conversation history will be reduced. This list is modified in-place. | *required* | | `e` | `Optional[Exception]` | The exception that triggered the context reduction, if any. | `None` |

Source code in `strands/agent/conversation_manager/conversation_manager.py`

```
@abstractmethod
# pragma: no cover
def reduce_context(self, agent: "Agent", e: Optional[Exception] = None) -> None:
    """Called when the model's context window is exceeded.

    This method should implement the specific strategy for reducing the window size when a context overflow occurs.
    It is typically called after a ContextWindowOverflowException is caught.

    Implementations might use strategies such as:

    - Removing the N oldest messages
    - Summarizing older context
    - Applying importance-based filtering
    - Maintaining critical conversation markers

    Args:
        agent: The agent whose conversation history will be reduced.
            This list is modified in-place.
        e: The exception that triggered the context reduction, if any.
    """
    pass

```

### `strands.agent.conversation_manager.null_conversation_manager`

Null implementation of conversation management.

#### `NullConversationManager`

Bases: `ConversationManager`

A no-op conversation manager that does not modify the conversation history.

Useful for:

- Testing scenarios where conversation management should be disabled
- Cases where conversation history is managed externally
- Situations where the full conversation history should be preserved

Source code in `strands/agent/conversation_manager/null_conversation_manager.py`

```
class NullConversationManager(ConversationManager):
    """A no-op conversation manager that does not modify the conversation history.

    Useful for:

    - Testing scenarios where conversation management should be disabled
    - Cases where conversation history is managed externally
    - Situations where the full conversation history should be preserved
    """

    def apply_management(self, _agent: "Agent") -> None:
        """Does nothing to the conversation history.

        Args:
            agent: The agent whose conversation history will remain unmodified.
        """
        pass

    def reduce_context(self, _agent: "Agent", e: Optional[Exception] = None) -> None:
        """Does not reduce context and raises an exception.

        Args:
            agent: The agent whose conversation history will remain unmodified.
            e: The exception that triggered the context reduction, if any.

        Raises:
            e: If provided.
            ContextWindowOverflowException: If e is None.
        """
        if e:
            raise e
        else:
            raise ContextWindowOverflowException("Context window overflowed!")

```

##### `apply_management(_agent)`

Does nothing to the conversation history.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `agent` | | The agent whose conversation history will remain unmodified. | *required* |

Source code in `strands/agent/conversation_manager/null_conversation_manager.py`

```
def apply_management(self, _agent: "Agent") -> None:
    """Does nothing to the conversation history.

    Args:
        agent: The agent whose conversation history will remain unmodified.
    """
    pass

```

##### `reduce_context(_agent, e=None)`

Does not reduce context and raises an exception.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `agent` | | The agent whose conversation history will remain unmodified. | *required* | | `e` | `Optional[Exception]` | The exception that triggered the context reduction, if any. | `None` |

Raises:

| Type | Description | | --- | --- | | `e` | If provided. | | `ContextWindowOverflowException` | If e is None. |

Source code in `strands/agent/conversation_manager/null_conversation_manager.py`

```
def reduce_context(self, _agent: "Agent", e: Optional[Exception] = None) -> None:
    """Does not reduce context and raises an exception.

    Args:
        agent: The agent whose conversation history will remain unmodified.
        e: The exception that triggered the context reduction, if any.

    Raises:
        e: If provided.
        ContextWindowOverflowException: If e is None.
    """
    if e:
        raise e
    else:
        raise ContextWindowOverflowException("Context window overflowed!")

```

### `strands.agent.conversation_manager.sliding_window_conversation_manager`

Sliding window conversation history management.

#### `SlidingWindowConversationManager`

Bases: `ConversationManager`

Implements a sliding window strategy for managing conversation history.

This class handles the logic of maintaining a conversation window that preserves tool usage pairs and avoids invalid window states.

Source code in `strands/agent/conversation_manager/sliding_window_conversation_manager.py`

```
class SlidingWindowConversationManager(ConversationManager):
    """Implements a sliding window strategy for managing conversation history.

    This class handles the logic of maintaining a conversation window that preserves tool usage pairs and avoids
    invalid window states.
    """

    def __init__(self, window_size: int = 40):
        """Initialize the sliding window conversation manager.

        Args:
            window_size: Maximum number of messages to keep in the agent's history.
                Defaults to 40 messages.
        """
        self.window_size = window_size

    def apply_management(self, agent: "Agent") -> None:
        """Apply the sliding window to the agent's messages array to maintain a manageable history size.

        This method is called after every event loop cycle, as the messages array may have been modified with tool
        results and assistant responses. It first removes any dangling messages that might create an invalid
        conversation state, then applies the sliding window if the message count exceeds the window size.

        Special handling is implemented to ensure we don't leave a user message with toolResult
        as the first message in the array. It also ensures that all toolUse blocks have corresponding toolResult
        blocks to maintain conversation coherence.

        Args:
            agent: The agent whose messages will be managed.
                This list is modified in-place.
        """
        messages = agent.messages
        self._remove_dangling_messages(messages)

        if len(messages) <= self.window_size:
            logger.debug(
                "window_size=<%s>, message_count=<%s> | skipping context reduction", len(messages), self.window_size
            )
            return
        self.reduce_context(agent)

    def _remove_dangling_messages(self, messages: Messages) -> None:
        """Remove dangling messages that would create an invalid conversation state.

        After the event loop cycle is executed, we expect the messages array to end with either an assistant tool use
        request followed by the pairing user tool result or an assistant response with no tool use request. If the
        event loop cycle fails, we may end up in an invalid message state, and so this method will remove problematic
        messages from the end of the array.

        This method handles two specific cases:

        - User with no tool result: Indicates that event loop failed to generate an assistant tool use request
        - Assistant with tool use request: Indicates that event loop failed to generate a pairing user tool result

        Args:
            messages: The messages to clean up.
                This list is modified in-place.
        """
        # remove any dangling user messages with no ToolResult
        if len(messages) > 0 and is_user_message(messages[-1]):
            if not any("toolResult" in content for content in messages[-1]["content"]):
                messages.pop()

        # remove any dangling assistant messages with ToolUse
        if len(messages) > 0 and is_assistant_message(messages[-1]):
            if any("toolUse" in content for content in messages[-1]["content"]):
                messages.pop()
                # remove remaining dangling user messages with no ToolResult after we popped off an assistant message
                if len(messages) > 0 and is_user_message(messages[-1]):
                    if not any("toolResult" in content for content in messages[-1]["content"]):
                        messages.pop()

    def reduce_context(self, agent: "Agent", e: Optional[Exception] = None) -> None:
        """Trim the oldest messages to reduce the conversation context size.

        The method handles special cases where trimming the messages leads to:
         - toolResult with no corresponding toolUse
         - toolUse with no corresponding toolResult

        Args:
            agent: The agent whose messages will be reduce.
                This list is modified in-place.
            e: The exception that triggered the context reduction, if any.

        Raises:
            ContextWindowOverflowException: If the context cannot be reduced further.
                Such as when the conversation is already minimal or when tool result messages cannot be properly
                converted.
        """
        messages = agent.messages
        # If the number of messages is less than the window_size, then we default to 2, otherwise, trim to window size
        trim_index = 2 if len(messages) <= self.window_size else len(messages) - self.window_size

        # Find the next valid trim_index
        while trim_index < len(messages):
            if (
                # Oldest message cannot be a toolResult because it needs a toolUse preceding it
                any("toolResult" in content for content in messages[trim_index]["content"])
                or (
                    # Oldest message can be a toolUse only if a toolResult immediately follows it.
                    any("toolUse" in content for content in messages[trim_index]["content"])
                    and trim_index + 1 < len(messages)
                    and not any("toolResult" in content for content in messages[trim_index + 1]["content"])
                )
            ):
                trim_index += 1
            else:
                break
        else:
            # If we didn't find a valid trim_index, then we throw
            raise ContextWindowOverflowException("Unable to trim conversation context!") from e

        # Overwrite message history
        messages[:] = messages[trim_index:]

```

##### `__init__(window_size=40)`

Initialize the sliding window conversation manager.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `window_size` | `int` | Maximum number of messages to keep in the agent's history. Defaults to 40 messages. | `40` |

Source code in `strands/agent/conversation_manager/sliding_window_conversation_manager.py`

```
def __init__(self, window_size: int = 40):
    """Initialize the sliding window conversation manager.

    Args:
        window_size: Maximum number of messages to keep in the agent's history.
            Defaults to 40 messages.
    """
    self.window_size = window_size

```

##### `apply_management(agent)`

Apply the sliding window to the agent's messages array to maintain a manageable history size.

This method is called after every event loop cycle, as the messages array may have been modified with tool results and assistant responses. It first removes any dangling messages that might create an invalid conversation state, then applies the sliding window if the message count exceeds the window size.

Special handling is implemented to ensure we don't leave a user message with toolResult as the first message in the array. It also ensures that all toolUse blocks have corresponding toolResult blocks to maintain conversation coherence.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `agent` | `Agent` | The agent whose messages will be managed. This list is modified in-place. | *required* |

Source code in `strands/agent/conversation_manager/sliding_window_conversation_manager.py`

```
def apply_management(self, agent: "Agent") -> None:
    """Apply the sliding window to the agent's messages array to maintain a manageable history size.

    This method is called after every event loop cycle, as the messages array may have been modified with tool
    results and assistant responses. It first removes any dangling messages that might create an invalid
    conversation state, then applies the sliding window if the message count exceeds the window size.

    Special handling is implemented to ensure we don't leave a user message with toolResult
    as the first message in the array. It also ensures that all toolUse blocks have corresponding toolResult
    blocks to maintain conversation coherence.

    Args:
        agent: The agent whose messages will be managed.
            This list is modified in-place.
    """
    messages = agent.messages
    self._remove_dangling_messages(messages)

    if len(messages) <= self.window_size:
        logger.debug(
            "window_size=<%s>, message_count=<%s> | skipping context reduction", len(messages), self.window_size
        )
        return
    self.reduce_context(agent)

```

##### `reduce_context(agent, e=None)`

Trim the oldest messages to reduce the conversation context size.

The method handles special cases where trimming the messages leads to

- toolResult with no corresponding toolUse
- toolUse with no corresponding toolResult

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `agent` | `Agent` | The agent whose messages will be reduce. This list is modified in-place. | *required* | | `e` | `Optional[Exception]` | The exception that triggered the context reduction, if any. | `None` |

Raises:

| Type | Description | | --- | --- | | `ContextWindowOverflowException` | If the context cannot be reduced further. Such as when the conversation is already minimal or when tool result messages cannot be properly converted. |

Source code in `strands/agent/conversation_manager/sliding_window_conversation_manager.py`

```
def reduce_context(self, agent: "Agent", e: Optional[Exception] = None) -> None:
    """Trim the oldest messages to reduce the conversation context size.

    The method handles special cases where trimming the messages leads to:
     - toolResult with no corresponding toolUse
     - toolUse with no corresponding toolResult

    Args:
        agent: The agent whose messages will be reduce.
            This list is modified in-place.
        e: The exception that triggered the context reduction, if any.

    Raises:
        ContextWindowOverflowException: If the context cannot be reduced further.
            Such as when the conversation is already minimal or when tool result messages cannot be properly
            converted.
    """
    messages = agent.messages
    # If the number of messages is less than the window_size, then we default to 2, otherwise, trim to window size
    trim_index = 2 if len(messages) <= self.window_size else len(messages) - self.window_size

    # Find the next valid trim_index
    while trim_index < len(messages):
        if (
            # Oldest message cannot be a toolResult because it needs a toolUse preceding it
            any("toolResult" in content for content in messages[trim_index]["content"])
            or (
                # Oldest message can be a toolUse only if a toolResult immediately follows it.
                any("toolUse" in content for content in messages[trim_index]["content"])
                and trim_index + 1 < len(messages)
                and not any("toolResult" in content for content in messages[trim_index + 1]["content"])
            )
        ):
            trim_index += 1
        else:
            break
    else:
        # If we didn't find a valid trim_index, then we throw
        raise ContextWindowOverflowException("Unable to trim conversation context!") from e

    # Overwrite message history
    messages[:] = messages[trim_index:]

```

#### `is_assistant_message(message)`

Check if a message is from an assistant.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `message` | `Message` | The message object to check. | *required* |

Returns:

| Type | Description | | --- | --- | | `bool` | True if the message has the assistant role, False otherwise. |

Source code in `strands/agent/conversation_manager/sliding_window_conversation_manager.py`

```
def is_assistant_message(message: Message) -> bool:
    """Check if a message is from an assistant.

    Args:
        message: The message object to check.

    Returns:
        True if the message has the assistant role, False otherwise.
    """
    return message["role"] == "assistant"

```

#### `is_user_message(message)`

Check if a message is from a user.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `message` | `Message` | The message object to check. | *required* |

Returns:

| Type | Description | | --- | --- | | `bool` | True if the message has the user role, False otherwise. |

Source code in `strands/agent/conversation_manager/sliding_window_conversation_manager.py`

```
def is_user_message(message: Message) -> bool:
    """Check if a message is from a user.

    Args:
        message: The message object to check.

    Returns:
        True if the message has the user role, False otherwise.
    """
    return message["role"] == "user"

```
