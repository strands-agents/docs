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

Defined in: [src/types/media.ts:149](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/types/media.ts#L149)

Source for an image (Class version).