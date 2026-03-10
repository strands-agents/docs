Defined in: [src/types/media.ts:441](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/types/media.ts#L441)

Data for a document block.

## Properties

### name

```ts
name: string;
```

Defined in: [src/types/media.ts:445](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/types/media.ts#L445)

Document name.

---

### format

```ts
format: DocumentFormat;
```

Defined in: [src/types/media.ts:450](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/types/media.ts#L450)

Document format.

---

### source

```ts
source: DocumentSourceData;
```

Defined in: [src/types/media.ts:455](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/types/media.ts#L455)

Document source.

---

### citations?

```ts
optional citations: {
  enabled: boolean;
};
```

Defined in: [src/types/media.ts:460](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/types/media.ts#L460)

Citation configuration.

#### enabled

```ts
enabled: boolean;
```

---

### context?

```ts
optional context: string;
```

Defined in: [src/types/media.ts:465](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/types/media.ts#L465)

Context information for the document.