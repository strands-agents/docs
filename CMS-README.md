# Astro/Starlight CMS Customizations

This document explains the custom modifications made to the Astro/Starlight setup for the Strands Agents documentation site.

## Overview

We're using [Astro](https://astro.build/) with the [Starlight](https://starlight.astro.build/) documentation theme. However, we've made several customizations to preserve compatibility with our existing MkDocs-based documentation structure and navigation.

## Key Customizations

### 1. Sidebar Generation (`src/sidebar.ts`)

**What it does:** Reads the navigation structure from `mkdocs.yml` and converts it to Starlight's sidebar format.

**Why:** Starlight can auto-generate sidebars from the file structure, but we have a specific navigation layout defined in `mkdocs.yml` that we want to preserve. This ensures consistency during the migration from MkDocs to Astro.

### 2. Route Middleware (`src/route-middleware.ts`)

**What it does:** Filters the sidebar at buildtime so each page only shows items from its top-level group. For API pages (Python and TypeScript), it dynamically generates sidebars from the docs collection and computes pagination links.

**Why:** Our sidebar is organized into top-level groups (User Guide, Community, Examples, etc.). Without this middleware, every page would show the entire sidebar. This middleware scopes the sidebar to the current section, providing a cleaner navigation experience.

**Python API sidebar:** When viewing pages under `api/python/`, the middleware uses `buildPythonApiSidebar()` from `src/dynamic-sidebar.ts` to generate a nested sidebar structure based on module names (e.g., `strands.agent.agent` becomes `Agent > Agent`).

**TypeScript API sidebar:** When viewing pages under `api/typescript/`, the middleware uses `buildTypeScriptApiSidebar()` to generate a category-grouped sidebar (Classes, Interfaces, Type Aliases, Functions).

**Pagination:** For API pages, the middleware also updates `starlightRoute.pagination` using `getPrevNextLinks()` from `src/dynamic-sidebar.ts`. This ensures the previous/next navigation links at the bottom of pages work correctly with the dynamically generated sidebar.

### 3. MkDocs Snippets Plugin (`src/plugins/remark-mkdocs-snippets.ts`)

**What it does:** Processes MkDocs-style code snippet references in markdown files.

**Why:** Our existing documentation uses MkDocs' snippet syntax to include code from external files. This plugin provides compatibility so we don't need to rewrite all our code examples.

**Syntax supported:**
```markdown
```typescript
--8<-- "path/to/file.ts:section_name"
```
```

**Source file markers:**
```typescript
// --8<-- [start:section_name]
const example = "This code will be included"
// --8<-- [end:section_name]
```

### 4. Relative Link Resolution (`src/util/links.ts`, `src/components/PageLink.astro`)

**What it does:** Converts MkDocs-style relative file links to Astro slug-based URLs at render time.

**Why:** MkDocs uses relative links to files (e.g., `../tools/custom-tools.md`), while Astro uses slugs by default and doesn't validate internal links. Rather than rewriting all links to use slugs, we override the default `<a>` element to resolve relative paths automatically. This provides a better authoring experience—linking to files feels more natural than memorizing slug paths.

**How it works:**

1. `PageLink.astro` replaces the default anchor element via `astro-auto-import`
2. When rendering a link, it checks if the href is relative (not absolute, not anchor-only)
3. For relative links, it resolves the path against the current page's location using `src/util/links.ts`
4. The resolved path is matched against the content collection to find the correct slug
5. If no match is found, a warning is logged during development

**Example resolution:**

From page `user-guide/concepts/agents/state.mdx`:
- `conversation-management.md` → `/user-guide/concepts/agents/conversation-management/`
- `../tools/custom-tools.md` → `/user-guide/concepts/tools/custom-tools/`
- `../tools/index.md` → `/user-guide/concepts/tools/`

**Slug generation:** The content collection uses a custom `generateId` function in `src/content.config.ts` that shares the same normalization logic (`normalizePathToSlug`) as link resolution. This ensures consistency between how pages are identified and how links resolve to them.

### 5. API Reference Links (`@api` shorthand)

**What it does:** Provides a shorthand format for linking to API reference pages that's cleaner than relative paths.

**Syntax:**
```markdown
<!-- Python API -->
[@api/python/strands.agent.agent](link text)
[@api/python/strands.agent.agent#AgentResult](link text with anchor)

<!-- TypeScript API -->
[@api/typescript/Agent](link text)
[@api/typescript/Agent#constructor](link text with anchor)
```

**How it works:**

1. Links starting with `@api/` are detected by `isApiShorthand()` in `src/util/links.ts`
2. `resolveApiShorthand()` converts them to absolute paths (e.g., `/api/python/strands.agent.agent/`)
3. `PageLink.astro` applies the site's base path for correct URL generation

**Why use this format:**
- Cleaner than relative paths with `../api-reference/python/...`
- Doesn't break when the linking page moves to a different directory
- Matches the actual URL structure of the generated API docs
- Validated against the content collection at build time

**Examples:**
```markdown
<!-- Instead of this (fragile, verbose): -->
[AgentResult](../api-reference/python/agent/agent_result.md#strands.agent.agent_result.AgentResult)

<!-- Use this (clean, stable): -->
[AgentResult](@api/python/strands.agent.agent_result#AgentResult)
```

## Configuration (`astro.config.mjs`)

The main config ties everything together:

```javascript
import { loadSidebarFromMkdocs } from "./src/sidebar.ts"
import remarkMkdocsSnippets from './src/plugins/remark-mkdocs-snippets.ts'
import AutoImport from 'astro-auto-import'

const sidebar = loadSidebarFromMkdocs(
  path.resolve('./mkdocs.yml'),
  path.resolve('./src/content/docs')
)

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMkdocsSnippets],
  },
  integrations: [
    starlight({
      sidebar: sidebar,
      routeMiddleware: './src/route-middleware.ts',
      // ...
    }),
    AutoImport({
      imports: [/* ... */],
      defaultComponents: {
        // Override anchor elements for relative link resolution
        a: './src/components/PageLink.astro'
      }
    })
  ],
})
```

## Temporary Migration Script (`scripts/update-docs.ts`)

**What it does:** Converts documentation files from MkDocs markdown format to Astro/Starlight markdown format.

**Why:** MkDocs and Astro use different markdown conventions. Rather than updating Astro's parser to support MkDocs syntax, we convert files to what Astro expects. This runs at build time because the main branch (still in MkDocs format) is a moving target until migration is complete.

**Current approach:** Source control keeps files in MkDocs format. The script runs at build time to transform them. Once migration is complete, we'll do a final conversion, remove the script, and commit the transformed files directly.

For detailed information about what transformations the script performs (and what's planned), see [`scripts/update-docs.md`](scripts/update-docs.md).

## Custom Frontmatter Fields

The documentation extends Starlight's default schema with custom fields that automatically render contextual banners at the top of pages.

### `languages`

Indicates a feature is only available in specific SDK languages.

```yaml
---
title: My Feature
languages: Python
---
```

Renders a note aside: "This provider is only supported in {languages}."

### `community`

Marks a page as community-contributed content.

```yaml
---
title: Community Tool
community: true
---
```

Renders a tip aside explaining the package is community-maintained, not officially supported.

### `experimental`

Marks a feature as experimental.

```yaml
---
title: Experimental Feature
experimental: true
---
```

Renders a tip aside warning the feature may change in future versions.

### Rendering Order

When multiple fields are set, banners render top to bottom: experimental → community → languages.

### Sidebar Badges

Pages can display badges in sidebar navigation:

```yaml
---
title: My Page
sidebar:
  badge:
    text: Community
    variant: note
---
```

Available variants: `note`, `tip`, `caution`, `danger`, `success`, `default`

## MDX Components

Documentation pages use MDX format and can import [Starlight components](https://starlight.astro.build/components/using-components/):

```mdx
import { Tabs, TabItem } from '@astrojs/starlight/components';

<Tabs>
  <TabItem label="Python">Python code here</TabItem>
  <TabItem label="TypeScript">TypeScript code here</TabItem>
</Tabs>
```

Available: `Tabs`/`TabItem`, `Aside`, `Card`/`CardGrid`, `LinkCard`, `Icon`, `Badge`

### Auto-Imported Components

We use [astro-auto-import](https://github.com/delucis/astro-auto-import) to make `Tabs` and `Tab` available globally without explicit imports. Since language tabs appear on nearly every page, this reduces boilerplate.

```mdx
<!-- No import needed — just use directly -->
<Tabs>
  <Tab label="Python">pip install strands</Tab>
  <Tab label="TypeScript">npm install @strands-agents/sdk</Tab>
</Tabs>
```

`Tabs` maps to our `AutoSyncTabs` component (auto-syncs tabs with matching labels), and `Tab` maps to Starlight's `TabItem`.

For other components, use [explicit imports](https://starlight.astro.build/components/using-components/).

## Custom Components (`src/components/`)

### `AutoSyncTabs`

A wrapper around Starlight's `Tabs` that auto-generates a `syncKey` from tab labels. Tabs with identical label sets automatically sync together across the page. Auto-imported as `Tabs` (see above).

### `PageLink`

Replaces the default anchor element to enable MkDocs-style relative linking. Resolves relative hrefs against the current page's path and validates against the content collection. Logs warnings in development for broken links. Auto-imported as the default `a` element.

### Starlight Overrides (`src/components/overrides/`)

These override default Starlight components:

- **`Head.astro`**: Adds Mermaid diagram support by transforming code blocks with `language="mermaid"` into rendered diagrams.
- **`Header.astro`**: Custom header with navigation tabs and theme-aware logos (see [Header Navigation](#header-navigation) below).
- **`MarkdownContent.astro`**: Injects the custom frontmatter banners (experimental, community, languages) at the top of page content.
- **`Sidebar.astro`** and **`SidebarSublist.astro`**: Custom sidebar navigation that mimics MkDocs Material theme's `navigation.sections` behavior.

#### Sidebar Navigation Style

The custom sidebar components provide a flatter navigation style.

**How it works:**
1. Top-level groups render as non-collapsible section headers (uppercase labels)
2. Nested groups are collapsible with a caret icon
3. Group labels link to their first child page (clickable navigation)
4. Groups auto-expand when they contain the current page
5. Indentation only starts at depth 2+ (first level under section headers has no indent)

**Why:** Starlight's default sidebar shows all groups as collapsible accordions. This override provides a cleaner hierarchy where top-level sections are always visible, and nested groups can be both navigated to and expanded.

### Header Navigation

The custom header (`src/components/overrides/Header.astro`) replicates the navigation tabs from the MkDocs Material theme used on strandsagents.com.

**Features:**
- Navigation tabs displayed below the main header row on desktop
- Mobile dropdown menu next to the search bar for small screens
- Theme-aware logos (`logo-header-light.svg` / `logo-header-dark.svg`)
- Active state detection using longest-match path logic

**Configuring Navigation Links:**

Edit `src/config/navbar.ts` to add, remove, or reorder navigation links:

```typescript
const rawNavLinks: NavLink[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'User Guide',
    href: '/user-guide/quickstart/overview/',
    basePath: '/user-guide/',  // Used for active state detection
  },
  {
    label: 'Contribute ❤️',
    href: 'https://github.com/strands-agents/sdk-python/blob/main/CONTRIBUTING.md',
    external: true,  // Opens in new tab with arrow icon
  },
]
```

**Active state logic:** The header uses `findCurrentNavSection()` from `src/route-middleware.ts` to determine which tab is active. It finds the nav link with the longest matching `basePath` (or `href` if no `basePath`) that the current URL starts with.

**Theme-aware logos:** The header renders both `logo-header-light.svg` and `logo-header-dark.svg`, using CSS to show the appropriate one based on the `[data-theme]` attribute. Logo files are in `src/assets/`.

### Internal Aside Components

Used by `MarkdownContent.astro` to render frontmatter banners:

- `ExperimentalAside.astro`
- `CommunityContributionAside.astro`
- `LanguageSupportAside.astro`

These are not meant to be imported directly in MDX files—use the frontmatter fields instead.

## Python API Reference Generation

The Python API reference documentation is auto-generated from the SDK source code using pydoc-markdown.

### Generation Script (`scripts/api-generation-python.py`)

**What it does:** Parses Python source code from the SDK and generates MDX documentation files.

**How to run:**
```bash
uv run scripts/api-generation-python.py
```

**Input:** `.build/sdk-python/src` (cloned SDK repository)
**Output:** `.build/api-docs/python/*.mdx`

**Filtering:**
- Skips private modules (any module path containing `_` prefix)
- Skips explicitly excluded modules (e.g., `strands.agent` which just re-exports)

**Output format:** Each module becomes a flat MDX file named `strands.module.name.mdx` with frontmatter containing the title and slug.

### Symlink Setup

The generated docs are accessed via a committed symlink:
```
src/content/docs/api/python/_generated -> ../../../../../.build/api-docs/python
```

This symlink is checked into git, so no manual setup is required. The generation script outputs to `.build/api-docs/python/`, and the symlink makes those files available to the content collection.

The index page (`src/content/docs/api/python/index.mdx`) is a permanent file (not generated) that imports the `PythonApiList` component.

### Dynamic Sidebar (`src/dynamic-sidebar.ts`)

**What it does:** Builds a hierarchical sidebar structure from Python API docs at runtime, and provides pagination utilities.

**How it works:**
1. Filters docs collection for `api/python/*` pages
2. Parses module names from page titles (e.g., `strands.agent.agent`)
3. Builds a nested tree structure based on module path segments
4. Converts tree to Starlight sidebar entries with groups and links

**Pagination utilities:**
- `flattenSidebar()` - Converts nested sidebar structure to a flat list of links
- `getPrevNextLinks()` - Finds the current page in the flattened sidebar and returns prev/next links

**Sorting:**
- Alphabetical A-Z within each level
- "Experimental" group always appears last
- Groups at depth ≥2 are collapsed by default

**Example transformation:**
```
strands.agent.agent      → Agent > Agent
strands.agent.base       → Agent > Base
strands.experimental.bidi.types.events → Experimental > Bidi > Types > Events
```

### Index Page Component (`src/components/PythonApiList.astro`)

**What it does:** Renders the API reference index page with a hierarchical list of all modules.

**How it works:** Uses the same `buildPythonApiSidebar()` function as the route middleware to ensure consistency between the sidebar navigation and the index page listing.

### Path Alias

Components can be imported using the `@components` alias:
```typescript
import PythonApiList from '@components/PythonApiList.astro'
```

This is configured in `tsconfig.json` under `compilerOptions.paths`.

## TypeScript API Reference Generation

The TypeScript API reference documentation is auto-generated from the SDK source code using [typedoc](https://typedoc.org/) with [typedoc-plugin-markdown](https://typedoc-plugin-markdown.org/).

### Generation Script (`scripts/api-generation-typescript.ts`)

**What it does:** Runs typedoc to generate markdown files, then post-processes them to add frontmatter.

**How to run:**
```bash
npm run sdk:generate:ts
# or
npx tsx scripts/api-generation-typescript.ts
```

**Input:** `.build/sdk-typescript/src` (cloned SDK repository)
**Output:** `.build/api-docs/typescript/{classes,interfaces,type-aliases,functions}/*.md`

### TypeDoc Configuration (`typedoc.json`)

Key settings:
- `outputFileStrategy: "members"` - Creates separate files per class/interface/type/function
- `fileExtension: ".md"` - Outputs standard markdown format
- `basePath: ".build/sdk-typescript"` - Strips build path prefix from source links
- `hideBreadcrumbs: true`, `hidePageHeader: true` - Cleaner output for Starlight integration

### Post-Processing

The generation script performs these transformations after typedoc runs:

1. **Adds frontmatter** with title, slug, and category:
   ```yaml
   ---
   title: "Agent"
   slug: api/typescript/Agent
   category: classes
   ---
   ```

2. **Fixes relative links** to match the flat slug structure (e.g., `../interfaces/AgentData.md` → `../AgentData.md`)

3. **Deletes the generated index.md** - We use our own custom index page instead

### Flat Slugs with Category Grouping

Unlike Python API docs which use hierarchical slugs based on module paths, TypeScript API docs use flat slugs:
- URL: `/api/typescript/Agent/` (not `/api/typescript/classes/Agent/`)
- The `category` frontmatter field is used for sidebar grouping

This keeps URLs clean while still organizing the sidebar by type (Classes, Interfaces, Type Aliases, Functions).

### Symlink Setup

The generated docs are accessed via a committed symlink:
```
src/content/docs/api/typescript/_generated -> ../../../../../.build/api-docs/typescript
```

The index page (`src/content/docs/api/typescript/index.mdx`) is a permanent file that imports the `TypeScriptApiList` component.

### Dynamic Sidebar (`src/dynamic-sidebar.ts`)

**What it does:** Builds a category-grouped sidebar structure from TypeScript API docs at runtime.

**How it works:**
1. Filters docs collection for `api/typescript/*` pages
2. Groups docs by their `category` frontmatter field
3. Creates sidebar groups for Classes, Interfaces, Type Aliases, and Functions
4. Sorts entries alphabetically within each group

**Example structure:**
```
Classes
  ├── Agent
  ├── BedrockModel
  └── Tool
Interfaces
  ├── AgentConfig
  └── ToolSpec
Type Aliases
  ├── ContentBlock
  └── ToolChoice
Functions
  ├── configureLogging
  └── tool
```

### Index Page Component (`src/components/TypeScriptApiList.astro`)

**What it does:** Renders the API reference index page with a categorized list of all exports.

**How it works:** Uses the same `buildTypeScriptApiSidebar()` function as the route middleware to ensure consistency between the sidebar navigation and the index page listing.

### Content Collection Schema

The `category` field is defined in `src/content.config.ts`:
```typescript
extend: z.object({
  // ...
  category: z.string().optional(),
})
```

This allows the content collection to validate and expose the category for sidebar generation.


## Custom Landing Page

The landing page uses a custom layout that provides the Starlight header without the full documentation page structure, allowing for full-width marketing content.

### Landing Layout (`src/layouts/LandingLayout.astro`)

**What it does:** Provides a minimal layout with the Starlight header, theme support, and CSS variables, but without the sidebar, table of contents, or content constraints of documentation pages.

**Key features:**
- Mocks `Astro.locals.starlightRoute` with minimal data needed for the Header component
- Mocks `Astro.locals.t` translation function (with `.all()` method for Search component)
- Loads Figtree font from Google Fonts for landing page typography

**Usage:**
```astro
---
import LandingLayout from '../layouts/LandingLayout.astro'
---

<LandingLayout title="Page Title" description="Optional description">
  <!-- Full-width content here -->
</LandingLayout>
```

### Landing Page (`src/pages/index.astro`)

The main landing page includes:
- Animated parallax curves background (replicating strandsagents.com effect)
- Hero section with frosted glass effect
- Feature cards that expand on hover to show descriptions
- Testimonials slider with fade transitions and auto-play

**Assets:**
- `src/assets/curve-primary.svg` and `src/assets/curve-secondary.svg` - Animated strand patterns
- `src/assets/icons/icon-*.svg` - Feature card icons

## Testimonials Content Collection

Testimonials are managed as a content collection, allowing them to be stored separately and potentially shared across projects.

### Schema (`src/content.config.ts`)

```typescript
const testimonialSchema = z.object({
  quote: z.string(),
  name: z.string(),
  title: z.string().optional(),
  icon: z.string().optional(),  // Company logo URL
  order: z.number().default(0),
})
```

### Content Location

Default: `src/content/testimonials/*.json`

The base path can be overridden via the `TESTIMONIALS_PATH` environment variable for projects that store testimonials in a different location.

### File Format

Each testimonial is a JSON file:

```json
{
  "quote": "The testimonial text...",
  "name": "Person Name",
  "title": "Job Title, Company Name",
  "icon": "https://example.com/company-logo.png",
  "order": 1
}
```

## Temporary Migration Files

The following files were created to support the MkDocs → Astro migration and should be deleted once migration is complete:

### Link Conversion Utilities

These files handle converting old MkDocs-style API reference links to the new `@api` shorthand format:

- `src/util/api-link-converter.ts` - Utility functions to detect and convert old API links
- `test/api-link-converter.test.ts` - Tests for the link converter

### Migration Scripts

These scripts transform MkDocs markdown to Astro-compatible format at build time:

- `scripts/update-docs.ts` - Main transformation script (converts admonitions, tabs, API links, etc.)
- `scripts/update-quickstart.ts` - Quickstart-specific transformations
- `test/update-docs.test.ts` - Tests for the update-docs transformations

### When to Delete

Once the migration is complete and all documentation is committed in Astro format:

1. Run `npm run docs:update` one final time to apply all transformations
2. Commit the transformed files directly (no longer keeping MkDocs format in source control)
3. Delete the files listed above
4. Remove the `docs:update` and `docs:revert` scripts from `package.json`
5. Update this README to remove references to the migration process


## LLM-Friendly Documentation (`llms.txt`)

We provide machine-readable documentation following the [llms.txt specification](https://llmstxt.org/), optimized for both humans and AI agents.

### Why Custom Implementation

We evaluated existing Astro llms.txt plugins/integrations but found them lacking:
- They generated HTML or poorly formatted markdown with navigation clutter
- Links weren't properly resolved to our documentation structure
- No support for our custom components (tabs, code snippets, etc.)

Our implementation renders documentation through Astro's container API, applies custom HTML-to-markdown transformations, and generates clean output with correct links.

### Endpoints

- `/llms.txt` - Index with links to all docs organized by sidebar structure
- `/llms-full.txt` - Complete documentation content (excludes API reference)
- `/{slug}/index.md` - Any doc page in raw markdown format

### Implementation Files

| File | Purpose |
|------|---------|
| `src/pages/llms.txt.ts` | Generates index from sidebar structure |
| `src/pages/llms-full.txt.ts` | Renders all docs inline |
| `src/pages/[...slug]/index.md.ts` | Dynamic endpoint for individual pages |
| `src/util/render-to-markdown.ts` | Renders MDX entries via AstroContainer |
| `src/util/html-to-markdown.ts` | HTML→Markdown conversion with custom rules |
| `src/content/docs/llms.mdx` | User-facing page explaining the feature |

### HTML-to-Markdown Transformations

Uses [Turndown](https://github.com/mixmark-io/turndown) with custom rules:

- **Tables**: GFM plugin for proper markdown table syntax
- **Code blocks**: Handles both standard and Expressive Code syntax highlighting
- **Tab panels**: Wraps content with `(( tab "Label" ))` markers
- **Local links**: Rewrites to `/index.md` format for LLM consumption
- **Cleanup**: Removes screen-reader elements, empty anchors, tab navigation lists, scripts

### Link Handling

The `src/util/links.ts` module was extended:
- `toRawMarkdownUrl()` - Converts paths to index.md URLs, skips files with extensions
- `isLocalLink()` - Identifies links that should be converted (excludes .txt, external, anchors)
- `resolveHref()` - Special-cases `llms.txt` and `llms-full.txt` for proper resolution

### Dependencies Added

```json
{
  "turndown": "^7.2.0",
  "turndown-plugin-gfm": "^1.0.2"
}
```

Type declarations in `src/types/turndown-plugin-gfm.d.ts` (no @types package available).
