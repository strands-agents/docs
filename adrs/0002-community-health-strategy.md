# Strands Agents: Community Health Strategy & Playbook

> This document is a part of community/contributor management series. See [Strands Agents: Contributor Experience Analysis](./contributor-story.md), [Strands Agents: Community Health Strategy & Playbook](./community-health.md), [Strands Agents: Extensibility & Ecosystem Strategy](./extensibility.md), and [Strands Agents: Task Backlog [Community & Ecosystem]](./task-backlog.md)

## Terminology

| Term | Definition |
|------|------------|
| **Maintainers** | AWS team that owns Strands Agents SDK |
| **Contributors** | Anyone who contributes to the Strands ecosystem (e.g., publishing tools on PyPI) |
| **Core Contributors** | Contributors to core Strands packages (sdk-python, sdk-typescript, tools, docs) |
| **Customers** | End users of Strands — may overlap with contributors if they publish components |
| **Community** | Everyone: contributors, customers, etc. |

---

## Introduction

This document defines what we want from being open source and how we operationalize community health. It builds on the [Contributor Story Analysis](./contributor-story.md) which identified friction points in our contributor experience. While that document focused on understanding problems, this one focuses on strategy and solutions.

The goal is to get team and leadership alignment on our open source goals, then provide an operational playbook for achieving them.

### Where We Are Today

Strands Agents is an open source AI agent SDK. We're growing fast (~5K stars) but our contributor experience metrics need improvement:

- **External PRs take 10.6 days to merge** (industry benchmark: < 7 days)
- **Only 52% of external PRs get merged** (industry benchmark: > 60%)
- **Issue response time averages 13 days** (industry benchmark: < 2 days)
- **Only 4 repeat contributors** in sdk-python (we're not retaining core contributors)

Before we can fix these problems, we need to answer a fundamental question: **What do we actually want from being open source?** The answer determines how much we invest and where.

---

## Part 1: What We Want From Open Source

We're already open source. The question isn't "should we be open source?" but "how do we make the best of it?" This section defines what we're optimizing for and the trade-offs we're making.

### The Core Trade-off

Being open source gives us:

- **Adoption:** Zero friction. Developers pip install and start building.
- **Community Contributions:** We're a small team. Community extends our reach with bug fixes, docs, and specialized features.
- **Community Signals:** Direct feedback on what to prioritize. Users tell us about critical bugs, missing features, and emerging use cases.
- **Ecosystem:** Third parties build tools, integrations, content. Network effects make the platform stickier.
- **Trust:** Enterprises can audit our code. Transparency builds confidence.

But it costs us:

- **Opportunity Cost:** PR review, issue triage, documentation, support. Every hour on community is an hour not on features.
- **Community Trust Risk:** With a small team, slow responses damage reputation. If we're not reacting to community, we lose trust—and contributors.
- **Control:** Communities can fork if they disagree with direction.

**The key question: How do we balance community investment with feature development?**

### Goals (Prioritized)

**P0: Adoption**

Downloads, usage, stars. This is always the north star—everything else serves this goal. We can't directly move these numbers with community work alone, but it's what we're ultimately optimizing for.

**P1: Ecosystem Growth**

Tools, integrations, and extensions make the SDK sticky. A developer will choose the SDK that has tools for their use case. This is the flywheel—once kickstarted, it grows without us. We need both quality AND quantity here.

**P2: Community Health & Contributor Experience**

Community contributions scale our velocity. Bug fixes, docs, specialized features — work we couldn't prioritize ourselves. But this only works if contributors stick around. Fast responses, clear processes, good experience. If contributors have a bad experience, they don't come back—and they tell others.

**P3: Community Signals**

The community tells us what matters. Bug reports, feature requests, and discussions help us prioritize. This is a two-way relationship—we need to listen, not just broadcast.

**P4: Trust and Brand**

Enterprise adoption requires transparency. Being open source signals trustworthiness. This is table stakes, not a differentiator.

### What We're NOT Optimizing For

To be explicit about trade-offs:

- **Not maximizing community size at any cost.** Quality matters.
- **Not accepting every PR.** We'll reject PRs that don't align with project direction.
- **Not providing 24/7 support.** We're not a support organization.

### Success Metrics

**Adoption Metrics (P0)** — The north star

| Metric | Current | Notes |
|--------|---------|-------|
| GitHub Stars (sdk-python) | ~5K | Track trend |
| PyPI Downloads/month | 419,400 (weekly) | Track trend |
| npm Downloads/month | 11,084 (weekly) | Track trend |

**Ecosystem Metrics (P1)** — The flywheel

| Metric | Current | 6-Month Target | 12-Month Target |
|--------|---------|----------------|-----------------|
| Community Tools (listed on website) | 5 | 30 | 100 |
| Model Providers | 4 | 10 | 20 |
| Session Managers | 1 | 5 | 20 |

**Community Health Metrics (P2)** — What we operationalize

| Metric | Current | 6-Month Target | 12-Month Target |
|--------|---------|----------------|-----------------|
| PR First Response | 2.4 days | < 3 days | < 48h |
| PR Merge Time (core contributors) | 10.6 days | < 7 days | < 5 days |
| Issue First Response | 13 days | < 3 days | < 48h |
| Repeat Core Contributors | 4 | 10 | 20 |

See [Extensibility & Ecosystem doc](./extensibility.md) for detailed ecosystem metrics (community tools, integrations, etc.).

---

## Part 2: Competitor Learnings

We can learn from how other AI agent SDKs handle community. Let's take what works.

| Project | Stars | Community Channel | What We Can Learn |
|---------|-------|-------------------|-------------------|
| LangChain | ~120K | Slack + Forum | 400+ integrations, comprehensive contributor docs, "good first issue" labeling |
| CrewAI | ~42K | Forum | Fast issue closure (97%+), 100K+ certified developers community |
| AutoGen | ~53K | Discord | Human-in-the-loop focus, research-oriented community |
| **Strands** | ~5K | None | — |

*Star counts verified January 2026.*

**Key observations:**
- All competitors have real-time community channels. We don't.
- CrewAI and LangChain close 97%+ of issues. We close 54%.
- Fast response time correlates with contributor retention.

**Practices worth adopting:**
- **Clear contribution docs:** LangChain has detailed contributor documentation covering setup, PR process, code standards, and testing requirements. They redirect CONTRIBUTING.md to comprehensive docs site.
- **Issue labeling:** LangChain uses `good first issue` and `help wanted` labels to guide new contributors. They also have a pinned "Looking to Contribute? Start Here!" issue.
- **Design discussion before implementation:** LangChain requires design discussion for large features before implementation—prevents wasted effort on both sides.

---

## Part 3: Key Decisions

Based on the analysis, here are the strategic decisions we need to make:

### Decision 1: Response Time SLA

**Decision:** Commit to < 3 day first response SLA (aligned with twice-weekly triage meetings).

**Rationale:** Research shows response time is a key predictor of contributor retention. Fast initial responses signal that contributions are valued and encourage repeat engagement.

Currently we do internal triage, but we don't have public priority labels and we don't respond to contributors. From their perspective, they see no engagement. Same applies to PRs.

The cost of slow response (lost contributors, bad reputation) exceeds the cost of interruption. First response doesn't mean full review—just acknowledgment and initial triage.

**Implementation:** Triage happens in twice-weekly "Community PR and Issue Review" meetings (Tue/Thu). This requires:
- Oncall dashboard so they can see what needs response
- Clear guidelines on what "first response" means
- Processes documented in oncall runbook

### Decision 2: PR Acceptance Rate Target

**Decision:** Target 65-70% acceptance rate (up from 52%).

**Rationale:** Current 52% rate means contributors have coin-flip odds. This discourages contribution. But we shouldn't accept everything—quality matters.

The gap is likely due to unclear expectations, not bad contributions. Better guidelines and early feedback should improve the rate without lowering standards.

**Implementation:**
- Clear contribution guidelines documenting what we accept/reject
- Early feedback on direction before significant investment
- Add a proposal/RFC process for contributors to propose new features before implementation using GitHub Discussions with a proposal template—lower friction, signals we want conversation not just task tracking, and keeps proposals separate from bugs/feature requests.

### Decision 3: Tools Repository Policy

**Decision:** Don't accept external tools to core repo. Provide template + catalog instead.

**Rationale:** We can't test, maintain, or take security responsibility for tools we don't understand. The MongoDB CVE incident showed the risk. But we should make it easy to publish and discover community tools.

**Implementation:** See [Extensibility & Ecosystem doc](./extensibility.md) for details on:
- GitHub template for tool packages
- Community tools catalog/registry
- Clear communication in tools repo
- Contributor guide in docs explaining how to develop and publish tools (use template → update PyPI secrets → update tool code → publish, use tags for visibility)

### Decision 4: Community Channel

**Proposal:** Adopt Discord as our real-time community channel.

**Rationale:** All competitors have real-time community channels. Internal contributors have Slack access which gives them a significant advantage over external contributors. A real-time channel bridges this gap.

**Moderation:** We may take over an existing Discord from the AgentCore team, which reduces cold-start and provides existing moderation infrastructure.

**Trade-off:** Requires ongoing moderation investment, but the cost of not having a community channel (slower communication, contributor disadvantage) is higher.

---

## Part 4: Observability

We can't improve what we don't measure. Currently, we have no visibility into contributor health metrics. We need to build these dashboards to operationalize community health.

### SLAs

| Item Type | First Response | Cycle Time | Notes |
|-----------|---------------|------------|-------|
| PRs | < 3 days | < 3 days between responses | Oncall acknowledges, owner assigned in twice-weekly meeting |
| Issues | < 3 days | < 3 days | Triage and label in twice-weekly meeting |
| Discussions | < 72h | Best effort | Lower priority |
| Security Issues | < 24h | ASAP | Escalate immediately |

### Metrics We Track

**P0 Metrics (Review Weekly)**

These directly measure core contributor experience:

- **Core Contributor PR Success Rate:** % of core contributor PRs merged. Target: > 65%
- **PR First Response Time:** Median time to first maintainer response. Target: < 3 days
- **PR Merge Time (core contributors):** Median time from open to merge. Target: < 7 days
- **Issue First Response Time:** Median time to first response. Target: < 3 days
- **Issue Response Rate:** % of issues with maintainer response. Target: > 80%

**P1 Metrics (Review Monthly)**

These measure overall health:

- **Stars:** GitHub stars across all repos. Target: Growing
- **Downloads:** PyPI + npm downloads. Target: Growing
- **New Core Contributors:** First-time core contributors per month. Target: > 10
- **Repeat Core Contributors:** Core contributors with 2+ PRs. Target: Growing
- **BMI (Backlog Management Index):** Closed issues / Opened issues. Target: > 1.0

### Dashboards

**Health & Trends Dashboard**

For team review meetings. Shows trends over time:
- PR/Issue response times (trend)
- Success rates (trend)
- Open items count (trend)
- Contributor growth (trend)
- Stars/downloads (trend)

**Oncall Operations Dashboard**

For oncall to find items needing attention. Prioritized lists:
1. Items awaiting maintainer response (last comment from community member)
2. SLA breaches (> 3 days without response)
3. First-time core contributor PRs (need extra care)
4. Oldest open items
5. High-priority labeled items

### Alerting

**Phase 1 (Now):** Manual review of metrics in weekly oncall handover.

**Phase 2 (Near-term):** Slack alert when items exceed 3 days without response.

**Phase 3 (Future):** SLA breach creates internal Sev2.5 ticket for stale items.

---

## Part 5: Visibility

Observability (Part 4) is about us seeing community health. Visibility is about the community seeing our plans and thinking.

### Why It Matters

Contributors need context to contribute effectively. If they don't know our roadmap, they might spend a week on a PR we'll reject because it doesn't align with direction. If they don't understand our design principles, their code won't match our patterns.

Visibility also builds trust. When we explain why we make decisions, the community understands we're not arbitrary gatekeepers.

### What We Publish

**Public Roadmap**

What we're working on and what's coming. This helps contributors:
- Avoid duplicating work we're already doing
- Understand if their feature idea aligns with direction
- Find areas where contributions are welcome

The roadmap should be high-level (themes, not tickets) and updated quarterly.

**Design Principles**

Our mental models for how Strands should work. We already have a Decision Record in the SDK repo that documents design decisions with rationale. We should expand this pattern:
- Model-first approach (let the LLM decide, not hardcoded logic)
- Keep the core SDK lean (tools/providers live separately)
- Hooks as low-level primitives, high-level abstractions built on top
- Prefer composition over inheritance

These help contributors write code that fits our patterns.

**Decision Rationale**

When we make significant decisions (like not accepting external tools), we should explain why. This prevents frustration and helps the community understand our constraints.

---

## Part 6: Processes and Mechanisms

### Oncall Responsibilities

Oncall is responsible for community management for the week.

**Daily Tasks:**
- Check oncall dashboard for urgent items (security issues, SLA breaches)
- Handle security issues immediately (< 24h SLA)

**Twice-Weekly Tasks (Tue/Thu meetings):**
- Triage new issues (label, prioritize, respond)
- Review new PRs (check alignment, assign owners)
- Follow up on items awaiting response

**Weekly Tasks:**
- Review metrics in handover meeting
- Hand off in-progress items to next oncall
- Flag systemic issues to team

**What Oncall is NOT Responsible For:**
- Full code review of all PRs (assign to appropriate maintainer)
- Fixing all bugs (triage and assign)
- 24/7 availability

### PR Ownership Model

**Problem:** PRs fall through cracks. No one owns them end-to-end.

**Solution:** Assign a maintainer to own each core contributor PR during twice-weekly "Community PR and Issue Review" meetings (Tue/Thu). This reduces oncall load and distributes work across the team.

**Process:**
1. During twice-weekly meeting, team reviews new PRs, checks alignment, assigns owners
2. Owner shepherds PR from first review to merge/close
3. Target: ~2 PRs per maintainer per week
4. If contributor doesn't respond in 1 week, owner can drop assignment
5. If we're getting more PRs than we can assign, discuss capacity in the meeting

**Guidelines for Owners:**
- Engineers self-balance based on current load
- Big PRs count as multiple
- Dead PRs (no response > 2 weeks) can be closed or taken over
- When in doubt, ask in team channel or bring up during meetings

### Trusted Contributors (Strands Champions)

Internal engineers and solution architects want to contribute to Strands and be more involved. We can leverage these folks to scale our community management capacity. They're more reliable than random contributors because they have internal accountability and context.

We can later extend this program to outside contributors, but for now this document is focused on internal engineers.

**What they can do:**
- Triage and respond to issues
- Participate in discussions and RFCs
- Review PRs — their approval counts same as maintainers, but they can't merge
- Flag issues/discussions to maintainers via internal channel

**What this enables:**
- Faster response times without adding maintainer headcount
- More eyes on PRs (smaller PRs can be reviewed and approved by trusted contributors, reducing maintainer load)
- Better coverage of community channels

**Status:** We have an initial group of internal SAs interested. Details (commitment, onboarding, recognition) to be figured out as we go.

### Triage Process

**For New Issues:**
1. Review in twice-weekly meeting
2. Add type label: `bug`, `feature`, `question`, `documentation`
3. Add priority: `priority:critical`, `priority:high`, `priority:medium`, `priority:low`
4. Add area: `area:core`, `area:tools`, `area:models`, etc.
5. If good for external contribution: add `ready-for-contribution`
6. Respond to author with acknowledgment

**For New PRs:**
1. Review in twice-weekly meeting
2. Check: Does this align with project direction?
3. If yes: Assign maintainer owner, add `awaiting-review`
4. If no: Provide feedback, close if appropriate
5. If unclear: Ask clarifying questions

### Contribution Guidelines

We need a unified contributor entry point in docs that covers:
- How to contribute to core SDK (core contributors)
- How to contribute new components like tools, model providers (contributors)
- Our decisions and internal thinking (roadmap, design principles)

**What PRs We Accept:**
- Bug fixes with tests
- Documentation improvements
- Performance improvements with benchmarks
- Features that align with roadmap
- Features discussed and approved in issue first

**What PRs We Don't Accept:**
- Features that don't align with project direction
- Breaking changes without prior discussion
- Code without tests
- Large refactors without prior discussion
- Tools to core tools repo (use template instead)

**When to Close PRs:**
- No response from author > 2 weeks after feedback
- Doesn't align with project direction (after discussion)
- Duplicate of existing PR
- Author requests closure

**When to Take Over PRs:**
- Author explicitly allows it
- PR is 90% done, just needs minor fixes
- Critical bug fix that's stalled

---

## Part 7: Automation

We have several agent projects in progress that can help:

- Aaron's bot that generates responses to issues (helps oncall understand issues faster)
- Extend to replicate bugs and generate reproducible code
- Use internal Slack channel to generate draft responses
- Containerized agents for more direct tooling

The idea is to use GitHub and local agents to generate responses and accelerate the team. We optimize these agents internally, then move the same configuration to GitHub Actions for automation. This creates a pipeline for agents to go from internal → GitHub. Along the way we'll need to solve agent permission problems (likely through specialized PAT tokens).

**Use cases:**
- Write/update docs
- Review PRs (enabled by maintainer after alignment check)
- Replicate (and later solve) bugs
- Prioritize items
- SLA breach notifications
- Removing stale items

**Dev tooling approach:** We should build shared dev tools (CLI, containerized agents) that we optimize together as a team. The progression: local tools → Slack notifications based on GitHub events → GitHub Actions responding directly. This lets us iterate quickly internally before exposing to community.

### Agent-Assisted Review

**Goal:** Reduce maintainer burden on mechanical review tasks.

**Concerns:** Avoid Hadoop-style noise where every PR has pages of auto-generated boilerplate. It's demoralizing for contributors.

**Approach:**
- Start with opt-in, not default
- Focus on actionable feedback only
- Summarize issues, don't list every lint error
- Human always makes final decision

**Status:** We have a review agent in progress. Need to invest time to complete and iterate on these projects before broader rollout.

---

## Part 8: Implementation Roadmap

See the complete roadmap at [Task Backlog](./task-backlog.md)

---

## Open Questions

- **Oncall capacity:** Oncall is also responsible for bugs and critical issues. Is adding community management too much? Need to monitor and adjust.
- **Discord moderation:** We may take over an existing Discord from the AgentCore team. Need to confirm feasibility.

---

## TODO:

- Going public from internal discussions
- Define what first response is + guidelines
- in SLAs, maybe split to time to triage, time to resolution
  - Avg First response < 3d
  - Avg Triage < 1w
  - Avg Resolution < 2w
- making triaging public
- note: ready to contribute → pr → review (we should prioritize this)
