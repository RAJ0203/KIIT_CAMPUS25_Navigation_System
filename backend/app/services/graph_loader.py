
import json
import math
from pathlib import Path
from typing import Any


STAIR_COST = 26


def build_graph(
    nodes: list[str],
    edges: list[Any],
    directed: bool = False,
) -> dict[str, list[tuple[str, float]]]:
    """
    Build an adjacency-list graph.

    Edges may be supplied as:
        ("A", "B", 4)
        ["A", "B", 4]
        {"from": "A", "to": "B", "weight": 4}

    By default, edges are bidirectional.
    Edge weights must be numeric, finite, and non-negative.
    """
    if len(set(nodes)) != len(nodes):
        raise ValueError("Duplicate node IDs are not allowed")

    graph: dict[str, list[tuple[str, float]]] = {
        node: [] for node in nodes
    }

    for edge in edges:
        if isinstance(edge, dict):
            source = edge.get("from")
            destination = edge.get("to")
            weight = edge.get("weight")
        elif isinstance(edge, (tuple, list)) and len(edge) == 3:
            source, destination, weight = edge
        else:
            raise ValueError(
                "Each edge must be a dictionary or a "
                "(source, destination, weight) tuple"
            )

        if source not in graph:
            raise ValueError(f"Unknown source node: {source}")

        if destination not in graph:
            raise ValueError(f"Unknown destination node: {destination}")

        if isinstance(weight, bool) or not isinstance(weight, (int, float)):
            raise TypeError(
                f"Edge weight must be an integer or float: {weight}"
            )

        if not math.isfinite(weight):
            raise ValueError(f"Edge weight must be finite: {weight}")

        if weight < 0:
            raise ValueError(f"Edge weight cannot be negative: {weight}")

        graph[source].append((destination, weight))

        if not directed:
            graph[destination].append((source, weight))

    return graph


def _read_json(path: Path) -> Any:
    """Read a JSON file and provide useful errors for missing or invalid data."""
    if not path.exists():
        raise FileNotFoundError(f"Required data file not found: {path}")

    try:
        with path.open("r", encoding="utf-8") as file:
            return json.load(file)
    except json.JSONDecodeError as exc:
        raise ValueError(
            f"Invalid JSON in {path.name}: {exc}"
        ) from exc


def _get_records(
    data: Any,
    key: str,
    filename: str,
) -> list[dict[str, Any]]:
    """
    Accept either a JSON list or an object wrapping that list.

    Examples:
        [...]
        {"locations": [...]}
        {"edges": [...]}
    """
    if isinstance(data, list):
        records = data
    elif isinstance(data, dict):
        records = data.get(key)
    else:
        records = None

    if not isinstance(records, list):
        raise ValueError(
            f"{filename} must contain a list or an object "
            f"with a '{key}' list"
        )

    if not all(isinstance(record, dict) for record in records):
        raise ValueError(
            f"Every record in {filename} must be a JSON object"
        )

    return records


def _validate_location(location: dict[str, Any]) -> None:
    """Validate the required fields and values in a location record."""
    required_fields = ("id", "name", "block", "floor", "x", "y")

    for field in required_fields:
        if field not in location:
            raise ValueError(
                f"Location is missing required field: {field}"
            )

    location_id = location["id"]

    if (
        not isinstance(location_id, str)
        or not location_id.strip()
        or location_id != location_id.strip()
    ):
        raise ValueError(
            f"Location ID must be a non-empty, trimmed string: "
            f"{location_id}"
        )

    for field in ("name", "block"):
        value = location[field]
        if not isinstance(value, str) or not value.strip():
            raise ValueError(
                f"Location '{location_id}' has an invalid {field}"
            )

    floor = location["floor"]
    if isinstance(floor, bool) or not isinstance(floor, int):
        raise ValueError(
            f"Location '{location_id}' floor must be an integer"
        )

    for coordinate in ("x", "y"):
        value = location[coordinate]

        if (
            isinstance(value, bool)
            or not isinstance(value, (int, float))
            or not math.isfinite(value)
        ):
            raise ValueError(
                f"Location '{location_id}' has an invalid "
                f"{coordinate} coordinate"
            )

    if "type" in location:
        location_type = location["type"]
        if (
            not isinstance(location_type, str)
            or not location_type.strip()
        ):
            raise ValueError(
                f"Location '{location_id}' has an invalid type"
            )


def _validate_floors(
    data: Any,
    location_by_id: dict[str, dict[str, Any]],
    edges: list[dict[str, Any]],
) -> None:
    """
    Validate floors.json and check that staircase connectors match
    staircase edges in the graph.

    Expected structure:
        {
            "floors": [0, 1, 2, 3],
            "stairCost": 26,
            "connectors": [
                {"from": "STAIR_G", "to": "STAIR_1", "weight": 26}
            ]
        }
    """
    if not isinstance(data, dict):
        raise ValueError("floors.json must contain a JSON object")

    floor_values = data.get("floors")

    if not isinstance(floor_values, list) or not floor_values:
        raise ValueError(
            "floors.json must contain a non-empty floors list"
        )

    for floor in floor_values:
        if isinstance(floor, bool) or not isinstance(floor, int):
            raise ValueError(
                "Every value in floors.json floors must be an integer"
            )

    if len(set(floor_values)) != len(floor_values):
        raise ValueError(
            "floors.json floors must not contain duplicate floor numbers"
        )

    stair_cost = data.get("stairCost")

    if (
        isinstance(stair_cost, bool)
        or not isinstance(stair_cost, int)
        or stair_cost != STAIR_COST
    ):
        raise ValueError(
            f"floors.json stairCost must be the integer {STAIR_COST}"
        )

    floor_set = set(floor_values)

    for location_id, location in location_by_id.items():
        if location["floor"] not in floor_set:
            raise ValueError(
                f"Location '{location_id}' uses floor "
                f"{location['floor']}, which is not listed in floors.json"
            )

    connectors = data.get("connectors")

    if not isinstance(connectors, list):
        raise ValueError("floors.json connectors must be a list")

    connector_pairs: set[frozenset[str]] = set()

    for connector in connectors:
        if not isinstance(connector, dict):
            raise ValueError(
                "Every floor connector must be a JSON object"
            )

        source = connector.get("from")
        destination = connector.get("to")
        weight = connector.get("weight")

        if (
            not isinstance(source, str)
            or source not in location_by_id
        ):
            raise ValueError(
                f"Floor connector has an unknown location "
                f"for its source: {source}"
            )

        if (
            not isinstance(destination, str)
            or destination not in location_by_id
        ):
            raise ValueError(
                f"Floor connector has an unknown location "
                f"for its destination: {destination}"
            )

        if (
            isinstance(weight, bool)
            or not isinstance(weight, int)
            or weight != STAIR_COST
        ):
            raise ValueError(
                f"Floor connector weight must be the integer {STAIR_COST}"
            )

        source_floor = location_by_id[source]["floor"]
        destination_floor = location_by_id[destination]["floor"]

        if abs(source_floor - destination_floor) != 1:
            raise ValueError(
                "Floor connectors must connect consecutive floors"
            )

        pair = frozenset((source, destination))

        if pair in connector_pairs:
            raise ValueError(
                f"Duplicate floor connector: {source} <-> {destination}"
            )

        connector_pairs.add(pair)

    stair_edge_pairs: set[frozenset[str]] = set()

    for edge in edges:
        if edge.get("type") != "stair":
            continue

        source = edge["from"]
        destination = edge["to"]
        pair = frozenset((source, destination))

        if pair not in connector_pairs:
            raise ValueError(
                f"Stair edge {source} <-> {destination} "
                "is missing from floors.json connectors"
            )

        stair_edge_pairs.add(pair)

    for pair in connector_pairs:
        if pair not in stair_edge_pairs:
            source, destination = sorted(pair)
            raise ValueError(
                f"Floor connector {source} <-> {destination} "
                "has no matching type='stair' edge"
            )


def load_graph_data(
    data_dir: str | Path,
) -> tuple[list[dict[str, Any]], dict[str, list[tuple[str, float]]]]:
    """
    Load and validate locations.json, edges.json, and floors.json.

    Returns:
        locations: Validated location records.
        graph: Undirected adjacency-list graph suitable for Dijkstra.
    """
    data_path = Path(data_dir)

    locations_data = _read_json(data_path / "locations.json")
    edges_data = _read_json(data_path / "edges.json")
    floors_data = _read_json(data_path / "floors.json")

    locations = _get_records(
        locations_data,
        "locations",
        "locations.json",
    )
    edges = _get_records(
        edges_data,
        "edges",
        "edges.json",
    )

    location_ids: set[str] = set()
    location_by_id: dict[str, dict[str, Any]] = {}

    for location in locations:
        _validate_location(location)

        location_id = location["id"]

        if location_id in location_ids:
            raise ValueError(
                f"Duplicate node ID: {location_id}"
            )

        location_ids.add(location_id)
        location_by_id[location_id] = location

    for edge in edges:
        if not all(field in edge for field in ("from", "to", "weight")):
            raise ValueError(
                "Every edge must contain 'from', 'to', and 'weight'"
            )

        source = edge["from"]
        destination = edge["to"]
        weight = edge["weight"]

        if (
            not isinstance(source, str)
            or source not in location_by_id
        ):
            raise ValueError(f"Unknown source node: {source}")

        if (
            not isinstance(destination, str)
            or destination not in location_by_id
        ):
            raise ValueError(f"Unknown destination node: {destination}")

        if isinstance(weight, bool) or not isinstance(weight, int):
            raise ValueError(
                f"Edge weight must be a non-negative integer: {weight}"
            )

        if weight < 0:
            raise ValueError(
                f"Edge weight cannot be negative: {weight}"
            )

        if "type" in edge:
            edge_type = edge["type"]

            if (
                not isinstance(edge_type, str)
                or not edge_type.strip()
            ):
                raise ValueError(f"Invalid edge type: {edge_type}")

            if edge_type == "lift":
                raise ValueError(
                    "lift edges are not allowed in the Dijkstra graph"
                )

        source_location = location_by_id[source]
        destination_location = location_by_id[destination]

        if (
            source_location.get("type") == "lift"
            or destination_location.get("type") == "lift"
        ) and source_location["floor"] != destination_location["floor"]:
            raise ValueError(
                "Cross-floor edges involving lift locations "
                "are not allowed"
            )

        if edge.get("type") == "stair":
            if weight != STAIR_COST:
                raise ValueError(
                    f"Stair edges must have weight {STAIR_COST}"
                )

            if abs(
                source_location["floor"] - destination_location["floor"]
            ) != 1:
                raise ValueError(
                    "Stair edges must connect consecutive floors"
                )

    _validate_floors(
        floors_data,
        location_by_id,
        edges,
    )

    graph = build_graph(
        nodes=list(location_ids),
        edges=edges,
        directed=False,
    )

    return locations, graph
