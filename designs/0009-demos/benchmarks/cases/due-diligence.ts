/**
 * Due Diligence Benchmark
 *
 * Pattern: 2-layer dependent pipeline (fetch → analyze).
 *
 * Layer 1: 5 independent data-gathering tools (5s each base)
 * Layer 2: 5 dependent analysis tools (8s each base), each consuming Layer 1 data
 *
 * All tools are stubs with fixed delays and canned outputs.
 *
 * Standard:   10 sequential tool calls (5×5s + 5×8s = 65s)
 * Background: Layer 1 concurrent (5s) + Layer 2 concurrent (8s) = 13s
 * Expected speedup: ~2.5-3.5x
 */

import { Agent, tool } from '@strands-agents/sdk'
import type { Model } from '@strands-agents/sdk'
import { z } from 'zod'
import type { BenchmarkCase } from '../framework/types.js'

// ── Tool stubs ───────────────────────────────────────────────────────────────

function makeTools(delayMultiplier: number) {
  // Simulates API calls to financial data providers (~5s)
  const fetchDelay = 5000
  // Simulates running analysis models / algorithms (~8s)
  const analyzeDelay = 8000

  // Layer 1: Data gathering (independent)

  const fetchFinancials = tool({
    name: 'fetch_financials',
    description: 'Retrieve target company financial statements and key metrics.',
    inputSchema: z.object({ company: z.string() }),
    callback: async (input) => {
      await new Promise((r) => setTimeout(r, fetchDelay * delayMultiplier))
      return `Financial data for ${input.company}: Revenue $2.4B (+18% YoY), gross margin 72%, operating margin 28%, free cash flow $340M, debt-to-equity 0.45, current ratio 2.1. Cash reserves $890M. R&D spend 22% of revenue.`
    },
  })

  const fetchMarketPosition = tool({
    name: 'fetch_market_position',
    description: 'Retrieve competitive landscape and market positioning data.',
    inputSchema: z.object({ company: z.string() }),
    callback: async (input) => {
      await new Promise((r) => setTimeout(r, fetchDelay * delayMultiplier))
      return `Market data for ${input.company}: #3 player in $18B market (13.3% share). Market growing 24% CAGR. Top competitor holds 31%. Target gaining share fastest (+3.2pp last year). Strong mid-market, weak enterprise. NPS 62 vs industry avg 45.`
    },
  })

  const fetchLegalRecords = tool({
    name: 'fetch_legal_records',
    description: 'Retrieve legal filings, litigation history, and regulatory records.',
    inputSchema: z.object({ company: z.string() }),
    callback: async (input) => {
      await new Promise((r) => setTimeout(r, fetchDelay * delayMultiplier))
      return `Legal records for ${input.company}: 2 active patent disputes (non-material, <$5M combined). 1 resolved SEC inquiry (no action). No pending class actions. Clean GDPR/CCPA record. 3 minor contract disputes in arbitration.`
    },
  })

  const fetchPatentPortfolio = tool({
    name: 'fetch_patent_portfolio',
    description: 'Retrieve patent and IP portfolio data.',
    inputSchema: z.object({ company: z.string() }),
    callback: async (input) => {
      await new Promise((r) => setTimeout(r, fetchDelay * delayMultiplier))
      return `Patent portfolio for ${input.company}: 147 granted patents, 38 pending. Core patents in ML inference optimization (12), data pipeline architecture (8), edge computing (15). 23 patents cited >50 times. Portfolio valued at $180-220M.`
    },
  })

  const fetchCustomerSentiment = tool({
    name: 'fetch_customer_sentiment',
    description: 'Retrieve customer satisfaction, retention, and sentiment data.',
    inputSchema: z.object({ company: z.string() }),
    callback: async (input) => {
      await new Promise((r) => setTimeout(r, fetchDelay * delayMultiplier))
      return `Customer sentiment for ${input.company}: NPS 62, CSAT 4.3/5. Annual churn 8% (industry avg 15%). Net revenue retention 124%. Top complaints: pricing complexity (34%), onboarding friction (28%). G2 rating 4.6/5.`
    },
  })

  // Layer 2: Analysis (each depends on corresponding Layer 1 data)

  const analyzeFinancialRisk = tool({
    name: 'analyze_financial_risk',
    description: 'Run financial risk model. Requires financial data from fetch_financials.',
    inputSchema: z.object({
      company: z.string(),
      financial_data: z.string().describe('Raw financial data from fetch_financials'),
    }),
    callback: async (input) => {
      await new Promise((r) => setTimeout(r, analyzeDelay * delayMultiplier))
      return `FINANCIAL RISK — ${input.company}: Overall risk LOW (2.1/10). Strong cash position covers 2.6 years. Debt manageable with 5.8x interest coverage. Revenue concentration moderate: top 10 customers = 34%. Valuation range: $4.2-5.8B.`
    },
  })

  const analyzeCompetitiveThreat = tool({
    name: 'analyze_competitive_threat',
    description: 'Assess competitive threats. Requires market data from fetch_market_position.',
    inputSchema: z.object({
      company: z.string(),
      market_data: z.string().describe('Raw market data from fetch_market_position'),
    }),
    callback: async (input) => {
      await new Promise((r) => setTimeout(r, analyzeDelay * delayMultiplier))
      return `COMPETITIVE THREAT — ${input.company}: Primary threat: market leader launching competing product Q3. Moat MODERATE — strong product but switching costs lower than peers. Technical differentiation durable (18-24 month lead). Enterprise penetration is critical growth vector.`
    },
  })

  const analyzeLegalLiability = tool({
    name: 'analyze_legal_liability',
    description: 'Forecast legal liability. Requires legal records from fetch_legal_records.',
    inputSchema: z.object({
      company: z.string(),
      legal_data: z.string().describe('Raw legal records from fetch_legal_records'),
    }),
    callback: async (input) => {
      await new Promise((r) => setTimeout(r, analyzeDelay * delayMultiplier))
      return `LEGAL LIABILITY — ${input.company}: Total estimated exposure $3-8M (immaterial). Patent disputes defensive, low injunction risk. Clean regulatory record reduces compliance risk. Recommend standard IP indemnification. No deal-blocking issues.`
    },
  })

  const analyzeIPValue = tool({
    name: 'analyze_ip_value',
    description: 'Perform IP valuation. Requires patent data from fetch_patent_portfolio.',
    inputSchema: z.object({
      company: z.string(),
      patent_data: z.string().describe('Raw patent data from fetch_patent_portfolio'),
    }),
    callback: async (input) => {
      await new Promise((r) => setTimeout(r, analyzeDelay * delayMultiplier))
      return `IP VALUATION — ${input.company}: Portfolio fair value $195M. Strategic premium for ML inference patents +$40-60M (scarcity). 12 core ML patents = 68% of value. Freedom-to-operate risk LOW. Portfolio is significant strategic asset.`
    },
  })

  const analyzeCustomerLTV = tool({
    name: 'analyze_customer_ltv',
    description: 'Model customer lifetime value. Requires sentiment data from fetch_customer_sentiment.',
    inputSchema: z.object({
      company: z.string(),
      sentiment_data: z.string().describe('Raw customer sentiment from fetch_customer_sentiment'),
    }),
    callback: async (input) => {
      await new Promise((r) => setTimeout(r, analyzeDelay * delayMultiplier))
      return `CUSTOMER LTV — ${input.company}: Avg LTV $287K (enterprise), $18K (mid-market). Payback 11 months. 124% net revenue retention indicates strong expansion. Churn concentrated in first 90 days — fixable with onboarding investment. 3-year customer base value $1.8B.`
    },
  })

  return [
    fetchFinancials,
    fetchMarketPosition,
    fetchLegalRecords,
    fetchPatentPortfolio,
    fetchCustomerSentiment,
    analyzeFinancialRisk,
    analyzeCompetitiveThreat,
    analyzeLegalLiability,
    analyzeIPValue,
    analyzeCustomerLTV,
  ]
}

// ── Structured output schema ─────────────────────────────────────────────────

const dueDiligenceSchema = z.object({
  target_company: z.string().max(100).describe('Name of the acquisition target'),
  findings: z
    .array(
      z.object({
        domain: z
          .enum(['financials', 'market_position', 'legal', 'ip_portfolio', 'customer_sentiment'])
          .describe('Analysis domain'),
        risk_level: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).describe('Risk rating'),
        headline: z.string().max(200).describe('One-line finding summary'),
        detail: z.string().max(400).describe('Supporting detail'),
      }),
    )
    .length(5)
    .describe('Exactly 5 findings, one per analysis domain'),
  financial_summary: z.object({
    revenue: z.string().max(100).describe('Revenue figure with growth'),
    valuation_range: z.string().max(100).describe('Estimated valuation range'),
    risk_score: z.string().max(80).describe('Overall financial risk score'),
  }),
  recommendation: z.enum(['GO', 'NO-GO']).describe('Final acquisition recommendation'),
  rationale: z.string().max(600).describe('Brief rationale for the recommendation'),
})

// ── Prompts ──────────────────────────────────────────────────────────────────

const systemPrompt =
  'You are a senior M&A analyst conducting acquisition due diligence. You have access to ' +
  'data-gathering tools (fetch_*) and analysis tools (analyze_*). ' +
  'The analysis tools require data from the corresponding fetch tools as input.\n\n' +
  'PROCESS:\n' +
  '1. Gather ALL data: call fetch_financials, fetch_market_position, fetch_legal_records, ' +
  'fetch_patent_portfolio, and fetch_customer_sentiment.\n' +
  '2. Run ALL analyses: call analyze_financial_risk, analyze_competitive_threat, ' +
  'analyze_legal_liability, analyze_ip_value, and analyze_customer_ltv with the fetched data.\n' +
  '3. Write an acquisition memo with the following structure:\n' +
  '   - One finding per analysis domain (financials, market, legal, IP, customer) with risk level and detail\n' +
  '   - Financial summary with revenue, valuation range, and risk score\n' +
  '   - GO or NO-GO recommendation with rationale\n\n' +
  'You MUST call all 10 tools before writing the memo.\n' +
  'Include specific numbers and data points from the tool results — do not paraphrase generically.'

const userPrompt =
  'Conduct full acquisition due diligence on Nextera Analytics. ' +
  'Gather all data (5 fetch tools), run all analysis models (5 analyze tools), ' +
  'then write the acquisition memo with findings, financial summary, and GO/NO-GO recommendation.'

// ── Case definition ──────────────────────────────────────────────────────────

export const dueDiligence: BenchmarkCase = {
  name: 'due-diligence',
  description: 'M&A due diligence pipeline (10 tool stubs, 2 layers with dependencies)',

  prompt: userPrompt,

  createStandardAgent(delayMultiplier: number, model: Model): Agent {
    return new Agent({
      model,
      systemPrompt,
      tools: makeTools(delayMultiplier),
      structuredOutputSchema: dueDiligenceSchema,
      printer: false,
    })
  },

  createBackgroundAgent(delayMultiplier: number, model: Model): Agent {
    return new Agent({
      model,
      systemPrompt,
      backgroundTools: makeTools(delayMultiplier),
      structuredOutputSchema: dueDiligenceSchema,
      printer: false,
    })
  },

  outputValidation: {
    requireStructuredOutput: true,
    requiredContent: [
      'Nextera Analytics',
      'risk',          // from analyze_financial_risk (model synthesizes valuation figures in varying formats)
      '$195M',         // from analyze_ip_value
      '$287K',         // from analyze_customer_ltv
    ],
    minLength: 200,
  },

  trajectoryValidation: {
    requiredTools: [
      'fetch_financials',
      'fetch_market_position',
      'fetch_legal_records',
      'fetch_patent_portfolio',
      'fetch_customer_sentiment',
      'analyze_financial_risk',
      'analyze_competitive_threat',
      'analyze_legal_liability',
      'analyze_ip_value',
      'analyze_customer_ltv',
    ],
    minToolCalls: 10,
  },
}
