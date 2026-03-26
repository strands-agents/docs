Bidirectional streaming package.

#### \_\_getattr\_\_

```python
def __getattr__(name: str) -> Any
```

Defined in: [src/strands/experimental/bidi/<strong>init</strong>.py:70](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/bidi/__init__.py#L70)

Lazy load IO implementations only when accessed.

This defers the import of optional dependencies until actually needed.