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

Defined in: [src/types/media.ts:149](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/media.ts#L149)

Source for an image (Class version).