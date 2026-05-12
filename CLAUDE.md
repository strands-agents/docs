# Strands Agents Documentation

Documentation site for Strands Agents SDK (strandsagents.com). Built with Astro + Starlight.

## Key Files

- `CONTRIBUTING.md` — Setup, testing, contribution flow
- `SITE-ARCHITECTURE.md` — Astro customizations, components, plugins
- `AGENTS.md` — Code contribution patterns for AI agents
- `.claude/` — Documentation skills, voice references, and terminology

## Documentation Skills

| Skill | Purpose | Triggers |
|-------|---------|----------|
| docs-writer | Draft or rewrite doc pages | "write a doc", "draft a page", "rewrite the quickstart" |
| docs-audit | Assess published pages for quality | "audit this page", "check docs quality" |
| docs-planner | Prioritize the docs backlog | "plan docs work", "what docs need writing" |
| docs-reviewer | Review drafts before PR submission | "review this draft", "is this ready to ship" |

Skills are in `.claude/skills/`. Reference materials (voice guide, terminology, authoring patterns) are in `.claude/references/`.

## Content Structure

- **Source files**: `src/content/docs/` (MDX format)
- **Navigation**: `src/config/navigation.yml`
- **TypeScript snippets**: Co-located `.ts` files with `--8<--` markers
- **API docs**: Auto-generated in `.build/api-docs/`, symlinked into `src/content/docs/api/`
- **Blog**: `src/content/blog/` (MDX with author/tag frontmatter)

## Git Workflow

### Branch Convention

- Branch name: `docs/<short-description>`
- PR base: `main` (upstream strands-agents/docs)
- Rebase on upstream/main before committing

### Worktree Convention (for parallel work)

```bash
git worktree add .worktrees/<task-name> -b docs/<task-name>
# Work in the worktree
git worktree remove .worktrees/<task-name>  # after PR merge
```

### Quality Gates

Before committing (pre-commit hooks run these automatically):

```bash
npm test            # Unit tests
npm run typecheck   # TypeScript type checking
npm run format:check  # Prettier formatting
```

## SDK Source Access

For verifying code examples in documentation, see `.claude/references/code-verification.md` for the full tiered procedure. Quick reference:

- Python: `gh api repos/strands-agents/sdk-python/contents/src/strands/[path]`
- TypeScript: `gh api repos/strands-agents/sdk-typescript/contents/src/[path]`
- Local clones: `.build/sdk-python/` and `.build/sdk-typescript/` (via `npm run sdk:clone`)

## Voice and Style

All documentation follows a five-layer voice stack: Structure, Framing, Register, Constraints, Authenticity. Full reference at `.claude/references/voice-guide.md`. Key principles: lead with the developer's goal (not the API), one section answers one question, no AI hype phrases, no em-dashes, no emoji.

Canonical terminology at `.claude/references/terminology.md`. One concept, one term, no stylistic variation.

## Cross-Agent Compatibility

These skills follow the [agentskills.io](https://agentskills.io) open format. Claude Code discovers them automatically in `.claude/skills/`. For other agents (Cursor, VS Code Copilot, Gemini CLI, Kiro), copy or symlink the skill directories to the location your agent expects (e.g., `.agents/skills/` for VS Code).
