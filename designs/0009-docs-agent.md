# Strands Documentation Agent/s Review

## Background

Writing documentation for Strands features and capabilities is the important final step
in our development workstream. As an open source SDK, we need to ensure that we have digestible
and informative content so both users and AI agents can effectively leverage functionalities.

By introducing Agent automations into our documentation, we hope to increase developer
velocity and increase quality.

In this document, we overview experimentation using Strands to implement documentation Agents. 
The documentation approaches are not fully solved, but do surface a number of use-case driven domains and features for 
Strands to explore.

## Value Proposition

Although docs sometimes seem like ceremony, they can become tricky and lead to churn.
Patterns and heuristics specific to our website's implementation like the ones above might get missed 
leading to multiple reviews and revisions. Context switching to work on the docs repo and shepherd 
changes through hurts velocity.

## Problem Breakdown

In this proposal, we split the problem space into two distinct domains with corresponding workflows:

1. source change → docs. Event based. A developer has merged a diff and the docs need to reflect it.
2. docs -> source as SOT. Proactive sentinel. As a cron-style async job, the docs-auditor agent checks back-and-forth between the state of the docs and the source code. Inconsistencies are raised as issues and then patched by invoking the docs agent from (1)

Other approaches like batching commit diffs on a schedule could be taken as an alternative. One docs agent run to one commit to main is proposed
to limit the problem space for both the Agent and the developer that needs to approve the Agent's work.

We'll start with an implementation of the docs agent and the lessons learned with various approaches taken during testing.

## Strands Docs Problem Space and Complexities

Since releasing TypeScript side-by-side with Python in the docs, the workflow for creating
effective documentation has become more complicated. TypeScript code samples go in `.ts` snippets
while Python gets inlined in markdown. `<Tabs>` blocks present each language's flavor of a feature,
but the syntax is tricky and presentational balance between examples is important. 

While making a small documentation update for a TS feature, an engineer might find that headings and intro descriptions only present the original Python framing, so updating a page is both mutative and additive.

Code examples need to follow specific formatting and create continuity in examples through consistent 
and effective variable naming, imports, and brevity. Unexpected pages require edits to maintain consistency.

## Runtime/DevEx

Since we're already working in GitHub and have existing GH Actions devtools, we can follow the same
pattern as `/strands impl` and `/strands review` and use GitHub Action runners.

By setting up a GH action workflow, we can automatically run the docs agent on PR merge. We can re-use existing work like the tools and utilities defined in `devtools`.

## Experimentations and Learnings

When I started this work I naively assumed that a documentation automation was going to be really simple in its implementation
and the open questions were going to center around distribution and runtime choices. This did not turn out to be the case. Balancing
correctness and latency has turned out to be really tricky. At the time of writing, the implementation does not solve for latency.

I first reached for a graph because it fit my mental model of the necessary flow.

explore -> doc_writer -> refiner -> validator -> language_parity -> ui_tester

As I experimented with alternatives, I found that the same role-based model had many representations within Strands:

- role as a skill
- role as a subagent
- roles as a system prompt (SOP?)
- unified single agent with SOP

Each approach was back-tested against a representative selection of 6 PR diffs and their corresponding docs changes.

## PRs tested

| PR | Title | Impl repo | Set | Why it's in the set |
|---|---|---|---|---|
| [docs#776](https://github.com/strands-agents/docs/pull/776) | update AgentSkills page to include TS | sdk-typescript#807 | original | cross-SDK parity for an existing page |
| [docs#772](https://github.com/strands-agents/docs/pull/772) | add tool result offload plugin | sdk-python#2162 | original | net-new page + nav + cross-refs |
| [docs#696](https://github.com/strands-agents/docs/pull/696) | migrate `stop_conversation` to `strands_tools.stop` + `request_state` | sdk-python#1954 | original | corpus-wide rename across 7 related pages |
| [docs#690](https://github.com/strands-agents/docs/pull/690) | rename `StructuredOutputException` → `StructuredOutputError` (TS only) | sdk-typescript#709 | held-out | factual trap — must not over-rename Python |
| [docs#695](https://github.com/strands-agents/docs/pull/695) | update `A2AExpressServer` import path to `sdk/a2a/express` | sdk-typescript#721 | held-out | scope discipline — TS only, must not touch Python |
| [docs#744](https://github.com/strands-agents/docs/pull/744) | TS agent-as-tool + `agent.cancel()` | sdk-typescript#768 + #781 | held-out | scattered 10-file coverage + multi-PR input |

Trends emerged:

1. Condensing the entire pipeline into a single skill or agent prompt was less effective than a graph with the same directive.
2. Domain specific language in prompts/SOPs recovered a single prompt to perform similarly to a graph. This aligns with what we've seen in 
many domains.
3. Since Strands graph nodes pass full context between edges, context overflow is a risk and latency is very high
4. Breaking out each node into a distinct skill was similarly effective but much slower than a unified system prompt.
5. Breaking out the explore phase into a separate process--either as an agent-as-tool or a skill--was less correct than describing the phase in the system prompt.
6. The most dramatic finding was the improvements seen by pulling out the audit phase into an agent-as-tool with a fresh context. An agent with a context
window containing writes and write instructions consistently missed bugs that a critique-focused agent found.

### File Exploration

Across all methods attempted the comprehensiveness of the explore phase was the most important factor in effectiveness.
There are two considerations we might take for useful dedicated vended tools:

1. A grep tool (find instances within files)
2. A glob tool (find relevant files)

Popular tools like Claude Code and Cursor use both. Depending on the use case something like [file_read](https://github.com/strands-agents/tools/blob/main/src/strands_tools/file_read.py) or a bash/shell tool also give the Agent a path to file exploration, but well-scoped tools that can give easier
surface area for Models to construct tool calls and importantly batch calls have a strong value proposition.

Even more than vending additional file exploration tools, we can consider what it might look like to vend out something as specific as a 
`FileExplorationAgent` which combines shell, grep, and glob tools. 

Owning fully implemented Agents/sub-agents, system prompts included, would be a new space for Strands. Perhaps it fits
into our thinking around Agent harnesses, or could slot in somewhere else. Just the tools would be a win too.

## Proposed Docs Agent Pipeline

To handle the different contexts where the docs agent needs to run (pr, issue, revision) we add contextualize skills as the first step in the 
pipeline for each event type. 

We re-use the S3SessionManager approach used by the existing Strands /impl command so the agent has the full context from the previous run.

```
  INPUT TYPE: pr        →  (nothing extra)
  INPUT TYPE: issue     →  {contextualize-issue}      skill
  INPUT TYPE: revision  →  {contextualize-comments}   skill + S3SessionManager
                                    │
                                    ▼
  MAIN AGENT (unified instructions)
    [explore → doc-writer → refiner → validator]
                  ▲                       │
       findings   │                       ▼
                  │              [audit] sub-agent
                  │                       │
                  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
                  │                       ▼
                  │          rendering-sensitive? ──no──▶ done
                  │                       │yes
                  │                       ▼
                  └ ─ ─ ─ ─ ─ ─ ─ [ui-tester] sub-agent

  {skill}   = Strands skill, dynamically invoked by the main agent
  [sub]     = fresh-context sub-agent exposed as a tool via agent.as_tool()
  ─ ─ ─     = findings from audit/ui-tester re-enter doc-writer, which re-runs
```

### Limitations: Latency and Cost

While experimenting, I optimized for correctness which was unfortunately paired with high latency between 10–20 minutes for 
medium to large diffs. Similarly, token inputs grew very quickly towards 1-5M input tokens per run.

In terms of speccing an acceptable solution for our own dev tools, we should decide on an acceptable level of
latency for docs generation. When comparing to other code generation tools like CC/Codex, it's troubling that
the role style design experimented with was so latent.

Just a single Agent alone with the same tool set also had a high baseline latency of ~5-12 minutes.

In terms of signing off on the docs agent, perhaps the current 7-15 minutes is acceptable. In any
case, it would be interesting to see how latency could be significantly reduced. Since the system doesn't have
too many moving parts, it might come down to the familiar prompt and tool quality.

Returning to the topic of exploration and file exploration, supporting batch grep/glob inputs/outputs in those
tools and adding explicit language in the system prompt encouraging the model to ask for parallel batched calls
to those tools saw a ~20% speedup in total runtime in head-to-head comparison. 

We can note that efficiency gains such as these are really tricky from the
SDK point of view since outcomes are very sensitive to prompt and tool implementations.

### Limitations: Alternative Approaches

Whether nodes in a formal Graph, skills, steps in a system prompt, steps in an SOP, or subagents, all of the
attempts followed a similar shape. I varied attempts over model by comparing Sonnet and Opus as well as tinkering
with config settings like max tokens, thinking budgets, and interleaved thinking.

A dedicated Strands code harness could serve as a valuable testing ground for improving latency while maintaining
correctness over the heavily model-driven tools loop explored here.

To get closer to CC/Codex-level latency on this kind of task likely requires making significant progress on lifting the "brain" of
the system up a level where decisions can be fast. Instead of asking the primary agent to repeatedly decide when to search, what to read, how much 
context to carry forward, when to validate, and when to retry, a harness could make those decisions explicitly and cheaply.

### Alternative: Single Agent

Since there were a number of variables (namely tools and prompts) that were changing during experimentation, I ran
a final single Agent + unified SOP vs the proposed pipeline with an audit sub-agent and a corresponding fix pass.

Similarly to the initial unified prompt and agent attempt, the proposed pipeline with a fresh audit-subagent was
more latent (~15%) but more correct: it caught 3 items over the 6 PR corpus missed by the single agent.

Although iterating on the single Agent is viable, I'd bias towards pushing on a new design pattern for our devtools.
Also, in the immediate term we are seeing better correctness which should save developer bandwidth.

### Distribution: How to Kick Off GH Action Runs

Ideally, when a PR is merged, a docs issue is cut `/strands docs` is commented in the issue and the documentation 
agent kicks off automatically. Unfortunately, unless we break our current pattern and give our GH action runner
broader cross-repo permissions through a more permissive PAT (AFAIK this was explicitly rejected), devs will need
to cut issues and kick off the agent manually.

Fortunately, this flow can be achieved without cross-repo concerns and full automation once we achieve a monorepo which
should be coming quickly in the roadmap.

So, for now starting with the re-usable `/strands docs` runner is a no-regret choice.

### Why not run this locally with a SKILL.md

By using GH actions, we ideally offload mental overhead into an automation. We also can write more elaborate designs
than a SKILL.md directive. And importantly we gain an opportunity to dogfood our SDK.

It's worth noting that when we move to a monorepo, a local skill becomes easier to write (can make assumptions
about where all the relevant files are). A docs skill can also live next to a GH actions automation.

### Measuring Effectiveness

Since dev tool automations are highly ambiguous problems we should expect to iterate on our approach. To help
guide when and how to iterate, we can collect opt-in feedback on the quality of the outputs.

In our GitHub environment a feedback comment automation would be a simple solution.

Using the available GitHub emojis:

```
<!-- strands-automations-feedback:docs-agent -->  # invisible to user

Rate `/strands docs agent` output on this PR:

👍 → good / acceptable
👎 → bad / incorrect
👀 → neutral / needs review
```

We can also apply the same approach to our existing `/impl` and `/review` workflows. The biggest downside of the
approach is creating noise due to 1:1 relationship between workflow and feedback comment.

Within GitHub, a single comment with all workflows that ran would be the multi-workflow alternative:

```
<!-- strands-automations-feedback:review-agent -->  # invisible to user

Strands Review Agent

[] good / acceptable
[] bad / incorrect
[] neutral / needs review

<!-- strands-automations-feedback:docs-agent -->  # invisible to user

Strands Docs Agent

[] good / acceptable
[] bad / incorrect
[] neutral / needs review
```

Devs would edit the comment to leave feedback. Alternatively this approach could use an X/10 feedback system too.

## Docs Audit Agent

Returning to the second half of proposed docs automations, by inverting the problem and framing it from docs -> source, 
we may catch a set of improvements that the docs agent can't. To best set up our Agent for success, it is preferable to operate 
over source code instead of directly in the browser against our live website through something like Playwright. Source code gives the LLM the relevant text the most directly.

### Designs Considered

When first considering this problem space, I first reached for a fully agent-centric pattern where a top level orchestrator
Agent called tools to identify the relevant domain of doc files to verify and then spawned N independent Agents to tackle it.

Approaches like these could be attempted by using the `use_agent` tool in the community tools repo or alternatively by using the
experimental agent-as-config approach. However, both options are not ideal for a clean orchestrator–worker implementation: 
they only support sequential, blocking invocations. 

In short, these tools allow the main agent to spawn individual Agents, but don't feel like a purpose-built orchestrator-worker
protocol/abstraction. 

Upcoming async/background tools would be a necessary piece to provide such constructs. With background agents-as-tools, a construct
that includes flows to ping, restart, and kill Agents would be enabled.

### Deterministic Flow

For our specific audit use case, it suffices to run deterministic code as the orchestrator of independent Strands Agent instances.

First, enumerate all of the relevant docs files (known directory paths), and then for each file spin up a validator Agent which 
writes its result to a local results manifest.

### Coordinating Concurrent Agents

A small tool-as-class `SharedLedger` can be used to accommodate many Agents interacting with the same file. Each Agent has a `write_ledger`
tool and can fire-and-forget. The tool itself is a class that can maintain state with a lock to prevent conflicting writes. If a conflicting
write comes in, the class buffers the write in memory and then writes it when the lock is released. This achieves an append-only common log.

Although the local file ledger is a fairly simple mechanism: the overall topic of vending tooling that simplifies multi-agent coordination
without giving responsibility to the user to implement some other coordination approach like A2A could be promising. Even the `SharedLedger`
idea could become much more complicated if it tries to reconcile writes, trying to honor the original destination intent instead of append only.

### One Agent Instead?

A single Agent could also reasonably work through the same problem space. Since the corpus is large,
this Agent would likely need to effectively manage its context when it hits overflow.

We'd lose two things by taking that choice: 

1) The opportunity to dogfood concurrent agent coordination tooling
2) Fresh context windows for more pointed validation
3) Latency (Not really important since this is cron-style)

### Balancing Signal/Noise

The docs audit agent has the potential to be very annoying. If it flags issues which are not definitive, issues which were already flagged,
or produces any other erroneous output, we will be tempted to turn it off.

Accordingly, we can tune the auditor to only raise flat-out wrong representations of the SDK backed by a citation to the code. Originally,
I thought the audit agent might want to flag subjective concerns like readability, but without a clear contract of right and wrong for a 
proactive Agent we risk noise.

### Audit -> Implementation Flow

To avoid overloading roles, the end result of the documentation auditor can be to check existing open issues for duplicates, cutting issues 
for what was flagged, and then commenting `/strands docs` on those issues. We re-use the purpose-built agent for the implementation piece.

## Recommendation

Start with a reusable `/strands docs` GitHub Actions runner using the proposed main-agent + fresh audit-subagent pipeline. Treat the current latency as acceptable for initial dogfooding, but track it explicitly. Defer fully automatic PR-merge kickoff until the monorepo removes cross-repo permission issues.

Use this workflow as a testbed for batch grep/glob tools, workflow feedback collection, and future multi-agent coordination primitives.

## Conclusion

With the understanding that we're expecting to iterate, building out the proposed docs agent and audit agent would have rough edges, but should
deliver immediate value.

If we align on moving forward with implementation, the main open question is whether to start with the reusable `/strands docs` runner now, or wait for the monorepo to avoid short-lived wiring. 

Either way, the experiment surfaced useful Strands follow-up areas: file exploration tools, fresh-context audit patterns, workflow feedback collection, and multi-agent coordination.

We also might look to convert some of the learnings around "how do I model my multi-step workflow in Strands" into a page in our docs.

## Appendix: Additional cron workflows?

If we align to introduce our docs audit agent which would involve setting up a cron-style GH Action, we can briefly consider related 
opportunities for async/long-running workflows.

### Browser Based Async Agents

Many useful async agents might need to use the internet. Effectively searching the internet is a huge problem space
with many existing tools.

OpenAI, Gemini, Anthropic, and Perplexity all offer deep research features. More towards the SDK side, Langchain offers
a [DeepAgents](https://github.com/langchain-ai/deepagents) framework, which is an opinionated harness for running long term tasks
like deep research.

In the current state of Strands, leveraging an existing API based search tool like Perplexity, Tavily, or Exa (all of which have
existing community integrations) would give a clear path to synthesizing information from the web.

A concise workflow like a weekly digest of news and releases about the biggest SDKs and agent products (code harnesses, 
CLI's, etc) could be a good starting point to initialize a browser-based workflow.

Going forward, building more elaborate harness-like constructs around a weekly research digest could be centered around enabling
longer running sessions that leverage multiple co-operative agents.

### Other Ideas Explored

An async workflow that improves the code base is difficult to land on. I considered a workflow that scans integ tests for soon to be
retired model-ids, but I thought it was too narrow of a use case.

Scanning code and looking for opportunities to add inline comments clarifying ambiguities to help future coding agents seemed very noisy and 
with a speculative value proposition.

Security scanning is valuable but is outside of the team's specialization. Since it's critical, it's potentially better to try a managed service
here.
