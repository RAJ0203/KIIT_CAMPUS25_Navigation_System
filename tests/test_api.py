
from types import SimpleNamespace

import pytest
from fastapi.testclient import TestClient

import app.main as app_module
from app.dependencies import get_current_user
from app.main import app
from app.services.graph_loader import build_graph


TEST_LOCATIONS = [
    {"id": "A", "name": "Test Location A"},
    {"id": "B", "name": "Test Location B"},
    {"id": "C", "name": "Test Location C"},
    {"id": "D", "name": "Test Location D"},
]

TEST_EDGES = [
    ("A", "B", 4),
    ("A", "C", 2),
    ("C", "B", 1),
    ("B", "D", 5),
    ("C", "D", 8),
]

TEST_GRAPH = build_graph(
    nodes=[location["id"] for location in TEST_LOCATIONS],
    edges=TEST_EDGES,
)


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def authenticated_client(monkeypatch):
    # Start the app first; its lifespan may attempt to load canonical data.
    with TestClient(app) as test_client:
        # Inject test-only graph data after startup.
        monkeypatch.setattr(app_module, "CAMPUS_LOCATIONS", TEST_LOCATIONS)
        monkeypatch.setattr(app_module, "CAMPUS_GRAPH", TEST_GRAPH)
        monkeypatch.setattr(
            app_module,
            "LOCATION_IDS",
            {location["id"] for location in TEST_LOCATIONS},
        )
        monkeypatch.setattr(app_module, "GRAPH_LOAD_ERROR", None)

        app.dependency_overrides[get_current_user] = lambda: SimpleNamespace(
            id=1,
            username="test_user",
        )

        yield test_client

        app.dependency_overrides.pop(get_current_user, None)


def test_health_check(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["status"] == "running"


def test_get_locations(authenticated_client):
    # Locations remain public; test data is injected only by the fixture.
    response = authenticated_client.get("/locations")

    assert response.status_code == 200
    assert response.json()["locations"] == TEST_LOCATIONS


def test_locations_unavailable_without_canonical_graph(client, monkeypatch):
    monkeypatch.setattr(app_module, "CAMPUS_LOCATIONS", [])
    monkeypatch.setattr(app_module, "GRAPH_LOAD_ERROR", "Canonical data missing")

    response = client.get("/locations")

    assert response.status_code == 503


def test_shortest_route(authenticated_client):
    response = authenticated_client.post(
        "/route",
        json={"source": "A", "destination": "D"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "distance": 8,
        "path": ["A", "C", "B", "D"],
    }


def test_source_location_not_found(authenticated_client):
    response = authenticated_client.post(
        "/route",
        json={"source": "UNKNOWN", "destination": "D"},
    )

    assert response.status_code == 404


def test_destination_location_not_found(authenticated_client):
    response = authenticated_client.post(
        "/route",
        json={"source": "A", "destination": "UNKNOWN"},
    )

    assert response.status_code == 404


def test_missing_destination(authenticated_client):
    response = authenticated_client.post(
        "/route",
        json={"source": "A"},
    )

    assert response.status_code == 422


def test_empty_source_is_rejected(authenticated_client):
    response = authenticated_client.post(
        "/route",
        json={"source": "", "destination": "D"},
    )

    assert response.status_code == 422


def test_route_requires_authentication(client):
    # No dependency override: the real JWT check must run.
    response = client.post(
        "/route",
        json={"source": "A", "destination": "D"},
    )

    assert response.status_code == 401


def test_auth_endpoints_are_registered(client):
    schema = client.get("/openapi.json").json()
    paths = schema["paths"]

    assert "/auth/register" in paths
    assert "/auth/login" in paths
    assert "/auth/me" in paths
