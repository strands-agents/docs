```ts
type ImageSource =
  | {
  type: "imageSourceBytes";
  bytes: Uint8Array;
}
  | {
  type: "imageSourceS3Location";
  location: S3Location;
}
  | {
  type: "imageSourceUrl";
  url: string;
};
```

Defined in: [src/types/media.ts:149](https://github.com/strands-agents/sdk-typescript/blob/f72cbc85fd52a15f9ee0400e717de2ab11731169/strands-ts/src/types/media.ts#L149)

Source for an image (Class version).