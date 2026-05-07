```ts
type VideoSourceData =
  | {
  bytes: Uint8Array;
}
  | {
  location: S3LocationData;
};
```

Defined in: [src/types/media.ts:265](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/media.ts#L265)

Source for a video (Data version).