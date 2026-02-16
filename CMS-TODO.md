# CMS Migration TODO

## Before launch:
- [ ] Remove Vite SSR workaround for zod in `astro.config.mjs` once CMS build is separated from TS verification (see https://github.com/withastro/astro/issues/14117)
- [X] Fix relative links to pages (e.g., `../some-page.md` style links need to be converted to Starlight-compatible paths)
- [X] Add API documentation generation/integration for Python and TypeScript SDKs
- [ ] Fix type-checking
- [ ] Look into markdown 
- [ ] Add header links to Python/TypeScript method sections (api/python/strands.agent.agent/)

## After Launch
- [ ] Move asset files to proper location (currently in `docs/assets/`, should be in `src/content/docs/assets/`)
- [ ] Migrate sidebar from mkdocs.yml to something astro specific (and combine with the navbar?)
- [ ] Remove symlink at `src/content/docs` → `../../docs` and move content to actual location
- [ ] Inline TypeScript code examples directly in markdown and verify via separate type-checking step (e.g., `tsc` on extracted code blocks) instead of snippet includes
- [ ] Update astro-auto-import once https://github.com/delucis/astro-auto-import/pull/110 is merged
