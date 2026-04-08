Vended tools are pre-built tools included directly in the Strands SDK for common agent tasks like file operations, shell commands, HTTP requests, and persistent notes.

They ship as part of the SDK package and are updated alongside it — see [Versioning & Maintenance](#versioning--maintenance) for details on how changes are communicated and what level of backwards compatibility they maintain.

## Quick Start

Each tool is imported from its own subpath under `@strands-agents/sdk/vended-tools` — no additional packages required:

```typescript
import { Agent } from '@strands-agents/sdk'
import { bash } from '@strands-agents/sdk/vended-tools/bash'
import { fileEditor } from '@strands-agents/sdk/vended-tools/file-editor'
import { httpRequest } from '@strands-agents/sdk/vended-tools/http-request'
import { notebook } from '@strands-agents/sdk/vended-tools/notebook'

const agent = new Agent({
  tools: [bash, fileEditor, httpRequest, notebook],
})
```

## Available Tools

| Tool | Description | Supported in |
| --- | --- | --- |
| [File Editor](#file-editor) | View, create, and edit files | Node.js |
| [HTTP Request](#http-request) | Make HTTP requests to external APIs | Node.js 20+, browsers |
| [Notebook](#notebook) | Manage persistent text notebooks | Node.js, browsers |
| [Bash](#bash) | Execute shell commands with persistent sessions | Node.js (Unix/Linux/macOS) |

### File Editor

Gives your agent the ability to read and modify files on disk — useful for coding agents, config management, or any workflow where the agent needs to inspect output and make targeted edits.

*Supported in: Node.js only.*

Security Warning

This tool reads and writes files with the full permissions of the Node.js process. Only use with trusted input and consider running in a sandboxed environment for production.

**Example:**

```typescript
import { Agent } from '@strands-agents/sdk'
import { fileEditor } from '@strands-agents/sdk/vended-tools/file-editor'

const agent = new Agent({
  tools: [fileEditor],
})

// Create, view, and edit files
await agent.invoke('Create a file /tmp/config.json with {"debug": false}')
await agent.invoke('Replace "debug": false with "debug": true in /tmp/config.json')
await agent.invoke('View lines 1-10 of /tmp/config.json')
```

📖 [Full API Reference](https://github.com/strands-agents/sdk-typescript/blob/main/src/vended-tools/file-editor/README.md)

---

### HTTP Request

Lets your agent call external APIs and fetch web content. Supports all HTTP methods, custom headers, and request bodies. Default timeout is 30 seconds.

*Supported in: Node.js 20+, modern browsers.*

**Example:**

```typescript
import { Agent } from '@strands-agents/sdk'
import { httpRequest } from '@strands-agents/sdk/vended-tools/http-request'

const agent = new Agent({
  tools: [httpRequest],
})

// Make API requests
await agent.invoke('Get data from https://api.example.com/users')
await agent.invoke('Post {"name": "John"} to https://api.example.com/users')
```

📖 [Full API Reference](https://github.com/strands-agents/sdk-typescript/blob/main/src/vended-tools/http-request/README.md)

---

### Notebook

A scratchpad the agent can read and write across invocations. The most effective use is giving the agent a notebook at the start of a task and instructing it to plan its work there — it can break the task into steps, check things off as it goes, and always have a clear picture of what’s left. Notebook state is part of the agent’s state, so it persists automatically with [Session Management](/docs/user-guide/concepts/agents/session-management/index.md).

*Supported in: Node.js, browsers.*

**Example - Task Management:**

```typescript
import { Agent } from '@strands-agents/sdk'
import { notebook } from '@strands-agents/sdk/vended-tools/notebook'

const agent = new Agent({
  tools: [notebook],
  systemPrompt:
    'Before starting any multi-step task, create a notebook with a checklist of steps. ' +
    'Check off each step as you complete it.',
})

// The agent uses the notebook to plan and track its work
await agent.invoke('Write a project plan for building a personal budget tracker app')
```

**Example - State Persistence:**

```typescript
import { Agent, SessionManager, FileStorage } from '@strands-agents/sdk'
import { notebook } from '@strands-agents/sdk/vended-tools/notebook'

const session = new SessionManager({
  sessionId: 'my-session',
  storage: { snapshot: new FileStorage('./sessions') },
})

const agent = new Agent({ tools: [notebook], sessionManager: session })

// Notebooks are automatically persisted as part of the session
await agent.invoke('Create a notebook called "ideas" with "# Project Ideas"')
await agent.invoke('Add "- Build a web scraper" to the ideas notebook')

// ...

// Later, a new agent with the same session restores notebooks automatically
const restoredAgent = new Agent({ tools: [notebook], sessionManager: session })
await restoredAgent.invoke('Read the ideas notebook')
```

📖 [Full API Reference](https://github.com/strands-agents/sdk-typescript/blob/main/src/vended-tools/notebook/README.md)

---

### Bash

Lets your agent run shell commands and act on the output. Shell state — variables, working directory, exported functions — persists across invocations within the same session, so the agent can build up context incrementally. Sessions can be restarted to clear state.

*Supported in: Node.js on Unix/Linux/macOS. Not supported on Windows.*

Security Warning

This tool executes arbitrary bash commands without sandboxing. Commands run with the full permissions of the Node.js process. Only use with trusted input and consider running in sandboxed environments (containers, VMs) for production.

**Example - File Operations:**

```typescript
import { Agent } from '@strands-agents/sdk'
import { bash } from '@strands-agents/sdk/vended-tools/bash'

const agent = new Agent({
  tools: [bash],
})

// List files and create a new file
await agent.invoke('List all files in the current directory')
await agent.invoke('Create a new file called notes.txt with "Hello World"')
```

**Example - Session Persistence:**

```typescript
import { Agent } from '@strands-agents/sdk'
import { bash } from '@strands-agents/sdk/vended-tools/bash'

const agent = new Agent({
  tools: [bash],
})

// Variables persist across invocations within the same session
await agent.invoke('Run: export MY_VAR="hello"')
await agent.invoke('Run: echo $MY_VAR') // Will show "hello"

// Restart session to clear state
await agent.invoke('Restart the bash session')
await agent.invoke('Run: echo $MY_VAR') // Variable will be empty
```

📖 [Full API Reference](https://github.com/strands-agents/sdk-typescript/blob/main/src/vended-tools/bash/README.md)

---

## Using Multiple Tools Together

Combine vended tools to build powerful agent workflows:

```typescript
import { Agent } from '@strands-agents/sdk'
import { bash } from '@strands-agents/sdk/vended-tools/bash'
import { fileEditor } from '@strands-agents/sdk/vended-tools/file-editor'
import { notebook } from '@strands-agents/sdk/vended-tools/notebook'

const agent = new Agent({
  tools: [bash, fileEditor, notebook],
  systemPrompt: [
    'You are a software development assistant.',
    'When given a feature to implement:',
    '1. Use the notebook tool to create a plan with a checklist of steps',
    '2. Work through each step, checking them off as you go',
    '3. Use the bash tool to run tests and verify your changes',
  ].join('\n'),
})

// Agent plans the work, implements it, and tracks progress
await agent.invoke(
  'Add input validation to the createUser function in src/users.ts. ' +
    'It should reject empty names and invalid email formats.',
)
```

## Versioning & Maintenance

Vended tools ship as part of the SDK and are updated alongside it. Report bugs and feature requests in the [TypeScript SDK GitHub repository](https://github.com/strands-agents/sdk-typescript/issues).

Tool names are stable and will not change. In minor versions, a tool’s description, spec, or parameters may be updated to improve effectiveness — these changes are noted in SDK release notes. Pin your SDK version and test after upgrades if your workflows depend on specific tool behavior.

## See also

-   [Custom Tools](/docs/user-guide/concepts/tools/custom-tools/index.md) — Build your own tools
-   [Community Tools Package](/docs/user-guide/concepts/tools/community-tools-package/index.md) — Python tools package with 30+ tools
-   [Session Management](/docs/user-guide/concepts/agents/session-management/index.md) — Persist agent state including notebooks
-   [Interrupts](/docs/user-guide/concepts/interrupts/index.md) — Implement approval workflows for sensitive operations
-   [Hooks](/docs/user-guide/concepts/agents/hooks/index.md) — Intercept and customize tool execution