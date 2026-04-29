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

Defined in: [src/types/media.ts:141](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/types/media.ts#L141)

Source for an image (Data version). Supports multiple formats for different providers.