import os
import subprocess
import shutil
import importlib
from pathlib import Path
from typing import Any

def _find_container_modules(module_list: list[str], main_module: str) -> list[str]:
    container_modules = set()
    for module in module_list:
        parts = module.split('.')
        # Check for potential container modules (3+ parts)
        if len(parts) > 2:
            for i in range(2, len(parts)):
                container = '.'.join(parts[:i+1])
                if container not in module_list and container != main_module:
                    # Check if this container has multiple sub-modules
                    sub_modules = [m for m in module_list if m.startswith(container + '.')]
                    if len(sub_modules) > 1:
                        container_modules.add(container)

def on_pre_build(config):
    """Generate API docs before build"""
    repo_url = "https://github.com/strands-agents/sdk-python.git"
    temp_dir = Path('temp_python_sdk')
    sdk_path = temp_dir / 'src/strands'
    output_dir = Path('docs/api-reference')
    
    # Clone repository
    try:
        subprocess.run(['git', 'clone', repo_url, str(temp_dir)], check=True)
    except subprocess.CalledProcessError:
        if sdk_path.exists():
            shutil.rmtree(temp_dir, ignore_errors=True)
        print("Failed to clone repository")
        return
        
    print("Generating API docs...")
    
    # Find modules
    modules: list[str] = []
    for item in sdk_path.rglob('*.py'):
        if item.name.startswith('_'):
            continue
        rel_path = item.relative_to(sdk_path.parent)
        module = str(rel_path.with_suffix('')).replace('/', '.')
        
        # Only include modules that can be imported
        # Otherwise we get an error like: ERROR   -  mkdocstrings: strands.types.multiagent could not be found
        try:
            importlib.import_module(module)
            modules.append(module)
        except ImportError:
            continue
    
    # Group by api reference category
    # Each category will have a list of included python modules
    categories: dict[str, list[str]] = {}
    for module in modules:
        parts = module.split('.')
        if len(parts) >= 2:
            category = parts[1]
            if category not in categories:
                categories[category] = []
            categories[category].append(module)
    
    # Generate files
    for category, module_list in categories.items():
        content = []
        main_module = f"strands.{category}"
        
        # Find container modules (modules that have sub-modules but aren't in the list)
        container_modules = _find_container_modules(module_list, main_module)
        
        # Add container modules to the list
        module_list.extend(container_modules)
        
        # Sort to maintain proper order
        sorted_modules = sorted(module_list)

        # Always include main module as header, even if not importable
        if main_module not in module_list:
            sorted_modules.insert(0, main_module)
        else:
            sorted_modules.remove(main_module)
            sorted_modules.insert(0, main_module)
        
        for module in sorted_modules:
            parts = module.split('.')
            level = min(len(parts) - 1, 3)
            content.append(f"::: {module}")
            content.append("    options:")
            content.append(f"      heading_level: {level}")
            # Add members: false for main module and container modules
            if module == main_module or module in container_modules:
                content.append("      members: false")
        with open(output_dir / f"{category}.md", 'w') as f:
            f.write('\n'.join(content) + '\n')
    
    # Clean up cloned repository
    shutil.rmtree(temp_dir, ignore_errors=True)