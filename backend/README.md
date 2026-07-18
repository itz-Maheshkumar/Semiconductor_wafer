# Wafer Defect Detection — Backend

FastAPI backend for the wafer map defect detection system. Serves auth,
predictions (ML inference), feedback, and analytics endpoints consumed by
the Next.js frontend.

See `docs/02_API_CONTRACT.md` in the project root for the full API spec —
this backend implements that contract exactly.

## Tech Stack

- **Framework**: FastAPI
- **DB**: SQLite (`app.db`, committed to source control for easy team sync)
- **ORM**: SQLModel
- **Auth**: JWT (python-jose + passlib/bcrypt)
- **ML**: TensorFlow (existing pretrained model, inference only in Phase 1)

## Prerequisites

- Python 3.10–3.12 (check compatibility with the pinned TensorFlow version
  in `requirements.txt`)
- pip / venv

## Setup

```bash
# from the backend/ folder
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env             # then fill in real values
```

## Running the server

```bash
uvicorn app.main:app --reload
```

- API root: http://localhost:8000
- Interactive API docs (Swagger UI): http://localhost:8000/docs
- Alternative docs (ReDoc): http://localhost:8000/redoc

Use `/docs` to manually test every endpoint as it's built — no separate
Postman collection needed.

## Environment Variables

See `.env.example` for the full list. Required:

| Variable | Description |
|---|---|
| `JWT_SECRET_KEY` | Secret used to sign JWTs — use a random string, never commit the real value |
| `JWT_ALGORITHM` | Default `HS256` |
| `JWT_EXPIRE_MINUTES` | Token lifetime |
| `DATABASE_URL` | SQLite connection string, default `sqlite:///./app.db` |
| `MODEL_PATH` | Path to the pretrained model file used for inference |

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entrypoint, loads model + DB at startup
│   ├── db.py                 # SQLite engine/session setup
│   ├── api/v1/                # Route handlers (auth, predictions, feedback, analytics)
│   ├── models/                # SQLModel DB models (User, Prediction, Feedback)
│   ├── ml/                    # Model loading + inference + Grad-CAM
│   └── media/                 # Uploaded wafer images + generated heatmaps (runtime, gitignored)
├── app.db                     # SQLite DB file — committed intentionally
├── requirements.txt
├── .env.example
└── .env                        # local secrets, gitignored
```

## Database

`app.db` is committed to source control so the whole team shares the same
schema and seed data without running migrations locally.

**If you change the DB schema:**
1. Update the SQLModel classes in `app/models/`
2. Delete the local `app.db` and let it regenerate (or run the seed script)
3. Run `python seed.py` to repopulate sample data
4. Commit the new `app.db`
5. Tell the team to pull the new file rather than merging — SQLite files
   don't merge meaningfully via git

## Seeding sample data

```bash
python seed.py
```

Creates a demo user and a handful of sample predictions across different
defect classes, so the app isn't empty on demo day.

## Model

Phase 1 uses an existing pretrained model for inference only — no training
happens in this repo's runtime path. The model is loaded once at server
startup (see `app/ml/`), never per-request.

Fine-tuning (Phase 2, not required for the current deadline) is done
separately via Colab — see `docs/03_MODEL_TRAINING.md`.

## API Contract

All request/response shapes, endpoints, and error formats are defined in
`docs/02_API_CONTRACT.md`. Treat that file as the source of truth; update it
first if any endpoint shape needs to change.