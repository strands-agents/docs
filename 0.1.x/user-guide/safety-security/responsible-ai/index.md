# Responsible AI

Strands Agents SDK provides powerful capabilities for building AI agents with access to tools and external resources. With this power comes the responsibility to ensure your AI applications are developed and deployed in an ethical, safe, and beneficial manner. This guide outlines best practices for responsible AI usage with the Strands Agents SDK. Please also reference our [Prompt Engineering](../prompt-engineering/) page for guidance on how to effectively create agents that align with responsible AI usage, and [Guardrails](../guardrails/) page for how to add mechanisms to ensure safety and security.

## Core Principles

### Transparency

Be transparent about AI system capabilities and limitations:

- Clearly identify when users are interacting with an AI system
- Communicate the capabilities and limitations of your agent
- Do not misrepresent what your AI can or cannot do
- Be forthright about the probabilistic nature of AI outputs and their limitations
- Disclose when systems may produce inaccurate or inappropriate content

### Human Oversight and Control

Maintain appropriate human oversight and control over AI systems:

- Implement approval workflows for sensitive operations
- Design tools with appropriate permission levels
- Log and review tool usage patterns
- Ensure human review for consequential decisions affecting fundamental rights, health, safety, or access to critical resources
- Never implement lethal weapon functions without human authorization and control

### Data Privacy and Security

Respect user privacy and maintain data security:

- Minimize data collection to what is necessary
- Implement proper data encryption and security measures
- Build tools with privacy-preserving defaults
- Comply with relevant data protection regulations
- Strictly prohibit violations of privacy rights, including unlawful tracking, monitoring, or identification
- Never create, store, or distribute unauthorized impersonations or non-consensual imagery

### Fairness and Bias Mitigation

Identify, prevent, and mitigate unfair bias in AI systems:

- Use diverse training data and knowledge bases
- Implement bias detection in tool outputs
- Develop guidelines for handling sensitive topics
- Regularly audit agent responses for bias
- Prohibit uses that harass, harm, or encourage harm to individuals or specific groups
- Prevent usage that discriminates or reinforces harmful stereotypes

### Safety and Security

Prevent harmful use and ensure system robustness:

- Validate tool inputs to prevent injection attacks
- Limit access to system resources and sensitive operations
- Implement rate limiting and other protection mechanisms
- Test for potential security vulnerabilities
- Evaluate all AI outputs for accuracy and appropriateness to your use case

### Legal and Ethical Compliance

Ensure all AI systems operate within legal and ethical frameworks:

- Comply with all applicable laws, rules, and regulations, including AI-specific laws such as the EU AI Act
- Regularly audit systems for compliance with evolving legal requirements
- Prohibit use for generating or distributing illegal content
- Maintain clear documentation of system design and decision-making processes

### Preventing Misuse and Illegal Activities

Take proactive measures to prevent the use of AI systems for illegal or harmful purposes:

- Implement robust content filtering to prevent generation of illegal content (e.g., instructions for illegal activities, hate speech, child exploitation material)
- Design systems with safeguards against being used for fraud, identity theft, or impersonation
- Prevent use in circumventing security measures or accessing unauthorized systems
- Establish clear policies prohibiting use for:
  - Generating malware, ransomware, or other malicious code
  - Planning or coordinating illegal activities
  - Harassment, stalking, or targeted harm against individuals
  - Spreading misinformation or engaging in deceptive practices
  - Money laundering, terrorist financing, or other financial crimes
- Implement monitoring systems to detect potential misuse patterns
- Create clear escalation procedures for when potential illegal use is detected
- Provide mechanisms for users to report suspected misuse

### Tool Design

When designing tools, follow these principles:

1. **Least Privilege**: Tools should have the minimum permissions needed
1. **Input Validation**: Thoroughly validate all inputs to tools
1. **Clear Documentation**: Document tool purpose, limitations, and expected inputs
1. **Error Handling**: Gracefully handle edge cases and invalid inputs
1. **Audit Logging**: Log sensitive operations for review

Below is an example of a simple tool design that follows these principles:

```
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

______________________________________________________________________

**Additional Resources:**

- [AWS Responsible AI Policy](https://aws.amazon.com/ai/responsible-ai/policy/)
- [Anthropic's Responsible Scaling Policy](https://www.anthropic.com/news/anthropics-responsible-scaling-policy)
- [Partnership on AI](https://partnershiponai.org/)
- [AI Ethics Guidelines Global Inventory](https://inventory.algorithmwatch.org/)
- [OECD AI Principles](https://www.oecd.org/digital/artificial-intelligence/ai-principles/)
