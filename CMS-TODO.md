# CMS Migration TODO

## After Launch
- [ ] Remove Vite SSR workaround for zod in `astro.config.mjs` once CMS build is separated from TS verification (see https://github.com/withastro/astro/issues/14117)
- [ ] Remove `<name>Data` special-case in `scripts/api-generation-typescript.ts` once typedoc fixes the prose or we find a better general solution
- [ ] Move asset files to proper location (currently in `docs/assets/`, should be in `src/content/docs/assets/`)
- [ ] Inline TypeScript code examples directly in markdown and verify via separate type-checking step (e.g., `tsc` on extracted code blocks) instead of snippet includes
- [ ] Update astro-auto-import once https://github.com/delucis/astro-auto-import/pull/110 is merged
