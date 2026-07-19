# Repository Structure

Monorepo, three top-level folders matching the three workstreams, plus docs.

```
repo-root/
├── docs/
│   ├── 01_PROJECT_OVERVIEW.md
│   ├── 02_API_CONTRACT.md
│   ├── 03_MODEL_TRAINING.md
│   └── 04_REPO_STRUCTURE.md          (this file)
│
├── frontend/
│   ├── app/                          (Next.js App Router pages)
│   ├── components/
│   ├── lib/
│   │   └── api/
│   │       ├── client.ts             (single point of API calls)
│   │       └── mock.ts               (mock data, matches 02_API_CONTRACT.md exactly)
│   ├── public/
│   ├── package.json
│   └── .env.local.example            (NEXT_PUBLIC_API_URL, NEXT_PUBLIC_USE_MOCK)
│
├── backend/
│   ├── app/
│   │   ├── main.py                   (FastAPI app entrypoint — loads model once here)
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── auth.py
│   │   │       ├── predictions.py
│   │   │       ├── analytics.py
│   │   │       └── feedback.py
│   │   ├── models/                   (SQLModel/SQLAlchemy DB models — NOT ML models)
│   │   │   ├── user.py
│   │   │   ├── prediction.py
│   │   │   └── feedback.py
│   │   ├── ml/
│   │   │   ├── inference.py          (loads .pt file, runs prediction + Grad-CAM)
│   │   │   └── config.py             (MODEL_PATH constant, class label order)
│   │   ├── db.py                     (SQLite engine/session setup)
│   │   └── media/                    (uploaded images + generated heatmaps, served statically)
│   ├── app.db                        (SQLite file — COMMITTED to source control)
│   ├── requirements.txt
│   └── .env.example
│
├── models/
│   ├── downloads/
│   │   └── wafer_pretrained.pt       (existing pretrained model used by BE in Phase 1)
│   ├── notebooks/
│   │   └── finetune.ipynb            (Colab fine-tuning notebook, see 03_MODEL_TRAINING.md)
│   └── finetuned/
│       └── wafer_finetuned_v1.pt     (Phase 2 output — added later, not required for Monday)
│
├── .gitignore
└── README.md
```

## Notes on each folder

### `frontend/`
Owned by the FE dev. Nothing here should ever import from `backend/` or
`models/` directly — all data comes through `lib/api/client.ts`, which
respects `NEXT_PUBLIC_USE_MOCK` to switch between `mock.ts` and the real
backend URL.

### `backend/`
Owned by the BE devs. `app/ml/inference.py` is the **only** file that
touches the model file directly — it loads `models/downloads/wafer_pretrained.pt`
(or `models/finetuned/...` once swapped, via `app/ml/config.py`) once at
import time, and exposes a plain function like `predict(image) -> dict`
that the `predictions.py` route calls. This keeps ML loading logic out of
the request-handling code.

`app.db` is committed to source control (not gitignored) so the whole team
shares the same schema and seed data without needing to run migrations
locally every time. Anyone changing the schema should:
1. Update the SQLModel/SQLAlchemy models
2. Delete and regenerate `app.db` locally
3. Reseed sample data
4. Commit the new `app.db`
5. Message the team — everyone else pulls the new `app.db` rather than
   merging it (SQLite files don't merge meaningfully via git)

### `models/`
Owned by whoever is doing ML work.
- `downloads/` — the existing pretrained model, used as-is for Phase 1.
  This is what the backend points to by default.
- `notebooks/finetune.ipynb` — the Colab notebook from
  `03_MODEL_TRAINING.md`. Keep it runnable top-to-bottom; don't leave it in
  a broken mid-edit state in the repo.
- `finetuned/` — Phase 2 output models land here once trained. The backend
  is only pointed at these after they've been evaluated as an improvement
  over the current model — never swap blindly.

## `.gitignore` guidance

Do **not** ignore:
- `backend/app.db` (intentionally committed, per project convention)
- `models/downloads/*.pt` and `models/finetuned/*.pt` (small enough for a
  student/demo project; if a model file gets too large for git, switch to
  Git LFS rather than gitignoring it — otherwise teammates can't run the
  backend after a fresh clone)

Do ignore:
```
frontend/node_modules/
frontend/.next/
backend/__pycache__/
backend/.venv/
backend/app/media/*        (generated at runtime — keep the folder with a .gitkeep, ignore contents)
*.pyc
.env
.env.local
```

## Branching (suggested, keep light for a 3-person team)

- `main` — always demoable
- `feat/frontend-*`, `feat/backend-*`, `feat/model-*` — short-lived branches
  per feature, merged via PR or even direct fast-forward if the team is
  small and coordinating live
- Given the timeline, prioritize integrating early and often over long-lived
  branches — merge to `main` at least once a day so integration issues
  surface before Monday, not on Monday
