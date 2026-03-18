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

Defined in: [src/types/media.ts:380](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/media.ts#L380)

Source for a document (Data version). Supports multiple formats including structured content.