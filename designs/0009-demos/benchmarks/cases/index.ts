import { sessionEnrichment } from './session-enrichment.js'
import { probeDispatch } from './probe-dispatch.js'
import { mixedDispatch } from './mixed-dispatch.js'
import { dueDiligence } from './due-diligence.js'
import { incidentResponse } from './incident-response.js'
import type { BenchmarkCase } from '../framework/types.js'

/** All benchmark cases, ordered simplest → most complex. */
export const allCases: BenchmarkCase[] = [sessionEnrichment, probeDispatch, mixedDispatch, dueDiligence, incidentResponse]
