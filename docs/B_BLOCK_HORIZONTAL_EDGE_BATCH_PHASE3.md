# B-Block Ground-Floor Horizontal Edge Batch — Phase 3

**Project:** KIIT CAMPUS25 Navigation System\
**Scope:** 24 room-to-room measurements from Master Team Coordination Document section 7.1\
**Status:** Candidate canonical edge batch prepared from source measurements; verify by running the repository validators after replacing `data/edges.json`.

## 1. What this update does

- Retains all 12 existing vertical B-block staircase transitions (weight 26).
- Corrects the two staircase approach endpoints according to the owner's confirmed handwritten-map labels:
  - B021 → `STAIR_B_04_F0` = 20
  - B015 → `STAIR_B_01_F0` = 24
- Retains the other two staircase approaches:
  - B005 → `STAIR_B_02_F0` = 18
  - B016 → `STAIR_B_03_F0` = 28
- Adds 24 measured B-block room-to-room horizontal connections from section 7.1.
- Normalizes multi-segment measurements by summing the supplied segments, consistent with Master Document section 5.3.
- Does not add either girls' washroom approach because their distinct facility/access endpoint IDs are not finalized.

## 2. Added room-to-room edges

| Source record | From | To | Normalized weight | Source expression |
|---|---|---|---:|---|
| B-01 | B018 | B019 | 38 | 38 |
| B-02 | B019 | B020 | 14 | 2 + 12 |
| B-03 | B020 | B022 | 12 | 12 |
| B-04 | B022 | B021 | 13 | 2 + 11 |
| B-06 | B021 | B001 | 34 | 34 |
| B-08 | B001 | B002 | 21 | 3 + 18 |
| B-09 | B002 | B003 | 14 | 2 + 12 |
| B-10 | B003 | B004 | 8 | 2 + 6 |
| B-11 | B002 | B004 | 19 | 19; alternate/branch route |
| B-12 | B004 | B005 | 10 | 3 + 7 |
| B-14 | B005 | B006 | 40 | 20 + 20 |
| B-15 | B006 | B007 | 18 | 18 |
| B-16 | B006 | B008 | 20 | 2 + 18 |
| B-17 | B007 | B009 | 18 | 18 |
| B-18 | B007 | B010 | 20 | 2 + 18 |
| B-19 | B009 | B016 | 15 | 8 + 7 |
| B-20 | B010 | B016 | 12 | 8 + 4 |
| B-21 | B016 | B017 | 12 | 12 |
| B-22 | B017 | B018 | 34 | 2 + 32 |
| B-23 | B016 | B011 | 34 | 34 |
| B-26 | B011 | B012 | 25 | 3 + 22 |
| B-27 | B012 | B013 | 16 | 2 + 14 |
| B-28 | B013 | B014 | 6 | 2 + 4 |
| B-29 | B014 | B015 | 10 | 2 + 8 |

The source's route weights are preserved. A turn or multiple straight/turn segments do not automatically create a separate junction node: the Master Document's explicit example normalizes B005→B006 = 20 straight + 20 left to one canonical edge of weight 40.

## 3. Current B-block records intentionally not added

| Source record | Measurement | Reason |
|---|---|---|
| B-05 | B021 → staircase = 20 | Included as corrected staircase approach, not duplicated |
| B-07 | B001 → girls' washroom = 20 | Distinct access endpoint ID not finalized |
| B-13 | B005 → staircase = 18 | Included as existing staircase approach, not duplicated |
| B-24 | B016 → staircase = 28 | Included as existing staircase approach, not duplicated |
| B-25 | B011 → girls' washroom = 14 | Distinct access endpoint ID not finalized |
| B-30 | B015 → staircase = 24 | Included as corrected staircase approach, not duplicated |

## 4. Candidate graph counts and integrity checks

The generated candidate file was checked against the supplied 127-location snapshot:

- Locations: 127
- Edges: 40
- Stair edges: 12
- Horizontal edges: 28
- Added room-to-room edges: 24
- Unknown edge endpoints: 0
- Duplicate exact edge records introduced: 0

Undirected connectivity calculation on this candidate:
- Connected components: {len(components)}
- Isolated nodes: {isolated}
- Largest components: {components[:10]}

This is a local structural/connectivity calculation on the generated candidate JSON. The repository's own scripts must still be run after copying it into the project. Connectivity counts assume the backend interprets the edge list as undirected; confirm that with the graph loader/API owner.

## 5. Important implementation notes

1. Replace the original `data/edges.json` with the supplied candidate file; do not append the same 24 records manually.
2. Do not replace `locations.json` or `floors.json`.
3. Keep the 2 washroom access measurements out until distinct canonical access-node IDs are finalized.
4. The 24 source measurements are treated as measured traversable connections between their named room endpoints, following the Master Document's canonical edge normalization model. If the backend contract or map review determines any listed route is not a direct traversable connection between those named nodes, flag that specific record and revise it with provenance rather than inventing a junction.
5. Confirm undirected traversal semantics in the backend loader. The JSON stores one record per measured connection; do not duplicate reverse records unless the API contract explicitly requires directed arcs.

## 6. Validation commands

From the repository root:

```powershell
python scripts/validate_graph_data.py
python scripts/audit_graph_data.py
```

Then inspect the edge list and confirm the four staircase approaches and 24 new room-to-room records.

## 7. Source provenance

- Master Team Coordination Document, section 5.2: measured horizontal tile counts and normalized multi-segment totals.
- Master Team Coordination Document, section 5.3: explicit `B005 → B006 = 20 + 20 = 40` canonical-edge example.
- Master Team Coordination Document, section 7.1: B-block measured network, records B-01 through B-30.
- Owner-confirmed map correction: B021 → B-04 = 20; B015 → B-01 = 24.

**This batch changes only `data/edges.json`. The source inventory and washroom endpoint work remain to be updated in a subsequent documentation pass.**
