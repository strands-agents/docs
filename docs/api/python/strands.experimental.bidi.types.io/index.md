Protocol for bidirectional streaming IO channels.

Defines callable protocols for input and output channels that can be used with BidiAgent. This approach provides better typing and flexibility by separating input and output concerns into independent callables.

## BidiInput

```python
@runtime_checkable
class BidiInput(Protocol)
```

Defined in: [src/strands/experimental/bidi/types/io.py:17](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/io.py#L17)

Protocol for bidirectional input callables.

Input callables read data from a source (microphone, camera, websocket, etc.) and return events to be sent to the agent.

#### start

```python
async def start(agent: "BidiAgent") -> None
```

Defined in: [src/strands/experimental/bidi/types/io.py:24](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/io.py#L24)

Start input.

#### stop

```python
async def stop() -> None
```

Defined in: [src/strands/experimental/bidi/types/io.py:28](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/io.py#L28)

Stop input.

#### \_\_call\_\_

```python
def __call__() -> Awaitable[BidiInputEvent]
```

Defined in: [src/strands/experimental/bidi/types/io.py:32](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/io.py#L32)

Read input data from the source.

**Returns**:

Awaitable that resolves to an input event (audio, text, image, etc.)

## BidiOutput

```python
@runtime_checkable
class BidiOutput(Protocol)
```

Defined in: [src/strands/experimental/bidi/types/io.py:42](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/io.py#L42)

Protocol for bidirectional output callables.

Output callables receive events from the agent and handle them appropriately (play audio, display text, send over websocket, etc.).

#### start

```python
async def start(agent: "BidiAgent") -> None
```

Defined in: [src/strands/experimental/bidi/types/io.py:49](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/io.py#L49)

Start output.

#### stop

```python
async def stop() -> None
```

Defined in: [src/strands/experimental/bidi/types/io.py:53](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/io.py#L53)

Stop output.

#### \_\_call\_\_

```python
def __call__(event: BidiOutputEvent) -> Awaitable[None]
```

Defined in: [src/strands/experimental/bidi/types/io.py:57](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/io.py#L57)

Process output events from the agent.

**Arguments**:

-   `event` - Output event from the agent (audio, text, tool calls, etc.)