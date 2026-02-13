# Skills Support

**Status**: Proposed (Updated)

**Date**: 2026-02-13

**Issue**: https://github.com/strands-agents/sdk-python/issues/1181

**Depends on**: [Plugins](https://github.com/strands-agents/docs/pull/530)

## Context

### The problem

Imagine you're building an agent that reviews code. You've carefully crafted instructions covering security analysis, best practices, and common pitfalls. Now you want to reuse those instructions across multiple agents, share them with your team, or swap them out depending on the task.

Today, you'd need to:

1. Manually read instruction files and concatenate them into your system prompt
2. Build your own logic to manage which instructions are active
3. Handle the plumbing of loading, parsing, and injecting skill content

This is exactly the kind of repetitive work that the SDK handles.

### What are skills?

Skills are reusable instruction packages that follow the [AgentSkills.io](https://agentskills.io) specification—an open standard developed by Anthropic. A skill is a folder containing a `SKILL.md` file with metadata and instructions:

```markdown
---
name: code-review
description: Reviews code for bugs, security vulnerabilities, and best practices
allowed-tools: file_read shell
---

# Code Review Instructions

When reviewing code, follow these steps:

1. **Security Analysis**: Check for SQL injection, XSS, and auth issues
2. **Code Quality**: Look for bugs, edge cases, and logic errors
3. **Best Practices**: Verify coding standards and patterns

## Examples
...
```

Skills can also include supporting resources like scripts and reference docs:

```
skills/
├── code-review/
│   ├── SKILL.md
│   ├── scripts/
│   │   └── analyze.py
│   └── references/
│       └── security-checklist.md
└── documentation/
    └── SKILL.md
```

### Who needs this?

- Developers building agents that need specialized behaviors for different tasks
- Teams sharing agent capabilities across projects
- Anyone using the AgentSkills.io ecosystem

### Skills as a plugin

The [Plugins proposal](https://github.com/strands-agents/docs/pull/530) introduces a `Plugin` protocol for high-level features that modify agent behavior across multiple primitives (system prompt, tools, hooks). Skills is a textbook plugin: it needs to modify the system prompt (inject skill metadata), manage tools (filter via `allowed_tools`, register a `skills` tool), and respond to lifecycle events (track active skill, update prompt before invocations).

Rather than adding a `skills` parameter to the Agent constructor, skills is implemented as a `SkillsPlugin` that ships with the SDK.

## Decision

### Developer experience

```python
from strands import Agent
from strands.plugins import SkillsPlugin

agent = Agent(
    plugins=[SkillsPlugin(skills=["./skills/code-review", "./skills/documentation"])]
)

result = agent("Review my code for security issues")
```

The plugin auto-registers everything it needs during `init_plugin`: a `skills` tool, hooks for system prompt management, and hooks for tool filtering. You don't wire anything up manually.

### How it works

The `SkillsPlugin` implements the `Plugin` protocol. When `init_plugin` is called:

1. Loads skill metadata (name, description, location) from each `SKILL.md`
2. Registers a `skills` tool on the agent with `activate` and `deactivate` actions
3. Registers a `BeforeInvocationEvent` hook that appends skill metadata to the system prompt
4. When a skill with `allowed_tools` is activated, optionally removes non-allowed tools from the agent (keeping them in memory for restoration on deactivate)

The agent sees something like this in its system prompt:

```
## Available Skills

You have access to specialized skills. When a task matches a skill's
description, use the skills tool to activate it and read its full instructions.

- **code-review**: Reviews code for bugs, security vulnerabilities...
- **documentation**: Generates clear, comprehensive documentation...
```

The agent then uses the `skills` tool to activate a skill when it decides one applies. A skill stays active until the agent explicitly deactivates it. This is progressive disclosure—metadata upfront, full content on demand.

### Plugin internals

```python
class SkillsPlugin(Plugin):
    name = "skills"

    def __init__(self, skills: list[str | Path | Skill]):
        self._skills_config = skills
        self._loaded_skills: list[Skill] = []
        self._active_skill: Skill | None = None
        self._filtered_tools: list[Tool] | None = None

    async def init_plugin(self, agent: Agent):
        self._loaded_skills = self._resolve_skills(self._skills_config)
        # Tools and hooks are auto-registered via decorators

    @tool
    def skills(self, action: str, skill_name: str) -> str:
        """Activate or deactivate a skill.

        Args:
            action: "activate" or "deactivate"
            skill_name: Name of the skill
        """
        if action == "activate":
            skill = self._find_skill(skill_name)
            self._active_skill = skill
            if skill.allowed_tools:
                self._apply_tool_filter(skill.allowed_tools)
            return skill.instructions
        elif action == "deactivate":
            if self._filtered_tools is not None:
                self._restore_filtered_tools()
            self._active_skill = None
            return f"Deactivated skill: {skill_name}"

    @hook
    def _inject_skill_metadata(self, event: BeforeInvocationEvent):
        """Append skill metadata to system prompt before each invocation."""
        ...
```

The `@tool` and `@hook` decorators inside the plugin class auto-register with the agent during `init_plugin`. This is the DX we want: declare what you need, the plugin protocol handles the wiring.

### Skill sources

The `skills` parameter accepts a list. Each entry can be:

- A local filesystem path to a skill directory (containing `SKILL.md`)
- A local filesystem path to a parent directory (containing multiple skill subdirectories)
- A `Skill` object created programmatically

When a path contains a `SKILL.md`, it's treated as a single skill. When it doesn't, it's treated as a parent directory and all subdirectories containing `SKILL.md` are loaded. This means `SkillsPlugin(skills=["./skills"])` works whether `./skills` is a single skill or a directory of skills.

We start with filesystem support, but the design accommodates future sources:

- URLs (remote skill repositories)
- S3 locations (`s3://bucket/skills/code-review/`)
- MCP servers (the MCP community is [exploring skills over MCP](https://github.com/modelcontextprotocol/experimental-ext-skills/blob/main/README.md), where MCP servers could expose skills as resources)

The `Skill` dataclass abstracts over the source, so adding new loaders doesn't change the plugin interface.

```python
# Filesystem (P0)
SkillsPlugin(skills=["./skills/code-review"])

# Programmatic
SkillsPlugin(skills=[
    Skill(name="quick-review", description="...", instructions="..."),
    "./skills/documentation",
])

# Future: URLs, S3, MCP (not in initial implementation)
# SkillsPlugin(skills=[
#     "https://example.com/skills/code-review",
#     "s3://my-bucket/skills/documentation",
# ])
```

### Dynamic skill management

Skills aren't baked in at init time. You can change them between invocations:

```python
skills_plugin = SkillsPlugin(skills=["./skills/code-review"])
agent = Agent(plugins=[skills_plugin])

agent("Review this function for security issues")

# Switch to different skills
skills_plugin.skills = ["./skills/documentation"]
agent("Write API docs for this module")

# Add more skills
skills_plugin.skills = ["./skills/documentation", "./skills/code-review"]
agent("Document and review this module")
```

### Tracking the active skill

The plugin tracks which skill the agent is currently using:

```python
skills_plugin = SkillsPlugin(skills=["./skills"])
agent = Agent(plugins=[skills_plugin])

result = agent("Review my authentication code")

if skills_plugin.active_skill:
    print(f"Agent used: {skills_plugin.active_skill.name}")
```

Detection works through the `skills` tool: when the agent activates a skill, it becomes the active skill. It stays active until the agent explicitly deactivates it.

### Multiple active skills

Only one skill can be active at a time. Activating a new skill while one is already active implicitly deactivates the previous one (restoring any filtered tools before applying the new skill's `allowed_tools`). This keeps the mental model simple and avoids ambiguity around conflicting `allowed_tools` sets.

If a future use case requires multiple simultaneous active skills, we can extend the design then. Starting with single-active is the safer default.

### Tool restrictions with `allowed_tools`

Skills can optionally specify which tools they're allowed to use:

```yaml
---
name: safe-analyzer
description: Analyzes files without executing code
allowed-tools: file_read
---
```

Tool filtering is opt-in. When a skill with `allowed_tools` is activated, the plugin removes non-allowed tools from the agent, keeping them in memory. When the skill is deactivated, the full tool set is restored. If a skill doesn't specify `allowed_tools`, all tools remain available.

Not every skill author will know the exact tool names in every agent, so `allowed_tools` is best suited for controlled environments where the skill author knows the agent's tool set. For portable skills shared across different agents, omitting `allowed_tools` is the safer default.

### Session persistence

The `SkillsPlugin` stores its state in `agent.state["skills_plugin"]` so it gets persisted automatically when a `SessionManager` saves the agent's state. On restore, the plugin reads from `agent.state` and re-applies its configuration.

```python
# The plugin writes to agent.state during lifecycle events
agent.state["skills_plugin"] = {
    "skills": [str(s.path) for s in self._loaded_skills if s.path],
    "active_skill": self._active_skill.name if self._active_skill else None,
    "filtered_tools": [t.name for t in self._filtered_tools] if self._filtered_tools else None,
}
```

Since `SessionManager` already persists `agent.state`, no special plugin-aware logic is needed. When the session is restored, the plugin reads `agent.state["skills_plugin"]` during initialization and re-applies skill configuration, active skill, and tool filtering.

### API surface

**Skill dataclass:**

```python
@dataclass
class Skill:
    name: str
    description: str
    instructions: str = ""
    path: Path | None = None
    allowed_tools: list[str] | None = None  # None means all tools allowed
    metadata: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_path(cls, skill_path: str | Path) -> "Skill":
        """Load a skill from a directory containing SKILL.md.

        Raises:
            ValueError: If SKILL.md is missing or malformed.
        """
        ...
```

**Helper functions:**

```python
def load_skills(skills_dir: str | Path) -> list[Skill]:
    """Load all skills from subdirectories of skills_dir.

    Each subdirectory must contain a SKILL.md file. Subdirectories
    without SKILL.md are silently skipped.
    """
    ...

def load_skill(skill_path: str | Path) -> Skill:
    """Load a single skill from a directory.

    Raises:
        ValueError: If SKILL.md is missing or malformed.
    """
    ...
```

**Module exports:**

```python
# Skill dataclass from top-level
from strands import Skill

# Plugin from plugins submodule
from strands.plugins import SkillsPlugin

# Helpers from skills submodule
from strands.skills import load_skills, load_skill
```

**Error handling:**

- Invalid paths in `SkillsPlugin(skills=...)` raise `ValueError` at init time
- Skills with `allowed_tools` referencing non-existent tools log a warning but don't fail

## Developer experience

### Basic usage

```python
from strands import Agent
from strands.plugins import SkillsPlugin

agent = Agent(
    plugins=[SkillsPlugin(skills=["./skills"])]
)

result = agent("Review my code for security issues")
```

### Combining with a custom system prompt

```python
agent = Agent(
    system_prompt="You are a senior engineer at Acme Corp. Be thorough.",
    plugins=[SkillsPlugin(skills=["./company-skills/code-review", "./company-skills/docs"])],
)
```

Your system prompt comes first, then the skills metadata is appended.

### Creating skills programmatically

You don't need `SKILL.md` files. Define skills in code:

```python
from strands import Agent, Skill
from strands.plugins import SkillsPlugin

review_skill = Skill(
    name="quick-review",
    description="Quick code review focusing on obvious issues",
    instructions="""
# Quick Review Guidelines

Focus on:
1. Obvious bugs and typos
2. Missing error handling
3. Security red flags

Skip style nitpicks and optimization suggestions.
""",
    allowed_tools=["file_read"]
)

agent = Agent(plugins=[SkillsPlugin(skills=[review_skill])])
```

### Filtering skills before loading

```python
from strands.skills import load_skills
from strands.plugins import SkillsPlugin

all_skills = load_skills("./skills")

# Only allow specific skills
safe_skills = [s for s in all_skills if s.name in ["docs", "summarizer"]]

agent = Agent(plugins=[SkillsPlugin(skills=safe_skills)])
```

## Alternatives considered

### Skills as a top-level Agent parameter

The original design proposed `Agent(skills="./skills")`. With the plugins system, this adds unnecessary surface area to the Agent constructor. Skills is a cross-component feature (system prompt + tools + hooks) which is exactly what plugins are for. Keeping it as a plugin also means the pattern is consistent: if you want skills, you add a plugin. If you want steering, you add a plugin.

### Skill modes (inject/tool/agent)

We considered adding a `skill_mode` parameter to control how skills are activated—injected into prompts, loaded via tool calls, or run in sub-agents. This adds complexity without clear benefit. The single approach (metadata in prompt, full content via tool on demand) covers most cases. Users who need different patterns can build their own plugin.

### SkillProvider interface

We considered a `SkillProvider` protocol similar to `ToolProvider`. Skills are simpler than tools—they're just data (name, description, instructions). A plain dataclass is sufficient for the data model, and the plugin handles the integration.

## Consequences

### What becomes easier

- Loading skills from directories with a single plugin
- Sharing skills across agents and projects
- Changing skills dynamically between invocations
- Tracking which skill the agent is using
- Restricting tools when specific skills are active
- Persisting skill state across sessions
- Future extensibility to remote skill sources (URLs, S3, MCP)

### What becomes more difficult

Nothing significant. The feature is additive.

### Future extensions

This design allows for:

- Remote skill sources (URLs, S3 buckets)
- MCP-based skill discovery (as the [MCP Skills Interest Group](https://github.com/modelcontextprotocol/experimental-ext-skills) explores standardization)
- Skill versioning
- Multiple simultaneous active skills
- Custom prompt templates for skill metadata
- Skill registries and marketplaces
