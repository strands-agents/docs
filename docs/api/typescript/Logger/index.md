Defined in: [src/logging/types.ts:10](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/logging/types.ts#L10)

Logger interface.

Compatible with standard logging libraries like Pino, Winston, and console.

## Methods

### debug()

```ts
debug(...args): void;
```

Defined in: [src/logging/types.ts:14](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/logging/types.ts#L14)

Log a debug message.

#### Parameters

| Parameter | Type |
| --- | --- |
| …`args` | `unknown`\[\] |

#### Returns

`void`

---

### info()

```ts
info(...args): void;
```

Defined in: [src/logging/types.ts:19](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/logging/types.ts#L19)

Log an info message.

#### Parameters

| Parameter | Type |
| --- | --- |
| …`args` | `unknown`\[\] |

#### Returns

`void`

---

### warn()

```ts
warn(...args): void;
```

Defined in: [src/logging/types.ts:24](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/logging/types.ts#L24)

Log a warning message.

#### Parameters

| Parameter | Type |
| --- | --- |
| …`args` | `unknown`\[\] |

#### Returns

`void`

---

### error()

```ts
error(...args): void;
```

Defined in: [src/logging/types.ts:29](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/logging/types.ts#L29)

Log an error message.

#### Parameters

| Parameter | Type |
| --- | --- |
| …`args` | `unknown`\[\] |

#### Returns

`void`