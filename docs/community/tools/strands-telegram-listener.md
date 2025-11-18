# strands-telegram-listener

{{ community_contribution_banner }}

[strands-telegram-listener](https://pypi.org/project/strands-telegram-listener/) is a production-ready real-time Telegram message processing tool for [Strands Agents SDK](https://github.com/strands-agents/sdk-python) with AI-powered auto-responses and background monitoring.

## Installation

```bash
pip install strands-telegram-listener
pip install strands-telegram  # Companion package
```

## Usage

```python
from strands import Agent
from strands_telegram_listener import telegram_listener

agent = Agent(tools=[telegram_listener])

# Start listening for messages
agent("start listening to Telegram messages and respond with AI")

# Get recent message history
agent("show me the last 10 Telegram messages received")

# Check listener status
agent("what's the status of the Telegram listener?")
```

## Key Features

- **Real-time Processing**: Long polling for instant message processing
- **AI Auto-Replies**: Intelligent responses powered by Strands agents
- **Event Storage**: Comprehensive message logging and history (JSONL format)
- **Smart Filtering**: Message deduplication and own message filtering
- **Configurable**: Environment variable control for auto-reply behavior
- **Background Processing**: Non-blocking operation with thread safety

## Configuration

```bash
TELEGRAM_BOT_TOKEN=your_bot_token                # Required
STRANDS_TELEGRAM_AUTO_REPLY=true                 # Optional
STRANDS_TELEGRAM_LISTEN_ONLY_TAG="#support"      # Optional
```

## Resources

- **PyPI**: [pypi.org/project/strands-telegram-listener](https://pypi.org/project/strands-telegram-listener/)
- **GitHub**: [github.com/eraykeskinmac/strands-telegram-listener](https://github.com/eraykeskinmac/strands-telegram-listener)