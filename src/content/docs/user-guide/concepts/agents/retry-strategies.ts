import { Agent, AfterModelCallEvent, ModelThrottledError } from '@strands-agents/sdk'

// ===========================
// Customizing Retry Behavior
// ===========================

async function customizingRetryExample() {
  // --8<-- [start:customizing_retry]
  const agent = new Agent()

  let attempts = 0
  const maxAttempts = 3 // Total attempts (including first try)
  const initialDelay = 2 // Seconds before first retry
  const maxDelay = 60 // Cap on backoff delay

  agent.addHook(AfterModelCallEvent, async (event) => {
    if (event.error instanceof ModelThrottledError && attempts < maxAttempts - 1) {
      const delay = Math.min(initialDelay * 2 ** attempts, maxDelay)
      attempts++
      await new Promise((resolve) => setTimeout(resolve, delay * 1000))
      event.retry = true
    } else {
      attempts = 0
    }
  })
  // --8<-- [end:customizing_retry]
}

// =====================
// Disabling Retries
// =====================

async function disablingRetryExample() {
  // --8<-- [start:disabling_retry]
  // The TypeScript SDK does not perform built-in automatic retries for
  // throttle errors. Retry only occurs when a hook explicitly sets
  // event.retry = true. No additional configuration is needed to disable it.
  const agent = new Agent()
  // --8<-- [end:disabling_retry]
}

// =====================
// Custom Retry Logic
// =====================

async function customRetryLogicExample() {
  // --8<-- [start:custom_retry_logic]
  const agent = new Agent()

  let attempts = 0
  const maxRetries = 3
  const delay = 2.0 // seconds

  agent.addHook(AfterModelCallEvent, async (event) => {
    if (event.error && attempts < maxRetries) {
      attempts++
      await new Promise((resolve) => setTimeout(resolve, delay * 1000))
      event.retry = true
    } else {
      attempts = 0
    }
  })
  // --8<-- [end:custom_retry_logic]
}
