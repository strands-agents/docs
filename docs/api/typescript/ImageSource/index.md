```ts
type ImageSource =
  | {
  type: "imageSourceBytes";
  bytes: Uint8Array;
}
  | {
  type: "imageSourceS3Location";
  s3Location: S3Location;
}
  | {
  type: "imageSourceUrl";
  url: string;
};
```

Defined in: [src/types/media.ts:182](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/types/media.ts#L182)

Source for an image (Class version).