/**
 * TypeScript examples for the local development & mock mode guide.
 * Demonstrates how to build a MockModel for testing without real API credentials.
 */

import { Agent } from '@strands-agents/sdk'
import type {
  Model,
  BaseModelConfig,
  Message,
  ModelStreamEvent,
  StreamOptions,
  StopReason,
} from '@strands-agents/sdk'

// --8<-- [start:basic_mock_model]
import { Model as BaseModel } from '@strands-agents/sdk'
import type {
  BaseModelConfig as Config,
  Message as Msg,
  ModelStreamEvent as StreamEvent,
  StreamOptions as Opts,
} from '@strands-agents/sdk'

/**
 * A simple mock model provider for local development and testing.
 * Returns pre-configured responses without making any API calls.
 */
class MockModel extends BaseModel<Config> {
  private responses: string[]
  private callIndex = 0
  private config: Config

  constructor(responses: string[] = ['Hello! I am a mock response.']) {
    super()
    this.responses = responses
    this.config = { modelId: 'mock-model' }
  }

  updateConfig(config: Config): void {
    this.config = { ...this.config, ...config }
  }

  getConfig(): Config {
    return this.config
  }

  async *stream(_messages: Msg[], _options?: Opts): AsyncGenerator<StreamEvent> {
    // Cycle through responses, wrapping around if exhausted
    const text = this.responses[this.callIndex % this.responses.length]!
    this.callIndex++

    // Yield the standard stream event sequence
    yield { type: 'modelMessageStartEvent', role: 'assistant' }
    yield { type: 'modelContentBlockStartEvent' }
    yield {
      type: 'modelContentBlockDeltaEvent',
      delta: { type: 'textDelta', text },
    }
    yield { type: 'modelContentBlockStopEvent' }
    yield { type: 'modelMessageStopEvent', stopReason: 'endTurn' }
  }
}
// --8<-- [end:basic_mock_model]

// --8<-- [start:use_mock_model]
const mockModel = new MockModel(['The capital of France is Paris.'])
const agent = new Agent({ model: mockModel })

const response = await agent.invoke('What is the capital of France?')
console.log(response)
// --8<-- [end:use_mock_model]

// --8<-- [start:env_swap_pattern]
import { BedrockModel } from '@strands-agents/sdk'

function createModel() {
  if (process.env.MOCK_MODE === 'true') {
    return new MockModel(['This is a mock response for local development.'])
  }
  return new BedrockModel({
    modelId: 'anthropic.claude-sonnet-4-20250514',
  })
}

const model = createModel()
const agentWithSwap = new Agent({ model })
// --8<-- [end:env_swap_pattern]

// --8<-- [start:mock_tool_calls]
/**
 * A mock model that simulates tool calls.
 * Useful for testing agent tool-use loops without real API credentials.
 */
class MockToolModel extends BaseModel<Config> {
  private config: Config

  constructor() {
    super()
    this.config = { modelId: 'mock-tool-model' }
  }

  updateConfig(config: Config): void {
    this.config = { ...this.config, ...config }
  }

  getConfig(): Config {
    return this.config
  }

  async *stream(messages: Msg[], _options?: Opts): AsyncGenerator<StreamEvent> {
    // Check if the last message contains a tool result — if so, respond with text
    const lastMessage = messages[messages.length - 1]
    const hasToolResult = lastMessage?.content.some(
      (block) => block.type === 'toolResultBlock'
    )

    yield { type: 'modelMessageStartEvent', role: 'assistant' }

    if (hasToolResult) {
      // Second turn: respond with final text after tool execution
      yield { type: 'modelContentBlockStartEvent' }
      yield {
        type: 'modelContentBlockDeltaEvent',
        delta: { type: 'textDelta', text: 'The weather in Seattle is 72°F and sunny.' },
      }
      yield { type: 'modelContentBlockStopEvent' }
      yield { type: 'modelMessageStopEvent', stopReason: 'endTurn' }
    } else {
      // First turn: simulate a tool call
      yield {
        type: 'modelContentBlockStartEvent',
        start: {
          type: 'toolUseStart',
          name: 'get_weather',
          toolUseId: 'tool_001',
        },
      }
      yield {
        type: 'modelContentBlockDeltaEvent',
        delta: {
          type: 'toolUseInputDelta',
          input: JSON.stringify({ location: 'Seattle' }),
        },
      }
      yield { type: 'modelContentBlockStopEvent' }
      yield { type: 'modelMessageStopEvent', stopReason: 'toolUse' }
    }
  }
}
// --8<-- [end:mock_tool_calls]

// --8<-- [start:mock_errors]
/**
 * A mock model that simulates errors for testing error handling.
 */
class MockErrorModel extends BaseModel<Config> {
  private shouldFail: boolean
  private config: Config

  constructor(shouldFail = true) {
    super()
    this.shouldFail = shouldFail
    this.config = { modelId: 'mock-error-model' }
  }

  updateConfig(config: Config): void {
    this.config = { ...this.config, ...config }
  }

  getConfig(): Config {
    return this.config
  }

  async *stream(_messages: Msg[], _options?: Opts): AsyncGenerator<StreamEvent> {
    if (this.shouldFail) {
      throw new Error('Simulated API failure: rate limit exceeded')
    }

    yield { type: 'modelMessageStartEvent', role: 'assistant' }
    yield { type: 'modelContentBlockStartEvent' }
    yield {
      type: 'modelContentBlockDeltaEvent',
      delta: { type: 'textDelta', text: 'Success!' },
    }
    yield { type: 'modelContentBlockStopEvent' }
    yield { type: 'modelMessageStopEvent', stopReason: 'endTurn' }
  }
}
// --8<-- [end:mock_errors]

// --8<-- [start:mock_multi_turn]
/**
 * A mock model with pre-scripted multi-turn conversation responses.
 */
class MockMultiTurnModel extends BaseModel<Config> {
  private turns: string[]
  private turnIndex = 0
  private config: Config

  constructor(turns: string[]) {
    super()
    this.turns = turns
    this.config = { modelId: 'mock-multi-turn-model' }
  }

  updateConfig(config: Config): void {
    this.config = { ...this.config, ...config }
  }

  getConfig(): Config {
    return this.config
  }

  async *stream(_messages: Msg[], _options?: Opts): AsyncGenerator<StreamEvent> {
    if (this.turnIndex >= this.turns.length) {
      throw new Error('All scripted turns have been consumed')
    }

    const text = this.turns[this.turnIndex]!
    this.turnIndex++

    yield { type: 'modelMessageStartEvent', role: 'assistant' }
    yield { type: 'modelContentBlockStartEvent' }
    yield {
      type: 'modelContentBlockDeltaEvent',
      delta: { type: 'textDelta', text },
    }
    yield { type: 'modelContentBlockStopEvent' }
    yield { type: 'modelMessageStopEvent', stopReason: 'endTurn' }
  }
}

// Usage
const multiTurnModel = new MockMultiTurnModel([
  'Hi! How can I help you?',
  'Sure, I can help with that.',
  'Here is the result you asked for.',
])
const multiTurnAgent = new Agent({ model: multiTurnModel })

await multiTurnAgent.invoke('Hello')
await multiTurnAgent.invoke('Can you help me?')
await multiTurnAgent.invoke('Show me the result')
// --8<-- [end:mock_multi_turn]
