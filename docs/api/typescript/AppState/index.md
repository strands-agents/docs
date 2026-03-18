Defined in: [src/app-state.ts:19](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/app-state.ts#L19)

App state provides key-value storage outside conversation context. State is not passed to the model during inference but is accessible by tools (via ToolContext) and application logic.

All values are deep copied on get/set operations to prevent reference mutations. Values must be JSON serializable.

## Example

```typescript
const state = new AppState({ userId: 'user-123' })
state.set('sessionId', 'session-456')
const userId = state.get('userId') // 'user-123'
```

## Implements

-   `StateSerializable`

## Constructors

### Constructor

```ts
new AppState(initialState?): AppState;
```

Defined in: [src/app-state.ts:28](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/app-state.ts#L28)

Creates a new AppState instance.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `initialState?` | `Record`<`string`, [`JSONValue`](/docs/api/typescript/JSONValue/index.md)\> | Optional initial state values |

#### Returns

`AppState`

#### Throws

Error if initialState is not JSON serializable

## Methods

### get()

#### Call Signature

```ts
get<TState, K>(key): TState[K];
```

Defined in: [src/app-state.ts:54](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/app-state.ts#L54)

Get a state value by key with optional type-safe property lookup. Returns a deep copy to prevent mutations.

##### Type Parameters

| Type Parameter | Default type | Description |
| --- | --- | --- |
| `TState` | \- | The complete state interface type |
| `K` *extends* `string` | `number` | `symbol` | keyof `TState` | The property key (inferred from argument) |

##### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `key` | `K` | Key to retrieve specific value |

##### Returns

`TState`\[`K`\]

The value for the key, or undefined if key doesn’t exist

##### Example

```typescript
// Typed usage
const user = state.get<AppState>('user')      // { name: string; age: number } | undefined

// Untyped usage
const value = state.get('someKey')            // JSONValue | undefined
```

#### Call Signature

```ts
get(key): JSONValue;
```

Defined in: [src/app-state.ts:55](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/app-state.ts#L55)

Get a state value by key with optional type-safe property lookup. Returns a deep copy to prevent mutations.

##### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `key` | `string` | Key to retrieve specific value |

##### Returns

[`JSONValue`](/docs/api/typescript/JSONValue/index.md)

The value for the key, or undefined if key doesn’t exist

##### Example

```typescript
// Typed usage
const user = state.get<AppState>('user')      // { name: string; age: number } | undefined

// Untyped usage
const value = state.get('someKey')            // JSONValue | undefined
```

---

### set()

#### Call Signature

```ts
set<TState, K>(key, value): void;
```

Defined in: [src/app-state.ts:89](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/app-state.ts#L89)

Set a state value with optional type-safe property validation. Validates JSON serializability and stores a deep copy.

##### Type Parameters

| Type Parameter | Default type | Description |
| --- | --- | --- |
| `TState` | \- | The complete state interface type |
| `K` *extends* `string` | `number` | `symbol` | keyof `TState` | The property key (inferred from argument) |

##### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `key` | `K` | The key to set |
| `value` | `TState`\[`K`\] | The value to store (must be JSON serializable) |

##### Returns

`void`

##### Throws

Error if value is not JSON serializable

##### Example

```typescript
// Typed usage
state.set<AppState>('user', { name: 'Alice', age: 25 })

// Untyped usage
state.set('someKey', { any: 'value' })
```

#### Call Signature

```ts
set(key, value): void;
```

Defined in: [src/app-state.ts:90](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/app-state.ts#L90)

Set a state value with optional type-safe property validation. Validates JSON serializability and stores a deep copy.

##### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `key` | `string` | The key to set |
| `value` | `unknown` | The value to store (must be JSON serializable) |

##### Returns

`void`

##### Throws

Error if value is not JSON serializable

##### Example

```typescript
// Typed usage
state.set<AppState>('user', { name: 'Alice', age: 25 })

// Untyped usage
state.set('someKey', { any: 'value' })
```

---

### delete()

#### Call Signature

```ts
delete<TState, K>(key): void;
```

Defined in: [src/app-state.ts:111](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/app-state.ts#L111)

Delete a state value by key with optional type-safe property validation.

##### Type Parameters

| Type Parameter | Default type | Description |
| --- | --- | --- |
| `TState` | \- | The complete state interface type |
| `K` *extends* `string` | `number` | `symbol` | keyof `TState` | The property key (inferred from argument) |

##### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `key` | `K` | The key to delete |

##### Returns

`void`

##### Example

```typescript
// Typed usage
state.delete<AppState>('user')

// Untyped usage
state.delete('someKey')
```

#### Call Signature

```ts
delete(key): void;
```

Defined in: [src/app-state.ts:112](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/app-state.ts#L112)

Delete a state value by key with optional type-safe property validation.

##### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `key` | `string` | The key to delete |

##### Returns

`void`

##### Example

```typescript
// Typed usage
state.delete<AppState>('user')

// Untyped usage
state.delete('someKey')
```

---

### clear()

```ts
clear(): void;
```

Defined in: [src/app-state.ts:120](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/app-state.ts#L120)

Clear all state values.

#### Returns

`void`

---

### getAll()

```ts
getAll(): Record<string, JSONValue>;
```

Defined in: [src/app-state.ts:129](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/app-state.ts#L129)

Get a copy of all state as an object.

#### Returns

`Record`<`string`, [`JSONValue`](/docs/api/typescript/JSONValue/index.md)\>

Deep copy of all state

---

### keys()

```ts
keys(): string[];
```

Defined in: [src/app-state.ts:138](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/app-state.ts#L138)

Get all state keys.

#### Returns

`string`\[\]

Array of state keys

---

### \[stateToJSONSymbol\]()

```ts
stateToJSONSymbol: JSONValue;
```

Defined in: [src/app-state.ts:147](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/app-state.ts#L147)

Returns the serialized state as JSON value.

#### Returns

[`JSONValue`](/docs/api/typescript/JSONValue/index.md)

Deep copy of all state

#### Implementation of

```ts
StateSerializable.[stateToJSONSymbol]
```

---

### \[loadStateFromJSONSymbol\]()

```ts
loadStateFromJSONSymbol: void;
```

Defined in: [src/app-state.ts:156](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/app-state.ts#L156)

Loads state from a previously serialized JSON value.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `json` | [`JSONValue`](/docs/api/typescript/JSONValue/index.md) | The serialized state to load |

#### Returns

`void`

#### Implementation of

```ts
StateSerializable.[loadStateFromJSONSymbol]
```