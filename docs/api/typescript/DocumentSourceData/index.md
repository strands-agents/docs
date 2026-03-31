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

Defined in: [src/types/media.ts:380](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/media.ts#L380)

Source for a document (Data version). Supports multiple formats including structured content.