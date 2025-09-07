# AI Micro-Flashcards

React + FastAPI + SQLite + Groq-powered flashcards app.

## Structure
- `frontend/`: React app
- `backend/`: FastAPI server

## Quick start

### Backend
1. Create venv and install deps
2. Set env var `GROQ_API_KEY`
3. Run server (default http://127.0.0.1:8000)

### Frontend
1. Install deps
2. Start dev server (default http://localhost:3000)

## Deploy later
- Backend: Render/Fly.io/Deta
- Frontend: Vercel/Netlify

## Security
- Keep API keys in env vars; never commit `.env` or `flashcards.db`.
