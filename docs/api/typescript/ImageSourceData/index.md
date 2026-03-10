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

Defined in: [src/types/media.ts:174](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/media.ts#L174)

Source for an image (Data version). Supports multiple formats for different providers.