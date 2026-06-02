import {
  type AgentResult,
  type Agent,
  type Model,
  BeforeToolCallEvent,
  AfterToolCallEvent,
  BackgroundTaskDispatchEvent,
  BackgroundTaskResultEvent,
} from '@strands-agents/sdk'
import type {
  BenchmarkCase,
  BenchmarkConfig,
  BenchmarkReport,
  CaseReport,
  ModeMetrics,
  ModeResult,
  RunResult,
} from './types.js'
import { validateOutput, validateTrajectory } from './validators.js'
import { computeStats } from './report.js'

// ── Metric extraction ────────────────────────────────────────────────────────

function extractMetrics(result: AgentResult): ModeMetrics {
  const m = result.metrics
  return {
    cycleCount: m?.cycleCount ?? 0,
    totalDuration: m?.totalDuration ?? 0,
    averageCycleTime: m?.averageCycleTime ?? 0,
    accumulatedUsage: {
      inputTokens: m?.accumulatedUsage?.inputTokens ?? 0,
      outputTokens: m?.accumulatedUsage?.outputTokens ?? 0,
      totalTokens: m?.accumulatedUsage?.totalTokens ?? 0,
      cacheReadInputTokens: m?.accumulatedUsage?.cacheReadInputTokens,
      cacheWriteInputTokens: m?.accumulatedUsage?.cacheWriteInputTokens,
    },
    modelLatencyMs: m?.accumulatedMetrics?.latencyMs ?? 0,
    toolMetrics: m?.toolMetrics ?? {},
  }
}

function totalToolTime(metrics: ModeMetrics): number {
  return Object.values(metrics.toolMetrics).reduce((sum, t) => sum + t.totalTime, 0)
}

// ── Tool lifecycle logging ────────────────────────────────────────────────────

function elapsed(start: number): string {
  return `+${((Date.now() - start) / 1000).toFixed(1)}s`
}

function attachToolLogging(
  agent: Agent,
  mode: string,
  runStart: () => number,
  bgDispatches: Record<string, number>,
): void {
  // Standard tool calls: before/after
  agent.addHook(BeforeToolCallEvent, (event) => {
    const toolName = event.toolUse.name
    if (toolName === 'strands_structured_output') return
    console.log(`      [${elapsed(runStart())}] ${mode} | ${toolName} started`)
  })

  agent.addHook(AfterToolCallEvent, (event) => {
    const toolName = event.toolUse.name
    if (toolName === 'strands_structured_output') return
    console.log(`      [${elapsed(runStart())}] ${mode} | ${toolName} finished`)
  })

  // Background dispatches and results — also track dispatch counts
  agent.addHook(BackgroundTaskDispatchEvent, (event) => {
    const toolName = event.toolUse.name
    bgDispatches[toolName] = (bgDispatches[toolName] ?? 0) + 1
    console.log(`      [${elapsed(runStart())}] ${mode} | ${toolName} dispatched (bg)`)
  })

  agent.addHook(BackgroundTaskResultEvent, (event) => {
    console.log(`      [${elapsed(runStart())}] ${mode} | ${event.taskName} result arrived (bg)`)
  })
}

// ── Single-mode execution ────────────────────────────────────────────────────

async function runMode(
  agent: Agent,
  prompt: string | string[],
  mode: 'standard' | 'background',
  benchmarkCase: BenchmarkCase,
): Promise<ModeResult> {
  const start = Date.now()

  // Track background dispatches for trajectory validation
  // (background tools execute in forks — their metrics don't appear in primary agent's toolMetrics)
  const bgDispatches: Record<string, number> = {}
  attachToolLogging(agent, mode, () => start, bgDispatches)

  let result: AgentResult
  const allOutputTexts: string[] = []

  if (Array.isArray(prompt)) {
    // Multi-turn: invoke sequentially, collect all outputs
    let lastResult: AgentResult | undefined
    for (let t = 0; t < prompt.length; t++) {
      const turnStart = Date.now()
      lastResult = await agent.invoke(prompt[t]!)
      const turnMs = Date.now() - turnStart
      allOutputTexts.push(lastResult.toString())
      process.stdout.write(`      turn ${t + 1}/${prompt.length} (${(turnMs / 1000).toFixed(1)}s)\n`)
    }
    result = lastResult!
  } else {
    result = await agent.invoke(prompt)
    allOutputTexts.push(result.toString())
  }

  const wallClockMs = Date.now() - start
  const metrics = extractMetrics(result)

  // For output validation: combine toString() text with structured output JSON
  // (structured output has the actual data, toString() may be sparse)
  const textParts = [...allOutputTexts]
  if (result.structuredOutput) {
    textParts.push(JSON.stringify(result.structuredOutput))
  }
  const outputText = textParts.join('\n')
  const toolTimeMs = totalToolTime(metrics)

  // Run validations
  const outputValidations = validateOutput(outputText, benchmarkCase.outputValidation, result.structuredOutput)

  // Merge toolMetrics with background dispatch counts.
  // Background tools execute in forks so their metrics don't appear in the primary agent's
  // toolMetrics. We track dispatches via hooks and merge them in.
  const mergedToolMetrics = { ...metrics.toolMetrics }
  for (const [name, count] of Object.entries(bgDispatches)) {
    if (!mergedToolMetrics[name]) {
      mergedToolMetrics[name] = { callCount: count, successCount: count, errorCount: 0, totalTime: 0 }
    }
  }
  const trajectoryValidations = validateTrajectory(mergedToolMetrics, benchmarkCase.trajectoryValidation)
  const validationResults = [...outputValidations, ...trajectoryValidations]

  // Use merged tool metrics so background dispatch counts appear in the report
  const metricsWithBgDispatches = { ...metrics, toolMetrics: mergedToolMetrics }

  return {
    mode,
    wallClockMs,
    metrics: metricsWithBgDispatches,
    totalToolTimeMs: toolTimeMs,
    totalModelLatencyMs: metrics.modelLatencyMs,
    outputTokens: metrics.accumulatedUsage.outputTokens,
    inputTokens: metrics.accumulatedUsage.inputTokens,
    messageCount: agent.messages.length,
    cycleCount: metrics.cycleCount,
    outputText,
    structuredOutput: result.structuredOutput,
    stopReason: result.stopReason,
    validationResults,
    allValidationsPassed: validationResults.every((v) => v.passed),
  }
}

// ── BenchmarkRunner ──────────────────────────────────────────────────────────

export class BenchmarkRunner {
  constructor(private readonly _config: BenchmarkConfig, private readonly _model: Model) {}

  async runCase(benchmarkCase: BenchmarkCase): Promise<CaseReport> {
    const runs: RunResult[] = []

    for (let i = 0; i < this._config.runs; i++) {
      console.log(`\n  Run ${i + 1}/${this._config.runs}`)

      // Fresh agents per run — no state bleed
      console.log('    Standard...')
      const standardAgent = benchmarkCase.createStandardAgent(this._config.delayMultiplier, this._model)
      const standard = await runMode(standardAgent, benchmarkCase.prompt, 'standard', benchmarkCase)
      console.log(`    Standard: ${(standard.wallClockMs / 1000).toFixed(1)}s`)

      console.log('    Background...')
      const backgroundAgent = benchmarkCase.createBackgroundAgent(this._config.delayMultiplier, this._model)
      const background = await runMode(backgroundAgent, benchmarkCase.prompt, 'background', benchmarkCase)
      console.log(`    Background: ${(background.wallClockMs / 1000).toFixed(1)}s`)

      const speedup = standard.wallClockMs / background.wallClockMs

      console.log(`    Speedup: ${speedup.toFixed(2)}x`)

      runs.push({ runIndex: i, standard, background, speedup })
    }

    // Compute summary statistics
    const speedups = runs.map((r) => r.speedup)
    const stdWallClocks = runs.map((r) => r.standard.wallClockMs)
    const bgWallClocks = runs.map((r) => r.background.wallClockMs)
    const stdOutputTokens = runs.map((r) => r.standard.outputTokens)
    const bgOutputTokens = runs.map((r) => r.background.outputTokens)
    const stdInputTokens = runs.map((r) => r.standard.inputTokens)
    const bgInputTokens = runs.map((r) => r.background.inputTokens)
    const stdMessageCounts = runs.map((r) => r.standard.messageCount)
    const bgMessageCounts = runs.map((r) => r.background.messageCount)
    const stdCycleCounts = runs.map((r) => r.standard.cycleCount)
    const bgCycleCounts = runs.map((r) => r.background.cycleCount)
    const stdToolTimes = runs.map((r) => r.standard.totalToolTimeMs)
    const bgToolTimes = runs.map((r) => r.background.totalToolTimeMs)
    const toolTimeSpeedups = runs.map((r) =>
      r.background.totalToolTimeMs > 0 ? r.standard.totalToolTimeMs / r.background.totalToolTimeMs : 1,
    )

    const avgStdOutputTokens = stdOutputTokens.reduce((s, v) => s + v, 0) / runs.length
    const avgBgOutputTokens = bgOutputTokens.reduce((s, v) => s + v, 0) / runs.length
    const outputTokenDeltaPct = avgStdOutputTokens > 0 ? ((avgBgOutputTokens - avgStdOutputTokens) / avgStdOutputTokens) * 100 : 0

    const avgStdInputTokens = stdInputTokens.reduce((s, v) => s + v, 0) / runs.length
    const avgBgInputTokens = bgInputTokens.reduce((s, v) => s + v, 0) / runs.length
    const inputTokenDeltaPct = avgStdInputTokens > 0 ? ((avgBgInputTokens - avgStdInputTokens) / avgStdInputTokens) * 100 : 0

    const allValidationsPassed = runs.every((r) => r.standard.allValidationsPassed && r.background.allValidationsPassed)

    return {
      caseName: benchmarkCase.name,
      description: benchmarkCase.description,
      runs,
      summary: {
        speedup: computeStats(speedups),
        standardWallClockMs: computeStats(stdWallClocks),
        backgroundWallClockMs: computeStats(bgWallClocks),
        standardOutputTokens: computeStats(stdOutputTokens),
        backgroundOutputTokens: computeStats(bgOutputTokens),
        outputTokenDeltaPct,
        standardInputTokens: computeStats(stdInputTokens),
        backgroundInputTokens: computeStats(bgInputTokens),
        inputTokenDeltaPct,
        standardMessageCount: computeStats(stdMessageCounts),
        backgroundMessageCount: computeStats(bgMessageCounts),
        standardCycleCount: computeStats(stdCycleCounts),
        backgroundCycleCount: computeStats(bgCycleCounts),
        standardToolTimeMs: computeStats(stdToolTimes),
        backgroundToolTimeMs: computeStats(bgToolTimes),
        toolTimeSpeedup: computeStats(toolTimeSpeedups),
        allValidationsPassed,
      },
    }
  }

  async runAll(cases: BenchmarkCase[]): Promise<BenchmarkReport> {
    const filtered = this._config.cases
      ? cases.filter((c) => this._config.cases!.includes(c.name))
      : cases

    if (filtered.length === 0) {
      console.error('No matching cases found. Available:', cases.map((c) => c.name).join(', '))
      process.exit(1)
    }

    const caseReports: CaseReport[] = []

    for (const benchmarkCase of filtered) {
      console.log(`\n${'='.repeat(60)}`)
      console.log(`  CASE: ${benchmarkCase.name}`)
      console.log(`  ${benchmarkCase.description}`)
      console.log('='.repeat(60))

      const report = await this.runCase(benchmarkCase)
      caseReports.push(report)
    }

    const allValidationsPassed = caseReports.every((c) => c.summary.allValidationsPassed)
    const avgSpeedup =
      caseReports.length > 0
        ? caseReports.reduce((sum, c) => sum + c.summary.speedup.mean, 0) / caseReports.length
        : 0

    return {
      timestamp: new Date().toISOString(),
      config: this._config,
      cases: caseReports,
      overallSummary: {
        totalCases: caseReports.length,
        totalRuns: caseReports.length * this._config.runs,
        allValidationsPassed,
        avgSpeedupAcrossCases: avgSpeedup,
      },
    }
  }
}
