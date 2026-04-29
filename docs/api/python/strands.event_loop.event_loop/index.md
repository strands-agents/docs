This module implements the central event loop.

The event loop allows agents to:

1.  Process conversation messages
2.  Execute tools based on model requests
3.  Handle errors and recovery strategies
4.  Manage recursive execution cycles

#### MAX\_DELAY

4 minutes

#### event\_loop\_cycle

```python
async def event_loop_cycle(
    agent: "Agent",
    invocation_state: dict[str, Any],
    structured_output_context: StructuredOutputContext | None = None
) -> AsyncGenerator[TypedEvent, None]
```

Defined in: [src/strands/event\_loop/event\_loop.py:120](https://github.com/strands-agents/sdk-python/blob/main/src/strands/event_loop/event_loop.py#L120)

Execute a single cycle of the event loop.

This core function processes a single conversation turn, handling model inference, tool execution, and error recovery. It manages the entire lifecycle of a conversation turn, including:

1.  Initializing cycle state and metrics
2.  Checking execution limits
3.  Processing messages with the model
4.  Handling tool execution requests
5.  Managing recursive calls for multi-turn tool interactions
6.  Collecting and reporting metrics
7.  Error handling and recovery

**Arguments**:

-   `agent` - The agent for which the cycle is being executed.
    
-   `invocation_state` - Additional arguments including:
    
    -   request\_state: State maintained across cycles
    -   event\_loop\_cycle\_id: Unique ID for this cycle
    -   event\_loop\_cycle\_span: Current tracing Span for this cycle
-   `structured_output_context` - Optional context for structured output management.
    

**Yields**:

Model and tool stream events. The last event is a tuple containing:

-   StopReason: Reason the model stopped generating (e.g., “tool\_use”)
-   Message: The generated message from the model
-   EventLoopMetrics: Updated metrics for the event loop
-   Any: Updated request state

**Raises**:

-   `EventLoopException` - If an error occurs during execution
-   `ContextWindowOverflowException` - If the input is too large for the model

#### recurse\_event\_loop

```python
async def recurse_event_loop(
    agent: "Agent",
    invocation_state: dict[str, Any],
    structured_output_context: StructuredOutputContext | None = None
) -> AsyncGenerator[TypedEvent, None]
```

Defined in: [src/strands/event\_loop/event\_loop.py:285](https://github.com/strands-agents/sdk-python/blob/main/src/strands/event_loop/event_loop.py#L285)

Make a recursive call to event\_loop\_cycle with the current state.

This function is used when the event loop needs to continue processing after tool execution.

**Arguments**:

-   `agent` - Agent for which the recursive call is being made.
-   `invocation_state` - Arguments to pass through event\_loop\_cycle
-   `structured_output_context` - Optional context for structured output management.

**Yields**:

Results from event\_loop\_cycle where the last result contains:

-   StopReason: Reason the model stopped generating
-   Message: The generated message from the model
-   EventLoopMetrics: Updated metrics for the event loop
-   Any: Updated request state