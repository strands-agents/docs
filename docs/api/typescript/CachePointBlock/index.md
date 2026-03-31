Defined in: [src/types/messages.ts:516](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L516)

Cache point block for prompt caching. Marks a position in a message or system prompt where caching should occur.

## Implements

-   [<code dir="auto">CachePointBlockData</code>](/docs/api/typescript/CachePointBlockData/index.md)
-   `JSONSerializable`<{ `cachePoint`: [<code dir="auto">CachePointBlockData</code>](/docs/api/typescript/CachePointBlockData/index.md); }>

## Constructors

### Constructor

```ts
new CachePointBlock(data): CachePointBlock;
```

Defined in: [src/types/messages.ts:527](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L527)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | [<code dir="auto">CachePointBlockData</code>](/docs/api/typescript/CachePointBlockData/index.md) |

#### Returns

`CachePointBlock`

## Properties

### type

```ts
readonly type: "cachePointBlock";
```

Defined in: [src/types/messages.ts:520](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L520)

Discriminator for cache point.

---

### cacheType

```ts
readonly cacheType: "default";
```

Defined in: [src/types/messages.ts:525](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L525)

The cache type. Currently only ‘default’ is supported.

#### Implementation of

[<code dir="auto">CachePointBlockData</code>](/docs/api/typescript/CachePointBlockData/index.md).[<code dir="auto">cacheType</code>](/docs/api/typescript/CachePointBlockData/index.md#cachetype)

## Methods

### toJSON()

```ts
toJSON(): {
  cachePoint: CachePointBlockData;
};
```

Defined in: [src/types/messages.ts:535](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L535)

Serializes the CachePointBlock to a JSON-compatible ContentBlockData object. Called automatically by JSON.stringify().

#### Returns

```ts
{
  cachePoint: CachePointBlockData;
}
```

| Name | Type | Defined in |
| --- | --- | --- |
| `cachePoint` | [<code dir="auto">CachePointBlockData</code>](/docs/api/typescript/CachePointBlockData/index.md) | [src/types/messages.ts:535](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L535) |

#### Implementation of

```ts
JSONSerializable.toJSON
```

---

### fromJSON()

```ts
static fromJSON(data): CachePointBlock;
```

Defined in: [src/types/messages.ts:549](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L549)

Creates a CachePointBlock instance from its wrapped data format.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | { `cachePoint`: [<code dir="auto">CachePointBlockData</code>](/docs/api/typescript/CachePointBlockData/index.md); } | Wrapped CachePointBlockData to deserialize |
| `data.cachePoint` | [<code dir="auto">CachePointBlockData</code>](/docs/api/typescript/CachePointBlockData/index.md) | \- |

#### Returns

`CachePointBlock`

CachePointBlock instance