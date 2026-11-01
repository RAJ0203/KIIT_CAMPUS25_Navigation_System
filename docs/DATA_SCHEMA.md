# Canonical Graph Data Schema

## Canonical files
- `data/locations.json`: JSON array of unique locations.
- `data/edges.json`: JSON array of weighted connections.
- `data/floors.json`: floor metadata and a mirror of staircase connectors for display/inspection only.

## Location record
Required: `id` (unique string), `name` (string), `block` (A/B/C), `floor` (integer 0–3), `x` and `y` (number or null), `type` (string). Optional `metadata` preserves status, source, source_section, notes, and measurement provenance. Coordinates remain null until obtained from a reliable SVG/map coordinate source.

Node types currently used: `room`, `facility`, `entrance_exit`, `corridor_junction`, `stair_access`, and `lift_metadata`. Keep rooms, facilities, corridor positions, stair access points, and lift metadata as distinct entities. Do not merge combined labels into one node.

## Edge record
`{ "from": "NODE_ID", "to": "NODE_ID", "weight": 12, "type": "horizontal" }`

`from` and `to` must reference existing location IDs. `weight` must be a positive integer. `type` is `horizontal` or `stair`. Horizontal weights are measured tile counts. Every confirmed consecutive-floor staircase transition has weight exactly 26. Do not infer weights from map scale.

## Directionality
Each serialized edge is stored once. The navigation graph must add both adjacency directions for each record unless a future source explicitly marks a physical one-way connection. Do not serialize duplicate reverse edges.

## Staircases and floors
Each physical staircase has one floor-specific node per connected floor. Consecutive floor pairs are represented in `edges.json` as `type: stair`, `weight: 26`. `floors.json.connectors` mirrors these records for metadata only. If the runtime loads `edges.json`, it MUST NOT append `floors.json.connectors` to adjacency again.

## Lifts
Lift records remain `lift_metadata`; they are not vertical connectors and must never create lift-to-lift or floor-change edges. A lift metadata node may be the endpoint of a **measured same-floor horizontal edge** when the measurement explicitly terminates at that lift's access location. In that case it is a same-floor navigation landmark/destination only; it does not imply elevator traversal or vertical connectivity. The graph loader must reject any `type: stair` edge that touches a lift node.

## Measurement provenance
Where an edge comes from a cumulative route, preserve the original route step and cumulative positions in edge metadata or the reconciliation ledger. Promote a segment only when both endpoints map unambiguously to existing canonical nodes. Composite descriptions such as “room / lift area” or “washroom / exit” must not be coerced into a single node. Keep unresolved route segments in the ledger, not as invented edges.

## Validation
Run `python scripts/validate_graph_data.py` and `python scripts/audit_graph_data.py` from the repository root. Structural validation checks unique IDs, endpoint existence, positive integer weights, edge types, duplicate/reverse duplication, staircase weight and floor consistency, connector mirror consistency, and that lift nodes are not linked by stair edges. Connectivity audit includes lift metadata nodes only when they participate in measured horizontal edges; it never treats lifts as vertical connectors.
