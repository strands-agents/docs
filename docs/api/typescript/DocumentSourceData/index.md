```ts
type DocumentSourceData =
  | {
  bytes: Uint8Array;
}
  | {
  text: string;
}
  | {
  content: DocumentContentBlockData[];
}
  | {
  s3Location: S3LocationData;
};
```

Defined in: [src/types/media.ts:423](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/types/media.ts#L423)

Source for a document (Data version). Supports multiple formats including structured content.