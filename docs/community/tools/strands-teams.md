# strands-teams

{{ community_contribution_banner }}

[strands-teams](https://pypi.org/project/strands-teams/) is a production-ready Microsoft Teams notifications tool for [Strands Agents SDK](https://github.com/strands-agents/sdk-python), powered by Adaptive Cards and rich messaging capabilities.

## Installation

```bash
pip install strands-teams
```

## Usage

```python
from strands import Agent
from strands_teams import teams

agent = Agent(tools=[teams])

# Simple notification  
agent("send a Teams message: New lead from Acme Corp")

# Pre-built templates
agent("send an approval request to Teams for the Q4 budget")

# Status updates
agent("send status update: website redesign is 75% complete")
```

## Key Features

- **Adaptive Cards**: Rich, interactive message cards with modern UI
- **Pre-built Templates**: Notifications, approvals, status updates, and more
- **Action Buttons**: Interactive elements like approve/reject buttons
- **Rich Formatting**: Markdown support, images, and color coding
- **Type Safe**: Full type hints and validation

## Configuration

```bash
TEAMS_WEBHOOK_URL=your_webhook_url  # Optional
```

## Resources

- **PyPI**: [pypi.org/project/strands-teams](https://pypi.org/project/strands-teams/)
- **GitHub**: [github.com/eraykeskinmac/strands-teams](https://github.com/eraykeskinmac/strands-teams)