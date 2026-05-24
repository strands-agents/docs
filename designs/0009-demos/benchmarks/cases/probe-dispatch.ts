/**
 * Probe Dispatch Benchmark
 *
 * Pattern: Basic concurrent tool dispatch (single layer).
 *
 * A NASA mission controller dispatches probes to 3 planets and researches each.
 * All tools are stubs with fixed delays and canned outputs.
 *
 * Standard:   6 tool calls sequential (3×15s dispatch + 3×8s research = ~69s)
 * Background: 6 tool calls concurrent (max = ~15s)
 * Expected speedup: ~2-3x (model overhead adds to both)
 */

import { Agent, tool } from '@strands-agents/sdk'
import type { Model } from '@strands-agents/sdk'
import { z } from 'zod'
import type { BenchmarkCase } from '../framework/types.js'

// ── Canned planet data ───────────────────────────────────────────────────────

const planetFacts: Record<string, string> = {
  mars: 'Mars is the fourth planet from the Sun. Average temperature: -62C. Thin CO2 atmosphere. Evidence of ancient river valleys and polar ice caps. Olympus Mons is the tallest volcano in the solar system at 21.9 km.',
  jupiter:
    'Jupiter is the largest planet in our solar system with a mass 318x Earth. The Great Red Spot is a storm larger than Earth, raging for 350+ years. Jupiter has 95 known moons including Ganymede, the largest moon in the solar system.',
  neptune:
    'Neptune is the eighth and farthest planet from the Sun. Wind speeds reach 2,100 km/h, the fastest in the solar system. Has 16 known moons. Triton, its largest moon, orbits retrograde and is geologically active with nitrogen geysers.',
}

// ── Tool stubs ───────────────────────────────────────────────────────────────

function makeTools(delayMultiplier: number) {
  // Simulates a heavyweight external API call: command submission + telemetry confirmation (~15s)
  const probeDelay = 15000

  // Simulates a research search / knowledge retrieval (~8s)
  const researchDelay = 8000

  const dispatchProbe = tool({
    name: 'dispatch_probe',
    description: 'Dispatches an interplanetary space probe to the specified planet.',
    inputSchema: z.object({
      planet: z.string().describe('Target planet name'),
    }),
    callback: async (input) => {
      await new Promise((r) => setTimeout(r, probeDelay * delayMultiplier))
      return `Probe successfully dispatched to ${input.planet}. All systems nominal, telemetry confirmed.`
    },
  })

  const researchPlanet = tool({
    name: 'research_planet',
    description: 'Research and retrieve key facts about a planet.',
    inputSchema: z.object({
      planet: z.string().describe('Planet name to research'),
    }),
    callback: async (input) => {
      await new Promise((r) => setTimeout(r, researchDelay * delayMultiplier))
      const key = input.planet.toLowerCase()
      return planetFacts[key] ?? `No data available for ${input.planet}.`
    },
  })

  return [dispatchProbe, researchPlanet]
}

// ── Structured output schema ─────────────────────────────────────────────────

const missionReportSchema = z.object({
  missions: z
    .array(
      z.object({
        planet: z.enum(['Mars', 'Jupiter', 'Neptune']).describe('Target planet'),
        probe_status: z.enum(['launched', 'failed', 'pending']).describe('Dispatch outcome'),
        facts: z
          .array(z.string().max(250).describe('A key fact about the planet'))
          .min(2)
          .max(3)
          .describe('2-3 key facts about the planet'),
      }),
    )
    .length(3)
    .describe('Exactly 3 mission entries, one per planet'),
  summary: z.string().max(500).describe('Overall mission status summary'),
})

// ── Prompts ──────────────────────────────────────────────────────────────────

const systemPrompt =
  'You are a NASA deep space mission controller. You dispatch probes using dispatch_probe ' +
  'and gather intelligence using research_planet.\n\n' +
  'PROTOCOL:\n' +
  '1. Dispatch probes to ALL requested planets (use dispatch_probe for each).\n' +
  '2. Research each planet (use research_planet for each).\n' +
  '3. Write a mission report with the following structure:\n' +
  '   - For each planet: dispatch status, key facts from research (include specific data points)\n' +
  '   - Overall mission summary\n\n' +
  'You MUST call all 6 tools (3 dispatches + 3 research) before writing the report.\n' +
  'Include specific facts and numbers from the research results — do not paraphrase generically.'

const userPrompt =
  'Commander directive: dispatch probes to Mars, Jupiter, and Neptune immediately. ' +
  'Research key facts about each planet. ' +
  'Write a detailed mission report covering dispatch status and specific planet facts from your research.'

// ── Case definition ──────────────────────────────────────────────────────────

export const probeDispatch: BenchmarkCase = {
  name: 'probe-dispatch',
  description: 'NASA probe dispatch to 3 planets (6 tool stubs, 1 layer)',

  prompt: userPrompt,

  createStandardAgent(delayMultiplier: number, model: Model): Agent {
    return new Agent({
      model,
      systemPrompt,
      tools: makeTools(delayMultiplier),
      structuredOutputSchema: missionReportSchema,
      printer: false,
    })
  },

  createBackgroundAgent(delayMultiplier: number, model: Model): Agent {
    return new Agent({
      model,
      systemPrompt,
      backgroundTools: makeTools(delayMultiplier),
      structuredOutputSchema: missionReportSchema,
      printer: false,
    })
  },

  outputValidation: {
    requireStructuredOutput: true,
    requiredContent: [
      'Mars', 'Jupiter', 'Neptune',
      'Olympus Mons',     // from Mars research tool output
      'Great Red Spot',   // from Jupiter research tool output
      'nitrogen geysers', // from Neptune research tool output
    ],
    minLength: 200,
  },

  trajectoryValidation: {
    requiredTools: ['dispatch_probe', 'research_planet'],
    minToolCalls: 6,
  },
}
