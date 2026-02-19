import type { APIRoute } from 'astro'
import { getCollection, getEntry } from 'astro:content'
import { renderEntryToMarkdown } from '@util/render-to-markdown'
import { getBase } from '@util/links'

export const GET: APIRoute = async () => {
  const allDocs = await getCollection('docs')
  // Exclude API documentation and the llms page itself from full content
  const docs = allDocs.filter((doc) => !doc.id.startsWith('api/') && doc.id !== 'llms')
  const base = getBase()
  const lines: string[] = []

  // Render the llms.mdx page as the header
  const llmsEntry = await getEntry('docs', 'llms')
  if (llmsEntry) {
    const { markdown: header } = await renderEntryToMarkdown(llmsEntry)
    lines.push('# Strands Agents')
    lines.push('')
    lines.push(header.trim())
    lines.push('')
  }

  // Render each doc's full content
  for (const doc of docs) {
    const title = doc.data.title || doc.id
    lines.push(`## ${title}`)
    lines.push('')

    const { markdown } = await renderEntryToMarkdown(doc)
    lines.push(markdown.trim())

    lines.push('')
    lines.push(`Source: ${base}/${doc.id}/index.md`)
    lines.push('')
    lines.push('---')
    lines.push('')
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
