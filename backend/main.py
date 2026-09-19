"""RecipeBook FastAPI application entrypoint.

Serves the JSON API under /api/*, plus the built React frontend (from
frontend/dist) as static files -- so the whole app runs as a single
process/service in production. In local dev, run the Vite dev server
separately instead (see README); the static mount below is a no-op until
frontend/dist actually exists.
"""

import os

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError

from routes import recipes

app = FastAPI(
    title="RecipeBook API",
    description="Pantry-first recipe recommendation API.",
    version="1.0.0",
)

# CORS configuration.
# CORS_ORIGINS can be a comma-separated list of allowed origins, e.g.
#   CORS_ORIGINS="http://localhost:5173,https://recipebook.example.com"
# Defaults to permissive localhost origins for local development.
_default_origins = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
origins_env = os.getenv("CORS_ORIGINS", _default_origins)
allowed_origins = [o.strip() for o in origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Turn Pydantic validation errors into the app's consistent error shape."""
    errors = exc.errors()
    message = "Invalid request."
    if errors:
        first = errors[0]
        loc = ".".join(str(p) for p in first.get("loc", []) if p != "body")
        message = f"Invalid value for '{loc}': {first.get('msg')}"
    return JSONResponse(
        status_code=422,
        content={"error": "validation_error", "message": message},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Ensure raised HTTPExceptions (routes use dict details) return a
    consistent {error, message} JSON shape."""
    detail = exc.detail
    if isinstance(detail, dict) and "error" in detail and "message" in detail:
        content = detail
    else:
        content = {"error": "http_error", "message": str(detail)}
    return JSONResponse(status_code=exc.status_code, content=content)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "server_error",
            "message": "Something went wrong on our end. Please try again.",
        },
    )


app.include_router(recipes.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}


# --- Serve the built frontend (frontend/dist), if present. ---
#
# This must be registered AFTER the API routes above, so /api/* and /health
# are always handled by FastAPI first and never shadowed by the static mount.
#
# Path resolves to <project_root>/frontend/dist regardless of the working
# directory the server is started from.
_FRONTEND_DIST = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "dist"
)
_FRONTEND_DIST = os.path.normpath(_FRONTEND_DIST)
_INDEX_HTML = os.path.join(_FRONTEND_DIST, "index.html")

_FRONTEND_ASSETS = os.path.join(_FRONTEND_DIST, "assets")

if os.path.isdir(_FRONTEND_DIST) and os.path.isfile(_INDEX_HTML):
    # Serve hashed build assets (JS/CSS/images) directly, if the build
    # produced an assets folder (Vite's default output layout).
    if os.path.isdir(_FRONTEND_ASSETS):
        app.mount(
            "/assets",
            StaticFiles(directory=_FRONTEND_ASSETS),
            name="frontend-assets",
        )

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        """Catch-all: serve index.html for any non-API route so React
        Router's client-side routes (e.g. /recipe/some-id) work on a hard
        refresh or direct link, not just on in-app navigation."""
        requested_file = os.path.join(_FRONTEND_DIST, full_path)
        if full_path and os.path.isfile(requested_file):
            return FileResponse(requested_file)
        return FileResponse(_INDEX_HTML)

else:
    @app.get("/")
    def root():
        return {
            "name": "RecipeBook API",
            "status": "ok",
            "docs": "/docs",
            "note": "frontend/dist not found -- run the frontend separately in dev, "
            "or run 'npm run build' in frontend/ before starting this server.",
        }
