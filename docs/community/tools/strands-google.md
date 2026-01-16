---
project:
  pypi: https://pypi.org/project/strands-google/
  github: https://github.com/cagataycali/strands-google
  maintainer: cagataycali
service:
  name: Google APIs
  link: https://developers.google.com/apis-explorer
---

# strands-google

{{ community_contribution_banner }}

[strands-google](https://github.com/cagataycali/strands-google) provides universal Google API integration for Strands Agents, offering access to 200+ Google services including Gmail, Drive, Calendar, YouTube, Sheets, Docs, and more.

## Installation

```bash
pip install strands-google
```

## Usage

```python
from strands import Agent
from strands_google import use_google, gmail_send, gmail_reply

agent = Agent(tools=[use_google, gmail_send, gmail_reply])

# Send an email
agent("Send an email to friend@example.com saying hello")

# Search Gmail
agent("Find all unread emails from last week")

# List Google Drive files
agent("Show me my recent Drive files")
```

## Key Features

- **200+ Google API Integrations**: Gmail, Drive, Calendar, YouTube, Sheets, Docs, and more
- **Flexible Authentication**: OAuth 2.0, Service Accounts, and API Keys
- **Gmail Helpers**: Easy email sending and replying with automatic encoding
- **Dynamic Scopes**: Configure OAuth scopes on-the-fly
- **Discovery API Support**: Access any Google API automatically

## Configuration

```bash
# OAuth 2.0 (recommended for Gmail/Drive/Calendar)
export GOOGLE_OAUTH_CREDENTIALS=~/gmail_token.json

# Service Account (for GCP services)
export GOOGLE_APPLICATION_CREDENTIALS=~/service-key.json

# API Key (for public APIs)
export GOOGLE_API_KEY=your_api_key_here
```

Run the authentication helper:
```bash
python -m strands_google.google_auth
```

## Resources

- [PyPI Package](https://pypi.org/project/strands-google/)
- [GitHub Repository](https://github.com/cagataycali/strands-google)
- [Google APIs Explorer](https://developers.google.com/apis-explorer)
