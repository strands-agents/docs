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
  s3Location: S3Location;
};
```

Defined in: [src/types/media.ts:432](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/types/media.ts#L432)

Source for a document (Class version).