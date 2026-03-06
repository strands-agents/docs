Handle text input and output to and from bidi agent.

## \_BidiTextInput

```python
class _BidiTextInput(BidiInput)
```

Defined in: [src/strands/experimental/bidi/io/text.py:20](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/text.py#L20)

Handle text input from user.

#### \_\_init\_\_

```python
def __init__(config: dict[str, Any]) -> None
```

Defined in: [src/strands/experimental/bidi/io/text.py:23](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/text.py#L23)

Extract configs and setup prompt session.

#### \_\_call\_\_

```python
async def __call__() -> BidiTextInputEvent
```

Defined in: [src/strands/experimental/bidi/io/text.py:28](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/text.py#L28)

Read user input from stdin.

## \_BidiTextOutput

```python
class _BidiTextOutput(BidiOutput)
```

Defined in: [src/strands/experimental/bidi/io/text.py:34](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/text.py#L34)

Handle text output from bidi agent.

#### \_\_call\_\_

```python
async def __call__(event: BidiOutputEvent) -> None
```

Defined in: [src/strands/experimental/bidi/io/text.py:37](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/text.py#L37)

Print text events to stdout.

## BidiTextIO

```python
class BidiTextIO()
```

Defined in: [src/strands/experimental/bidi/io/text.py:65](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/text.py#L65)

Handle text input and output to and from bidi agent.

Accepts input from stdin and outputs to stdout.

#### \_\_init\_\_

```python
def __init__(**config: Any) -> None
```

Defined in: [src/strands/experimental/bidi/io/text.py:71](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/text.py#L71)

Initialize I/O.

**Arguments**:

-   `**config` - Optional I/O configurations.
    
    -   input\_prompt (str): Input prompt to display on screen (default: blank)

#### input

```python
def input() -> _BidiTextInput
```

Defined in: [src/strands/experimental/bidi/io/text.py:81](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/text.py#L81)

Return text processing BidiInput.

#### output

```python
def output() -> _BidiTextOutput
```

Defined in: [src/strands/experimental/bidi/io/text.py:85](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/text.py#L85)

Return text processing BidiOutput.