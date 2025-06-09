# Example Built-in Tools

Strands offers an optional example tools package [`strands-agents-tools`](https://pypi.org/project/strands-agents-tools/) which includes pre-built tools to get started quickly experimenting with agents and tools during development. The package is also open source and available on [GitHub](https://github.com/strands-agents/tools).

Install the `strands-agents-tools` package by running:

```
pip install strands-agents-tools

```

If using `mem0_memory`, install the the additional required dependencies by running:

```
pip install strands-agents-tools[mem0_memory]

```

## Available Tools

#### RAG & Memory

- [`retrieve`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/retrieve.py): Semantically retrieve data from Amazon Bedrock Knowledge Bases for RAG, memory, and other purposes
- [`memory`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/memory.py): Agent memory persistence in Amazon Bedrock Knowledge Bases
- [`mem0_memory`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/mem0_memory.py): Agent memory and personalization built on top of [Mem0](https://mem0.ai)

#### File Operations

- [`editor`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/editor.py): File editing operations like line edits, search, and undo
- [`file_read`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/file_read.py): Read and parse files
- [`file_write`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/file_write.py): Create and modify files

#### Shell & System

- [`environment`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/environment.py): Manage environment variables
- [`shell`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/shell.py): Execute shell commands
- [`cron`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/cron.py): Task scheduling with cron jobs

#### Code Interpretation

- [`python_repl`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/python_repl.py): Run Python code

#### Web & Network

- [`http_request`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/http_request.py): Make API calls, fetch web data, and call local HTTP servers
- [`slack`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/slack.py): Slack integration with real-time events, API access, and message sending

#### Multi-modal

- [`image_reader`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/image_reader.py): Process and analyze images
- [`generate_image`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/generate_image.py): Create AI generated images with Amazon Bedrock
- [`nova_reels`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/nova_reels.py): Create AI generated videos with Nova Reels on Amazon Bedrock
- [`speak`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/speak.py): Generate speech from text using macOS say command or Amazon Polly

#### AWS Services

- [`use_aws`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/use_aws.py): Interact with AWS services

#### Utilities

- [`calculator`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/calculator.py): Perform mathematical operations
- [`current_time`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/current_time.py): Get the current date and time
- [`load_tool`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/load_tool.py): Dynamically load more tools at runtime

#### Agents & Workflows

- [`agent_graph`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/agent_graph.py): Create and manage graphs of agents
- [`journal`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/journal.py): Create structured tasks and logs for agents to manage and work from
- [`swarm`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/swarm.py): Coordinate multiple AI agents in a swarm / network of agents
- [`stop`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/stop.py): Force stop the agent event loop
- [`think`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/think.py): Perform deep thinking by creating parallel branches of agentic reasoning
- [`use_llm`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/use_llm.py): Run a new AI event loop with custom prompts
- [`workflow`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/workflow.py): Orchestrate sequenced workflows

## Tool Consent and Bypassing

By default, certain tools that perform potentially sensitive operations (like file modifications, shell commands, or code execution) will prompt for user confirmation before executing. This safety feature ensures users maintain control over actions that could modify their system.

To bypass these confirmation prompts, you can set the `BYPASS_TOOL_CONSENT` environment variable:

```
# Set this environment variable to bypass tool confirmation prompts
export BYPASS_TOOL_CONSENT=true

```

Setting the environment variable within Python:

```
import os

os.environ["BYPASS_TOOL_CONSENT"] = "true"

```

When this variable is set to `true`, tools will execute without asking for confirmation. This is particularly useful for:

- Automated workflows where user interaction isn't possible
- Development and testing environments
- CI/CD pipelines
- Situations where you've already validated the safety of operations

**Note:** Use this feature with caution in production environments, as it removes an important safety check.
