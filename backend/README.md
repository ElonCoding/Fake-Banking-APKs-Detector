# Backend (FastAPI)

## Setup
```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Endpoints
- `POST /api/analyze` — multipart form-data with field `file` (.apk)
- `GET /health` — health check
