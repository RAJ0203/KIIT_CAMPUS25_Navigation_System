# B-Block Girls' Washroom Nodes and Edges — Implemented

**Project:** KIIT CAMPUS25 Navigation System\
**Scope:** Two separately labelled B-block ground-floor ladies' washrooms\
**Source:** `A,B,C Block GF_261028_164441.pdf`, page 1, as supplied in the conversation\
**Status:** Implemented in the supplied JSON snapshot; repository validation still required

## 1. Map interpretation

The supplied ground-floor crop clearly shows two separate labels `TOILET LADIES`:
- One beside B001 near the B-block entrance.
- One beside B011, near B012/B014 on the upper corridor.

The two locations are treated as separate facility nodes. They are not merged into one washroom destination.

## 2. Node implementation

| Node ID | Display name | Block/floor | Coordinates |
|---|---|---|---|
| `B-F0-FAC-GIRLS-WASHROOM` | Girls' washroom (B001 / entrance side) | B / 0 | `null`, `null` |
| `B-F0-FAC-GIRLS-WASHROOM-B011` | Girls' washroom (B011 / upper corridor side) | B / 0 | `null`, `null` |

The pre-existing generic B-block girls' washroom node ID was retained and clarified as the B001/entrance-side facility, avoiding unnecessary ID churn. One new node was added for the separate B011-side facility. Coordinates remain null because the supplied crop does not provide calibrated SVG coordinates.

## 3. Edge implementation

| From | To | Weight | Type |
|---|---|---:|---|
| B001 | `B-F0-FAC-GIRLS-WASHROOM` | 20 | horizontal |
| B011 | `B-F0-FAC-GIRLS-WASHROOM-B011` | 14 | horizontal |

Weights are the source-reported movement measurements. No extra intermediate junction or access node was invented.

## 4. Snapshot changes

| Metric | Before | After |
|---|---:|---:|
| Locations | 127 | 128 |
| Edges | 40 | 42 |
| Stair edges | 12 | 12 |
| Horizontal edges | 28 | 30 |

Integrity checks on the generated snapshot:
- Both new edge endpoints exist.
- Location IDs are unique.
- No duplicate exact edge records were introduced.
- Both washroom facilities are separate.
- Existing B-block staircase mappings remain: B021→B-04 (20), B015→B-01 (24), B005→B-02 (18), B016→B-03 (28).

## 5. Apply to the original repository

Replace these two files only:
- `data/locations.json`
- `data/edges.json`

Do not replace `floors.json`.

Then run:
```powershell
python scripts/validate_graph_data.py
python scripts/audit_graph_data.py
```

The repository scripts are the final authority for project-specific validation. After running them, inspect that the counts are 128 locations and 42 edges.

## 6. Important scope note

This update resolves the two separately mapped washroom facilities and their measured approaches. It does not by itself verify every B-block room-to-room route, all provisional nodes, or full campus connectivity.
