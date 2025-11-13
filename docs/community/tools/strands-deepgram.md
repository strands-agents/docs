# strands-deepgram

{{ community_contribution_banner }}

[strands-deepgram](https://pypi.org/project/strands-deepgram/) is a production-ready speech and audio processing tool for [Strands Agents SDK](https://github.com/strands-agents/sdk-python), powered by Deepgram's AI platform with 30+ language support.

## Installation

```bash
pip install strands-deepgram
```

## Usage

```python
from strands import Agent
from strands_deepgram import deepgram

agent = Agent(tools=[deepgram])

# Transcribe with speaker identification
agent("transcribe this audio: recording.mp3 with speaker diarization")

# Text-to-speech
agent("convert this text to speech: Hello world")

# Audio intelligence
agent("analyze sentiment in call.wav")
```

## Key Features

- **Speech-to-Text**: 30+ language support and speaker diarization
- **Text-to-Speech**: Natural-sounding voices (Aura series)
- **Audio Intelligence**: Sentiment analysis, topic detection, and intent recognition
- **Speaker Diarization**: Identify and separate different speakers
- **Multi-format Support**: WAV, MP3, M4A, FLAC, and more
- **Real-time Processing**: Streaming capabilities for live audio

## Configuration

```bash
DEEPGRAM_API_KEY=your_deepgram_api_key  # Required
DEEPGRAM_DEFAULT_MODEL=nova-3            # Optional
DEEPGRAM_DEFAULT_LANGUAGE=en             # Optional
```

Get your API key at: [console.deepgram.com](https://console.deepgram.com/)

## Resources

- **PyPI**: [pypi.org/project/strands-deepgram](https://pypi.org/project/strands-deepgram/)
- **GitHub**: [github.com/eraykeskinmac/strands-deepgram](https://github.com/eraykeskinmac/strands-deepgram)