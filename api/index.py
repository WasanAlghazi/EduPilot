import sys
import os
from pathlib import Path

# Add project root and backend to sys.path immediately
root_path = Path(__file__).parent.parent
sys.path.append(str(root_path))
sys.path.append(str(root_path / "backend"))

# Direct import - Vercel will look for 'app'
from backend.app import app
