Defined in: [src/types/messages.ts:761](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/messages.ts#L761)

Data for a guard content block. Can contain either text or image content for guardrail evaluation.

## Properties

### text?

```ts
optional text?: GuardContentText;
```

Defined in: [src/types/messages.ts:765](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/messages.ts#L765)

Text content with evaluation qualifiers.

---

### image?

```ts
optional image?: GuardContentImage;
```

Defined in: [src/types/messages.ts:770](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/messages.ts#L770)

Image content with evaluation qualifiers.