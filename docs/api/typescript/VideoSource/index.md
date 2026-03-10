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

Defined in: [src/types/media.ts:308](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/media.ts#L308)

Source for a video (Class version).