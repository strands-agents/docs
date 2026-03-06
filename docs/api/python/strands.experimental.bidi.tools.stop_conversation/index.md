Tool to gracefully stop a bidirectional connection.

#### stop\_conversation

```python
@tool
def stop_conversation() -> str
```

Defined in: [src/strands/experimental/bidi/tools/stop\_conversation.py:7](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/tools/stop_conversation.py#L7)

Stop the bidirectional conversation gracefully.

Use ONLY when user says “stop conversation” exactly. Do NOT use for: “stop”, “goodbye”, “bye”, “exit”, “quit”, “end” or other farewells or phrases.

**Returns**:

Success message confirming the conversation will end