Defined in: [src/types/messages.ts:555](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/types/messages.ts#L555)

JSON content block within a message. Used for structured data returned from tools or model responses.

## Implements

-   `JsonBlockData`
-   `JSONSerializable`<`JsonBlockData`\>

## Constructors

### Constructor

```ts
new JsonBlock(data): JsonBlock;
```

Defined in: [src/types/messages.ts:566](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/types/messages.ts#L566)

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

Defined in: [src/types/messages.ts:559](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/types/messages.ts#L559)

Discriminator for JSON content.

---

### json

```ts
readonly json: JSONValue;
```

Defined in: [src/types/messages.ts:564](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/types/messages.ts#L564)

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

Defined in: [src/types/messages.ts:574](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/types/messages.ts#L574)

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

Defined in: [src/types/messages.ts:584](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/types/messages.ts#L584)

Creates a JsonBlock instance from JsonBlockData.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | `JsonBlockData` | JsonBlockData to deserialize |

#### Returns

`JsonBlock`

JsonBlock instance