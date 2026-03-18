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

Defined in: [src/types/media.ts:141](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/types/media.ts#L141)

Source for an image (Data version). Supports multiple formats for different providers.