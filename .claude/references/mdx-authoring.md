# MDX Authoring Patterns

Practical reference for writing documentation in this repo. This site uses Astro + Starlight with MDX.

## Auto-Imported Components

`<Tabs>` and `<Tab>` are globally available — no import statement needed. Tabs with matching labels auto-sync across the page.

```mdx
<Tabs>
  <Tab label="Python">
    ```python
    from strands import Agent
    agent = Agent(tools=[my_tool])
    ```
  </Tab>
  <Tab label="TypeScript">
    ```typescript
    --8<-- "user-guide/concepts/agents/example.ts:basic_agent"
    ```
  </Tab>
</Tabs>
```

For other Starlight components (`Aside`, `Card`, `CardGrid`, `LinkCard`, `Icon`, `Badge`), use explicit imports:

```mdx
import { Card, CardGrid } from '@astrojs/starlight/components';
```

## Snippet Inclusion

Include code from external files using MkDocs-compatible syntax:

````markdown
```typescript
--8<-- "path/to/file.ts:snippet_name"
```
````

Mark snippet boundaries in source files:

```typescript
// --8<-- [start:snippet_name]
const agent = new Agent({ tools: [notebook] })
// --8<-- [end:snippet_name]
```

Paths are relative to `src/content/docs/`.

## Callout Syntax

Starlight-native admonitions:

```markdown
:::note[Optional Title]
Informational content.
:::

:::tip
Helpful suggestion.
:::

:::caution
Proceed carefully.
:::

:::danger[Breaking Change]
This will break existing code.
:::
```

## Frontmatter Schema

Required fields:

```yaml
---
title: "Page Title"
description: "Short description for SEO (140-160 chars)"
---
```

Optional fields (validated by Zod in `src/content.config.ts`):

| Field | Type | Purpose |
|-------|------|---------|
| `languages` | `string` | Feature only available in specific SDK language |
| `community` | `boolean` | Marks page as community-contributed |
| `experimental` | `boolean` | Marks feature as experimental |
| `integrationType` | enum | `model-provider`, `tool`, `session-manager`, `integration`, `plugin` |
| `category` | `string` | For TypeScript API doc grouping |
| `redirectFrom` | `string[]` | Old slugs that should redirect here |

These render contextual banners automatically (experimental → community → languages).

## TypeScript Snippet Scoping

When a `.ts` file has multiple snippets using the same variable names, wrap snippets in functions. Place markers **inside** the function so only the code appears in docs:

```typescript
// Correct: function is for scoping only
async function exampleScope() {
  // --8<-- [start:example]
  const result = await agent.invoke('Hello')
  console.log(result)
  // --8<-- [end:example]
}
```

TypeScript uses `isolatedModules: true` — multiple snippets with the same variable names cause redeclaration errors without scoping.

## Relative Links

Use relative file paths. They resolve automatically via the PageLink component:

```markdown
[Custom tools](../tools/custom-tools.md)
[Tools overview](../tools/index.md)
```

## API Reference Shorthand

Link to generated API docs without fragile relative paths:

```markdown
[@api/python/strands.agent.agent](AgentResult)
[@api/typescript/Agent#constructor](Agent constructor)
```

## Line Length

90 characters maximum for files under `src/content/docs/`. Template literal contents in snippet files must also stay under 90 characters. Prettier does not enforce this automatically.

## Gotchas

- **Snippet dedent**: Leading whitespace is automatically stripped from included snippets. If the snippet reference in markdown is indented, content indents to that level.
- **Tab indentation**: Content inside `<Tab>` must not have leading blank lines or it may not render correctly.
- **API docs are symlinked**: `src/content/docs/api/python/_generated` and `typescript/_generated` are symlinks to `.build/api-docs/`. Never edit these directly — they are auto-generated.
- **No `TabItem`**: The auto-imported component is `Tab`, not `TabItem` (even though Starlight's native component is called TabItem).
- **Code theme**: Uses GitHub Light/Dark themes. Follows Starlight's `[data-theme]` attribute.
- **Formatting**: No semicolons, single quotes, 2-space indent, trailing commas ES5 style (enforced by Prettier).
