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
  location: S3LocationData;
};
```

Defined in: [src/types/media.ts:380](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/media.ts#L380)

Source for a document (Data version). Supports multiple formats including structured content.