#!/usr/bin/env python3
"""
Test to verify that all markdown files referenced in mkdocs.yml have frontmatter titles.
"""

import yaml
from pathlib import Path
from typing import Dict, Any


def extract_nav_titles(nav_item: Any, base_path: str = "") -> Dict[str, str]:
    """
    Recursively extract file paths and their titles from the nav structure.
    
    Args:
        nav_item: Navigation item from mkdocs.yml (can be dict, list, or string)
        base_path: Base path for nested navigation items
        
    Returns:
        Dictionary mapping file paths to their titles
    """
    file_titles = {}
    
    if isinstance(nav_item, dict):
        for title, content in nav_item.items():
            if isinstance(content, str):
                # Direct file mapping: "Title: path/to/file.md"
                file_titles[content] = title
            elif isinstance(content, (list, dict)):
                # Nested navigation
                file_titles.update(extract_nav_titles(content, base_path))
    elif isinstance(nav_item, list):
        for item in nav_item:
            file_titles.update(extract_nav_titles(item, base_path))
    elif isinstance(nav_item, str):
        # Direct file path without explicit title
        # Extract title from filename
        filename = Path(nav_item).stem
        title = filename.replace('-', ' ').replace('_', ' ').title()
        file_titles[nav_item] = title
    
    return file_titles


def extract_existing_frontmatter(content: str) -> tuple[str, str]:
    """
    Extract existing frontmatter and content.
    
    Returns:
        Tuple of (frontmatter, remaining_content)
    """
    if not content.strip().startswith('---'):
        return "", content
    
    lines = content.split('\n')
    if lines[0].strip() != '---':
        return "", content
    
    # Find the closing ---
    end_idx = None
    for i, line in enumerate(lines[1:], 1):
        if line.strip() == '---':
            end_idx = i
            break
    
    if end_idx is None:
        return "", content
    
    frontmatter = '\n'.join(lines[1:end_idx])
    remaining_content = '\n'.join(lines[end_idx + 1:])
    
    return frontmatter, remaining_content


def test_all_referenced_files_have_titles():
    """Test that all markdown files referenced in mkdocs.yml have frontmatter titles."""
    
    # Load mkdocs.yml
    mkdocs_path = Path('mkdocs.yml')
    with open(mkdocs_path, 'r', encoding='utf-8') as f:
        mkdocs_config = yaml.unsafe_load(f)
    
    # Extract navigation structure
    nav = mkdocs_config['nav']
    file_titles = extract_nav_titles(nav)
    
    # Track files with issues
    missing_files = []
    files_without_titles = []
    files_with_wrong_titles = []
    
    for file_path_str, expected_title in file_titles.items():
        # Skip external links
        if file_path_str.startswith('http'):
            continue
        
        # Resolve file path (try root first, then docs/)
        file_path = mkdocs_path.parent / file_path_str
        if not file_path.exists():
            docs_path = mkdocs_path.parent / "docs" / file_path_str
            if docs_path.exists():
                file_path = docs_path
        
        # Only check markdown files
        if file_path.suffix.lower() not in ['.md', '.markdown']:
            continue
        
        # Check if file exists
        if not file_path.exists():
            missing_files.append(file_path_str)
            continue
        
        # Read file content
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            raise AssertionError(f"Error reading {file_path}: {e}")
        
        # Extract frontmatter
        frontmatter, _ = extract_existing_frontmatter(content)
        
        if not frontmatter:
            files_without_titles.append(str(file_path))
            continue
        
        # Parse frontmatter to check title
        try:
            fm_data = yaml.safe_load(frontmatter)
            if not fm_data or 'title' not in fm_data:
                files_without_titles.append(str(file_path))
            elif fm_data['title'] != expected_title:
                files_with_wrong_titles.append({
                    'file': str(file_path),
                    'expected': expected_title,
                    'actual': fm_data['title']
                })
        except yaml.YAMLError as e:
            raise AssertionError(f"Error parsing frontmatter in {file_path}: {e}")
    
    # Collect all errors and report them
    errors = []
    
    if missing_files:
        errors.append(f"Missing files referenced in mkdocs.yml: {missing_files}")
    
    if files_without_titles:
        errors.append(f"Files without frontmatter titles: {files_without_titles}")
    
    if files_with_wrong_titles:
        error_details = []
        for item in files_with_wrong_titles:
            error_details.append(f"{item['file']}: expected '{item['expected']}', got '{item['actual']}'")
        errors.append(f"Files with incorrect titles:\n  " + "\n  ".join(error_details))
    
    if errors:
        raise AssertionError("\n\n".join(errors))
    
    print(f"✓ All {len([f for f in file_titles.keys() if not f.startswith('http') and Path(f).suffix.lower() in ['.md', '.markdown']])} referenced markdown files have correct frontmatter titles")