# API Contract — v1

This is the source of truth for how Frontend and Backend talk to each other.
**Both sides build against this document, not against each other's code.**
FE can mock these exact shapes and swap to the real BE later with zero
changes to component logic, as long as this contract doesn't drift without
both sides agreeing.

If a change is needed mid-sprint: update this file first, message the team,
then implement. Do not silently change response shapes.

## 1. Base URL & Versioning

```
Local dev BE: http://localhost:8000
All endpoints prefixed: /api/v1
```

Versioning rule: breaking changes go in `/api/v2`, `/api/v1` stays stable
once FE integration starts. Additive changes (new optional field) are fine
within v1.

## 2. Auth

Auth uses JWT bearer tokens.

```
Authorization: Bearer <token>
```

Token is returned on login/signup, stored client-side (localStorage or
cookie — FE's choice), attached to every authenticated request.

### POST /api/v1/auth/signup

Request:
```json
{
  "email": "engineer@fab.com",
  "password": "min8chars",
  "name": "Jane Doe"
}
```

Response `201`:
```json
{
  "user": {
    "id": "usr_01HZY...",
    "email": "engineer@fab.com",
    "name": "Jane Doe",
    "created_at": "2026-07-17T10:00:00Z"
  },
  "token": "eyJhbGciOi..."
}
```

Error `409`: email already registered — see Error Format below.

### POST /api/v1/auth/login

Request:
```json
{ "email": "engineer@fab.com", "password": "min8chars" }
```

Response `200`: same shape as signup response (`user` + `token`).

Error `401`: invalid credentials.

### GET /api/v1/auth/me

Auth required. Returns current user (same `user` object as above).
Used by FE on app load to check if the stored token is still valid.

## 3. Predictions (core feature)

### POST /api/v1/predictions

Upload a wafer map image, run inference, store + return the result.

Request: `multipart/form-data`
```
file: <image file>   (png/jpg, wafer map)
```

Response `201`:
```json
{
  "id": "pred_01J3F...",
  "user_id": "usr_01HZY...",
  "created_at": "2026-07-17T10:05:00Z",
  "image_url": "/media/predictions/pred_01J3F.png",
  "heatmap_url": "/media/predictions/pred_01J3F_heatmap.png",
  "predicted_class": "Edge-Ring",
  "confidence": 0.874,
  "class_probabilities": {
    "Center": 0.01,
    "Donut": 0.02,
    "Edge-Loc": 0.03,
    "Edge-Ring": 0.874,
    "Loc": 0.02,
    "Random": 0.01,
    "Scratch": 0.02,
    "Near-full": 0.01,
    "None": 0.006
  },
  "feedback": null
}
```

`feedback` is `null` until the user submits a correction (see below), then
becomes the feedback object.

Error `422`: bad/unsupported file. Error `500` with a clear message if
inference fails — **never let a stack trace leak to FE**, always wrap in
the standard error format.

### GET /api/v1/predictions

Auth required. Returns the logged-in user's prediction history, paginated.

Query params:
```
?page=1&page_size=20&defect_class=Edge-Ring&from=2026-07-01&to=2026-07-17
```
All query params optional.

Response `200`:
```json
{
  "items": [ /* array of prediction objects, same shape as POST response */ ],
  "page": 1,
  "page_size": 20,
  "total": 47
}
```

### GET /api/v1/predictions/{id}

Auth required. Returns a single prediction object (same shape as above).
`404` if not found or not owned by the requesting user.

### POST /api/v1/predictions/{id}/feedback

Store a human correction/confirmation. **Phase 1: storage only, no
retraining is triggered.**

Request:
```json
{
  "is_correct": false,
  "corrected_class": "Scratch"
}
```
(`corrected_class` omitted/null when `is_correct: true`)

Response `200`: updated prediction object, with `feedback` populated:
```json
{
  "...": "...same prediction fields...",
  "feedback": {
    "is_correct": false,
    "corrected_class": "Scratch",
    "submitted_by": "usr_01HZY...",
    "submitted_at": "2026-07-17T11:00:00Z"
  }
}
```

## 4. Analytics

### GET /api/v1/analytics/summary

Auth required. Aggregated data for charts, scoped to the logged-in user
(or all data if you decide analytics is global — pick one and document it
here once decided; default assumption: **per-user**).

Response `200`:
```json
{
  "total_predictions": 47,
  "class_distribution": {
    "Center": 3, "Donut": 1, "Edge-Loc": 5, "Edge-Ring": 12,
    "Loc": 2, "Random": 8, "Scratch": 4, "Near-full": 1, "None": 11
  },
  "predictions_over_time": [
    { "date": "2026-07-15", "count": 10 },
    { "date": "2026-07-16", "count": 22 },
    { "date": "2026-07-17", "count": 15 }
  ]
}
```

## 5. Standard Error Format

Every non-2xx response uses this shape, no exceptions:

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect."
  }
}
```

FE should render `error.message` directly when available, and fall back to
a generic "Something went wrong" if the response doesn't match this shape
(defensive — in case of a proxy error, 502, etc. that never reaches FastAPI).

## 6. FE Mock Layer (before BE endpoints are ready)

FE should build a small mock module (e.g. `lib/api/mock.ts`) that returns
objects matching the exact JSON shapes above, with a flag to switch between
mock and real:

```ts
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
```

All API calls should go through a single client module (e.g. `lib/api/client.ts`)
so swapping mock → real is a one-line env var change, not a rewrite of
components. Components should never call `fetch` directly.

Mock data must include:
- At least one prediction per defect class (for testing the analytics chart
  and history filters visually before real data exists)
- At least one prediction with `feedback` already populated (to build the
  "already reviewed" UI state)

## 7. Image Handling Convention

- Uploaded wafer map images and generated heatmaps are served as static
  files by the backend under `/media/...`
- FE always uses the full `image_url` / `heatmap_url` string returned by
  the API — never constructs these paths itself
- Backend is responsible for image resizing/normalization needed for model
  input; FE sends the original uploaded file as-is
