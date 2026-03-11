```ts
type ImageSourceData =
  | {
  bytes: Uint8Array;
}
  | {
  s3Location: S3LocationData;
}
  | {
  url: string;
};
```

Defined in: [src/types/media.ts:174](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/types/media.ts#L174)

Source for an image (Data version). Supports multiple formats for different providers.