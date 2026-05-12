---
name: docs-writer
description: Draft or rewrite Strands Agents documentation pages. Use when writing new doc pages, rewriting pages that failed audit, drafting sections for existing pages, or writing blog posts and release notes about Strands. Also triggers on "write a doc", "draft a page", "rewrite the quickstart", "add a tutorial for X", "document this feature".
---

# Documentation Writer

Draft or rewrite Strands Agents documentation following the five-layer voice stack.

## Inputs

- **Content type**: tutorial, howto, reference, explanation, blog (required)
- **Topic**: What this page covers (required)
- **Target file**: Path in docs repo where this will live (if known)
- **Existing content**: Current page to rewrite (if rewriting)
- **Context** (optional): Community signals, GitHub issues, or positioning themes motivating this work

## Process

### Step 1: Load voice context

Read these files before writing anything:
1. `../../references/voice-guide.md` (the full voice stack)
2. `../../references/terminology.md` (canonical terms)
3. If exemplars exist in `../../references/exemplars/`, load the one matching your content type

If rewriting, read the current published page as a baseline.

### Step 2: Outline

Produce an outline where each item is the question that section answers.

- **Tutorial**: step-by-step journey toward a working result
- **How-to**: prerequisites, steps, expected result
- **Reference**: API surface (classes, methods, parameters)
- **Explanation**: problem, design choice, tradeoffs, implications

Each section answers one question. No mixed-type sections. Review for scope creep.

### Step 3: Draft

Write each section following the outline.

- First sentence of every section describes the developer's goal (framing layer)
- Use the tone appropriate for this content type (register layer)
- Code examples: runnable with real Strands imports and realistic values
- For agent responses, label non-deterministic output: "Your agent's response will vary. Here's a typical result."
- Comments explain intent, not mechanics
- One concept per code block

### Step 3b: Apply MDX formatting

Apply MDX formatting patterns from `../../references/mdx-authoring.md` — especially Tabs/Tab syntax, snippet includes, and callout syntax.

### Step 4: Constrain

Check the **type-aware constraint overrides table** in the voice guide first. The content type determines which rules are strict vs relaxed.

Then self-check against hard constraints:
- No banned phrases (AI tells, hype words)
- No em-dashes
- No emoji
- Active voice (unless reference type, per overrides table)
- No hedging on facts (softened for explanation tradeoff discussions)
- Terminology matches the lock file
- Code examples are contextually complete (imports present, runnable)
- Code examples use proper backtick formatting

### Step 4b: Verify code accuracy

Follow the verification procedure in `../../references/code-verification.md`.

Do not skip this step. Plausible-but-wrong code examples erode developer trust faster than missing documentation.

### Step 5: Authenticate

Review the draft for machine-generated feel:
- Break structural sameness (vary section openings, use fragments, vary length)
- Add visible editorial judgment (name rejected alternatives, state opinions)
- Cut aggressively (first drafts are always too long)
- Replace "you could use X or Y" with a recommendation

### Step 6: Metadata

Add frontmatter:
```yaml
---
title: "[title]"
description: "[140-160 char description]"
contentType: [type]
minSDKVersion: "[version]"
lastReviewed: "[today's date]"
---
```

### Step 7: Run docs-reviewer

Run the docs-reviewer skill on the completed draft. Address any findings before presenting the draft.

## Output

Present the completed draft as:
1. The full page content
2. A brief note on voice choices made (register, key editorial decisions)
3. Any open questions for PM review (terminology, scope, accuracy concerns)

## Git workflow

Follow the git workflow described in the repo's CLAUDE.md.

## What this skill does NOT do

- Auto-commit without human review
- Generate reference docs from code (separate auto-generation concern)
- Publish or deploy docs

## Gotchas

- Always verify code against SDK source. The most common failure mode is plausible imports that don't exist or parameters with wrong names.
- Terminology lock is strict. "Hook" not "callback." "Plugin" not "middleware." "Tool" not "function." Check before drafting.
- The constraint overrides table relaxes different rules per content type. Don't apply tutorial constraints to reference pages.
- Tabs syntax in MDX is finicky. Match the exact pattern from `mdx-authoring.md` or builds will break.
- Cut aggressively. First drafts are always 30-50% too long. The authenticity pass is where most quality comes from.
