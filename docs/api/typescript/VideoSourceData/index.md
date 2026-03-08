```ts
type VideoSourceData =
  | {
  bytes: Uint8Array;
}
  | {
  s3Location: S3LocationData;
};
```

Defined in: [src/types/media.ts:303](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/types/media.ts#L303)

Source for a video (Data version).