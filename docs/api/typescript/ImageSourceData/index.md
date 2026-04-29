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

Defined in: [src/types/media.ts:141](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/types/media.ts#L141)

Source for an image (Data version). Supports multiple formats for different providers.