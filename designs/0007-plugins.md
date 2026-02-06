# Strands High Level Features

## Where we are

The Strands Agents SDK makes it easy to write an agent in a few lines of code. We designed our agent class around the four key components that make up an Agent: The model, system prompt, tools, and context (messages). These components are easy to alter through direct access (`agent.system_prompt = "hello!"`), and we introduced hooks to make it easy to access them during lifecycle events in the agentic loop. These components represent some of the **low-level primitives** in our SDK.

```python
agent = Agent(
    model=BedrockModel(),            # Model provider
    tools=[calculator, search],      # Tool functions
    system_prompt="You are...",      # Instructions
    messages=[],                     # Conversation history
    hooks=[],                        # Hooks
)
```


As we have listened to our customers, we have identified features that are useful and popular in this space: Conversation Manager, Session Manager, Retry Strategy, Structured Output, and a few more. These components do something with the **low-level primitives** in order to provide some benefit to the execution of an agent, and represent **high-level abstractions**.

## There is no "one way" to build an Agent

As the Agentic space develops, many new ways to develop agents are becoming popular. For example, Anthropic skills represent an opinionated way to implement the concept of "progressive disclosure" to agents. It works by defining `SKILLS.md` files which contain frontmatter with a name and description describing the skill, and the rest of the file contains the actual instructions for the skill. Agents are provided with just the name and description, and can opt-in to reading the rest of the file if it thinks it needs the additional context.

Anthropic skills represent one of the many ways to build an Agent, but with some other popular examples being: Steering, Code-Act, [Ralph Wiggum](https://awesomeclaude.ai/ralph-wiggum), Memory (Agentcore or otherwise), and many many more. Additionally, these concepts don't need to exist in isolation; You can build an agent that uses both Anthropic Skills and Steering.

## Adding a new concept to Strands - Plugins

Strands SDK has defined its **low-level primitives** in such a way that any of these "agent-building techniques" are possible to implement, but there are issues with the recommended path.

The current recommended approach in the sdk to add new functionality is to either introduce a new initialization parameter to the agent, or create a `HookProvider` which introduces this functionality. We cannot reasonably add `n` number of new parameters to the Agent, so the best path forward is to start creating and vending new `HookProvider` in the sdk. 

Hook Providers ultimately solve our problem since they are composable, provide the necessary functionality to integrate rich features throughout an agents execution, and have been battle tested by many of our existing **high-level abstractions**.

One problem with `HookProviders` is that their name does not best communicate what they are positioned to do. Their name overlaps with the **low-level primitives** hooks, so it can be not-so intuitive when applying a high-level feature, like Anthropic Skills, through a `hooks` parameter (see code below). I propose that we create a new `Plugin` concept, and a `plugins` agent init parameter, as plugins are a common term in the industry to represent adding new functionality to a system.

```python
# Between these two examples, I think the plugins example
# does a better job communicating the feature
agent = Agent(hooks=[AnthropicSkills()])

agent = Agent(plugins=[AnthropicSkills()])
```
**Note**: `Extension` is another option, but I am just biased toward plugins. Either way, we need a new named term to represent the introduction of these features in the sdk.

The difference between [Hooks vs HookProvider vs Plugins](#hooks-vs-hookprovider-vs-plugins) is covered below.

### What is a `Plugin`?

`Plugins` provide a mechanism for customers to apply a behavior change (like Anthropic Skills) to an agent in a way that is extensible, composable, and shareable.

#### Extensible
We will provide an abstraction for customers to implement their own plugins. While we may ship some with the sdk, customers are welcome to develop their own as well.

#### Composable
Multiple `Plugins` can be applied to a single agent. While we cannot guarantee that these plugins will not conflict with one another, it leads to maximum flexibility over what they can do.

#### Sharable
Similar to our guidance on **low-level primitives**, we will recommend that community members share their own plugins by vending their own packages through some distributions mechanism (pypi, npm, github, etc).


### What isn't a `Plugin`?

Today Strands ships with many **high-level abstractions** that the team has determined to be valuable to a majority of customers:
- Session Manager
- OTEL
- Conversation Manager
- RetryStrategy
- Steering

All of these features have been built into the sdk before the introduction of the concept of `Plugins`, but if they were built today, would potentially have been implemented as a `Plugin`. So this begs the question - What is or isn't a `Plugin`?

From the backwards compatibility perspective, we cannot just remove these features and make turn them into plugins, but we can re-think how we categorize these features. If a feature needs to perform an action that cannot be accomplished with the existing **low-level primitives** offered by the sdk, then the feature would likely not be considered a plugin. OTEL, for example, is a feature that may need to operate behind the scenes of the existing primitives (creating traces around the execution of primitives), so it does not fit well into the `Plugin` terminology. However the rest of the features mentioned in the list above can be reasonably defined as a `Plugin`.

That being said, some features have a large impact on a majority of agents, so giving them a top-level agent initialization parameter help distinguish them from the feature-set of other `Plugins`. This also helps signal that they are "mostly" cross-compatible with any other `Plugin`.

A good example of this is the Session Manager, where persisting and restoring an agent is a common and useful feature, and can contain additional functionality of persisting the state of other plugins ([see Appendix](#persisting-the-state-of-plugins)). We can decide to uplevel a plugin to an Agent class attribute based on its use case.

### Hooks vs HookProvider vs Plugins
These features all have similar responsibilities, and the differences between them are nuanced, so here are definitions to explain what they do:

- **Hooks**: A low-level primitive of the Strands SDK. A hook is a mechanism to execute code at a specific lifecycle event in the SDK, and gives relevant context at that specific lifecycle event in order to change the standard agents behavior.
- **HookProvider**: A provider of hooks, with some convenience methods to make it easy to apply hooks to an agent.
- **Plugin**: A high-level abstraction of the Strands SDK. A plugin represents some change to the standard behavior of an Agent, modifying the agents core attributes in order to elicit a desired behavior.

Just about every `Plugin` in Strands will depend on hooks, but a `Plugin` represents the application of a behavior to an agent, not a targeted change at a lifecycle event. `HookProviders` serve a similar role, so below is a code example comparing the two:

```python
# HookProvider example
class LoggingHook(HookProvider):
    # protocol method for a HookProvider
    def register_hooks(self, registry: HookRegistry) -> None:
        registry.add_callback(BeforeInvocationEvent, self.log_start)
        registry.add_callback(AfterInvocationEvent, self.log_end)

    def log_start(self, event: BeforeInvocationEvent) -> None:
        print(f"Request started for agent: {event.agent.name}")

    def log_end(self, event: AfterInvocationEvent) -> None:
        print(f"Request completed for agent: {event.agent.name}")

agent = Agent(hooks=[LoggingHook()])

# Plugin example
# Note: Shape here is an example, not finalized
class LoggingPlugin(Plugin):
    # Protocol method for a Plugin
    def init_plugin(self, agent: Agent) -> None:
        agent.hooks.add_callback(BeforeInvocationEvent, self.log_start)
        agent.hooks.add_callback(AfterInvocationEvent, self.log_end)

    def log_start(self, event: BeforeInvocationEvent) -> None:
        print(f"Request started for agent: {event.agent.name}")

    def log_end(self, event: AfterInvocationEvent) -> None:
        print(f"Request completed for agent: {event.agent.name}")

# Passed in via the hooks parameter
agent = Agent(plugins=[LoggingPlugin()])
```

This comparison of `HookProvider` to a `Plugin` shows that the devex is essentially the same (same lines of code), meaning that as a customer it would be confusing why to choose one over the other; and there aren't many good reasons to (please suggest if you do have some). As such, I'm proposing that we deprecate `HookProvider` in favor of `Plugin` moving forward. There is a world where `Plugins` can depend on `HookProviders`, and extend the behavior, but I think this leads to more indirection rather than proper abstractions. 

See [Proposed SDK Architecture Changes](#proposed-sdk-architecture-changes) to better understand how the code will change.


## Proposed SDK Architecture Changes

Add a `plugins` agent init parameter, and deprecate `hooks`.

```python

class Plugin(Protocol):
    def init_plugin(self, agent: Agent):
        ...

agent = Agent(
    plugins=[
        SkillsPlugin(),
        CodeActPlugin()
    ],
    hooks=[]    # Deprecated
)

# Simple hook can still be defined as a plugin with a decorator
@hook
def log_calls(event: BeforeModelCallEvent): 
    print(f"Calling model...")

# Usage
agent = Agent(
    plugins=[log_calls]
)

# Or applied with direct-access
agent.hooks.add_callback(BeforeInvocationEvent, log_calls)
```

With this approach, we deprecate `HookProviders` and the top-level `hooks` parameter, introduce a new `Plugin` protocol and `plugins` agent init arg, and start vending Agent behavior changing features as `Plugins` (like steering).

An easy way to introduce low-level hooks is still valuable, so we can introduce a `@hook` decorator where you can wrap a function as a simple plugin.

# Appendix

## Persisting the state of Plugins
The Session Manager has the responsibility of persisting and restoring the state of an agent, along with any attached plugins. The recommended way to accomplish this for now would be to have plugins maintain their state in the `agent.state`. Then during initialization, session manager would restore `agent.state`, and each plugin could restore themselves in turn from `agent.state`.

We can expand this feature in the future where we namespace plugins and allow them to have their own namespace in the AgentState object to persist and restore their state during session restoration.

