import type { Agent, AgentResult, Model } from '@strands-agents/sdk'

// ── Configuration ────────────────────────────────────────────────────────────

export interface BenchmarkConfig {
  /** Case names to run. Undefined = all. */
  cases?: string[]
  /** Repetitions per case. */
  runs: number
  /** Model identifier (e.g. "sonnet-4.6", "haiku-4.5", "gpt-4o", "llama-4-maverick"). */
  model: string
  /** Multiplier applied to tool stub delays (0.1 = 10x faster). */
  delayMultiplier: number
  /** Directory for JSON report output. */
  outputDir: string
}

/** Model presets for --help display. */
export const MODEL_PRESETS: Record<string, string> = {
  'sonnet-4.6': 'Claude Sonnet 4.6 via Bedrock (default)',
  'haiku-4.5': 'Claude Haiku 4.5 via Bedrock (fast/cheap)',
  'nova-pro': 'Amazon Nova Pro via Bedrock',
}

export const DEFAULT_CONFIG: BenchmarkConfig = {
  model: 'sonnet-4.6',
  runs: 3,
  delayMultiplier: 1,
  outputDir: './results',
}

// ── Case Definition ──────────────────────────────────────────────────────────

export interface BenchmarkCase {
  /** Unique identifier, e.g. "probe-dispatch". */
  name: string
  /** One-line description of what the case tests. */
  description: string

  /**
   * Single-turn: a prompt string.
   * Multi-turn: an array of sequential prompts (e.g. customer messages).
   */
  prompt: string | string[]

  /** Creates a fresh standard-mode agent. Called once per run. */
  createStandardAgent(delayMultiplier: number, model: Model): Agent

  /** Creates a fresh background-mode agent. Called once per run. */
  createBackgroundAgent(delayMultiplier: number, model: Model): Agent

  /** Output validation spec. */
  outputValidation: OutputValidation

  /** Tool trajectory validation spec. */
  trajectoryValidation: TrajectoryValidation
}

// ── Validation Specs ─────────────────────────────────────────────────────────

export interface OutputValidation {
  /** Required substrings (case-insensitive) in the output text. */
  requiredContent?: string[]
  /** Regex patterns that must match somewhere in the output. */
  requiredPatterns?: RegExp[]
  /** Minimum output length (characters). */
  minLength?: number
  /** Maximum output length (characters). */
  maxLength?: number
  /** When true, validates that the agent produced non-null structuredOutput. */
  requireStructuredOutput?: boolean
}

export interface TrajectoryValidation {
  /** Tool names that must appear in toolMetrics with callCount >= 1. */
  requiredTools?: string[]
  /** Minimum total tool calls across all tools. */
  minToolCalls?: number
}

// ── Results ──────────────────────────────────────────────────────────────────

export interface ValidationResult {
  name: string
  passed: boolean
  reason: string
}

export interface ModeMetrics {
  cycleCount: number
  totalDuration: number
  averageCycleTime: number
  accumulatedUsage: {
    inputTokens: number
    outputTokens: number
    totalTokens: number
    cacheReadInputTokens?: number
    cacheWriteInputTokens?: number
  }
  modelLatencyMs: number
  toolMetrics: Record<string, { callCount: number; successCount: number; errorCount: number; totalTime: number }>
}

export interface ModeResult {
  mode: 'standard' | 'background'
  wallClockMs: number
  metrics: ModeMetrics
  totalToolTimeMs: number
  totalModelLatencyMs: number
  outputTokens: number
  inputTokens: number
  messageCount: number
  cycleCount: number
  outputText: string
  structuredOutput?: unknown
  stopReason: string
  validationResults: ValidationResult[]
  allValidationsPassed: boolean
}

export interface RunResult {
  runIndex: number
  standard: ModeResult
  background: ModeResult
  speedup: number
}

// ── Statistics ───────────────────────────────────────────────────────────────

export interface Stats {
  mean: number
  stddev: number
  min: number
  max: number
  p50: number
  p95: number
}

// ── Reports ──────────────────────────────────────────────────────────────────

export interface CaseReport {
  caseName: string
  description: string
  runs: RunResult[]
  summary: {
    speedup: Stats
    standardWallClockMs: Stats
    backgroundWallClockMs: Stats
    standardOutputTokens: Stats
    backgroundOutputTokens: Stats
    outputTokenDeltaPct: number
    standardInputTokens: Stats
    backgroundInputTokens: Stats
    inputTokenDeltaPct: number
    standardMessageCount: Stats
    backgroundMessageCount: Stats
    standardCycleCount: Stats
    backgroundCycleCount: Stats
    standardToolTimeMs: Stats
    backgroundToolTimeMs: Stats
    toolTimeSpeedup: Stats
    allValidationsPassed: boolean
  }
}

export interface BenchmarkReport {
  timestamp: string
  config: BenchmarkConfig
  cases: CaseReport[]
  overallSummary: {
    totalCases: number
    totalRuns: number
    allValidationsPassed: boolean
    avgSpeedupAcrossCases: number
  }
}
