# RecipeBook

A pantry-first recipe discovery app. Tell it your diet, your meal, and what's
in your kitchen — it ranks recipes by **Pantry Match %**, the share of a
recipe's ingredients you already have.

```
recipebook/
├── frontend/   React + Vite app
└── backend/    FastAPI app
```

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+

## Running locally (development — two servers)

Best for day-to-day development: instant hot-reload on the frontend, `--reload`
on the backend, separate terminals.

### 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

The API is now running at `http://localhost:8000`. Interactive docs at
`http://localhost:8000/docs`. Health check at `http://localhost:8000/health`.

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Visit `http://localhost:5173`. The frontend reads the backend URL from
`VITE_API_BASE_URL` (set in `frontend/.env`) so it can talk to the backend
running on a different port.

## Running as one service (production-style)

FastAPI can serve the built frontend directly, so the whole app runs as a
single process on a single port — no CORS, no separate frontend host.

```bash
# from the project root

# 1. build the frontend
cd frontend
npm install
npm run build            # outputs frontend/dist
cd ..

# 2. install backend deps and start the single server
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

Visit `http://localhost:8000` — this now serves the React app itself, with
the API live underneath it at `/api/*`. Do **not** set `VITE_API_BASE_URL`
for this mode; the frontend defaults to same-origin requests, which is
correct here.

How it works: `backend/main.py` checks whether `frontend/dist` exists at
startup. If it does, FastAPI mounts it as static files and serves
`index.html` for any route it doesn't otherwise recognize (so client-side
routes like `/recipe/some-id` work on a direct link or refresh, not just
in-app navigation). If `frontend/dist` doesn't exist, the backend just runs
as a plain JSON API — useful if you're only running it in the two-server dev
mode above.

**Build command:** `cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt`
**Start command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

This is the pair to use if your host wants a single build command and a
single start command (Render, Railway, Fly.io, a single Docker container,
etc.).

## User flow

```
Home → Preferences (diet + meal) → Pantry (ingredients) → Discovery → Recipe Details
```

State (diet, meal type, ingredients, "only these ingredients" toggle) lives in
a React Context (`PantryContext`) so it persists as you move between pages in
one session.

## API

### `POST /api/recipes/recommend`

```json
{
  "diet": "vegetarian",
  "meal_type": "lunch",
  "ingredients": ["potato", "onion", "tomato"],
  "only_these_ingredients": false,
  "sort_by": "best_match"
}
```

`sort_by` is one of `best_match`, `quickest`, `lowest_calories`.

Returns a ranked list of recipes with `pantry_match` (0-100), calories, time,
servings, and the split between ingredients you have vs. are missing.

### `GET /api/recipes/{id}?ingredients=potato,onion`

Full recipe detail: ingredients with quantities, numbered instructions, and
(if `ingredients` is passed) pantry match info for that recipe.

### `GET /health`

Returns `{"status": "ok"}`.

## Matching logic

- Ingredient names are normalized (case, whitespace, common plurals) so
  "Tomato", "tomatoes", and "TOMATO" all match the same ingredient.
- Pantry staples (salt, oil, common spices) are assumed available and never
  count against your Pantry Match %.
- **Pantry Match % = (matched non-staple ingredients / total non-staple
  ingredients) × 100**.
- Diet visibility is one-directional: vegetarian users only ever see
  vegetarian recipes; eggetarian users see vegetarian + eggetarian; only
  non-vegetarian users see meat recipes.
- The "I have only these ingredients" toggle filters results down to 100%
  matches only.

## Recipe dataset

33 recipes in `backend/data/recipes.json`, spanning all four meal types and
all three diet categories, with at least one recipe for every diet × meal
combination. Calories are presented as estimates, not medical/nutritional
claims.

## Deployment notes

**Single service (recommended for this project):** see "Running as one
service" above. One build command, one start command, one URL. CORS doesn't
come into play since the frontend and API share an origin — `CORS_ORIGINS`
is simply unused in this mode.

**Two separate services** (e.g. a static host for the frontend + a separate
API host) is also possible if you'd rather deploy them independently:
- Backend build/start: `pip install -r requirements.txt` /
  `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Frontend build: `npm install && npm run build`, then serve the
  `frontend/dist` folder as a static site (or `npx serve -s dist`)
- Set `CORS_ORIGINS` (backend) to the frontend's deployed origin
- Set `VITE_API_BASE_URL` (frontend, at build time) to the backend's
  deployed URL — never hardcode `localhost` here for a production build

No database is required either way — the recipe dataset is a static JSON
file loaded into memory on startup.
