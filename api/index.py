import sys
import os
from pathlib import Path

# Add backend directory to path so it can find its modules
backend_path = str(Path(__file__).parent.parent / "backend")
if backend_path not in sys.path:
    sys.path.append(backend_path)

from app import app

# Export the app for Vercel
handler = app
