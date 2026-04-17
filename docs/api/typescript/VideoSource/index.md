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

Defined in: [src/types/media.ts:270](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/types/media.ts#L270)

Source for a video (Class version).