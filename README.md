# AI Micro-Flashcards

React + FastAPI + SQLite + Groq-powered flashcards app.

## Structure
- `frontend/`: React app
- `backend/`: FastAPI server

## Quick start

### Backend (local)
1. `cd backend`
2. (Optional) `python -m venv .venv && .venv/Scripts/activate` (Windows PowerShell)
3. `pip install -r requirements.txt`
4. Set env: PowerShell: `$env:GROQ_API_KEY="your_key"`
5. Run: `uvicorn main:app --reload`

### Frontend (local)
1. `cd frontend`
2. `npm install`
3. `npm start`

### One-command local stack (Docker Compose)
Prerequisites: Docker Desktop installed.

```
docker compose up --build
```

Then:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

Hot reloading: backend & frontend source folders are mounted; code changes refresh automatically.

Stop stack:
```
docker compose down
```

Persisted data: SQLite lives in the named Docker volume `backend-data`.

### Build backend image manually
```
docker build -t flashcards-backend -f backend/Dockerfile .
docker run -p 8000:8000 -e DB_PATH=/data/flashcards.db -v $(pwd)/data:/data flashcards-backend
```

On PowerShell (Windows) replace `$(pwd)` with `${PWD}` or the absolute path.

## Environment Variables
See `.env.sample`.

Backend required at runtime:
- `GROQ_API_KEY` (optional for local dev; fallback sample data used if absent)
- `DB_PATH` (defaults to `flashcards.db` if unset)

Frontend build-time (must start with `REACT_APP_`):
- `REACT_APP_API_BASE_URL` (points to deployed backend root)

## Deployment (Render Blueprint)
This repo contains `render.yaml` which defines:
- Web service (FastAPI backend) with persistent disk at `/var/data` for SQLite (`DB_PATH`).
- Static site (React build) with environment variable `REACT_APP_API_BASE_URL`.

### Steps
1. Push changes to `main` (already done if you're reading this file in GitHub).
2. In Render: New > Blueprint > select repo.
3. Set `GROQ_API_KEY` (backend service) before first deploy finishes.
4. After backend deploys, copy its URL; if different than placeholder, update the static site env `REACT_APP_API_BASE_URL` and redeploy (Manual Sync).
5. Database file persists on the attached disk.

### Alternative: Docker on any VPS
1. Copy repo to server
2. `docker compose -f docker-compose.yml up -d --build`
3. Put a reverse proxy (Caddy / Nginx / Traefik) in front if exposing publicly.

### GitHub Actions (CI)
Workflow: `.github/workflows/ci.yml`
- Runs backend tests (pytest)
- Builds frontend (ensures React compilation succeeds)
Add status badge (optional):
```
![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)
```
Replace OWNER/REPO accordingly.

### SPA Routes
`render.yaml` includes rewrites so deep links like `/dashboard` or `/c/123` load correctly.

## Security
- Never commit real API keys.
- SQLite is fine for prototypes; move to Postgres for multi-user scale.

## Roadmap
- Collections/Decks model
- Study sessions + SRS
- Advanced analytics & badges
- PWA offline support
