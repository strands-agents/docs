/**
 * Compute "Related pages" for user-guide docs via tag overlap.
 *
 * Called from src/util/render-to-markdown.ts (markdown/llms surfaces) and
 * src/components/overrides/Head.astro (JSON-LD).
 *
 * Each candidate is scored by the count of tags it shares with the current
 * page (NOT by how many tags it has in total — a candidate with 8 unrelated
 * tags scores 0 and is excluded). The result is the top N candidates by
 * shared-tag count.
 *
 * Algorithm choices (deliberately simple — this output is LLM-facing):
 *   • Flat overlap score (count of shared tags). Predictable for authors: they
 *     can read two pages' frontmatter and guess the result. TF-IDF / rarity
 *     weighting would add opacity for negligible gain on ~120 tagged pages.
 *   • Require ≥1 shared tag. Raising to ≥2 would starve many single-tag pages
 *     that legitimately bridge sections (e.g. a page tagged only [hooks]).
 *   • Alphabetical tie-break on title. Deterministic across rebuilds.
 *   • Cap at 10. This output goes to /<slug>/index.md and llms-full.txt — no
 *     UI budget to respect; 10 extra bullets is rounding-error tokens and
 *     lets LLMs self-filter from a wider recall set.
 */
import type { CollectionEntry } from 'astro:content'

export interface RelatedLink {
  slug: string
  title: string
  overlap: number
}

const MAX_RELATED = 10
const USER_GUIDE_PREFIX = 'docs/user-guide/'

function isUserGuide(entry: CollectionEntry<'docs'>): boolean {
  return entry.id.startsWith(USER_GUIDE_PREFIX)
}

export function relatedUserGuideFor(
  current: CollectionEntry<'docs'>,
  allDocs: readonly CollectionEntry<'docs'>[],
): RelatedLink[] {
  if (!isUserGuide(current)) return []
  // `?? []` guards non-docs Starlight routes (blog, StarlightPage) that flow
  // through the same components but whose synthetic entry.data lacks `tags`.
  const currentTags = current.data.tags ?? []
  if (currentTags.length === 0) return []
  const tagSet = new Set<string>(currentTags)

  return allDocs
    .filter((d) => d.id !== current.id && isUserGuide(d) && (d.data.tags ?? []).length > 0)
    .map((d) => ({
      doc: d,
      overlap: (d.data.tags ?? []).reduce((n, t) => n + (tagSet.has(t) ? 1 : 0), 0),
    }))
    .filter((s) => s.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || a.doc.data.title.localeCompare(b.doc.data.title))
    .slice(0, MAX_RELATED)
    .map(({ doc, overlap }) => ({ slug: doc.id, title: doc.data.title, overlap }))
}
