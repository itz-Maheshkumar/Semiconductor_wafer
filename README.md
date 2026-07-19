# Wafer Defect Detection — Project

AI-assisted early-stage semiconductor defect detection, focused on
**wafer map pattern classification** — the earliest inspection point in
chip manufacturing, right after wafer-level test and before dicing/
packaging. Users upload a wafer map, get an AI-predicted defect class with
confidence + Grad-CAM explanation, and track results over time.

Full spec lives in `docs/` — this file tracks **what's actually been built
so far** so anyone (including future-you) can see project status at a
glance.

## Phase 1 Deadline: Monday

Scope for Monday is deliberately narrow — FE + BE fully working end-to-end,
using an **existing pretrained model for inference only** (no training/
fine-tuning in this phase). Full scope breakdown: `docs/01_PROJECT_OVERVIEW.md`.

## Docs (all written, source of truth)

| Doc | Purpose |
|---|---|
| `docs/01_PROJECT_OVERVIEW.md` | Phase 1 vs Phase 2 scope, feature list, architecture, team split, definition of done |
| `docs/02_API_CONTRACT.md` | FE↔BE contract — endpoints, request/response shapes, error format, mock-layer convention |
| `docs/03_MODEL_TRAINING.md` | Phase 2 fine-tuning guide (Colab, WM-811K) — not needed for Monday |
| `docs/04_REPO_STRUCTURE.md` | Repo layout convention (`frontend/`, `backend/`, `models/`) |

## Progress So Far

### ✅ Planning
- [x] Feature scope defined and phased (Phase 1 / Phase 2)
- [x] API contract written (`/api/v1`, all core endpoints specified)
- [x] Repo structure convention decided
- [x] Model fine-tuning plan documented for later

### 🔨 Backend — in progress (solo build)
- [x] `backend/` scaffolded per repo structure (`app/api/v1`, `app/models`,
      `app/ml`, `app/media`)
- [x] `requirements.txt` pinned (FastAPI, SQLModel, TensorFlow stack —
      TensorFlow used instead of PyTorch for the model layer)
- [x] `backend/README.md` — setup/run instructions
- [x] `backend/.gitignore`
- [x] Minimal FastAPI app running (`GET /` returns 200, `/docs` Swagger UI
      loads) — confirms toolchain works end-to-end
- [x] CORS enabled for frontend origin (`localhost:3000`)
- [x] `.env.example` drafted (JWT secret, DB URL, model path placeholders)
- [x] DB models (`User`, `Prediction`, `Feedback`) — SQLModel classes in `app/models/`, `db.py` engine/session setup
- [x] `app.db` created + committed (tables verified: `user`, `prediction`, `feedback`)
- [ ] Auth endpoints (`signup`, `login`, `me`) + JWT dependency
- [ ] Model inference wrapper (`app/ml/inference.py`) — load model once at
      startup, `predict()` function, tested standalone
- [ ] Grad-CAM generation
- [ ] Predictions endpoints (`POST/GET /predictions`, `GET /predictions/{id}`)
- [ ] Feedback endpoint (storage only, no retraining in Phase 1)
- [ ] Analytics endpoint
- [ ] Global error handler (standard `{error: {code, message}}` format)
- [ ] Seed script for demo data

### ⬜ Frontend — not started
- [ ] Next.js + Tailwind scaffold
- [ ] Mock API layer matching `docs/02_API_CONTRACT.md`
- [ ] Auth pages (signup/login)
- [ ] Upload + prediction result view (with Grad-CAM display)
- [ ] History dashboard (filterable)
- [ ] Analytics charts
- [ ] Feedback UI (confirm/correct label)
- [ ] Swap mock layer → real backend

### ⬜ ML / Model — not started (Phase 1 needs an existing model sourced, not trained)
- [ ] Source/confirm the existing pretrained model to use for Phase 1
      inference (placed at `models/downloads/`)
- [ ] Confirm class label order matches `docs/02_API_CONTRACT.md`
- [ ] Verify input preprocessing (resize/normalize) matches how the model
      was originally trained — **highest-risk item, flagged in overview doc**
- [ ] (Phase 2, not this deadline) Fine-tuning notebook per
      `docs/03_MODEL_TRAINING.md`

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router) + Tailwind CSS |
| Backend | Python, FastAPI |
| DB | SQLite (`app.db`, committed to repo) |
| ORM | SQLModel |
| Auth | JWT |
| ML | TensorFlow, existing pretrained model (inference-only for Phase 1) |

## Repo Layout

```
repo-root/
├── docs/            # specs — see table above
├── frontend/         # Next.js app (not yet started)
├── backend/           # FastAPI app (in progress)
└── models/            # downloads/ (pretrained model), notebooks/, finetuned/
```

Full explanation: `docs/04_REPO_STRUCTURE.md`.

## Immediate Next Step

Backend: implement auth (`signup`, `login`, `me`) — password hashing with
passlib/bcrypt, JWT issuing/decoding, `get_current_user` dependency. This
unblocks every other route, since predictions/feedback/analytics all
require an authenticated user.
