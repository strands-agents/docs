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

Defined in: [src/types/media.ts:141](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/media.ts#L141)

Source for an image (Data version). Supports multiple formats for different providers.