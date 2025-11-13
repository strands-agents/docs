# strands-hubspot

{{ community_contribution_banner }}

[strands-hubspot](https://pypi.org/project/strands-hubspot/) is a production-ready HubSpot CRM tool for [Strands Agents SDK](https://github.com/strands-agents/sdk-python), designed for **READ-ONLY** operations with zero risk of data modification. It enables agents to safely access and analyze CRM data without any possibility of corrupting customer information.

This community tool provides comprehensive HubSpot integration for AI agents, offering safe CRM data access for sales intelligence, customer research, and data analytics workflows.

## Installation

```bash
pip install strands-hubspot
pip install 'strands-agents[anthropic]'
```

## Usage

```python
from strands import Agent
from strands_hubspot import hubspot

# Create an agent with HubSpot READ-ONLY tool
agent = Agent(tools=[hubspot])

# Search contacts (READ-ONLY)
agent("find all contacts created in the last 30 days")

# Get company details (READ-ONLY)
agent("get company information for ID 67890")

# List available properties (READ-ONLY)
agent("show me all available deal properties")

# Search with filters (READ-ONLY)
agent("search for deals with amount greater than 10000")
```

## Key Features

- **Universal READ-ONLY Access**: Safely search ANY HubSpot object type (contacts, deals, companies, tickets, etc.)
- **Smart Search**: Advanced filtering with property-based queries and sorting
- **Object Retrieval**: Get detailed information for specific CRM objects by ID
- **Property Discovery**: List and explore all available properties for any object type
- **User Management**: Get HubSpot user/owner details and assignments
- **100% Safe**: NO CREATE, UPDATE, or DELETE operations - read-only by design
- **Rich Console Output**: Beautiful table displays with Rich library formatting
- **Type Safe**: Full type hints and comprehensive error handling

## Configuration

Set your HubSpot API key as an environment variable:

```bash
HUBSPOT_API_KEY=your_hubspot_api_key  # Required
HUBSPOT_DEFAULT_LIMIT=100              # Optional
```

Get your API key at: [app.hubspot.com/private-apps](https://app.hubspot.com/private-apps)

## Use Cases

- **Analytics & Reporting**: Generate insights from CRM data
- **Customer Research**: Search and analyze customer information
- **Data Discovery**: Explore available properties and data structure
- **AI-Powered Insights**: Let agents analyze CRM data safely
- **Sales Intelligence**: Extract trends and patterns from deals/contacts
- **Lead Analysis**: Research prospects and opportunities

## Resources

- **PyPI**: [pypi.org/project/strands-hubspot](https://pypi.org/project/strands-hubspot/)
- **GitHub**: [github.com/eraykeskinmac/strands-hubspot](https://github.com/eraykeskinmac/strands-hubspot)
- **Examples**: [github.com/eraykeskinmac/strands-tools-examples](https://github.com/eraykeskinmac/strands-tools-examples)