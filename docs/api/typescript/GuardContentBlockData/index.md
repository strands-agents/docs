Defined in: [src/types/messages.ts:794](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/types/messages.ts#L794)

Data for a guard content block. Can contain either text or image content for guardrail evaluation.

## Properties

### text?

```ts
optional text?: GuardContentText;
```

Defined in: [src/types/messages.ts:798](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/types/messages.ts#L798)

Text content with evaluation qualifiers.

---

### image?

```ts
optional image?: GuardContentImage;
```

Defined in: [src/types/messages.ts:803](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/types/messages.ts#L803)

Image content with evaluation qualifiers.