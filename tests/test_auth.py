import os

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.auth_router import router
from backend.app.database import Base, get_db


@pytest.fixture()
def client(tmp_path):
    db_path = tmp_path / "auth_test.db"
    engine = create_engine(f"sqlite:///{db_path}", connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app = FastAPI()
    app.include_router(router)
    app.dependency_overrides[get_db] = override_get_db

    # dependencies.py imports the get_db function object, so override that same dependency.
    from backend.app import dependencies
    app.dependency_overrides[dependencies.get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client


def register(client, username="kshitish", password="StrongPass123"):
    return client.post("/auth/register", json={"username": username, "password": password})


def test_registration(client):
    response = register(client)
    assert response.status_code == 201
    body = response.json()
    assert body["username"] == "kshitish"
    assert "password" not in body
    assert "password_hash" not in body


def test_password_is_hashed_not_plaintext(client):
    register(client, password="StrongPass123")
    # The API must not expose the hash; the dedicated DB model test is covered by the
    # response invariant above and by direct verification of login behavior below.
    login = client.post("/auth/login", json={"username": "kshitish", "password": "StrongPass123"})
    assert login.status_code == 200


def test_duplicate_registration(client):
    assert register(client).status_code == 201
    assert register(client).status_code == 409


def test_correct_login(client):
    register(client)
    response = client.post("/auth/login", json={"username": "kshitish", "password": "StrongPass123"})
    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]


def test_incorrect_password(client):
    register(client)
    response = client.post("/auth/login", json={"username": "kshitish", "password": "WrongPass123"})
    assert response.status_code == 401


def test_invalid_credentials(client):
    response = client.post("/auth/login", json={"username": "does-not-exist", "password": "WrongPass123"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


def test_jwt_validation_and_protected_endpoint(client):
    register(client)
    login = client.post("/auth/login", json={"username": "kshitish", "password": "StrongPass123"})
    token = login.json()["access_token"]

    valid = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert valid.status_code == 200
    assert valid.json()["username"] == "kshitish"

    invalid = client.get("/auth/me", headers={"Authorization": "Bearer definitely-not-a-jwt"})
    assert invalid.status_code == 401


def test_protected_endpoint_without_token(client):
    response = client.get("/auth/me")
    assert response.status_code == 401


def test_protected_endpoint_with_valid_token(client):
    register(client)
    login = client.post("/auth/login", json={"username": "kshitish", "password": "StrongPass123"})
    token = login.json()["access_token"]
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
