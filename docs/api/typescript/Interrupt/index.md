Defined in: [src/interrupt.ts:20](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/interrupt.ts#L20)

Represents an interrupt that can pause agent execution for human-in-the-loop workflows.

## Properties

### id

```ts
readonly id: string;
```

Defined in: [src/interrupt.ts:24](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/interrupt.ts#L24)

Unique identifier for this interrupt.

---

### name

```ts
readonly name: string;
```

Defined in: [src/interrupt.ts:29](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/interrupt.ts#L29)

User-defined name for the interrupt.

---

### reason?

```ts
readonly optional reason?: JSONValue;
```

Defined in: [src/interrupt.ts:34](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/interrupt.ts#L34)

User-provided reason for raising the interrupt.

---

### response?

```ts
optional response?: JSONValue;
```

Defined in: [src/interrupt.ts:39](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/interrupt.ts#L39)

Human response provided when resuming the agent after an interrupt.

## Methods

### toJSON()

```ts
toJSON(): {
  id: string;
  name: string;
  reason?: JSONValue;
  response?: JSONValue;
};
```

Defined in: [src/interrupt.ts:55](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/interrupt.ts#L55)

Serializes the interrupt to a JSON-compatible object.

#### Returns

```ts
{
  id: string;
  name: string;
  reason?: JSONValue;
  response?: JSONValue;
}
```

| Name | Type | Defined in |
| --- | --- | --- |
| `id` | `string` | [src/interrupt.ts:55](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/interrupt.ts#L55) |
| `name` | `string` | [src/interrupt.ts:55](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/interrupt.ts#L55) |
| `reason?` | [`JSONValue`](/docs/api/typescript/JSONValue/index.md) | [src/interrupt.ts:55](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/interrupt.ts#L55) |
| `response?` | [`JSONValue`](/docs/api/typescript/JSONValue/index.md) | [src/interrupt.ts:55](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/interrupt.ts#L55) |