```ts
type VideoSourceData =
  | {
  bytes: Uint8Array;
}
  | {
  s3Location: S3LocationData;
};
```

Defined in: [src/types/media.ts:303](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/types/media.ts#L303)

Source for a video (Data version).