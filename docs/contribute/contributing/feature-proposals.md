# Feature Proposals

Building a significant feature takes time. Before you invest that effort, we want to make sure we're aligned on direction. We use an ADR (Architecture Decision Record) process for larger contributions to ensure your work has the best chance of being merged.

## When to write an ADR

Not every contribution needs an ADR. Use this process for changes that have broad impact or require significant time investment.

| Use ADR for | Skip ADR for |
|-------------|--------------|
| New major features affecting multiple parts of the SDK | Bug fixes with clear solutions |
| Breaking changes to existing APIs | Small improvements and enhancements |
| Architectural changes requiring design discussion | Documentation updates |
| Large contributions (> 1 week of work) | New extensions in your own repository |
| Features that introduce new concepts | Performance optimizations |

When in doubt, open an issue first. We'll tell you if an ADR is needed.

## Process

The ADR process helps align on requirements, explore alternatives, and identify edge cases before implementation begins.

1. **Check the [roadmap](https://github.com/orgs/strands-agents/projects/8/views/1)** — See if your idea aligns with our direction and isn't already planned
2. **Open an issue first** — Describe the problem you're trying to solve. We need to validate the problem is worth solving before you invest time in a detailed proposal
3. **Create an ADR** — Once we agree the problem is worth solving, submit a PR to the [`adrs` folder](https://github.com/strands-agents/docs/tree/main/adrs) in the docs repository using the template there. Reference the issue in your ADR
4. **Gather feedback** — We'll review and discuss with you, asking clarifying questions
5. **Get approval** — When we merge the ADR, that's your go-ahead to implement
6. **Implement** — Follow the [SDK contribution process](./core-sdk.md)
7. **Reference the ADR** — Link to the approved ADR in your implementation PR

## ADR template

See the full template in the [ADRs folder README](https://github.com/strands-agents/docs/blob/main/adrs/README.md#adr-template).

**Tips for effective proposals:**

- Focus on the problem first—solution comes second
- Include concrete examples showing current pain and proposed improvement
- Be open to feedback—the best solution might differ from your initial idea
- Align with our [development tenets](https://github.com/strands-agents/docs/blob/main/team/TENETS.md)
