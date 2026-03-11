SteeringAction types for steering evaluation results.

Defines structured outcomes from steering handlers that determine how agent actions should be handled. SteeringActions enable modular prompting by providing just-in-time feedback rather than front-loading all instructions in monolithic prompts.

Flow: SteeringHandler.steer\_\*() → SteeringAction → Event handling ↓ ↓ ↓ Evaluate context Action type Execution modified

SteeringAction types: Proceed: Allow execution to continue without intervention Guide: Provide contextual guidance to redirect the agent Interrupt: Pause execution for human input

Extensibility: New action types can be added to the union. Always handle the default case in pattern matching to maintain backward compatibility.

## Proceed

```python
class Proceed(BaseModel)
```

Defined in: [src/strands/vended\_plugins/steering/core/action.py:27](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/steering/core/action.py#L27)

Allow execution to continue without intervention.

The action proceeds as planned. The reason provides context for logging and debugging purposes.

## Guide

```python
class Guide(BaseModel)
```

Defined in: [src/strands/vended\_plugins/steering/core/action.py:38](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/steering/core/action.py#L38)

Provide contextual guidance to redirect the agent.

The agent receives the reason as contextual feedback to help guide its behavior. The specific handling depends on the steering context (e.g., tool call vs. model response).

## Interrupt

```python
class Interrupt(BaseModel)
```

Defined in: [src/strands/vended\_plugins/steering/core/action.py:50](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/steering/core/action.py#L50)

Pause execution for human input via interrupt system.

Execution is paused and human input is requested through Strands’ interrupt system. The human can approve or deny the operation, and their decision determines whether execution continues or is cancelled.

#### ToolSteeringAction

Steering actions valid for tool steering (steer\_before\_tool).

-   Proceed: Allow tool execution to continue
-   Guide: Cancel tool and provide feedback for alternative approaches
-   Interrupt: Pause for human input before tool execution

#### ModelSteeringAction

Steering actions valid for model steering (steer\_after\_model).

-   Proceed: Accept model response without modification
-   Guide: Discard model response and retry with guidance