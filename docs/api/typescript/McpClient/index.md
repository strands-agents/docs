Defined in: [src/mcp.ts:55](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/mcp.ts#L55)

MCP Client for interacting with Model Context Protocol servers.

## Constructors

### Constructor

```ts
new McpClient(args): McpClient;
```

Defined in: [src/mcp.ts:70](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/mcp.ts#L70)

#### Parameters

| Parameter | Type |
| --- | --- |
| `args` | [`McpClientConfig`](/docs/api/typescript/McpClientConfig/index.md) |

#### Returns

`McpClient`

## Properties

### DEFAULT\_TTL

```ts
readonly static DEFAULT_TTL: 60000 = 60000;
```

Defined in: [src/mcp.ts:57](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/mcp.ts#L57)

Default TTL for task polling in milliseconds (60 seconds).

---

### DEFAULT\_POLL\_TIMEOUT

```ts
readonly static DEFAULT_POLL_TIMEOUT: 300000 = 300000;
```

Defined in: [src/mcp.ts:60](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/mcp.ts#L60)

Default poll timeout for task completion in milliseconds (5 minutes).

## Accessors

### client

#### Get Signature

```ts
get client(): Client;
```

Defined in: [src/mcp.ts:84](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/mcp.ts#L84)

##### Returns

`Client`

## Methods

### connect()

```ts
connect(reconnect?): Promise<void>;
```

Defined in: [src/mcp.ts:95](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/mcp.ts#L95)

Connects the MCP client to the server.

This function is exposed to allow consumers to connect manually, but will be called lazily before any operations that require a connection.

#### Parameters

| Parameter | Type | Default value |
| --- | --- | --- |
| `reconnect` | `boolean` | `false` |

#### Returns

`Promise`<`void`\>

A promise that resolves when the connection is established.

---

### disconnect()

```ts
disconnect(): Promise<void>;
```

Defined in: [src/mcp.ts:115](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/mcp.ts#L115)

Disconnects the MCP client from the server and cleans up resources.

#### Returns

`Promise`<`void`\>

A promise that resolves when the disconnection is complete.

---

### listTools()

```ts
listTools(): Promise<McpTool[]>;
```

Defined in: [src/mcp.ts:127](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/mcp.ts#L127)

Lists the tools available on the server and returns them as executable McpTool instances.

#### Returns

`Promise`<`McpTool`\[\]>

A promise that resolves with an array of McpTool instances.

---

### callTool()

```ts
callTool(tool, args): Promise<JSONValue>;
```

Defined in: [src/mcp.ts:154](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/mcp.ts#L154)

Invoke a tool on the connected MCP server using an McpTool instance.

When `tasksConfig` was provided to the client constructor, uses experimental task-based invocation which supports long-running tools with progress tracking. Otherwise, calls tools directly without task management.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `tool` | `McpTool` | The McpTool instance to invoke. |
| `args` | [`JSONValue`](/docs/api/typescript/JSONValue/index.md) | The arguments to pass to the tool. |

#### Returns

`Promise`<[`JSONValue`](/docs/api/typescript/JSONValue/index.md)\>

A promise that resolves with the result of the tool invocation.