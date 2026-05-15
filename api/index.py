import sys
import os
from pathlib import Path

# Add backend directory to path so it can find its modules
# On Vercel, we need to ensure the path is absolute and correct
root_path = Path(__file__).parent.parent
backend_path = str(root_path / "backend")

if backend_path not in sys.path:
    sys.path.append(backend_path)

# Important: add root to path too for some imports
if str(root_path) not in sys.path:
    sys.path.append(str(root_path))

try:
    from app import app
    # Export the app for Vercel
    handler = app
except Exception as e:
    print(f"Error importing FastAPI app: {e}")
    # Fallback to a simple app to avoid 500 error without info
    from fastapi import FastAPI
    handler = FastAPI()
    @handler.get("/api/health")
    def health():
        return {"status": "error", "message": str(e)}
