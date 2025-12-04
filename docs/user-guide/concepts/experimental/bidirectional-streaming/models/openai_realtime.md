# OpenAI Realtime [Experimental]

{{ experimental_feature_warning() }}

The [OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime) is a speech-to-speech interface that enables low-latency, natural voice conversations with AI. Key features include:

- **Bidirectional Interaction**: The user and the model can provide input and output at the same time.
- **Interruptibility**: Allows users to interrupt the AI mid-response, like in human conversations.
- **Multimodal Streaming**: The API supports streaming of text and audio data.
- **Tool Use and Function Calling**: Can use external tools to perform actions and get context while maintaining a real-time connection.
- **Secure Authentication**: Uses tokens for secure client-side authentication. 

## Usage

```Python
import asyncio

from strands.experimental.bidi import BidiAgent
from strands.experimental.bidi.io import BidiAudioIO, BidiTextIO
from strands.experimental.bidi.models import BidiOpenAIRealtimeModel
from strands.experimental.bidi.tools import stop_conversation

from strands_tools import calculator


async def main() -> None:
    model = BidiOpenAIRealtimeModel(
        model_id="gpt-realtime",
        provider_config={
            "audio": {
                "voice": "coral",
            },
        },
        client_config={"api_key": "<OPENAI_API_KEY>"},
    )
    # stop_conversation tool allows user to verbally stop agent execution.
    agent = BidiAgent(model=model, tools=[calculator, stop_conversation])

    audio_io = BidiAudioIO()
    text_io = BidiTextIO()
    await agent.run(inputs=[audio_io.input()], outputs=[audio_io.output(), text_io.output()])


if __name__ == "__main__":
    asyncio.run(main())
```

## Configuration

### Client Configs

| Parameter | Description | Example | Options |
| --------- | ----------- | ------- | ------- |
| `api_key` | OpenAI API key used for authentication | `sk-...` | [reference](https://platform.openai.com/docs/api-reference/authentication) |
| `organization` | Organization associated with the connection. Used for authentication if required. | `myorg` | [reference](https://platform.openai.com/docs/api-reference/authentication)
| `project` | Project associated with the connection. Used for authentication if required. | `myproj` | [reference](https://platform.openai.com/docs/api-reference/authentication)
| `timeout_s` | OpenAI documents a 60 minute limit on realtime sessions ([docs](https://platform.openai.com/docs/guides/realtime-conversations#session-lifecycle-events)). However, OpenAI does not emit any warnings when approaching the limit. As a workaround, we allow users to configure a timeout (in seconds) on the client side to gracefully handle the connection closure. | `3000` | `[1, 3000]` (in seconds)

### Provider Configs

| Parameter | Description | Example | Options |
| --------- | ----------- | ------- | ------- |
| `audio` | `AudioConfig` instance. | `{"voice": "coral"}` | [reference](../../../../../api-reference/experimental/bidi/types.md#strands.experimental.bidi.types.model.AudioConfig) |
| `inference` | Dict of inference fields supported in the OpenAI `session.update` event. | `{"max_output_tokens": 4096}` | [reference](https://platform.openai.com/docs/api-reference/realtime-client-events/session/update)

For the list of supported voices, see [here](https://platform.openai.com/docs/guides/realtime-conversations#voice-options).

## References

- [OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference/realtime)
- [Provider API Reference](../../../../../api-reference/experimental/bidi/models.md#strands.experimental.bidi.models.openai_realtime.BidiOpenAIRealtimeModel)
