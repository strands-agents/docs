# Responsible AI

Strands Agents SDK provides powerful capabilities for building AI agents with access to tools and external resources. With this power comes the responsibility to ensure your AI applications are developed and deployed in an ethical, safe, and beneficial manner. This guide outlines best practices for responsible AI usage with the Strands Agents SDK. Please also reference our [Prompt Engineering](./prompt-engineering.md) page for guidance on how to effectively create agents that align with responsible AI usage, and [Guardrails](./guardrails.md) page for how to add mechanisms to ensure safety and security.

You can learn more about the core dimensions of responsible AI on the [AWS Responsible AI](https://aws.amazon.com/ai/responsible-ai/) site. 

## Shared Responsibility Model

Strands Agents SDK provides building blocks for constructing AI agent systems. Security of the overall system is a shared responsibility between the SDK and you, the developer.

**What the SDK provides:**

- Input validation against common injection patterns (e.g., path traversal)
- Secure defaults where possible
- Extensible interfaces for adding custom validation

**What you are responsible for:**

- Securing the runtime environment your agents operate in, including filesystem permissions, network access, and container/host isolation
- Auditing all tools used by your agents — including tools provided by Strands and the community — for their specific behavior and assumptions, and ensuring they are appropriate for your workload, threat model, and deployment environment
- Protecting any directories the SDK reads from or writes to (e.g., session storage, tool loading directories) from unauthorized access, as the SDK trusts the contents of these locations
- Implementing additional validation or hardening layers (e.g., symlink checks, integrity verification) when operating in shared, multi-tenant, or adversarial environments

No SDK can anticipate every deployment topology or threat model. You should review how each component interacts with your infrastructure and apply appropriate security controls at the environment level.

### Tool Design

When designing tools with Strands, follow these principles:

1. **Least Privilege**: Tools should have the minimum permissions needed
2. **Input Validation**: Thoroughly validate all inputs to tools
3. **Clear Documentation**: Document tool purpose, limitations, and expected inputs
4. **Error Handling**: Gracefully handle edge cases and invalid inputs
5. **Audit Logging**: Log sensitive operations for review

Below is an example of a simple tool design that follows these principles:

```python
@tool
def profanity_scanner(query: str) -> str:
    """Scans text files for profanity and inappropriate content.
    Only access allowed directories."""
    # Least Privilege: Verify path is in allowed directories
    allowed_dirs = ["/tmp/safe_files_1", "/tmp/safe_files_2"]
    real_path = os.path.realpath(os.path.abspath(query.strip()))
    if not any(real_path.startswith(d) for d in allowed_dirs):
        logging.warning(f"Security violation: {query}")  # Audit Logging
        return "Error: Access denied. Path not in allowed directories."

    try:
        # Error Handling: Read file securely
        if not os.path.exists(query):
            return f"Error: File '{query}' does not exist."
        with open(query, 'r') as f:
            file_content = f.read()

        # Use Agent to scan text for profanity
        profanity_agent = Agent(
            system_prompt="""You are a content moderator. Analyze the provided text
            and identify any profanity, offensive language, or inappropriate content.
            Report the severity level (mild, moderate, severe) and suggest appropriate
            alternatives where applicable. Be thorough but avoid repeating the offensive
            content in your analysis.""",
        )

        scan_prompt = f"Scan this text for profanity and inappropriate content:\n\n{file_content}"
        return profanity_agent(scan_prompt)["message"]["content"][0]["text"]

    except Exception as e:
        logging.error(f"Error scanning file: {str(e)}")  # Audit Logging
        return f"Error scanning file: {str(e)}"
```

---

**Additional Resources:**

* [AWS Responsible AI Policy](https://aws.amazon.com/ai/responsible-ai/policy/)
* [Anthropic's Responsible Scaling Policy](https://www.anthropic.com/news/anthropics-responsible-scaling-policy)
* [Partnership on AI](https://partnershiponai.org/)
* [AI Ethics Guidelines Global Inventory](https://inventory.algorithmwatch.org/)
* [OECD AI Principles](https://www.oecd.org/digital/artificial-intelligence/ai-principles/)
