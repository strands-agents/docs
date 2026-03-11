Steering handler base class for providing contextual guidance to agents.

Provides modular prompting through contextual guidance that appears when relevant, rather than front-loading all instructions. Handlers integrate with the Strands hook system to intercept actions and provide just-in-time feedback based on local context.

Architecture: Hook Event → Context Callbacks → Update steering\_context → steer\_\*() → SteeringAction ↓ ↓ ↓ ↓ ↓ Hook triggered Populate context Handler evaluates Handler decides Action taken

Lifecycle:

1.  Context callbacks update handler’s steering\_context on hook events
2.  BeforeToolCallEvent triggers steer\_before\_tool() for tool steering
3.  AfterModelCallEvent triggers steer\_after\_model() for model steering
4.  Handler accesses self.steering\_context for guidance decisions
5.  SteeringAction determines execution flow

Implementation: Subclass SteeringHandler and override steer\_before\_tool() and/or steer\_after\_model(). Both methods have default implementations that return Proceed, so you only need to override the methods you want to customize. Pass context\_providers in constructor to register context update functions. Each handler maintains isolated steering\_context that persists across calls.

SteeringAction handling for steer\_before\_tool: Proceed: Tool executes immediately Guide: Tool cancelled, agent receives contextual feedback to explore alternatives Interrupt: Tool execution paused for human input via interrupt system

SteeringAction handling for steer\_after\_model: Proceed: Model response accepted without modification Guide: Discard model response and retry (message is dropped, model is called again) Interrupt: Model response handling paused for human input via interrupt system

## SteeringHandler

```python
class SteeringHandler(Plugin)
```

Defined in: [src/strands/vended\_plugins/steering/core/handler.py:54](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/steering/core/handler.py#L54)

Base class for steering handlers that provide contextual guidance to agents.

Steering handlers maintain local context and register hook callbacks to populate context data as needed for guidance decisions.

#### \_\_init\_\_

```python
def __init__(context_providers: list[SteeringContextProvider] | None = None)
```

Defined in: [src/strands/vended\_plugins/steering/core/handler.py:63](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/steering/core/handler.py#L63)

Initialize the steering handler.

**Arguments**:

-   `context_providers` - List of context providers for context updates

#### init\_agent

```python
def init_agent(agent: "Agent") -> None
```

Defined in: [src/strands/vended\_plugins/steering/core/handler.py:79](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/steering/core/handler.py#L79)

Initialize the steering handler with an agent.

Registers hook callbacks for steering guidance and context updates.

**Arguments**:

-   `agent` - The agent instance to attach steering to.

#### provide\_tool\_steering\_guidance

```python
@hook
async def provide_tool_steering_guidance(event: BeforeToolCallEvent) -> None
```

Defined in: [src/strands/vended\_plugins/steering/core/handler.py:92](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/steering/core/handler.py#L92)

Provide steering guidance for tool call.

#### provide\_model\_steering\_guidance

```python
@hook
async def provide_model_steering_guidance(event: AfterModelCallEvent) -> None
```

Defined in: [src/strands/vended\_plugins/steering/core/handler.py:133](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/steering/core/handler.py#L133)

Provide steering guidance for model response.

#### steer\_before\_tool

```python
async def steer_before_tool(*, agent: "Agent", tool_use: ToolUse,
                            **kwargs: Any) -> ToolSteeringAction
```

Defined in: [src/strands/vended\_plugins/steering/core/handler.py:170](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/steering/core/handler.py#L170)

Provide contextual guidance before tool execution.

This method is called before a tool is executed, allowing the handler to:

-   Proceed: Allow tool execution to continue
-   Guide: Cancel tool and provide feedback for alternative approaches
-   Interrupt: Pause for human input before tool execution

**Arguments**:

-   `agent` - The agent instance
-   `tool_use` - The tool use object with name and arguments
-   `**kwargs` - Additional keyword arguments for guidance evaluation

**Returns**:

ToolSteeringAction indicating how to guide the tool execution

**Notes**:

Access steering context via self.steering\_context Default implementation returns Proceed (allow tool execution) Override this method to implement custom tool steering logic

#### steer\_after\_model

```python
async def steer_after_model(*, agent: "Agent", message: Message,
                            stop_reason: StopReason,
                            **kwargs: Any) -> ModelSteeringAction
```

Defined in: [src/strands/vended\_plugins/steering/core/handler.py:193](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/steering/core/handler.py#L193)

Provide contextual guidance after model response.

This method is called after the model generates a response, allowing the handler to:

-   Proceed: Accept the model response without modification
-   Guide: Discard the response and retry (message is dropped, model is called again)

Note: Interrupt is not supported for model steering as the model has already responded.

**Arguments**:

-   `agent` - The agent instance
-   `message` - The model’s generated message
-   `stop_reason` - The reason the model stopped generating
-   `**kwargs` - Additional keyword arguments for guidance evaluation

**Returns**:

ModelSteeringAction indicating how to handle the model response

**Notes**:

Access steering context via self.steering\_context Default implementation returns Proceed (accept response as-is) Override this method to implement custom model steering logic