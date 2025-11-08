# Strands Deepgram

Strands Deepgram extends Strands Agents with advanced speech and audio processing using Deepgram's API.
This tool empowers agents to:

* Transcribe audio with support for 30+ languages and speaker diarization
* Generate natural-sounding speech with multiple voice options
* Perform sentiment analysis, topic detection, and intent recognition

It provides type-safe, modular integration with the Strands ecosystem.
Deepgram is a leading AI-powered speech recognition and audio intelligence platform that provides speech-to-text, text-to-speech, and audio intelligence capabilities for AI agents.

## Installation

Install the Strands Deepgram package by running

```bash
pip install strands-deepgram
```

### Dependencies

Strands Deepgram requires the following packages:

* deepgram-sdk>=3.0
* requests
* rich (for enhanced console output) (optional)
* strands>=1.11.0

If not installed automatically, you can manually install dependencies:

```bash
pip install deepgram-sdk>=3.0 requests rich strands>=1.11.0
```

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| **DEEPGRAM_API_KEY** | ✅ | - | Your Deepgram API key (get it from console.deepgram.com) |
| **DEEPGRAM_DEFAULT_MODEL** | ❌ | **nova-3** | Default speech-to-text model |
| **DEEPGRAM_DEFAULT_LANGUAGE** | ❌ | **en** | Default language code |

Set up your API key:

```bash
export DEEPGRAM_API_KEY=your_deepgram_api_key
export DEEPGRAM_DEFAULT_MODEL=nova-3
export DEEPGRAM_DEFAULT_LANGUAGE=en
```

## Agent Level Usage 

### 🎙️ Speech-to-Text with Deepgram Tool Integration

Use the Deepgram tool to transcribe and analyze speech with speaker identification.

```python
from strands import Agent
from strands_deepgram import deepgram

# Create an agent with Deepgram tool
agent = Agent(tools=[deepgram])

# Transcribe audio with speaker identification
agent("transcribe audio from recording.mp3 in Turkish with speaker diarization")
```

✅ Pros: Simple, intuitive, no need to know exact parameters

### Programmatic Tool Invocation

The Deepgram tool can also be used directly in Python, outside of agent workflows:

```python
from strands_deepgram import deepgram

# Speech-to-Text (Transcription)
result = deepgram(
    action="transcribe",
    audio_source="meeting.mp3",
    language="en",
    model="nova-3",
    options={
        "diarize": True,
        "smart_format": True,
        "sentiment": True,
        "topics": True
    }
)
```

### Transcription Options

| Option | Description |
|--------|-------------|
| **diarize** | Enable speaker identification and separation in multi-speaker audio |
| **smart_format** | Apply intelligent formatting including punctuation, capitalization, and number formatting |
| **sentiment** | Analyze emotional tone and sentiment of spoken content |
| **topics** | Automatically detect and categorize discussion topics |
| **punctuate** | Add punctuation marks to improve transcript readability |
| **utterances** | Include detailed utterance-level information with timestamps |
| **detect_language** | Automatically identify the spoken language |
| **intents** | Detect speaker intentions and classify speech acts |

### 🔊 Text-to-Speech with Deepgram Tool Integration

Use the Deepgram tool to convert text to natural-sounding speech.

```python
from strands import Agent
from strands_deepgram import deepgram

# Create an agent with Deepgram tool
agent = Agent(tools=[deepgram])

# Text-to-speech
agent("convert this text to speech and save as output.mp3: Hello world")
```

### Programmatic Tool Invocation

The Deepgram tool can also be used directly in Python, outside of agent workflows:

```python
from strands_deepgram import deepgram

result = deepgram(
    action="text_to_speech",
    text="Hello, welcome to our service!",
    options={
        "voice": "aura-asteria-en",  # Select voice model
        "encoding": "mp3",           # Audio format
        "output_path": "greeting.mp3", # Save location
        "play_audio": True           # Auto-play generated audio
    }
)
```

### Text-to-Speech Options

| Option | Description |
|--------|-------------|
| **voice** | Select from Aura voice models (asteria, luna, stella, athena, etc.) |
| **encoding** | Choose audio format (mp3, wav, flac, opus) |
| **sample_rate** | Set audio quality in Hz (8000–48000) |
| **output_path** | Specify file location to save generated audio |
| **play_audio** | Automatically play audio after generation (boolean) |

### 🧠 Audio Intelligence with Deepgram Tool Integration

Use the Deepgram tool to detect sentiment and extract topics from audio recordings.

```python
from strands import Agent
from strands_deepgram import deepgram

# Create an agent with Deepgram tool
agent = Agent(tools=[deepgram])

# Audio intelligence
agent("analyze sentiment and topics in recording.wav")
```

## Examples 

### Basic Transcription

Use the agent to convert audio to plain text quickly with no punctuation, speaker labels, or analysis.

```python
from strands import Agent
from strands_deepgram import deepgram

agent = Agent(tools=[deepgram])
agent("transcribe this audio file: path/to/audio.mp3")
```

### Audio Intelligence (Deepgram)

Use the Deepgram tool to detect sentiment and extract topics from audio recordings.

```python
from strands import Agent
from strands_deepgram import deepgram

agent = Agent(tools=[deepgram])
agent("analyze sentiment and topics in recording.wav")
```

### Multi-Language Transcription

Use the agent to transcribe audio in multiple languages automatically.

```python
from strands import Agent
from strands_deepgram import deepgram

agent = Agent(tools=[deepgram])
agent("transcribe audio.wav in Spanish")
```

### Speaker Diarization

Use the agent to identify and label different speakers in a conversation.

```python
from strands import Agent
from strands_deepgram import deepgram

agent = Agent(tools=[deepgram])
agent("transcribe meeting.mp3 with speaker identification")
```

### Punctuation & Formatting

Use the agent to add punctuation, capitalization, and number formatting for readability.

```python
from strands import Agent
from strands_deepgram import deepgram

agent = Agent(tools=[deepgram])
agent("transcribe call.wav with smart formatting")
```

### Basic Text-to-Speech

Use the agent to convert text to natural-sounding speech.

```python
from strands import Agent
from strands_deepgram import deepgram

agent = Agent(tools=[deepgram])
agent("convert this text to speech: Hello, how are you today?")
```

### Save to Specific Format

Use the agent to save spoken text as an audio file.

```python
from strands import Agent
from strands_deepgram import deepgram

agent = Agent(tools=[deepgram])
agent("convert text to speech and save as greeting.wav: Welcome to our service")
```

### Custom Voice Selection

Use the agent to choose a voice for speech output.

```python
from strands import Agent
from strands_deepgram import deepgram

agent = Agent(tools=[deepgram])
agent("use Aura voice to say: Thank you for your patience")
```

### Sentiment Analysis

Use the agent to detect emotions in audio.

```python
from strands import Agent
from strands_deepgram import deepgram

agent = Agent(tools=[deepgram])
agent("analyze sentiment in customer_call.mp3")
```

### Topic Detection

Use the agent to identify discussion topics in audio.

```python
from strands import Agent
from strands_deepgram import deepgram

agent = Agent(tools=[deepgram])
agent("identify topics discussed in meeting.wav")
```

### Combined Analysis

Use the agent to analyze both sentiment and topics at once.

```python
from strands import Agent
from strands_deepgram import deepgram

agent = Agent(tools=[deepgram])
agent("analyze sentiment and topics in audio: call.mp3")
```

### Intent Recognition

Use the agent to detect customer intent from audio conversations.

```python
from strands import Agent
from strands_deepgram import deepgram

agent = Agent(tools=[deepgram])
agent("detect customer intent in support_call.mp3")
```

## URL Support

Transcribe or analyze audio directly from online sources by providing the file URL.

```python
from strands import Agent
from strands_deepgram import deepgram

# Remote audio file
agent = Agent(tools=[deepgram])
agent("transcribe https://example.com/audio.mp3")
```

Returns raw transcript text without speaker labels or punctuation.

```python
from strands_deepgram import deepgram

# With custom options
result = deepgram(
    action="transcribe",
    audio_source="https://example.com/meeting.wav",
    language="es",
    options={"diarize": True, "sentiment": True}
)
```

Returns structured JSON with transcript, speaker labels, and sentiment scores.

## Batch Processing

Process multiple audio files at once to save time.

```python
from strands import Agent
from strands_deepgram import deepgram

# Transcribe all audio files in a folder
agent = Agent(tools=[deepgram])
agent("transcribe all audio files in the recordings/ folder")
```

Returns a list of plain text transcripts, one per file.

```python
from strands import Agent
from strands_deepgram import deepgram

# Analyze sentiment for multiple files
agent = Agent(tools=[deepgram])
agent("analyze sentiment for all files: call1.mp3, call2.mp3, call3.mp3")
```

Returns a list of sentiment scores and topic tags for each audio file.

## Custom Parameters

Use specific models, voices, or advanced options to control output quality and style.

```python
from strands import Agent
from strands_deepgram import deepgram

# Transcribe using a specific model with punctuation
agent = Agent(tools=[deepgram])
agent("transcribe audio.mp3 using nova-2 model with punctuation enabled")
```

Returns formatted transcript text with punctuation and capitalization.

```python
from strands import Agent
from strands_deepgram import deepgram

# Generate speech with slow speed
agent = Agent(tools=[deepgram])
agent("generate speech with slow speed: Welcome to our platform")
```

Returns an audio file (e.g., .wav) with the generated speech.

## Best Practices

**Tool Descriptions**: Provide clear action parameters (`transcribe`, `text_to_speech`, `analyze`) to help agents understand when and how to use Deepgram capabilities

**Parameter Types**: Use appropriate parameter types and descriptions to ensure correct tool usage:
- `audio_source`: string (file path or URL)
- `language`: string (ISO language code)
- `options`: object (configuration parameters)

**Error Handling**: Return informative error messages when tools fail to execute properly

**Security**: Consider security implications when handling audio files and API keys, especially in production environments

**Connection Management**: Always validate API connectivity before processing large batches of audio files

**Timeouts**: Set appropriate timeouts for large file processing to prevent hanging on long-running operations

```python
# Timeout configuration
result = deepgram(
    action="transcribe",
    audio_source="large_file.wav",
    options={"timeout": 300}  # 5 minute timeout
)
```

## Troubleshooting

### API Authentication Errors

API authentication errors occur when the Deepgram API key is invalid or missing. To resolve these issues, first ensure that your API key is properly set in the environment variables. You should also verify that the API key has the necessary permissions for the operations you're attempting to perform.

```bash
# Verify API key is set
echo $DEEPGRAM_API_KEY

# Test API key validity
curl -H "Authorization: Token $DEEPGRAM_API_KEY" https://api.deepgram.com/v1/projects
```

### Audio Format Issues

Audio format problems arise when using unsupported file formats or corrupted audio files. To resolve these errors, verify that your audio file is in a supported format (mp3, wav, flac, opus, m4a, webm). When encountering format issues, converting the file to a supported format often resolves the problem.

```python
# Convert unsupported formats
import subprocess
subprocess.run(["ffmpeg", "-i", "input.mov", "output.wav"])
```

### Rate Limiting Errors

Rate limiting occurs when you exceed Deepgram's API request limits. To resolve these issues, implement exponential backoff and retry logic in your application. You should also consider batching requests and adding delays between API calls to stay within rate limits.

```python
import time

def transcribe_with_retry(audio_path, max_retries=3):
    for attempt in range(max_retries):
        try:
            return deepgram(action="transcribe", audio_source=audio_path)
        except Exception as e:
            if "rate limit" in str(e).lower() and attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
                continue
            raise
```

### Large File Processing Errors

Large file processing errors can occur when files exceed size limits or processing timeouts. To resolve these issues, consider using streaming mode for files larger than 200MB. You should also verify that your network connection is stable for the duration of the upload and processing.

```python
# Handle large files with streaming
result = deepgram(
    action="transcribe",
    audio_source="large_file.wav",
    options={"streaming": True, "chunk_size": 8192}
)
```

## 🔗 Links

* PyPI: strands-deepgram
* GitHub: strands-deepgram
* Strands Agents SDK: github.com/strands-agents/strands
* Deepgram API: developers.deepgram.com
* Deepgram Console: console.deepgram.com
