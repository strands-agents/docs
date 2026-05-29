import {
  Agent, tool, InterruptResponseContent,
  SessionManager, FileStorage,
} from '@strands-agents/sdk'
import { HumanInTheLoop } from '@strands-agents/sdk/vended-interventions/hitl'
import { z } from 'zod'

// =====================
// Basic (Interrupt/Resume Mode)
// =====================

async function basicInterruptExample() {
  // --8<-- [start:basic_interrupt]
  const deleteFiles = tool({
    name: 'delete_files',
    description: 'Delete files at the given paths',
    inputSchema: z.object({ paths: z.array(z.string()) }),
    callback: (input) => `Deleted ${input.paths.length} files`,
  })

  const agent = new Agent({
    tools: [deleteFiles],
    interventions: [new HumanInTheLoop()],
  })

  // Agent pauses with stopReason 'interrupt' when a tool needs approval
  let result = await agent.invoke('Delete the temp files')

  if (result.stopReason === 'interrupt') {
    // Present the interrupt to the user (web UI, Slack, etc.)
    console.log(result.interrupts![0].reason)

    // Resume with the human's response
    result = await agent.invoke([
      new InterruptResponseContent({
        interruptId: result.interrupts![0].id,
        response: 'yes', // 'y', 'yes', or true → approved
      }),
    ])
  }

  console.log('Result:', result.lastMessage)
  // --8<-- [end:basic_interrupt]
}

// =====================
// Stdio Mode
// =====================

async function stdioModeExample() {
  // --8<-- [start:stdio_mode]
  // const deleteFiles = tool({ ... }) — same as above

  const agent = new Agent({
    tools: [deleteFiles],
    interventions: [new HumanInTheLoop({ ask: 'stdio' })],
  })

  await agent.invoke('Delete the temp files')
  // Terminal prompt:
  // Tool "delete_files" requires human approval. Input: {...} (y/n):
  // --8<-- [end:stdio_mode]
}

// =====================
// Custom Ask Callback
// =====================

async function customAskExample() {
  // --8<-- [start:custom_ask]
  // const deleteFiles = tool({ ... }) — same as above

  const agent = new Agent({
    tools: [deleteFiles],
    interventions: [
      new HumanInTheLoop({
        ask: async (prompt) => {
          // Your UI: Slack DM, web modal, push notification, etc.
          return await askUserViaSlack(prompt)
        },
      }),
    ],
  })

  await agent.invoke('Delete the temp files')
  // --8<-- [end:custom_ask]
}

// =====================
// Allowed Tools
// =====================

async function allowedToolsExample() {
  // --8<-- [start:allowed_tools]
  // const deleteFiles = tool({ ... }) — same as above
  // const readFile = tool({ ... })

  const agent = new Agent({
    tools: [readFile, deleteFiles],
    interventions: [
      new HumanInTheLoop({
        ask: 'stdio',
        // Pattern syntax:
        //   'read_file'             → runs without approval
        //   '*'                     → all tools run freely (disables handler)
        //   ['*', '!delete_files']  → all except delete_files
        allowedTools: ['read_file'],
      }),
    ],
  })

  await agent.invoke('Read config.json then delete /tmp/old-logs')
  // Only delete_files prompts; read_file executes immediately
  // --8<-- [end:allowed_tools]
}

// =====================
// Trust Mode
// =====================

async function trustModeExample() {
  // --8<-- [start:trust_mode]
  // const deleteFiles = tool({ ... }) — same as above

  const agent = new Agent({
    tools: [deleteFiles],
    interventions: [
      new HumanInTheLoop({
        ask: 'stdio',
        enableTrust: true,
      }),
    ],
  })

  await agent.invoke('Delete all log files in /tmp')
  // First call: user responds 't' → approved AND remembered
  // Subsequent calls: no prompt needed for the session
  // --8<-- [end:trust_mode]
}

// =====================
// Custom Evaluate (OTP example)
// =====================

async function customEvaluateExample() {
  // --8<-- [start:custom_evaluate]
  const transferFunds = tool({
    name: 'transfer_funds',
    description: 'Transfer funds between accounts',
    inputSchema: z.object({
      from: z.string(),
      to: z.string(),
      amount: z.number(),
    }),
    callback: (input) =>
      `Transferred $${input.amount} from ${input.from} to ${input.to}`,
  })

  const expectedOtp = '483291'

  const agent = new Agent({
    tools: [transferFunds],
    interventions: [
      new HumanInTheLoop({
        ask: async (prompt) => {
          await sendOtpToUser(expectedOtp)
          return await collectUserInput(
            prompt + ' Enter OTP to confirm:'
          )
        },
        // Only approve if the user enters the correct OTP
        evaluate: (response) => response === expectedOtp,
      }),
    ],
  })

  await agent.invoke('Transfer $500 from checking to savings')
  // --8<-- [end:custom_evaluate]
}

// =====================
// Cloud / API Server (Interrupt/Resume with Session)
// =====================

async function cloudApiExample() {
  // --8<-- [start:cloud_api]
  const deleteFiles = tool({
    name: 'delete_files',
    description: 'Delete files at the given paths',
    inputSchema: z.object({ paths: z.array(z.string()) }),
    callback: (input) => `Deleted ${input.paths.length} files`,
  })

  const readFile = tool({
    name: 'read_file',
    description: 'Read a file',
    inputSchema: z.object({ path: z.string() }),
    callback: (input) => `Contents of ${input.path}`,
  })

  function createAgent() {
    return new Agent({
      tools: [deleteFiles, readFile],
      interventions: [
        new HumanInTheLoop({ allowedTools: ['read_file'] }),
      ],
      sessionManager: new SessionManager({
        sessionId: 'my-session',
        storage: {
          snapshot: new FileStorage('/path/to/storage'),
        },
      }),
    })
  }

  // Request 1: Agent tries to delete → pauses with interrupt
  const agent = createAgent()
  const result = await agent.invoke('Delete the temp files')

  if (result.stopReason === 'interrupt') {
    const pending = {
      interruptId: result.interrupts![0].id,
      reason: result.interrupts![0].reason,
    }
    // ... return pending to client via HTTP response
  }

  // Request 2: Client sends back approval
  const resumedAgent = createAgent()
  const finalResult = await resumedAgent.invoke([
    new InterruptResponseContent({
      interruptId: 'the-interrupt-id',
      response: 'yes',
    }),
  ])
  // --8<-- [end:cloud_api]
}

// Suppress unused function warnings
void basicInterruptExample
void stdioModeExample
void customAskExample
void allowedToolsExample
void trustModeExample
void customEvaluateExample
void cloudApiExample

declare function askUserViaSlack(prompt: string): Promise<string>
declare function sendOtpToUser(otp: string): Promise<void>
declare function collectUserInput(prompt: string): Promise<string>
