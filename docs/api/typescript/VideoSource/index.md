```ts
type VideoSource =
  | {
  type: "videoSourceBytes";
  bytes: Uint8Array;
}
  | {
  type: "videoSourceS3Location";
  location: S3Location;
};
```

Defined in: [src/types/media.ts:270](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/media.ts#L270)

Source for a video (Class version).