# Architecture Decision Records (ADRs)

This folder contains Architecture Decision Records for significant features and changes to Strands Agents. ADRs document the context, decision, and consequences of architectural choices.

## What is an ADR?

An ADR is a design document that captures an important architectural decision along with its context and consequences. Once approved and merged, it becomes part of the project's decision history.

## When to write an ADR

Write an ADR for:

- New major features affecting multiple parts of the SDK
- Breaking changes to existing APIs
- Architectural changes requiring design discussion
- Large contributions (> 1 week of work)
- Features that introduce new concepts

Skip the ADR process for bug fixes, small improvements, documentation updates, and new extensions in your own repository.

## How to submit an ADR

1. **Check the [roadmap](https://github.com/orgs/strands-agents/projects/8/views/1)** — See if your idea aligns with our direction
2. **Fork the [docs repository](https://github.com/strands-agents/docs)**
3. **Create your ADR** — Add a new file: `adrs/NNNN-feature-name.md` using the template below
4. **Submit a pull request** — We'll review and discuss
5. **Iterate based on feedback** — Address comments and questions
6. **Get approval** — Once approved and merged, implement the feature
7. **Reference the ADR** — Link to it in your implementation PR

## ADR template

```markdown
# ADR: [Feature Name]

**Status**: Proposed | Accepted | Deprecated | Superseded

**Date**: YYYY-MM-DD

## Context

What is the issue that we're seeing that is motivating this decision or change?

- What task are you trying to accomplish?
- What makes it difficult or impossible today?
- Who experiences this problem?

## Decision

What is the change that we're proposing and/or doing?

- Changes to the API (with code examples)
- How it integrates with existing features
- Expected behavior and usage patterns

## Developer Experience

Show what the developer experience looks like:

- Code examples showing typical usage
- Configuration or setup required
- Error messages and edge cases

## Alternatives Considered

What other approaches did you consider? Why did you choose this one?

## Consequences

What becomes easier or more difficult to do because of this change?

## Willingness to Implement

Are you willing to implement this if approved?

Yes / No / Maybe with guidance
```

## ADR naming

Use the format `NNNN-short-description.md` where NNNN is the next available number:

- `0001-streaming-hooks.md`
- `0002-retry-strategies.md`

## Accepted ADRs

*No ADRs have been accepted yet.*
