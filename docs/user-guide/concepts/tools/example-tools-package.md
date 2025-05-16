# Example Built-in Tools

Strands offers an optional example tools package [`strands-agents-tools`]({{ tools_pypi }}) which includes pre-built tools to get started quickly experimenting with agents and tools during development. The package is also open source and available on [GitHub]({{ tools_repo_home }}).

Install the `strands-agents-tools` package by running:

```bash
pip install strands-agents-tools
```

## Available Tools

#### RAG & Memory
- [`retrieve`]({{ tools_repo }}/src/strands_tools/retrieve.py): Semantically retrieve data from Amazon Bedrock Knowledge Bases for RAG, memory, and other purposes

#### File Operations
- [`editor`]({{ tools_repo }}/src/strands_tools/editor.py): Advanced file editing operations
- [`file_read`]({{ tools_repo }}/src/strands_tools/file_read.py): Read and parse files
- [`file_write`]({{ tools_repo }}/src/strands_tools/file_write.py): Create and modify files

#### Shell & System
- [`environment`]({{ tools_repo }}/src/strands_tools/environment.py): Manage environment variables
- [`shell`]({{ tools_repo }}/src/strands_tools/shell.py): Execute shell commands

#### Code Interpretation
- [`python_repl`]({{ tools_repo }}/src/strands_tools/python_repl.py): Run Python code

#### Web & Network
- [`http_request`]({{ tools_repo }}/src/strands_tools/http_request.py): Make API calls, fetch web data, and call local HTTP servers

#### Multi-modal
- [`image_reader`]({{ tools_repo }}/src/strands_tools/image_reader.py): Process and analyze images
- [`generate_image`]({{ tools_repo }}/src/strands_tools/generate_image.py): Create AI generated images with Amazon Bedrock
- [`nova_reels`]({{ tools_repo }}/src/strands_tools/nova_reels.py): Create AI generated images with Nova Reels on Amazon Bedrock

#### AWS Services
- [`use_aws`]({{ tools_repo }}/src/strands_tools/use_aws.py): Interact with AWS services

#### Utilities
- [`calculator`]({{ tools_repo }}/src/strands_tools/calculator.py): Perform mathematical operations
- [`current_time`]({{ tools_repo }}/src/strands_tools/current_time.py): Get the current date and time
- [`load_tool`]({{ tools_repo }}/src/strands_tools/load_tool.py): Dynamically load more tools at runtime

#### Agents & Workflows
- [`agent_graph`]({{ tools_repo }}/src/strands_tools/agent_graph.py): Create and manage graphs of agents
- [`journal`]({{ tools_repo }}/src/strands_tools/journal.py): Create structured tasks and logs for agents to manage and work from
- [`swarm`]({{ tools_repo }}/src/strands_tools/swarm.py): Coordinate multiple AI agents in a swarm / network of agents
- [`stop`]({{ tools_repo }}/src/strands_tools/stop.py): Force stop the agent event loop
- [`think`]({{ tools_repo }}/src/strands_tools/think.py): Perform deep thinking by creating parallel branches of agentic reasoning
- [`use_llm`]({{ tools_repo }}/src/strands_tools/use_llm.py): Run a new AI event loop with custom prompts
- [`workflow`]({{ tools_repo }}/src/strands_tools/workflow.py): Orchestrate sequenced workflows