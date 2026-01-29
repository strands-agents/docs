# CMS Migration TODO

- [ ] Update content collection schema in `src/content.config.ts`
- [ ] Move asset files to proper location (currently in `docs/assets/`, should be in `src/content/docs/assets/`)
- [ ] Remove symlink at `src/content/docs` → `../../docs` and move content to actual location

- [ ] Inline TypeScript code examples directly in markdown and verify via separate type-checking step (e.g., `tsc` on extracted code blocks) instead of snippet includes
