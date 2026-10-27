# Viva Notes

## 1. One-Sentence Project Explanation

> We model KIIT Campus 25 as a weighted graph where meaningful locations are vertices, walkable connections are edges, measured tile counts are edge weights, and Dijkstra's algorithm finds the minimum-cost route.

---

## 2. Project Objective

The project is a campus navigation system for KIIT Campus 25.

The main DAA objective is to calculate the shortest walking route between two campus locations using a weighted graph and Dijkstra's algorithm.

The system also provides:

- User authentication
- Source and destination selection
- Route calculation through the backend
- Distance and ordered path output
- SVG/map route visualization
- Optional walking animation

The DAA component remains the core of the project.

---

## 3. Why a Graph?

Campus locations and walkable connections naturally map to graph concepts.

```text
Campus location → Vertex
Walkable connection → Edge
Walking distance → Edge weight
```

A graph allows the campus to be represented as a network of connected navigational locations.

---

## 4. Why a Weighted Graph?

Different walkable connections have different measured walking distances.

For example:

```text
B018 → B019 = 38
B019 → B020 = 14
B020 → B022 = 12
```

Therefore, the edges cannot all have equal cost.

The graph is weighted so the route algorithm can minimize total movement cost.

---

## 5. Why Dijkstra?

All project edge weights are non-negative, and the objective is to find the minimum total movement cost.

Dijkstra's algorithm is appropriate because it finds the minimum-cost path in a graph with non-negative edge weights.

---

## 6. Why Not BFS?

BFS minimizes the number of edges.

The project needs to minimize total weighted movement cost.

A route with fewer edges can still have a greater total walking distance than a route with more edges.

Therefore, BFS is not sufficient for the project's weighted graph.

---

## 7. What Is Relaxation?

Relaxation means checking whether reaching a node through the current node gives a smaller known distance.

For an edge:

```text
u → v
```

with weight `w`:

```text
if dist[u] + w < dist[v]
```

then:

```text
dist[v] = dist[u] + w
```

and the predecessor of `v` is updated to `u`.

---

## 8. How Is the Path Reconstructed?

Dijkstra stores a predecessor or parent for nodes whenever a shorter route is found.

After the destination is reached:

1. Start at the destination.
2. Follow predecessor links backward.
3. Continue until the source is reached.
4. Reverse the collected sequence.

This produces the ordered path from source to destination.

---

## 9. Dijkstra Complexity

With an adjacency list and priority queue:

```text
Time complexity: O((V + E) log V)
```

where:

```text
V = number of vertices
E = number of edges
```

Space complexity:

```text
O(V + E)
```

for the graph and algorithm state.

---

## 10. Are Tiles Graph Nodes?

No.

Tiles are used to measure walking distances.

The graph contains meaningful navigational locations such as:

- Rooms
- Junctions
- Room-access points
- Entrances
- Facilities
- Staircase access nodes

Making every floor tile a graph node would unnecessarily increase the graph size and is not the project's graph model.

---

## 11. What Is the Staircase Cost?

The project uses a fixed convention of:

```text
26 movement units
```

for each vertical staircase connection between consecutive floors.

For example:

```text
STAIR_B_F0 → STAIR_B_F1
weight = 26
```

This value applies only to the vertical staircase edge.

---

## 12. What About Measured Distance to a Staircase?

A measured distance from a room or junction to a staircase is a normal horizontal edge.

For example:

```text
B021 → STAIR_B_F0
weight = 20
```

The `20` is the horizontal walking distance to the staircase access node.

It is not the vertical staircase cost.

The next edge:

```text
STAIR_B_F0 → STAIR_B_F1
weight = 26
```

represents the vertical staircase transition.

These are separate edges.

---

## 13. Why Are Lifts Not Used in Dijkstra?

Lifts are represented as optional user guidance or metadata.

They are not used as vertical Dijkstra edges.

The route graph uses the project's staircase connectors for vertical transitions.

---

## 14. Are Routes Bidirectional?

Yes, unless a physical connection is explicitly one-way.

Normal walkable connections are treated as bidirectional.

A reverse route is therefore valid when the underlying physical connection is bidirectional.

---

## 15. What Happens If a Measurement Is Missing?

The project does not guess.

A genuinely missing or uncertain measurement or physical connection is marked:

```text
UNVERIFIED
```

An unverified segment must not be used to claim that a shortest route is correct.

---

## 16. How Are Floors 0–3 Handled?

The project represents Floors:

```text
0
1
2
3
```

The supplied floor layout may be treated as repeated topology when the corresponding physical segments are confirmed to match.

If a segment physically differs, it must be marked `UNVERIFIED` and measured before being used in a claimed shortest route.

---

## 17. How Does Cross-Block Navigation Work?

A/B/C blocks belong to one connected graph wherever a real walkable connection exists.

A cross-block route is valid only when every required connecting edge has been verified.

The graph must not invent a connection simply because two blocks appear visually close.

---

## 18. What Does the Backend Do?

The backend is responsible for:

- Loading the canonical graph
- Validating route inputs
- Running Dijkstra
- Reconstructing the path
- Returning the movement distance
- Returning the ordered canonical node path

The frontend does not calculate a separate shortest path.

---

## 19. What Does the Frontend Do?

The frontend is responsible for:

- Source selection
- Destination selection
- Sending API requests
- Displaying route results
- Displaying movement distance
- Showing floor/block changes
- Visualizing the returned path
- Optionally animating the returned route

The frontend must render the path returned by the backend.

---

## 20. API Endpoints

The project uses:

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
| POST | `/auth/register` | Create user | Public |
| POST | `/auth/login` | Authenticate user | Public |
| GET | `/auth/me` | Current user | JWT required |
| GET | `/locations` | Canonical location list | Public |
| POST | `/route` | Calculate shortest route | JWT required |

---

## 21. Route Request

The route endpoint receives:

```json
{
  "source": "B018",
  "destination": "A015"
}
```

Both values must be canonical node IDs.

---

## 22. Route Response

The route endpoint returns:

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

The response contains:

- `distance` → total normalized movement cost
- `path` → ordered sequence of canonical node IDs

The value `91` is an API-shape example only and is not a verified final route distance.

---

## 23. What Happens for the Same Source and Destination?

For:

```text
B018 → B018
```

the expected result is:

```text
distance = 0
path = ["B018"]
```

---

## 24. What Happens for an Invalid Source or Destination?

If a source or destination ID does not exist in the canonical location data, the backend should return a validation error.

Example:

```text
XXXXX → B018
```

or:

```text
B018 → XXXXX
```

must not produce a fabricated route.

---

## 25. What Happens If No Route Exists?

If the source and destination are disconnected, the backend must return a clear no-route response.

It must not return an invalid or fabricated path.

---

## 26. What Is the Canonical Data Structure?

The project uses:

```text
data/
├── locations.json
├── edges.json
└── floors.json
```

### `locations.json`

Stores:

- Canonical node ID
- Display name
- Block
- Floor
- SVG coordinates
- Optional metadata

### `edges.json`

Stores:

- `from`
- `to`
- Numeric `weight`
- Optional edge type

### `floors.json`

Stores:

- Floor/block metadata
- Staircase connectors
- Optional lift metadata

Dijkstra temporary state is not stored in these files.

---

## 27. Why Use Canonical Node IDs?

All project components must refer to the same physical location using the same ID.

For example:

```text
B018
```

must represent the same location in:

```text
Graph data
Backend
API
Frontend
SVG map
```

This prevents multiple conflicting representations of the campus.

---

## 28. Why Not Let the Frontend Calculate the Route?

The backend is the authoritative route engine.

Keeping Dijkstra in the backend ensures:

- One graph implementation
- One route algorithm
- One source of truth
- Consistent route results
- Easier testing

The frontend only displays the route returned by the backend.

---

## 29. What Is the Project's Main DAA Contribution?

The main DAA contribution is the implementation of a weighted graph and Dijkstra's shortest-path algorithm for campus navigation.

The graph uses measured walking distances as edge weights.

The system demonstrates:

- Graph modeling
- Weighted edges
- Adjacency lists
- Dijkstra
- Relaxation
- Priority queue
- Predecessor tracking
- Path reconstruction
- Shortest-path testing

---

## 30. Why Is the Graph Weighted by Tile Counts?

The project uses normalized tile counts to represent relative walking movement.

A longer corridor segment therefore has a larger edge weight than a shorter segment.

The route algorithm minimizes the total normalized movement cost across all selected edges.

Where precision is needed, the project documentation refers to the metric as:

```text
movement units (tile/step normalized units)
```

---

## 31. Demo Sequence

The recommended presentation flow is:

```text
1. Introduce the weighted graph model.
        ↓
2. Show login/dashboard if authentication is implemented.
        ↓
3. Select source.
        ↓
4. Select destination.
        ↓
5. Send route request.
        ↓
6. Run Dijkstra.
        ↓
7. Show returned distance.
        ↓
8. Show ordered node path.
        ↓
9. Highlight the route on the SVG map.
        ↓
10. Demonstrate floor/block changes if verified.
        ↓
11. Optionally show route animation.
        ↓
12. Explain Dijkstra, relaxation and complexity.
```

Only demonstrate routes whose underlying graph measurements and physical connections are verified.

---

## 32. Strong Viva Answers

### "Why Dijkstra instead of BFS?"

> BFS minimizes the number of edges, but our graph has different edge weights representing walking distance. We need to minimize total movement cost, so Dijkstra is appropriate because all our edge weights are non-negative.

### "Why not make every tile a node?"

> Tiles are only used to measure edge weights. We use meaningful navigational locations as vertices so the graph remains compact and represents the actual navigation structure.

### "What does an edge weight represent?"

> It represents normalized walking movement cost, primarily based on measured tile counts.

### "Why is the staircase cost 26?"

> The project uses 26 movement units as a fixed normalized convention for each vertical staircase transition between consecutive floors.

### "Why don't lifts appear in Dijkstra?"

> Lifts are optional user guidance, but they are not modeled as vertical Dijkstra edges. The graph uses staircase connectors for vertical transitions.

### "What happens when data is missing?"

> We mark the connection or measurement as UNVERIFIED instead of guessing. We don't claim a shortest route through unverified data.

### "How do you reconstruct the path?"

> During Dijkstra, we store the predecessor of each node whenever its shortest known distance is updated. Starting from the destination, we follow those predecessors back to the source and reverse the sequence.

### "What is relaxation?"

> Relaxation checks whether reaching a node through another node produces a smaller total distance. If it does, we update the distance and predecessor.

### "What is the time complexity?"

> With an adjacency list and priority queue, Dijkstra runs in O((V + E) log V).

### "What is the space complexity?"

> The graph and algorithm state require O(V + E) space.

---

## 33. Project Principle to Remember

The most important project rule is:

```text
ONE GRAPH.
ONE SCHEMA.
ONE API CONTRACT.
ONE SOURCE OF TRUTH.
```

All teammates and all assisting GPTs must follow the shared contracts instead of creating competing assumptions or implementations.