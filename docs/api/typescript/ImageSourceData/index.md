```ts
type ImageSourceData =
  | {
  bytes: Uint8Array;
}
  | {
  s3Location: S3LocationData;
}
  | {
  url: string;
};
```

Defined in: [src/types/media.ts:174](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/types/media.ts#L174)

Source for an image (Data version). Supports multiple formats for different providers.