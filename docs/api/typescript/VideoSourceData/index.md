```ts
type VideoSourceData =
  | {
  bytes: Uint8Array;
}
  | {
  location: S3LocationData;
};
```

Defined in: [src/types/media.ts:265](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/types/media.ts#L265)

Source for a video (Data version).