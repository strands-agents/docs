Defined in: [src/types/media.ts:398](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/media.ts#L398)

Data for a document block.

## Properties

### name

```ts
name: string;
```

Defined in: [src/types/media.ts:402](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/media.ts#L402)

Document name.

---

### format

```ts
format: DocumentFormat;
```

Defined in: [src/types/media.ts:407](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/media.ts#L407)

Document format.

---

### source

```ts
source: DocumentSourceData;
```

Defined in: [src/types/media.ts:412](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/media.ts#L412)

Document source.

---

### citations?

```ts
optional citations?: {
  enabled: boolean;
};
```

Defined in: [src/types/media.ts:417](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/media.ts#L417)

Citation configuration.

#### enabled

```ts
enabled: boolean;
```

---

### context?

```ts
optional context?: string;
```

Defined in: [src/types/media.ts:422](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/media.ts#L422)

Context information for the document.