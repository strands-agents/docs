import type { OutputValidation, TrajectoryValidation, ValidationResult } from './types.js'

/**
 * Validate agent output text against the case's output spec.
 */
export function validateOutput(
  output: string,
  spec: OutputValidation,
  structuredOutput?: unknown,
): ValidationResult[] {
  const results: ValidationResult[] = []
  const lower = output.toLowerCase()

  if (spec.requireStructuredOutput) {
    const present = structuredOutput != null
    results.push({
      name: 'structured_output_present',
      passed: present,
      reason: present ? 'Structured output produced' : 'Structured output missing (null or undefined)',
    })
  }

  if (spec.requiredContent) {
    for (const content of spec.requiredContent) {
      const found = lower.includes(content.toLowerCase())
      results.push({
        name: `required_content:${content}`,
        passed: found,
        reason: found ? `Found "${content}" in output` : `Missing "${content}" in output`,
      })
    }
  }

  if (spec.requiredPatterns) {
    for (const pattern of spec.requiredPatterns) {
      const matched = pattern.test(output)
      results.push({
        name: `required_pattern:${pattern.source}`,
        passed: matched,
        reason: matched ? `Pattern /${pattern.source}/ matched` : `Pattern /${pattern.source}/ not found`,
      })
    }
  }

  if (spec.minLength !== undefined) {
    const passed = output.length >= spec.minLength
    results.push({
      name: `min_length:${spec.minLength}`,
      passed,
      reason: passed
        ? `Output length ${output.length} >= ${spec.minLength}`
        : `Output length ${output.length} < ${spec.minLength}`,
    })
  }

  if (spec.maxLength !== undefined) {
    const passed = output.length <= spec.maxLength
    results.push({
      name: `max_length:${spec.maxLength}`,
      passed,
      reason: passed
        ? `Output length ${output.length} <= ${spec.maxLength}`
        : `Output length ${output.length} > ${spec.maxLength}`,
    })
  }

  return results
}

/**
 * Validate tool call trajectory against the case's trajectory spec.
 */
export function validateTrajectory(
  toolMetrics: Record<string, { callCount: number; successCount: number; errorCount: number; totalTime: number }>,
  spec: TrajectoryValidation,
): ValidationResult[] {
  const results: ValidationResult[] = []

  if (spec.requiredTools) {
    for (const toolName of spec.requiredTools) {
      const entry = toolMetrics[toolName]
      const called = entry !== undefined && entry.callCount >= 1
      results.push({
        name: `required_tool:${toolName}`,
        passed: called,
        reason: called
          ? `${toolName} called ${entry!.callCount} time(s)`
          : `${toolName} was not called`,
      })
    }
  }

  if (spec.minToolCalls !== undefined) {
    const totalCalls = Object.entries(toolMetrics)
      .filter(([name]) => name !== 'strands_structured_output')
      .reduce((sum, [, t]) => sum + t.callCount, 0)
    const passed = totalCalls >= spec.minToolCalls
    results.push({
      name: `min_tool_calls:${spec.minToolCalls}`,
      passed,
      reason: passed
        ? `Total tool calls ${totalCalls} >= ${spec.minToolCalls}`
        : `Total tool calls ${totalCalls} < ${spec.minToolCalls}`,
    })
  }

  return results
}
