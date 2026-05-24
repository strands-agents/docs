/**
 * Mixed Dispatch Benchmark
 *
 * Pattern: Slow background tasks dispatched up front while the model does
 * multi-round dependent foreground work underneath.
 *
 * A financial analyst agent evaluates a company for investment. Two slow
 * external verifications — credit check (20s) and regulatory screening (15s) —
 * fire off to the background in round 1. The model then does sequential
 * foreground work where each step depends on the previous:
 *
 *   Round 1: fetch_company_profile (fg, 1s) + submit bg tasks
 *   Round 2: analyze_financials (fg, 3s) — needs the company profile
 *   Round 3: assess_market_position (fg, 2s) — needs the financial analysis
 *   Round 4: bg results arrive, model compiles final investment report
 *
 * The model is NEVER idle — it's always reasoning with foreground results
 * while the background verifications run. In standard mode, the 35s of
 * external verification blocks everything.
 *
 * Standard:   all sequential → 20s + 15s + 1s + 3s + 2s = ~41s tool time
 * Background: bg max(20s,15s) overlaps fg rounds (1s + 3s + 2s = 6s) → ~20s effective
 * Expected speedup: ~1.5-2x
 */

import { Agent, tool } from '@strands-agents/sdk'
import type { Model } from '@strands-agents/sdk'
import { z } from 'zod'
import type { BenchmarkCase } from '../framework/types.js'

// ── Canned data ─────────────────────────────────────────────────────────────

const companyProfile = [
  'Acme Corp (ACME) — Founded 2011, HQ: Austin, TX.',
  'Revenue: $2.4B (FY2024), up 18% YoY. Operating margin: 22%.',
  'Employees: 8,200. Market cap: $14.2B.',
  'Primary segments: Enterprise SaaS (68%), Professional Services (32%).',
  'Key customers: 340 enterprise accounts, 97% net revenue retention.',
].join(' ')

const financialAnalysis = [
  'Financial Health: STRONG.',
  'Current ratio: 2.8 (excellent liquidity). Debt-to-equity: 0.35 (conservative leverage).',
  'Free cash flow: $480M (20% FCF margin). R&D spend: 24% of revenue.',
  'Revenue growth accelerating: 14% → 16% → 18% over last 3 years.',
  'Gross margin expanding: 71% → 73% → 75%. Path to 30% operating margin visible.',
].join(' ')

const marketAssessment = [
  'Market Position: LEADER in mid-market enterprise SaaS.',
  'TAM: $45B growing 12% annually. ACME share: ~5.3%, up from 4.1% two years ago.',
  'Competitive moat: proprietary data platform + high switching costs (avg contract: 3.2 years).',
  'Key risk: AWS and Azure building competing offerings, but ACME 18-month feature lead.',
  'Analyst consensus: 8 Buy, 3 Hold, 0 Sell. Average price target: $185 (current: $162).',
].join(' ')

// ── Tool stubs ───────────────────────────────────────────────────────────────

function makeForegroundTools(delayMultiplier: number) {
  const fetchProfile = tool({
    name: 'fetch_company_profile',
    description: 'Fetches the company profile including revenue, headcount, and business segments. Call this FIRST — other analysis tools need this data.',
    inputSchema: z.object({
      ticker: z.string().describe('Stock ticker symbol'),
    }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, 1000 * delayMultiplier))
      return companyProfile
    },
  })

  const analyzeFinancials = tool({
    name: 'analyze_financials',
    description: 'Analyzes financial health from the company profile data. Requires fetch_company_profile to have been called first.',
    inputSchema: z.object({
      ticker: z.string().describe('Stock ticker symbol'),
      revenue: z.string().describe('Revenue figure from the company profile'),
    }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, 3000 * delayMultiplier))
      return financialAnalysis
    },
  })

  const assessMarket = tool({
    name: 'assess_market_position',
    description: 'Assesses competitive position and market share. Requires analyze_financials to have been called first.',
    inputSchema: z.object({
      ticker: z.string().describe('Stock ticker symbol'),
      financial_health: z.string().describe('Financial health rating from analyze_financials'),
    }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, 2000 * delayMultiplier))
      return marketAssessment
    },
  })

  return [fetchProfile, analyzeFinancials, assessMarket]
}

function makeBackgroundTools(delayMultiplier: number) {
  const creditCheck = tool({
    name: 'submit_credit_check',
    description: 'Submits a credit verification request to external rating agencies. SLOW — takes 15-20 seconds as it contacts Moody\'s, S&P, and Fitch APIs sequentially. Call this IMMEDIATELY so it starts processing while you do other analysis.',
    inputSchema: z.object({
      ticker: z.string().describe('Stock ticker symbol'),
    }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, 20000 * delayMultiplier))
      return 'Credit Rating: A- (S&P), A3 (Moody\'s), A- (Fitch). Outlook: Stable across all agencies. Credit default swap spread: 45bps (low risk). No credit events in past 5 years.'
    },
  })

  const regulatoryScreen = tool({
    name: 'submit_regulatory_screening',
    description: 'Runs regulatory compliance screening against SEC, DOJ, and international databases. SLOW — takes 10-15 seconds. Call this IMMEDIATELY so it starts processing while you do other analysis.',
    inputSchema: z.object({
      ticker: z.string().describe('Stock ticker symbol'),
      company_name: z.string().describe('Full company name'),
    }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, 15000 * delayMultiplier))
      return 'Regulatory Screening: CLEAR. No active SEC investigations. No DOJ actions. FCPA compliance: verified. SOX compliance: current. No sanctions matches. Last audit: clean (Deloitte, Q3 2024).'
    },
  })

  return [creditCheck, regulatoryScreen]
}

// ── Prompts ──────────────────────────────────────────────────────────────────

const systemPrompt =
  'You are a senior financial analyst evaluating companies for investment.\n\n' +
  'CRITICAL WORKFLOW — follow this exact order:\n' +
  '1. IMMEDIATELY submit submit_credit_check and submit_regulatory_screening — these are SLOW external calls. Start them FIRST.\n' +
  '2. In the SAME tool call block, also call fetch_company_profile to get the basic company data.\n' +
  '3. Once you have the profile, call analyze_financials (it needs the profile data).\n' +
  '4. Once you have the financial analysis, call assess_market_position (it needs the financial health rating).\n' +
  '5. Once ALL results are in (including the background credit check and regulatory screening), compile a complete investment report.\n\n' +
  'The foreground tools have dependencies — each step feeds the next. The background tools are independent external verifications. ' +
  'Do NOT wait for credit/regulatory results before starting your analysis chain.'

const userPrompt =
  'Evaluate Acme Corp (ticker: ACME) for a potential $50M growth equity investment. ' +
  'Run the full analysis: company profile, financial analysis, market assessment, credit check, and regulatory screening. ' +
  'Produce a comprehensive investment report with a Buy/Hold/Pass recommendation.'

// ── Case definition ──────────────────────────────────────────────────────────

export const mixedDispatch: BenchmarkCase = {
  name: 'mixed-dispatch',
  description: 'Investment analysis: 2 slow background verifications + 3 dependent foreground analysis steps',

  prompt: userPrompt,

  createStandardAgent(delayMultiplier: number, model: Model): Agent {
    return new Agent({
      model,
      systemPrompt,
      tools: [...makeBackgroundTools(delayMultiplier), ...makeForegroundTools(delayMultiplier)],
      printer: false,
    })
  },

  createBackgroundAgent(delayMultiplier: number, model: Model): Agent {
    return new Agent({
      model,
      systemPrompt,
      tools: makeForegroundTools(delayMultiplier),
      backgroundTools: makeBackgroundTools(delayMultiplier),
      printer: false,
    })
  },

  outputValidation: {
    requiredContent: ['credit', 'regulatory', 'revenue'],
    minLength: 100,
  },

  trajectoryValidation: {
    requiredTools: [
      'fetch_company_profile',
      'analyze_financials',
      'assess_market_position',
      'submit_credit_check',
      'submit_regulatory_screening',
    ],
    minToolCalls: 5,
  },
}
