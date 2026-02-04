# Skills Support

**Status**: Proposed

**Date**: 2025-02-04

**Issue**: https://github.com/strands-agents/sdk-python/issues/1181

## Context

### The Problem

Imagine you're building an agent that reviews code. You've carefully crafted instructions covering security analysis, best practices, and common pitfalls. Now you want to reuse those instructions across multiple agents, share them with your team, or swap them out depending on the task.

Today, you'd need to:

1. Manually read instruction files and concatenate them into your system prompt
2. Build your own logic to manage which instructions are active
3. Handle the plumbing of loading, parsing, and injecting skill content

This is exactly the kind of repetitive work that should be handled by the SDK.

### What Are Skills?

Skills are reusable instruction packages that follow the [AgentSkills.io](https://agentskills.io) specification—an open standard developed by Anthropic. A skill is simply a folder containing a `SKILL.md` file with metadata and instructions:

```markdown
---
name: code-review
description: Reviews code for bugs, security vulnerabilities, and best practices
allowed-tools: file_read, shell
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

### Who Needs This?

- **Developers** building agents that need specialized behaviors for different tasks
- **Teams** sharing agent capabilities across projects
- **Anyone** using Anthropic's skills or the AgentSkills.io ecosystem

## Decision

We're adding a `skills` parameter to the Agent class. Point it at a directory, and your agent gains access to those skills.

```python
from strands import Agent

agent = Agent(
    skills="./skills",
    tools=[file_read]
)
```

That's the happy path. For more control, you can pass specific skill paths, `Skill` objects, or mix them:

```python
agent = Agent(
    skills=[
        "./skills/code-review",
        "./skills/documentation",
        my_custom_skill,
    ]
)
```

### How It Works

When you set `skills`, the SDK:

1. Loads skill metadata (name, description, location) from each `SKILL.md`
2. Appends this metadata to your system prompt
3. Re-evaluates skills on each invocation, so you can change them between calls

The agent sees something like this in its system prompt:

```
## Available Skills

You have access to specialized skills. When a task matches a skill's 
description, read its full instructions from the location shown.

- **code-review**: Reviews code for bugs, security vulnerabilities...
  Location: /path/to/skills/code-review/SKILL.md

- **documentation**: Generates clear, comprehensive documentation
  Location: /path/to/skills/documentation/SKILL.md
```

The agent then uses `file_read` (or similar) to load full instructions when it decides a skill applies. This is progressive disclosure—metadata upfront, full content on demand.

### Dynamic Skill Management

Skills aren't baked in at init time. You can change them between invocations:

```python
agent = Agent(tools=[file_read])

# Start with no skills
agent("Hello!")

# Add skills for a code task
agent.skills = "./skills"
agent("Review this function for security issues")

# Switch to different skills
agent.skills = ["./skills/documentation"]  
agent("Write API docs for this module")

# Clear skills entirely
agent.skills = None
agent("What's the weather?")
```

### Tracking the Active Skill

The SDK tracks which skill the agent is currently using via `agent.active_skill`:

```python
result = agent("Review my authentication code")

if agent.active_skill:
    print(f"Agent used: {agent.active_skill.name}")
```

This is useful for analytics, conditional logic, and session persistence. The active skill is detected when the agent reads a `SKILL.md` file during invocation.

### Tool Restrictions with `allowed_tools`

Skills can specify which tools they're allowed to use:

```yaml
---
name: safe-analyzer
description: Analyzes files without executing code
allowed-tools: file_read
---
```

When this skill is active, the SDK blocks calls to tools not in the list. If the agent tries to use `shell`, it receives an error message explaining the restriction. This enforcement happens via the existing `BeforeToolCallEvent` hook.

### Session Persistence

When you use a SessionManager, skill configuration persists across sessions:

```python
agent = Agent(
    skills="./skills",
    session_manager=FileSessionManager("./sessions"),
    session_id="project-alpha"
)
```

The session stores which skills are configured and which skill was last active. When you restore the session, skills are reloaded from their paths.

### API Surface

**Agent changes:**

```python
class Agent:
    def __init__(
        self,
        # ... existing parameters ...
        skills: str | Path | Sequence[str | Path | Skill] | None = None,
    ): ...
    
    @property
    def skills(self) -> list[Skill] | None: ...
    
    @skills.setter
    def skills(self, value: str | Path | Sequence[str | Path | Skill] | None): ...
    
    @property
    def active_skill(self) -> Skill | None: ...
```

**New Skill class:**

```python
@dataclass
class Skill:
    name: str
    description: str
    instructions: str = ""
    path: Path | None = None
    allowed_tools: list[str] | None = None
    metadata: dict[str, Any] = field(default_factory=dict)
    
    @classmethod
    def from_path(cls, skill_path: str | Path) -> "Skill": ...
```

**Helper functions:**

```python
def load_skills(skills_dir: str | Path) -> list[Skill]: ...
def load_skill(skill_path: str | Path) -> Skill: ...
```

**Module exports:**

```python
# strands/__init__.py exports Skill
# strands/skills/__init__.py exports Skill, load_skills, load_skill, SkillLoadError
```

### Relationship to the `skills` Tool

The `skills` tool in strands-tools handles runtime skill discovery—the agent decides when to look for and activate skills. The SDK `skills` parameter handles static configuration—you decide which skills are available.

They complement each other:

| SDK `skills` parameter | `skills` tool |
|------------------------|---------------|
| You control which skills | Agent discovers skills |
| Configured at init or between calls | Activated during invocation |
| Metadata in system prompt | Full progressive disclosure |

Use the SDK parameter for "always available" skills. Use the tool for "discover as needed" scenarios.

## Developer Experience

### Basic Usage

```python
from strands import Agent
from strands_tools import file_read

agent = Agent(
    skills="./skills",
    tools=[file_read]
)

result = agent("Review my code for security issues")
```

### Combining with a Custom System Prompt

```python
agent = Agent(
    system_prompt="You are a senior engineer at Acme Corp. Be thorough.",
    skills="./company-skills",
    tools=[file_read, shell]
)
```

Your system prompt comes first, then the skills metadata is appended.

### Creating Skills Programmatically

You don't need `SKILL.md` files. Define skills in code:

```python
from strands import Agent, Skill

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

agent = Agent(skills=[review_skill])
```

### Filtering Skills

```python
from strands.skills import load_skills

all_skills = load_skills("./skills")

# Only allow specific skills
safe_skills = [s for s in all_skills if s.name in ["docs", "summarizer"]]

# Or filter out skills that can execute code
safe_skills = [s for s in all_skills 
               if not s.allowed_tools or "shell" not in s.allowed_tools]

agent = Agent(skills=safe_skills)
```

### Using Active Skill in Hooks

```python
from strands.hooks import HookProvider, AfterInvocationEvent

class SkillAnalytics(HookProvider):
    def __init__(self):
        self.usage = {}
    
    def register_hooks(self, registry):
        registry.add_callback(AfterInvocationEvent, self.track)
    
    def track(self, event):
        skill = event.agent.active_skill
        if skill:
            self.usage[skill.name] = self.usage.get(skill.name, 0) + 1

analytics = SkillAnalytics()
agent = Agent(skills="./skills", hooks=[analytics])
```

## Alternatives Considered

### Skills as a Separate Package

We considered keeping skills entirely in strands-tools or a separate package. This would be less discoverable and wouldn't integrate with the agent lifecycle (sessions, hooks). Skills are simple enough that they belong in the core SDK.

### Skill Modes (inject/tool/agent)

We considered adding a `skill_mode` parameter to control how skills are activated—injected into prompts, loaded via tool calls, or run in sub-agents. This adds complexity without clear benefit. The single approach (metadata in prompt, full content on demand) covers most cases. Users who need different patterns can build them using hooks.

### SkillProvider Interface

We considered a `SkillProvider` protocol similar to `ToolProvider`. Skills are simpler than tools—they're just data, not executable code. A list of `Skill` objects is sufficient.

### Skill-Specific Hooks

We considered adding `SkillActivatedEvent` and similar hooks. The existing hooks combined with `agent.active_skill` provide the same capability without new abstractions.

## Consequences

### What Becomes Easier

- Loading skills from directories with a single parameter
- Sharing skills across agents and projects
- Changing skills dynamically between invocations
- Tracking which skill the agent is using
- Restricting tools when specific skills are active
- Persisting skill state across sessions

### What Becomes More Difficult

Nothing significant. The feature is additive.

### Future Extensions

This design allows for:

- Remote skill registries
- Skill versioning
- Multiple simultaneous active skills
- Custom prompt templates for skill metadata

## Willingness to Implement

Yes, with guidance on:

- Exact placement of skills processing in the invocation flow
- Session manager schema for skill state
- Test coverage expectations
