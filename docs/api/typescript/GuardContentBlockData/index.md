Defined in: [src/types/messages.ts:763](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/messages.ts#L763)

Data for a guard content block. Can contain either text or image content for guardrail evaluation.

## Properties

### text?

```ts
optional text?: GuardContentText;
```

Defined in: [src/types/messages.ts:767](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/messages.ts#L767)

Text content with evaluation qualifiers.

---

### image?

```ts
optional image?: GuardContentImage;
```

Defined in: [src/types/messages.ts:772](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/messages.ts#L772)

Image content with evaluation qualifiers.