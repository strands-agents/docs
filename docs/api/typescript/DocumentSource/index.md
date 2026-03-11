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

Defined in: [src/types/media.ts:432](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/types/media.ts#L432)

Source for a document (Class version).