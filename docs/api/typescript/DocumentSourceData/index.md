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

Defined in: [src/types/media.ts:380](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/media.ts#L380)

Source for a document (Data version). Supports multiple formats including structured content.