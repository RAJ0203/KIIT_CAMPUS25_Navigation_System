# A-block Room Endpoint Correction Batch — 2026-11-01

This batch promotes four measured segments from the B018 cumulative route after applying the user's explicit endpoint clarifications. It also consolidates three duplicate provisional lab facility records onto the canonical numbered room nodes.

## Files in this package

| Package path | Destination | Action |
|---|---|---|
| `data/locations.json` | `data/locations.json` | Replace |
| `data/edges.json` | `data/edges.json` | Replace |
| `docs/A_BLOCK_CUMULATIVE_ROUTE_RECONCILIATION.md` | `docs/A_BLOCK_CUMULATIVE_ROUTE_RECONCILIATION.md` | Replace |
| `docs/A_BLOCK_ROUTE_EDGE_PROMOTION_2026-11-01.md` | `docs/A_BLOCK_ROUTE_EDGE_PROMOTION_2026-11-01.md` | Replace |
| `docs/MEASUREMENT_RECONCILIATION_LEDGER.md` | `docs/MEASUREMENT_RECONCILIATION_LEDGER.md` | Replace |
| `docs/NODE_INVENTORY.md` | `docs/NODE_INVENTORY.md` | Replace |
| `docs/EDGE_INVENTORY.md` | `docs/EDGE_INVENTORY.md` | Replace |
| `docs/MEASUREMENT_RECONCILIATION.md` | `docs/MEASUREMENT_RECONCILIATION.md` | Replace |
| `docs/C_BLOCK_HORIZONTAL_EDGE_RECONCILIATION.md` | `docs/C_BLOCK_HORIZONTAL_EDGE_RECONCILIATION.md` | Replace |
| `docs/GRAPH_CONNECTIVITY_AUDIT_2026-11-01.md` | `docs/GRAPH_CONNECTIVITY_AUDIT_2026-11-01.md` | Replace |
| `docs/VALIDATION_REPORT.md` | `docs/VALIDATION_REPORT.md` | Replace |
| `docs/A_BLOCK_LAB_ALIAS_RECONCILIATION_2026-11-01.md` | `docs/A_BLOCK_LAB_ALIAS_RECONCILIATION_2026-11-01.md` | Add |

## What changes

### Four measured horizontal edges

| Route step | From | To | Weight |
|---:|---|---|---:|
| 17 | A005 | A004 | 19 |
| 18 | A004 | A003 | 12 |
| 19 | A003 | A002 | 5 |
| 20 | A002 | A001 | 7 |

Endpoint mappings are based on the user's explicit confirmations:
- Lift 3 / A005 area = A005
- IoT lab = A004
- Project lab = A003
- Research lab = A002
- Lift 2 / A001 area = A001

Each edge includes cumulative positions and provenance in its `metadata`.

### Three duplicate facility nodes consolidated

The previous provisional facility nodes `A-F0-FAC-IOT-LAB`, `A-F0-FAC-PROJECT-LAB`, and `A-F0-FAC-RESEARCH-LAB` are removed from `locations.json`. Their display labels become aliases on room nodes A004, A003 and A002. This represents each physical room once.

### Deliberately not changed

- `data/floors.json`
- `scripts/validate_graph_data.py`
- `scripts/audit_graph_data.py`
- backend files and tests
- all B-block and C-block edges
- the separately owner-confirmed `A001 → STAIR_A_02_F0 = 14` edge

Cumulative step 21 (9 units) is not added because it conflicts with the separately confirmed 14-unit A001-to-Staircase-02 measurement.

## Integration steps

1. Make a backup copy of `data/locations.json`, `data/edges.json`, and the listed documentation files.
2. Extract this ZIP.
3. Copy each file to the destination shown above.
4. Choose **Replace** for the nine existing files and **Add** only for the new alias reconciliation document.
5. Do not replace any other project files.

## Validation commands

Run from the project root in PowerShell:

```powershell
python scripts/validate_graph_data.py
python scripts/audit_graph_data.py
python -m pytest -q -rs
```

Expected graph counts:
- 154 locations
- 115 edges (85 horizontal, 30 stair)
- 45 connected components
- 38 isolated nodes

The 14 existing tests are expected to pass; 11 navigation-contract tests remain skipped until the backend route implementation and fixtures are available.

## Git safety

Do not stage or commit this batch immediately. Review `git status --short` and the three validation outputs first. This package does not modify the user's repository automatically.
