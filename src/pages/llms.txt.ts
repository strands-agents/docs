import type { APIRoute } from 'astro'
import type { CollectionEntry } from 'astro:content'
import { getCollection, getEntry } from 'astro:content'
import { getBase } from '@util/links'
import { loadSidebarFromMkdocs, type StarlightSidebarItem } from '../sidebar'
import { renderEntryToMarkdown } from '@util/render-to-markdown'
import path from 'node:path'

// Sections to pull from sidebar (with their nav labels)
const SIDEBAR_SECTIONS = ['User Guide', 'Examples', 'Community']

/**
 * Recursively extract links from sidebar items
 */
function extractLinks(
  items: StarlightSidebarItem[],
  base: string,
  depth: number = 0
): string[] {
  const lines: string[] = []
  const indent = '  '.repeat(depth)

  for (const item of items) {
    if ('slug' in item && item.slug) {
      // Internal link
      const url = `${base}/${item.slug}/index.md`
      const label = item.label || item.slug.split('/').pop() || item.slug
      lines.push(`${indent}- [${label}](${url})`)
    } else if ('link' in item && item.link) {
      // External link - skip or include as-is
      if (!item.link.startsWith('http')) {
        lines.push(`${indent}- [${item.label}](${item.link})`)
      }
    } else if ('items' in item && item.items) {
      // Group - add label and recurse
      lines.push(`${indent}- ${item.label}`)
      lines.push(...extractLinks(item.items, base, depth + 1))
    }
  }

  return lines
}

function buildLlmsTxt(docs: CollectionEntry<'docs'>[], sidebar: StarlightSidebarItem[], header: string): string {
  const base = getBase()
  const lines: string[] = []

  // Header from rendered llms.mdx
  lines.push('# Strands Agents')
  lines.push('')
  lines.push(header.trim())
  lines.push('')

  // Process sidebar sections (User Guide, Examples, Community)
  for (const sectionName of SIDEBAR_SECTIONS) {
    const section = sidebar.find(
      (item) => 'label' in item && item.label === sectionName
    )

    if (section && 'items' in section) {
      lines.push(`## ${sectionName}`)
      lines.push('')
      lines.push(...extractLinks(section.items, base, 0))
      lines.push('')
    }
  }

  // API sections - group by python/typescript
  const apiDocs = docs.filter((doc) => doc.id.startsWith('api/'))
  const pythonApi = apiDocs.filter((doc) => doc.id.startsWith('api/python/'))
  const typescriptApi = apiDocs.filter((doc) => doc.id.startsWith('api/typescript/'))

  if (pythonApi.length > 0) {
    lines.push(`## Api Python`)
    lines.push('')
    for (const doc of pythonApi) {
      const url = `${base}/${doc.id}/index.md`
      const title = doc.data.title || doc.id
      lines.push(`- [${title}](${url})`)
    }
    lines.push('')
  }

  if (typescriptApi.length > 0) {
    lines.push(`## Api TypeScript`)
    lines.push('')
    for (const doc of typescriptApi) {
      const url = `${base}/${doc.id}/index.md`
      const title = doc.data.title || doc.id
      lines.push(`- [${title}](${url})`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

export const GET: APIRoute = async () => {
  const docs = await getCollection('docs')
  const sidebar = loadSidebarFromMkdocs(
    path.resolve('./mkdocs.yml'),
    path.resolve('./src/content/docs')
  )

  // Render the llms.mdx page as the header
  const llmsEntry = await getEntry('docs', 'llms')
  if (!llmsEntry) {
    throw new Error(`llms.mdx not found`)
  }
  const { markdown: header }  = await renderEntryToMarkdown(llmsEntry)

  const content = buildLlmsTxt(docs, sidebar, header)

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
