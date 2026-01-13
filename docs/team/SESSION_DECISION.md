# Decision Record

A record of design and Goal with their rationale, enabling prior decisions to guide future ones.

## Session manager Goal and Implementation Strategy

**Date**: Jan 12, 2026

**Participants**: @JackYPCOnline, @zastrowm, @Unshure

### Context

Current session manager stores/restores full message history linearly causing:
 - Slow initial load times for long-running agent
 - High memory pressure during deserialization 
 - High storage cost as conversation grow
 - Inefficient load messages when only recent context needed

Based on two most common use cases - chat agent & coding agent, new session manager should serve 2 basic goals and 1 stretch goal:

- Basic: agent should be able to restore to original state
- Basic: agent should preserve historical messages.
- Stretch: agent should have time travel capability.

### Considered Option

Option 1: Simple Session Manager (snapshot whole agent + full messages each checkpoint)

- Pros

    - Captures all changes including “weird hooks” that mutate agent state/messages 
    - Easy to reason about; rollback is simple

- Cons

    - High storage duplication (repeated messages in every snapshot)
    - Slow writes and larger objects over time
    - Still does not directly enable ChatGPT UI branching unless we also store edit/version metadata 
    - Restore may still bring full history into memory unless bounded

Option 2: “Smart” Session Manager (snapshot agent, no messages; rely on ConversationManager)

- Pros

    - Efficient checkpoint size

- Cons

    - If agent/messages are mutated outside ConversationManager, persistence becomes incomplete
    - Restoring working context may require scanning long history unless extra indexes exist 
    - Does not inherently support UI branching/history requirements.


### Decision

Hybrid session manager

This combines the strengths:
- Transcript graph satisfies chat UI requirements (full history + branching)
- Checkpoint_latest satisfies coding agent requirements (O(1) restore of state + bounded context)
- Snapshots enable time travel where correctness is required (stateful rollback)


### Rationale

We need to support two different use cases:

- Chat UI: The UI requires full history and branching/version navigation (edit earlier message → new branch) similar to ChatGPT. That requires a transcript graph (nodes + parent pointers), because snapshots/checkpoints alone cannot represent message-level branches or show sibling versions.

- Coding agent: Stateful agents require fast, correct resume without replaying history or issuing N S3 reads. This requires a self-contained latest checkpoint that restores tool/runtime state and a bounded working context in O(1) reads.

We NEED to introduce:

Transcript Graph (history + branching),this enables: full conversation rendering in UI, branching when editing an earlier message, version switching by selecting a different branch head.

Checkpoint/Snapshot (latest, periodic), this is a single, resume-ready object containing: agent state, conversation manager state, bounded working context (messages the agent uses next), current branch.


### Action Items:

We should redesign the session management interface and strategy to achieve O(1) recovery and branching capability. We SHOULD move away from the current approach of storing each message as a single appended file, while ensuring the user experience remains simple and intuitive.

This involves three major aspects:

- Redesign interface to separate business layer and storage layer.
- Revamp agent serialization to separate code and data.
- Design dataclass to hold agent state, working context and historical messages.



 




