```ts
type SystemPrompt = string | SystemContentBlock[];
```

Defined in: [src/types/messages.ts:673](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/types/messages.ts#L673)

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