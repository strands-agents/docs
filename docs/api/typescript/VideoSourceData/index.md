```ts
type VideoSourceData =
  | {
  bytes: Uint8Array;
}
  | {
  location: S3LocationData;
};
```

Defined in: [src/types/media.ts:265](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/media.ts#L265)

Source for a video (Data version).