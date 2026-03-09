Defined in: [src/types/messages.ts:748](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/types/messages.ts#L748)

Data for a guard content block. Can contain either text or image content for guardrail evaluation.

## Properties

### text?

```ts
optional text: GuardContentText;
```

Defined in: [src/types/messages.ts:752](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/types/messages.ts#L752)

Text content with evaluation qualifiers.

---

### image?

```ts
optional image: GuardContentImage;
```

Defined in: [src/types/messages.ts:757](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/types/messages.ts#L757)

Image content with evaluation qualifiers.