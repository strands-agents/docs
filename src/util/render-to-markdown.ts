import type { CollectionEntry } from 'astro:content'
import { render } from 'astro:content'
import { experimental_AstroContainer } from 'astro/container'
import { loadRenderers } from 'astro:container'
import { getContainerRenderer } from '@astrojs/mdx'
import { htmlToMarkdown } from './html-to-markdown'
import { pathWithBase } from './links'

/**
 * Renders a content collection entry to markdown.
 * Handles MDX rendering, HTML conversion, and link rewriting.
 *
 * @param entry - The collection entry to render
 * @param basePath - URL prefix for the entry (default: `/${entry.id}/`)
 * @returns The rendered markdown and HTML strings
 */
export async function renderEntryToMarkdown(
  entry: CollectionEntry<'docs'> | CollectionEntry<'blog'>,
  basePath?: string,
): Promise<{ markdown: string, html: string }> {
  const data = await render(entry)
  const { Content } = data

  const renderers = await loadRenderers([getContainerRenderer()])
  const container = await experimental_AstroContainer.create({ renderers })

  // Pass the request with the correct URL path so relative links resolve properly
  const urlPath = basePath ?? `/${entry.id}/`
  const pageUrl = new URL(pathWithBase(urlPath), 'https://localhost')
  const html = await container.renderToString(Content, {
    request: new Request(pageUrl),
  })

  return { markdown: htmlToMarkdown(html), html: html }
}
