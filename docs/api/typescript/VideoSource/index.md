```ts
type VideoSource =
  | {
  type: "videoSourceBytes";
  bytes: Uint8Array;
}
  | {
  type: "videoSourceS3Location";
  s3Location: S3Location;
};
```

Defined in: [src/types/media.ts:308](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/types/media.ts#L308)

Source for a video (Class version).