```ts
type VideoSource =
  | {
  type: "videoSourceBytes";
  bytes: Uint8Array;
}
  | {
  type: "videoSourceS3Location";
  location: S3Location;
};
```

Defined in: [src/types/media.ts:270](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/media.ts#L270)

Source for a video (Class version).