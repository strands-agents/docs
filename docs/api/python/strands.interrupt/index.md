Human-in-the-loop interrupt system for agent workflows.

## Interrupt

```python
@dataclass
class Interrupt()
```

Defined in: [src/strands/interrupt.py:12](https://github.com/strands-agents/sdk-python/blob/main/src/strands/interrupt.py#L12)

Represents an interrupt that can pause agent execution for human-in-the-loop workflows.

**Attributes**:

-   `id` - Unique identifier.
-   `name` - User defined name.
-   `reason` - User provided reason for raising the interrupt.
-   `response` - Human response provided when resuming the agent after an interrupt.

#### to\_dict

```python
def to_dict() -> dict[str, Any]
```

Defined in: [src/strands/interrupt.py:27](https://github.com/strands-agents/sdk-python/blob/main/src/strands/interrupt.py#L27)

Serialize to dict for session management.

## InterruptException

```python
class InterruptException(Exception)
```

Defined in: [src/strands/interrupt.py:32](https://github.com/strands-agents/sdk-python/blob/main/src/strands/interrupt.py#L32)

Exception raised when human input is required.

#### \_\_init\_\_

```python
def __init__(interrupt: Interrupt) -> None
```

Defined in: [src/strands/interrupt.py:35](https://github.com/strands-agents/sdk-python/blob/main/src/strands/interrupt.py#L35)

Set the interrupt.

## \_InterruptState

```python
@dataclass
class _InterruptState()
```

Defined in: [src/strands/interrupt.py:41](https://github.com/strands-agents/sdk-python/blob/main/src/strands/interrupt.py#L41)

Track the state of interrupt events raised by the user.

Note, interrupt state is cleared after resuming.

**Attributes**:

-   `interrupts` - Interrupts raised by the user.
-   `context` - Additional context associated with an interrupt event.
-   `activated` - True if agent is in an interrupt state, False otherwise.

#### activate

```python
def activate() -> None
```

Defined in: [src/strands/interrupt.py:57](https://github.com/strands-agents/sdk-python/blob/main/src/strands/interrupt.py#L57)

Activate the interrupt state.

#### deactivate

```python
def deactivate() -> None
```

Defined in: [src/strands/interrupt.py:62](https://github.com/strands-agents/sdk-python/blob/main/src/strands/interrupt.py#L62)

Deacitvate the interrupt state.

Interrupts and context are cleared.

#### resume

```python
def resume(prompt: "AgentInput") -> None
```

Defined in: [src/strands/interrupt.py:72](https://github.com/strands-agents/sdk-python/blob/main/src/strands/interrupt.py#L72)

Configure the interrupt state if resuming from an interrupt event.

**Arguments**:

-   `prompt` - User responses if resuming from interrupt.

**Raises**:

-   `TypeError` - If in interrupt state but user did not provide responses.

#### to\_dict

```python
def to_dict() -> dict[str, Any]
```

Defined in: [src/strands/interrupt.py:120](https://github.com/strands-agents/sdk-python/blob/main/src/strands/interrupt.py#L120)

Serialize to dict for session management.

#### from\_dict

```python
@classmethod
def from_dict(cls, data: dict[str, Any]) -> "_InterruptState"
```

Defined in: [src/strands/interrupt.py:129](https://github.com/strands-agents/sdk-python/blob/main/src/strands/interrupt.py#L129)

Initiailize interrupt state from serialized interrupt state.

Interrupt state can be serialized with the `to_dict` method.