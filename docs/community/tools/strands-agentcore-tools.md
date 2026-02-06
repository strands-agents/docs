---
project:
  pypi: https://pypi.org/project/strands-agentcore-tools/
  github: https://github.com/cagataycali/strands-agentcore-tools
  maintainer: cagataycali
service:
  name: AWS Bedrock AgentCore
  link: https://aws.amazon.com/bedrock/agentcore/
---

# strands-agentcore-tools

{{ community_contribution_banner }}

[strands-agentcore-tools](https://github.com/cagataycali/strands-agentcore-tools) provides agentic tools that enable AI agents to autonomously deploy, manage, and monitor themselves on AWS Bedrock AgentCore.

## Installation

```bash
pip install strands-agentcore-tools
```

## Usage

```python
from strands import Agent
from strands_agentcore_tools import configure, launch, invoke, status, logs

agent = Agent(
    tools=[configure, launch, invoke, status, logs],
    system_prompt="You can deploy yourself to AWS AgentCore."
)

# Agent deploys itself
agent("""
Deploy yourself to AWS:
1. Configure deployment
2. Launch to production
3. Check status
4. Show logs
""")
```

## Key Features

- **9 Tools**: configure, launch, invoke, agents, status, logs, memory, identity, session
- **Zero DevOps**: Build & deploy via CodeBuild with ARM64 containers
- **Self-Deploying Agents**: Agents can autonomously deploy themselves
- **Memory Management**: Support for STM (Short-Term Memory) and LTM (Long-Term Memory)
- **OAuth Integration**: Built-in identity provider management

## Available Tools

| Tool | Purpose |
|------|---------|
| `configure` | Generate Dockerfile, IAM roles, config YAML |
| `launch` | Build & deploy to AgentCore via CodeBuild |
| `invoke` | Execute deployed agent with payload |
| `agents` | List/get agent runtimes |
| `status` | Check agent health & endpoint status |
| `logs` | Query CloudWatch logs |
| `memory` | Manage AgentCore memories (STM/LTM) |
| `identity` | OAuth provider management |
| `session` | Stop active runtime sessions |

## Configuration

Requires AWS credentials with permissions for:
- `bedrock-agentcore:*`
- `ecr:*`
- `codebuild:*`
- `iam:*`
- `logs:*`

## Resources

- [PyPI Package](https://pypi.org/project/strands-agentcore-tools/)
- [GitHub Repository](https://github.com/cagataycali/strands-agentcore-tools)
- [AWS Bedrock AgentCore Docs](https://docs.aws.amazon.com/bedrock-agentcore/)
