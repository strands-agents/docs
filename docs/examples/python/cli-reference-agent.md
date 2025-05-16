# A CLI reference implementation of a Strands agent

The Strands CLI is a reference implementation built on top of the Strands SDK. It provides a terminal-based interface for interacting with Strands agents, demonstrating how to make a fully interactive streaming application with the Strands SDK. 

## Prerequisites

Before installing the Strands CLI, ensure you have:

- Python 3.10 or higher
- pip (Python package installer)
- git
- AWS account with Bedrock access (for using Bedrock models)
- AWS credentials configured (for AWS integrations)

## Standard Installation

To install the Strands CLI:

```bash
# Clone repository
git clone https://github.com/strands-agents/agent-builder ~/.strands

# Run Strands CLI installer
~/.strands/install.sh && $SHELL

# Run Strands CLI
strands
```

## Manual Installation

If you prefer to install manually:

```bash
# Clone repository
git clone https://github.com/strands-agents/agent-builder /path/to/custom/location

# Create virtual environment
cd /path/to/custom/location
python -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -e .

# Create symlink
sudo ln -sf /path/to/custom/location/venv/bin/strands /usr/local/bin/strands
```

## CLI Verification

To verify your CLI installation:

```bash
# Run Strands CLI with a simple query
strands "Hello, Strands!"
```

## Command Line Arguments

| Argument | Description | Example |
|----------|-------------|---------|
| `query` | Question or command for Strands | `strands "What's the current time?"` |
| `--tools` | Comma-separated list of tools to enable | `strands --tools=calculator,memory` |
| `--memory` | Enable memory with optional knowledge base ID | `strands --memory` or `strands --memory kb-123` |
| `--debug` | Enable debug mode | `strands --debug` |

## Interactive Mode Commands

When running Strands in interactive mode, you can use these special commands:

| Command | Description |
|---------|-------------|
| `/exit` or `exit` | Exit Strands CLI |
| `/clear` | Clear conversation history |
| `/tips` | Show helpful tips |
| `/feedback [text]` | Submit feedback or bug report |
| `/messages` | Show current conversation messages |
| `/messages_json` | Show conversation as formatted JSON |
| `/dev` | Toggle developer mode |
| `/tools` | List all available tools |
| `!command` | Execute shell command directly |

## Shell Integration

Strands CLI integrates with your shell in several ways:

### Direct Shell Commands

Execute shell commands directly by prefixing with `!`:

```bash
> !ls -la
> !git status
> !docker ps
```

### Natural Language Shell Commands

Ask Strands to run shell commands using natural language:

```bash
> Show me all running processes
> Create a new directory called "project" and initialize a git repository there
> Find all Python files modified in the last week
```

## Environment Variables

Strands CLI respects these environment variables for basic configuration:

| Variable | Description | Default |
|----------|-------------|---------|
| `MODEL_ID` | Bedrock model identifier | `us.anthropic.claude-3-7-sonnet-20250219-v1:0` |
| `SYSTEM_PROMPT` | System instructions for the agent | `You are a helpful agent.` |
| `TOOLS` | JSON array of tools to enable | All tools |
| `KNOWLEDGE_BASE_ID` | Knowledge base for memory integration | None |
| `REGION` | AWS region for Bedrock client | `us-west-2` |
| `DEV` | Enable developer mode | `false` |
| `S3_BUCKET_PREFIX` | Prefix for S3 bucket names | `strands-conversations-` |

Example:

```bash
# Enable specific tools and set region
export TOOLS='["calculator", "memory", "file_read"]'
export REGION="us-east-1"
export MODEL_ID="anthropic.claude-3-5-sonnet-20241022-v2:0"
strands
```

## Advanced Environment Variables

For advanced configuration, these environment variables are available:

| Variable | Description | Default |
|----------|-------------|---------|
| `MAX_HISTORY_WINDOW` | Maximum messages kept in context | `40` |
| `MIN_WINDOW_SIZE` | Minimum window size for context reduction | `2` |
| `MAX_TOKENS` | Maximum tokens in response | `8192` |
| `TEMPERATURE` | Response randomness (0.0-1.0) | `1.0` |
| `STRANDS_MAX_RETRIES` | Maximum retries for API calls | `3` |
| `STRANDS_CLIENT_TIMEOUT` | Client timeout in seconds | `900` |
| `STRANDS_RECORD_TOOL_CALL` | Whether to record tool calls in history | `true` |
| `MAX_PARALLEL_TOOLS` | Maximum parallel tool executions | CPU count |
| `STRANDS_HOME` | Home directory for Strands configuration | `~/.strands` |
| `THINKING` | Enable thinking mode (Claude 3.7 only) | `disabled` |
| `BUDGET_TOKENS` | Tokens allocated for thinking | `1024` |

## Configuration Files

Strands CLI looks for configuration in these locations:

### Default Configuration

```bash
~/.strands/config.json
```

Example configuration file:

```json
{
  "model_id": "anthropic.claude-3-5-sonnet-20241022-v2:0",
  "system_prompt": "You are a helpful assistant focused on helping developers with coding tasks.",
  "tools": ["calculator", "file_read", "memory", "shell"],
  "region": "us-west-2",
  "knowledge_base_id": "your-kb-id",
  "max_history_window": 30,
  "temperature": 0.7
}
```

### Project-specific Configuration

You can also create project-specific configuration files:

```bash
./strands.json
```

This will be loaded when Strands is run from that directory.

## Command Line Arguments

Command line arguments override any configuration from files or environment variables:

```bash
# Enable specific tools
strands --tools=calculator,memory,file_read

# Set model ID
strands --model=anthropic.claude-3-5-sonnet-20241022-v2:0

# Enable memory with knowledge base
strands --memory your-kb-id

# Enable debug mode
strands --debug
```

## Log Configuration

Strands CLI logs are stored in these locations:

```bash
~/.strands/logs/strands.log     # Main log file
~/.strands/logs/strands-debug.log  # Debug log file (when --debug is enabled)
```

You can configure logging behavior with:

```bash
# Set log level
export STRANDS_LOG_LEVEL=DEBUG  # Options: DEBUG, INFO, WARNING, ERROR

# Set log file location
export STRANDS_LOG_FILE=/path/to/custom/log/file.log
```

## Custom Tool Configuration

Custom tools are loaded from these directories:

```bash
~/.strands/tools/     # User-level tools
./tools/              # Project-level tools (in current directory)
```

