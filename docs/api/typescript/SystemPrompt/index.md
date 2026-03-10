```ts
type SystemPrompt = string | SystemContentBlock[];
```

Defined in: [src/types/messages.ts:627](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/messages.ts#L627)

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