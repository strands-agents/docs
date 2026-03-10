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

Defined in: [src/types/media.ts:423](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/types/media.ts#L423)

Source for a document (Data version). Supports multiple formats including structured content.