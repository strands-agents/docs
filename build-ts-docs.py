import subprocess
import os

def on_startup(**kwargs):
    """Run npm docs:ts before building the site"""
    subprocess.run(['npm', 'run', 'docs:ts'], check=True, cwd=os.getcwd())
    print("✓ TypeScript documentation generated successfully")

