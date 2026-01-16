---
project:
  pypi: https://pypi.org/project/strands-fun-tools/
  github: https://github.com/cagataycali/strands-fun-tools
  maintainer: cagataycali
service:
  name: Creative Tools
  link: https://github.com/cagataycali/strands-fun-tools
---

# strands-fun-tools

{{ community_contribution_banner }}

[strands-fun-tools](https://github.com/cagataycali/strands-fun-tools) provides creative and interactive tools for building unique AI agents - including vision, audio, cursor control, and more.

## Installation

```bash
# Base installation (human_typer only)
pip install strands-fun-tools

# With specific features
pip install "strands-fun-tools[cursor,clipboard,vision]"

# Everything
pip install "strands-fun-tools[all]"
```

## Usage

```python
from strands import Agent
from strands_fun_tools import human_typer, cursor, clipboard

agent = Agent(
    tools=[human_typer, cursor, clipboard],
    system_prompt="You can type like a human and control the cursor!"
)

agent("Type 'Hello World!' with excited emotion and then copy it to clipboard")
```

## Key Features

### Interaction Tools
- **human_typer**: Human-like typing with emotions and typos
- **cursor**: Mouse & keyboard automation (pyautogui)
- **clipboard**: Clipboard monitoring & history
- **dialog**: Interactive terminal prompts

### Vision Tools
- **screen_reader**: OCR-based screen monitoring
- **yolo_vision**: Real-time object detection (YOLOv8)
- **face_recognition**: Face detection via AWS Rekognition
- **take_photo**: Camera capture & burst mode

### Audio Tools
- **listen**: Background audio transcription (Whisper)

### Connectivity
- **bluetooth**: BLE device monitoring & GATT operations

### Games
- **chess**: Stockfish chess engine integration

### Utilities
- **utility**: Crypto, encoding, hashing, JSON/YAML
- **spinner_generator**: Custom loading animations
- **template**: Jinja2 template rendering

## Tool Reference

| Tool | Install Extra | Key Actions |
|------|---------------|-------------|
| human_typer | *(base)* | Type with emotions: calm, excited, thoughtful |
| cursor | `[cursor]` | move, click, drag, type_text, hotkey |
| clipboard | `[clipboard]` | start, read, write, get_history |
| screen_reader | `[vision]` | start, capture_once, find_element |
| yolo_vision | `[vision]` | start, detect_once, query_objects |
| listen | `[audio]` | start, stop, get_transcripts |
| bluetooth | `[bluetooth]` | scan_once, list_devices, read_characteristic |
| chess | `[chess]` | new_game, get_best_move, make_move |

## Resources

- [PyPI Package](https://pypi.org/project/strands-fun-tools/)
- [GitHub Repository](https://github.com/cagataycali/strands-fun-tools)
