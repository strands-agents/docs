Defined in: [src/types/messages.ts:568](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/types/messages.ts#L568)

JSON content block within a message. Used for structured data returned from tools or model responses.

## Implements

-   `JsonBlockData`
-   `JSONSerializable`<`JsonBlockData`\>

## Constructors

### Constructor

```ts
new JsonBlock(data): JsonBlock;
```

Defined in: [src/types/messages.ts:579](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/types/messages.ts#L579)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | `JsonBlockData` |

#### Returns

`JsonBlock`

## Properties

### type

```ts
readonly type: "jsonBlock";
```

Defined in: [src/types/messages.ts:572](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/types/messages.ts#L572)

Discriminator for JSON content.

---

### json

```ts
readonly json: JSONValue;
```

Defined in: [src/types/messages.ts:577](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/types/messages.ts#L577)

Structured JSON data.

#### Implementation of

```ts
JsonBlockData.json
```

## Methods

### toJSON()

```ts
toJSON(): JsonBlockData;
```

Defined in: [src/types/messages.ts:587](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/types/messages.ts#L587)

Serializes the JsonBlock to a JSON-compatible JsonBlockData object. Called automatically by JSON.stringify().

#### Returns

`JsonBlockData`

#### Implementation of

```ts
JSONSerializable.toJSON
```

---

### fromJSON()

```ts
static fromJSON(data): JsonBlock;
```

Defined in: [src/types/messages.ts:597](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/types/messages.ts#L597)

Creates a JsonBlock instance from JsonBlockData.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | `JsonBlockData` | JsonBlockData to deserialize |

#### Returns

`JsonBlock`

JsonBlock instance