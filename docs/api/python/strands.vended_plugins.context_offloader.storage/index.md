Storage backends for offloaded tool result content.

This module defines the Storage protocol and provides three built-in implementations: file-based, in-memory, and S3 storage. Each content block from a tool result is stored individually with its content type preserved.

**Example**:

```python
from strands.vended_plugins.context_offloader import (
    FileStorage,
    InMemoryStorage,
    S3Storage,
)

# File-based storage
storage = FileStorage(artifact_dir="./artifacts")
ref = storage.store("tool_123_0", b"large output content...", "text/plain")
content, content_type = storage.retrieve(ref)

# In-memory storage (useful for testing and serverless)
storage = InMemoryStorage()

# S3 storage
storage = S3Storage(bucket="my-bucket", prefix="artifacts/")
```

## Storage

```python
@runtime_checkable
class Storage(Protocol)
```

Defined in: [src/strands/vended\_plugins/context\_offloader/storage.py:58](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/context_offloader/storage.py#L58)

Backend for storing and retrieving offloaded content blocks.

Each content block from a tool result is stored individually with its content type preserved. The SDK ships three built-in implementations: `InMemoryStorage`, `FileStorage`, and `S3Storage`. Implement this protocol to create custom storage backends (e.g., Redis, DynamoDB).

Lifecycle: This protocol intentionally does not include eviction or deletion methods. Stored content accumulates for the lifetime of the storage instance. For long-running agents, create a new storage instance per session or use a backend with built-in lifecycle management (e.g., S3 lifecycle policies).

#### store

```python
def store(key: str, content: bytes, content_type: str = "text/plain") -> str
```

Defined in: [src/strands/vended\_plugins/context\_offloader/storage.py:73](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/context_offloader/storage.py#L73)

Store content and return a reference identifier.

**Arguments**:

-   `key` - A unique key for this content block.
-   `content` - The raw content bytes to store.
-   `content_type` - MIME type of the content (e.g., “text/plain”, “application/json”, “image/png”, “application/pdf”).

**Returns**:

A reference string that can be used to retrieve the content later.

#### retrieve

```python
def retrieve(reference: str) -> tuple[bytes, str]
```

Defined in: [src/strands/vended\_plugins/context\_offloader/storage.py:87](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/context_offloader/storage.py#L87)

Retrieve stored content by reference.

**Arguments**:

-   `reference` - The reference returned by a previous store() call.

**Returns**:

A tuple of (content bytes, content type).

**Raises**:

-   `KeyError` - If the reference is not found.

## FileStorage

```python
class FileStorage()
```

Defined in: [src/strands/vended\_plugins/context\_offloader/storage.py:102](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/context_offloader/storage.py#L102)

Store offloaded content as files on disk.

Files are written to the configured artifact directory with unique names. File extensions are derived from the content type. A `.metadata.json` sidecar file tracks content types so they survive process restarts.

**Arguments**:

-   `artifact_dir` - Directory path where artifact files will be stored.

#### \_\_init\_\_

```python
def __init__(artifact_dir: str = "./artifacts") -> None
```

Defined in: [src/strands/vended\_plugins/context\_offloader/storage.py:115](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/context_offloader/storage.py#L115)

Initialize file-based storage.

**Arguments**:

-   `artifact_dir` - Directory path where artifact files will be stored.

#### store

```python
def store(key: str, content: bytes, content_type: str = "text/plain") -> str
```

Defined in: [src/strands/vended\_plugins/context\_offloader/storage.py:133](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/context_offloader/storage.py#L133)

Store content as a file and return the filename as reference.

**Arguments**:

-   `key` - A unique key for this content block.
-   `content` - The raw content bytes to store.
-   `content_type` - MIME type of the content.

**Returns**:

The filename (not full path) used as the reference.

#### retrieve

```python
def retrieve(reference: str) -> tuple[bytes, str]
```

Defined in: [src/strands/vended\_plugins/context\_offloader/storage.py:161](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/context_offloader/storage.py#L161)

Retrieve content from a stored file.

**Arguments**:

-   `reference` - The filename reference returned by store().

**Returns**:

A tuple of (content bytes, content type).

**Raises**:

-   `KeyError` - If the file does not exist.

## InMemoryStorage

```python
class InMemoryStorage()
```

Defined in: [src/strands/vended\_plugins/context\_offloader/storage.py:198](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/context_offloader/storage.py#L198)

Store offloaded content in memory.

Useful for testing and serverless environments where disk access is not available or not desired. Thread-safe.

**Notes**:

Content accumulates for the lifetime of this instance. For long-running agents, consider creating a new instance per session or switching to `FileStorage` or `S3Storage` for persistent storage with external lifecycle management.

#### \_\_init\_\_

```python
def __init__() -> None
```

Defined in: [src/strands/vended\_plugins/context\_offloader/storage.py:211](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/context_offloader/storage.py#L211)

Initialize in-memory storage.

#### store

```python
def store(key: str, content: bytes, content_type: str = "text/plain") -> str
```

Defined in: [src/strands/vended\_plugins/context\_offloader/storage.py:217](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/context_offloader/storage.py#L217)

Store content in memory and return a reference.

**Arguments**:

-   `key` - A unique key for this content block.
-   `content` - The raw content bytes to store.
-   `content_type` - MIME type of the content.

**Returns**:

A unique reference string.

#### retrieve

```python
def retrieve(reference: str) -> tuple[bytes, str]
```

Defined in: [src/strands/vended\_plugins/context\_offloader/storage.py:234](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/context_offloader/storage.py#L234)

Retrieve content from memory.

**Arguments**:

-   `reference` - The reference returned by store().

**Returns**:

A tuple of (content bytes, content type).

**Raises**:

-   `KeyError` - If the reference is not found.

#### clear

```python
def clear() -> None
```

Defined in: [src/strands/vended\_plugins/context\_offloader/storage.py:251](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/context_offloader/storage.py#L251)

Remove all stored content.

Call this to free memory when offloaded results are no longer needed, e.g., between sessions or after an invocation completes.

## S3Storage

```python
class S3Storage()
```

Defined in: [src/strands/vended\_plugins/context\_offloader/storage.py:261](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/context_offloader/storage.py#L261)

Store offloaded content in Amazon S3.

Objects are stored with unique keys under the configured prefix. Content type is preserved as S3 object metadata.

**Arguments**:

-   `bucket` - S3 bucket name.
-   `prefix` - S3 key prefix for organizing stored artifacts.
-   `boto_session` - Optional boto3 session. If not provided, a new session is created using the given region\_name.
-   `boto_client_config` - Optional botocore client configuration.
-   `region_name` - AWS region. Used only when boto\_session is not provided.

**Example**:

```python
from strands.vended_plugins.context_offloader import S3Storage

storage = S3Storage(
    bucket="my-agent-artifacts",
    prefix="tool-results/",
)
```

#### \_\_init\_\_

```python
def __init__(bucket: str,
             prefix: str = "",
             boto_session: boto3.Session | None = None,
             boto_client_config: BotocoreConfig | None = None,
             region_name: str | None = None) -> None
```

Defined in: [src/strands/vended\_plugins/context\_offloader/storage.py:286](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/context_offloader/storage.py#L286)

Initialize S3-based storage.

**Arguments**:

-   `bucket` - S3 bucket name.
-   `prefix` - S3 key prefix for organizing stored artifacts.
-   `boto_session` - Optional boto3 session. If not provided, a new session is created using the given region\_name.
-   `boto_client_config` - Optional botocore client configuration.
-   `region_name` - AWS region. Used only when boto\_session is not provided.

#### store

```python
def store(key: str, content: bytes, content_type: str = "text/plain") -> str
```

Defined in: [src/strands/vended\_plugins/context\_offloader/storage.py:322](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/context_offloader/storage.py#L322)

Store content as an S3 object and return the object key as reference.

**Arguments**:

-   `key` - A unique key for this content block.
-   `content` - The raw content bytes to store.
-   `content_type` - MIME type of the content.

**Returns**:

The S3 object key used as the reference.

**Raises**:

-   `botocore.exceptions.ClientError` - If the S3 operation fails (e.g., bucket does not exist, permission denied).

#### retrieve

```python
def retrieve(reference: str) -> tuple[bytes, str]
```

Defined in: [src/strands/vended\_plugins/context\_offloader/storage.py:353](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/context_offloader/storage.py#L353)

Retrieve content from an S3 object.

**Arguments**:

-   `reference` - The S3 object key returned by store().

**Returns**:

A tuple of (content bytes, content type).

**Raises**:

-   `KeyError` - If the object does not exist.