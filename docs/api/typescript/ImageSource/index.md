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

Defined in: [src/types/media.ts:182](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/types/media.ts#L182)

Source for an image (Class version).