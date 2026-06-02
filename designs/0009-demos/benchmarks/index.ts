import { allCases } from './cases/index.js'
import { BenchmarkRunner } from './framework/runner.js'
import { writeReport, printSummary } from './framework/report.js'
import { createModel } from './framework/models.js'
import type { BenchmarkConfig } from './framework/types.js'
import { DEFAULT_CONFIG, MODEL_PRESETS } from './framework/types.js'

// ── CLI arg parsing ──────────────────────────────────────────────────────────

function parseArgs(): BenchmarkConfig {
  const args = process.argv.slice(2)
  const config = { ...DEFAULT_CONFIG }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    const next = args[i + 1]

    switch (arg) {
      case '--cases':
        if (next) {
          config.cases = next.split(',').map((s) => s.trim())
          i++
        }
        break
      case '--runs':
        if (next) {
          config.runs = parseInt(next, 10)
          i++
        }
        break
      case '--delay-multiplier':
        if (next) {
          config.delayMultiplier = parseFloat(next)
          i++
        }
        break
      case '--output-dir':
        if (next) {
          config.outputDir = next
          i++
        }
        break
      case '--model':
        if (next) {
          config.model = next
          i++
        }
        break
      case '--help':
        console.log(`
Background Tasks Benchmark Suite

Usage: npm start -- [options]

Options:
  --cases <names>            Comma-separated case names to run (default: all)
  --model <name>             Model preset to use (default: ${DEFAULT_CONFIG.model})
  --runs <n>                 Repetitions per case (default: ${DEFAULT_CONFIG.runs})
  --delay-multiplier <n>     Tool delay scale factor (default: ${DEFAULT_CONFIG.delayMultiplier})
  --output-dir <dir>         Report output directory (default: ${DEFAULT_CONFIG.outputDir})
  --help                     Show this help

Available models:
${Object.entries(MODEL_PRESETS).map(([name, desc]) => `  ${name.padEnd(24)} ${desc}`).join('\n')}

Available cases:
${allCases.map((c) => `  ${c.name.padEnd(24)} ${c.description}`).join('\n')}
`)
        process.exit(0)
    }
  }

  return config
}

// ── Main ─────────────────────────────────────────────────────────────────────

const config = parseArgs()
const model = createModel(config.model)
const runner = new BenchmarkRunner(config, model)

console.log('\n' + '='.repeat(60))
console.log('  BACKGROUND TASKS BENCHMARK SUITE')
console.log('='.repeat(60))
console.log(`  Model:            ${config.model}`)
console.log(`  Runs:             ${config.runs}`)
console.log(`  Delay multiplier: ${config.delayMultiplier}x`)
console.log(`  Cases:            ${config.cases?.join(', ') ?? 'all'}`)
console.log(`  Output:           ${config.outputDir}`)
console.log('='.repeat(60))

const report = await runner.runAll(allCases)
const filepath = writeReport(report, config.outputDir)
printSummary(report)

console.log(`  Report written to: ${filepath}`)
console.log()

process.exit(report.overallSummary.allValidationsPassed ? 0 : 1)
