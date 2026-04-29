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

Defined in: [src/types/json.ts:26](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/types/json.ts#L26)

Represents any valid JSON value. This type ensures type safety for JSON-serializable data.

## Example

```typescript
const value: JSONValue = { key: 'value', nested: { arr: [1, 2, 3] } }
const text: JSONValue = 'hello'
const num: JSONValue = 42
const bool: JSONValue = true
const nothing: JSONValue = null
```