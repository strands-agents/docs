```ts
type DocumentSource =
  | {
  type: "documentSourceBytes";
  bytes: Uint8Array;
}
  | {
  type: "documentSourceText";
  text: string;
}
  | {
  type: "documentSourceContentBlock";
  content: DocumentContentBlock[];
}
  | {
  type: "documentSourceS3Location";
  location: S3Location;
};
```

Defined in: [src/types/media.ts:389](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/media.ts#L389)

Source for a document (Class version).