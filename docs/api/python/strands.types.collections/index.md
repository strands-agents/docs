Generic collection types for the Strands SDK.

## PaginatedList

```python
class PaginatedList(list, Generic[T])
```

Defined in: [src/strands/types/collections.py:8](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/collections.py#L8)

A generic list-like object that includes a pagination token.

This maintains backwards compatibility by inheriting from list, so existing code that expects List\[T\] will continue to work.

#### \_\_init\_\_

```python
def __init__(data: list[T], token: str | None = None)
```

Defined in: [src/strands/types/collections.py:15](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/collections.py#L15)

Initialize a PaginatedList with data and an optional pagination token.

**Arguments**:

-   `data` - The list of items to store.
-   `token` - Optional pagination token for retrieving additional items.