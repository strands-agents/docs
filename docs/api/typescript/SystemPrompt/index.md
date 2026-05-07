```ts
type SystemPrompt = string | SystemContentBlock[];
```

Defined in: [src/types/messages.ts:675](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L675)

System prompt for guiding model behavior. Can be a simple string or an array of content blocks for advanced caching.

## Example

```typescript
// Simple string
const prompt: SystemPrompt = 'You are a helpful assistant'

// Array with cache points for advanced caching
const prompt: SystemPrompt = [
  { textBlock: new TextBlock('You are a helpful assistant') },
  { textBlock: new TextBlock(largeContextDocument) },
  { cachePointBlock: new CachePointBlock({ cacheType: 'default' }) }
]
```