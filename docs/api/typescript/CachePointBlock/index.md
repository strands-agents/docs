Defined in: [src/types/messages.ts:547](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/types/messages.ts#L547)

Cache point block for prompt caching. Marks a position in a message or system prompt where caching should occur.

## Implements

-   [`CachePointBlockData`](/docs/api/typescript/CachePointBlockData/index.md)
-   `JSONSerializable`<{ `cachePoint`: [`CachePointBlockData`](/docs/api/typescript/CachePointBlockData/index.md); }>

## Constructors

### Constructor

```ts
new CachePointBlock(data): CachePointBlock;
```

Defined in: [src/types/messages.ts:558](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/types/messages.ts#L558)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | [`CachePointBlockData`](/docs/api/typescript/CachePointBlockData/index.md) |

#### Returns

`CachePointBlock`

## Properties

### type

```ts
readonly type: "cachePointBlock";
```

Defined in: [src/types/messages.ts:551](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/types/messages.ts#L551)

Discriminator for cache point.

---

### cacheType

```ts
readonly cacheType: "default";
```

Defined in: [src/types/messages.ts:556](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/types/messages.ts#L556)

The cache type. Currently only ‘default’ is supported.

#### Implementation of

[`CachePointBlockData`](/docs/api/typescript/CachePointBlockData/index.md).[`cacheType`](/docs/api/typescript/CachePointBlockData/index.md#cachetype)

## Methods

### toJSON()

```ts
toJSON(): {
  cachePoint: CachePointBlockData;
};
```

Defined in: [src/types/messages.ts:566](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/types/messages.ts#L566)

Serializes the CachePointBlock to a JSON-compatible ContentBlockData object. Called automatically by JSON.stringify().

#### Returns

```ts
{
  cachePoint: CachePointBlockData;
}
```

| Name | Type | Defined in |
| --- | --- | --- |
| `cachePoint` | [`CachePointBlockData`](/docs/api/typescript/CachePointBlockData/index.md) | [src/types/messages.ts:566](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/types/messages.ts#L566) |

#### Implementation of

```ts
JSONSerializable.toJSON
```

---

### fromJSON()

```ts
static fromJSON(data): CachePointBlock;
```

Defined in: [src/types/messages.ts:580](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/types/messages.ts#L580)

Creates a CachePointBlock instance from its wrapped data format.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | { `cachePoint`: [`CachePointBlockData`](/docs/api/typescript/CachePointBlockData/index.md); } | Wrapped CachePointBlockData to deserialize |
| `data.cachePoint` | [`CachePointBlockData`](/docs/api/typescript/CachePointBlockData/index.md) | \- |

#### Returns

`CachePointBlock`

CachePointBlock instance