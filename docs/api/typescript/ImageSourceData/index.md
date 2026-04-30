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

Defined in: [src/types/media.ts:141](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/types/media.ts#L141)

Source for an image (Data version). Supports multiple formats for different providers.