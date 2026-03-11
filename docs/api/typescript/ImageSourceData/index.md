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

Defined in: [src/types/media.ts:174](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/types/media.ts#L174)

Source for an image (Data version). Supports multiple formats for different providers.