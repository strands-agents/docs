# Feature Proposals

Building a significant feature takes time. Before you invest that effort, we want to make sure we're aligned on direction. That's why we use an RFC (Request for Comments) process for larger contributions.

This isn't bureaucracy for its own sake—it's about making sure your work has the best chance of being merged. We'd rather discuss approach early than ask you to rewrite after weeks of work.

## When to use an RFC

Not every contribution needs an RFC. Use this process for changes that have broad impact or require significant time investment.

| Use RFC for | Skip RFC for |
|-------------|--------------|
| New major features affecting multiple parts of the SDK | Bug fixes with clear solutions |
| Breaking changes to existing APIs | Small improvements and enhancements |
| Architectural changes requiring design discussion | Documentation updates |
| Large contributions (> 1 week of work) | New tools in your own repository |
| Features that introduce new concepts | Performance optimizations |

When in doubt, start with a GitHub Discussion. We'll tell you if an RFC is needed.

## Process

The RFC process helps align on requirements, explore alternatives, and identify edge cases before implementation begins.

1. **Check the [roadmap](https://github.com/orgs/strands-agents/projects/1)** — See if your idea aligns with our direction and isn't already planned
2. **Open a GitHub Discussion** — Use the [Proposals](https://github.com/strands-agents/sdk-python/discussions/categories/proposals) category in the appropriate repository
3. **Use the template below** — Describe the problem, your solution, and alternatives you considered
4. **Gather feedback** — We'll discuss with you and the community, asking clarifying questions
5. **Get approval** — Wait for maintainer approval before implementing—approval means we commit to reviewing and likely merging your contribution
6. **Implement** — Follow the [SDK contribution process](./core-sdk.md) once approved
7. **Reference the RFC** — Link to the approved discussion in your pull request

**Timeline expectations:**

- Initial response: Within 3 days
- Discussion period: 1-2 weeks for most proposals
- Decision: We'll clearly approve or decline with reasoning

## Proposal template

When you open a discussion, use this structure. Clear proposals get faster, more helpful feedback.

```markdown
## Problem

What problem are you trying to solve? Describe the pain point or limitation you're addressing.

Be specific about:
- What task are you trying to accomplish?
- What makes it difficult or impossible today?
- Who experiences this problem?

## Proposed Solution

How would you solve it? Describe your approach at a high level.

Include:
- Changes to the API (with code examples)
- How it integrates with existing features
- Expected behavior and usage patterns

## Alternatives Considered

What other approaches did you consider? Why did you choose this one?

This helps us understand your reasoning and might surface better approaches.

## Implementation Plan (optional)

If you have thoughts on implementation, share them. Not required, but helpful.

## Willingness to Implement

Are you willing to implement this if approved?

Yes / No / Maybe with guidance
```

**Tips for effective proposals:**

- Focus on the problem first—solution comes second
- Include concrete examples showing current pain and proposed improvement
- Be open to feedback—the best solution might differ from your initial idea
- Align with our [development tenets](https://github.com/strands-agents/sdk-python/blob/main/CONTRIBUTING.md#development-tenets)

This process helps us avoid situations where someone builds a feature for weeks, only to find it doesn't fit the project direction. We'd rather have that conversation early.
