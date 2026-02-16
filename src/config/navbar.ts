/**
 * Navigation bar links configuration.
 *
 * Add, remove, or reorder links here to customize the header navigation tabs.
 * These appear as tabs below the main header on desktop viewports.
 */

export interface NavLink {
  /** Display label for the link */
  label: string
  /** URL path or full URL for external links */
  href: string
  /**
   * Base path used to determine active state (optional).
   * If not provided, href is used. Useful when href points to a nested page
   * but you want the tab to be active for the entire section.
   * Example: href="/user-guide/quickstart/" but basePath="/user-guide/"
   */
  basePath?: string
  /** Set to true for external links (opens in new tab) */
  external?: boolean
}

/**
 * Get the configured base path, normalized to have leading slash and no trailing slash.
 * Returns empty string if base is root '/'.
 */
function getBasePath(): string {
  const base = import.meta.env.BASE_URL || '/'
  const normalized = base.replace(/\/$/, '')
  return normalized === '' ? '' : normalized
}

/**
 * Prepend base path to a path string.
 */
function withBase(path: string): string {
  const base = getBasePath()
  if (!base) return path
  return base + path
}

/**
 * Transform nav links to include the base path in href and basePath.
 * External links are left unchanged.
 */
function transformNavLinks(links: NavLink[]): NavLink[] {
  return links.map((link): NavLink => {
    if (link.external) return link
    return {
      ...link,
      href: withBase(link.href),
      ...(link.basePath ? { basePath: withBase(link.basePath) } : {}),
    }
  })
}

/**
 * Raw navigation links (without base path).
 * Order here determines display order.
 */
const rawNavLinks: NavLink[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'User Guide',
    href: '/user-guide/quickstart/overview/',
    basePath: '/user-guide/',
  },
  {
    label: 'Examples',
    href: '/examples/',
    basePath: '/examples/',
  },
  {
    label: 'Community',
    href: '/community/community-packages/',
    basePath: '/community/',
  },
  {
    label: 'Contribute ❤️',
    href: 'https://github.com/strands-agents/sdk-python/blob/main/CONTRIBUTING.md',
    external: true,
  },
  {
    label: 'Python API',
    href: '/api/python/',
    basePath: '/api/python/',
  },
  {
    label: 'TypeScript API',
    href: '/api/typescript/',
    basePath: '/api/typescript/',
  },
]

/**
 * Navigation links with base path applied.
 * Use this for rendering and comparisons.
 */
export const navLinks: NavLink[] = transformNavLinks(rawNavLinks)
