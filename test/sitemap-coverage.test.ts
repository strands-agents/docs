import { describe, it, expect } from 'vitest'
import { getCollection } from 'astro:content'
import fs from 'node:fs'
import path from 'node:path'
import { resolveRedirectFromUrl } from '../src/util/redirect'

const KNOWN_ROUTES_PATH = path.resolve('test/known-routes.json')
const SITEMAP_URL = 'https://strandsagents.com/1.x/sitemap.xml'// Sitemap URLs look like: https://strandsagents.com/latest/documentation/docs/<path>/
// We extract the full URL for each entry and pass it through resolveRedirectFromUrl,
// which strips the domain, version prefix, and /documentation/ segment.
const SITEMAP_ENTRY = /^https:\/\/strandsagents\.com\/.+$/
const CACHE_PATH = path.resolve('.build/sitemap-cache.xml')
const CACHE_TTL_MS = 4 * 60 * 60 * 1000 // 4 hours

// Sitemap URLs under /documentation/docs/api-reference/ are excluded — API docs are
// regenerated from source and old module paths are not redirected.
const API_REFERENCE_URL = /\/documentation\/docs\/api-reference\//

/**
 * Fetch and parse all non-API doc URLs from the live sitemap, with a 4-hour file cache in .build/.
 * Returns full URLs (e.g. "https://strandsagents.com/1.x/documentation/docs/user-guide/quickstart/").
 */
async function fetchSitemapUrls(): Promise<string[]> {
  let xml: string

  const cacheValid =
    fs.existsSync(CACHE_PATH) && Date.now() - fs.statSync(CACHE_PATH).mtimeMs < CACHE_TTL_MS

  if (cacheValid) {
    xml = fs.readFileSync(CACHE_PATH, 'utf-8')
  } else {
    const res = await fetch(SITEMAP_URL)
    if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status} ${res.statusText}`)
    xml = await res.text()
    fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true })
    fs.writeFileSync(CACHE_PATH, xml, 'utf-8')
  }

  const urls: string[] = []
  for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const url = match[1].trim()
    if (SITEMAP_ENTRY.test(url) && !API_REFERENCE_URL.test(url)) {
      urls.push(url)
    }
  }

  return urls
}

describe('Sitemap Coverage', () => {
  it('every page in the live sitemap has a corresponding CMS entry (or a known redirect)', async () => {
    const [sitemapUrls, docs] = await Promise.all([fetchSitemapUrls(), getCollection('docs')])

    expect(sitemapUrls.length).toBeGreaterThan(0)

    const validIds = new Set(docs.map((doc) => doc.id))

    const missing: string[] = []
    const redirected: Array<{ from: string; to: string }> = []

    for (const url of sitemapUrls) {
      // resolveRedirectFromUrl strips domain, version prefix, and /documentation/ segment,
      // then applies any slug rename rules. The result is a CMS slug (e.g. "docs/user-guide/...").
      const resolved = resolveRedirectFromUrl(url)
      if (!resolved || resolved === '/') continue

      // External redirects (e.g. GitHub) are always valid — no CMS entry needed
      if (resolved.startsWith('https://') || resolved.startsWith('http://')) continue

      // Strip trailing slash to match content collection IDs
      const slug = resolved.replace(/\/$/, '')

      if (validIds.has(slug)) {
        // Check whether a redirect rule was applied (i.e. the raw path differs from resolved)
        const rawPath = url.replace(/^https?:\/\/[^/]+/, '').replace(/^\/+|\/+$/g, '')
        if (rawPath !== slug) {
          redirected.push({ from: rawPath, to: slug })
        }
        continue
      }

      missing.push(url)
    }

    if (redirected.length > 0) {
      console.log(`\n=== Slugs resolved via redirect (${redirected.length}) ===\n`)
      for (const { from, to } of redirected) {
        console.log(`  ${from}\n    -> ${to}`)
      }
    }

    if (missing.length > 0) {
      console.log(`\n=== Sitemap pages missing from CMS and no redirect (${missing.length}) ===\n`)
      for (const url of missing) {
        console.log(`- ${url}`)
      }
    }

    expect(missing).toEqual([])
  })

  // Redirect rule unit tests live in test/redirect.test.ts.
  // This test verifies that redirect targets actually exist in the CMS collection.
  it('redirect targets all resolve to valid CMS entries', async () => {
    const [sitemapUrls, docs] = await Promise.all([fetchSitemapUrls(), getCollection('docs')])
    const validIds = new Set(docs.map((doc) => doc.id))

    const brokenRedirects: Array<{ from: string; to: string }> = []
    for (const url of sitemapUrls) {
      const resolved = resolveRedirectFromUrl(url)
      if (!resolved || resolved === '/') continue

      // External redirects (e.g. GitHub) are always valid
      if (resolved.startsWith('https://') || resolved.startsWith('http://')) continue

      const slug = resolved.replace(/\/$/, '')
      if (!validIds.has(slug)) {
        brokenRedirects.push({ from: url, to: slug })
      }
    }

    if (brokenRedirects.length > 0) {
      console.log(`\n=== Redirect targets missing from CMS (${brokenRedirects.length}) ===\n`)
      for (const { from, to } of brokenRedirects) {
        console.log(`  ${from}\n    -> ${to} (NOT FOUND)`)
      }
    }

    expect(brokenRedirects).toEqual([])
  })
})

describe('Known Routes', () => {
  // test/known-routes.json is an append-only registry of paths that must always resolve.
  // Add new entries from the live sitemap with: npm run routes:update
  it('every known route resolves to a valid CMS entry', async () => {
    const knownRoutes: string[] = JSON.parse(fs.readFileSync(KNOWN_ROUTES_PATH, 'utf-8'))
    const docs = await getCollection('docs')
    const validIds = new Set(docs.map((doc) => doc.id))

    const broken: Array<{ url: string; resolved: string }> = []
    for (const routePath of knownRoutes) {
      const resolved = resolveRedirectFromUrl(`https://strandsagents.com${routePath}`)
      if (!resolved || resolved === '/') continue
      // External redirects (e.g. GitHub) are always valid
      if (resolved.startsWith('https://') || resolved.startsWith('http://')) continue
      const slug = resolved.replace(/\/$/, '')
      if (!validIds.has(slug)) broken.push({ url: routePath, resolved: slug })
    }

    if (broken.length > 0) {
      console.log(`\n=== Known routes no longer resolving (${broken.length}) ===\n`)
      for (const { url, resolved } of broken) {
        console.log(`  ${url}\n    -> ${resolved} (NOT FOUND)`)
      }
      console.log('\nIf these pages moved, add a redirect rule in src/util/redirect.ts.')
      console.log('To sync known-routes.json with the live sitemap, run: npm run routes:update')
    }

    expect(broken).toEqual([])
  })
})
