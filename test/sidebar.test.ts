import { describe, it, expect } from 'vitest'
import path from 'node:path'
import {
  loadSidebarFromConfig,
  loadNavigationConfig,
  loadNavbarFromConfig,
  loadGitHubSectionsFromConfig,
  type StarlightSidebarItem,
} from '../src/sidebar'

const pathToNavigationYml = path.resolve('./src/config/navigation.yml')

describe('Sidebar Generation from navigation.yml', () => {
  it('should generate sidebar structure from navigation.yml', () => {
    const sidebar = loadSidebarFromConfig(pathToNavigationYml)

    console.log('\n=== Generated Sidebar Structure ===\n')
    console.log(JSON.stringify(sidebar, null, 2))

    expect(sidebar).toBeDefined()
    expect(Array.isArray(sidebar)).toBe(true)
    expect(sidebar.length).toBeGreaterThan(0)
  })

  it('should load navigation config with all sections', () => {
    const config = loadNavigationConfig(pathToNavigationYml)

    expect(config).toBeDefined()
    expect(config.navbar).toBeDefined()
    expect(Array.isArray(config.navbar)).toBe(true)
    expect(config.sidebar).toBeDefined()
    expect(Array.isArray(config.sidebar)).toBe(true)
    expect(config.github).toBeDefined()
    expect(config.github.sections).toBeDefined()
  })

  it('should load navbar links', () => {
    const navbar = loadNavbarFromConfig(pathToNavigationYml)

    expect(navbar).toBeDefined()
    expect(Array.isArray(navbar)).toBe(true)
    expect(navbar.length).toBeGreaterThan(0)

    // Check that navbar links have required properties
    const firstLink = navbar[0]
    expect(firstLink).toHaveProperty('label')
    expect(firstLink).toHaveProperty('href')
  })

  it('should load GitHub sections', () => {
    const sections = loadGitHubSectionsFromConfig(pathToNavigationYml)

    expect(sections).toBeDefined()
    expect(Array.isArray(sections)).toBe(true)
    expect(sections.length).toBeGreaterThan(0)

    // Check that sections have required structure
    const firstSection = sections[0]
    expect(firstSection).toHaveProperty('title')
    expect(firstSection).toHaveProperty('links')
    expect(Array.isArray(firstSection.links)).toBe(true)
  })

  it('should have correct top-level sidebar sections', () => {
    const sidebar = loadSidebarFromConfig(pathToNavigationYml)

    // Check that we have the expected top-level sections
    const topLevelLabels = sidebar
      .filter((item): item is StarlightSidebarItem & { label: string } => 'label' in item)
      .map((item) => item.label)

    expect(topLevelLabels).toContain('User Guide')
    expect(topLevelLabels).toContain('Examples')
    expect(topLevelLabels).toContain('Community')
    expect(topLevelLabels).toContain('Labs')
    expect(topLevelLabels).toContain('Contribute ❤️')
  })

  it('should have collapsed groups at depth >= 1', () => {
    const sidebar = loadSidebarFromConfig(pathToNavigationYml)

    // Find the User Guide section
    const userGuide = sidebar.find(
      (item): item is StarlightSidebarItem & { label: string; items: StarlightSidebarItem[] } =>
        'label' in item && item.label === 'User Guide'
    )

    expect(userGuide).toBeDefined()
    if (userGuide) {
      // Top level should not be collapsed
      expect(userGuide).not.toHaveProperty('collapsed')

      // Find a nested group (like "Quickstart")
      const quickstart = userGuide.items.find(
        (item): item is StarlightSidebarItem & { label: string } => 'label' in item && item.label === 'Quickstart'
      )

      // Nested groups should be collapsed
      expect(quickstart).toHaveProperty('collapsed', true)
    }
  })

  it('should have slugs without labels for file items', () => {
    const sidebar = loadSidebarFromConfig(pathToNavigationYml)

    // Find a leaf item (internal link) and verify it has slug but no label
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
    expect(leafItem).not.toHaveProperty('label')
  })

  it('should handle external links in sidebar', () => {
    const sidebar = loadSidebarFromConfig(pathToNavigationYml)

    // Find the Contribute section which has an external link
    const contribute = sidebar.find(
      (item): item is StarlightSidebarItem & { label: string } =>
        'label' in item && item.label === 'Contribute ❤️'
    )

    expect(contribute).toBeDefined()
    if (contribute && 'items' in contribute) {
      // Look for external links in the items
      const externalLink = (contribute.items as StarlightSidebarItem[]).find(
        (item): item is StarlightSidebarItem & { link: string } => 'link' in item && item.link?.startsWith('http')
      )

      // If there's an external link, it should have the right attributes
      if (externalLink) {
        expect(externalLink).toHaveProperty('attrs')
        expect(externalLink.attrs).toHaveProperty('target', '_blank')
      }
    }
  })
})
