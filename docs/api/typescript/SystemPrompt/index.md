```ts
type SystemPrompt = string | SystemContentBlock[];
```

Defined in: [src/types/messages.ts:642](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/messages.ts#L642)

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