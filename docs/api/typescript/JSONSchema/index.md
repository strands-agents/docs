```ts
type JSONSchema = JSONSchema7;
```

Defined in: [src/types/json.ts:46](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/json.ts#L46)

Represents a JSON Schema definition. Used for defining the structure of tool inputs and outputs.

This is based on JSON Schema Draft 7 specification.

## Example

```typescript
const schema: JSONSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  },
  required: ['name']
}
```