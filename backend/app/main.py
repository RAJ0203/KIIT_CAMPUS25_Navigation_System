
"""FastAPI application for KIIT CAMPUS25 navigation."""

import os
from contextlib import asynccontextmanager
from math import inf
from pathlib import Path
from typing import Any

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel, Field

from app.auth_router import router as auth_router
from app.database import init_db
from app.dependencies import get_current_user
from app.models import User
from app.services.dijkstra import dijkstra
from app.services.graph_loader import load_graph_data


# Canonical campus data is expected in the repository's data directory.
PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DATA_DIR = PROJECT_ROOT / "data"
DATA_DIR = Path(os.getenv("CAMPUS25_DATA_DIR", str(DEFAULT_DATA_DIR)))

CAMPUS_LOCATIONS: list[dict[str, Any]] = []
CAMPUS_GRAPH: dict[str, list[tuple[str, float]]] = {}
LOCATION_IDS: set[str] = set()
GRAPH_LOAD_ERROR: str | None = None


def load_campus_graph() -> None:
    """Load canonical campus data; never substitute a test graph."""
    global CAMPUS_LOCATIONS
    global CAMPUS_GRAPH
    global LOCATION_IDS
    global GRAPH_LOAD_ERROR

    try:
        locations, graph = load_graph_data(DATA_DIR)
    except (FileNotFoundError, ValueError, TypeError, OSError) as exc:
        CAMPUS_LOCATIONS = []
        CAMPUS_GRAPH = {}
        LOCATION_IDS = set()
        GRAPH_LOAD_ERROR = str(exc)
        return

    CAMPUS_LOCATIONS = locations
    CAMPUS_GRAPH = graph
    LOCATION_IDS = {location["id"] for location in locations}
    GRAPH_LOAD_ERROR = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    load_campus_graph()
    yield


app = FastAPI(
    title="KIIT CAMPUS25 Navigation API",
    description="Backend API for campus navigation and shortest-path calculation.",
    version="1.0.0",
    lifespan=lifespan,
)

# Keep authentication and navigation endpoints on the shared FastAPI app.
app.include_router(auth_router)


class RouteRequest(BaseModel):
    source: str = Field(min_length=1)
    destination: str = Field(min_length=1)


class RouteResponse(BaseModel):
    distance: int | float
    path: list[str]


def require_campus_graph() -> None:
    """Prevent navigation against missing or invalid campus data."""
    if GRAPH_LOAD_ERROR is not None or not CAMPUS_LOCATIONS:
        raise HTTPException(
            status_code=503,
            detail=(
                "Campus navigation data is unavailable. "
                "The canonical locations, edges, and floors data "
                "must be supplied and validated before navigation can run."
            ),
        )


@app.get("/")
def health_check():
    return {
        "status": "running",
        "message": "KIIT CAMPUS25 Navigation API is running.",
    }


@app.get("/locations")
def get_locations():
    # Public endpoint: no authentication required.
    require_campus_graph()
    return {"locations": CAMPUS_LOCATIONS}


@app.post("/route", response_model=RouteResponse)
def get_route(
    request: RouteRequest,
    current_user: User = Depends(get_current_user),
):
    # JWT authentication is required by the project contract.
    # current_user is supplied by the existing authentication dependency.
    require_campus_graph()

    source = request.source.strip()
    destination = request.destination.strip()

    if source not in LOCATION_IDS:
        raise HTTPException(
            status_code=404,
            detail=f"Source location '{source}' was not found.",
        )

    if destination not in LOCATION_IDS:
        raise HTTPException(
            status_code=404,
            detail=f"Destination location '{destination}' was not found.",
        )

    distance, path = dijkstra(CAMPUS_GRAPH, source, destination)

    if distance == inf:
        raise HTTPException(
            status_code=404,
            detail="No route exists between the selected locations.",
        )

    return {"distance": distance, "path": path}
