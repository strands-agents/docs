Bidirectional streaming types for real-time audio/text conversations.

Type definitions for bidirectional streaming that extends Strands’ existing streaming capabilities with real-time audio and persistent connection support.

Key features:

-   Audio input/output events with standardized formats
-   Interruption detection and handling
-   Connection lifecycle management
-   Provider-agnostic event types
-   Type-safe discriminated unions with TypedEvent
-   JSON-serializable events (audio/images stored as base64 strings)

Audio format normalization:

-   Supports PCM, WAV, Opus, and MP3 formats
-   Standardizes sample rates (16kHz, 24kHz, 48kHz)
-   Normalizes channel configurations (mono/stereo)
-   Abstracts provider-specific encodings
-   Audio data stored as base64-encoded strings for JSON compatibility

#### AudioChannel

Number of audio channels.

-   Mono: 1
-   Stereo: 2

#### AudioFormat

Audio encoding format.

#### AudioSampleRate

Audio sample rate in Hz.

#### Role

Role of a message sender.

-   “user”: Messages from the user to the assistant.
-   “assistant”: Messages from the assistant to the user.

#### StopReason

Reason for the model ending its response generation.

-   “complete”: Model completed its response.
-   “error”: Model encountered an error.
-   “interrupted”: Model was interrupted by the user.
-   “tool\_use”: Model is requesting a tool use.

## BidiTextInputEvent

```python
class BidiTextInputEvent(TypedEvent)
```

Defined in: [src/strands/experimental/bidi/types/events.py:64](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L64)

Text input event for sending text to the model.

Used for sending text content through the send() method.

**Arguments**:

-   `text` - The text content to send to the model.
-   `role` - The role of the message sender (default: “user”).

#### \_\_init\_\_

```python
def __init__(text: str, role: Role = "user")
```

Defined in: [src/strands/experimental/bidi/types/events.py:74](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L74)

Initialize text input event.

#### text

```python
@property
def text() -> str
```

Defined in: [src/strands/experimental/bidi/types/events.py:85](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L85)

The text content to send to the model.

#### role

```python
@property
def role() -> Role
```

Defined in: [src/strands/experimental/bidi/types/events.py:90](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L90)

The role of the message sender.

## BidiAudioInputEvent

```python
class BidiAudioInputEvent(TypedEvent)
```

Defined in: [src/strands/experimental/bidi/types/events.py:95](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L95)

Audio input event for sending audio to the model.

Used for sending audio data through the send() method.

**Arguments**:

-   `audio` - Base64-encoded audio string to send to model.
-   `format` - Audio format from SUPPORTED\_AUDIO\_FORMATS.
-   `sample_rate` - Sample rate from SUPPORTED\_SAMPLE\_RATES.
-   `channels` - Channel count from SUPPORTED\_CHANNELS.

#### \_\_init\_\_

```python
def __init__(audio: str, format: AudioFormat | str,
             sample_rate: AudioSampleRate, channels: AudioChannel)
```

Defined in: [src/strands/experimental/bidi/types/events.py:107](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L107)

Initialize audio input event.

#### audio

```python
@property
def audio() -> str
```

Defined in: [src/strands/experimental/bidi/types/events.py:126](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L126)

Base64-encoded audio string.

#### format

```python
@property
def format() -> AudioFormat
```

Defined in: [src/strands/experimental/bidi/types/events.py:131](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L131)

Audio encoding format.

#### sample\_rate

```python
@property
def sample_rate() -> AudioSampleRate
```

Defined in: [src/strands/experimental/bidi/types/events.py:136](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L136)

Number of audio samples per second in Hz.

#### channels

```python
@property
def channels() -> AudioChannel
```

Defined in: [src/strands/experimental/bidi/types/events.py:141](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L141)

Number of audio channels (1=mono, 2=stereo).

## BidiImageInputEvent

```python
class BidiImageInputEvent(TypedEvent)
```

Defined in: [src/strands/experimental/bidi/types/events.py:146](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L146)

Image input event for sending images/video frames to the model.

Used for sending image data through the send() method.

**Arguments**:

-   `image` - Base64-encoded image string.
-   `mime_type` - MIME type (e.g., “image/jpeg”, “image/png”).

#### \_\_init\_\_

```python
def __init__(image: str, mime_type: str)
```

Defined in: [src/strands/experimental/bidi/types/events.py:156](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L156)

Initialize image input event.

#### image

```python
@property
def image() -> str
```

Defined in: [src/strands/experimental/bidi/types/events.py:171](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L171)

Base64-encoded image string.

#### mime\_type

```python
@property
def mime_type() -> str
```

Defined in: [src/strands/experimental/bidi/types/events.py:176](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L176)

MIME type of the image (e.g., “image/jpeg”, “image/png”).

## BidiConnectionStartEvent

```python
class BidiConnectionStartEvent(TypedEvent)
```

Defined in: [src/strands/experimental/bidi/types/events.py:186](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L186)

Streaming connection established and ready for interaction.

**Arguments**:

-   `connection_id` - Unique identifier for this streaming connection.
-   `model` - Model identifier (e.g., “gpt-realtime”, “gemini-2.0-flash-live”).

#### \_\_init\_\_

```python
def __init__(connection_id: str, model: str)
```

Defined in: [src/strands/experimental/bidi/types/events.py:194](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L194)

Initialize connection start event.

#### connection\_id

```python
@property
def connection_id() -> str
```

Defined in: [src/strands/experimental/bidi/types/events.py:205](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L205)

Unique identifier for this streaming connection.

#### model

```python
@property
def model() -> str
```

Defined in: [src/strands/experimental/bidi/types/events.py:210](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L210)

Model identifier (e.g., ‘gpt-realtime’, ‘gemini-2.0-flash-live’).

## BidiConnectionRestartEvent

```python
class BidiConnectionRestartEvent(TypedEvent)
```

Defined in: [src/strands/experimental/bidi/types/events.py:215](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L215)

Agent is restarting the model connection after timeout.

#### \_\_init\_\_

```python
def __init__(timeout_error: "BidiModelTimeoutError")
```

Defined in: [src/strands/experimental/bidi/types/events.py:218](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L218)

Initialize.

**Arguments**:

-   `timeout_error` - Timeout error reported by the model.

#### timeout\_error

```python
@property
def timeout_error() -> "BidiModelTimeoutError"
```

Defined in: [src/strands/experimental/bidi/types/events.py:232](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L232)

Model timeout error.

## BidiResponseStartEvent

```python
class BidiResponseStartEvent(TypedEvent)
```

Defined in: [src/strands/experimental/bidi/types/events.py:237](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L237)

Model starts generating a response.

**Arguments**:

-   `response_id` - Unique identifier for this response (used in response.complete).

#### \_\_init\_\_

```python
def __init__(response_id: str)
```

Defined in: [src/strands/experimental/bidi/types/events.py:244](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L244)

Initialize response start event.

#### response\_id

```python
@property
def response_id() -> str
```

Defined in: [src/strands/experimental/bidi/types/events.py:249](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L249)

Unique identifier for this response.

## BidiAudioStreamEvent

```python
class BidiAudioStreamEvent(TypedEvent)
```

Defined in: [src/strands/experimental/bidi/types/events.py:254](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L254)

Streaming audio output from the model.

**Arguments**:

-   `audio` - Base64-encoded audio string.
-   `format` - Audio encoding format.
-   `sample_rate` - Number of audio samples per second in Hz.
-   `channels` - Number of audio channels (1=mono, 2=stereo).

#### \_\_init\_\_

```python
def __init__(audio: str, format: AudioFormat, sample_rate: AudioSampleRate,
             channels: AudioChannel)
```

Defined in: [src/strands/experimental/bidi/types/events.py:264](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L264)

Initialize audio stream event.

#### audio

```python
@property
def audio() -> str
```

Defined in: [src/strands/experimental/bidi/types/events.py:283](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L283)

Base64-encoded audio string.

#### format

```python
@property
def format() -> AudioFormat
```

Defined in: [src/strands/experimental/bidi/types/events.py:288](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L288)

Audio encoding format.

#### sample\_rate

```python
@property
def sample_rate() -> AudioSampleRate
```

Defined in: [src/strands/experimental/bidi/types/events.py:293](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L293)

Number of audio samples per second in Hz.

#### channels

```python
@property
def channels() -> AudioChannel
```

Defined in: [src/strands/experimental/bidi/types/events.py:298](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L298)

Number of audio channels (1=mono, 2=stereo).

## BidiTranscriptStreamEvent

```python
class BidiTranscriptStreamEvent(ModelStreamEvent)
```

Defined in: [src/strands/experimental/bidi/types/events.py:303](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L303)

Audio transcription streaming (user or assistant speech).

Supports incremental transcript updates for providers that send partial transcripts before the final version.

**Arguments**:

-   `delta` - The incremental transcript change (ContentBlockDelta).
-   `text` - The delta text (same as delta content for convenience).
-   `role` - Who is speaking (“user” or “assistant”).
-   `is_final` - Whether this is the final/complete transcript.
-   `current_transcript` - The accumulated transcript text so far (None for first delta).

#### \_\_init\_\_

```python
def __init__(delta: ContentBlockDelta,
             text: str,
             role: Role,
             is_final: bool,
             current_transcript: str | None = None)
```

Defined in: [src/strands/experimental/bidi/types/events.py:317](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L317)

Initialize transcript stream event.

#### delta

```python
@property
def delta() -> ContentBlockDelta
```

Defined in: [src/strands/experimental/bidi/types/events.py:338](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L338)

The incremental transcript change.

#### text

```python
@property
def text() -> str
```

Defined in: [src/strands/experimental/bidi/types/events.py:343](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L343)

The text content to send to the model.

#### role

```python
@property
def role() -> Role
```

Defined in: [src/strands/experimental/bidi/types/events.py:348](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L348)

The role of the message sender.

#### is\_final

```python
@property
def is_final() -> bool
```

Defined in: [src/strands/experimental/bidi/types/events.py:353](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L353)

Whether this is the final/complete transcript.

#### current\_transcript

```python
@property
def current_transcript() -> str | None
```

Defined in: [src/strands/experimental/bidi/types/events.py:358](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L358)

The accumulated transcript text so far.

## BidiInterruptionEvent

```python
class BidiInterruptionEvent(TypedEvent)
```

Defined in: [src/strands/experimental/bidi/types/events.py:363](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L363)

Model generation was interrupted.

**Arguments**:

-   `reason` - Why the interruption occurred.

#### \_\_init\_\_

```python
def __init__(reason: Literal["user_speech", "error"])
```

Defined in: [src/strands/experimental/bidi/types/events.py:370](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L370)

Initialize interruption event.

#### reason

```python
@property
def reason() -> str
```

Defined in: [src/strands/experimental/bidi/types/events.py:380](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L380)

Why the interruption occurred.

## BidiResponseCompleteEvent

```python
class BidiResponseCompleteEvent(TypedEvent)
```

Defined in: [src/strands/experimental/bidi/types/events.py:385](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L385)

Model finished generating response.

**Arguments**:

-   `response_id` - ID of the response that completed (matches response.start).
-   `stop_reason` - Why the response ended.

#### \_\_init\_\_

```python
def __init__(response_id: str, stop_reason: StopReason)
```

Defined in: [src/strands/experimental/bidi/types/events.py:393](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L393)

Initialize response complete event.

#### response\_id

```python
@property
def response_id() -> str
```

Defined in: [src/strands/experimental/bidi/types/events.py:408](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L408)

Unique identifier for this response.

#### stop\_reason

```python
@property
def stop_reason() -> StopReason
```

Defined in: [src/strands/experimental/bidi/types/events.py:413](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L413)

Why the response ended.

## ModalityUsage

```python
class ModalityUsage(dict)
```

Defined in: [src/strands/experimental/bidi/types/events.py:418](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L418)

Token usage for a specific modality.

**Attributes**:

-   `modality` - Type of content.
-   `input_tokens` - Tokens used for this modality’s input.
-   `output_tokens` - Tokens used for this modality’s output.

## BidiUsageEvent

```python
class BidiUsageEvent(TypedEvent)
```

Defined in: [src/strands/experimental/bidi/types/events.py:432](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L432)

Token usage event with modality breakdown for bidirectional streaming.

Tracks token consumption across different modalities (audio, text, images) during bidirectional streaming sessions.

**Arguments**:

-   `input_tokens` - Total tokens used for all input modalities.
-   `output_tokens` - Total tokens used for all output modalities.
-   `total_tokens` - Sum of input and output tokens.
-   `modality_details` - Optional list of token usage per modality.
-   `cache_read_input_tokens` - Optional tokens read from cache.
-   `cache_write_input_tokens` - Optional tokens written to cache.

#### \_\_init\_\_

```python
def __init__(input_tokens: int,
             output_tokens: int,
             total_tokens: int,
             modality_details: list[ModalityUsage] | None = None,
             cache_read_input_tokens: int | None = None,
             cache_write_input_tokens: int | None = None)
```

Defined in: [src/strands/experimental/bidi/types/events.py:447](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L447)

Initialize usage event.

#### input\_tokens

```python
@property
def input_tokens() -> int
```

Defined in: [src/strands/experimental/bidi/types/events.py:472](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L472)

Total tokens used for all input modalities.

#### output\_tokens

```python
@property
def output_tokens() -> int
```

Defined in: [src/strands/experimental/bidi/types/events.py:477](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L477)

Total tokens used for all output modalities.

#### total\_tokens

```python
@property
def total_tokens() -> int
```

Defined in: [src/strands/experimental/bidi/types/events.py:482](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L482)

Sum of input and output tokens.

#### modality\_details

```python
@property
def modality_details() -> list[ModalityUsage]
```

Defined in: [src/strands/experimental/bidi/types/events.py:487](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L487)

Optional list of token usage per modality.

#### cache\_read\_input\_tokens

```python
@property
def cache_read_input_tokens() -> int | None
```

Defined in: [src/strands/experimental/bidi/types/events.py:492](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L492)

Optional tokens read from cache.

#### cache\_write\_input\_tokens

```python
@property
def cache_write_input_tokens() -> int | None
```

Defined in: [src/strands/experimental/bidi/types/events.py:497](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L497)

Optional tokens written to cache.

## BidiConnectionCloseEvent

```python
class BidiConnectionCloseEvent(TypedEvent)
```

Defined in: [src/strands/experimental/bidi/types/events.py:502](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L502)

Streaming connection closed.

**Arguments**:

-   `connection_id` - Unique identifier for this streaming connection (matches BidiConnectionStartEvent).
-   `reason` - Why the connection was closed.

#### \_\_init\_\_

```python
def __init__(connection_id: str,
             reason: Literal["client_disconnect", "timeout", "error",
                             "complete", "user_request"])
```

Defined in: [src/strands/experimental/bidi/types/events.py:510](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L510)

Initialize connection close event.

#### connection\_id

```python
@property
def connection_id() -> str
```

Defined in: [src/strands/experimental/bidi/types/events.py:525](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L525)

Unique identifier for this streaming connection.

#### reason

```python
@property
def reason() -> str
```

Defined in: [src/strands/experimental/bidi/types/events.py:530](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L530)

Why the interruption occurred.

## BidiErrorEvent

```python
class BidiErrorEvent(TypedEvent)
```

Defined in: [src/strands/experimental/bidi/types/events.py:535](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L535)

Error occurred during the session.

Stores the full Exception object as an instance attribute for debugging while keeping the event dict JSON-serializable. The exception can be accessed via the `error` property for re-raising or type-based error handling.

**Arguments**:

-   `error` - The exception that occurred.
-   `details` - Optional additional error information.

#### \_\_init\_\_

```python
def __init__(error: Exception, details: dict[str, Any] | None = None)
```

Defined in: [src/strands/experimental/bidi/types/events.py:547](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L547)

Initialize error event.

#### error

```python
@property
def error() -> Exception
```

Defined in: [src/strands/experimental/bidi/types/events.py:566](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L566)

The original exception that occurred.

Can be used for re-raising or type-based error handling.

#### code

```python
@property
def code() -> str
```

Defined in: [src/strands/experimental/bidi/types/events.py:574](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L574)

Error code derived from exception class name.

#### message

```python
@property
def message() -> str
```

Defined in: [src/strands/experimental/bidi/types/events.py:579](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L579)

Human-readable error message from the exception.

#### details

```python
@property
def details() -> dict[str, Any] | None
```

Defined in: [src/strands/experimental/bidi/types/events.py:584](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/types/events.py#L584)

Additional error context beyond the exception itself.

#### BidiInputEvent

Union of different bidi input event types.

#### BidiOutputEvent

Union of different bidi output event types.