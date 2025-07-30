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
            It matches underscore-separated names to hyphenated tool names (e.g., 'some_thing' matches 'some-thing').

            Args:
                name: The name of the attribute (tool) being accessed.

            Returns:
                A function that when called will execute the named tool.

            Raises:
                AttributeError: If no tool with the given name exists or if multiple tools match the given name.
            """

            def caller(
                user_message_override: Optional[str] = None,
                record_direct_tool_call: Optional[bool] = None,
                **kwargs: Any,
            ) -> Any:
                """Call a tool directly by name.

                Args:
                    user_message_override: Optional custom message to record instead of default
                    record_direct_tool_call: Whether to record direct tool calls in message history. Overrides class
                        attribute if provided.
                    **kwargs: Keyword arguments to pass to the tool.

                Returns:
                    The result returned by the tool.

                Raises:
                    AttributeError: If the tool doesn't exist.
                """
                normalized_name = self._find_normalized_tool_name(name)

                # Create unique tool ID and set up the tool request
                tool_id = f"tooluse_{name}_{random.randint(100000000, 999999999)}"
                tool_use: ToolUse = {
                    "toolUseId": tool_id,
                    "name": normalized_name,
                    "input": kwargs.copy(),
                }

                async def acall() -> ToolResult:
                    # Pass kwargs as invocation_state
                    async for event in run_tool(self._agent, tool_use, kwargs):
                        _ = event

                    return cast(ToolResult, event)

                def tcall() -> ToolResult:
                    return asyncio.run(acall())

                with ThreadPoolExecutor() as executor:
                    future = executor.submit(tcall)
                    tool_result = future.result()

                if record_direct_tool_call is not None:
                    should_record_direct_tool_call = record_direct_tool_call
                else:
                    should_record_direct_tool_call = self._agent.record_direct_tool_call

                if should_record_direct_tool_call:
                    # Create a record of this tool execution in the message history
                    self._agent._record_tool_execution(tool_use, tool_result, user_message_override)

                # Apply window management
                self._agent.conversation_manager.apply_management(self._agent)

                return tool_result

            return caller

        def _find_normalized_tool_name(self, name: str) -> str:
            """Lookup the tool represented by name, replacing characters with underscores as necessary."""
            tool_registry = self._agent.tool_registry.registry

            if tool_registry.get(name, None):
                return name

            # If the desired name contains underscores, it might be a placeholder for characters that can't be
            # represented as python identifiers but are valid as tool names, such as dashes. In that case, find
            # all tools that can be represented with the normalized name
            if "_" in name:
                filtered_tools = [
                    tool_name for (tool_name, tool) in tool_registry.items() if tool_name.replace("-", "_") == name
                ]

                # The registry itself defends against similar names, so we can just take the first match
                if filtered_tools:
                    return filtered_tools[0]

            raise AttributeError(f"Tool '{name}' not found")

    def __init__(
        self,
        model: Union[Model, str, None] = None,
        messages: Optional[Messages] = None,
        tools: Optional[list[Union[str, dict[str, str], Any]]] = None,
        system_prompt: Optional[str] = None,
        callback_handler: Optional[
            Union[Callable[..., Any], _DefaultCallbackHandlerSentinel]
        ] = _DEFAULT_CALLBACK_HANDLER,
        conversation_manager: Optional[ConversationManager] = None,
        record_direct_tool_call: bool = True,
        load_tools_from_directory: bool = False,
        trace_attributes: Optional[Mapping[str, AttributeValue]] = None,
        *,
        agent_id: Optional[str] = None,
        name: Optional[str] = None,
        description: Optional[str] = None,
        state: Optional[Union[AgentState, dict]] = None,
        hooks: Optional[list[HookProvider]] = None,
        session_manager: Optional[SessionManager] = None,
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
            record_direct_tool_call: Whether to record direct tool calls in message history.
                Defaults to True.
            load_tools_from_directory: Whether to load and automatically reload tools in the `./tools/` directory.
                Defaults to False.
            trace_attributes: Custom trace attributes to apply to the agent's trace span.
            agent_id: Optional ID for the agent, useful for session management and multi-agent scenarios.
                Defaults to "default".
            name: name of the Agent
                Defaults to "Strands Agents".
            description: description of what the Agent does
                Defaults to None.
            state: stateful information for the agent. Can be either an AgentState object, or a json serializable dict.
                Defaults to an empty AgentState object.
            hooks: hooks to be added to the agent hook registry
                Defaults to None.
            session_manager: Manager for handling agent sessions including conversation history and state.
                If provided, enables session-based persistence and state management.
        """
        self.model = BedrockModel() if not model else BedrockModel(model_id=model) if isinstance(model, str) else model
        self.messages = messages if messages is not None else []

        self.system_prompt = system_prompt
        self.agent_id = agent_id or _DEFAULT_AGENT_ID
        self.name = name or _DEFAULT_AGENT_NAME
        self.description = description

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
        self.trace_attributes: dict[str, AttributeValue] = {}
        if trace_attributes:
            for k, v in trace_attributes.items():
                if isinstance(v, (str, int, float, bool)) or (
                    isinstance(v, list) and all(isinstance(x, (str, int, float, bool)) for x in v)
                ):
                    self.trace_attributes[k] = v

        self.record_direct_tool_call = record_direct_tool_call
        self.load_tools_from_directory = load_tools_from_directory

        self.tool_registry = ToolRegistry()

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
        self.trace_span: Optional[trace_api.Span] = None

        # Initialize agent state management
        if state is not None:
            if isinstance(state, dict):
                self.state = AgentState(state)
            elif isinstance(state, AgentState):
                self.state = state
            else:
                raise ValueError("state must be an AgentState object or a dict")
        else:
            self.state = AgentState()

        self.tool_caller = Agent.ToolCaller(self)

        self.hooks = HookRegistry()

        # Initialize session management functionality
        self._session_manager = session_manager
        if self._session_manager:
            self.hooks.add_hook(self._session_manager)

        if hooks:
            for hook in hooks:
                self.hooks.add_hook(hook)
        self.hooks.invoke_callbacks(AgentInitializedEvent(agent=self))

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
    def tool_names(self) -> list[str]:
        """Get a list of all registered tool names.

        Returns:
            Names of all tools available to this agent.
        """
        all_tools = self.tool_registry.get_all_tools_config()
        return list(all_tools.keys())

    def __call__(self, prompt: Union[str, list[ContentBlock]], **kwargs: Any) -> AgentResult:
        """Process a natural language prompt through the agent's event loop.

        This method implements the conversational interface (e.g., `agent("hello!")`). It adds the user's prompt to
        the conversation history, processes it through the model, executes any tool calls, and returns the final result.

        Args:
            prompt: User input as text or list of ContentBlock objects for multi-modal content.
            **kwargs: Additional parameters to pass through the event loop.

        Returns:
            Result object containing:

                - stop_reason: Why the event loop stopped (e.g., "end_turn", "max_tokens")
                - message: The final message from the model
                - metrics: Performance metrics from the event loop
                - state: The final state of the event loop
        """

        def execute() -> AgentResult:
            return asyncio.run(self.invoke_async(prompt, **kwargs))

        with ThreadPoolExecutor() as executor:
            future = executor.submit(execute)
            return future.result()

    async def invoke_async(self, prompt: Union[str, list[ContentBlock]], **kwargs: Any) -> AgentResult:
        """Process a natural language prompt through the agent's event loop.

        This method implements the conversational interface (e.g., `agent("hello!")`). It adds the user's prompt to
        the conversation history, processes it through the model, executes any tool calls, and returns the final result.

        Args:
            prompt: User input as text or list of ContentBlock objects for multi-modal content.
            **kwargs: Additional parameters to pass through the event loop.

        Returns:
            Result object containing:

                - stop_reason: Why the event loop stopped (e.g., "end_turn", "max_tokens")
                - message: The final message from the model
                - metrics: Performance metrics from the event loop
                - state: The final state of the event loop
        """
        events = self.stream_async(prompt, **kwargs)
        async for event in events:
            _ = event

        return cast(AgentResult, event["result"])

    def structured_output(self, output_model: Type[T], prompt: Optional[Union[str, list[ContentBlock]]] = None) -> T:
        """This method allows you to get structured output from the agent.

        If you pass in a prompt, it will be added to the conversation history and the agent will respond to it.
        If you don't pass in a prompt, it will use only the conversation history to respond.

        For smaller models, you may want to use the optional prompt to add additional instructions to explicitly
        instruct the model to output the structured data.

        Args:
            output_model: The output model (a JSON schema written as a Pydantic BaseModel)
                that the agent will use when responding.
            prompt: The prompt to use for the agent.

        Raises:
            ValueError: If no conversation history or prompt is provided.
        """

        def execute() -> T:
            return asyncio.run(self.structured_output_async(output_model, prompt))

        with ThreadPoolExecutor() as executor:
            future = executor.submit(execute)
            return future.result()

    async def structured_output_async(
        self, output_model: Type[T], prompt: Optional[Union[str, list[ContentBlock]]] = None
    ) -> T:
        """This method allows you to get structured output from the agent.

        If you pass in a prompt, it will be added to the conversation history and the agent will respond to it.
        If you don't pass in a prompt, it will use only the conversation history to respond.

        For smaller models, you may want to use the optional prompt to add additional instructions to explicitly
        instruct the model to output the structured data.

        Args:
            output_model: The output model (a JSON schema written as a Pydantic BaseModel)
                that the agent will use when responding.
            prompt: The prompt to use for the agent.

        Raises:
            ValueError: If no conversation history or prompt is provided.
        """
        self.hooks.invoke_callbacks(BeforeInvocationEvent(agent=self))

        try:
            if not self.messages and not prompt:
                raise ValueError("No conversation history or prompt provided")

            # add the prompt as the last message
            if prompt:
                content: list[ContentBlock] = [{"text": prompt}] if isinstance(prompt, str) else prompt
                self._append_message({"role": "user", "content": content})

            events = self.model.structured_output(output_model, self.messages, system_prompt=self.system_prompt)
            async for event in events:
                if "callback" in event:
                    self.callback_handler(**cast(dict, event["callback"]))

            return event["output"]

        finally:
            self.hooks.invoke_callbacks(AfterInvocationEvent(agent=self))

    async def stream_async(self, prompt: Union[str, list[ContentBlock]], **kwargs: Any) -> AsyncIterator[Any]:
        """Process a natural language prompt and yield events as an async iterator.

        This method provides an asynchronous interface for streaming agent events, allowing
        consumers to process stream events programmatically through an async iterator pattern
        rather than callback functions. This is particularly useful for web servers and other
        async environments.

        Args:
            prompt: User input as text or list of ContentBlock objects for multi-modal content.
            **kwargs: Additional parameters to pass to the event loop.

        Yields:
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
        callback_handler = kwargs.get("callback_handler", self.callback_handler)

        content: list[ContentBlock] = [{"text": prompt}] if isinstance(prompt, str) else prompt
        message: Message = {"role": "user", "content": content}

        self.trace_span = self._start_agent_trace_span(message)
        with trace_api.use_span(self.trace_span):
            try:
                events = self._run_loop(message, invocation_state=kwargs)
                async for event in events:
                    if "callback" in event:
                        callback_handler(**event["callback"])
                        yield event["callback"]

                result = AgentResult(*event["stop"])
                callback_handler(result=result)
                yield {"result": result}

                self._end_agent_trace_span(response=result)

            except Exception as e:
                self._end_agent_trace_span(error=e)
                raise

    async def _run_loop(
        self, message: Message, invocation_state: dict[str, Any]
    ) -> AsyncGenerator[dict[str, Any], None]:
        """Execute the agent's event loop with the given message and parameters.

        Args:
            message: The user message to add to the conversation.
            invocation_state: Additional parameters to pass to the event loop.

        Yields:
            Events from the event loop cycle.
        """
        self.hooks.invoke_callbacks(BeforeInvocationEvent(agent=self))

        try:
            yield {"callback": {"init_event_loop": True, **invocation_state}}

            self._append_message(message)

            # Execute the event loop cycle with retry logic for context limits
            events = self._execute_event_loop_cycle(invocation_state)
            async for event in events:
                # Signal from the model provider that the message sent by the user should be redacted,
                # likely due to a guardrail.
                if (
                    event.get("callback")
                    and event["callback"].get("event")
                    and event["callback"]["event"].get("redactContent")
                    and event["callback"]["event"]["redactContent"].get("redactUserContentMessage")
                ):
                    self.messages[-1]["content"] = [
                        {"text": event["callback"]["event"]["redactContent"]["redactUserContentMessage"]}
                    ]
                    if self._session_manager:
                        self._session_manager.redact_latest_message(self.messages[-1], self)
                yield event

        finally:
            self.conversation_manager.apply_management(self)
            self.hooks.invoke_callbacks(AfterInvocationEvent(agent=self))

    async def _execute_event_loop_cycle(self, invocation_state: dict[str, Any]) -> AsyncGenerator[dict[str, Any], None]:
        """Execute the event loop cycle with retry logic for context window limits.

        This internal method handles the execution of the event loop cycle and implements
        retry logic for handling context window overflow exceptions by reducing the
        conversation context and retrying.

        Yields:
            Events of the loop cycle.
        """
        # Add `Agent` to invocation_state to keep backwards-compatibility
        invocation_state["agent"] = self

        try:
            # Execute the main event loop cycle
            events = event_loop_cycle(
                agent=self,
                invocation_state=invocation_state,
            )
            async for event in events:
                yield event

        except ContextWindowOverflowException as e:
            # Try reducing the context size and retrying
            self.conversation_manager.reduce_context(self, e=e)

            # Sync agent after reduce_context to keep conversation_manager_state up to date in the session
            if self._session_manager:
                self._session_manager.sync_agent(self)

            events = self._execute_event_loop_cycle(invocation_state)
            async for event in events:
                yield event

    def _record_tool_execution(
        self,
        tool: ToolUse,
        tool_result: ToolResult,
        user_message_override: Optional[str],
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
        """
        # Create user message describing the tool call
        input_parameters = json.dumps(tool["input"], default=lambda o: f"<<non-serializable: {type(o).__qualname__}>>")

        user_msg_content: list[ContentBlock] = [
            {"text": (f"agent.tool.{tool['name']} direct tool call.\nInput parameters: {input_parameters}\n")}
        ]

        # Add override message if provided
        if user_message_override:
            user_msg_content.insert(0, {"text": f"{user_message_override}\n"})

        # Create the message sequence
        user_msg: Message = {
            "role": "user",
            "content": user_msg_content,
        }
        tool_use_msg: Message = {
            "role": "assistant",
            "content": [{"toolUse": tool}],
        }
        tool_result_msg: Message = {
            "role": "user",
            "content": [{"toolResult": tool_result}],
        }
        assistant_msg: Message = {
            "role": "assistant",
            "content": [{"text": f"agent.tool.{tool['name']} was called."}],
        }

        # Add to message history
        self._append_message(user_msg)
        self._append_message(tool_use_msg)
        self._append_message(tool_result_msg)
        self._append_message(assistant_msg)

    def _start_agent_trace_span(self, message: Message) -> trace_api.Span:
        """Starts a trace span for the agent.

        Args:
            message: The user message.
        """
        model_id = self.model.config.get("model_id") if hasattr(self.model, "config") else None
        return self.tracer.start_agent_span(
            message=message,
            agent_name=self.name,
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
            trace_attributes: dict[str, Any] = {
                "span": self.trace_span,
            }

            if response:
                trace_attributes["response"] = response
            if error:
                trace_attributes["error"] = error

            self.tracer.end_agent_span(**trace_attributes)

    def _append_message(self, message: Message) -> None:
        """Appends a message to the agent's list of messages and invokes the callbacks for the MessageCreatedEvent."""
        self.messages.append(message)
        self.hooks.invoke_callbacks(MessageAddedEvent(agent=self, message=message))

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

#### `tool_names`

Get a list of all registered tool names.

Returns:

| Type | Description | | --- | --- | | `list[str]` | Names of all tools available to this agent. |

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
        It matches underscore-separated names to hyphenated tool names (e.g., 'some_thing' matches 'some-thing').

        Args:
            name: The name of the attribute (tool) being accessed.

        Returns:
            A function that when called will execute the named tool.

        Raises:
            AttributeError: If no tool with the given name exists or if multiple tools match the given name.
        """

        def caller(
            user_message_override: Optional[str] = None,
            record_direct_tool_call: Optional[bool] = None,
            **kwargs: Any,
        ) -> Any:
            """Call a tool directly by name.

            Args:
                user_message_override: Optional custom message to record instead of default
                record_direct_tool_call: Whether to record direct tool calls in message history. Overrides class
                    attribute if provided.
                **kwargs: Keyword arguments to pass to the tool.

            Returns:
                The result returned by the tool.

            Raises:
                AttributeError: If the tool doesn't exist.
            """
            normalized_name = self._find_normalized_tool_name(name)

            # Create unique tool ID and set up the tool request
            tool_id = f"tooluse_{name}_{random.randint(100000000, 999999999)}"
            tool_use: ToolUse = {
                "toolUseId": tool_id,
                "name": normalized_name,
                "input": kwargs.copy(),
            }

            async def acall() -> ToolResult:
                # Pass kwargs as invocation_state
                async for event in run_tool(self._agent, tool_use, kwargs):
                    _ = event

                return cast(ToolResult, event)

            def tcall() -> ToolResult:
                return asyncio.run(acall())

            with ThreadPoolExecutor() as executor:
                future = executor.submit(tcall)
                tool_result = future.result()

            if record_direct_tool_call is not None:
                should_record_direct_tool_call = record_direct_tool_call
            else:
                should_record_direct_tool_call = self._agent.record_direct_tool_call

            if should_record_direct_tool_call:
                # Create a record of this tool execution in the message history
                self._agent._record_tool_execution(tool_use, tool_result, user_message_override)

            # Apply window management
            self._agent.conversation_manager.apply_management(self._agent)

            return tool_result

        return caller

    def _find_normalized_tool_name(self, name: str) -> str:
        """Lookup the tool represented by name, replacing characters with underscores as necessary."""
        tool_registry = self._agent.tool_registry.registry

        if tool_registry.get(name, None):
            return name

        # If the desired name contains underscores, it might be a placeholder for characters that can't be
        # represented as python identifiers but are valid as tool names, such as dashes. In that case, find
        # all tools that can be represented with the normalized name
        if "_" in name:
            filtered_tools = [
                tool_name for (tool_name, tool) in tool_registry.items() if tool_name.replace("-", "_") == name
            ]

            # The registry itself defends against similar names, so we can just take the first match
            if filtered_tools:
                return filtered_tools[0]

        raise AttributeError(f"Tool '{name}' not found")

```

##### `__getattr__(name)`

Call tool as a function.

This method enables the method-style interface (e.g., `agent.tool.tool_name(param="value")`). It matches underscore-separated names to hyphenated tool names (e.g., 'some_thing' matches 'some-thing').

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `name` | `str` | The name of the attribute (tool) being accessed. | *required* |

Returns:

| Type | Description | | --- | --- | | `Callable[..., Any]` | A function that when called will execute the named tool. |

Raises:

| Type | Description | | --- | --- | | `AttributeError` | If no tool with the given name exists or if multiple tools match the given name. |

Source code in `strands/agent/agent.py`

```
def __getattr__(self, name: str) -> Callable[..., Any]:
    """Call tool as a function.

    This method enables the method-style interface (e.g., `agent.tool.tool_name(param="value")`).
    It matches underscore-separated names to hyphenated tool names (e.g., 'some_thing' matches 'some-thing').

    Args:
        name: The name of the attribute (tool) being accessed.

    Returns:
        A function that when called will execute the named tool.

    Raises:
        AttributeError: If no tool with the given name exists or if multiple tools match the given name.
    """

    def caller(
        user_message_override: Optional[str] = None,
        record_direct_tool_call: Optional[bool] = None,
        **kwargs: Any,
    ) -> Any:
        """Call a tool directly by name.

        Args:
            user_message_override: Optional custom message to record instead of default
            record_direct_tool_call: Whether to record direct tool calls in message history. Overrides class
                attribute if provided.
            **kwargs: Keyword arguments to pass to the tool.

        Returns:
            The result returned by the tool.

        Raises:
            AttributeError: If the tool doesn't exist.
        """
        normalized_name = self._find_normalized_tool_name(name)

        # Create unique tool ID and set up the tool request
        tool_id = f"tooluse_{name}_{random.randint(100000000, 999999999)}"
        tool_use: ToolUse = {
            "toolUseId": tool_id,
            "name": normalized_name,
            "input": kwargs.copy(),
        }

        async def acall() -> ToolResult:
            # Pass kwargs as invocation_state
            async for event in run_tool(self._agent, tool_use, kwargs):
                _ = event

            return cast(ToolResult, event)

        def tcall() -> ToolResult:
            return asyncio.run(acall())

        with ThreadPoolExecutor() as executor:
            future = executor.submit(tcall)
            tool_result = future.result()

        if record_direct_tool_call is not None:
            should_record_direct_tool_call = record_direct_tool_call
        else:
            should_record_direct_tool_call = self._agent.record_direct_tool_call

        if should_record_direct_tool_call:
            # Create a record of this tool execution in the message history
            self._agent._record_tool_execution(tool_use, tool_result, user_message_override)

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

| Name | Type | Description | Default | | --- | --- | --- | --- | | `prompt` | `Union[str, list[ContentBlock]]` | User input as text or list of ContentBlock objects for multi-modal content. | *required* | | `**kwargs` | `Any` | Additional parameters to pass through the event loop. | `{}` |

Returns:

| Type | Description | | --- | --- | | `AgentResult` | Result object containing: stop_reason: Why the event loop stopped (e.g., "end_turn", "max_tokens") message: The final message from the model metrics: Performance metrics from the event loop state: The final state of the event loop |

Source code in `strands/agent/agent.py`

```
def __call__(self, prompt: Union[str, list[ContentBlock]], **kwargs: Any) -> AgentResult:
    """Process a natural language prompt through the agent's event loop.

    This method implements the conversational interface (e.g., `agent("hello!")`). It adds the user's prompt to
    the conversation history, processes it through the model, executes any tool calls, and returns the final result.

    Args:
        prompt: User input as text or list of ContentBlock objects for multi-modal content.
        **kwargs: Additional parameters to pass through the event loop.

    Returns:
        Result object containing:

            - stop_reason: Why the event loop stopped (e.g., "end_turn", "max_tokens")
            - message: The final message from the model
            - metrics: Performance metrics from the event loop
            - state: The final state of the event loop
    """

    def execute() -> AgentResult:
        return asyncio.run(self.invoke_async(prompt, **kwargs))

    with ThreadPoolExecutor() as executor:
        future = executor.submit(execute)
        return future.result()

```

#### `__init__(model=None, messages=None, tools=None, system_prompt=None, callback_handler=_DEFAULT_CALLBACK_HANDLER, conversation_manager=None, record_direct_tool_call=True, load_tools_from_directory=False, trace_attributes=None, *, agent_id=None, name=None, description=None, state=None, hooks=None, session_manager=None)`

Initialize the Agent with the specified configuration.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `model` | `Union[Model, str, None]` | Provider for running inference or a string representing the model-id for Bedrock to use. Defaults to strands.models.BedrockModel if None. | `None` | | `messages` | `Optional[Messages]` | List of initial messages to pre-load into the conversation. Defaults to an empty list if None. | `None` | | `tools` | `Optional[list[Union[str, dict[str, str], Any]]]` | List of tools to make available to the agent. Can be specified as: String tool names (e.g., "retrieve") File paths (e.g., "/path/to/tool.py") Imported Python modules (e.g., from strands_tools import current_time) Dictionaries with name/path keys (e.g., {"name": "tool_name", "path": "/path/to/tool.py"}) Functions decorated with @strands.tool decorator. If provided, only these tools will be available. If None, all tools will be available. | `None` | | `system_prompt` | `Optional[str]` | System prompt to guide model behavior. If None, the model will behave according to its default settings. | `None` | | `callback_handler` | `Optional[Union[Callable[..., Any], _DefaultCallbackHandlerSentinel]]` | Callback for processing events as they happen during agent execution. If not provided (using the default), a new PrintingCallbackHandler instance is created. If explicitly set to None, null_callback_handler is used. | `_DEFAULT_CALLBACK_HANDLER` | | `conversation_manager` | `Optional[ConversationManager]` | Manager for conversation history and context window. Defaults to strands.agent.conversation_manager.SlidingWindowConversationManager if None. | `None` | | `record_direct_tool_call` | `bool` | Whether to record direct tool calls in message history. Defaults to True. | `True` | | `load_tools_from_directory` | `bool` | Whether to load and automatically reload tools in the ./tools/ directory. Defaults to False. | `False` | | `trace_attributes` | `Optional[Mapping[str, AttributeValue]]` | Custom trace attributes to apply to the agent's trace span. | `None` | | `agent_id` | `Optional[str]` | Optional ID for the agent, useful for session management and multi-agent scenarios. Defaults to "default". | `None` | | `name` | `Optional[str]` | name of the Agent Defaults to "Strands Agents". | `None` | | `description` | `Optional[str]` | description of what the Agent does Defaults to None. | `None` | | `state` | `Optional[Union[AgentState, dict]]` | stateful information for the agent. Can be either an AgentState object, or a json serializable dict. Defaults to an empty AgentState object. | `None` | | `hooks` | `Optional[list[HookProvider]]` | hooks to be added to the agent hook registry Defaults to None. | `None` | | `session_manager` | `Optional[SessionManager]` | Manager for handling agent sessions including conversation history and state. If provided, enables session-based persistence and state management. | `None` |

Source code in `strands/agent/agent.py`

```
def __init__(
    self,
    model: Union[Model, str, None] = None,
    messages: Optional[Messages] = None,
    tools: Optional[list[Union[str, dict[str, str], Any]]] = None,
    system_prompt: Optional[str] = None,
    callback_handler: Optional[
        Union[Callable[..., Any], _DefaultCallbackHandlerSentinel]
    ] = _DEFAULT_CALLBACK_HANDLER,
    conversation_manager: Optional[ConversationManager] = None,
    record_direct_tool_call: bool = True,
    load_tools_from_directory: bool = False,
    trace_attributes: Optional[Mapping[str, AttributeValue]] = None,
    *,
    agent_id: Optional[str] = None,
    name: Optional[str] = None,
    description: Optional[str] = None,
    state: Optional[Union[AgentState, dict]] = None,
    hooks: Optional[list[HookProvider]] = None,
    session_manager: Optional[SessionManager] = None,
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
        record_direct_tool_call: Whether to record direct tool calls in message history.
            Defaults to True.
        load_tools_from_directory: Whether to load and automatically reload tools in the `./tools/` directory.
            Defaults to False.
        trace_attributes: Custom trace attributes to apply to the agent's trace span.
        agent_id: Optional ID for the agent, useful for session management and multi-agent scenarios.
            Defaults to "default".
        name: name of the Agent
            Defaults to "Strands Agents".
        description: description of what the Agent does
            Defaults to None.
        state: stateful information for the agent. Can be either an AgentState object, or a json serializable dict.
            Defaults to an empty AgentState object.
        hooks: hooks to be added to the agent hook registry
            Defaults to None.
        session_manager: Manager for handling agent sessions including conversation history and state.
            If provided, enables session-based persistence and state management.
    """
    self.model = BedrockModel() if not model else BedrockModel(model_id=model) if isinstance(model, str) else model
    self.messages = messages if messages is not None else []

    self.system_prompt = system_prompt
    self.agent_id = agent_id or _DEFAULT_AGENT_ID
    self.name = name or _DEFAULT_AGENT_NAME
    self.description = description

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
    self.trace_attributes: dict[str, AttributeValue] = {}
    if trace_attributes:
        for k, v in trace_attributes.items():
            if isinstance(v, (str, int, float, bool)) or (
                isinstance(v, list) and all(isinstance(x, (str, int, float, bool)) for x in v)
            ):
                self.trace_attributes[k] = v

    self.record_direct_tool_call = record_direct_tool_call
    self.load_tools_from_directory = load_tools_from_directory

    self.tool_registry = ToolRegistry()

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
    self.trace_span: Optional[trace_api.Span] = None

    # Initialize agent state management
    if state is not None:
        if isinstance(state, dict):
            self.state = AgentState(state)
        elif isinstance(state, AgentState):
            self.state = state
        else:
            raise ValueError("state must be an AgentState object or a dict")
    else:
        self.state = AgentState()

    self.tool_caller = Agent.ToolCaller(self)

    self.hooks = HookRegistry()

    # Initialize session management functionality
    self._session_manager = session_manager
    if self._session_manager:
        self.hooks.add_hook(self._session_manager)

    if hooks:
        for hook in hooks:
            self.hooks.add_hook(hook)
    self.hooks.invoke_callbacks(AgentInitializedEvent(agent=self))

```

#### `invoke_async(prompt, **kwargs)`

Process a natural language prompt through the agent's event loop.

This method implements the conversational interface (e.g., `agent("hello!")`). It adds the user's prompt to the conversation history, processes it through the model, executes any tool calls, and returns the final result.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `prompt` | `Union[str, list[ContentBlock]]` | User input as text or list of ContentBlock objects for multi-modal content. | *required* | | `**kwargs` | `Any` | Additional parameters to pass through the event loop. | `{}` |

Returns:

| Type | Description | | --- | --- | | `AgentResult` | Result object containing: stop_reason: Why the event loop stopped (e.g., "end_turn", "max_tokens") message: The final message from the model metrics: Performance metrics from the event loop state: The final state of the event loop |

Source code in `strands/agent/agent.py`

```
async def invoke_async(self, prompt: Union[str, list[ContentBlock]], **kwargs: Any) -> AgentResult:
    """Process a natural language prompt through the agent's event loop.

    This method implements the conversational interface (e.g., `agent("hello!")`). It adds the user's prompt to
    the conversation history, processes it through the model, executes any tool calls, and returns the final result.

    Args:
        prompt: User input as text or list of ContentBlock objects for multi-modal content.
        **kwargs: Additional parameters to pass through the event loop.

    Returns:
        Result object containing:

            - stop_reason: Why the event loop stopped (e.g., "end_turn", "max_tokens")
            - message: The final message from the model
            - metrics: Performance metrics from the event loop
            - state: The final state of the event loop
    """
    events = self.stream_async(prompt, **kwargs)
    async for event in events:
        _ = event

    return cast(AgentResult, event["result"])

```

#### `stream_async(prompt, **kwargs)`

Process a natural language prompt and yield events as an async iterator.

This method provides an asynchronous interface for streaming agent events, allowing consumers to process stream events programmatically through an async iterator pattern rather than callback functions. This is particularly useful for web servers and other async environments.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `prompt` | `Union[str, list[ContentBlock]]` | User input as text or list of ContentBlock objects for multi-modal content. | *required* | | `**kwargs` | `Any` | Additional parameters to pass to the event loop. | `{}` |

Yields:

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
async def stream_async(self, prompt: Union[str, list[ContentBlock]], **kwargs: Any) -> AsyncIterator[Any]:
    """Process a natural language prompt and yield events as an async iterator.

    This method provides an asynchronous interface for streaming agent events, allowing
    consumers to process stream events programmatically through an async iterator pattern
    rather than callback functions. This is particularly useful for web servers and other
    async environments.

    Args:
        prompt: User input as text or list of ContentBlock objects for multi-modal content.
        **kwargs: Additional parameters to pass to the event loop.

    Yields:
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
    callback_handler = kwargs.get("callback_handler", self.callback_handler)

    content: list[ContentBlock] = [{"text": prompt}] if isinstance(prompt, str) else prompt
    message: Message = {"role": "user", "content": content}

    self.trace_span = self._start_agent_trace_span(message)
    with trace_api.use_span(self.trace_span):
        try:
            events = self._run_loop(message, invocation_state=kwargs)
            async for event in events:
                if "callback" in event:
                    callback_handler(**event["callback"])
                    yield event["callback"]

            result = AgentResult(*event["stop"])
            callback_handler(result=result)
            yield {"result": result}

            self._end_agent_trace_span(response=result)

        except Exception as e:
            self._end_agent_trace_span(error=e)
            raise

````

#### `structured_output(output_model, prompt=None)`

This method allows you to get structured output from the agent.

If you pass in a prompt, it will be added to the conversation history and the agent will respond to it. If you don't pass in a prompt, it will use only the conversation history to respond.

For smaller models, you may want to use the optional prompt to add additional instructions to explicitly instruct the model to output the structured data.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `output_model` | `Type[T]` | The output model (a JSON schema written as a Pydantic BaseModel) that the agent will use when responding. | *required* | | `prompt` | `Optional[Union[str, list[ContentBlock]]]` | The prompt to use for the agent. | `None` |

Raises:

| Type | Description | | --- | --- | | `ValueError` | If no conversation history or prompt is provided. |

Source code in `strands/agent/agent.py`

```
def structured_output(self, output_model: Type[T], prompt: Optional[Union[str, list[ContentBlock]]] = None) -> T:
    """This method allows you to get structured output from the agent.

    If you pass in a prompt, it will be added to the conversation history and the agent will respond to it.
    If you don't pass in a prompt, it will use only the conversation history to respond.

    For smaller models, you may want to use the optional prompt to add additional instructions to explicitly
    instruct the model to output the structured data.

    Args:
        output_model: The output model (a JSON schema written as a Pydantic BaseModel)
            that the agent will use when responding.
        prompt: The prompt to use for the agent.

    Raises:
        ValueError: If no conversation history or prompt is provided.
    """

    def execute() -> T:
        return asyncio.run(self.structured_output_async(output_model, prompt))

    with ThreadPoolExecutor() as executor:
        future = executor.submit(execute)
        return future.result()

```

#### `structured_output_async(output_model, prompt=None)`

This method allows you to get structured output from the agent.

If you pass in a prompt, it will be added to the conversation history and the agent will respond to it. If you don't pass in a prompt, it will use only the conversation history to respond.

For smaller models, you may want to use the optional prompt to add additional instructions to explicitly instruct the model to output the structured data.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `output_model` | `Type[T]` | The output model (a JSON schema written as a Pydantic BaseModel) that the agent will use when responding. | *required* | | `prompt` | `Optional[Union[str, list[ContentBlock]]]` | The prompt to use for the agent. | `None` |

Raises:

| Type | Description | | --- | --- | | `ValueError` | If no conversation history or prompt is provided. |

Source code in `strands/agent/agent.py`

```
async def structured_output_async(
    self, output_model: Type[T], prompt: Optional[Union[str, list[ContentBlock]]] = None
) -> T:
    """This method allows you to get structured output from the agent.

    If you pass in a prompt, it will be added to the conversation history and the agent will respond to it.
    If you don't pass in a prompt, it will use only the conversation history to respond.

    For smaller models, you may want to use the optional prompt to add additional instructions to explicitly
    instruct the model to output the structured data.

    Args:
        output_model: The output model (a JSON schema written as a Pydantic BaseModel)
            that the agent will use when responding.
        prompt: The prompt to use for the agent.

    Raises:
        ValueError: If no conversation history or prompt is provided.
    """
    self.hooks.invoke_callbacks(BeforeInvocationEvent(agent=self))

    try:
        if not self.messages and not prompt:
            raise ValueError("No conversation history or prompt provided")

        # add the prompt as the last message
        if prompt:
            content: list[ContentBlock] = [{"text": prompt}] if isinstance(prompt, str) else prompt
            self._append_message({"role": "user", "content": content})

        events = self.model.structured_output(output_model, self.messages, system_prompt=self.system_prompt)
        async for event in events:
            if "callback" in event:
                self.callback_handler(**cast(dict, event["callback"]))

        return event["output"]

    finally:
        self.hooks.invoke_callbacks(AfterInvocationEvent(agent=self))

```

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
- SummarizingConversationManager: An implementation that summarizes older context instead of simply trimming it

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

    def __init__(self) -> None:
        """Initialize the ConversationManager.

        Attributes:
          removed_message_count: The messages that have been removed from the agents messages array.
              These represent messages provided by the user or LLM that have been removed, not messages
              included by the conversation manager through something like summarization.
        """
        self.removed_message_count = 0

    def restore_from_session(self, state: dict[str, Any]) -> Optional[list[Message]]:
        """Restore the Conversation Manager's state from a session.

        Args:
            state: Previous state of the conversation manager
        Returns:
            Optional list of messages to prepend to the agents messages. By default returns None.
        """
        if state.get("__name__") != self.__class__.__name__:
            raise ValueError("Invalid conversation manager state.")
        self.removed_message_count = state["removed_message_count"]
        return None

    def get_state(self) -> dict[str, Any]:
        """Get the current state of a Conversation Manager as a Json serializable dictionary."""
        return {
            "__name__": self.__class__.__name__,
            "removed_message_count": self.removed_message_count,
        }

    @abstractmethod
    def apply_management(self, agent: "Agent", **kwargs: Any) -> None:
        """Applies management strategy to the provided agent.

        Processes the conversation history to maintain appropriate size by modifying the messages list in-place.
        Implementations should handle message pruning, summarization, or other size management techniques to keep the
        conversation context within desired bounds.

        Args:
            agent: The agent whose conversation history will be manage.
                This list is modified in-place.
            **kwargs: Additional keyword arguments for future extensibility.
        """
        pass

    @abstractmethod
    def reduce_context(self, agent: "Agent", e: Optional[Exception] = None, **kwargs: Any) -> None:
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
            **kwargs: Additional keyword arguments for future extensibility.
        """
        pass

```

##### `__init__()`

Initialize the ConversationManager.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `removed_message_count` | | The messages that have been removed from the agents messages array. These represent messages provided by the user or LLM that have been removed, not messages included by the conversation manager through something like summarization. |

Source code in `strands/agent/conversation_manager/conversation_manager.py`

```
def __init__(self) -> None:
    """Initialize the ConversationManager.

    Attributes:
      removed_message_count: The messages that have been removed from the agents messages array.
          These represent messages provided by the user or LLM that have been removed, not messages
          included by the conversation manager through something like summarization.
    """
    self.removed_message_count = 0

```

##### `apply_management(agent, **kwargs)`

Applies management strategy to the provided agent.

Processes the conversation history to maintain appropriate size by modifying the messages list in-place. Implementations should handle message pruning, summarization, or other size management techniques to keep the conversation context within desired bounds.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `agent` | `Agent` | The agent whose conversation history will be manage. This list is modified in-place. | *required* | | `**kwargs` | `Any` | Additional keyword arguments for future extensibility. | `{}` |

Source code in `strands/agent/conversation_manager/conversation_manager.py`

```
@abstractmethod
def apply_management(self, agent: "Agent", **kwargs: Any) -> None:
    """Applies management strategy to the provided agent.

    Processes the conversation history to maintain appropriate size by modifying the messages list in-place.
    Implementations should handle message pruning, summarization, or other size management techniques to keep the
    conversation context within desired bounds.

    Args:
        agent: The agent whose conversation history will be manage.
            This list is modified in-place.
        **kwargs: Additional keyword arguments for future extensibility.
    """
    pass

```

##### `get_state()`

Get the current state of a Conversation Manager as a Json serializable dictionary.

Source code in `strands/agent/conversation_manager/conversation_manager.py`

```
def get_state(self) -> dict[str, Any]:
    """Get the current state of a Conversation Manager as a Json serializable dictionary."""
    return {
        "__name__": self.__class__.__name__,
        "removed_message_count": self.removed_message_count,
    }

```

##### `reduce_context(agent, e=None, **kwargs)`

Called when the model's context window is exceeded.

This method should implement the specific strategy for reducing the window size when a context overflow occurs. It is typically called after a ContextWindowOverflowException is caught.

Implementations might use strategies such as:

- Removing the N oldest messages
- Summarizing older context
- Applying importance-based filtering
- Maintaining critical conversation markers

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `agent` | `Agent` | The agent whose conversation history will be reduced. This list is modified in-place. | *required* | | `e` | `Optional[Exception]` | The exception that triggered the context reduction, if any. | `None` | | `**kwargs` | `Any` | Additional keyword arguments for future extensibility. | `{}` |

Source code in `strands/agent/conversation_manager/conversation_manager.py`

```
@abstractmethod
def reduce_context(self, agent: "Agent", e: Optional[Exception] = None, **kwargs: Any) -> None:
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
        **kwargs: Additional keyword arguments for future extensibility.
    """
    pass

```

##### `restore_from_session(state)`

Restore the Conversation Manager's state from a session.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `state` | `dict[str, Any]` | Previous state of the conversation manager | *required* |

Returns: Optional list of messages to prepend to the agents messages. By default returns None.

Source code in `strands/agent/conversation_manager/conversation_manager.py`

```
def restore_from_session(self, state: dict[str, Any]) -> Optional[list[Message]]:
    """Restore the Conversation Manager's state from a session.

    Args:
        state: Previous state of the conversation manager
    Returns:
        Optional list of messages to prepend to the agents messages. By default returns None.
    """
    if state.get("__name__") != self.__class__.__name__:
        raise ValueError("Invalid conversation manager state.")
    self.removed_message_count = state["removed_message_count"]
    return None

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

    def apply_management(self, agent: "Agent", **kwargs: Any) -> None:
        """Does nothing to the conversation history.

        Args:
            agent: The agent whose conversation history will remain unmodified.
            **kwargs: Additional keyword arguments for future extensibility.
        """
        pass

    def reduce_context(self, agent: "Agent", e: Optional[Exception] = None, **kwargs: Any) -> None:
        """Does not reduce context and raises an exception.

        Args:
            agent: The agent whose conversation history will remain unmodified.
            e: The exception that triggered the context reduction, if any.
            **kwargs: Additional keyword arguments for future extensibility.

        Raises:
            e: If provided.
            ContextWindowOverflowException: If e is None.
        """
        if e:
            raise e
        else:
            raise ContextWindowOverflowException("Context window overflowed!")

```

##### `apply_management(agent, **kwargs)`

Does nothing to the conversation history.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `agent` | `Agent` | The agent whose conversation history will remain unmodified. | *required* | | `**kwargs` | `Any` | Additional keyword arguments for future extensibility. | `{}` |

Source code in `strands/agent/conversation_manager/null_conversation_manager.py`

```
def apply_management(self, agent: "Agent", **kwargs: Any) -> None:
    """Does nothing to the conversation history.

    Args:
        agent: The agent whose conversation history will remain unmodified.
        **kwargs: Additional keyword arguments for future extensibility.
    """
    pass

```

##### `reduce_context(agent, e=None, **kwargs)`

Does not reduce context and raises an exception.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `agent` | `Agent` | The agent whose conversation history will remain unmodified. | *required* | | `e` | `Optional[Exception]` | The exception that triggered the context reduction, if any. | `None` | | `**kwargs` | `Any` | Additional keyword arguments for future extensibility. | `{}` |

Raises:

| Type | Description | | --- | --- | | `e` | If provided. | | `ContextWindowOverflowException` | If e is None. |

Source code in `strands/agent/conversation_manager/null_conversation_manager.py`

```
def reduce_context(self, agent: "Agent", e: Optional[Exception] = None, **kwargs: Any) -> None:
    """Does not reduce context and raises an exception.

    Args:
        agent: The agent whose conversation history will remain unmodified.
        e: The exception that triggered the context reduction, if any.
        **kwargs: Additional keyword arguments for future extensibility.

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

    def __init__(self, window_size: int = 40, should_truncate_results: bool = True):
        """Initialize the sliding window conversation manager.

        Args:
            window_size: Maximum number of messages to keep in the agent's history.
                Defaults to 40 messages.
            should_truncate_results: Truncate tool results when a message is too large for the model's context window
        """
        super().__init__()
        self.window_size = window_size
        self.should_truncate_results = should_truncate_results

    def apply_management(self, agent: "Agent", **kwargs: Any) -> None:
        """Apply the sliding window to the agent's messages array to maintain a manageable history size.

        This method is called after every event loop cycle to apply a sliding window if the message count
        exceeds the window size.

        Args:
            agent: The agent whose messages will be managed.
                This list is modified in-place.
            **kwargs: Additional keyword arguments for future extensibility.
        """
        messages = agent.messages

        if len(messages) <= self.window_size:
            logger.debug(
                "message_count=<%s>, window_size=<%s> | skipping context reduction", len(messages), self.window_size
            )
            return
        self.reduce_context(agent)

    def reduce_context(self, agent: "Agent", e: Optional[Exception] = None, **kwargs: Any) -> None:
        """Trim the oldest messages to reduce the conversation context size.

        The method handles special cases where trimming the messages leads to:
         - toolResult with no corresponding toolUse
         - toolUse with no corresponding toolResult

        Args:
            agent: The agent whose messages will be reduce.
                This list is modified in-place.
            e: The exception that triggered the context reduction, if any.
            **kwargs: Additional keyword arguments for future extensibility.

        Raises:
            ContextWindowOverflowException: If the context cannot be reduced further.
                Such as when the conversation is already minimal or when tool result messages cannot be properly
                converted.
        """
        messages = agent.messages

        # Try to truncate the tool result first
        last_message_idx_with_tool_results = self._find_last_message_with_tool_results(messages)
        if last_message_idx_with_tool_results is not None and self.should_truncate_results:
            logger.debug(
                "message_index=<%s> | found message with tool results at index", last_message_idx_with_tool_results
            )
            results_truncated = self._truncate_tool_results(messages, last_message_idx_with_tool_results)
            if results_truncated:
                logger.debug("message_index=<%s> | tool results truncated", last_message_idx_with_tool_results)
                return

        # Try to trim index id when tool result cannot be truncated anymore
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

        # trim_index represents the number of messages being removed from the agents messages array
        self.removed_message_count += trim_index

        # Overwrite message history
        messages[:] = messages[trim_index:]

    def _truncate_tool_results(self, messages: Messages, msg_idx: int) -> bool:
        """Truncate tool results in a message to reduce context size.

        When a message contains tool results that are too large for the model's context window, this function
        replaces the content of those tool results with a simple error message.

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
        tool_result_too_large_message = "The tool result was too large!"
        for i, content in enumerate(message.get("content", [])):
            if isinstance(content, dict) and "toolResult" in content:
                tool_result_content_text = next(
                    (item["text"] for item in content["toolResult"]["content"] if "text" in item),
                    "",
                )
                # make the overwriting logic togglable
                if (
                    message["content"][i]["toolResult"]["status"] == "error"
                    and tool_result_content_text == tool_result_too_large_message
                ):
                    logger.info("ToolResult has already been updated, skipping overwrite")
                    return False
                # Update status to error with informative message
                message["content"][i]["toolResult"]["status"] = "error"
                message["content"][i]["toolResult"]["content"] = [{"text": tool_result_too_large_message}]
                changes_made = True

        return changes_made

    def _find_last_message_with_tool_results(self, messages: Messages) -> Optional[int]:
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

##### `__init__(window_size=40, should_truncate_results=True)`

Initialize the sliding window conversation manager.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `window_size` | `int` | Maximum number of messages to keep in the agent's history. Defaults to 40 messages. | `40` | | `should_truncate_results` | `bool` | Truncate tool results when a message is too large for the model's context window | `True` |

Source code in `strands/agent/conversation_manager/sliding_window_conversation_manager.py`

```
def __init__(self, window_size: int = 40, should_truncate_results: bool = True):
    """Initialize the sliding window conversation manager.

    Args:
        window_size: Maximum number of messages to keep in the agent's history.
            Defaults to 40 messages.
        should_truncate_results: Truncate tool results when a message is too large for the model's context window
    """
    super().__init__()
    self.window_size = window_size
    self.should_truncate_results = should_truncate_results

```

##### `apply_management(agent, **kwargs)`

Apply the sliding window to the agent's messages array to maintain a manageable history size.

This method is called after every event loop cycle to apply a sliding window if the message count exceeds the window size.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `agent` | `Agent` | The agent whose messages will be managed. This list is modified in-place. | *required* | | `**kwargs` | `Any` | Additional keyword arguments for future extensibility. | `{}` |

Source code in `strands/agent/conversation_manager/sliding_window_conversation_manager.py`

```
def apply_management(self, agent: "Agent", **kwargs: Any) -> None:
    """Apply the sliding window to the agent's messages array to maintain a manageable history size.

    This method is called after every event loop cycle to apply a sliding window if the message count
    exceeds the window size.

    Args:
        agent: The agent whose messages will be managed.
            This list is modified in-place.
        **kwargs: Additional keyword arguments for future extensibility.
    """
    messages = agent.messages

    if len(messages) <= self.window_size:
        logger.debug(
            "message_count=<%s>, window_size=<%s> | skipping context reduction", len(messages), self.window_size
        )
        return
    self.reduce_context(agent)

```

##### `reduce_context(agent, e=None, **kwargs)`

Trim the oldest messages to reduce the conversation context size.

The method handles special cases where trimming the messages leads to

- toolResult with no corresponding toolUse
- toolUse with no corresponding toolResult

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `agent` | `Agent` | The agent whose messages will be reduce. This list is modified in-place. | *required* | | `e` | `Optional[Exception]` | The exception that triggered the context reduction, if any. | `None` | | `**kwargs` | `Any` | Additional keyword arguments for future extensibility. | `{}` |

Raises:

| Type | Description | | --- | --- | | `ContextWindowOverflowException` | If the context cannot be reduced further. Such as when the conversation is already minimal or when tool result messages cannot be properly converted. |

Source code in `strands/agent/conversation_manager/sliding_window_conversation_manager.py`

```
def reduce_context(self, agent: "Agent", e: Optional[Exception] = None, **kwargs: Any) -> None:
    """Trim the oldest messages to reduce the conversation context size.

    The method handles special cases where trimming the messages leads to:
     - toolResult with no corresponding toolUse
     - toolUse with no corresponding toolResult

    Args:
        agent: The agent whose messages will be reduce.
            This list is modified in-place.
        e: The exception that triggered the context reduction, if any.
        **kwargs: Additional keyword arguments for future extensibility.

    Raises:
        ContextWindowOverflowException: If the context cannot be reduced further.
            Such as when the conversation is already minimal or when tool result messages cannot be properly
            converted.
    """
    messages = agent.messages

    # Try to truncate the tool result first
    last_message_idx_with_tool_results = self._find_last_message_with_tool_results(messages)
    if last_message_idx_with_tool_results is not None and self.should_truncate_results:
        logger.debug(
            "message_index=<%s> | found message with tool results at index", last_message_idx_with_tool_results
        )
        results_truncated = self._truncate_tool_results(messages, last_message_idx_with_tool_results)
        if results_truncated:
            logger.debug("message_index=<%s> | tool results truncated", last_message_idx_with_tool_results)
            return

    # Try to trim index id when tool result cannot be truncated anymore
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

    # trim_index represents the number of messages being removed from the agents messages array
    self.removed_message_count += trim_index

    # Overwrite message history
    messages[:] = messages[trim_index:]

```

### `strands.agent.conversation_manager.summarizing_conversation_manager`

Summarizing conversation history management with configurable options.

#### `SummarizingConversationManager`

Bases: `ConversationManager`

Implements a summarizing window manager.

This manager provides a configurable option to summarize older context instead of simply trimming it, helping preserve important information while staying within context limits.

Source code in `strands/agent/conversation_manager/summarizing_conversation_manager.py`

```
class SummarizingConversationManager(ConversationManager):
    """Implements a summarizing window manager.

    This manager provides a configurable option to summarize older context instead of
    simply trimming it, helping preserve important information while staying within
    context limits.
    """

    def __init__(
        self,
        summary_ratio: float = 0.3,
        preserve_recent_messages: int = 10,
        summarization_agent: Optional["Agent"] = None,
        summarization_system_prompt: Optional[str] = None,
    ):
        """Initialize the summarizing conversation manager.

        Args:
            summary_ratio: Ratio of messages to summarize vs keep when context overflow occurs.
                Value between 0.1 and 0.8. Defaults to 0.3 (summarize 30% of oldest messages).
            preserve_recent_messages: Minimum number of recent messages to always keep.
                Defaults to 10 messages.
            summarization_agent: Optional agent to use for summarization instead of the parent agent.
                If provided, this agent can use tools as part of the summarization process.
            summarization_system_prompt: Optional system prompt override for summarization.
                If None, uses the default summarization prompt.
        """
        super().__init__()
        if summarization_agent is not None and summarization_system_prompt is not None:
            raise ValueError(
                "Cannot provide both summarization_agent and summarization_system_prompt. "
                "Agents come with their own system prompt."
            )

        self.summary_ratio = max(0.1, min(0.8, summary_ratio))
        self.preserve_recent_messages = preserve_recent_messages
        self.summarization_agent = summarization_agent
        self.summarization_system_prompt = summarization_system_prompt
        self._summary_message: Optional[Message] = None

    @override
    def restore_from_session(self, state: dict[str, Any]) -> Optional[list[Message]]:
        """Restores the Summarizing Conversation manager from its previous state in a session.

        Args:
            state: The previous state of the Summarizing Conversation Manager.

        Returns:
            Optionally returns the previous conversation summary if it exists.
        """
        super().restore_from_session(state)
        self._summary_message = state.get("summary_message")
        return [self._summary_message] if self._summary_message else None

    def get_state(self) -> dict[str, Any]:
        """Returns a dictionary representation of the state for the Summarizing Conversation Manager."""
        return {"summary_message": self._summary_message, **super().get_state()}

    def apply_management(self, agent: "Agent", **kwargs: Any) -> None:
        """Apply management strategy to conversation history.

        For the summarizing conversation manager, no proactive management is performed.
        Summarization only occurs when there's a context overflow that triggers reduce_context.

        Args:
            agent: The agent whose conversation history will be managed.
                The agent's messages list is modified in-place.
            **kwargs: Additional keyword arguments for future extensibility.
        """
        # No proactive management - summarization only happens on context overflow
        pass

    def reduce_context(self, agent: "Agent", e: Optional[Exception] = None, **kwargs: Any) -> None:
        """Reduce context using summarization.

        Args:
            agent: The agent whose conversation history will be reduced.
                The agent's messages list is modified in-place.
            e: The exception that triggered the context reduction, if any.
            **kwargs: Additional keyword arguments for future extensibility.

        Raises:
            ContextWindowOverflowException: If the context cannot be summarized.
        """
        try:
            # Calculate how many messages to summarize
            messages_to_summarize_count = max(1, int(len(agent.messages) * self.summary_ratio))

            # Ensure we don't summarize recent messages
            messages_to_summarize_count = min(
                messages_to_summarize_count, len(agent.messages) - self.preserve_recent_messages
            )

            if messages_to_summarize_count <= 0:
                raise ContextWindowOverflowException("Cannot summarize: insufficient messages for summarization")

            # Adjust split point to avoid breaking ToolUse/ToolResult pairs
            messages_to_summarize_count = self._adjust_split_point_for_tool_pairs(
                agent.messages, messages_to_summarize_count
            )

            if messages_to_summarize_count <= 0:
                raise ContextWindowOverflowException("Cannot summarize: insufficient messages for summarization")

            # Extract messages to summarize
            messages_to_summarize = agent.messages[:messages_to_summarize_count]
            remaining_messages = agent.messages[messages_to_summarize_count:]

            # Keep track of the number of messages that have been summarized thus far.
            self.removed_message_count += len(messages_to_summarize)
            # If there is a summary message, don't count it in the removed_message_count.
            if self._summary_message:
                self.removed_message_count -= 1

            # Generate summary
            self._summary_message = self._generate_summary(messages_to_summarize, agent)

            # Replace the summarized messages with the summary
            agent.messages[:] = [self._summary_message] + remaining_messages

        except Exception as summarization_error:
            logger.error("Summarization failed: %s", summarization_error)
            raise summarization_error from e

    def _generate_summary(self, messages: List[Message], agent: "Agent") -> Message:
        """Generate a summary of the provided messages.

        Args:
            messages: The messages to summarize.
            agent: The agent instance to use for summarization.

        Returns:
            A message containing the conversation summary.

        Raises:
            Exception: If summary generation fails.
        """
        # Choose which agent to use for summarization
        summarization_agent = self.summarization_agent if self.summarization_agent is not None else agent

        # Save original system prompt and messages to restore later
        original_system_prompt = summarization_agent.system_prompt
        original_messages = summarization_agent.messages.copy()

        try:
            # Only override system prompt if no agent was provided during initialization
            if self.summarization_agent is None:
                # Use custom system prompt if provided, otherwise use default
                system_prompt = (
                    self.summarization_system_prompt
                    if self.summarization_system_prompt is not None
                    else DEFAULT_SUMMARIZATION_PROMPT
                )
                # Temporarily set the system prompt for summarization
                summarization_agent.system_prompt = system_prompt
            summarization_agent.messages = messages

            # Use the agent to generate summary with rich content (can use tools if needed)
            result = summarization_agent("Please summarize this conversation.")

            return result.message

        finally:
            # Restore original agent state
            summarization_agent.system_prompt = original_system_prompt
            summarization_agent.messages = original_messages

    def _adjust_split_point_for_tool_pairs(self, messages: List[Message], split_point: int) -> int:
        """Adjust the split point to avoid breaking ToolUse/ToolResult pairs.

        Uses the same logic as SlidingWindowConversationManager for consistency.

        Args:
            messages: The full list of messages.
            split_point: The initially calculated split point.

        Returns:
            The adjusted split point that doesn't break ToolUse/ToolResult pairs.

        Raises:
            ContextWindowOverflowException: If no valid split point can be found.
        """
        if split_point > len(messages):
            raise ContextWindowOverflowException("Split point exceeds message array length")

        if split_point == len(messages):
            return split_point

        # Find the next valid split_point
        while split_point < len(messages):
            if (
                # Oldest message cannot be a toolResult because it needs a toolUse preceding it
                any("toolResult" in content for content in messages[split_point]["content"])
                or (
                    # Oldest message can be a toolUse only if a toolResult immediately follows it.
                    any("toolUse" in content for content in messages[split_point]["content"])
                    and split_point + 1 < len(messages)
                    and not any("toolResult" in content for content in messages[split_point + 1]["content"])
                )
            ):
                split_point += 1
            else:
                break
        else:
            # If we didn't find a valid split_point, then we throw
            raise ContextWindowOverflowException("Unable to trim conversation context!")

        return split_point

```

##### `__init__(summary_ratio=0.3, preserve_recent_messages=10, summarization_agent=None, summarization_system_prompt=None)`

Initialize the summarizing conversation manager.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `summary_ratio` | `float` | Ratio of messages to summarize vs keep when context overflow occurs. Value between 0.1 and 0.8. Defaults to 0.3 (summarize 30% of oldest messages). | `0.3` | | `preserve_recent_messages` | `int` | Minimum number of recent messages to always keep. Defaults to 10 messages. | `10` | | `summarization_agent` | `Optional[Agent]` | Optional agent to use for summarization instead of the parent agent. If provided, this agent can use tools as part of the summarization process. | `None` | | `summarization_system_prompt` | `Optional[str]` | Optional system prompt override for summarization. If None, uses the default summarization prompt. | `None` |

Source code in `strands/agent/conversation_manager/summarizing_conversation_manager.py`

```
def __init__(
    self,
    summary_ratio: float = 0.3,
    preserve_recent_messages: int = 10,
    summarization_agent: Optional["Agent"] = None,
    summarization_system_prompt: Optional[str] = None,
):
    """Initialize the summarizing conversation manager.

    Args:
        summary_ratio: Ratio of messages to summarize vs keep when context overflow occurs.
            Value between 0.1 and 0.8. Defaults to 0.3 (summarize 30% of oldest messages).
        preserve_recent_messages: Minimum number of recent messages to always keep.
            Defaults to 10 messages.
        summarization_agent: Optional agent to use for summarization instead of the parent agent.
            If provided, this agent can use tools as part of the summarization process.
        summarization_system_prompt: Optional system prompt override for summarization.
            If None, uses the default summarization prompt.
    """
    super().__init__()
    if summarization_agent is not None and summarization_system_prompt is not None:
        raise ValueError(
            "Cannot provide both summarization_agent and summarization_system_prompt. "
            "Agents come with their own system prompt."
        )

    self.summary_ratio = max(0.1, min(0.8, summary_ratio))
    self.preserve_recent_messages = preserve_recent_messages
    self.summarization_agent = summarization_agent
    self.summarization_system_prompt = summarization_system_prompt
    self._summary_message: Optional[Message] = None

```

##### `apply_management(agent, **kwargs)`

Apply management strategy to conversation history.

For the summarizing conversation manager, no proactive management is performed. Summarization only occurs when there's a context overflow that triggers reduce_context.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `agent` | `Agent` | The agent whose conversation history will be managed. The agent's messages list is modified in-place. | *required* | | `**kwargs` | `Any` | Additional keyword arguments for future extensibility. | `{}` |

Source code in `strands/agent/conversation_manager/summarizing_conversation_manager.py`

```
def apply_management(self, agent: "Agent", **kwargs: Any) -> None:
    """Apply management strategy to conversation history.

    For the summarizing conversation manager, no proactive management is performed.
    Summarization only occurs when there's a context overflow that triggers reduce_context.

    Args:
        agent: The agent whose conversation history will be managed.
            The agent's messages list is modified in-place.
        **kwargs: Additional keyword arguments for future extensibility.
    """
    # No proactive management - summarization only happens on context overflow
    pass

```

##### `get_state()`

Returns a dictionary representation of the state for the Summarizing Conversation Manager.

Source code in `strands/agent/conversation_manager/summarizing_conversation_manager.py`

```
def get_state(self) -> dict[str, Any]:
    """Returns a dictionary representation of the state for the Summarizing Conversation Manager."""
    return {"summary_message": self._summary_message, **super().get_state()}

```

##### `reduce_context(agent, e=None, **kwargs)`

Reduce context using summarization.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `agent` | `Agent` | The agent whose conversation history will be reduced. The agent's messages list is modified in-place. | *required* | | `e` | `Optional[Exception]` | The exception that triggered the context reduction, if any. | `None` | | `**kwargs` | `Any` | Additional keyword arguments for future extensibility. | `{}` |

Raises:

| Type | Description | | --- | --- | | `ContextWindowOverflowException` | If the context cannot be summarized. |

Source code in `strands/agent/conversation_manager/summarizing_conversation_manager.py`

```
def reduce_context(self, agent: "Agent", e: Optional[Exception] = None, **kwargs: Any) -> None:
    """Reduce context using summarization.

    Args:
        agent: The agent whose conversation history will be reduced.
            The agent's messages list is modified in-place.
        e: The exception that triggered the context reduction, if any.
        **kwargs: Additional keyword arguments for future extensibility.

    Raises:
        ContextWindowOverflowException: If the context cannot be summarized.
    """
    try:
        # Calculate how many messages to summarize
        messages_to_summarize_count = max(1, int(len(agent.messages) * self.summary_ratio))

        # Ensure we don't summarize recent messages
        messages_to_summarize_count = min(
            messages_to_summarize_count, len(agent.messages) - self.preserve_recent_messages
        )

        if messages_to_summarize_count <= 0:
            raise ContextWindowOverflowException("Cannot summarize: insufficient messages for summarization")

        # Adjust split point to avoid breaking ToolUse/ToolResult pairs
        messages_to_summarize_count = self._adjust_split_point_for_tool_pairs(
            agent.messages, messages_to_summarize_count
        )

        if messages_to_summarize_count <= 0:
            raise ContextWindowOverflowException("Cannot summarize: insufficient messages for summarization")

        # Extract messages to summarize
        messages_to_summarize = agent.messages[:messages_to_summarize_count]
        remaining_messages = agent.messages[messages_to_summarize_count:]

        # Keep track of the number of messages that have been summarized thus far.
        self.removed_message_count += len(messages_to_summarize)
        # If there is a summary message, don't count it in the removed_message_count.
        if self._summary_message:
            self.removed_message_count -= 1

        # Generate summary
        self._summary_message = self._generate_summary(messages_to_summarize, agent)

        # Replace the summarized messages with the summary
        agent.messages[:] = [self._summary_message] + remaining_messages

    except Exception as summarization_error:
        logger.error("Summarization failed: %s", summarization_error)
        raise summarization_error from e

```

##### `restore_from_session(state)`

Restores the Summarizing Conversation manager from its previous state in a session.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `state` | `dict[str, Any]` | The previous state of the Summarizing Conversation Manager. | *required* |

Returns:

| Type | Description | | --- | --- | | `Optional[list[Message]]` | Optionally returns the previous conversation summary if it exists. |

Source code in `strands/agent/conversation_manager/summarizing_conversation_manager.py`

```
@override
def restore_from_session(self, state: dict[str, Any]) -> Optional[list[Message]]:
    """Restores the Summarizing Conversation manager from its previous state in a session.

    Args:
        state: The previous state of the Summarizing Conversation Manager.

    Returns:
        Optionally returns the previous conversation summary if it exists.
    """
    super().restore_from_session(state)
    self._summary_message = state.get("summary_message")
    return [self._summary_message] if self._summary_message else None

```

## `strands.agent.state`

Agent state management.

### `AgentState`

Represents an Agent's stateful information outside of context provided to a model.

Provides a key-value store for agent state with JSON serialization validation and persistence support. Key features:

- JSON serialization validation on assignment
- Get/set/delete operations

Source code in `strands/agent/state.py`

```
class AgentState:
    """Represents an Agent's stateful information outside of context provided to a model.

    Provides a key-value store for agent state with JSON serialization validation and persistence support.
    Key features:
    - JSON serialization validation on assignment
    - Get/set/delete operations
    """

    def __init__(self, initial_state: Optional[Dict[str, Any]] = None):
        """Initialize AgentState."""
        self._state: Dict[str, Dict[str, Any]]
        if initial_state:
            self._validate_json_serializable(initial_state)
            self._state = copy.deepcopy(initial_state)
        else:
            self._state = {}

    def set(self, key: str, value: Any) -> None:
        """Set a value in the state.

        Args:
            key: The key to store the value under
            value: The value to store (must be JSON serializable)

        Raises:
            ValueError: If key is invalid, or if value is not JSON serializable
        """
        self._validate_key(key)
        self._validate_json_serializable(value)

        self._state[key] = copy.deepcopy(value)

    def get(self, key: Optional[str] = None) -> Any:
        """Get a value or entire state.

        Args:
            key: The key to retrieve (if None, returns entire state object)

        Returns:
            The stored value, entire state dict, or None if not found
        """
        if key is None:
            return copy.deepcopy(self._state)
        else:
            # Return specific key
            return copy.deepcopy(self._state.get(key))

    def delete(self, key: str) -> None:
        """Delete a specific key from the state.

        Args:
            key: The key to delete
        """
        self._validate_key(key)

        self._state.pop(key, None)

    def _validate_key(self, key: str) -> None:
        """Validate that a key is valid.

        Args:
            key: The key to validate

        Raises:
            ValueError: If key is invalid
        """
        if key is None:
            raise ValueError("Key cannot be None")
        if not isinstance(key, str):
            raise ValueError("Key must be a string")
        if not key.strip():
            raise ValueError("Key cannot be empty")

    def _validate_json_serializable(self, value: Any) -> None:
        """Validate that a value is JSON serializable.

        Args:
            value: The value to validate

        Raises:
            ValueError: If value is not JSON serializable
        """
        try:
            json.dumps(value)
        except (TypeError, ValueError) as e:
            raise ValueError(
                f"Value is not JSON serializable: {type(value).__name__}. "
                f"Only JSON-compatible types (str, int, float, bool, list, dict, None) are allowed."
            ) from e

```

#### `__init__(initial_state=None)`

Initialize AgentState.

Source code in `strands/agent/state.py`

```
def __init__(self, initial_state: Optional[Dict[str, Any]] = None):
    """Initialize AgentState."""
    self._state: Dict[str, Dict[str, Any]]
    if initial_state:
        self._validate_json_serializable(initial_state)
        self._state = copy.deepcopy(initial_state)
    else:
        self._state = {}

```

#### `delete(key)`

Delete a specific key from the state.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `key` | `str` | The key to delete | *required* |

Source code in `strands/agent/state.py`

```
def delete(self, key: str) -> None:
    """Delete a specific key from the state.

    Args:
        key: The key to delete
    """
    self._validate_key(key)

    self._state.pop(key, None)

```

#### `get(key=None)`

Get a value or entire state.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `key` | `Optional[str]` | The key to retrieve (if None, returns entire state object) | `None` |

Returns:

| Type | Description | | --- | --- | | `Any` | The stored value, entire state dict, or None if not found |

Source code in `strands/agent/state.py`

```
def get(self, key: Optional[str] = None) -> Any:
    """Get a value or entire state.

    Args:
        key: The key to retrieve (if None, returns entire state object)

    Returns:
        The stored value, entire state dict, or None if not found
    """
    if key is None:
        return copy.deepcopy(self._state)
    else:
        # Return specific key
        return copy.deepcopy(self._state.get(key))

```

#### `set(key, value)`

Set a value in the state.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `key` | `str` | The key to store the value under | *required* | | `value` | `Any` | The value to store (must be JSON serializable) | *required* |

Raises:

| Type | Description | | --- | --- | | `ValueError` | If key is invalid, or if value is not JSON serializable |

Source code in `strands/agent/state.py`

```
def set(self, key: str, value: Any) -> None:
    """Set a value in the state.

    Args:
        key: The key to store the value under
        value: The value to store (must be JSON serializable)

    Raises:
        ValueError: If key is invalid, or if value is not JSON serializable
    """
    self._validate_key(key)
    self._validate_json_serializable(value)

    self._state[key] = copy.deepcopy(value)

```
