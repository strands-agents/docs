import { defineCollection } from 'astro:content';
import { docsLoader, } from '@astrojs/starlight/loaders';
import { z } from 'astro/zod'
// import { docsSchema } from '@astrojs/starlight/schema';

// CMS TEMP: Once we have titles as required fields, we can use the default field
const slimSchema = z.object({
  title: z.string().optional(),
  head: z.array(z.object({})).default([]),
  sidebar: z
    .object({
      hidden: z.boolean().default(false),
    })
    .default({}),
  /**
   * Indicates that this page is a draft and will not be included in production builds.
   * Note that the page will still be available when running Astro in development mode.
   */
  draft: z.boolean().default(false),
})

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: slimSchema}),
};


