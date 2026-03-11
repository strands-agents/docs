Defined in: [src/types/messages.ts:748](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/types/messages.ts#L748)

Data for a guard content block. Can contain either text or image content for guardrail evaluation.

## Properties

### text?

```ts
optional text: GuardContentText;
```

Defined in: [src/types/messages.ts:752](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/types/messages.ts#L752)

Text content with evaluation qualifiers.

---

### image?

```ts
optional image: GuardContentImage;
```

Defined in: [src/types/messages.ts:757](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/types/messages.ts#L757)

Image content with evaluation qualifiers.