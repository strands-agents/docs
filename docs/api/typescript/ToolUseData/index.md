Defined in: [src/hooks/events.ts:106](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L106)

Mutable tool-use descriptor carried on tool-call hook events. Matches the shape of the tool use block the model emitted; hooks on [BeforeToolCallEvent](/docs/api/typescript/BeforeToolCallEvent/index.md) may mutate its fields (or reassign the object) to rewrite the input, id, or tool name before the tool executes.

## Properties

### name

```ts
name: string;
```

Defined in: [src/hooks/events.ts:107](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L107)

---

### toolUseId

```ts
toolUseId: string;
```

Defined in: [src/hooks/events.ts:108](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L108)

---

### input

```ts
input: JSONValue;
```

Defined in: [src/hooks/events.ts:109](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L109)