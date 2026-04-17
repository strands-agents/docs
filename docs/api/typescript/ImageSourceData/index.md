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

Defined in: [src/types/media.ts:141](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/types/media.ts#L141)

Source for an image (Data version). Supports multiple formats for different providers.