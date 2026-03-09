import { describe, it, expect } from 'vitest'
import { getCollection } from 'astro:content'
import path from 'node:path'
import { loadSidebarFromConfig, type StarlightSidebarItem } from '../src/sidebar'

describe('Content Collections', () => {
  it('should list all doc contents', async () => {
    const docs = await getCollection('docs')

    console.log('\n=== All Docs ===\n')
    console.log(`Total: ${docs.length} documents\n`)

    for (const doc of docs) {
      console.log(`- ${doc.id}`)
      console.log(`  Title: ${doc.data.title}`)
      if (doc.data.languages) console.log(`  Languages: ${doc.data.languages}`)
      if (doc.data.community) console.log(`  Community: ${doc.data.community}`)
      if (doc.data.experimental) console.log(`  Experimental: ${doc.data.experimental}`)
    }

    expect(docs.length).toBeGreaterThan(0)
  })

  it('should have valid slugs for all sidebar items', async () => {
    const configPath = path.resolve('./src/config/navigation.yml')
    const docsDir = path.resolve('./docs')
    const sidebar = loadSidebarFromConfig(configPath, docsDir)
    const docs = await getCollection('docs')

    // Build a set of valid doc IDs
    const validIds = new Set(docs.map((doc) => doc.id))

    // Extract all slugs from the sidebar
    function extractSlugs(items: StarlightSidebarItem[]): string[] {
      const slugs: string[] = []
      for (const item of items) {
        if ('slug' in item && item.slug) {
          slugs.push(item.slug)
        }
        if ('items' in item) {
          slugs.push(...extractSlugs(item.items))
        }
      }
      return slugs
    }

    const slugs = extractSlugs(sidebar)

    const invalidSlugs: string[] = []
    for (const slug of slugs) {
      if (!validIds.has(slug)) {
        invalidSlugs.push(slug)
      }
    }

    if (invalidSlugs.length > 0) {
      console.log('\n=== Invalid Sidebar Slugs (no content entry found) ===\n')
      for (const slug of invalidSlugs) {
        console.log(`- ${slug}`)
      }
    }

    expect(invalidSlugs).toEqual([])
  })
})
