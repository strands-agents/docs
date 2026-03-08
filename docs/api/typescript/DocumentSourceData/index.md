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

Defined in: [src/types/media.ts:423](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/types/media.ts#L423)

Source for a document (Data version). Supports multiple formats including structured content.