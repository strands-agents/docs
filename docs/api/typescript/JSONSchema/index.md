```ts
type JSONSchema = JSONSchema7;
```

Defined in: [src/types/json.ts:46](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/types/json.ts#L46)

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