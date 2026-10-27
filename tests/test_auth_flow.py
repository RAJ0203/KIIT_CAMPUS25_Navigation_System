
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import app.main as app_module
from app.database import Base, get_db
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
def auth_client(monkeypatch):
    # Use an isolated in-memory SQLite database for this test.
    test_engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    testing_session_local = sessionmaker(
        bind=test_engine,
        autoflush=False,
        autocommit=False,
    )

    Base.metadata.create_all(bind=test_engine)

    def override_get_db():
        db = testing_session_local()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    # Inject the temporary graph only into this test's app state.
    monkeypatch.setattr(app_module, "CAMPUS_LOCATIONS", TEST_LOCATIONS)
    monkeypatch.setattr(app_module, "CAMPUS_GRAPH", TEST_GRAPH)
    monkeypatch.setattr(
        app_module,
        "LOCATION_IDS",
        {location["id"] for location in TEST_LOCATIONS},
    )
    monkeypatch.setattr(app_module, "GRAPH_LOAD_ERROR", None)

    # Do not enter TestClient as a context manager: this test intentionally
    # avoids the application lifespan and its default database initialization.
    client = TestClient(app)

    try:
        yield client
    finally:
        app.dependency_overrides.pop(get_db, None)
        Base.metadata.drop_all(bind=test_engine)
        test_engine.dispose()


def test_register_login_me_and_protected_route(auth_client):
    # Register a user.
    register_response = auth_client.post(
        "/auth/register",
        json={
            "username": "integration_user",
            "password": "secure-test-password",
        },
    )

    assert register_response.status_code == 201
    registered_user = register_response.json()
    assert registered_user["username"] == "integration_user"
    assert "password" not in registered_user
    assert "password_hash" not in registered_user

    # Log in and receive a JWT.
    login_response = auth_client.post(
        "/auth/login",
        json={
            "username": "integration_user",
            "password": "secure-test-password",
        },
    )

    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    assert token
    assert login_response.json()["token_type"] == "bearer"

    headers = {"Authorization": f"Bearer {token}"}

    # Verify the authenticated user's identity.
    me_response = auth_client.get("/auth/me", headers=headers)

    assert me_response.status_code == 200
    assert me_response.json()["username"] == "integration_user"

    # Verify the same real JWT grants access to route calculation.
    route_response = auth_client.post(
        "/route",
        json={"source": "A", "destination": "D"},
        headers=headers,
    )

    assert route_response.status_code == 200
    assert route_response.json() == {
        "distance": 8,
        "path": ["A", "C", "B", "D"],
    }


def test_invalid_token_is_rejected(auth_client):
    response = auth_client.get(
        "/auth/me",
        headers={"Authorization": "Bearer invalid-token"},
    )

    assert response.status_code == 401


def test_invalid_login_is_rejected(auth_client):
    response = auth_client.post(
        "/auth/login",
        json={
            "username": "unknown_user",
            "password": "wrong-password",
        },
    )

    assert response.status_code == 401
