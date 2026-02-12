# Agents in the Workplace

## Introduction

Software development is changing. AI agents are no longer just tools we build—they're becoming collaborators in how we build. They review our code, respond to issues, draft documentation, and increasingly, write code alongside us. This shift isn't hypothetical; it's happening now, and we're part of it.

At Strands, we've been experimenting with agents across our development workflow. We've built GitHub Actions that trigger agent reviews on pull requests. We have agents that help triage issues, draft release notes, and assist with documentation. We've even started running autonomous agents on schedules—agents that identify improvements and submit PRs without explicit human prompting.

Some of these experiments have worked beautifully. Others have failed spectacularly (more on that later). Both outcomes are valuable. The failures teach us where the guardrails need to be, and the successes show us what's possible when agents are thoughtfully integrated into development workflows.

This document captures what we've learned and establishes the principles we follow when building agents that interact with our repositories.

## Why This Matters

As the team behind an AI agent SDK, we have a unique responsibility. We're not just building tools for others to create agents—we should be using those tools ourselves. If we're asking developers to trust Strands for their agent development, we need to demonstrate that trust in our own workflows.

There's also a practical benefit: dogfooding. Every agent we build on Strands teaches us something about the SDK's strengths and limitations. When an agent struggles with a task, that's signal about where the framework needs improvement. When an agent succeeds, that's a pattern we can share with the community.

Beyond our own learning, this is simply where software development is heading. The teams that figure out how to effectively collaborate with AI agents will have a significant advantage. We want to be at the forefront of that experimentation—not following others, but leading with our own discoveries.

That said, experimentation without guardrails is reckless. We've learned this firsthand. An early version of [Strands Coder](https://github.com/cagataycali/strands-coder)—an autonomous agent designed to improve codebases—once started commenting on repositories it wasn't supposed to touch. No damage was done, but it was a clear reminder: agents need boundaries, and those boundaries need to be explicit.

This document exists because innovation and safety aren't opposites. They're partners. The goal is to enable bold experimentation while ensuring we can always recover from mistakes.


## Guidelines

The following guidelines govern how we develop and deploy agents that interact with Strands repositories. Each guideline includes the reasoning behind it and, where applicable, concrete examples of what good and bad look like.

### General


### Add Value or Stay Silent

**If an agent doesn't have something concrete to contribute, it should stay silent.**

The goal isn't to have agents participate everywhere—it's to have them participate where they're helpful. An agent comment that restates what's already obvious adds nothing. An agent review that approves without substance is noise. An agent that indiscriminately picks up work creates more problems than it solves.

Before an agent acts, it should have something worth doing:
- A reproducible test case for a bug report
- An actionable suggestion in a code review
- A clarifying question that moves the discussion forward
- A well-defined issue that's ready for implementation

When in doubt, the agent should flag for human review rather than act independently. Silence is better than noise. It's better to miss an opportunity than to take the wrong action.

### Security


### Scope Credentials to the Task

**The tokens you give an agent determine what it can do. Plan for the worst case.**

When an agent has credentials, it has capabilities. If those credentials allow destructive actions—deleting branches, force-pushing, modifying repository settings—then a misbehaving agent can cause real damage. The principle is simple: give agents the minimum permissions they need, nothing more.

For task-specific agents (code review, documentation generation, issue triage), use tokens scoped to exactly those capabilities. A code review agent doesn't need write access to the repository; it needs read access to code and write access to comments.

For general-purpose agents where scoping is difficult, use credentials from an external account (like `strands-agent`) rather than maintainer accounts. External accounts have the same permissions as any community member—they can comment and open PRs, but they can't merge, delete, or modify protected resources. The worst case becomes "excessive commenting" rather than "repository corruption."

**Never give agents maintainer tokens.** Maintainer tokens allow destructive actions that may be difficult or impossible to reverse. No experiment is worth that risk.


### Communication


### Keep It Short

**Walls of text help no one. Say what matters, then stop.**

Agents are verbose by default. Left unchecked, they'll produce paragraphs where a sentence would suffice. This creates noise that drowns out signal—both for maintainers trying to review and for community members trying to follow discussions.

Agent comments should be concise. Get to the point. If there's additional context that might be useful, use progressive disclosure—put it in a collapsible section that readers can expand if they want it.

```html
Here's the key finding: the null check on line 42 can throw if `config` is undefined.

<details>
<summary>Full analysis (click to expand)</summary>

[Detailed agent analysis here]

</details>
```

This pattern respects readers' time while still making detailed information available.

**Good example:** [strands-agents/sdk-python#1581](https://github.com/strands-agents/sdk-python/pull/1581#issuecomment-3844346601) — Human summary up front, detailed agent analysis in expandable sections.

**Bad example:** [apache/hadoop#8136](https://github.com/apache/hadoop/pull/8136#issuecomment-3657313759) — Massive automated report with no summary, no progressive disclosure, difficult to parse.


### Autonomous Agents

The following guidelines apply specifically to autonomous agents—those that act without explicit human triggering.


### Throttle Activity

**Don't flood the repository. Maintainers need to keep up.**

Even when an agent is doing good work, too much activity becomes overwhelming. If an agent opens ten PRs in an hour, maintainers can't review them thoughtfully. If it comments on every issue in a day, the notification noise becomes unbearable.

**Default limit: 5 actions per hour per agent** (PRs opened, reviews posted, comments made, etc.). This can be adjusted with team agreement for specific use cases, but the default should be conservative.

The goal is sustainable pace. Agents should work at a speed that humans can follow and respond to. Remember: our repositories exist for humans to collaborate. Agents are there to help, not to dominate. The community should feel like they're interacting with a project maintained by people, with agents as helpful assistants—not the other way around.


### Monitor What Agents Do

**You can't fix what you can't see.**

Every agent that interacts with our repositories should have visibility into its actions. What did it do? When? On which repositories? How often?

This isn't about distrust—it's about operational awareness. When something goes wrong (and eventually something will), we need to be able to quickly understand what happened and why. When things go right, we want to learn from those patterns too.

Monitoring should capture:
- Actions taken (comments, PRs, reviews)
- Repositories affected
- Frequency and timing
- Success/failure outcomes

The specifics of implementation will vary, but the principle is non-negotiable: if an agent acts, we should be able to see that it acted.


### Own What You Deploy

**Every agent needs an owner. If there are problems, someone fixes them or shuts them down.**

Autonomous agents can't be orphans. When an agent misbehaves—posting incorrect information, spamming repositories, or just not working as intended—someone needs to be responsible for addressing it.

Before deploying an autonomous agent:
- Identify the owner (a person, not a team)
- Ensure the owner can access logs and controls
- Document how to disable the agent if needed

If the owner leaves or becomes unavailable, ownership must transfer. An agent without an owner gets disabled until someone claims it.

Ownership also means cleanup. Agents will make mistakes—they'll post comments that don't make sense, open PRs that shouldn't exist, or take actions that need to be reversed. When this happens, the owner is responsible for cleaning up. Delete the errant comments. Close the bad PRs. Revert the changes. The repository should look like the mistake never happened.


### Maintainers Can Pull the Cord

**If all else fails, maintainers can shut it down.**

No matter how well-designed an agent is, there needs to be an escape hatch. Repository maintainers must have the ability to disable any agent operating on their repository, immediately and without negotiation.

This is the Andon cord principle: anyone who sees a problem can stop the line. For agents, this means:
- Maintainers know how to disable each agent
- Disabling is fast (minutes, not hours)
- No approval process is required in emergencies

This authority exists even if the maintainer isn't the agent's owner. Repository health takes precedence over agent operation.

## Next Steps

Once we align on these guidelines, we'll add a condensed version to `team/AGENT_GUIDELINES.md` in the docs repo, following the same format as `DECISIONS.md`. That will be the living reference document; this doc provides the full context and rationale behind each guideline.
