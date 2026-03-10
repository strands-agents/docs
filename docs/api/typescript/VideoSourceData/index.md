```ts
type VideoSourceData =
  | {
  bytes: Uint8Array;
}
  | {
  s3Location: S3LocationData;
};
```

Defined in: [src/types/media.ts:303](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/types/media.ts#L303)

Source for a video (Data version).