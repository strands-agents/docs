import { getViteConfig } from 'astro/config'
import { resolve } from 'node:path'

export default getViteConfig({
  test: {
    include: ['test/**/*.test.ts'],
    globalSetup: ['test/global-setup.ts'],
    alias: {
      'astro:content': resolve('./test/__mocks__/astro-content.ts'),
    },
  },
})
