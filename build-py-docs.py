import os
import re
import sys
import subprocess
import shutil
import importlib
from pathlib import Path

# Configuration
REPO_URL = "https://github.com/strands-agents/sdk-python.git"
OUTPUT_DIR = "docs/api-reference/python"
TEMP_DIR = Path('temp_python_sdk')

nav_items = []


def discover_modules(sdk_path: Path) -> list[str]:
    """Find all Python modules in the SDK"""
    modules = []
    for py_file in sdk_path.rglob('*.py'):
        if py_file.name.startswith('_'):
            continue

        rel_path = py_file.relative_to(sdk_path.parent)
        module = str(rel_path.with_suffix('')).replace('/', '.')

        try:
            importlib.import_module(module)
            print(f"Found module: {module}")
        except ImportError as e:
            print(f"Found module (with import issues): {module} - {e}")

        modules.append(module)

    return modules


def find_container_modules(modules: list[str], main_module: str) -> list[str]:
    """Find intermediate namespace modules that have multiple children"""
    containers = set()
    for module in modules:
        parts = module.split('.')
        if len(parts) > 2:
            for i in range(2, len(parts)):
                container = '.'.join(parts[:i + 1])
                if container != main_module and container not in modules:
                    children = [m for m in modules if m.startswith(container + '.')]
                    if len(children) > 1:
                        containers.add(container)
    return sorted(containers)


def generate_doc_file(module: str, output_path: Path) -> None:
    """Generate a markdown doc file for a module"""
    content = [
        f"::: {module}",
        "    options:",
        "      heading_level: 1",
        "      members: true"
    ]
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text('\n'.join(content) + '\n')
    print(f"Generated {output_path}")


def get_display_name(module_name: str) -> str:
    """Convert module_name to Display Name"""
    return ' '.join(word.capitalize() for word in module_name.split('_'))


def is_base_class(child_name: str, parent_name: str) -> bool:
    """Check if child matches parent (handles singular/plural)"""
    return (child_name == parent_name or
            child_name == parent_name.rstrip('s') or
            child_name + 's' == parent_name)


def build_nav(modules: list[str], base_path: str, parent_module: str, actual_modules: set[str]) -> list:
    """Build nested navigation structure recursively"""
    parent_depth = len(parent_module.split('.'))
    parent_name = parent_module.split('.')[-1]

    # Group modules by immediate child
    groups = {}
    for module in modules:
        parts = module.split('.')
        if len(parts) > parent_depth:
            child_key = '.'.join(parts[:parent_depth + 1])
            groups.setdefault(child_key, []).append(module)

    # Sort: base class first, then alphabetically
    def sort_key(key):
        child_name = key.split('.')[-1]
        return (0 if is_base_class(child_name, parent_name) else 1, child_name)

    nav = []
    for child_key in sorted(groups.keys(), key=sort_key):
        child_modules = groups[child_key]
        parts = child_key.split('.')
        relative_path = '/'.join(parts[2:])  # Skip 'strands' and category
        display_name = get_display_name(parts[-1])

        # Check for grandchildren
        grandchildren = [m for m in child_modules if m != child_key]

        if grandchildren:
            # Recursively build nav for children
            child_nav = build_nav(grandchildren, base_path, child_key, actual_modules)

            # Only include index link if this is an actual module (not just namespace)
            if child_key in actual_modules:
                nav.append({display_name: [{display_name: f"{base_path}/{relative_path}/index.md"}] + child_nav})
            else:
                nav.append({display_name: child_nav})
        else:
            # Leaf module
            nav.append({display_name: f"{base_path}/{relative_path}.md"})

    return nav


def on_startup(command, dirty):
    """Generate API docs before build"""
    output_dir = Path(OUTPUT_DIR)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Clone repository
    shutil.rmtree(TEMP_DIR, ignore_errors=True)
    try:
        subprocess.run(['git', 'clone', REPO_URL, str(TEMP_DIR)], check=True, capture_output=True)
        print("✓ Python Repository cloned successfully")
    except subprocess.CalledProcessError as e:
        print(f"Failed to clone repository: {e}")
        return

    # Install the package
    try:
        # Check if running under uv by examining parent process
        import psutil
        try:
            parent = psutil.Process().parent()
            is_uv = parent and 'uv' in parent.name()
        except:
            is_uv = False
        
        pip_cmd = ['uv', 'pip', 'install'] if is_uv else ['pip', 'install']
        subprocess.run(pip_cmd + [f'./{TEMP_DIR}[all,bidi-all]'], check=True, capture_output=True,
                       cwd=os.getcwd())
        print("✓ Python Package installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"Failed to install package: {e}")
        # Continue anyway - we can still generate docs with sys.path

    # Setup Python path
    sdk_src_path = str(TEMP_DIR / 'src')
    sys.path.insert(0, sdk_src_path)

    try:
        print("Generating Python API docs...")

        # Discover all modules
        modules = discover_modules(TEMP_DIR / 'src/strands')
        if not modules:
            print("No modules found")
            return

        # Group by category (second part of module name)
        categories = {}
        for module in modules:
            parts = module.split('.')
            if len(parts) >= 2:
                category = parts[1]
                categories.setdefault(category, []).append(module)

        # Generate docs and nav for each category
        experimental_nav = None

        for category in sorted(categories.keys()):
            module_list = categories[category]
            main_module = f"strands.{category}"

            # Find container modules (namespaces with multiple children)
            containers = find_container_modules(module_list, main_module)
            all_modules = module_list + containers
            actual_modules = set(module_list)

            # Generate doc files
            category_dir = output_dir / category
            for module in all_modules:
                parts = module.split('.')
                children = [m for m in all_modules if m.startswith(module + '.') and m != module]

                # Skip namespace-only containers (no actual module file)
                if children and module not in actual_modules:
                    continue

                # Determine output path
                if len(parts) == 2:
                    output_path = category_dir / "index.md"
                elif children and module in actual_modules:
                    # Module with children - create index.md
                    output_path = category_dir / '/'.join(parts[2:]) / "index.md"
                elif children:
                    # Namespace only - skip
                    continue
                else:
                    # Leaf module
                    output_path = category_dir / f"{'/'.join(parts[2:])}.md"

                generate_doc_file(module, output_path)

            # Build navigation
            category_display = get_display_name(category)
            relative_path = re.sub(r'^/?docs/', '', OUTPUT_DIR)
            base_path = f"{relative_path}/{category}"
            submodules = [m for m in all_modules if m != main_module]
            submodule_nav = build_nav(submodules, base_path, main_module, actual_modules)

            # Create category nav entry
            if submodule_nav:
                if main_module in actual_modules:
                    category_nav = {category_display: [{category_display: f"{base_path}/index.md"}] + submodule_nav}
                else:
                    category_nav = {category_display: submodule_nav}
            else:
                category_nav = {category_display: f"{base_path}/index.md"}

            # Keep experimental for the end
            if category == 'experimental':
                experimental_nav = category_nav
            else:
                nav_items.append(category_nav)

        # Add experimental at the bottom
        if experimental_nav:
            nav_items.append(experimental_nav)


        print("✓ Updated Python API nav menu")

    finally:
        # Cleanup
        if sdk_src_path in sys.path:
            sys.path.remove(sdk_src_path)
        shutil.rmtree(TEMP_DIR, ignore_errors=True)

def on_pre_build(config):
    # Update config nav
    for item in config.get('nav', []):
        if isinstance(item, dict) and 'Python API' in item:
            item['Python API'] = nav_items
            break