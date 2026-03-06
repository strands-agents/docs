Defined in: [src/mcp.ts:24](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/mcp.ts#L24)

MCP Client for interacting with Model Context Protocol servers.

## Constructors

### Constructor

```ts
new McpClient(args): McpClient;
```

Defined in: [src/mcp.ts:32](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/mcp.ts#L32)

#### Parameters

| Parameter | Type |
| --- | --- |
| `args` | [`McpClientConfig`](/docs/api/typescript/McpClientConfig/index.md) |

#### Returns

`McpClient`

## Accessors

### client

#### Get Signature

```ts
get client(): Client;
```

Defined in: [src/mcp.ts:45](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/mcp.ts#L45)

##### Returns

`Client`

## Methods

### connect()

```ts
connect(reconnect?): Promise<void>;
```

Defined in: [src/mcp.ts:56](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/mcp.ts#L56)

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

Defined in: [src/mcp.ts:76](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/mcp.ts#L76)

Disconnects the MCP client from the server and cleans up resources.

#### Returns

`Promise`<`void`\>

A promise that resolves when the disconnection is complete.

---

### listTools()

```ts
listTools(): Promise<McpTool[]>;
```

Defined in: [src/mcp.ts:88](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/mcp.ts#L88)

Lists the tools available on the server and returns them as executable McpTool instances.

#### Returns

`Promise`<`McpTool`\[\]>

A promise that resolves with an array of McpTool instances.

---

### callTool()

```ts
callTool(tool, args): Promise<JSONValue>;
```

Defined in: [src/mcp.ts:110](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/mcp.ts#L110)

Invoke a tool on the connected MCP server using an McpTool instance.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `tool` | `McpTool` | The McpTool instance to invoke. |
| `args` | [`JSONValue`](/docs/api/typescript/JSONValue/index.md) | The arguments to pass to the tool. |

#### Returns

`Promise`<[`JSONValue`](/docs/api/typescript/JSONValue/index.md)\>

A promise that resolves with the result of the tool invocation.