Defined in: [src/types/messages.ts:35](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/types/messages.ts#L35)

Data for a message.

## Properties

### role

```ts
role: Role;
```

Defined in: [src/types/messages.ts:39](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/types/messages.ts#L39)

The role of the message sender.

---

### content

```ts
content: ContentBlockData[];
```

Defined in: [src/types/messages.ts:44](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/types/messages.ts#L44)

Array of content blocks that make up this message.

---

### metadata?

```ts
optional metadata?: MessageMetadata;
```

Defined in: [src/types/messages.ts:49](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/types/messages.ts#L49)

Optional metadata, not sent to model providers.