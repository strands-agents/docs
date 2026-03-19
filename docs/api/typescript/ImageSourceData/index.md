```ts
type ImageSourceData =
  | {
  bytes: Uint8Array;
}
  | {
  location: S3LocationData;
}
  | {
  url: string;
};
```

Defined in: [src/types/media.ts:141](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/types/media.ts#L141)

Source for an image (Data version). Supports multiple formats for different providers.