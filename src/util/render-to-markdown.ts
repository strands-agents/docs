import type { CollectionEntry } from 'astro:content'
import { render } from 'astro:content'
import { experimental_AstroContainer } from 'astro/container'
import { loadRenderers } from 'astro:container'
import { getContainerRenderer } from '@astrojs/mdx'
import { htmlToMarkdown } from './html-to-markdown'
import { pathWithBase } from './links'

/**
 * Renders a docs collection entry to markdown.
 * Handles MDX rendering, HTML conversion, and link rewriting.
 *
 * @param entry - The docs collection entry to render
 * @returns The rendered markdown string
 */
export async function renderEntryToMarkdown(entry: CollectionEntry<'docs'>): Promise<{ markdown: string, html: string }> {
  const data = await render(entry)
  const { Content } = data

  const renderers = await loadRenderers([getContainerRenderer()])
  const container = await experimental_AstroContainer.create({ renderers })

  // Pass the request with the correct URL path so relative links resolve properly
  const pageUrl = new URL(pathWithBase(`/${entry.id}/`), 'https://localhost')
  const html = await container.renderToString(Content, {
    request: new Request(pageUrl),
  })

  return { markdown: htmlToMarkdown(html), html: html }
}
