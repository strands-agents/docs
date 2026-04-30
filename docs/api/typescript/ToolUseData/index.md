Defined in: [src/hooks/events.ts:104](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/hooks/events.ts#L104)

Mutable tool-use descriptor carried on tool-call hook events. Matches the shape of the tool use block the model emitted; hooks on [BeforeToolCallEvent](/docs/api/typescript/BeforeToolCallEvent/index.md) may mutate its fields (or reassign the object) to rewrite the input, id, or tool name before the tool executes.

## Properties

### name

```ts
name: string;
```

Defined in: [src/hooks/events.ts:105](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/hooks/events.ts#L105)

---

### toolUseId

```ts
toolUseId: string;
```

Defined in: [src/hooks/events.ts:106](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/hooks/events.ts#L106)

---

### input

```ts
input: JSONValue;
```

Defined in: [src/hooks/events.ts:107](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/hooks/events.ts#L107)