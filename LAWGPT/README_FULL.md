# LAW-GPT: Indian Legal Assistant (Agentic RAG)

## Overview
- Full-stack legal assistant using Retrieval-Augmented Generation (RAG) specialized for Indian law.
- Backend: FastAPI server at `http://localhost:5000` (`kaanoon_test/advanced_rag_api_server.py`).
- Frontend: React + Vite dev server at `http://localhost:3001` (`frontend/`).
- Data: Hybrid vector database (ChromaDB) with legal documents under `DATA/` and `chroma_db_hybrid/`.

## Key Features
- Agentic RAG with hybrid retrieval and caching.
- FastAPI endpoints for queries, metrics, health, and examples.
- React UI with modern components and API client using `VITE_API_URL`.
- One-click Windows scripts to start both servers.

## Repository Layout
- `kaanoon_test/` – Backend server (`advanced_rag_api_server.py`) and system adapters.
- `rag_system/` – Core RAG components, hybrid store, loaders, utils.
- `frontend/` – React + Vite application (`vite.config.js` sets port 3001 and `/api` proxy).
- `config/` – `.env` with API keys and `config.py` for defaults.
- `DATA/` – Source datasets (case studies, Q&A, articles).
- `chroma_db_hybrid/` – Persisted vector DB and indexes.
- Startup scripts:
  - `START_ALL.bat`, `START_EXPERT_RAG.bat`, `start-all.ps1` – Start both servers.
  - `START_BACKEND.bat`, `start-backend.ps1` – Start backend only.
  - `START_FRONTEND.bat`, `start-frontend.ps1` – Start frontend only.
  - `REBUILD_DATABASE_156K.bat`, `rebuild_database_156K.py` – Rebuild hybrid DB.

## Prerequisites
- Windows 10/11
- Python 3.11–3.13
- Node.js 18+ and npm
- Internet access for LLM/API calls

## Configuration
- Create `config/.env` with your keys (do not commit secrets):
  - `cerebras_api`, `groq_api`
  - `nvidia_api`, `nvidia_api_2`
  - Optional web search: `BRAVE_API_KEY`, `SERPER_API_KEY`
  - Optional legal data: `INDIAN_KANOON_API_TOKEN`
- Frontend API base can be set in `frontend/.env`:
  - `VITE_API_URL=http://localhost:5000`

## Install Dependencies
```powershell
# Backend (from repo root)
python -m pip install fastapi uvicorn python-dotenv pydantic requests sentence-transformers chromadb

# Frontend
cd frontend
npm install
```

## Quick Start (Windows)
- One-click start:
  - Double-click `START_ALL.bat` or run `.\start-all.ps1`
- Manual start:
  - Backend:
    ```powershell
    cd kaanoon_test
    python advanced_rag_api_server.py
    ```
  - Frontend:
    ```powershell
    cd frontend
    npm run dev
    ```
- Access the app: `http://localhost:3001`
- API docs: `http://localhost:5000/docs`

## Verify Servers
- Backend health: `http://localhost:5000/health`
- Quick API test:
  ```powershell
  python quick_test.py
  ```

## Useful Endpoints (FastAPI)
- `POST /api/query` – Submit legal question
- `POST /api/feedback` – Send rating and feedback
- `GET /api/metrics` – System performance metrics
- `GET /api/stats` – Basic stats snapshot
- `GET /api/examples` – Example queries
- `GET /health` – Health check
- `GET /docs` – Swagger UI

## Rebuild Database (Optional)
- Run `REBUILD_DATABASE_156K.bat` or:
  ```powershell
  python rebuild_database_156K.py
  ```
- This backs up `chroma_db_hybrid/`, rebuilds the hybrid store with full datasets, and verifies counts.

## Troubleshooting
- Missing Python packages:
  - Install with `python -m pip install fastapi uvicorn python-dotenv pydantic requests sentence-transformers chromadb`
- Port conflicts:
  - Backend (5000): `taskkill /F /IM python.exe`
  - Frontend (3001): `taskkill /F /IM node.exe`
- Frontend cannot reach API:
  - Ensure backend is running; verify `frontend/.env` `VITE_API_URL` or proxy in `vite.config.js`.
- Slow first query:
  - Backend warms up models and database; wait 30–60 seconds after start.

## Notes
- Keep `config/.env` private; never commit API keys.
- Use separate terminals for backend and frontend during development.
- Dataset and DB paths are relative to repo root.
