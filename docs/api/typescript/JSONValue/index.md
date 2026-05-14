```ts
type JSONValue =
  | string
  | number
  | boolean
  | null
  | {
[key: string]: JSONValue;
}
  | JSONValue[];
```

Defined in: [src/types/json.ts:26](https://github.com/strands-agents/sdk-typescript/blob/13a12727f03fa603a6fe1163a9e2a97bd32f1e8c/strands-ts/src/types/json.ts#L26)

Represents any valid JSON value. This type ensures type safety for JSON-serializable data.

## Example

```typescript
const value: JSONValue = { key: 'value', nested: { arr: [1, 2, 3] } }
const text: JSONValue = 'hello'
const num: JSONValue = 42
const bool: JSONValue = true
const nothing: JSONValue = null
```