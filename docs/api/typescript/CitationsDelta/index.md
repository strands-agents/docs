Defined in: [src/models/streaming.ts:391](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/streaming.ts#L391)

Citations content delta within a content block. Represents a citations content block from the model.

## Properties

### type

```ts
type: "citationsDelta";
```

Defined in: [src/models/streaming.ts:395](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/streaming.ts#L395)

Discriminator for citations content delta.

---

### citations

```ts
citations: Citation[];
```

Defined in: [src/models/streaming.ts:400](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/streaming.ts#L400)

Array of citations linking generated content to source locations.

---

### content

```ts
content: CitationGeneratedContent[];
```

Defined in: [src/models/streaming.ts:405](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/streaming.ts#L405)

The generated content associated with these citations.