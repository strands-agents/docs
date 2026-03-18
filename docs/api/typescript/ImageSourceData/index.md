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

Defined in: [src/types/media.ts:141](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/media.ts#L141)

Source for an image (Data version). Supports multiple formats for different providers.