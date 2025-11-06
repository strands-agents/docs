# Community Packages

The Strands Agents ecosystem is built on community contributions that extend agent capabilities through custom tools and integrations. If you've built a useful extension for Strands Agents that solves a common problem or integrates with popular services, packaging it for distribution allows other developers to benefit from your work.

## Creating A Package

The first step to sharing your Strands component with the community is creating a Python package. Follow the [official Python packaging tutorial](https://packaging.python.org/en/latest/tutorials/packaging-projects/) for complete packaging guidance. The key steps are:

- **Create a GitHub repository** - use the naming convention `strands-{thing}` for consistency with the ecosystem.
- **Add detailed documentation** - add a README with usage examples and API references.
- **Include thorough tests** - use unit tests to verify business logic and integration tests to validate the components works against one or more providers. Ensure proper code coverage.

[strands-clova](https://github.com/aidendef/strands-clova) is a community package that can serve as a good example.

## Publishing to PyPI

Once you have a package, you can then publish to PyPI to make it consumable to others. Publishing to PyPI allows users to install your package with pip.

Best practices for publishing include:

- **Configure GitHub workflows** - set up CI/CD to automatically publish releases to PyPI when you create new releases.
- **Follow semantic versioning** - use semver.org conventions for version numbering to help users understand the impact of updates.

## Getting Featured in Documentation

Once your package is published to PyPI, you can request to have it featured in the Strands Agents documentation. Featured packages should provide clear utility to the community and meet high quality standards including comprehensive documentation, thorough testing, and reliable functionality.

Submit your package for consideration by creating an issue in the [Strands Agents documentation repository](https://github.com/strands-agents/docs/issues). Include:

 - Package Name: the name your package name and PyPI link
 - Description: a brief description of functionality including why it benefits the community.
 - Usage examples: how strands customers would wire up and use the components 

Accepted packages will be featured in the Community Package documentation with package descriptions and installation instructions, usage examples showing integration with Strands Agents, and links to the project repository and documentation.

## Best Practices and Examples

### Model Providers

Model providers enable integration with third-party LLM services by implementing the Strands Agents `Model` interface. Each provider should focus on a single service or platform, exposing configuration parameters through structured config objects that users can customize for their specific needs.

For detailed implementation guidance including the `ModelConfig` pattern, `stream` method requirements, and `StreamEvent` formatting, see the [Custom Model Provider documentation](../user-guide/concepts/model-providers/custom_model_provider.md).

A good example of a community model provider is [strands-clova](https://github.com/aidendef/strands-clova).

### Tools

Each tool should have a clear, focused purpose following the single responsibility principle. Use descriptive naming with clear, intuitive names for tools and parameters that make their function obvious to users. Docstrings should include detailed descriptions, parameter explanations, and usage examples to help developers understand how to use your tools effectively.

The [strands-agents-tools](https://github.com/strands-agents/tools) repository serves as an example community tools package and provides example tools to follow for other tool packages. Good example tools include:

 - [sleep](https://github.com/strands-agents/tools/blob/main/src/strands_tools/sleep.py) - includes explicit error checking with messages that guide the caller on how to correct errors
 - [browser](https://github.com/strands-agents/tools/blob/main/src/strands_tools/browser/__init__.py) - detailing how to support multiple tools that share a common core.

### Community Tool Packages

#### Speech & Audio Processing

**[strands-deepgram](https://pypi.org/project/strands-deepgram/)**

A production-ready speech and audio processing tool powered by Deepgram's AI platform. Enables agents to transcribe audio with 30+ language support, generate natural-sounding speech, and perform advanced audio intelligence analysis.

```bash
pip install strands-deepgram
```

Key Features:
- 🎤 Speech-to-Text with 30+ language support and speaker diarization
- 🗣️ Text-to-Speech with natural-sounding voices (Aura series)
- 🧠 Audio Intelligence including sentiment analysis, topic detection, and intent recognition
- 👥 Speaker Diarization to identify and separate different speakers
- 🎵 Multi-format Support for WAV, MP3, M4A, FLAC, and more
- ⚡ Real-time Processing with streaming capabilities for live audio

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

Perfect for call analytics, voice assistants, meeting transcriptions, customer support automation, and any application requiring sophisticated speech processing capabilities.

### Community Tool Packages

#### Communication & Messaging

**[strands-telegram](https://pypi.org/project/strands-telegram/)**

A production-ready, comprehensive Telegram Bot API integration providing complete access to the Telegram Bot API with 60+ methods. Enables agents to create sophisticated Telegram bots and messaging workflows with full API coverage.

```bash
pip install strands-telegram
```

Key Features:
- 📨 Complete Bot API with 60+ Telegram API methods (messages, media, keyboards, polls, groups)
- 🎮 Interactive Elements including inline keyboards, polls, dice games, location sharing
- 👥 Group Management with admin tools, user management, permissions control
- 📁 Media Support for photos, videos, documents, audio, stickers, voice messages
- 🔗 Webhooks with full webhook support for real-time message processing
- 🛠️ Custom API Calls extensible for any Telegram Bot API method

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

Perfect for global communication (800M+ users), sophisticated user experiences, customer support automation, and comprehensive Telegram bot workflows with full API access.

**[strands-telegram-listener](https://pypi.org/project/strands-telegram-listener/)**

A production-ready real-time Telegram message processing tool with AI-powered auto-responses and background message monitoring. Enables agents to listen for incoming Telegram messages and respond intelligently in real-time.

```bash
pip install strands-telegram-listener
pip install strands-telegram  # Companion package
```

Key Features:
- 🎧 Real-time Processing with long polling for instant message processing
- 🤖 AI Auto-Replies with intelligent responses powered by Strands agents
- 📊 Event Storage including comprehensive message logging and history (JSONL format)
- 🔍 Smart Filtering with message deduplication and own message filtering
- ⚙️ Configurable through environment variable control for auto-reply behavior
- 🧵 Background Processing with non-blocking operation and thread safety

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

Perfect for creating interactive chatbots, customer support automation, real-time conversation AI, and complete Telegram ecosystems when paired with strands-telegram.

### Community Tool Packages

#### Communication & Messaging

**[strands-telegram](https://pypi.org/project/strands-telegram/)**

A production-ready, comprehensive Telegram Bot API integration providing complete access to the Telegram Bot API with 60+ methods. Enables agents to create sophisticated Telegram bots and messaging workflows with full API coverage.

```bash
pip install strands-telegram
```

Key Features:
- 📨 Complete Bot API with 60+ Telegram API methods (messages, media, keyboards, polls, groups)
- 🎮 Interactive Elements including inline keyboards, polls, dice games, location sharing
- 👥 Group Management with admin tools, user management, permissions control
- 📁 Media Support for photos, videos, documents, audio, stickers, voice messages
- 🔗 Webhooks with full webhook support for real-time message processing
- 🛠️ Custom API Calls extensible for any Telegram Bot API method

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

Perfect for global communication (800M+ users), sophisticated user experiences, customer support automation, and comprehensive Telegram bot workflows with full API access.

### Community Tool Packages

#### Communication & Notifications

**[strands-teams](https://pypi.org/project/strands-teams/)**

A production-ready Microsoft Teams notifications tool powered by Adaptive Cards and rich messaging capabilities. Enables agents to send beautiful, interactive notifications to Teams channels with professional UI elements.

```bash
pip install strands-teams
```

Key Features:
- 🎨 Adaptive Cards with rich, interactive message cards and modern UI
- 📋 Pre-built templates for notifications, approvals, status updates, and more
- ⚡ Custom Cards with full adaptive card schema support for unlimited flexibility
- 🔘 Action Buttons for interactive elements like approve/reject functionality
- 🎯 Rich Formatting with Markdown support, images, media, and color coding
- 🛠️ Easy Integration as a drop-in tool for Strands agents

```python
from strands import Agent
from strands_teams import teams

agent = Agent(tools=[teams])

# Simple notification
agent("send a Teams message: New lead from Acme Corp")

# Use pre-built templates
agent("send an approval request to Teams for the Q4 budget")

# Status updates with rich formatting
agent("send a status update to Teams: website redesign is 75% complete")
```

Perfect for enterprise communication, team collaboration, workflow notifications, approval processes, and professional team messaging for AI agents.

### Community Tool Packages

#### CRM & Customer Data

**[strands-hubspot](https://pypi.org/project/strands-hubspot/)**

A production-ready HubSpot CRM tool designed for **READ-ONLY** operations with zero risk of data modification. Enables agents to safely access and analyze CRM data without any possibility of corrupting customer information.

```bash
pip install strands-hubspot
```

Key Features:
- 🔍 Universal READ-ONLY access to all HubSpot object types (contacts, deals, companies, tickets)
- 🔎 Smart search with advanced filtering and property-based queries
- 📄 Detailed object retrieval by ID with customizable property selection
- 🏷️ Property discovery and metadata exploration for any object type
- 👤 User management and owner details retrieval
- 🛡️ 100% safe design with NO CREATE, UPDATE, or DELETE operations

```python
from strands import Agent
from strands_hubspot import hubspot

agent = Agent(tools=[hubspot])

# Search contacts (READ-ONLY)
agent("find all contacts created in the last 30 days")

# Get company details (READ-ONLY)  
agent("get company information for ID 67890")

# List available properties (READ-ONLY)
agent("show me all available deal properties")
```

Perfect for sales intelligence, customer research, data analytics, and CRM workflows that require safe data access without modification risks.

## Support & Resources

Building community packages extends the Strands Agents ecosystem and helps other developers solve complex problems with AI agents. Your contributions make the entire community more capable and productive.

If you need help or support building community packages, start a discussion in the [Strands Agents SDK repository](https://github.com/strands-agents/sdk-python/discussions).

