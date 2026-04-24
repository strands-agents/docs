import { writeFileSync, mkdirSync } from 'node:fs'
import type { BenchmarkReport, CaseReport, Stats } from './types.js'

// ── Statistics ───────────────────────────────────────────────────────────────

export function computeStats(values: number[]): Stats {
  if (values.length === 0) return { mean: 0, stddev: 0, min: 0, max: 0, p50: 0, p95: 0 }

  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length
  const mean = sorted.reduce((s, v) => s + v, 0) / n
  const variance = sorted.reduce((s, v) => s + (v - mean) ** 2, 0) / n
  const stddev = Math.sqrt(variance)

  return {
    mean,
    stddev,
    min: sorted[0]!,
    max: sorted[n - 1]!,
    p50: sorted[Math.floor(n * 0.5)]!,
    p95: sorted[Math.min(Math.floor(n * 0.95), n - 1)]!,
  }
}

// ── JSON Report ──────────────────────────────────────────────────────────────

export function writeReport(report: BenchmarkReport, outputDir: string): string {
  mkdirSync(outputDir, { recursive: true })

  // Replace regex patterns with their source strings for JSON serialization
  const serializable = JSON.parse(JSON.stringify(report, (_key, value) => {
    if (value instanceof RegExp) return value.source
    return value
  }))

  const filename = `report-${report.timestamp.replace(/[:.]/g, '-')}.json`
  const filepath = `${outputDir}/${filename}`
  writeFileSync(filepath, JSON.stringify(serializable, null, 2))
  return filepath
}

// ── Console Summary ──────────────────────────────────────────────────────────

function fmt(ms: number): string {
  return (ms / 1000).toFixed(1) + 's'
}

function fmtStats(s: Stats, unit: 'ms' | 'x' | 'tokens'): string {
  if (unit === 'ms') return `${fmt(s.mean)} ± ${fmt(s.stddev)}`
  if (unit === 'x') return `${s.mean.toFixed(2)}x ± ${s.stddev.toFixed(2)}`
  return `${Math.round(s.mean)} ± ${Math.round(s.stddev)}`
}

function pad(str: string, len: number): string {
  return str.padEnd(len)
}

function printCaseReport(c: CaseReport): void {
  const s = c.summary
  const line = '\u2500'.repeat(70)

  console.log(`\n\u2500\u2500 ${c.caseName} ${'\u2500'.repeat(Math.max(0, 66 - c.caseName.length))}`)
  console.log()

  // Per-run table
  console.log(
    `  ${pad('Run', 6)} ${pad('Standard', 12)} ${pad('Background', 12)} ${pad('Speedup', 10)} ${pad('Std Tok', 10)} ${pad('Bg Tok', 10)} ${pad('Std Msg', 8)} Bg Msg`,
  )
  console.log(`  ${'\u2500'.repeat(6)} ${'\u2500'.repeat(12)} ${'\u2500'.repeat(12)} ${'\u2500'.repeat(10)} ${'\u2500'.repeat(10)} ${'\u2500'.repeat(10)} ${'\u2500'.repeat(8)} ${'\u2500'.repeat(8)}`)

  for (const r of c.runs) {
    console.log(
      `  ${pad(String(r.runIndex + 1), 6)} ${pad(fmt(r.standard.wallClockMs), 12)} ${pad(fmt(r.background.wallClockMs), 12)} ${pad(r.speedup.toFixed(2) + 'x', 10)} ${pad(String(r.standard.outputTokens), 10)} ${pad(String(r.background.outputTokens), 10)} ${pad(String(r.standard.messageCount), 8)} ${r.background.messageCount}`,
    )
  }

  console.log(`  ${'\u2500'.repeat(6)} ${'\u2500'.repeat(12)} ${'\u2500'.repeat(12)} ${'\u2500'.repeat(10)} ${'\u2500'.repeat(10)} ${'\u2500'.repeat(10)} ${'\u2500'.repeat(8)} ${'\u2500'.repeat(8)}`)
  console.log(
    `  ${pad('Avg', 6)} ${pad(fmt(s.standardWallClockMs.mean), 12)} ${pad(fmt(s.backgroundWallClockMs.mean), 12)} ${pad(s.speedup.mean.toFixed(2) + 'x', 10)} ${pad(String(Math.round(s.standardOutputTokens.mean)), 10)} ${pad(String(Math.round(s.backgroundOutputTokens.mean)), 10)} ${pad(String(Math.round(s.standardMessageCount.mean)), 8)} ${Math.round(s.backgroundMessageCount.mean)}`,
  )

  // Time decomposition
  console.log()
  console.log('  Time Decomposition (avg):')
  const toolSpeedupStr =
    s.backgroundToolTimeMs.mean > 0
      ? `${s.toolTimeSpeedup.mean.toFixed(2)}x`
      : 'N/A (bg tools run in forks)'
  console.log(
    `    Tool execution:    ${fmt(s.standardToolTimeMs.mean)} std \u2192 ${fmt(s.backgroundToolTimeMs.mean)} bg` +
    `   (${toolSpeedupStr})`,
  )

  // Token usage
  const outDeltaPct = s.outputTokenDeltaPct
  const outDeltaOk = Math.abs(outDeltaPct) < 15
  const inDeltaPct = s.inputTokenDeltaPct
  console.log()
  console.log('  Token Usage (avg):')
  console.log(
    `    Output: ${Math.round(s.standardOutputTokens.mean)} std vs ${Math.round(s.backgroundOutputTokens.mean)} bg` +
    ` \u2014 \u0394 ${Math.abs(outDeltaPct).toFixed(1)}% ${outDeltaOk ? '\u2713' : '\u2717 WARNING: >15%'}`,
  )
  console.log(
    `    Input:  ${Math.round(s.standardInputTokens.mean)} std vs ${Math.round(s.backgroundInputTokens.mean)} bg` +
    ` \u2014 \u0394 ${Math.abs(inDeltaPct).toFixed(1)}%`,
  )

  // Context size
  console.log()
  console.log('  Context (avg):')
  console.log(
    `    Messages: ${Math.round(s.standardMessageCount.mean)} std vs ${Math.round(s.backgroundMessageCount.mean)} bg`,
  )
  console.log(
    `    Cycles:   ${Math.round(s.standardCycleCount.mean)} std vs ${Math.round(s.backgroundCycleCount.mean)} bg`,
  )

  // Speedup stats
  console.log()
  console.log(
    `  Speedup: ${fmtStats(s.speedup, 'x')} (p50: ${s.speedup.p50.toFixed(2)}x, p95: ${s.speedup.p95.toFixed(2)}x)`,
  )

  // Trajectory (from first run, both modes)
  const stdTools = c.runs[0]?.standard.metrics.toolMetrics
  const bgTools = c.runs[0]?.background.metrics.toolMetrics
  if (stdTools && Object.keys(stdTools).length > 0) {
    console.log()
    console.log('  Trajectory:')
    const allToolNames = new Set([...Object.keys(stdTools), ...Object.keys(bgTools ?? {})])
    allToolNames.delete('strands_structured_output')
    for (const name of allToolNames) {
      const sc = stdTools[name]?.callCount ?? 0
      const bc = bgTools?.[name]?.callCount ?? 0
      console.log(`    ${pad(name + ':', 40)} ${sc} (std) | ${bc} (bg)`)
    }
  }

  // Validations
  const totalValidations = c.runs.reduce(
    (sum, r) => sum + r.standard.validationResults.length + r.background.validationResults.length,
    0,
  )
  const passedValidations = c.runs.reduce(
    (sum, r) =>
      sum +
      r.standard.validationResults.filter((v) => v.passed).length +
      r.background.validationResults.filter((v) => v.passed).length,
    0,
  )
  console.log()
  console.log(`  Validations: ${passedValidations}/${totalValidations} passed ${s.allValidationsPassed ? '\u2713' : '\u2717'}`)

  // Print failed validations
  if (!s.allValidationsPassed) {
    for (const r of c.runs) {
      for (const v of [...r.standard.validationResults, ...r.background.validationResults]) {
        if (!v.passed) {
          console.log(`    \u2717 Run ${r.runIndex + 1}: ${v.name} — ${v.reason}`)
        }
      }
    }
  }
}

export function printSummary(report: BenchmarkReport): void {
  const border = '\u2550'.repeat(72)

  console.log(`\n${border}`)
  console.log(`  BENCHMARK REPORT \u2014 ${report.timestamp}`)
  console.log(`  Model: ${report.config.model} | Runs per case: ${report.config.runs} | Delay multiplier: ${report.config.delayMultiplier}x`)
  console.log(border)

  for (const c of report.cases) {
    printCaseReport(c)
  }

  // Overall summary
  console.log(`\n${border}`)
  console.log('  OVERALL SUMMARY')
  console.log(border)
  console.log()
  console.log(
    `  ${pad('Case', 26)} ${pad('Avg Speedup', 14)} ${pad('\u03c3', 10)} ${pad('Validations', 14)} Token \u0394`,
  )
  console.log(`  ${'\u2500'.repeat(26)} ${'\u2500'.repeat(14)} ${'\u2500'.repeat(10)} ${'\u2500'.repeat(14)} ${'\u2500'.repeat(10)}`)

  for (const c of report.cases) {
    const s = c.summary
    const totalV = c.runs.reduce(
      (sum, r) => sum + r.standard.validationResults.length + r.background.validationResults.length,
      0,
    )
    const passedV = c.runs.reduce(
      (sum, r) =>
        sum +
        r.standard.validationResults.filter((v) => v.passed).length +
        r.background.validationResults.filter((v) => v.passed).length,
      0,
    )

    console.log(
      `  ${pad(c.caseName, 26)} ${pad(s.speedup.mean.toFixed(2) + 'x', 14)} ${pad('\u00b1' + s.speedup.stddev.toFixed(2), 10)} ${pad(`${s.allValidationsPassed ? '\u2713' : '\u2717'} ${passedV}/${totalV}`, 14)} ${Math.abs(s.outputTokenDeltaPct).toFixed(1)}%`,
    )
  }

  console.log()
  console.log(
    `  Overall: ${report.overallSummary.avgSpeedupAcrossCases.toFixed(2)}x avg | ` +
    `${report.overallSummary.allValidationsPassed ? '\u2713 All validations passed' : '\u2717 Some validations failed'}`,
  )
  console.log()
}
