AgentSkills plugin for integrating Agent Skills into Strands agents.

This module provides the AgentSkills class that extends the Plugin base class to add Agent Skills support. The plugin registers a tool for activating skills, and injects skill metadata into the system prompt.

#### SkillSource

A single skill source: path string, Path object, or Skill instance.

#### SkillSources

One or more skill sources.

## AgentSkills

```python
class AgentSkills(Plugin)
```

Defined in: [src/strands/vended\_plugins/skills/agent\_skills.py:44](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/skills/agent_skills.py#L44)

Plugin that integrates Agent Skills into a Strands agent.

The AgentSkills plugin extends the Plugin base class and provides:

1.  A `skills` tool that allows the agent to activate skills on demand
2.  System prompt injection of available skill metadata before each invocation
3.  Session persistence of active skill state via `agent.state`

Skills can be provided as filesystem paths (to individual skill directories or parent directories containing multiple skills) or as pre-built `Skill` instances.

**Example**:

```python
from strands import Agent
from strands.vended_plugins.skills import Skill, AgentSkills

# Load from filesystem
plugin = AgentSkills(skills=["./skills/pdf-processing", "./skills/"])

# Or provide Skill instances directly
skill = Skill(name="my-skill", description="A custom skill", instructions="Do the thing")
plugin = AgentSkills(skills=[skill])

agent = Agent(plugins=[plugin])
```

#### \_\_init\_\_

```python
def __init__(skills: SkillSources,
             state_key: str = _DEFAULT_STATE_KEY,
             max_resource_files: int = _DEFAULT_MAX_RESOURCE_FILES,
             strict: bool = False) -> None
```

Defined in: [src/strands/vended\_plugins/skills/agent\_skills.py:74](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/skills/agent_skills.py#L74)

Initialize the AgentSkills plugin.

**Arguments**:

-   `skills` - One or more skill sources. Can be a single value or a list. Each element can be:
    
    -   A `str` or `Path` to a skill directory (containing SKILL.md)
    -   A `str` or `Path` to a parent directory (containing skill subdirectories)
    -   A `Skill` dataclass instance
-   `state_key` - Key used to store plugin state in `agent.state`.
    
-   `max_resource_files` - Maximum number of resource files to list in skill responses.
    
-   `strict` - If True, raise on skill validation issues. If False (default), warn and load anyway.
    

#### init\_agent

```python
def init_agent(agent: Agent) -> None
```

Defined in: [src/strands/vended\_plugins/skills/agent\_skills.py:99](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/skills/agent_skills.py#L99)

Initialize the plugin with an agent instance.

Decorated hooks and tools are auto-registered by the plugin registry.

**Arguments**:

-   `agent` - The agent instance to extend with skills support.

#### skills

```python
@tool(context=True)
def skills(skill_name: str, tool_context: ToolContext) -> str
```

Defined in: [src/strands/vended\_plugins/skills/agent\_skills.py:112](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/skills/agent_skills.py#L112)

Activate a skill to load its full instructions.

Use this tool to load the complete instructions for a skill listed in the available\_skills section of your system prompt.

**Arguments**:

-   `skill_name` - Name of the skill to activate.

#### get\_available\_skills

```python
def get_available_skills() -> list[Skill]
```

Defined in: [src/strands/vended\_plugins/skills/agent\_skills.py:167](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/skills/agent_skills.py#L167)

Get the list of available skills.

**Returns**:

A copy of the current skills list.

#### set\_available\_skills

```python
def set_available_skills(skills: SkillSources) -> None
```

Defined in: [src/strands/vended\_plugins/skills/agent\_skills.py:175](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/skills/agent_skills.py#L175)

Set the available skills, replacing any existing ones.

Each element can be a `Skill` instance, a `str` or `Path` to a skill directory (containing SKILL.md), or a `str` or `Path` to a parent directory containing skill subdirectories.

Note: this does not persist state or deactivate skills on any agent. Active skill state is managed per-agent and will be reconciled on the next tool call or invocation.

**Arguments**:

-   `skills` - One or more skill sources to resolve and set.

#### get\_activated\_skills

```python
def get_activated_skills(agent: Agent) -> list[str]
```

Defined in: [src/strands/vended\_plugins/skills/agent\_skills.py:378](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/skills/agent_skills.py#L378)

Get the list of skills activated by this agent.

Returns skill names in activation order (most recent last).

**Arguments**:

-   `agent` - The agent to query.

**Returns**:

List of activated skill names.