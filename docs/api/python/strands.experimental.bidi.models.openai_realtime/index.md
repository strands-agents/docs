OpenAI Realtime API provider for Strands bidirectional streaming.

Provides real-time audio and text communication through OpenAI’s Realtime API with WebSocket connections, voice activity detection, and function calling.

#### OPENAI\_MAX\_TIMEOUT\_S

Max timeout before closing connection.

OpenAI documents a 60 minute limit on realtime sessions ([docs](https://platform.openai.com/docs/guides/realtime-conversations#session-lifecycle-events)). However, OpenAI does not emit any warnings when approaching the limit. As a workaround, we configure a max timeout client side to gracefully handle the connection closure. We set the max to 50 minutes to provide enough buffer before hitting the real limit.

## BidiOpenAIRealtimeModel

```python
class BidiOpenAIRealtimeModel(BidiModel)
```

Defined in: [src/strands/experimental/bidi/models/openai\_realtime.py:79](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/models/openai_realtime.py#L79)

OpenAI Realtime API implementation for bidirectional streaming.

Combines model configuration and connection state in a single class. Manages WebSocket connection to OpenAI’s Realtime API with automatic VAD, function calling, and event conversion to Strands format.

#### \_\_init\_\_

```python
def __init__(model_id: str = DEFAULT_MODEL,
             provider_config: dict[str, Any] | None = None,
             client_config: dict[str, Any] | None = None,
             **kwargs: Any) -> None
```

Defined in: [src/strands/experimental/bidi/models/openai\_realtime.py:90](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/models/openai_realtime.py#L90)

Initialize OpenAI Realtime bidirectional model.

**Arguments**:

-   `model_id` - Model identifier (default: gpt-realtime)
-   `provider_config` - Model behavior (audio, instructions, turn\_detection, etc.)
-   `client_config` - Authentication (api\_key, organization, project) Falls back to OPENAI\_API\_KEY, OPENAI\_ORGANIZATION, OPENAI\_PROJECT env vars
-   `**kwargs` - Reserved for future parameters.

#### start

```python
async def start(system_prompt: str | None = None,
                tools: list[ToolSpec] | None = None,
                messages: Messages | None = None,
                **kwargs: Any) -> None
```

Defined in: [src/strands/experimental/bidi/models/openai\_realtime.py:180](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/models/openai_realtime.py#L180)

Establish bidirectional connection to OpenAI Realtime API.

**Arguments**:

-   `system_prompt` - System instructions for the model.
-   `tools` - List of tools available to the model.
-   `messages` - Conversation history to initialize with.
-   `**kwargs` - Additional configuration options.

#### receive

```python
async def receive() -> AsyncGenerator[BidiOutputEvent, None]
```

Defined in: [src/strands/experimental/bidi/models/openai\_realtime.py:423](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/models/openai_realtime.py#L423)

Receive OpenAI events and convert to Strands TypedEvent format.

#### send

```python
async def send(content: BidiInputEvent | ToolResultEvent) -> None
```

Defined in: [src/strands/experimental/bidi/models/openai\_realtime.py:703](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/models/openai_realtime.py#L703)

Unified send method for all content types. Sends the given content to OpenAI.

Dispatches to appropriate internal handler based on content type.

**Arguments**:

-   `content` - Typed event (BidiTextInputEvent, BidiAudioInputEvent, BidiImageInputEvent, or ToolResultEvent).

**Raises**:

-   `ValueError` - If content type not supported (e.g., image content).

#### stop

```python
async def stop() -> None
```

Defined in: [src/strands/experimental/bidi/models/openai\_realtime.py:772](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/models/openai_realtime.py#L772)

Close session and cleanup resources.