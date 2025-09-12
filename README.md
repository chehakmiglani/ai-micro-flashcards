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

## Environment Variables
See `.env.sample`.

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
