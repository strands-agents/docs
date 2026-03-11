```ts
type VideoSourceData =
  | {
  bytes: Uint8Array;
}
  | {
  s3Location: S3LocationData;
};
```

Defined in: [src/types/media.ts:303](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/types/media.ts#L303)

Source for a video (Data version).