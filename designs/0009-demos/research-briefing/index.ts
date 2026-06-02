/**
 * Research Briefing Generator — Standard vs Background comparison
 *
 * Demonstrates background task scheduling with real data sources.
 * Runs the same research pipeline twice — once with standard tools (sequential)
 * and once with backgroundTools (parallel dispatch) — then compares wall-clock time.
 *
 * Data sources (all free, no auth):
 *   - GitHub API (repos + discussions)
 *   - ArXiv API (academic papers)
 *   - HackerNews Algolia API (community discussions)
 *   - Web fetch (documentation sites)
 */

import {
  Agent,
  BedrockModel,
  tool,
  BeforeToolCallEvent,
  AfterToolCallEvent,
  BackgroundTaskDispatchEvent,
  BackgroundTaskResultEvent,
} from '@strands-agents/sdk'
import { z } from 'zod'

// ── Fetch tools ─────────────────────────────────────────────────────────────

const searchGitHub = tool({
  name: 'search_github',
  description: 'Search GitHub for repositories and discussions matching a query. Returns repo names, descriptions, stars, and recent activity.',
  inputSchema: z.object({
    query: z.string().describe('Search query'),
  }),
  callback: async (input) => {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(input.query)}&sort=updated&per_page=10`
    const res = await fetch(url, { headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'strands-research-agent' } })
    if (!res.ok) return `GitHub API error: ${res.status}`
    const data = await res.json() as { items: Array<{ full_name: string; description: string; stargazers_count: number; updated_at: string; html_url: string; topics: string[] }> }
    return data.items.map(r =>
      `${r.full_name} (${r.stargazers_count} stars, updated ${r.updated_at.slice(0, 10)})\n  ${r.description ?? 'No description'}\n  Topics: ${r.topics?.join(', ') || 'none'}\n  ${r.html_url}`
    ).join('\n\n')
  },
})

const searchArxiv = tool({
  name: 'search_arxiv',
  description: 'Search ArXiv for recent academic papers matching a query. Returns titles, authors, abstracts, and links.',
  inputSchema: z.object({
    query: z.string().describe('Search query'),
  }),
  callback: async (input) => {
    const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(input.query)}&max_results=8&sortBy=submittedDate&sortOrder=descending`
    const res = await fetch(url)
    if (!res.ok) return `ArXiv API error: ${res.status}`
    const xml = await res.text()
    const entries = xml.split('<entry>').slice(1)
    return entries.map(entry => {
      const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim().replace(/\n\s+/g, ' ') ?? 'Unknown'
      const summary = entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.trim().replace(/\n\s+/g, ' ').slice(0, 300) ?? ''
      const link = entry.match(/<id>([\s\S]*?)<\/id>/)?.[1]?.trim() ?? ''
      const published = entry.match(/<published>([\s\S]*?)<\/published>/)?.[1]?.trim().slice(0, 10) ?? ''
      return `${title}\n  Published: ${published}\n  ${summary}...\n  ${link}`
    }).join('\n\n')
  },
})

const searchHackerNews = tool({
  name: 'search_hackernews',
  description: 'Search HackerNews for recent discussions and stories matching a query. Returns titles, points, comment counts, and links.',
  inputSchema: z.object({
    query: z.string().describe('Search query'),
  }),
  callback: async (input) => {
    const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(input.query)}&tags=story&hitsPerPage=10`
    const res = await fetch(url)
    if (!res.ok) return `HN API error: ${res.status}`
    const data = await res.json() as { hits: Array<{ title: string; points: number; num_comments: number; url: string; objectID: string; created_at: string }> }
    return data.hits.map(h =>
      `${h.title} (${h.points} points, ${h.num_comments} comments, ${h.created_at.slice(0, 10)})\n  ${h.url || `https://news.ycombinator.com/item?id=${h.objectID}`}`
    ).join('\n\n')
  },
})

const fetchUrl = tool({
  name: 'fetch_url',
  description: 'Fetch content from a URL and return the text. Use for documentation pages, blog posts, etc.',
  inputSchema: z.object({
    url: z.string().describe('URL to fetch'),
  }),
  callback: async (input) => {
    try {
      const res = await fetch(input.url, { headers: { 'User-Agent': 'strands-research-agent' } })
      if (!res.ok) return `Fetch error: ${res.status}`
      const text = await res.text()
      return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').slice(0, 8000)
    } catch (e) {
      return `Fetch failed: ${e instanceof Error ? e.message : String(e)}`
    }
  },
})

// ── Researcher sub-agents ───────────────────────────────────────────────────

const modelId = process.argv.find((_, i) => process.argv[i - 1] === '--model')
const model = new BedrockModel({ ...(modelId && { modelId }), region: 'us-east-1' })

function createResearchers() {
  const githubResearcher = new Agent({
    model,
    name: 'github_researcher',
    description: 'Searches GitHub for relevant repositories, frameworks, and open-source projects. Returns a structured summary of findings with links.',
    tools: [searchGitHub],
    systemPrompt:
      'You are a GitHub research specialist. Given a topic, search GitHub for the most relevant ' +
      'repositories, frameworks, and projects. Make 2-3 searches with different query variations. ' +
      'Produce a structured summary with:\n' +
      '- Key repositories (name, stars, what it does)\n' +
      '- Notable patterns across repos\n' +
      '- Links to the most important repos\n' +
      'Keep your summary under 600 words.',
    printer: false,
  })

  const arxivResearcher = new Agent({
    model,
    name: 'arxiv_researcher',
    description: 'Searches ArXiv for recent academic papers and research. Returns a structured summary of key papers and their contributions.',
    tools: [searchArxiv],
    systemPrompt:
      'You are an academic research specialist. Given a topic, search ArXiv for recent papers. ' +
      'Try 2-3 query variations. Produce a structured summary with:\n' +
      '- Key papers (title, date, main contribution)\n' +
      '- Common themes across the literature\n' +
      '- Links to the most important papers\n' +
      'Keep your summary under 600 words.',
    printer: false,
  })

  const hnResearcher = new Agent({
    model,
    name: 'hackernews_researcher',
    description: 'Searches HackerNews for community discussions, opinions, and real-world experiences. Returns a structured summary of community sentiment.',
    tools: [searchHackerNews],
    systemPrompt:
      'You are a community research specialist focused on HackerNews. Given a topic, search HN ' +
      'for relevant discussions. Produce a structured summary with:\n' +
      '- Top discussions (title, engagement, key takeaway)\n' +
      '- Community sentiment\n' +
      '- Real-world experiences shared by practitioners\n' +
      'Keep your summary under 600 words.',
    printer: false,
  })

  const docsResearcher = new Agent({
    model,
    name: 'docs_researcher',
    description: 'Fetches and analyzes documentation from framework and project websites. Returns a structured summary of how different frameworks approach the topic.',
    tools: [fetchUrl],
    systemPrompt:
      'You are a documentation research specialist. Given a topic, fetch documentation from ' +
      '2-3 relevant framework websites to understand how different projects approach it. ' +
      'Produce a structured summary with:\n' +
      '- How each framework handles the topic\n' +
      '- API patterns and design choices\n' +
      '- Commonalities and differences\n' +
      'Keep your summary under 600 words.',
    printer: false,
  })

  return [githubResearcher, arxivResearcher, hnResearcher, docsResearcher]
}

// ── Common coordinator prompt ───────────────────────────────────────────────

const coordinatorPrompt =
  'You are a senior technology analyst producing research briefings.\n\n' +
  'You have 4 researcher agents:\n' +
  '- github_researcher: finds relevant open-source projects\n' +
  '- arxiv_researcher: finds recent academic papers\n' +
  '- hackernews_researcher: finds community discussions\n' +
  '- docs_researcher: analyzes framework documentation\n\n' +
  'WORKFLOW:\n' +
  '1. Dispatch ALL 4 researchers with appropriate queries for the topic.\n' +
  '2. Synthesize results into a structured briefing.\n\n' +
  'BRIEFING FORMAT:\n' +
  '## Executive Summary\n' +
  '2-3 sentences.\n\n' +
  '## Key Developments\n' +
  'Most important findings with source links.\n\n' +
  '## Open Source Landscape\n' +
  'Major projects from GitHub.\n\n' +
  '## Academic Research\n' +
  'Notable papers from ArXiv.\n\n' +
  '## Community Sentiment\n' +
  'What practitioners say, from HN.\n\n' +
  '## Emerging Patterns\n' +
  'Cross-cutting themes.\n\n' +
  '## Open Problems & Gaps\n' +
  'What is underexplored.\n\n' +
  '## Recommended Reading\n' +
  'Top 5-8 links.\n\n' +
  'Cite specific projects, papers, and discussions by name with links. Keep the briefing under 1500 words.'

// ── Run ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2).filter((a, i, arr) => a !== '--model' && arr[i - 1] !== '--model')
const topic = args[0] || 'background task scheduling in AI agent frameworks'

console.log('\n' + '='.repeat(70))
console.log('  RESEARCH BRIEFING GENERATOR — Standard vs Background')
console.log('='.repeat(70))
console.log(`  Topic: ${topic}`)
console.log(`  Researchers: 4 (GitHub, ArXiv, HackerNews, Docs)`)
console.log('='.repeat(70))

// ── Standard run ────────────────────────────────────────────────────────────

console.log('\n--- STANDARD MODE (sequential) ---\n')

const standardCoordinator = new Agent({
  model,
  systemPrompt: coordinatorPrompt,
  tools: createResearchers(),
  printer: false,
})

const stdStart = Date.now()

standardCoordinator.addHook(BeforeToolCallEvent, (e) => {
  if (e.toolUse.name !== 'strands_structured_output')
    console.log(`  [+${((Date.now() - stdStart) / 1000).toFixed(1)}s] ${e.toolUse.name} started`)
})
standardCoordinator.addHook(AfterToolCallEvent, (e) => {
  if (e.toolUse.name !== 'strands_structured_output')
    console.log(`  [+${((Date.now() - stdStart) / 1000).toFixed(1)}s] ${e.toolUse.name} finished`)
})

const standardResult = await standardCoordinator.invoke(
  `Produce a comprehensive research briefing on: ${topic}`
)
const standardMs = Date.now() - stdStart

console.log(`\n  Standard: ${(standardMs / 1000).toFixed(1)}s | Tokens: ${standardResult.metrics?.accumulatedUsage?.outputTokens ?? 'N/A'}`)

// ── Background run ──────────────────────────────────────────────────────────

console.log('\n--- BACKGROUND MODE (parallel dispatch) ---\n')

const backgroundCoordinator = new Agent({
  model,
  systemPrompt: coordinatorPrompt,
  backgroundTools: createResearchers(),
  printer: false,
})

const bgStart = Date.now()

backgroundCoordinator.addHook(BackgroundTaskDispatchEvent, (e) => {
  console.log(`  [+${((Date.now() - bgStart) / 1000).toFixed(1)}s] ${e.toolUse.name} dispatched (bg)`)
})
backgroundCoordinator.addHook(BackgroundTaskResultEvent, (e) => {
  console.log(`  [+${((Date.now() - bgStart) / 1000).toFixed(1)}s] ${e.taskName} result arrived (bg)`)
})

const backgroundResult = await backgroundCoordinator.invoke(
  `Produce a comprehensive research briefing on: ${topic}`
)
const backgroundMs = Date.now() - bgStart

console.log(`\n  Background: ${(backgroundMs / 1000).toFixed(1)}s | Tokens: ${backgroundResult.metrics?.accumulatedUsage?.outputTokens ?? 'N/A'}`)

// ── Results ─────────────────────────────────────────────────────────────────

const speedup = standardMs / backgroundMs

const stdUsage = standardResult.metrics?.accumulatedUsage
const bgUsage = backgroundResult.metrics?.accumulatedUsage

console.log('\n--- STANDARD BRIEFING OUTPUT ---\n')
console.log(standardResult.toString())
console.log('\n--- BACKGROUND BRIEFING OUTPUT ---\n')
console.log(backgroundResult.toString())

const pad = (s: string, n: number) => s.padEnd(n)

console.log('\n' + '='.repeat(70))
console.log('  RESULTS')
console.log('='.repeat(70))
console.log()
console.log(`  ${pad('Metric', 24)} ${pad('Standard', 16)} Background`)
console.log(`  ${'-'.repeat(24)} ${'-'.repeat(16)} ${'-'.repeat(16)}`)
console.log(`  ${pad('Wall clock', 24)} ${pad((standardMs / 1000).toFixed(1) + 's', 16)} ${(backgroundMs / 1000).toFixed(1)}s`)
console.log(`  ${pad('Speedup', 24)} ${pad('baseline', 16)} ${speedup.toFixed(2)}x`)
console.log(`  ${pad('Input tokens', 24)} ${pad(String(stdUsage?.inputTokens ?? 'N/A'), 16)} ${bgUsage?.inputTokens ?? 'N/A'}`)
console.log(`  ${pad('Output tokens', 24)} ${pad(String(stdUsage?.outputTokens ?? 'N/A'), 16)} ${bgUsage?.outputTokens ?? 'N/A'}`)
console.log(`  ${pad('Total tokens', 24)} ${pad(String(stdUsage?.totalTokens ?? 'N/A'), 16)} ${bgUsage?.totalTokens ?? 'N/A'}`)
console.log(`  ${pad('Agent cycles', 24)} ${pad(String(standardResult.metrics?.cycleCount ?? 'N/A'), 16)} ${backgroundResult.metrics?.cycleCount ?? 'N/A'}`)
console.log(`  ${pad('Output length (chars)', 24)} ${pad(String(standardResult.toString().length), 16)} ${backgroundResult.toString().length}`)
console.log()
console.log('='.repeat(70))
