# Skills Support

**Status**: Proposed

**Date**: 2025-02-04

**Issue**: https://github.com/strands-agents/sdk-python/issues/1181

## Context

### What is the issue?

Users want to load specialized instruction packages (skills) for their agents without managing complex prompt engineering. Skills are reusable packages of instructions that teach agents how to perform specialized tasks, following the [AgentSkills.io](https://agentskills.io) specification developed by Anthropic.

### What task are you trying to accomplish?

- Load relevant knowledge/instruction files depending on specific tasks
- Reuse agents for different tasks by adding/removing skills
- Organize complex agent instructions into shareable packages
- Integrate with the existing skills ecosystem (Anthropic skills, AgentSkills.io)

### What makes it difficult today?

Currently, users must:
- Manually read SKILL.md files and inject into system prompts
- Build their own skill management logic
- Use the `skills` tool from strands-tools (runtime only, no static configuration)

### Who experiences this problem?

- Developers building agents that need specialized behaviors
- Teams sharing agent capabilities across projects
- Users of Anthropic's skills who want SDK integration

### What Are Skills?

Skills are self-contained packages consisting of:
- **SKILL.md file**: YAML frontmatter (metadata) + markdown body (instructions)
- **Optional resources**: Scripts, reference docs, templates in subdirectories

**SKILL.md Format:**

```markdown
---
name: code-review
description: Reviews code for bugs, security vulnerabilities, and best practices
license: Apache-2.0
allowed-tools: file_read, shell
---

# Code Review Instructions

When reviewing code, follow these steps:
1. Security Analysis: Check for common vulnerabilities
2. Code Quality: Look for bugs and edge cases
3. Best Practices: Verify coding standards
...
```

**Directory Structure:**

```
skills/
├── code-review/
│   ├── SKILL.md
│   ├── scripts/
│   └── references/
└── documentation/
    └── SKILL.md
```

## Decision

Add a `skills` parameter to the Agent class that accepts skill paths or Skill objects, with support for dynamic skill management and active skill tracking.

### API Changes

#### Agent Parameter

```python
class Agent:
    def __init__(
        self,
        # ... existing parameters ...
        skills: str | Path | Sequence[str | Path | Skill] | None = None,
    ):
        """
        Args:
            skills: Skills to make available to the agent. Can be:
                - String/Path to a directory containing skill subdirectories
                - Sequence of paths to individual skill directories
                - Sequence of Skill objects
                - Mix of the above
                
                Skills are evaluated at each invocation, so changes to this
                property take effect on the next agent call.
        """
    
    @property
    def skills(self) -> list[Skill] | None:
        """Currently configured skills. Mutable - changes apply to next invocation."""
        
    @skills.setter
    def skills(self, value: str | Path | Sequence[str | Path | Skill] | None) -> None:
        """Set skills. Accepts same types as __init__ parameter."""
    
    @property
    def active_skill(self) -> Skill | None:
        """The skill currently being used, if any."""
```

#### Skill Class

```python
@dataclass
class Skill:
    """A skill that provides specialized instructions to an agent."""
    name: str
    description: str
    instructions: str = ""
    path: Path | None = None
    allowed_tools: list[str] | None = None
    metadata: dict[str, Any] = field(default_factory=dict)
    
    @classmethod
    def from_path(cls, skill_path: str | Path) -> "Skill":
        """Load a skill from a directory or SKILL.md file."""
```

#### Loader Functions

```python
def load_skills(skills_dir: str | Path) -> list[Skill]:
    """Load all skills from a directory."""

def load_skill(skill_path: str | Path) -> Skill:
    """Load a single skill from a directory or SKILL.md file."""
```

#### Module Exports

```python
# strands/__init__.py
from strands.skills import Skill

# strands/skills/__init__.py
from strands.skills.skill import Skill
from strands.skills.loader import load_skills, load_skill
from strands.skills.errors import SkillLoadError

__all__ = ["Skill", "load_skills", "load_skill", "SkillLoadError"]
```

### How It Integrates

**System Prompt Composition:**

When `skills` is set, skill metadata is appended to the system prompt:

```
[User's system_prompt]

## Available Skills

You have access to specialized skills that provide detailed instructions.
When a task matches a skill's description, read its full instructions.

- **code-review**: Reviews code for bugs, security vulnerabilities...
  Location: /path/to/skills/code-review/SKILL.md

- **documentation**: Generates clear, comprehensive documentation
  Location: /path/to/skills/documentation/SKILL.md
```

**Dynamic Evaluation:**

Skills are processed at each invocation, not at init. This allows:
- Changing skills between calls
- Adding/removing skills programmatically
- Session-based skill management

**allowed_tools Enforcement:**

When a skill with `allowed_tools` is active, tool calls are filtered via `BeforeToolCallEvent`:

```python
# Internal hook enforces tool restrictions
class SkillToolEnforcer(HookProvider):
    def check_tool_allowed(self, event: BeforeToolCallEvent):
        if active_skill and active_skill.allowed_tools:
            if tool_name not in active_skill.allowed_tools:
                event.cancel_tool = f"Tool '{tool_name}' not allowed by skill"
```

**Session Manager Integration:**

Skills state persists with SessionManager:

```python
# Session stores:
{
    "skills": {
        "configured": ["./skills/code-review", "./skills/docs"],
        "active_skill_name": "code-review"
    }
}
```

### Relationship to `skills` Tool

| SDK `skills` param | `skills` tool |
|-------------------|---------------|
| Static config at init/runtime | Dynamic discovery by agent |
| Metadata in system prompt | Full progressive disclosure |
| Developer controls which skills | Agent decides when to activate |

They complement each other - use SDK param for "always available" skills, use tool for "discover as needed".

## Developer Experience

### Basic Usage

```python
from strands import Agent
from strands_tools import file_read

# Point to skills directory - that's it
agent = Agent(
    skills="./skills",
    tools=[file_read]
)

result = agent("Review my code for security issues")
print(f"Used skill: {agent.active_skill.name if agent.active_skill else 'none'}")
```

### Dynamic Skill Management

```python
agent = Agent(tools=[file_read])

# No skills initially
agent("Hello")

# Add skills dynamically
agent.skills = "./skills"
agent("Review my code")

# Switch skills
agent.skills = ["./skills/documentation"]
agent("Write docs for this API")

# Clear skills
agent.skills = None
```

### With Custom System Prompt

```python
agent = Agent(
    system_prompt="You are a senior engineer at Acme Corp.",
    skills="./company-skills",
    tools=[file_read, shell]
)
```

### Tool Restrictions

```python
# SKILL.md with: allowed-tools: file_read

agent = Agent(
    skills=["./skills/safe-analyzer"],
    tools=[file_read, shell, http_request]  # shell, http blocked when skill active
)
```

### Programmatic Skills

```python
from strands import Agent, Skill

review_skill = Skill(
    name="quick-review",
    description="Quick code review focusing on obvious issues",
    instructions="# Guidelines\n\n1. Focus on bugs\n2. Check security...",
    allowed_tools=["file_read"]
)

agent = Agent(skills=[review_skill])
```

### Session Persistence

```python
from strands.session import FileSessionManager

agent = Agent(
    skills="./skills",
    session_manager=FileSessionManager("./sessions"),
    session_id="project-alpha"
)

# Skills config persists across sessions
```

### Active Skill in Hooks

```python
class SkillAnalytics(HookProvider):
    def register_hooks(self, registry):
        registry.add_callback(AfterInvocationEvent, self.track)
    
    def track(self, event):
        if event.agent.active_skill:
            print(f"Used skill: {event.agent.active_skill.name}")
```

## Alternatives Considered

### 1. Skills as a Separate Package

**Approach**: Keep skills entirely in `strands-tools` or a separate `strands-skills` package.

**Why not chosen**: 
- Less discoverable
- Requires additional dependency
- Doesn't integrate with Agent lifecycle (session, hooks)

### 2. Deep Integration with Skill Modes

**Approach**: Add `skill_mode` parameter with options like "inject", "tool", "agent" for different skill activation patterns.

**Why not chosen**:
- Adds complexity without clear benefit
- Single mode (system prompt injection) covers most cases
- Users can build custom modes using hooks if needed

### 3. SkillProvider Interface

**Approach**: Create a `SkillProvider` protocol similar to `ToolProvider`.

**Why not chosen**:
- Over-engineering for the use case
- Skills are simpler than tools (just data, no execution)
- List of Skill objects is sufficient

### 4. Skill-Specific Hooks

**Approach**: Add `SkillActivatedEvent`, `SkillDeactivatedEvent`, etc.

**Why not chosen**:
- Existing hooks + `active_skill` property provide same capability
- Follows decision record: "Hooks as Low-Level Primitives"

## Consequences

### What becomes easier

- Loading and using skills from directories
- Sharing skills across agents and projects
- Tracking which skill is being used
- Restricting tools when skills are active
- Persisting skill state across sessions

### What becomes more difficult

- Nothing significant - the feature is additive

### Future Extensions

The design allows for future additions:
- Remote skill registries
- Skill versioning
- Multiple active skills
- Custom prompt templates

## Willingness to Implement

Yes, with guidance on:
- Exact placement of skills processing in the event loop
- Session manager schema changes
- Test coverage expectations
