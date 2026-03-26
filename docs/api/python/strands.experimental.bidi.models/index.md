Bidirectional model interfaces and implementations.

#### \_\_getattr\_\_

```python
def __getattr__(name: str) -> Any
```

Defined in: [src/strands/experimental/bidi/models/<strong>init</strong>.py:13](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/models/__init__.py#L13)

Lazy load bidi model implementations only when accessed.

This defers the import of optional dependencies until actually needed.