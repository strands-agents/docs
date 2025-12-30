import subprocess
import os


def on_startup(command, dirty):
    """Run npm docs:ts before building the site"""
    subprocess.run(['npm', 'run', 'docs:clone'], check=True, cwd=os.getcwd())
    print("✓ TypeScript clone repository successfully")
    subprocess.run(['npm', 'run', 'docs:ts'], check=True, cwd=os.getcwd())
    print("✓ TypeScript documentation generated successfully")
