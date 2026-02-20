import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'

// Starlight sidebar item types
export type StarlightSidebarItem =
  | { slug: string; label?: string; attrs?: Record<string, string> } // Internal link
  | { label: string; link: string; attrs?: Record<string, string> } // External link
  | { label: string; items: StarlightSidebarItem[]; collapsed?: boolean } // Group

interface ConvertContext {
  contentDir: string
}

/**
 * Convert mkdocs md path to Starlight slug
 */
export function mdPathToSlug(mdPath: string): string {
  let slug = mdPath.replace(/\.md$/, '')

  // README.md -> index (or parent directory)
  if (slug === 'README') return 'index'
  if (slug.endsWith('/README')) return slug.replace(/\/README$/, '')

  // index.md -> parent directory
  if (slug.endsWith('/index')) return slug.replace(/\/index$/, '')

  return slug
}

/**
 * Check if a content file exists for a given slug
 */
function contentExists(slug: string, contentDir: string): boolean {
  if (!contentDir) return true

  const candidates = [
    path.join(contentDir, `${slug}.md`),
    path.join(contentDir, `${slug}.mdx`),
    path.join(contentDir, slug, 'index.md'),
    path.join(contentDir, slug, 'index.mdx'),
  ]

  return candidates.some((p) => fs.existsSync(p))
}

/**
 * Check if a directory has an index file
 */
function hasIndexFile(dirSlug: string, contentDir: string): boolean {
  if (!contentDir) return false

  const candidates = [path.join(contentDir, dirSlug, 'index.md'), path.join(contentDir, dirSlug, 'index.mdx')]

  return candidates.some((p) => fs.existsSync(p))
}

/**
 * Infer the common directory from a group's first item
 */
function inferGroupDir(items: StarlightSidebarItem[]): string | null {
  for (const item of items) {
    if ('slug' in item && item.slug) {
      const parts = item.slug.split('/')
      if (parts.length > 1) {
        return parts.slice(0, -1).join('/')
      }
    }
  }
  return null
}

/**
 * Strip HTML tags from label (e.g., <sup> community</sup>)
 */
function cleanLabel(label: string): string {
  return label.replace(/<[^>]+>/g, '').trim()
}

/**
 * Convert a single mkdocs nav item to Starlight format
 */
export function convertNavItem(item: unknown, ctx: ConvertContext = { contentDir: '' }): StarlightSidebarItem | null {
  // String: bare path like "path.md"
  if (typeof item === 'string') {
    const slug = mdPathToSlug(item)
    if (!contentExists(slug, ctx.contentDir)) return null
    return { slug }
  }

  // Object: { "Label": value }
  if (typeof item === 'object' && item !== null) {
    const entries = Object.entries(item)
    const first = entries[0]
    if (!first) return null

    const [rawLabel, value] = first
    const label = cleanLabel(rawLabel)

    // External link
    if (typeof value === 'string' && value.startsWith('http')) {
      return { label, link: value, attrs: { target: '_blank' } }
    }

    // Empty array (placeholder)
    if (Array.isArray(value) && value.length === 0) {
      return null
    }

    // Single file: { "Label": "path.md" }
    if (typeof value === 'string') {
      const slug = mdPathToSlug(value)
      if (!contentExists(slug, ctx.contentDir)) return null
      return { slug }
    }

    // Nested group: { "Label": [...] }
    if (Array.isArray(value)) {
      const children = value
        .map((child) => convertNavItem(child, ctx))
        .filter((c): c is StarlightSidebarItem => c !== null)

      if (children.length === 0) return null

      
      return { label, items: children }
    }
  }

  return null
}

/**
 * Apply collapse behavior to nested groups (depth >= 1)
 */
function applyCollapse(items: StarlightSidebarItem[], depth: number = 0): StarlightSidebarItem[] {
  return items.map((item) => {
    if ('items' in item) {
      const collapsed = depth >= 1
      return {
        ...item,
        items: applyCollapse(item.items, depth + 1),
        ...(collapsed && { collapsed }),
      }
    }
    return item
  })
}

/**
 * Load sidebar from mkdocs.yml
 */
export function loadSidebarFromMkdocs(mkdocsPath: string, docsContentDir?: string): StarlightSidebarItem[] {
  let content = fs.readFileSync(mkdocsPath, 'utf-8')

  // Strip Python-specific YAML tags
  content = content.replace(/!!python\/[^\s]+/g, '')

  const mkdocs = yaml.load(content) as { nav?: unknown[] }
  if (!mkdocs.nav) return []

  const ctx: ConvertContext = { contentDir: docsContentDir || '' }

  const items = mkdocs.nav
    .map((item) => convertNavItem(item, ctx))
    .filter((i): i is StarlightSidebarItem => i !== null)
    .filter((item) => !('link' in item && item.link?.endsWith('.html')))

  return applyCollapse(items)
}

/**
 * Extract files with <sup> community</sup> in their nav label
 */
export function getCommunityLabeledFiles(mkdocsPath: string): Set<string> {
  const communityFiles = new Set<string>()

  let content = fs.readFileSync(mkdocsPath, 'utf-8')
  content = content.replace(/!!python\/[^\s]+/g, '')

  const mkdocs = yaml.load(content) as { nav?: unknown[] }
  if (!mkdocs.nav) return communityFiles

  function search(items: unknown[]) {
    for (const item of items) {
      if (typeof item === 'object' && item !== null) {
        for (const [label, value] of Object.entries(item)) {
          if (/<sup>\s*community\s*<\/sup>/i.test(label)) {
            if (typeof value === 'string' && value.endsWith('.md')) {
              communityFiles.add(value)
            }
          }
          if (Array.isArray(value)) {
            search(value)
          }
        }
      }
    }
  }

  search(mkdocs.nav)
  return communityFiles
}
export interface SidebarInfo {
  label: string
  badge?: string
}

/**
 * Extract sidebar labels and badges for files in the nav
 * Returns a map of file path -> { label, badge? }
 * Badges are extracted from <sup> tags (e.g., <sup> new</sup> -> "new")
 */
export function getSidebarLabels(mkdocsPath: string): Map<string, SidebarInfo> {
  const sidebarLabels = new Map<string, SidebarInfo>()

  let content = fs.readFileSync(mkdocsPath, 'utf-8')
  content = content.replace(/!!python\/[^\s]+/g, '')

  const mkdocs = yaml.load(content) as { nav?: unknown[] }
  if (!mkdocs.nav) return sidebarLabels

  function search(items: unknown[]) {
    for (const item of items) {
      if (typeof item === 'object' && item !== null) {
        for (const [label, value] of Object.entries(item)) {
          // Only capture labels for files (not groups/directories)
          if (typeof value === 'string' && value.endsWith('.md')) {
            // Extract badge from <sup> tag if present
            const supMatch = label.match(/<sup>\s*(\w+)\s*<\/sup>/i)
            const badge = supMatch ? supMatch[1].toLowerCase() : undefined
            
            // Clean the label by removing <sup>...</sup> tags entirely (including content)
            // then remove any other HTML tags
            const cleanedLabel = label
              .replace(/<sup>[^<]*<\/sup>/gi, '')  // Remove <sup> tags and their content
              .replace(/<[^>]+>/g, '')              // Remove any other HTML tags
              .trim()
            sidebarLabels.set(value, { label: cleanedLabel, badge })
          }
          if (Array.isArray(value)) {
            search(value)
          }
        }
      }
    }
  }

  search(mkdocs.nav)
  return sidebarLabels
}


