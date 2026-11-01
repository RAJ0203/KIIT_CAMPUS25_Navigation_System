"""Navigation API contract tests using a controlled synthetic graph.

These tests verify API and routing behavior without depending on the unfinished
canonical campus dataset. Their IDs and edge weights are test-only values and
are not claims about measured KIIT campus routes.
"""

from types import SimpleNamespace

import pytest
from fastapi.testclient import TestClient

import app.main as app_module
from app.dependencies import get_current_user
from app.main import app
from app.services.graph_loader import build_graph


@pytest.fixture
def navigation_client(monkeypatch):
    locations = [
        {"id": "SAME", "name": "Same-node test", "block": "A", "floor": 0, "x": None, "y": None, "type": "room"},
        {"id": "DIRECT_A", "name": "Direct A", "block": "A", "floor": 0, "x": 1, "y": 1, "type": "room"},
        {"id": "DIRECT_B", "name": "Direct B", "block": "A", "floor": 0, "x": 2, "y": 1, "type": "room"},
        {"id": "MULTI_A", "name": "Multi A", "block": "A", "floor": 0, "x": 1, "y": 2, "type": "room"},
        {"id": "MULTI_MID", "name": "Multi midpoint", "block": "A", "floor": 0, "x": 2, "y": 2, "type": "junction"},
        {"id": "MULTI_ALT", "name": "Multi alternate", "block": "A", "floor": 0, "x": 2, "y": 3, "type": "junction"},
        {"id": "MULTI_B", "name": "Multi B", "block": "A", "floor": 0, "x": 3, "y": 2, "type": "room"},
        {"id": "BLOCK_A", "name": "Block A test room", "block": "A", "floor": 0, "x": 1, "y": 4, "type": "room"},
        {"id": "CROSS_HALL", "name": "Cross-block test connector", "block": "A", "floor": 0, "x": 2, "y": 4, "type": "junction"},
        {"id": "BLOCK_B", "name": "Block B test room", "block": "B", "floor": 0, "x": 3, "y": 4, "type": "room"},
        {"id": "F0_ROOM", "name": "Floor 0 test room", "block": "C", "floor": 0, "x": 1, "y": 5, "type": "room"},
        {"id": "STAIR_F0", "name": "Test staircase floor 0", "block": "C", "floor": 0, "x": 2, "y": 5, "type": "stair"},
        {"id": "STAIR_F1", "name": "Test staircase floor 1", "block": "C", "floor": 1, "x": 2, "y": 5, "type": "stair"},
        {"id": "F1_ROOM", "name": "Floor 1 test room", "block": "C", "floor": 1, "x": 3, "y": 5, "type": "room"},
        {"id": "ISOLATED", "name": "Disconnected test location", "block": "D", "floor": 0, "x": 1, "y": 6, "type": "room"},
        {"id": "LIFT_F0", "name": "Lift location floor 0", "block": "D", "floor": 0, "x": 2, "y": 6, "type": "lift"},
        {"id": "LIFT_F1", "name": "Lift location floor 1", "block": "D", "floor": 1, "x": 2, "y": 6, "type": "lift"},
    ]

    edges = [
        ("DIRECT_A", "DIRECT_B", 7),
        ("MULTI_A", "MULTI_MID", 2),
        ("MULTI_MID", "MULTI_B", 3),
        ("MULTI_A", "MULTI_ALT", 1),
        ("MULTI_ALT", "MULTI_B", 8),
        ("MULTI_A", "MULTI_B", 10),
        ("BLOCK_A", "CROSS_HALL", 3),
        ("CROSS_HALL", "BLOCK_B", 4),
        ("F0_ROOM", "STAIR_F0", 2),
        ("STAIR_F0", "STAIR_F1", 26),
        ("STAIR_F1", "F1_ROOM", 3),
    ]

    graph = build_graph(
        nodes=[location["id"] for location in locations],
        edges=edges,
    )

    with TestClient(app) as client:
        monkeypatch.setattr(app_module, "CAMPUS_LOCATIONS", locations)
        monkeypatch.setattr(app_module, "CAMPUS_GRAPH", graph)
        monkeypatch.setattr(
            app_module, "LOCATION_IDS", {location["id"] for location in locations}
        )
        monkeypatch.setattr(app_module, "GRAPH_LOAD_ERROR", None)

        app.dependency_overrides[get_current_user] = lambda: SimpleNamespace(
            id=1, username="navigation_test_user"
        )
        try:
            yield client
        finally:
            app.dependency_overrides.pop(get_current_user, None)


def test_same_node(navigation_client):
    response = navigation_client.post(
        "/route", json={"source": "SAME", "destination": "SAME"}
    )

    assert response.status_code == 200
    assert response.json() == {"distance": 0, "path": ["SAME"]}


def test_direct_route(navigation_client):
    response = navigation_client.post(
        "/route", json={"source": "DIRECT_A", "destination": "DIRECT_B"}
    )

    assert response.status_code == 200
    assert response.json() == {"distance": 7, "path": ["DIRECT_A", "DIRECT_B"]}


def test_multi_edge_route(navigation_client):
    response = navigation_client.post(
        "/route", json={"source": "MULTI_A", "destination": "MULTI_B"}
    )

    assert response.status_code == 200
    assert response.json() == {
        "distance": 5,
        "path": ["MULTI_A", "MULTI_MID", "MULTI_B"],
    }


def test_reverse_route(navigation_client):
    response = navigation_client.post(
        "/route", json={"source": "DIRECT_B", "destination": "DIRECT_A"}
    )

    assert response.status_code == 200
    assert response.json() == {"distance": 7, "path": ["DIRECT_B", "DIRECT_A"]}


def test_cross_block_route(navigation_client):
    response = navigation_client.post(
        "/route", json={"source": "BLOCK_A", "destination": "BLOCK_B"}
    )

    assert response.status_code == 200
    assert response.json() == {
        "distance": 7,
        "path": ["BLOCK_A", "CROSS_HALL", "BLOCK_B"],
    }


def test_cross_floor_route(navigation_client):
    response = navigation_client.post(
        "/route", json={"source": "F0_ROOM", "destination": "F1_ROOM"}
    )

    assert response.status_code == 200
    assert response.json() == {
        "distance": 31,
        "path": ["F0_ROOM", "STAIR_F0", "STAIR_F1", "F1_ROOM"],
    }


def test_invalid_source(navigation_client):
    response = navigation_client.post(
        "/route", json={"source": "NOT_A_LOCATION", "destination": "DIRECT_B"}
    )

    assert response.status_code == 404
    assert "Source location" in response.json()["detail"]


def test_invalid_destination(navigation_client):
    response = navigation_client.post(
        "/route", json={"source": "DIRECT_A", "destination": "NOT_A_LOCATION"}
    )

    assert response.status_code == 404
    assert "Destination location" in response.json()["detail"]


def test_unreachable_node(navigation_client):
    response = navigation_client.post(
        "/route", json={"source": "DIRECT_A", "destination": "ISOLATED"}
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "No route exists between the selected locations."


def test_staircase_transition_uses_26_units(navigation_client):
    response = navigation_client.post(
        "/route", json={"source": "STAIR_F0", "destination": "STAIR_F1"}
    )

    assert response.status_code == 200
    assert response.json() == {
        "distance": 26,
        "path": ["STAIR_F0", "STAIR_F1"],
    }


def test_lift_guidance_does_not_create_dijkstra_transition(navigation_client):
    """Lift locations alone must not create a cross-floor graph edge.

    The current API has no separate lift-guidance response field; this test only
    verifies that the routing graph does not invent a lift transition.
    """
    response = navigation_client.post(
        "/route", json={"source": "LIFT_F0", "destination": "LIFT_F1"}
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "No route exists between the selected locations."


def test_route_trims_source_and_destination_whitespace(navigation_client):
    response = navigation_client.post(
        "/route", json={"source": "  DIRECT_A  ", "destination": " DIRECT_B "}
    )

    assert response.status_code == 200
    assert response.json() == {"distance": 7, "path": ["DIRECT_A", "DIRECT_B"]}
