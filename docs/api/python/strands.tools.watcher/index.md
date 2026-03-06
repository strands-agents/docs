Tool watcher for hot reloading tools during development.

This module provides functionality to watch tool directories for changes and automatically reload tools when they are modified.

## ToolWatcher

```python
class ToolWatcher()
```

Defined in: [src/strands/tools/watcher.py:19](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/watcher.py#L19)

Watches tool directories for changes and reloads tools when they are modified.

#### \_\_init\_\_

```python
def __init__(tool_registry: ToolRegistry) -> None
```

Defined in: [src/strands/tools/watcher.py:32](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/watcher.py#L32)

Initialize a tool watcher for the given tool registry.

**Arguments**:

-   `tool_registry` - The tool registry to report changes.

## ToolChangeHandler

```python
class ToolChangeHandler(FileSystemEventHandler)
```

Defined in: [src/strands/tools/watcher.py:41](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/watcher.py#L41)

Handler for tool file changes.

#### \_\_init\_\_

```python
def __init__(tool_registry: ToolRegistry) -> None
```

Defined in: [src/strands/tools/watcher.py:44](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/watcher.py#L44)

Initialize a tool change handler.

**Arguments**:

-   `tool_registry` - The tool registry to update when tools change.

#### on\_modified

```python
def on_modified(event: Any) -> None
```

Defined in: [src/strands/tools/watcher.py:52](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/watcher.py#L52)

Reload tool if file modification detected.

**Arguments**:

-   `event` - The file system event that triggered this handler.

## MasterChangeHandler

```python
class MasterChangeHandler(FileSystemEventHandler)
```

Defined in: [src/strands/tools/watcher.py:69](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/watcher.py#L69)

Master handler that delegates to all registered handlers.

#### \_\_init\_\_

```python
def __init__(dir_path: str) -> None
```

Defined in: [src/strands/tools/watcher.py:72](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/watcher.py#L72)

Initialize a master change handler for a specific directory.

**Arguments**:

-   `dir_path` - The directory path to watch.

#### on\_modified

```python
def on_modified(event: Any) -> None
```

Defined in: [src/strands/tools/watcher.py:80](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/watcher.py#L80)

Delegate file modification events to all registered handlers.

**Arguments**:

-   `event` - The file system event that triggered this handler.

#### start

```python
def start() -> None
```

Defined in: [src/strands/tools/watcher.py:98](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/watcher.py#L98)

Start watching all tools directories for changes.