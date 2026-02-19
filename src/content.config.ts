import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { docsSchema } from '@astrojs/starlight/schema'
// github-slugger is used by Astro internally for default slug generation.
// We use it here to maintain parity with Astro's default behavior while adding a docs/ prefix.
import { slug as githubSlug } from 'github-slugger'
import { glob } from 'astro/loaders'
import { normalizePathToSlug } from './util/links'

const testimonialSchema = z.object({
  quote: z.string(),
  name: z.string(),
  title: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().default(0),
})

const testimonialsBase = import.meta.env.TESTIMONIALS_PATH || 'src/content/testimonials'

export const collections = {
  testimonials: defineCollection({
    loader: glob({
      base: testimonialsBase,
      pattern: '**/*.json',
    }),
    schema: testimonialSchema,
  }),
  docs: defineCollection({
    loader: glob({
      base: "src/content/docs",
      // We explicitly declare the folders we want to include, as otherwise it includes index.md files
      // in examples which are not intended to be rendered on the site.
      // Long-term we'll be moving examples into the sdk-python repository instead, solving this problem.
      pattern: [
        "README.mdx",
        "llms.mdx",
        "user-guide/**/*.mdx",
        "community/**/*.mdx",
        "examples/**/[!index]*.mdx",
        "api/python/**/*.mdx",
        "api/typescript/**/*.(md|mdx)",
      ],
      generateId: generateDocsId,
    }),
    schema: docsSchema({
      // We have certain flags/behavior based on the following properties; see CMS-README.md for more info
      extend: z.object({
        // Can be a single value or an array of supported values
        languages: z.union([z.string(), z.array(z.string())]).optional(),
        community: z.boolean().default(false),
        experimental: z.boolean().default(false),
        // Category for TypeScript API docs (classes, interfaces, type-aliases, functions)
        category: z.string().optional(),
      }),
    }),
  }),
}

/**
 * Custom generateId function for docs content collection.
 * This mimics Astro's default slug generation (see node_modules/astro/dist/content/loaders/glob.js)
 * but uses our shared normalizePathToSlug utility for consistency with link resolution.
 */
function generateDocsId({ entry, data }: { entry: string; data: Record<string, unknown> }): string {
  // If frontmatter has a slug, use it directly
  if (data.slug) {
    return `${data.slug}`
  }

  // Normalize the entry path and slugify each segment using github-slugger (same as Astro default)
  const normalized = normalizePathToSlug(entry)
  
  // Handle root README/index -> use 'index' as the slug (Starlight convention for homepage)
  if (!normalized) {
    return 'index'
  }
  
  const slug = normalized
    .split('/')
    .map((segment) => githubSlug(segment))
    .join('/')

  return slug
}