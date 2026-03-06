Hook events emitted as part of invoking Agents.

This module defines the events that are emitted as Agents run through the lifecycle of a request.

## AgentInitializedEvent

```python
@dataclass
class AgentInitializedEvent(HookEvent)
```

Defined in: [src/strands/hooks/events.py:26](https://github.com/strands-agents/sdk-python/blob/main/src/strands/hooks/events.py#L26)

Event triggered when an agent has finished initialization.

This event is fired after the agent has been fully constructed and all built-in components have been initialized. Hook providers can use this event to perform setup tasks that require a fully initialized agent.

## BeforeInvocationEvent

```python
@dataclass
class BeforeInvocationEvent(HookEvent)
```

Defined in: [src/strands/hooks/events.py:38](https://github.com/strands-agents/sdk-python/blob/main/src/strands/hooks/events.py#L38)

Event triggered at the beginning of a new agent request.

This event is fired before the agent begins processing a new user request, before any model inference or tool execution occurs. Hook providers can use this event to perform request-level setup, logging, or validation.

This event is triggered at the beginning of the following api calls:

-   Agent.**call**
-   Agent.stream\_async
-   Agent.structured\_output

**Attributes**:

-   `invocation_state` - State and configuration passed through the agent invocation. This can include shared context for multi-agent coordination, request tracking, and dynamic configuration.
-   `messages` - The input messages for this invocation. Can be modified by hooks to redact or transform content before processing.

## AfterInvocationEvent

```python
@dataclass
class AfterInvocationEvent(HookEvent)
```

Defined in: [src/strands/hooks/events.py:66](https://github.com/strands-agents/sdk-python/blob/main/src/strands/hooks/events.py#L66)

Event triggered at the end of an agent request.

This event is fired after the agent has completed processing a request, regardless of whether it completed successfully or encountered an error. Hook providers can use this event for cleanup, logging, or state persistence.

Note: This event uses reverse callback ordering, meaning callbacks registered later will be invoked first during cleanup.

This event is triggered at the end of the following api calls:

-   Agent.**call**
-   Agent.stream\_async
-   Agent.structured\_output

**Attributes**:

-   `invocation_state` - State and configuration passed through the agent invocation. This can include shared context for multi-agent coordination, request tracking, and dynamic configuration.
-   `result` - The result of the agent invocation, if available. This will be None when invoked from structured\_output methods, as those return typed output directly rather than AgentResult.

#### should\_reverse\_callbacks

```python
@property
def should_reverse_callbacks() -> bool
```

Defined in: [src/strands/hooks/events.py:94](https://github.com/strands-agents/sdk-python/blob/main/src/strands/hooks/events.py#L94)

True to invoke callbacks in reverse order.

## MessageAddedEvent

```python
@dataclass
class MessageAddedEvent(HookEvent)
```

Defined in: [src/strands/hooks/events.py:100](https://github.com/strands-agents/sdk-python/blob/main/src/strands/hooks/events.py#L100)

Event triggered when a message is added to the agent’s conversation.

This event is fired whenever the agent adds a new message to its internal message history, including user messages, assistant responses, and tool results. Hook providers can use this event for logging, monitoring, or implementing custom message processing logic.

Note: This event is only triggered for messages added by the framework itself, not for messages manually added by tools or external code.

**Attributes**:

-   `message` - The message that was added to the conversation history.

## BeforeToolCallEvent

```python
@dataclass
class BeforeToolCallEvent(HookEvent, _Interruptible)
```

Defined in: [src/strands/hooks/events.py:119](https://github.com/strands-agents/sdk-python/blob/main/src/strands/hooks/events.py#L119)

Event triggered before a tool is invoked.

This event is fired just before the agent executes a tool, allowing hook providers to inspect, modify, or replace the tool that will be executed. The selected\_tool can be modified by hook callbacks to change which tool gets executed.

**Attributes**:

-   `selected_tool` - The tool that will be invoked. Can be modified by hooks to change which tool gets executed. This may be None if tool lookup failed.
-   `tool_use` - The tool parameters that will be passed to selected\_tool.
-   `invocation_state` - Keyword arguments that will be passed to the tool.
-   `cancel_tool` - A user defined message that when set, will cancel the tool call. The message will be placed into a tool result with an error status. If set to `True`, Strands will cancel the tool call and use a default cancel message.

## AfterToolCallEvent

```python
@dataclass
class AfterToolCallEvent(HookEvent)
```

Defined in: [src/strands/hooks/events.py:159](https://github.com/strands-agents/sdk-python/blob/main/src/strands/hooks/events.py#L159)

Event triggered after a tool invocation completes.

This event is fired after the agent has finished executing a tool, regardless of whether the execution was successful or resulted in an error. Hook providers can use this event for cleanup, logging, or post-processing.

Note: This event uses reverse callback ordering, meaning callbacks registered later will be invoked first during cleanup.

Tool Retrying: When `retry` is set to True by a hook callback, the tool executor will discard the current tool result and invoke the tool again. This has important implications for streaming consumers:

-   ToolStreamEvents (intermediate streaming events) from the discarded tool execution will have already been emitted to callers before the retry occurs. Agent invokers consuming streamed events should be prepared to handle this scenario, potentially by tracking retry state or implementing idempotent event processing
-   ToolResultEvent is NOT emitted for discarded attempts - only the final attempt’s result is emitted and added to the conversation history

**Attributes**:

-   `selected_tool` - The tool that was invoked. It may be None if tool lookup failed.
-   `tool_use` - The tool parameters that were passed to the tool invoked.
-   `invocation_state` - Keyword arguments that were passed to the tool
-   `result` - The result of the tool invocation. Either a ToolResult on success or an Exception if the tool execution failed.
-   `cancel_message` - The cancellation message if the user cancelled the tool call.
-   `retry` - Whether to retry the tool invocation. Can be set by hook callbacks to trigger a retry. When True, the current result is discarded and the tool is called again. Defaults to False.

#### should\_reverse\_callbacks

```python
@property
def should_reverse_callbacks() -> bool
```

Defined in: [src/strands/hooks/events.py:205](https://github.com/strands-agents/sdk-python/blob/main/src/strands/hooks/events.py#L205)

True to invoke callbacks in reverse order.

## BeforeModelCallEvent

```python
@dataclass
class BeforeModelCallEvent(HookEvent)
```

Defined in: [src/strands/hooks/events.py:211](https://github.com/strands-agents/sdk-python/blob/main/src/strands/hooks/events.py#L211)

Event triggered before the model is invoked.

This event is fired just before the agent calls the model for inference, allowing hook providers to inspect or modify the messages and configuration that will be sent to the model.

Note: This event is not fired for invocations to structured\_output.

**Attributes**:

-   `invocation_state` - State and configuration passed through the agent invocation. This can include shared context for multi-agent coordination, request tracking, and dynamic configuration.

## AfterModelCallEvent

```python
@dataclass
class AfterModelCallEvent(HookEvent)
```

Defined in: [src/strands/hooks/events.py:230](https://github.com/strands-agents/sdk-python/blob/main/src/strands/hooks/events.py#L230)

Event triggered after the model invocation completes.

This event is fired after the agent has finished calling the model, regardless of whether the invocation was successful or resulted in an error. Hook providers can use this event for cleanup, logging, or post-processing.

Note: This event uses reverse callback ordering, meaning callbacks registered later will be invoked first during cleanup.

Note: This event is not fired for invocations to structured\_output.

Model Retrying: When `retry_model` is set to True by a hook callback, the agent will discard the current model response and invoke the model again. This has important implications for streaming consumers:

-   Streaming events from the discarded response will have already been emitted to callers before the retry occurs. Agent invokers consuming streamed events should be prepared to handle this scenario, potentially by tracking retry state or implementing idempotent event processing
-   The original model message is thrown away internally and not added to the conversation history

**Attributes**:

-   `invocation_state` - State and configuration passed through the agent invocation. This can include shared context for multi-agent coordination, request tracking, and dynamic configuration.
-   `stop_response` - The model response data if invocation was successful, None if failed.
-   `exception` - Exception if the model invocation failed, None if successful.
-   `retry` - Whether to retry the model invocation. Can be set by hook callbacks to trigger a retry. When True, the current response is discarded and the model is called again. Defaults to False.

## ModelStopResponse

```python
@dataclass
class ModelStopResponse()
```

Defined in: [src/strands/hooks/events.py:266](https://github.com/strands-agents/sdk-python/blob/main/src/strands/hooks/events.py#L266)

Model response data from successful invocation.

**Attributes**:

-   `stop_reason` - The reason the model stopped generating.
-   `message` - The generated message from the model.

#### should\_reverse\_callbacks

```python
@property
def should_reverse_callbacks() -> bool
```

Defined in: [src/strands/hooks/events.py:286](https://github.com/strands-agents/sdk-python/blob/main/src/strands/hooks/events.py#L286)

True to invoke callbacks in reverse order.

## MultiAgentInitializedEvent

```python
@dataclass
class MultiAgentInitializedEvent(BaseHookEvent)
```

Defined in: [src/strands/hooks/events.py:293](https://github.com/strands-agents/sdk-python/blob/main/src/strands/hooks/events.py#L293)

Event triggered when multi-agent orchestrator initialized.

**Attributes**:

-   `source` - The multi-agent orchestrator instance
-   `invocation_state` - Configuration that user passes in

## BeforeNodeCallEvent

```python
@dataclass
class BeforeNodeCallEvent(BaseHookEvent, _Interruptible)
```

Defined in: [src/strands/hooks/events.py:306](https://github.com/strands-agents/sdk-python/blob/main/src/strands/hooks/events.py#L306)

Event triggered before individual node execution starts.

**Attributes**:

-   `source` - The multi-agent orchestrator instance
-   `node_id` - ID of the node about to execute
-   `invocation_state` - Configuration that user passes in
-   `cancel_node` - A user defined message that when set, will cancel the node execution with status FAILED. The message will be emitted under a MultiAgentNodeCancel event. If set to `True`, Strands will cancel the node using a default cancel message.

## AfterNodeCallEvent

```python
@dataclass
class AfterNodeCallEvent(BaseHookEvent)
```

Defined in: [src/strands/hooks/events.py:342](https://github.com/strands-agents/sdk-python/blob/main/src/strands/hooks/events.py#L342)

Event triggered after individual node execution completes.

**Attributes**:

-   `source` - The multi-agent orchestrator instance
-   `node_id` - ID of the node that just completed execution
-   `invocation_state` - Configuration that user passes in

#### should\_reverse\_callbacks

```python
@property
def should_reverse_callbacks() -> bool
```

Defined in: [src/strands/hooks/events.py:356](https://github.com/strands-agents/sdk-python/blob/main/src/strands/hooks/events.py#L356)

True to invoke callbacks in reverse order.

## BeforeMultiAgentInvocationEvent

```python
@dataclass
class BeforeMultiAgentInvocationEvent(BaseHookEvent)
```

Defined in: [src/strands/hooks/events.py:362](https://github.com/strands-agents/sdk-python/blob/main/src/strands/hooks/events.py#L362)

Event triggered before orchestrator execution starts.

**Attributes**:

-   `source` - The multi-agent orchestrator instance
-   `invocation_state` - Configuration that user passes in

## AfterMultiAgentInvocationEvent

```python
@dataclass
class AfterMultiAgentInvocationEvent(BaseHookEvent)
```

Defined in: [src/strands/hooks/events.py:375](https://github.com/strands-agents/sdk-python/blob/main/src/strands/hooks/events.py#L375)

Event triggered after orchestrator execution completes.

**Attributes**:

-   `source` - The multi-agent orchestrator instance
-   `invocation_state` - Configuration that user passes in

#### should\_reverse\_callbacks

```python
@property
def should_reverse_callbacks() -> bool
```

Defined in: [src/strands/hooks/events.py:387](https://github.com/strands-agents/sdk-python/blob/main/src/strands/hooks/events.py#L387)

True to invoke callbacks in reverse order.