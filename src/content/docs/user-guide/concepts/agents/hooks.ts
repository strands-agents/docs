import { Agent, FunctionTool } from '@strands-agents/sdk'
import type { AgentData, Plugin } from '@strands-agents/sdk'
import {
  BeforeInvocationEvent,
  AfterInvocationEvent,
  BeforeToolCallEvent,
  AfterToolCallEvent,
  BeforeModelCallEvent,
  AfterModelCallEvent,
  MessageAddedEvent,
} from '@strands-agents/sdk'

// Mock tools for examples
const myTool = new FunctionTool({
  name: 'my_tool',
  description: 'A sample tool',
  inputSchema: { type: 'object', properties: {} },
  callback: async () => 'result',
})

const calculator = new FunctionTool({
  name: 'calculator',
  description: 'Perform calculations',
  inputSchema: {
    type: 'object',
    properties: {
      expression: { type: 'string', description: 'Mathematical expression to evaluate' },
    },
  },
  callback: async (input: unknown) => {
    // Simple mock implementation
    const typedInput = input as { expression: string }
    return eval(typedInput.expression).toString()
  },
})

const sleep = new FunctionTool({
  name: 'sleep',
  description: 'Sleep for a specified duration',
  inputSchema: {
    type: 'object',
    properties: {
      duration: { type: 'number', description: 'Duration in milliseconds' },
    },
  },
  callback: async (input: unknown) => {
    const typedInput = input as { duration: number }
    await new Promise((resolve) => setTimeout(resolve, typedInput.duration))
    return `Slept for ${typedInput.duration}ms`
  },
})

// =====================
// Basic Usage Examples
// =====================

async function individualCallbackExample() {
  // --8<-- [start:individual_callback]
  const agent = new Agent()

  // Register individual callback
  const myCallback = (event: BeforeInvocationEvent) => {
    console.log('Custom callback triggered')
  }

  agent.addHook(BeforeInvocationEvent, myCallback)
  // --8<-- [end:individual_callback]
}

// =====================
// Advanced Usage Examples
// =====================

// Note: Invocation state feature is not yet available in TypeScript SDK
// This example is preserved for when the feature is implemented

async function toolInterceptionExample() {
  // --8<-- [start:tool_interception]
  class ToolInterceptor implements Plugin {
    name = 'tool-interceptor'

    initAgent(agent: AgentData): void {
      agent.addHook(BeforeToolCallEvent, (ev) => this.interceptTool(ev))
    }

    private interceptTool(event: BeforeToolCallEvent): void {
      if (event.toolUse.name === 'sensitive_tool') {
        // Replace with a safer alternative
        // Note: This is conceptual - actual API may differ
        console.log('Intercepting sensitive tool with safe alternative')
      }
    }
  }
  // --8<-- [end:tool_interception]
}

async function resultModificationExample() {
  // --8<-- [start:result_modification]
  class ResultProcessor implements Plugin {
    name = 'result-processor'

    initAgent(agent: AgentData): void {
      agent.addHook(AfterToolCallEvent, (ev) => this.processResult(ev))
    }

    private processResult(event: AfterToolCallEvent): void {
      if (event.toolUse.name === 'calculator') {
        // Add formatting to calculator results
        const textContent = event.result.content.find((block) => block.type === 'textBlock')
        if (textContent && textContent.type === 'textBlock') {
          // Note: In actual implementation, result modification may work differently
          console.log(`Would modify result: ${textContent.text}`)
        }
      }
    }
  }
  // --8<-- [end:result_modification]
}

// =====================
// Best Practices Examples
// =====================

async function composabilityExample() {
  // --8<-- [start:composability]
  class RequestLoggingHook implements Plugin {
    name = 'request-logging'

    initAgent(agent: AgentData): void {
      agent.addHook(BeforeInvocationEvent, (ev) => this.logRequest(ev))
      agent.addHook(AfterInvocationEvent, (ev) => this.logResponse(ev))
      agent.addHook(BeforeToolCallEvent, (ev) => this.logToolUse(ev))
    }

    // ...
    // --8<-- [end:composability]

    private logRequest(event: BeforeInvocationEvent): void {
      // ...
    }

    private logResponse(event: AfterInvocationEvent): void {
      // ...
    }

    private logToolUse(event: BeforeToolCallEvent): void {
      // ...
    }
  }
}

async function loggingModificationsExample() {
  // --8<-- [start:logging_modifications]
  class ResultProcessor implements Plugin {
    name = 'result-processor'

    initAgent(agent: AgentData): void {
      agent.addHook(AfterToolCallEvent, (ev) => this.processResult(ev))
    }

    private processResult(event: AfterToolCallEvent): void {
      if (event.toolUse.name === 'calculator') {
        const textContent = event.result.content.find((block) => block.type === 'textBlock')
        if (textContent && textContent.type === 'textBlock') {
          const originalContent = textContent.text
          console.log(`Modifying calculator result: ${originalContent}`)
          // Note: In actual implementation, result modification may work differently
          console.log(`Would modify to: Result: ${originalContent}`)
        }
      }
    }
  }
  // --8<-- [end:logging_modifications]
}

// =====================
// Cookbook Examples
// =====================

async function fixedToolArgumentsExample() {
  // --8<-- [start:fixed_tool_arguments_class]
  class ConstantToolArguments implements Plugin {
    private fixedToolArguments: Record<string, Record<string, unknown>>

    /**
     * Initialize fixed parameter values for tools.
     *
     * @param fixedToolArguments - A dictionary mapping tool names to dictionaries of
     *     parameter names and their fixed values. These values will override any
     *     values provided by the agent when the tool is invoked.
     */
    constructor(fixedToolArguments: Record<string, Record<string, unknown>>) {
      this.fixedToolArguments = fixedToolArguments
    }

    name = 'constant-tool-arguments'

    initAgent(agent: AgentData): void {
      agent.addHook(BeforeToolCallEvent, (ev) => this.fixToolArguments(ev))
    }

    private fixToolArguments(event: BeforeToolCallEvent): void {
      // If the tool is in our list of parameters, then use those parameters
      const parametersToFix = this.fixedToolArguments[event.toolUse.name]
      if (parametersToFix) {
        const toolInput = event.toolUse.input as Record<string, unknown>
        Object.assign(toolInput, parametersToFix)
      }
    }
  }
  // --8<-- [end:fixed_tool_arguments_class]

  // --8<-- [start:fixed_tool_arguments_usage]
  const fixParameters = new ConstantToolArguments({
    calculator: {
      precision: 1,
    },
  })

  const agent = new Agent({ tools: [calculator], plugins: [fixParameters] })
  const result = await agent.invoke('What is 2 / 3?')
  // --8<-- [end:fixed_tool_arguments_usage]
}
