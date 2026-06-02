/**
 * Session Enrichment Benchmark
 *
 * Pattern: Developer-driven background dispatch via invokeBackground().
 *
 * A support agent has an AfterInvocationEvent hook that runs two enrichment
 * agents (summarizer + sentiment analyzer) after every response.
 *
 * Standard:   hook awaits both enrichment agents sequentially — blocks before
 *             invoke() returns. Each turn pays model + enrichment overhead.
 * Background: hook fires both enrichment agents via invokeBackground() — returns
 *             immediately. invoke() returns after the model's response only.
 *             Enrichment runs concurrently in the background.
 *
 * Same agent, same prompt, same enrichment. Only difference: await vs invokeBackground().
 */

import { Agent, tool, AfterInvocationEvent } from '@strands-agents/sdk'
import type { Model } from '@strands-agents/sdk'
import { z } from 'zod'
import type { BenchmarkCase } from '../framework/types.js'

// ── Enrichment tool stubs (deterministic delays, canned output) ──────────────

function makeEnrichmentAgents(model: Model, delayMultiplier: number) {
  const summarizeTool = tool({
    name: 'summarize',
    description: 'Summarize the conversation.',
    inputSchema: z.object({ text: z.string() }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, 3000 * delayMultiplier))
      return 'Customer inquiring about order #78432 shipping delay; exploring refund options.'
    },
  })

  const sentimentTool = tool({
    name: 'analyze_sentiment',
    description: 'Classify sentiment.',
    inputSchema: z.object({ text: z.string() }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, 2000 * delayMultiplier))
      return 'NEGATIVE — customer frustrated with shipping delay.'
    },
  })

  const summarizer = new Agent({
    model,
    name: 'summarizer',
    tools: [summarizeTool],
    systemPrompt: 'Call the summarize tool with the provided text. Return only the tool result.',
    printer: false,
  })

  const sentimentAnalyzer = new Agent({
    model,
    name: 'sentiment_analyzer',
    tools: [sentimentTool],
    systemPrompt: 'Call the analyze_sentiment tool with the provided text. Return only the tool result.',
    printer: false,
  })

  return { summarizer, sentimentAnalyzer }
}

// ── Prompts ──────────────────────────────────────────────────────────────────

const customerMessages = [
  "Hi, I placed an order 3 days ago (order #78432) and it still hasn't shipped. When will it arrive?",
  "That's really frustrating — I needed it by Friday for a birthday gift. Can you expedite the shipping?",
  "Friday is tomorrow. There's no way to make it in time?",
  'Fine. Can you at least cancel the order and issue a full refund?',
  'How long does the refund take, and will I get a return label if the package shows up anyway?',
]

const supportPrompt =
  'You are a helpful and empathetic customer support agent for an e-commerce company. ' +
  'Respond in exactly 2 sentences: acknowledge the concern, then state the next action. Keep under 80 words.'

// ── Case definition ──────────────────────────────────────────────────────────

export const sessionEnrichment: BenchmarkCase = {
  name: 'session-enrichment',
  description: 'Multi-turn support with enrichment: await vs invokeBackground() in AfterInvocationEvent hook',

  prompt: customerMessages,

  createStandardAgent(delayMultiplier: number, model: Model): Agent {
    const { summarizer, sentimentAnalyzer } = makeEnrichmentAgents(model, delayMultiplier)

    const agent = new Agent({
      model,
      systemPrompt: supportPrompt,
      printer: false,
    })

    agent.addHook(AfterInvocationEvent, async (event) => {
      const text = JSON.stringify(event.agent.messages.map((m) => m.toJSON()))
      await summarizer.invoke(text)
      await sentimentAnalyzer.invoke(text)
    })

    return agent
  },

  createBackgroundAgent(delayMultiplier: number, model: Model): Agent {
    const { summarizer, sentimentAnalyzer } = makeEnrichmentAgents(model, delayMultiplier)

    const agent = new Agent({
      model,
      systemPrompt: supportPrompt,
      printer: false,
    })

    agent.addHook(AfterInvocationEvent, (event) => {
      const text = JSON.stringify(event.agent.messages.map((m) => m.toJSON()))
      summarizer.invokeBackground(text)
      sentimentAnalyzer.invokeBackground(text)
    })

    return agent
  },

  outputValidation: {
    requiredContent: ['refund'],
    minLength: 50,
  },

  trajectoryValidation: {
    requiredTools: [],
    minToolCalls: 0,
  },
}
