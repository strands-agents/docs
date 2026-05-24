/**
 * Incident Response Benchmark
 *
 * Pattern: 4-layer deep pipeline with high fan-out.
 *
 * Layer 1 — Triage:        2 tools (5s each — SIEM queries)
 * Layer 2 — Investigation:  6 tools (8s each — deep log analysis)
 * Layer 3 — Correlation:    4 tools (10s each — cross-referencing data sources)
 * Layer 4 — Response:       4 tools (5s each — infrastructure API calls)
 *
 * All tools are stubs with fixed delays and canned outputs.
 *
 * Standard:   16 sequential calls (2×5 + 6×8 + 4×10 + 4×5 = 118s)
 * Background: 4 concurrent layers (5 + 8 + 10 + 5 = 28s)
 * Expected speedup: ~3-4x
 */

import { Agent, tool } from '@strands-agents/sdk'
import type { Model } from '@strands-agents/sdk'
import { z } from 'zod'
import type { BenchmarkCase } from '../framework/types.js'

// ── Tool stubs ───────────────────────────────────────────────────────────────

function makeTools(delayMultiplier: number) {
  // Realistic delays per layer:
  const triageDelay = 5000      // SIEM / alerting system queries (~5s)
  const investigateDelay = 8000 // Deep log analysis, scanning (~8s)
  const correlateDelay = 10000  // Cross-referencing multiple data sources (~10s)
  const respondDelay = 5000     // Infrastructure API calls (~5s)

  // ── Layer 1: Triage ──────────────────────────────────────────────────────

  const detectAnomaly = tool({
    name: 'detect_anomaly',
    description: 'Run anomaly detection on recent system activity to identify the initial threat vector.',
    inputSchema: z.object({ timeframe: z.string().describe('Time range to analyze, e.g. "last 4 hours"') }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, triageDelay * delayMultiplier))
      return 'ANOMALY DETECTED: Unusual outbound data transfer spike at 02:14 UTC from subnet 10.0.3.0/24. Volume: 4.2GB over 47 minutes to external IP 203.0.113.42. Pattern consistent with staged exfiltration. Affected systems: app-server-07, app-server-12, db-replica-03.'
    },
  })

  const collectInitialIndicators = tool({
    name: 'collect_initial_indicators',
    description: 'Collect initial indicators of compromise (IOCs) from available telemetry.',
    inputSchema: z.object({ timeframe: z.string().describe('Time range to collect IOCs from') }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, triageDelay * delayMultiplier))
      return 'IOC COLLECTION: External IP 203.0.113.42 (known C2 infrastructure, Lazarus Group attribution). Suspicious binary hash: a3f2b8c1... (matches known RAT variant). Compromised credentials: svc-deploy@corp (service account). Initial entry vector: phishing email to eng-team@corp at 2024-01-14 23:48 UTC.'
    },
  })

  // ── Layer 2: Investigation ─────────────────────────────────────────────

  const analyzeNetworkLogs = tool({
    name: 'analyze_network_logs',
    description: 'Deep analysis of network flow logs for lateral movement and data exfiltration patterns.',
    inputSchema: z.object({
      indicators: z.string().describe('IOCs and anomaly data from triage phase'),
    }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, investigateDelay * delayMultiplier))
      return 'NETWORK ANALYSIS: Lateral movement detected via SMB from app-server-07 to 4 additional hosts between 01:30-02:10 UTC. DNS tunneling to 203.0.113.42 confirmed (encoded queries averaging 180 bytes). Exfiltration used HTTPS to blend with normal traffic. Firewall rules bypassed via allowed port 443.'
    },
  })

  const analyzeAccessLogs = tool({
    name: 'analyze_access_logs',
    description: 'Analyze authentication and access logs for unauthorized access patterns.',
    inputSchema: z.object({
      indicators: z.string().describe('IOCs and anomaly data from triage phase'),
    }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, investigateDelay * delayMultiplier))
      return 'ACCESS ANALYSIS: svc-deploy account authenticated from unusual source (10.0.3.15 instead of CI/CD subnet). 23 privilege escalation events in 12 minutes. Accessed production secrets vault at 01:52 UTC. 3 additional service accounts compromised via credential harvesting: svc-backup, svc-monitor, svc-analytics.'
    },
  })

  const analyzeEndpointTelemetry = tool({
    name: 'analyze_endpoint_telemetry',
    description: 'Analyze endpoint detection and response (EDR) telemetry from affected systems.',
    inputSchema: z.object({
      indicators: z.string().describe('IOCs and anomaly data from triage phase'),
    }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, investigateDelay * delayMultiplier))
      return 'ENDPOINT ANALYSIS: Malicious process chain on app-server-07: outlook.exe → powershell.exe → svchost.exe (masqueraded). Memory-resident payload detected — no disk artifacts. Persistence via scheduled task "WindowsHealthCheck" running every 15 minutes. Anti-forensic: event logs cleared on 3 hosts.'
    },
  })

  const checkThreatIntel = tool({
    name: 'check_threat_intel',
    description: 'Cross-reference IOCs against threat intelligence databases.',
    inputSchema: z.object({
      indicators: z.string().describe('IOCs from triage phase'),
    }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, investigateDelay * delayMultiplier))
      return 'THREAT INTEL: IP 203.0.113.42 linked to Lazarus Group infrastructure (confidence: HIGH, 7 reports since 2023). RAT variant matches "DreamJob" campaign TTPs. Similar attack pattern seen in 3 financial sector breaches in last 90 days. MITRE ATT&CK: T1566.001, T1059.001, T1071.001, T1048.003.'
    },
  })

  const scanAffectedSystems = tool({
    name: 'scan_affected_systems',
    description: 'Run vulnerability and malware scans on systems identified in triage.',
    inputSchema: z.object({
      systems: z.string().describe('List of affected systems from triage'),
    }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, investigateDelay * delayMultiplier))
      return 'SYSTEM SCAN: 6 systems confirmed compromised: app-server-07 (patient zero), app-server-12, db-replica-03, jump-host-02, ci-runner-05, monitoring-01. Unpatched CVE-2024-1234 on 4 hosts (initial exploitation vector). Webshell found on app-server-12:/tmp/.cache/health.php. Rootkit detected on jump-host-02.'
    },
  })

  const retrieveUserActivity = tool({
    name: 'retrieve_user_activity',
    description: 'Retrieve and analyze user activity timelines for compromised accounts.',
    inputSchema: z.object({
      accounts: z.string().describe('Compromised accounts from investigation'),
    }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, investigateDelay * delayMultiplier))
      return 'USER ACTIVITY: svc-deploy accessed 142 repos in 8 minutes (vs normal 3/hour). svc-backup triggered 47 snapshot exports. svc-analytics ran 12 bulk data queries against customer PII tables. Human user j.chen@corp phishing victim — email opened at 23:48 UTC, macro executed at 23:49 UTC. No other human accounts compromised.'
    },
  })

  // ── Layer 3: Correlation ───────────────────────────────────────────────

  const correlateNetworkAccess = tool({
    name: 'correlate_network_access',
    description: 'Correlate network and access log findings to map the attack path.',
    inputSchema: z.object({
      network_findings: z.string().describe('Network analysis results'),
      access_findings: z.string().describe('Access log analysis results'),
    }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, correlateDelay * delayMultiplier))
      return 'CORRELATION — Network+Access: Attack path reconstructed: phishing → j.chen workstation → svc-deploy credential theft via LSASS dump → lateral movement via SMB to app-server-07 → privilege escalation → secrets vault access → spread to 5 additional systems. Total dwell time: ~2.5 hours before exfiltration began.'
    },
  })

  const correlateThreatIndicators = tool({
    name: 'correlate_threat_indicators',
    description: 'Correlate threat intel with investigation findings for attribution.',
    inputSchema: z.object({
      threat_intel: z.string().describe('Threat intelligence findings'),
      endpoint_findings: z.string().describe('Endpoint telemetry findings'),
    }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, correlateDelay * delayMultiplier))
      return 'CORRELATION — Threat+Endpoint: HIGH confidence attribution to Lazarus Group. TTP overlap: 89% match with DreamJob campaign. Custom RAT variant confirms state-sponsored tooling. Target profile (financial data, customer PII) consistent with previous Lazarus operations. Estimated attacker sophistication: ADVANCED.'
    },
  })

  const correlateEndpointBehavior = tool({
    name: 'correlate_endpoint_behavior',
    description: 'Correlate endpoint behavior across compromised systems for pattern analysis.',
    inputSchema: z.object({
      endpoint_findings: z.string().describe('Endpoint telemetry findings'),
      system_scan: z.string().describe('System scan results'),
    }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, correlateDelay * delayMultiplier))
      return 'CORRELATION — Endpoint Behavior: Consistent malware deployment pattern across all 6 hosts. Persistence mechanism identical (scheduled task). Anti-forensic cleanup ran on 3 of 6 hosts (partial). Memory-only payload prevents traditional AV detection. Webshell on app-server-12 served as backup C2 channel.'
    },
  })

  const buildAttackTimeline = tool({
    name: 'build_attack_timeline',
    description: 'Construct a comprehensive attack timeline from all investigation data.',
    inputSchema: z.object({
      user_activity: z.string().describe('User activity timeline'),
      network_findings: z.string().describe('Network analysis results'),
    }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, correlateDelay * delayMultiplier))
      return 'ATTACK TIMELINE: 23:48 — Phishing email opened (j.chen). 23:49 — Macro executed, RAT deployed. 00:15 — Credential harvesting (svc-deploy). 00:30 — Lateral movement begins. 01:30 — 6 systems compromised. 01:52 — Secrets vault accessed. 02:00 — Data staging begins. 02:14 — Exfiltration starts (4.2GB over 47 min). 03:01 — Anomaly detection triggered alert.'
    },
  })

  // ── Layer 4: Response ──────────────────────────────────────────────────────

  const isolateCompromisedSystems = tool({
    name: 'isolate_compromised_systems',
    description: 'Network-isolate all compromised systems to contain the breach.',
    inputSchema: z.object({
      systems: z.string().describe('List of compromised systems to isolate'),
      correlation_data: z.string().describe('Correlation findings confirming scope'),
    }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, respondDelay * delayMultiplier))
      return 'ISOLATION COMPLETE: 6 systems moved to quarantine VLAN. Network ACLs blocking all external traffic for subnet 10.0.3.0/24. C2 IP 203.0.113.42 added to firewall blocklist. DNS sinkhole configured for known C2 domains. Monitoring confirms zero outbound connections from quarantined systems.'
    },
  })

  const revokeCredentials = tool({
    name: 'revoke_credentials',
    description: 'Revoke and rotate all compromised credentials.',
    inputSchema: z.object({
      accounts: z.string().describe('Compromised accounts to revoke'),
      correlation_data: z.string().describe('Correlation data confirming compromised scope'),
    }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, respondDelay * delayMultiplier))
      return 'CREDENTIAL REVOCATION: 4 service accounts disabled and rotated (svc-deploy, svc-backup, svc-monitor, svc-analytics). j.chen account locked, password reset forced. All active sessions terminated. Secrets vault keys rotated. API tokens regenerated for affected services. MFA enforcement verified for all accounts.'
    },
  })

  const deployPatches = tool({
    name: 'deploy_patches',
    description: 'Deploy emergency patches for exploited vulnerabilities.',
    inputSchema: z.object({
      vulnerabilities: z.string().describe('CVEs and vulnerabilities to patch'),
      correlation_data: z.string().describe('Correlation data confirming affected systems'),
    }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, respondDelay * delayMultiplier))
      return 'PATCH DEPLOYMENT: CVE-2024-1234 patched on all 47 production hosts (not just the 6 compromised). Emergency OS patches applied. Scheduled tasks "WindowsHealthCheck" removed from all systems. Webshell removed from app-server-12. EDR signatures updated with new IOCs. Full system reimage scheduled for 6 compromised hosts.'
    },
  })

  const generateIncidentReport = tool({
    name: 'generate_incident_report',
    description: 'Generate the formal incident report for executive and regulatory communication.',
    inputSchema: z.object({
      timeline: z.string().describe('Attack timeline'),
      response_actions: z.string().describe('Summary of response actions taken'),
    }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, respondDelay * delayMultiplier))
      return 'INCIDENT REPORT GENERATED: INC-2024-0042. Classification: Data Breach — Customer PII potentially exfiltrated. Regulatory notifications required: GDPR (72hr), state breach notification laws. Estimated affected records: 142,000 customer profiles. Insurance carrier notified. External forensics firm engaged for independent validation.'
    },
  })

  return [
    // Layer 1
    detectAnomaly,
    collectInitialIndicators,
    // Layer 2
    analyzeNetworkLogs,
    analyzeAccessLogs,
    analyzeEndpointTelemetry,
    checkThreatIntel,
    scanAffectedSystems,
    retrieveUserActivity,
    // Layer 3
    correlateNetworkAccess,
    correlateThreatIndicators,
    correlateEndpointBehavior,
    buildAttackTimeline,
    // Layer 4
    isolateCompromisedSystems,
    revokeCredentials,
    deployPatches,
    generateIncidentReport,
  ]
}

// ── Structured output schema ─────────────────────────────────────────────────

const incidentReportSchema = z.object({
  incident_id: z.string().describe('Incident identifier'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).describe('Incident severity'),
  triage_summary: z.object({
    anomaly_type: z.string().describe('Type of anomaly detected'),
    initial_indicators: z.array(z.string()).min(2).describe('Key IOCs identified during triage'),
  }),
  investigation_findings: z
    .array(
      z.object({
        source: z.string().describe('Investigation data source'),
        finding: z.string().describe('Key finding from this source'),
      }),
    )
    .min(4)
    .describe('Findings from investigation tools'),
  correlation_results: z
    .array(
      z.object({
        analysis: z.string().describe('Correlation analysis name'),
        conclusion: z.string().describe('Key conclusion'),
      }),
    )
    .min(2)
    .describe('Results from correlation analyses'),
  response_actions: z
    .array(
      z.object({
        action: z.string().describe('Response action taken'),
        status: z.enum(['completed', 'in_progress', 'failed']).describe('Action status'),
      }),
    )
    .min(2)
    .describe('Response actions executed'),
  executive_summary: z.string().describe('Executive summary of the incident'),
})

// ── Prompts ──────────────────────────────────────────────────────────────────

const systemPrompt =
  'You are a senior security incident responder. You have access to triage, investigation, ' +
  'correlation, and response tools.\n\n' +
  'PROTOCOL (follow this exact order):\n' +
  '1. TRIAGE: Call detect_anomaly and collect_initial_indicators.\n' +
  '2. INVESTIGATE: Using triage results, call ALL 6 investigation tools:\n' +
  '   analyze_network_logs, analyze_access_logs, analyze_endpoint_telemetry,\n' +
  '   check_threat_intel, scan_affected_systems, retrieve_user_activity.\n' +
  '3. CORRELATE: Using investigation results, call ALL 4 correlation tools:\n' +
  '   correlate_network_access, correlate_threat_indicators,\n' +
  '   correlate_endpoint_behavior, build_attack_timeline.\n' +
  '4. RESPOND: Using correlation results, call ALL 4 response tools:\n' +
  '   isolate_compromised_systems, revoke_credentials,\n' +
  '   deploy_patches, generate_incident_report.\n' +
  '5. Write an incident report with the following structure:\n' +
  '   - Incident ID and severity\n' +
  '   - Triage summary: anomaly type, key IOCs\n' +
  '   - Investigation findings: one finding per source with risk classification\n' +
  '   - Correlation results: conclusions from each correlation analysis\n' +
  '   - Response actions: what was done and status\n' +
  '   - Executive summary\n\n' +
  'You MUST call all 16 tools before writing the report.\n' +
  'Include specific data points from tool results — do not paraphrase generically.'

const userPrompt =
  'ALERT: Anomaly detection flagged unusual outbound data transfer from production subnet. ' +
  'Execute the full incident response protocol: triage, investigate, correlate, respond. ' +
  'Then write a detailed incident report with specific findings from each phase.'

// ── Case definition ──────────────────────────────────────────────────────────

export const incidentResponse: BenchmarkCase = {
  name: 'incident-response',
  description: 'Security incident response pipeline (16 tool stubs, 4 layers with dependencies)',

  prompt: userPrompt,

  createStandardAgent(delayMultiplier: number, model: Model): Agent {
    return new Agent({
      model,
      systemPrompt,
      tools: makeTools(delayMultiplier),
      structuredOutputSchema: incidentReportSchema,
      printer: false,
    })
  },

  createBackgroundAgent(delayMultiplier: number, model: Model): Agent {
    return new Agent({
      model,
      systemPrompt,
      backgroundTools: makeTools(delayMultiplier),
      structuredOutputSchema: incidentReportSchema,
      printer: false,
    })
  },

  outputValidation: {
    requireStructuredOutput: true,
    requiredContent: [
      'incident',
      '203.0.113.42',        // C2 IP from triage — only in Layer 1 tool outputs
      'lateral movement',     // from Layer 2 network/endpoint analysis
      'Lazarus',              // attribution from Layer 3 threat correlation
      'quarantine',           // from Layer 4 isolation response
    ],
    minLength: 200,
  },

  trajectoryValidation: {
    requiredTools: [
      // Layer 1
      'detect_anomaly',
      'collect_initial_indicators',
      // Layer 2
      'analyze_network_logs',
      'analyze_access_logs',
      'analyze_endpoint_telemetry',
      'check_threat_intel',
      'scan_affected_systems',
      'retrieve_user_activity',
      // Layer 3
      'correlate_network_access',
      'correlate_threat_indicators',
      'correlate_endpoint_behavior',
      'build_attack_timeline',
      // Layer 4
      'isolate_compromised_systems',
      'revoke_credentials',
      'deploy_patches',
      'generate_incident_report',
    ],
    minToolCalls: 16,
  },
}
