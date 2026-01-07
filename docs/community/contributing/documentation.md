# Contributing to Documentation

Good documentation helps developers succeed with Strands. We welcome contributions that make our docs clearer, more complete, or more helpful.

Documentation lives in the [docs repository](https://github.com/strands-agents/docs).

## What we accept

We're looking for contributions that improve the developer experience.

| Type | Description |
|------|-------------|
| Typo fixes | Spelling, grammar, and formatting corrections |
| Clarifications | Rewording confusing sections |
| New examples | Code samples and tutorials |
| API reference | Improvements to reference documentation |
| Translations | Contact us first to coordinate |

## Setup

Let's get the docs running locally so you can preview your changes.

```bash
git clone https://github.com/strands-agents/docs.git
cd docs

pip install -r requirements.txt
mkdocs serve

# Preview at http://localhost:8000
```

## Submission process

1. Fork the docs repository
2. Make your changes
3. Preview locally with `mkdocs serve`
4. Submit a pull request

Small typo fixes can skip preview and go straight to PR.

## Style guidelines

We aim for documentation that teaches, not just describes. A reader should finish understanding the "why" before the "how."

### Voice and tone

| Principle | Example |
|-----------|---------|
| Use "you" for the reader | "You create an agent by..." not "An agent is created by..." |
| Use "we" collaboratively | "Let's install the SDK" not "Install the SDK" |
| Active voice, present tense | "The agent returns a response" not "A response will be returned" |
| Explain why before how | Start with the problem, then the solution |

### Writing style

| Do | Don't |
|----|-------|
| Keep sentences under 25 words | Write long, complex sentences |
| Use "to create an agent, call..." | Use "in order to create an agent, you should call..." |
| Include code examples | Describe without showing |
| Use tables for comparisons | Use long bullet lists |

### Code examples

Always test code examples before submitting. Include both Python and TypeScript when both are supported. Start with the simplest example, then add complexity.

```python
# Start simple
from strands import Agent
agent = Agent()

# Then show configuration
from strands import Agent
from strands.models import BedrockModel

agent = Agent(
    model=BedrockModel(model_id="anthropic.claude-3-sonnet"),
    system_prompt="You are a helpful assistant."
)
```
