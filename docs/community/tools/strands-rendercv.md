---
project:
  pypi: https://pypi.org/project/strands-rendercv/
  github: https://github.com/cagataycali/strands-rendercv
  maintainer: cagataycali
service:
  name: RenderCV
  link: https://rendercv.com
---

# strands-rendercv

{{ community_contribution_banner }}

[strands-rendercv](https://github.com/cagataycali/strands-rendercv) provides AI-powered professional CV generation combining Strands Agents with RenderCV for beautiful, typographically perfect resumes.

## Installation

```bash
pip install strands-rendercv

# macOS: Install LaTeX for PDF generation
brew install --cask mactex-no-gui
```

## Usage

```python
from strands import Agent
from strands_rendercv import render_cv

agent = Agent(tools=[render_cv])

# Create template → Edit → Generate
agent.tool.render_cv(action="create_template")
agent.tool.render_cv(action="validate", input_file="John_Doe_CV.yaml")
agent.tool.render_cv(action="render", input_file="John_Doe_CV.yaml")
```

### AI-Powered Generation

```python
agent("""
Read my LinkedIn from ~/linkedin.md and work log from ~/work-log.md.
Generate CV for Senior Engineer at Tech Corp.
Focus on: distributed systems, leadership, open source.
Use 'engineeringresumes' theme.
""")
```

## Key Features

- **AI-Assisted Content**: Generate CV content from your documents
- **Schema Validation**: Validate YAML before rendering
- **Multi-Format Output**: PDF, HTML, and Markdown
- **5 Production-Ready Themes**: engineeringresumes, classic, sb2nov, moderncv, and more
- **Template Library**: Example CVs for various roles

## Available Actions

| Action | Description |
|--------|-------------|
| `create_template` | Generate sample YAML template |
| `validate` | Check schema before rendering |
| `render` | Generate PDF + HTML + MD |
| `list_themes` | Show available themes |

## Resources

- [PyPI Package](https://pypi.org/project/strands-rendercv/)
- [GitHub Repository](https://github.com/cagataycali/strands-rendercv)
- [RenderCV Documentation](https://rendercv.com)
