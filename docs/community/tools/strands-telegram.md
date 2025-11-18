# strands-telegram

{{ community_contribution_banner }}

[strands-telegram](https://pypi.org/project/strands-telegram/) is a production-ready, comprehensive Telegram Bot API integration for [Strands Agents SDK](https://github.com/strands-agents/sdk-python) with 60+ methods and complete API coverage.

## Installation

```bash
pip install strands-telegram
```

## Usage

```python
from strands import Agent
from strands_telegram import telegram

agent = Agent(tools=[telegram])

# Send messages
agent("send a Telegram message to @username: Hello from AI agent!")

# Interactive keyboards
agent("send a poll to Telegram: What's your favorite color? Red, Blue, Green")

# Media sharing
agent("send this image to Telegram with caption: image.jpg")
```

## Key Features

- **Complete Bot API**: 60+ Telegram API methods (messages, media, keyboards, polls, groups)
- **Interactive Elements**: Inline keyboards, polls, dice games, location sharing
- **Group Management**: Admin tools, user management, permissions control
- **Media Support**: Photos, videos, documents, audio, stickers, voice messages
- **Webhooks**: Full webhook support for real-time message processing
- **Custom API Calls**: Extensible for any Telegram Bot API method

## Configuration

```bash
TELEGRAM_BOT_TOKEN=your_bot_token  # Required from @BotFather
```

## Resources

- **PyPI**: [pypi.org/project/strands-telegram](https://pypi.org/project/strands-telegram/)
- **GitHub**: [github.com/eraykeskinmac/strands-telegram](https://github.com/eraykeskinmac/strands-telegram)