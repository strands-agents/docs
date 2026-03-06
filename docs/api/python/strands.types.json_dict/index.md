JSON serializable dictionary utilities.

## JSONSerializableDict

```python
class JSONSerializableDict()
```

Defined in: [src/strands/types/json\_dict.py:8](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/json_dict.py#L8)

A key-value store with JSON serialization validation.

Provides a dict-like interface with automatic validation that all values are JSON serializable on assignment.

#### \_\_init\_\_

```python
def __init__(initial_state: dict[str, Any] | None = None)
```

Defined in: [src/strands/types/json\_dict.py:15](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/json_dict.py#L15)

Initialize JSONSerializableDict.

#### set

```python
def set(key: str, value: Any) -> None
```

Defined in: [src/strands/types/json\_dict.py:25](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/json_dict.py#L25)

Set a value in the store.

**Arguments**:

-   `key` - The key to store the value under
-   `value` - The value to store (must be JSON serializable)

**Raises**:

-   `ValueError` - If key is invalid, or if value is not JSON serializable

#### get

```python
def get(key: str | None = None) -> Any
```

Defined in: [src/strands/types/json\_dict.py:40](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/json_dict.py#L40)

Get a value or entire data.

**Arguments**:

-   `key` - The key to retrieve (if None, returns entire data dict)

**Returns**:

The stored value, entire data dict, or None if not found

#### delete

```python
def delete(key: str) -> None
```

Defined in: [src/strands/types/json\_dict.py:54](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/json_dict.py#L54)

Delete a specific key from the store.

**Arguments**:

-   `key` - The key to delete