import json

import pytest

from app.services.dijkstra import dijkstra

from app.services.graph_loader import build_graph, load_graph_data

def valid_location(location_id="A", **overrides):

    """Create a valid test location."""

    location = {

        "id": location_id,

        "name": f"Test {location_id}",

        "block": "A",

        "floor": 0,

        "x": 10,

        "y": 20,

        "type": "room",

    }

    location.update(overrides)

    return location

def valid_floors(floors=None, connectors=None, stair_cost=26):

    """Create valid floors.json content."""

    return {

        "floors": [0, 1, 2, 3] if floors is None else floors,

        "stairCost": stair_cost,

        "connectors": [] if connectors is None else connectors,

    }

def write_graph_files(tmp_path, locations, edges, floors=None):

    """Write temporary canonical graph JSON files."""

    (tmp_path / "locations.json").write_text(

        json.dumps(locations), encoding="utf-8"

    )

    (tmp_path / "edges.json").write_text(

        json.dumps(edges), encoding="utf-8"

    )

    if floors is None:

        floors = valid_floors()

    (tmp_path / "floors.json").write_text(

        json.dumps(floors), encoding="utf-8"

    )
# ---------------------------------------------------------# build_graph tests# ---------------------------------------------------------
def test_build_undirected_graph():

    graph = build_graph(

        nodes=["A", "B", "C"],

        edges=[("A", "B", 4), ("B", "C", 2)],

    )

    assert graph["A"] == [("B", 4)]

    assert graph["B"] == [("A", 4), ("C", 2)]

    assert graph["C"] == [("B", 2)]

def test_build_directed_graph():

    graph = build_graph(

        nodes=["A", "B"],

        edges=[("A", "B", 5)],

        directed=True,

    )

    assert graph["A"] == [("B", 5)]

    assert graph["B"] == []

def test_loader_graph_works_with_dijkstra():

    graph = build_graph(

        nodes=["A", "B", "C", "D"],

        edges=[

            ("A", "B", 4),

            ("A", "C", 2),

            ("C", "B", 1),

            ("B", "D", 2),

            ("C", "D", 7),

        ],

    )

    distance, path = dijkstra(graph, "A", "D")

    assert distance == 5

    assert path == ["A", "C", "B", "D"]

def test_reject_unknown_source_node():

    with pytest.raises(ValueError, match="Unknown source node"):

        build_graph(nodes=["A"], edges=[("B", "A", 3)])

def test_reject_unknown_destination_node():

    with pytest.raises(ValueError, match="Unknown destination node"):

        build_graph(nodes=["A"], edges=[("A", "B", 3)])

def test_reject_negative_weight():

    with pytest.raises(ValueError, match="negative"):

        build_graph(nodes=["A", "B"], edges=[("A", "B", -1)])

def test_reject_duplicate_nodes():

    with pytest.raises(ValueError, match="Duplicate node"):

        build_graph(nodes=["A", "A"], edges=[])

def test_reject_non_numeric_weight():

    with pytest.raises(TypeError, match="Edge weight"):

        build_graph(nodes=["A", "B"], edges=[("A", "B", "heavy")])

def test_reject_nan_weight():

    with pytest.raises(ValueError, match="finite"):

        build_graph(nodes=["A", "B"], edges=[("A", "B", float("nan"))])

def test_reject_infinite_weight():

    with pytest.raises(ValueError, match="finite"):

        build_graph(nodes=["A", "B"], edges=[("A", "B", float("inf"))])

def test_reject_boolean_weight():

    with pytest.raises(TypeError, match="integer or float"):

        build_graph(nodes=["A", "B"], edges=[("A", "B", True)])

def test_reject_negative_infinite_weight():

    with pytest.raises(ValueError, match="finite"):

        build_graph(nodes=["A", "B"], edges=[("A", "B", float("-inf"))])
# ---------------------------------------------------------# Basic graph file loading tests# ---------------------------------------------------------
def test_load_graph_data_from_json(tmp_path):

    locations = [

        valid_location("A"),

        valid_location("B", x=30, y=40),

        valid_location("C", x=50, y=60),

    ]

    edges = [

        {"from": "A", "to": "B", "weight": 4, "type": "horizontal"},

        {"from": "B", "to": "C", "weight": 2, "type": "horizontal"},

    ]

    write_graph_files(tmp_path, locations, edges)

    loaded_locations, graph = load_graph_data(tmp_path)

    assert loaded_locations == locations

    assert graph["A"] == [("B", 4)]

    assert graph["B"] == [("A", 4), ("C", 2)]

    assert graph["C"] == [("B", 2)]

def test_load_graph_data_accepts_wrapped_json_objects(tmp_path):

    locations = [valid_location("A"), valid_location("B")]

    edges = [{"from": "A", "to": "B", "weight": 4}]

    (tmp_path / "locations.json").write_text(

        json.dumps({"locations": locations}), encoding="utf-8"

    )

    (tmp_path / "edges.json").write_text(

        json.dumps({"edges": edges}), encoding="utf-8"

    )

    (tmp_path / "floors.json").write_text(

        json.dumps(valid_floors()), encoding="utf-8"

    )

    loaded_locations, graph = load_graph_data(tmp_path)

    assert len(loaded_locations) == 2

    assert graph["A"] == [("B", 4)]

def test_load_graph_data_rejects_missing_locations_file(tmp_path):

    (tmp_path / "edges.json").write_text("[]", encoding="utf-8")

    (tmp_path / "floors.json").write_text(

        json.dumps(valid_floors()), encoding="utf-8"

    )

    with pytest.raises(FileNotFoundError, match="locations.json"):

        load_graph_data(tmp_path)

def test_load_graph_data_rejects_missing_edges_file(tmp_path):

    (tmp_path / "locations.json").write_text(

        json.dumps([valid_location("A")]), encoding="utf-8"

    )

    (tmp_path / "floors.json").write_text(

        json.dumps(valid_floors()), encoding="utf-8"

    )

    with pytest.raises(FileNotFoundError, match="edges.json"):

        load_graph_data(tmp_path)

def test_load_graph_data_rejects_missing_floors_file(tmp_path):

    (tmp_path / "locations.json").write_text(

        json.dumps([valid_location("A")]), encoding="utf-8"

    )

    (tmp_path / "edges.json").write_text("[]", encoding="utf-8")

    with pytest.raises(FileNotFoundError, match="floors.json"):

        load_graph_data(tmp_path)

def test_load_graph_data_rejects_invalid_json(tmp_path):

    (tmp_path / "locations.json").write_text(

        "{invalid json", encoding="utf-8"

    )

    (tmp_path / "edges.json").write_text("[]", encoding="utf-8")

    (tmp_path / "floors.json").write_text(

        json.dumps(valid_floors()), encoding="utf-8"

    )

    with pytest.raises(ValueError, match="Invalid JSON"):

        load_graph_data(tmp_path)

def test_load_graph_data_rejects_unknown_node(tmp_path):

    locations = [valid_location("A")]

    edges = [{"from": "A", "to": "MISSING", "weight": 3}]

    write_graph_files(tmp_path, locations, edges)

    with pytest.raises(ValueError, match="Unknown destination"):

        load_graph_data(tmp_path)
# ---------------------------------------------------------# Location validation tests# ---------------------------------------------------------
@pytest.mark.parametrize("missing_field", ["name", "block", "floor", "x", "y"])

def test_load_graph_data_rejects_missing_required_location_field(

    tmp_path, missing_field

):

    location = valid_location()

    del location[missing_field]

    write_graph_files(tmp_path, [location], [])

    with pytest.raises(ValueError, match=missing_field):

        load_graph_data(tmp_path)

@pytest.mark.parametrize("bad_id", ["", "   ", 123, None, " A "])

def test_load_graph_data_rejects_invalid_location_id(tmp_path, bad_id):

    location = valid_location()

    location["id"] = bad_id

    write_graph_files(tmp_path, [location], [])

    with pytest.raises(ValueError, match="ID"):

        load_graph_data(tmp_path)

@pytest.mark.parametrize("bad_floor", [True, 1.5, "0", None])

def test_load_graph_data_rejects_invalid_location_floor(tmp_path, bad_floor):

    location = valid_location(floor=bad_floor)

    write_graph_files(tmp_path, [location], [])

    with pytest.raises(ValueError, match="floor"):

        load_graph_data(tmp_path)

@pytest.mark.parametrize(

    "bad_coordinate",

    [True, "10", None, float("nan"), float("inf")],

)

@pytest.mark.parametrize("coordinate", ["x", "y"])

def test_load_graph_data_rejects_invalid_coordinate(

    tmp_path, bad_coordinate, coordinate

):

    location = valid_location()

    location[coordinate] = bad_coordinate

    write_graph_files(tmp_path, [location], [])

    with pytest.raises(ValueError, match=coordinate):

        load_graph_data(tmp_path)

def test_load_graph_data_rejects_duplicate_location_ids(tmp_path):

    locations = [valid_location("A"), valid_location("A")]

    write_graph_files(tmp_path, locations, [])

    with pytest.raises(ValueError, match="Duplicate node"):

        load_graph_data(tmp_path)
# ---------------------------------------------------------# Edge validation tests# ---------------------------------------------------------
@pytest.mark.parametrize("bad_weight", [True, 1.5, "4", None, -1])

def test_load_graph_data_rejects_invalid_edge_weight(tmp_path, bad_weight):

    locations = [valid_location("A"), valid_location("B")]

    edges = [{"from": "A", "to": "B", "weight": bad_weight}]

    write_graph_files(tmp_path, locations, edges)

    with pytest.raises(ValueError, match="weight"):

        load_graph_data(tmp_path)

@pytest.mark.parametrize("bad_edge_type", ["", 123, True, []])

def test_load_graph_data_rejects_invalid_edge_type(tmp_path, bad_edge_type):

    locations = [valid_location("A"), valid_location("B")]

    edges = [

        {

            "from": "A",

            "to": "B",

            "weight": 4,

            "type": bad_edge_type,

        }

    ]

    write_graph_files(tmp_path, locations, edges)

    with pytest.raises(ValueError, match="type"):

        load_graph_data(tmp_path)

def test_load_graph_data_rejects_edge_with_unknown_source(tmp_path):

    locations = [valid_location("A")]

    edges = [{"from": "MISSING", "to": "A", "weight": 3}]

    write_graph_files(tmp_path, locations, edges)

    with pytest.raises(ValueError, match="Unknown source"):

        load_graph_data(tmp_path)

def test_load_graph_data_rejects_lift_edge(tmp_path):

    locations = [

        valid_location("LIFT_F0", type="lift", floor=0),

        valid_location("LIFT_F1", type="lift", floor=1),

    ]

    edges = [

        {

            "from": "LIFT_F0",

            "to": "LIFT_F1",

            "weight": 1,

            "type": "lift",

        }

    ]

    write_graph_files(

        tmp_path,

        locations,

        edges,

        floors=valid_floors(),

    )

    with pytest.raises(ValueError, match="lift"):

        load_graph_data(tmp_path)

def test_load_graph_data_rejects_cross_floor_lift_location_edge(tmp_path):

    locations = [

        valid_location("LIFT_F0", type="lift", floor=0),

        valid_location("ROOM_F1", type="room", floor=1),

    ]

    edges = [

        {

            "from": "LIFT_F0",

            "to": "ROOM_F1",

            "weight": 26,

            "type": "horizontal",

        }

    ]

    write_graph_files(tmp_path, locations, edges)

    with pytest.raises(ValueError, match="lift"):

        load_graph_data(tmp_path)
# ---------------------------------------------------------# floors.json validation tests# ---------------------------------------------------------
def test_load_graph_data_accepts_valid_floors_file(tmp_path):

    locations = [

        valid_location("A", floor=0),

        valid_location("B", floor=1),

    ]

    floors = valid_floors(

        connectors=[

            {"from": "STAIR_F0", "to": "STAIR_F1", "weight": 26}

        ]

    )
# Staircase IDs must exist in locations.json.
    locations.extend(

        [

            valid_location("STAIR_F0", floor=0, type="stair"),

            valid_location("STAIR_F1", floor=1, type="stair"),

        ]

    )

    edges = [

        {

            "from": "STAIR_F0",

            "to": "STAIR_F1",

            "weight": 26,

            "type": "stair",

        }

    ]

    write_graph_files(tmp_path, locations, edges, floors=floors)

    loaded_locations, graph = load_graph_data(tmp_path)

    assert len(loaded_locations) == 4

    assert graph["STAIR_F0"] == [("STAIR_F1", 26)]

    assert graph["STAIR_F1"] == [("STAIR_F0", 26)]

@pytest.mark.parametrize("bad_stair_cost", [True, 25, 27, 26.0, "26", None])

def test_load_graph_data_rejects_invalid_stair_cost(tmp_path, bad_stair_cost):

    floors = valid_floors(stair_cost=bad_stair_cost)

    write_graph_files(tmp_path, [valid_location("A")], [], floors=floors)

    with pytest.raises(ValueError, match="stairCost"):

        load_graph_data(tmp_path)

@pytest.mark.parametrize(

    "bad_floors",

    [None, [], [0, 1, 1], [0, True], ["0", 1]],

)

def test_load_graph_data_rejects_invalid_floor_list(tmp_path, bad_floors):

    floors = valid_floors()
    floors["floors"] = bad_floors

    write_graph_files(

        tmp_path, [valid_location("A")], [], floors=floors

    )

    with pytest.raises(ValueError, match="floors"):

        load_graph_data(tmp_path)

def test_load_graph_data_rejects_location_on_unlisted_floor(tmp_path):

    locations = [valid_location("A", floor=4)]

    write_graph_files(

        tmp_path,

        locations,

        [],

        floors=valid_floors(floors=[0, 1, 2, 3]),

    )

    with pytest.raises(ValueError, match="not listed"):

        load_graph_data(tmp_path)

def test_load_graph_data_rejects_non_list_connectors(tmp_path):

    floors = valid_floors(connectors={})

    write_graph_files(tmp_path, [valid_location("A")], [], floors=floors)

    with pytest.raises(ValueError, match="connectors"):

        load_graph_data(tmp_path)

def test_load_graph_data_rejects_connector_with_unknown_location(tmp_path):

    floors = valid_floors(

        connectors=[

            {"from": "STAIR_F0", "to": "MISSING", "weight": 26}

        ]

    )

    locations = [valid_location("STAIR_F0", floor=0, type="stair")]

    write_graph_files(tmp_path, locations, [], floors=floors)

    with pytest.raises(ValueError, match="unknown location"):

        load_graph_data(tmp_path)

@pytest.mark.parametrize("bad_connector_weight", [True, 25, 27, 26.0, "26", None])

def test_load_graph_data_rejects_invalid_connector_weight(

    tmp_path, bad_connector_weight

):

    floors = valid_floors(

        connectors=[

            {

                "from": "STAIR_F0",

                "to": "STAIR_F1",

                "weight": bad_connector_weight,

            }

        ]

    )

    locations = [

        valid_location("STAIR_F0", floor=0, type="stair"),

        valid_location("STAIR_F1", floor=1, type="stair"),

    ]

    write_graph_files(tmp_path, locations, [], floors=floors)

    with pytest.raises(ValueError, match="weight"):

        load_graph_data(tmp_path)

def test_load_graph_data_rejects_connector_without_matching_stair_edge(

    tmp_path,

):

    floors = valid_floors(

        connectors=[

            {"from": "STAIR_F0", "to": "STAIR_F1", "weight": 26}

        ]

    )

    locations = [

        valid_location("STAIR_F0", floor=0, type="stair"),

        valid_location("STAIR_F1", floor=1, type="stair"),

    ]

    write_graph_files(tmp_path, locations, [], floors=floors)

    with pytest.raises(ValueError, match="matching type='stair' edge"):

        load_graph_data(tmp_path)

def test_load_graph_data_rejects_stair_edge_with_wrong_weight(tmp_path):

    locations = [

        valid_location("STAIR_F0", floor=0, type="stair"),

        valid_location("STAIR_F1", floor=1, type="stair"),

    ]

    edges = [

        {

            "from": "STAIR_F0",

            "to": "STAIR_F1",

            "weight": 25,

            "type": "stair",

        }

    ]

    floors = valid_floors()

    write_graph_files(tmp_path, locations, edges, floors=floors)

    with pytest.raises(ValueError, match="must have weight 26"):

        load_graph_data(tmp_path)

def test_load_graph_data_rejects_stair_edge_without_floor_connector(

    tmp_path,

):

    locations = [

        valid_location("STAIR_F0", floor=0, type="stair"),

        valid_location("STAIR_F1", floor=1, type="stair"),

    ]

    edges = [

        {

            "from": "STAIR_F0",

            "to": "STAIR_F1",

            "weight": 26,

            "type": "stair",

        }

    ]

    write_graph_files(

        tmp_path,

        locations,

        edges,

        floors=valid_floors(connectors=[]),

    )

    with pytest.raises(ValueError, match="missing from floors.json"):

        load_graph_data(tmp_path)

def test_load_graph_data_rejects_non_consecutive_floor_connector(

    tmp_path,

):

    locations = [

        valid_location("STAIR_F0", floor=0, type="stair"),

        valid_location("STAIR_F2", floor=2, type="stair"),

    ]

    floors = valid_floors(

        connectors=[

            {"from": "STAIR_F0", "to": "STAIR_F2", "weight": 26}

        ]

    )

    edges = [

        {

            "from": "STAIR_F0",

            "to": "STAIR_F2",

            "weight": 26,

            "type": "stair",

        }

    ]

    write_graph_files(tmp_path, locations, edges, floors=floors)

    with pytest.raises(ValueError, match="consecutive floors"):

        load_graph_data(tmp_path)

def test_load_graph_data_rejects_duplicate_floor_connectors(tmp_path):

    locations = [

        valid_location("STAIR_F0", floor=0, type="stair"),

        valid_location("STAIR_F1", floor=1, type="stair"),

    ]

    connector = {"from": "STAIR_F0", "to": "STAIR_F1", "weight": 26}

    floors = valid_floors(connectors=[connector, connector])

    edges = [

        {

            "from": "STAIR_F0",

            "to": "STAIR_F1",

            "weight": 26,

            "type": "stair",

        }

    ]

    write_graph_files(tmp_path, locations, edges, floors=floors)

    with pytest.raises(ValueError, match="Duplicate floor connector"):

        load_graph_data(tmp_path)
