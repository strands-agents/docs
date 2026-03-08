Defined in: [src/types/messages.ts:748](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/types/messages.ts#L748)

Data for a guard content block. Can contain either text or image content for guardrail evaluation.

## Properties

### text?

```ts
optional text: GuardContentText;
```

Defined in: [src/types/messages.ts:752](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/types/messages.ts#L752)

Text content with evaluation qualifiers.

---

### image?

```ts
optional image: GuardContentImage;
```

Defined in: [src/types/messages.ts:757](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/types/messages.ts#L757)

Image content with evaluation qualifiers.