```ts
type ElicitationContext = RequestHandlerExtra<ClientRequest, ClientNotification>;
```

Defined in: [src/types/elicitation.ts:12](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/elicitation.ts#L12)

Context provided to an elicitation callback, including the abort signal for the in-flight request.