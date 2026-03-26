Amazon Bedrock AgentCore Runtime is a secure, serverless runtime purpose-built for deploying and scaling dynamic AI agents and tools using any open-source framework including Strands Agents, LangChain, LangGraph and CrewAI. It supports any protocol such as MCP and A2A, and any model from any provider including Amazon Bedrock, OpenAI, Gemini, etc. Developers can securely and reliably run any type of agent including multi-modal, real-time, or long-running agents. AgentCore Runtime helps protect sensitive data with complete session isolation, providing dedicated microVMs for each user session - critical for AI agents that maintain complex state and perform privileged operations on users’ behalf. It is highly reliable with session persistence and it can scale up to thousands of agent sessions in seconds so developers don’t have to worry about managing infrastructure and only pay for actual usage. AgentCore Runtime, using AgentCore Identity, also seamlessly integrates with the leading identity providers such as Amazon Cognito, Microsoft Entra ID, and Okta, as well as popular OAuth providers such as Google and GitHub. It supports all authentication methods, from OAuth tokens and API keys to IAM roles, so developers don’t have to build custom security infrastructure.

## Prerequisites

Before you start, you need:

-   An AWS account with appropriate [permissions](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-permissions.html)
-   Python 3.10+ or Node.js 20+
-   Optional: A container engine (Docker, Finch, or Podman) - only required for local testing and advanced deployment scenarios

---

## Choose Strands SDK Your Language

Select your preferred programming language to get started with deploying Strands agents to Amazon Bedrock AgentCore Runtime:

<div class="sl-link-card astro-mf7fz2mj"> <span class="sl-flex stack astro-mf7fz2mj"> <a href="python/" class="astro-mf7fz2mj"> <span class="title astro-mf7fz2mj">Python Deployment</span> </a> <span class="description astro-mf7fz2mj">Deploy your Python Strands agent to AgentCore Runtime!</span> </span> <svg aria-hidden="true" class="icon rtl:flip astro-mf7fz2mj astro-c6vsoqas" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="--sl-icon-size: 1.333em;"><path d="M17.92 11.62a1.001 1.001 0 0 0-.21-.33l-5-5a1.003 1.003 0 1 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1.002 1.002 0 0 0 .325 1.639 1 1 0 0 0 1.095-.219l5-5a1 1 0 0 0 .21-.33 1 1 0 0 0 0-.76Z"/></svg> </div><div class="sl-link-card astro-mf7fz2mj"> <span class="sl-flex stack astro-mf7fz2mj"> <a href="typescript/" class="astro-mf7fz2mj"> <span class="title astro-mf7fz2mj">TypeScript Deployment</span> </a> <span class="description astro-mf7fz2mj">Deploy your TypeScript Strands agent to AgentCore Runtime!</span> </span> <svg aria-hidden="true" class="icon rtl:flip astro-mf7fz2mj astro-c6vsoqas" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="--sl-icon-size: 1.333em;"><path d="M17.92 11.62a1.001 1.001 0 0 0-.21-.33l-5-5a1.003 1.003 0 1 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1.002 1.002 0 0 0 .325 1.639 1 1 0 0 0 1.095-.219l5-5a1 1 0 0 0 .21-.33 1 1 0 0 0 0-.76Z"/></svg> </div>

## Additional Resources

-   [Amazon Bedrock AgentCore Runtime Documentation](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html)
-   [Strands Documentation](https://strandsagents.com/latest/)
-   [AWS IAM Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html)
-   [Docker Documentation](https://docs.docker.com/)
-   [Amazon Bedrock AgentCore Observability](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability.html)