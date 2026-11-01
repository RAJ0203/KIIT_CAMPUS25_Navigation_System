# Graph Validation Report — A-block Room Endpoint Correction (2026-11-01)

## Candidate graph snapshot

- Locations: 154
- Edges: 115 (85 horizontal, 30 stair)
- Floors: 4
- Staircase families: A=2, B=4, C=4
- Floor connector metadata mirrors: 30

## Structural validation

Command:
```powershell
python scripts/validate_graph_data.py
```

Expected output:
```text
Locations: 154 | Edges: 115 | Stair connectors: 30
Blocks: A, B, C
PASS: structural graph validation
NOTE: horizontal edges are interpreted bidirectionally by the graph loader; floors.json connectors are metadata mirrors only.
```

## Connectivity audit

Command:
```powershell
python scripts/audit_graph_data.py
```

Expected key output:
```text
Locations: 154 | Edges: 115 | Stair connectors: 30
Edge types: {'stair': 30, 'horizontal': 85}
Connected components (all nodes; lifts only via horizontal edges): 45
Largest components: [51, 43, 9, 5, 4, 2, 2, 1, 1, 1]
Isolated nodes: 38
Lift metadata nodes with measured horizontal access: 14
Exact duplicate edges: 0 | Duplicate undirected same-type edges: 0
Unknown/invalid edge errors: 0
AUDIT RESULT: PASS (structural references/duplicates/lift vertical policy)
```

## Tests

The latest uploaded repository snapshot was independently tested before this proposed data-only batch:
```text
14 passed, 11 skipped
```

The 11 skips remain deliberate navigation-contract placeholders awaiting a graph loader / `POST /route` implementation, verified route fixtures, cross-block path behavior and API-level validation. The four new edges are data-only promotions and do not implement backend routing.

After integrating this batch, rerun:
```powershell
python scripts/validate_graph_data.py
python scripts/audit_graph_data.py
python -m pytest -q -rs
```

## Scope and limitations

The structural validator checks IDs, edge endpoints, positive integer weights, staircase identity/floor adjacency, the fixed 26-unit stair cost, reverse-edge duplication and `floors.json` connector mirrors. The audit checks undirected components, duplicate records and invalid endpoints.

Passing these checks does not prove that a Dijkstra loader or `/route` API is implemented. The 393-unit cumulative route remains only partially represented; unresolved source segments and the step-21 measurement conflict are explicitly held.
