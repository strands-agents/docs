import { defineRouteMiddleware, type StarlightRouteData } from '@astrojs/starlight/route-data'
import { getCollection } from 'astro:content'
import { buildPythonApiSidebar, buildTypeScriptApiSidebar, getPrevNextLinks, type DocInfo } from './dynamic-sidebar'
import { pathWithBase } from './util/links'
import { navLinks, type NavLink } from './config/navbar'

type SidebarEntry = StarlightRouteData['sidebar'][number]
type SidebarGroup = Extract<SidebarEntry, { type: 'group' }>

function isSidebarGroup(entry: SidebarEntry): entry is SidebarGroup {
  return entry.type === 'group'
}

/**
 * Find which nav section the current page belongs to based on URL path.
 * Matches the most specific basePath (longest match wins).
 */
export function findCurrentNavSection(currentPath: string, links: NavLink[]): NavLink | undefined {
  let bestMatch: NavLink | undefined
  let bestMatchLength = 0

  for (const link of links) {
    if (link.external) continue
    const basePath = link.basePath || link.href
    // Note: Home ("/") matches all paths but longest-match ensures specificity.
    // This provides implicit fallback behavior when no other nav section matches.
    if (currentPath.startsWith(basePath) && basePath.length > bestMatchLength) {
      bestMatch = link
      bestMatchLength = basePath.length
    }
  }

  return bestMatch
}

/**
 * Filter sidebar entries to only include items matching a base path.
 * If the result is a single top-level group, unwrap it to return just its entries.
 */
export function filterSidebarByBasePath(entries: SidebarEntry[], basePath: string): SidebarEntry[] {
  const filtered = entries
    .map((entry) => {
      if (entry.type === 'link') {
        return entry.href.startsWith(basePath) ? entry : null
      }
      if (entry.type === 'group') {
        const filteredEntries = filterSidebarByBasePath(entry.entries, basePath)
        return filteredEntries.length > 0 ? { ...entry, entries: filteredEntries } : null
      }
      return null
    })
    .filter((entry): entry is SidebarEntry => entry !== null)

  // If we have a single top-level group, unwrap it to show its entries directly
  const firstEntry = filtered[0]
  if (filtered.length === 1 && firstEntry && isSidebarGroup(firstEntry)) {
    return firstEntry.entries
  }

  return filtered
}

/**
 * Expand first-level groups (set collapsed to false)
 */
export function expandFirstLevelGroups(items: SidebarEntry[]): SidebarEntry[] {
  return items.map((item) => {
    if (item.type === 'group') {
      return { ...item, collapsed: false }
    }
    return item
  })
}

/**
 * Route middleware that filters the sidebar to only show items
 * matching the current nav section based on URL path.
 *
 * Uses the navbar config's basePath to determine which section
 * the current page belongs to, then filters sidebar to only show
 * items whose href starts with that basePath.
 */
/**
 * Build a map of href -> page title from the docs collection.
 * Used to override sidebar labels with actual page titles in prev/next navigation.
 */
async function buildTitlesByHref(): Promise<Map<string, string>> {
  const docs = await getCollection('docs')
  const map = new Map<string, string>()
  for (const doc of docs) {
    if (doc.data.title) {
      map.set(pathWithBase(`/${doc.id}/`), doc.data.title as string)
    }
  }
  return map
}

export const onRequest = defineRouteMiddleware(async (context) => {
  const { starlightRoute } = context.locals
  const { sidebar } = starlightRoute
  // Sidebar hrefs include base path, so use full URL pathname for comparison
  const currentPath = context.url.pathname
  const currentSlug = starlightRoute.id

  // Check if we're on a Python API page
  if (currentSlug.startsWith('api/python')) {
    const docs = await getCollection('docs')
    const docInfos: DocInfo[] = docs.map((doc: { id: string; data: { title: unknown } }) => ({
      id: doc.id,
      title: doc.data.title as string,
    }))

    const pythonSidebar = buildPythonApiSidebar(docInfos, currentSlug)

    // Add index link at the top
    pythonSidebar.unshift({
      type: 'link',
      label: 'Overview',
      href: pathWithBase('/api/python/'),
      isCurrent: currentSlug === 'api/python',
      badge: undefined,
      attrs: {},
    })

    const titlesByHref = await buildTitlesByHref()
    starlightRoute.sidebar = pythonSidebar
    starlightRoute.pagination = getPrevNextLinks(pythonSidebar, titlesByHref)
    return
  }

  // Check if we're on a TypeScript API page
  if (currentSlug.startsWith('api/typescript')) {
    const docs = await getCollection('docs')
    const docInfos: DocInfo[] = docs.map((doc: { id: string; data: { title: unknown; category?: unknown } }) => ({
      id: doc.id,
      title: doc.data.title as string,
      category: doc.data.category as string | undefined,
    }))

    const tsSidebar = buildTypeScriptApiSidebar(docInfos, currentSlug)

    // Add index link at the top
    tsSidebar.unshift({
      type: 'link',
      label: 'Overview',
      href: pathWithBase('/api/typescript/'),
      isCurrent: currentSlug === 'api/typescript',
      badge: undefined,
      attrs: {},
    })

    const titlesByHref = await buildTitlesByHref()
    starlightRoute.sidebar = tsSidebar
    starlightRoute.pagination = getPrevNextLinks(tsSidebar, titlesByHref)
    return
  }

  // Find which nav section the current page belongs to
  const currentNav = findCurrentNavSection(currentPath, navLinks)

  // If no matching nav section, show empty sidebar
  if (!currentNav || currentNav.label == "Home") {
    starlightRoute.sidebar = []
    return
  }

  // Otherwise filter it down to the major section that we're in
  const basePath = currentNav.basePath || currentNav.href
  const filteredSidebar = filterSidebarByBasePath(sidebar, basePath)
  const expandedSidebar = expandFirstLevelGroups(filteredSidebar)
  starlightRoute.sidebar = expandedSidebar

  // Starlight pre-computes pagination from the full sidebar before our middleware runs.
  // Prune any prev/next links that fall outside the current nav section, then override
  // labels with actual page titles instead of sidebar nav labels.
  const titlesByHref = await buildTitlesByHref()
  const { prev, next } = starlightRoute.pagination
  starlightRoute.pagination = {
    prev: prev?.href.startsWith(basePath) ? { ...prev, label: titlesByHref.get(prev.href) ?? prev.label } : undefined,
    next: next?.href.startsWith(basePath) ? { ...next, label: titlesByHref.get(next.href) ?? next.label } : undefined,
  }
})
