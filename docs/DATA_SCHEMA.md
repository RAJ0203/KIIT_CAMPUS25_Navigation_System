# Data Schema

## 1. Purpose

This document defines the canonical graph and navigation data structure for the KIIT CAMPUS25 Navigation System.

The project uses one shared graph data model across the backend, Dijkstra route engine, frontend map, and floor navigation.

The canonical data files are:

```text
data/
├── locations.json
├── edges.json
└── floors.json
```

These files form the single source of truth for the campus navigation graph.

No teammate or implementation should create a second graph schema or a separate node naming convention.

---

## 2. Core Graph Model

The campus is modeled as a weighted graph.

### Vertex

A vertex represents a meaningful navigational location.

Examples include:

- Rooms
- Corridors or junctions
- Room-access points
- Entrances
- Facilities
- Staircase access nodes
- Other meaningful navigation points

The project must **not** create a graph node for every individual floor tile.

Tiles are used to measure walking distances, not to represent every physical tile as a graph vertex.

### Edge

An edge represents a walkable connection between two graph vertices.

Each edge has a numeric movement cost based on the project's normalized measurement rules.

Example:

```text
B018 --38--> B019
B019 --14--> B020
B020 --12--> B022
```

The Dijkstra algorithm operates on these normalized numeric weights.

---

## 3. Canonical Data Files

### `data/locations.json`

Contains:

- Canonical node ID
- Display name
- Block
- Floor
- SVG/map `x` coordinate
- SVG/map `y` coordinate
- Optional metadata such as node type

Must NOT contain:

- Dijkstra temporary state
- Duplicated edge weights
- Route-specific algorithm state

---

### `data/edges.json`

Contains:

- Source node ID (`from`)
- Destination node ID (`to`)
- Numeric edge weight
- Optional edge type

Must NOT contain:

- UI coordinates
- Raw measurement prose
- Dijkstra temporary state

Raw measurement explanations belong in documentation, not in the algorithm input.

For example, a measurement such as:

```text
B005 → B006 = 20 straight + 20 left
```

must be normalized to:

```text
weight = 40
```

The algorithm consumes the normalized numeric weight.

---

### `data/floors.json`

Contains:

- Floor metadata
- Block/floor metadata where required
- Floor-to-floor staircase connectors
- Staircase connector weights
- Optional lift metadata

Must NOT contain:

- Dijkstra temporary state
- Algorithm-specific temporary values

---

## 4. `locations.json` Schema

The canonical location structure is:

```json
[
  {
    "id": "B018",
    "name": "Room B018",
    "block": "B",
    "floor": 0,
    "x": 120,
    "y": 340,
    "type": "room"
  }
]
```

### Fields

| Field | Meaning |
|---|---|
| `id` | Canonical unique node ID |
| `name` | Human-readable display name |
| `block` | Campus block associated with the node |
| `floor` | Floor number |
| `x` | SVG/map x-coordinate |
| `y` | SVG/map y-coordinate |
| `type` | Optional node type such as `room` |

The exact node IDs and physical locations must come from the verified graph/data work.

Do not invent physical locations or IDs.

---

## 5. Canonical Node IDs

Every graph location must use one canonical node ID.

Examples from the project documentation include:

```text
B018
A015
C201
J_A_01
ENTRY_C
STAIR_C_F0
```

These examples demonstrate the identifier style and types of navigational nodes.

They do not authorize the creation of additional physical locations or connections.

Canonical node IDs are owned by the graph/data contract.

The frontend, backend, Dijkstra implementation, and map must all reference the same canonical IDs.

There must not be separate frontend IDs, backend IDs, and graph IDs for the same physical location.

---

## 6. `edges.json` Schema

The canonical edge structure is:

```json
[
  {
    "from": "B018",
    "to": "B019",
    "weight": 38,
    "type": "horizontal"
  },
  {
    "from": "STAIR_C_F0",
    "to": "STAIR_C_F1",
    "weight": 26,
    "type": "stair"
  }
]
```

### Fields

| Field | Meaning |
|---|---|
| `from` | Canonical starting node ID |
| `to` | Canonical destination node ID |
| `weight` | Normalized movement cost |
| `type` | Optional edge type such as `horizontal` or `stair` |

Every edge weight must be a non-negative integer.

---

## 7. Edge Weight Rules

The project's edge weights represent normalized movement units.

### Horizontal movement

Horizontal edge weights are based on measured tile counts.

For example:

```text
B018 → B019 = 38
```

means the normalized horizontal movement cost is:

```text
38 movement units
```

### Multiple measurement segments

If a connection is measured using multiple segments, the segments must be summed before being stored as the edge weight.

Example:

```text
20 straight + 20 left
```

becomes:

```json
{
  "from": "B005",
  "to": "B006",
  "weight": 40,
  "type": "horizontal"
}
```

The raw measurement explanation is not stored as part of the algorithm input.

---

## 8. Bidirectional Movement

Movement is bidirectional unless a physical connection is explicitly one-way.

Therefore, a measured walkable connection between two nodes normally represents movement in both directions.

The graph implementation must preserve this rule when constructing the adjacency list.

A connection must not be treated as one-way unless the physical campus layout or verified project data explicitly establishes that restriction.

---

## 9. Staircase Data

Staircases are represented using staircase access nodes.

The project uses a fixed convention:

```text
26 movement units
```

for the **vertical staircase edge connecting consecutive floors**.

Example:

```json
{
  "from": "STAIR_B_F0",
  "to": "STAIR_B_F1",
  "weight": 26,
  "type": "stair"
}
```

### Important staircase clarification

Measured values such as:

```text
B021 → staircase = 20
B005 → staircase = 18
B016 → staircase = 28
B015 → staircase = 24
```

represent **horizontal walking distance from a room or junction to a staircase access node**.

Those values are normal horizontal edge weights.

They are NOT the vertical staircase cost.

For example:

```text
B021 → STAIR_B_F0
weight = 20
```

and:

```text
STAIR_B_F0 → STAIR_B_F1
weight = 26
```

The horizontal approach distance and the vertical staircase transition are separate graph edges.

The horizontal approach edge must not be used as a direct connection to a higher-floor node.

---

## 10. Staircase Node IDs

Staircase access nodes must use the canonical IDs defined by the graph/data work.

Examples:

```text
STAIR_C_F0
STAIR_C_F1
```

The exact staircase IDs and physical connections must be verified before being added to the canonical graph.

No teammate or AI assistant should invent additional staircase IDs or physical connections.

---

## 11. `floors.json` Schema

The canonical floor structure is:

```json
{
  "floors": [0, 1, 2, 3],
  "stairCost": 26,
  "connectors": [
    {
      "from": "STAIR_C_F0",
      "to": "STAIR_C_F1",
      "weight": 26
    }
  ]
}
```

### Fields

| Field | Meaning |
|---|---|
| `floors` | Floors represented in the navigation system |
| `stairCost` | Fixed staircase movement cost for consecutive-floor transitions |
| `connectors` | Floor-to-floor staircase connections |

The fixed staircase cost is:

```text
26 movement units
```

The connector weight must therefore be `26` for each verified consecutive-floor staircase connection.

---

## 12. Floors 0–3

The project models the supplied floor layout across Floors:

```text
0
1
2
3
```

The supplied floor layout may be treated as repeated topology across Floors 0–3 when the corresponding physical segments are confirmed to match.

An independently measured third-floor tile-count survey is not required for the initial graph when the corresponding topology is confirmed to match the repeated layout.

If a segment physically differs from the repeated layout, that segment must be marked **UNVERIFIED** and measured before it is used in a claimed shortest route.

The graph must never silently assume that an unverified physical connection exists.

---

## 13. Cross-Block Navigation

A/B/C blocks and different floors ultimately belong to one connected navigation graph wherever a real walkable connection exists.

Cross-block edges must correspond to real, verified physical connections shown by the campus source material.

Example concept:

```text
B-block
   │
   │ verified walkable connection
   ▼
A-block
```

The exact node IDs, connection points, and weights must come from verified graph/data work.

No cross-block connection may be invented merely because two blocks appear visually close.

---

## 14. Lift Data

Lift locations may be represented as optional metadata or UI guidance.

Lifts are **not** used as vertical Dijkstra edges.

Therefore:

```text
Lift location
      ↓
Optional user guidance
```

and not:

```text
Lift location
      ↓
Dijkstra floor transition
```

The route algorithm uses the project's staircase connectors for vertical graph transitions.

---

## 15. Unverified Data

If a required measurement or physical connection is genuinely missing or uncertain, it must be treated as:

```text
UNVERIFIED
```

rather than guessed.

An unverified segment must not be used to claim that a shortest route is correct.

This rule applies especially to:

- Cross-block connections
- Floor-specific differences
- Staircase connections
- Room/junction connections
- Any measured edge whose physical existence or weight has not been confirmed

The project must not fabricate measurements, coordinates, node IDs, or physical connections.

---

## 16. Data Separation

The three canonical data files have separate responsibilities.

```text
locations.json
        │
        ├── What/where is a node?
        ├── Display name
        ├── Block
        ├── Floor
        └── SVG coordinates

edges.json
        │
        ├── Which nodes are connected?
        ├── Movement weight
        └── Edge type

floors.json
        │
        ├── Floor metadata
        ├── Staircase connectors
        └── Optional lift metadata
```

Dijkstra-specific temporary state such as:

```text
distance
visited
predecessor
priority queue state
```

must not be stored in the canonical JSON files.

These values belong to the route algorithm at runtime.

---

## 17. Frontend Map Coordinates

The `x` and `y` fields in `locations.json` represent the SVG/map position of the corresponding canonical node.

Example:

```json
{
  "id": "B018",
  "name": "Room B018",
  "block": "B",
  "floor": 0,
  "x": 120,
  "y": 340,
  "type": "room"
}
```

These coordinates are for visualization.

They do not replace the graph's measured edge weights.

The frontend must use the canonical node ID to associate a visual location with the corresponding graph location.

---

## 18. Relationship Between Data and Dijkstra

The route engine uses the canonical graph formed from:

```text
locations.json
        +
edges.json
        +
required floor/staircase information
```

Dijkstra operates on the normalized numeric edge weights.

The algorithm must return:

1. Total movement cost
2. Ordered sequence of canonical node IDs

Example response shape:

```json
{
  "distance": 91,
  "path": [
    "B018",
    "B019",
    "B020",
    "...",
    "A015"
  ]
}
```

The value `91` is an API-shape example only.

It is not a verified final distance for the B018 → A015 route.

---

## 19. Data Integrity Rules

The following checks must hold for the canonical graph:

- Every edge endpoint must exist in `locations.json`.
- Every edge weight must be a non-negative integer.
- Every staircase floor connector must have weight `26`.
- No lift may accidentally be used as a vertical Dijkstra connector.
- Important rooms and junctions must not be isolated unless they are physically isolated.
- Opposite rooms must connect through the corridor/junction rather than directly through each other when the physical layout requires corridor movement.
- Cumulative measurements must be converted into the correct consecutive edge weights.
- All A/B/C cross-block edges must correspond to real walkable connections.
- Floor-specific room IDs must follow the verified floor numbering pattern.
- Missing measurements must be marked UNVERIFIED rather than guessed.

---

## 20. Data Ownership

Kushagra owns the canonical graph/data work.

His responsibilities include:

- Normalizing collected A/B/C tile-count measurements
- Creating one canonical node naming convention
- Creating the junction list from the maps and measured turns
- Creating floor-specific node mappings for Floors 0–3
- Adding staircase edges with the frozen weight of `26`
- Keeping lift locations as metadata/optional UI points rather than vertical Dijkstra edges
- Producing:
  - `data/locations.json`
  - `data/edges.json`
  - `data/floors.json`

Other teammates must consume the canonical data rather than creating alternate versions.

---

## 21. Change Control

The following data changes require coordination before implementation:

- Canonical node ID format
- Existing node IDs
- Edge format
- Edge weight rules
- Staircase cost
- Floor connector structure
- Canonical data file structure
- Physical graph connections

No teammate or AI assistant should silently change the canonical data schema.

If the schema needs to change:

1. Explain and justify the proposed change.
2. Identify the affected files and teammates.
3. Record the proposal in `CHANGELOG.md`.
4. Update the affected shared contract.
5. Obtain the required project approval.
6. Implement the change consistently across all affected components.

---

## 22. Canonical Data Principle

The project follows:

```text
ONE GRAPH.
ONE SCHEMA.
ONE SOURCE OF TRUTH.
```

The same canonical node IDs and graph relationships must be used by:

```text
Graph data
    ↓
Dijkstra
    ↓
FastAPI
    ↓
Frontend
    ↓
SVG map
```

There must not be multiple competing representations of the campus graph.

The graph/data contract is authoritative for node IDs, edge structure, measurements, staircase connections, and verified physical navigation relationships.