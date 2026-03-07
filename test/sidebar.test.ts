import { describe, it, expect } from 'vitest'
import path from 'node:path'
import { loadSidebarFromMkdocs, convertNavItem, mdPathToSlug, type StarlightSidebarItem } from '../src/sidebar'

const pathToMkdocsYaml = path.resolve('./mkdocs.yml')

describe('Sidebar Generation', () => {
  it('should generate sidebar structure from mkdocs.yml', () => {
    const sidebar = loadSidebarFromMkdocs(pathToMkdocsYaml)

    console.log('\n=== Generated Sidebar Structure ===\n')
    console.log(JSON.stringify(sidebar, null, 2))

    expect(sidebar).toBeDefined()
    expect(Array.isArray(sidebar)).toBe(true)
    expect(sidebar.length).toBeGreaterThan(0)
  })

  it('should convert README.md to index slug', () => {
    expect(mdPathToSlug('README.md')).toBe('docs/index')
    expect(mdPathToSlug('examples/README.md')).toBe('docs/examples')
  })

  it('should strip .md extension and handle index files', () => {
    expect(mdPathToSlug('user-guide/quickstart/overview.md')).toBe('docs/user-guide/quickstart/overview')
    expect(mdPathToSlug('user-guide/concepts/tools/index.md')).toBe('docs/user-guide/concepts/tools')
  })

  it('should handle external links', () => {
    const item = convertNavItem({ 'Contribute ❤️': 'https://github.com/example' })
    expect(item).toEqual({
      label: 'Contribute ❤️',
      link: 'https://github.com/example',
      attrs: { target: '_blank' },
    })
  })

  it('should handle nested items', () => {
    const item = convertNavItem({
      Quickstart: [{ 'Getting Started': 'overview.md' }, { Python: 'python.md' }],
    })
    expect(item).toEqual({
      label: 'Quickstart',
      items: [{ slug: 'docs/overview', label: 'Getting Started' }, { slug: 'docs/python', label: 'Python' }],
    })
  })

  it('should include mkdocs nav labels for internal links', () => {
    // Labels from mkdocs.yml nav are preserved so the sidebar shows
    // task-oriented labels (e.g., "Voice & Realtime") instead of page titles
    const sidebar = loadSidebarFromMkdocs(pathToMkdocsYaml)

    // Find a leaf item (internal link) and verify it has both slug and label
    function findLeafItem(items: StarlightSidebarItem[]): StarlightSidebarItem | null {
      for (const item of items) {
        if ('slug' in item && !('items' in item)) {
          return item
        }
        if ('items' in item) {
          const found = findLeafItem(item.items as StarlightSidebarItem[])
          if (found) return found
        }
      }
      return null
    }

    const leafItem = findLeafItem(sidebar)
    expect(leafItem).toBeDefined()
    expect(leafItem).toHaveProperty('slug')
    expect(leafItem).toHaveProperty('label')
  })
})

describe('getCommunityLabeledFiles', () => {
  it('should extract files with <sup> community</sup> in nav label', async () => {
    const { getCommunityLabeledFiles } = await import('../src/sidebar')
    const communityFiles = getCommunityLabeledFiles(path.resolve('mkdocs.yml'))

    console.log('\n=== Community Labeled Files ===\n')
    console.log([...communityFiles])

    expect(communityFiles).toBeDefined()
    expect(communityFiles instanceof Set).toBe(true)

    // Should find the community-labeled model providers
    expect(communityFiles.has('user-guide/concepts/model-providers/cohere.md')).toBe(true)
    expect(communityFiles.has('user-guide/concepts/model-providers/clova-studio.md')).toBe(true)
    expect(communityFiles.has('user-guide/concepts/model-providers/fireworksai.md')).toBe(true)
    expect(communityFiles.has('user-guide/concepts/model-providers/nebius-token-factory.md')).toBe(true)

    // Should NOT include non-community files
    expect(communityFiles.has('user-guide/concepts/model-providers/openai.md')).toBe(false)
  })
})
