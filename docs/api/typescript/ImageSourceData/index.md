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

Defined in: [src/types/media.ts:141](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/media.ts#L141)

Source for an image (Data version). Supports multiple formats for different providers.