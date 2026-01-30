// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import path from 'node:path'
import remarkMkdocsSnippets from './src/plugins/remark-mkdocs-snippets.ts'

// https://astro.build/config
export default defineConfig({
  site: 'https://strandsagents.com',
  vite: {
    // TODO once we separate out CMS build from TS verification, fix this
    // https://github.com/withastro/astro/issues/14117
		ssr: {
			noExternal: ['zod'],
		},
	},
  markdown: {
    remarkPlugins: [remarkMkdocsSnippets],
  },
  integrations: [starlight({
    title: 'Strands Agents SDK',
    description: 'A model-driven approach to building AI agents in just a few lines of code.',
    logo: {
      // TODO move once migration to CMS is complete
      light: './src/content/docs/assets/logo-light.svg',
      dark: './src/content/docs/assets/logo-dark.svg',
      replacesTitle: false,
    },
    social: [
      {
        icon: 'github',
        label: 'GitHub',
        href: 'https://github.com/strands-agents/sdk-python',
      },
    ],
    editLink: {
      baseUrl: 'https://github.com/strands-agents/docs/edit/main/docs',
    },
    components: {
      Head: './src/components/Head.astro',
    },
  })],
})