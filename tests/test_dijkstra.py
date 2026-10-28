
import pytest

from backend.app.services.dijkstra import dijkstra


@pytest.fixture
def sample_graph():
    # Artificial test graph, not campus data.
    return {
        "A": [("B", 4), ("C", 2)],
        "B": [("A", 4), ("D", 1)],
        "C": [("A", 2), ("D", 3)],
        "D": [("B", 1), ("C", 3)],
        "E": [],
    }


def test_shortest_distance(sample_graph):
    distance, path = dijkstra(sample_graph, "A", "D")

    assert distance == 5
    assert path in (["A", "B", "D"], ["A", "C", "D"])


def test_same_source_and_destination(sample_graph):
    distance, path = dijkstra(sample_graph, "A", "A")

    assert distance == 0
    assert path == ["A"]


def test_unreachable_destination(sample_graph):
    distance, path = dijkstra(sample_graph, "A", "E")

    assert distance == float("inf")
    assert path == []


def test_invalid_source(sample_graph):
    with pytest.raises(ValueError, match="Source node"):
        dijkstra(sample_graph, "X", "D")


def test_invalid_destination(sample_graph):
    with pytest.raises(ValueError, match="Destination node"):
        dijkstra(sample_graph, "A", "X")


def test_negative_edge_weight():
    graph = {
        "A": [("B", -2)],
        "B": [],
    }

    with pytest.raises(ValueError, match="Negative edge weight"):
        dijkstra(graph, "A", "B")

def test_shortest_path_requires_multiple_relaxations():
    graph = {
        "A": [("B", 10), ("C", 2)],
        "B": [("D", 2)],
        "C": [("B", 3), ("D", 10)],
        "D": []
    }

    distance, path = dijkstra(graph, "A", "D")

    assert distance == 7
    assert path == ["A", "C", "B", "D"]


def test_zero_weight_edge():
    graph = {
        "A": [("B", 0), ("C", 5)],
        "B": [("C", 2)],
        "C": []
    }

    distance, path = dijkstra(graph, "A", "C")

    assert distance == 2
    assert path == ["A", "B", "C"]


def test_disconnected_node():
    graph = {
        "A": [("B", 4)],
        "B": [],
        "C": []
    }

    distance, path = dijkstra(graph, "A", "C")

    assert path == []
    assert distance == float("inf")


def test_missing_neighbor_node():
    graph = {
        "A": [("B", 3)]
    }

    import pytest

    with pytest.raises(ValueError):
        dijkstra(graph, "A", "B")
