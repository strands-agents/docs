Send and receive audio data from devices.

Reads user audio from input device and sends agent audio to output device using PyAudio. If a user interrupts the agent, the output buffer is cleared to stop playback.

Audio configuration is provided by the model via agent.model.config\[“audio”\].

## \_BidiAudioBuffer

```python
class _BidiAudioBuffer()
```

Defined in: [src/strands/experimental/bidi/io/audio.py:26](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L26)

Buffer chunks of audio data between agent and PyAudio.

#### \_\_init\_\_

```python
def __init__(size: int | None = None)
```

Defined in: [src/strands/experimental/bidi/io/audio.py:32](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L32)

Initialize buffer settings.

**Arguments**:

-   `size` - Size of the buffer (default: unbounded).

#### start

```python
def start() -> None
```

Defined in: [src/strands/experimental/bidi/io/audio.py:40](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L40)

Setup buffer.

#### stop

```python
def stop() -> None
```

Defined in: [src/strands/experimental/bidi/io/audio.py:45](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L45)

Tear down buffer.

#### put

```python
def put(chunk: bytes) -> None
```

Defined in: [src/strands/experimental/bidi/io/audio.py:56](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L56)

Put data chunk into buffer.

If full, removes the oldest chunk.

#### get

```python
def get(byte_count: int | None = None) -> bytes
```

Defined in: [src/strands/experimental/bidi/io/audio.py:71](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L71)

Get the number of bytes specified from the buffer.

**Arguments**:

-   `byte_count` - Number of bytes to get from buffer.
    
    -   If the number of bytes specified is not available, the return is padded with silence.
    -   If the number of bytes is not specified, get the first chunk put in the buffer.

**Returns**:

Specified number of bytes.

#### clear

```python
def clear() -> None
```

Defined in: [src/strands/experimental/bidi/io/audio.py:101](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L101)

Clear the buffer.

## \_BidiAudioInput

```python
class _BidiAudioInput(BidiInput)
```

Defined in: [src/strands/experimental/bidi/io/audio.py:110](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L110)

Handle audio input from user.

**Attributes**:

-   `_audio` - PyAudio instance for audio system access.
-   `_stream` - Audio input stream.
-   `_buffer` - Buffer for sharing audio data between agent and PyAudio.

#### \_\_init\_\_

```python
def __init__(config: dict[str, Any]) -> None
```

Defined in: [src/strands/experimental/bidi/io/audio.py:126](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L126)

Extract configs.

#### start

```python
async def start(agent: "BidiAgent") -> None
```

Defined in: [src/strands/experimental/bidi/io/audio.py:134](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L134)

Start input stream.

**Arguments**:

-   `agent` - The BidiAgent instance, providing access to model configuration.

#### stop

```python
async def stop() -> None
```

Defined in: [src/strands/experimental/bidi/io/audio.py:160](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L160)

Stop input stream.

#### \_\_call\_\_

```python
async def __call__() -> BidiAudioInputEvent
```

Defined in: [src/strands/experimental/bidi/io/audio.py:173](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L173)

Read audio from input stream.

## \_BidiAudioOutput

```python
class _BidiAudioOutput(BidiOutput)
```

Defined in: [src/strands/experimental/bidi/io/audio.py:190](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L190)

Handle audio output from bidi agent.

**Attributes**:

-   `_audio` - PyAudio instance for audio system access.
-   `_stream` - Audio output stream.
-   `_buffer` - Buffer for sharing audio data between agent and PyAudio.

#### \_\_init\_\_

```python
def __init__(config: dict[str, Any]) -> None
```

Defined in: [src/strands/experimental/bidi/io/audio.py:206](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L206)

Extract configs.

#### start

```python
async def start(agent: "BidiAgent") -> None
```

Defined in: [src/strands/experimental/bidi/io/audio.py:214](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L214)

Start output stream.

**Arguments**:

-   `agent` - The BidiAgent instance, providing access to model configuration.

#### stop

```python
async def stop() -> None
```

Defined in: [src/strands/experimental/bidi/io/audio.py:239](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L239)

Stop output stream.

#### \_\_call\_\_

```python
async def __call__(event: BidiOutputEvent) -> None
```

Defined in: [src/strands/experimental/bidi/io/audio.py:252](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L252)

Send audio to output stream.

## BidiAudioIO

```python
class BidiAudioIO()
```

Defined in: [src/strands/experimental/bidi/io/audio.py:270](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L270)

Send and receive audio data from devices.

#### \_\_init\_\_

```python
def __init__(**config: Any) -> None
```

Defined in: [src/strands/experimental/bidi/io/audio.py:273](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L273)

Initialize audio devices.

**Arguments**:

-   `**config` - Optional device configuration:
    
    -   input\_buffer\_size (int): Maximum input buffer size (default: None)
    -   input\_device\_index (int): Specific input device (default: None = system default)
    -   input\_frames\_per\_buffer (int): Input buffer size (default: 512)
    -   output\_buffer\_size (int): Maximum output buffer size (default: None)
    -   output\_device\_index (int): Specific output device (default: None = system default)
    -   output\_frames\_per\_buffer (int): Output buffer size (default: 512)

#### input

```python
def input() -> _BidiAudioInput
```

Defined in: [src/strands/experimental/bidi/io/audio.py:288](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L288)

Return audio processing BidiInput.

#### output

```python
def output() -> _BidiAudioOutput
```

Defined in: [src/strands/experimental/bidi/io/audio.py:292](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/io/audio.py#L292)

Return audio processing BidiOutput.