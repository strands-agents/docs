import { Agent, FunctionTool } from '@strands-agents/sdk'
import type { LocalAgent, Plugin } from '@strands-agents/sdk'
import {
  BeforeInvocationEvent,
  AfterInvocationEvent,
  BeforeToolCallEvent,
  AfterToolCallEvent,
  BeforeModelCallEvent,
  AfterModelCallEvent,
  MessageAddedEvent,
} from '@strands-agents/sdk'
import {
  Graph,
  Swarm,
  BeforeNodeCallEvent,
  AfterNodeCallEvent,
} from '@strands-agents/sdk/multiagent'
import type { MultiAgent, MultiAgentPlugin } from '@strands-agents/sdk/multiagent'

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

    initAgent(agent: LocalAgent): void {
      agent.addHook(BeforeToolCallEvent, (event) => this.interceptTool(event))
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

    initAgent(agent: LocalAgent): void {
      agent.addHook(AfterToolCallEvent, (ev) => this.processResult(ev))
    }

    private processResult(event: AfterToolCallEvent): void {
      if (event.toolUse.name === 'calculator') {
        // Add formatting to calculator results
        const textContent = event.result.content.find(
          (block) => block.type === 'textBlock'
        )
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

    initAgent(agent: LocalAgent): void {
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

    initAgent(agent: LocalAgent): void {
      agent.addHook(AfterToolCallEvent, (ev) => this.processResult(ev))
    }

    private processResult(event: AfterToolCallEvent): void {
      if (event.toolUse.name === 'calculator') {
        const textContent = event.result.content.find(
          (block) => block.type === 'textBlock'
        )
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

    initAgent(agent: LocalAgent): void {
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

async function limitToolCountsExample() {
  // --8<-- [start:limit_tool_counts_class]
  class LimitToolCounts implements Plugin {
    private maxToolCounts: Record<string, number>
    private toolCounts: Record<string, number> = {}

    /**
     * Initialize with maximum allowed invocations per tool.
     *
     * @param maxToolCounts - A dictionary mapping tool names to their maximum
     *     allowed invocation counts per agent invocation.
     */
    constructor(maxToolCounts: Record<string, number>) {
      this.maxToolCounts = maxToolCounts
    }

    name = 'limit-tool-counts'

    initAgent(agent: LocalAgent): void {
      agent.addHook(BeforeInvocationEvent, () => this.resetCounts())
      agent.addHook(BeforeToolCallEvent, (event) => this.interceptTool(event))
    }

    private resetCounts(): void {
      this.toolCounts = {}
    }

    private interceptTool(event: BeforeToolCallEvent): void {
      const toolName = event.toolUse.name
      const maxToolCount = this.maxToolCounts[toolName]
      const toolCount = (this.toolCounts[toolName] ?? 0) + 1
      this.toolCounts[toolName] = toolCount

      if (maxToolCount !== undefined && toolCount > maxToolCount) {
        event.cancel =
          `Tool '${toolName}' has been invoked too many times and is now being throttled. ` +
          `DO NOT CALL THIS TOOL ANYMORE`
      }
    }
  }
  // --8<-- [end:limit_tool_counts_class]

  // --8<-- [start:limit_tool_counts_usage]
  const limitPlugin = new LimitToolCounts({ sleep: 3 })

  const agent = new Agent({ tools: [sleep], plugins: [limitPlugin] })

  // This call will only have 3 successful sleeps
  await agent.invoke("Sleep 5 times for 10ms each or until you can't anymore")
  // This will sleep successfully again because the count resets every invocation
  await agent.invoke('Sleep once')
  // --8<-- [end:limit_tool_counts_usage]
}

// =====================
// Multi-Agent Hook Examples
// =====================

async function orchestratorCallbackExample() {
  // --8<-- [start:orchestrator_callback]
  const researcher = new Agent({
    id: 'researcher',
    systemPrompt: 'You are a research specialist.',
  })
  const writer = new Agent({
    id: 'writer',
    systemPrompt: 'You are a writing specialist.',
  })

  const graph = new Graph({
    nodes: [researcher, writer],
    edges: [['researcher', 'writer']],
  })

  // Register individual callbacks on the orchestrator
  graph.addHook(BeforeNodeCallEvent, (event) => {
    console.log(`Node ${event.nodeId} starting`)
  })

  graph.addHook(AfterNodeCallEvent, (event) => {
    console.log(`Node ${event.nodeId} completed`)
  })
  // --8<-- [end:orchestrator_callback]
}

async function conditionalNodeExecutionExample() {
  // --8<-- [start:conditional_node_execution]
  const researcher = new Agent({
    id: 'researcher',
    systemPrompt: 'You are a research specialist.',
  })
  const writer = new Agent({
    id: 'writer',
    systemPrompt: 'You are a writing specialist.',
  })
  const reviewer = new Agent({
    id: 'reviewer',
    systemPrompt: 'You are a review specialist.',
  })

  const graph = new Graph({
    nodes: [researcher, writer, reviewer],
    edges: [
      ['researcher', 'writer'],
      ['writer', 'reviewer'],
    ],
  })

  // Cancel specific nodes based on custom conditions
  graph.addHook(BeforeNodeCallEvent, (event) => {
    if (event.nodeId === 'reviewer') {
      // Cancel with a custom message
      event.cancel = 'Skipping review for this run'
    }
  })
  // --8<-- [end:conditional_node_execution]
}

async function orchestratorAgnosticDesignExample() {
  // --8<-- [start:orchestrator_agnostic_design]
  class UniversalMultiAgentPlugin implements MultiAgentPlugin {
    readonly name = 'universal-multi-agent'

    initMultiAgent(orchestrator: MultiAgent): void {
      orchestrator.addHook(BeforeNodeCallEvent, (event) => {
        console.log(`Executing node ${event.nodeId} in ${orchestrator.id} orchestrator`)

        // Handle orchestrator-specific logic if needed
        if (orchestrator instanceof Graph) {
          this.handleGraphNode(event)
        } else if (orchestrator instanceof Swarm) {
          this.handleSwarmNode(event)
        }
      })
    }

    private handleGraphNode(event: BeforeNodeCallEvent): void {
      // Graph-specific handling
    }

    private handleSwarmNode(event: BeforeNodeCallEvent): void {
      // Swarm-specific handling
    }
  }
  // --8<-- [end:orchestrator_agnostic_design]
  void UniversalMultiAgentPlugin
}

async function layeredHooksExample() {
  // --8<-- [start:layered_hooks]
  // Agent-level hooks via plugins
  class AgentLoggingPlugin implements Plugin {
    name = 'agent-logging'

    initAgent(agent: LocalAgent): void {
      agent.addHook(BeforeToolCallEvent, (event) => {
        console.log(`Agent tool call: ${event.toolUse.name}`)
      })
    }
  }

  // Create agents with individual hooks
  const agent1 = new Agent({ id: 'agent1', plugins: [new AgentLoggingPlugin()] })
  const agent2 = new Agent({ id: 'agent2', plugins: [new AgentLoggingPlugin()] })

  // Orchestrator-level hooks via MultiAgentPlugin
  class OrchestratorLoggingPlugin implements MultiAgentPlugin {
    readonly name = 'orchestrator-logging'

    initMultiAgent(orchestrator: MultiAgent): void {
      orchestrator.addHook(BeforeNodeCallEvent, (event) => {
        console.log(`Orchestrator node execution: ${event.nodeId}`)
      })
    }
  }

  // Create orchestrator with multi-agent hooks
  const graph = new Graph({
    nodes: [agent1, agent2],
    edges: [['agent1', 'agent2']],
    plugins: [new OrchestratorLoggingPlugin()],
  })
  // --8<-- [end:layered_hooks]
  void graph
}

// Suppress unused function warnings
void limitToolCountsExample
void orchestratorCallbackExample
void conditionalNodeExecutionExample
void orchestratorAgnosticDesignExample
void layeredHooksExample

// =====================
// Cookbook: Retry Examples
// =====================

async function retryOnServiceUnavailableExample() {
  // --8<-- [start:retry_on_service_unavailable_class]
  class RetryOnServiceUnavailable implements Plugin {
    readonly name = 'retry-on-service-unavailable'
    private readonly maxRetries: number
    private retryCount = 0

    constructor(maxRetries = 3) {
      this.maxRetries = maxRetries
    }

    initAgent(agent: LocalAgent): void {
      agent.addHook(BeforeInvocationEvent, () => {
        this.retryCount = 0
      })
      agent.addHook(AfterModelCallEvent, (event) => this.handleRetry(event))
    }

    private async handleRetry(event: AfterModelCallEvent): Promise<void> {
      if (event.error) {
        if (
          String(event.error).includes('ServiceUnavailable') &&
          this.retryCount < this.maxRetries
        ) {
          this.retryCount++
          await new Promise((resolve) =>
            setTimeout(resolve, 2 ** this.retryCount * 1000),
          )
          event.retry = true
        }
      } else {
        this.retryCount = 0
      }
    }
  }
  // --8<-- [end:retry_on_service_unavailable_class]

  // --8<-- [start:retry_on_service_unavailable_usage]
  const retryPlugin = new RetryOnServiceUnavailable(3)
  const agent = new Agent({ plugins: [retryPlugin] })

  const result = await agent.invoke('What is the capital of France?')
  // --8<-- [end:retry_on_service_unavailable_usage]
  void result
}

async function propagateUnexpectedExceptionsExample() {
  // --8<-- [start:propagate_unexpected_exceptions_class]
  class PropagateUnexpectedExceptions implements Plugin {
    readonly name = 'propagate-unexpected-exceptions'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly allowedExceptions: Array<new (...args: any[]) => Error>

    constructor(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      allowedExceptions: Array<new (...args: any[]) => Error> = [],
    ) {
      this.allowedExceptions = allowedExceptions
    }

    initAgent(agent: LocalAgent): void {
      agent.addHook(AfterToolCallEvent, (event) => this.checkException(event))
    }

    private checkException(event: AfterToolCallEvent): void {
      if (!event.error) return // Tool succeeded
      // Let model retry allowed exception types
      if (this.allowedExceptions.some((Exc) => event.error instanceof Exc)) return
      throw event.error // Propagate unexpected errors immediately
    }
  }
  // --8<-- [end:propagate_unexpected_exceptions_class]

  // --8<-- [start:propagate_unexpected_exceptions_usage]
  const agent = new Agent({
    tools: [myTool],
    plugins: [new PropagateUnexpectedExceptions([TypeError])],
  })
  // --8<-- [end:propagate_unexpected_exceptions_usage]
  void agent
}

async function retryOnToolErrorExample() {
  // --8<-- [start:retry_on_tool_error_class]
  class RetryOnToolError implements Plugin {
    readonly name = 'retry-on-tool-error'
    private readonly maxRetries: number
    private readonly attemptCounts = new Map<string, number>()

    constructor(maxRetries = 1) {
      this.maxRetries = maxRetries
    }

    initAgent(agent: LocalAgent): void {
      agent.addHook(AfterToolCallEvent, (event) => this.handleRetry(event))
    }

    private handleRetry(event: AfterToolCallEvent): void {
      const toolUseId = event.toolUse.toolUseId
      const toolName = event.toolUse.name
      const attempt = (this.attemptCounts.get(toolUseId) ?? 0) + 1
      this.attemptCounts.set(toolUseId, attempt)

      if (event.result.status === 'error' && attempt <= this.maxRetries) {
        console.log(
          `Retrying tool '${toolName}' (attempt ${attempt}/${this.maxRetries})`,
        )
        event.retry = true
      } else if (event.result.status !== 'error') {
        this.attemptCounts.delete(toolUseId)
      }
    }
  }
  // --8<-- [end:retry_on_tool_error_class]

  // --8<-- [start:retry_on_tool_error_usage]
  const retryPlugin = new RetryOnToolError(1)
  const agent = new Agent({ tools: [calculator], plugins: [retryPlugin] })

  const result = await agent.invoke('Look up the weather')
  // --8<-- [end:retry_on_tool_error_usage]
  void result
}

void retryOnServiceUnavailableExample
void propagateUnexpectedExceptionsExample
void retryOnToolErrorExample
