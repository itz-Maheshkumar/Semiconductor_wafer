# Wafer Defect Detection — Project Overview

## 1. Goal

An AI-assisted tool for early-stage semiconductor defect detection, focused on
**wafer map pattern classification** — the earliest inspection point in chip
manufacturing, right after wafer-level electrical/optical test and before
dicing/packaging.

The system lets an engineer upload a wafer map, get an AI-predicted defect
classification with confidence + visual explanation (Grad-CAM), track
predictions over time, and (in Phase 2) correct wrong predictions to build a
dataset for fine-tuning.

## 2. Phasing — read this first

**Phase 1 (due Monday)** — everything in this doc and the API contract must
be deliverable by Monday. Scope is deliberately narrow:

- FE + BE fully working end-to-end
- ML = **existing pretrained model used for inference only**. No training,
  no fine-tuning, no retraining loop running live. If the model's accuracy
  is mediocre, that is acceptable for Phase 1 — it is a placeholder for a
  better fine-tuned model that comes later.
- The "feedback / correct label" feature only needs to **store data**. It
  does not need to actually trigger any retraining.

**Phase 2 (later, not this deadline)** — fine-tuning the model on WM-811K
and/or on feedback data collected via Phase 1, swapping the improved model
into the backend, and eventually closing the feedback loop. See
`03_MODEL_TRAINING.md`. Nobody should spend Phase-1 time on this.

If in doubt about whether a task belongs in Phase 1: **if it's not needed to
demo "upload wafer map → get prediction → see it in history/analytics", it's
Phase 2.**

## 3. Feature List (Phase 1)

### Auth
- Sign up / Log in (email + password)
- JWT-based session, stored client-side
- No admin/role system for now (removed — keep it simple)

### Wafer Inspection (core feature)
- Upload a single wafer map image → get prediction
  - Defect class (one of the 9 WM-811K classes, see below)
  - Confidence score
  - Grad-CAM heatmap overlay image
- Batch upload (zip / multiple files) → table of results (nice-to-have if
  time allows — cut first if behind schedule)

### History Dashboard
- List of past predictions for the logged-in user
- Filter by date range and/or defect class
- Click into a prediction to see full detail (image, heatmap, confidence)

### Analytics
- Simple charts (defect class distribution, predictions over time)
- Purely derived from data already stored — no extra ML needed

### Feedback (data collection only, for Phase 2)
- On a prediction detail view: "Confirm" or "Correct label" action
- Correction is just stored in the DB (image reference + corrected label +
  timestamp + user). Nothing else happens with it in Phase 1.

### Defect Classes (from WM-811K)
`Center`, `Donut`, `Edge-Loc`, `Edge-Ring`, `Loc`, `Random`, `Scratch`,
`Near-full`, `None`

## 4. Architecture (Phase 1)

```
┌─────────────────┐        HTTPS / JSON        ┌──────────────────────┐
│   Frontend       │ ──────────────────────────▶│   Backend (FastAPI)  │
│   Next.js        │◀────────────────────────── │                       │
│   Tailwind/MUI    │        REST API v1          │  - Auth (JWT)         │
└─────────────────┘                              │  - Predictions CRUD   │
                                                  │  - Feedback storage   │
                                                  │  - Analytics queries  │
                                                  │  - Inference service  │
                                                  │      (loads model     │
                                                  │       once at start)  │
                                                  └──────────┬────────────┘
                                                             │
                                                  ┌──────────▼────────────┐
                                                  │  models/downloads/     │
                                                  │  existing pretrained   │
                                                  │  model (.pt file)      │
                                                  └────────────────────────┘

                                                  ┌────────────────────────┐
                                                  │  SQLite (app.db)       │
                                                  │  committed to repo     │
                                                  │  for easy team sync    │
                                                  └────────────────────────┘
```

Key principle: **model is loaded once at backend startup and reused for
every request.** No per-request model loading, no training in the request
path, ever.

## 5. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router) + Tailwind CSS |
| Backend | Python, FastAPI |
| DB | SQLite (`app.db` file, committed to source control) |
| ORM | SQLModel or SQLAlchemy (recommended: SQLModel — pairs naturally with FastAPI + Pydantic) |
| Auth | JWT (e.g. `python-jose` or `fastapi-users` if time allows; hand-rolled JWT is fine) |
| ML (Phase 1) | Existing pretrained PyTorch model (ResNet18 or small CNN), inference-only, served via FastAPI |
| ML (Phase 2) | Fine-tuning on Google Colab (free tier), see `03_MODEL_TRAINING.md` |

**Why Tailwind over MUI:** MUI's component defaults tend to look
"admin-templated" out of the box, and you're not building complex
data-grids at Phase-1 scope. Tailwind + a few hand-styled components will
look more intentional for a dashboard-style demo. If the team is more
comfortable with MUI components (esp. for charts/tables), that's a fine
substitution — just pick one and don't mix both.

## 6. Team Split (3 people, parallel work)

- **Person A — Backend**: Auth, DB schema, predictions CRUD, feedback
  endpoint, analytics endpoint
- **Person B — Backend/ML integration**: Inference service wrapper around
  the existing model, Grad-CAM generation, `/predictions` upload endpoint
  (this person owns the API contract's ML-facing parts most closely)
- **Person C — Frontend**: All FE screens, built against the mock layer
  first (see API contract), then swapped to real BE as endpoints land

This split lets FE start immediately without waiting on BE, as long as
everyone builds against `02_API_CONTRACT.md` exactly.

## 7. Definition of Done — Phase 1 (Monday)

- [ ] User can sign up and log in
- [ ] User can upload a wafer map image and get a prediction + Grad-CAM
- [ ] Prediction is saved and shows up in history
- [ ] History is filterable
- [ ] Analytics page shows at least 2 charts from real stored data
- [ ] Feedback "correct label" action stores a row in the DB (does not need
      to do anything further)
- [ ] FE fully integrated with real BE (mock layer removed or clearly
      dev-only)
- [ ] `app.db` committed with at least a few seeded/sample predictions so
      the demo doesn't start empty
