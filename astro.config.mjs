// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import path from 'node:path'
import remarkMkdocsSnippets from './src/plugins/remark-mkdocs-snippets.ts'

import { loadSidebarFromMkdocs } from "./src/sidebar.ts"
import AutoImport from './src/plugins/astro-auto-import.ts'
import astroExpressiveCode from "astro-expressive-code"
import mdx from '@astrojs/mdx';

// Generate sidebar from mkdocs nav (validates against existing content files)
// Top-level groups will be rendered as tabs by the custom Sidebar component
const sidebar = loadSidebarFromMkdocs(
  path.resolve('./mkdocs.yml'),
  path.resolve('./src/content/docs')
)

// https://astro.build/config
export default defineConfig({
  site: 'https://strandsagents.com',
  base: process.env.ASTRO_BASE_PATH || '/',
  trailingSlash: 'always',
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
  integrations: [
    astroExpressiveCode({
      // Use themes that complement the Strands color scheme
      themes: ['github-light', 'github-dark'],
      styleOverrides: {
        // Match the accent color from the site theme
        frames: {
          shadowColor: 'transparent',
        },
      },
    }),
    mdx(),
    starlight({
    title: 'Strands Agents SDK',
    description: 'A model-driven approach to building AI agents in just a few lines of code.',
    sidebar: sidebar,
    routeMiddleware: './src/route-middleware.ts',
    customCss: [
      './src/styles/custom.css',
    ],
    logo: {
      light: './src/assets/logo-light.svg',
      dark: './src/assets/logo-dark.svg',
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
      Head: './src/components/overrides/Head.astro',
      Header: './src/components/overrides/Header.astro',
      MarkdownContent: './src/components/overrides/MarkdownContent.astro',
      Sidebar: './src/components/overrides/Sidebar.astro',
    },
  }),
  AutoImport({
      imports: [
        {
          '@astrojs/starlight/components': [
            ['TabItem', 'Tab']
          ],
          './src/components/AutoSyncTabs.astro': [
            ['default', "Tabs"]
          ]
        },
      ],
      defaultComponents: {
        // override 'a' links so that we can use relative urls
        a: './src/components/PageLink.astro'
      }
    })
  ],
})