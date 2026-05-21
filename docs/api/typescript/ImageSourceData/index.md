```ts
type ImageSourceData =
  | {
  bytes: Uint8Array;
}
  | {
  location: S3LocationData;
}
  | {
  url: string;
};
```

Defined in: [src/types/media.ts:141](https://github.com/strands-agents/sdk-typescript/blob/4dd13ca32f73cd4603a1d468e3e5f60292a88334/strands-ts/src/types/media.ts#L141)

Source for an image (Data version). Supports multiple formats for different providers.