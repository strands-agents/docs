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

Defined in: [src/types/media.ts:423](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/types/media.ts#L423)

Source for a document (Data version). Supports multiple formats including structured content.