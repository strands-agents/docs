```ts
type VideoSourceData =
  | {
  bytes: Uint8Array;
}
  | {
  s3Location: S3LocationData;
};
```

Defined in: [src/types/media.ts:303](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/types/media.ts#L303)

Source for a video (Data version).