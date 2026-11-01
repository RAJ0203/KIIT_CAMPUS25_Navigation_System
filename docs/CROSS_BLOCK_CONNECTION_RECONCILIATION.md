# A/B/C Cross-Block Connection Reconciliation — 2026-11-01

**Status:** Four measured route-position links accepted; remaining block-entry links unresolved.

## 1. Governing rules

- Horizontal weights are source-measured tile counts (1 tile = 1 movement unit).
- Horizontal edges are stored once and interpreted bidirectionally by the graph consumer.
- Every verified consecutive-floor staircase transition costs 26.
- Lifts remain metadata/UI locations; they may be endpoints of measured same-floor horizontal edges but never vertical Dijkstra connectors.
- Do not invent a cross-block edge from proximity alone or merge an entrance, corridor junction, room, or stair access node.

## 2. Newly accepted measured route links

The B018 cumulative route in Master Team Document section 7.2 supplies an ordered measured route. The latest owner clarification identifies C Staircase 04 as the C-block staircase near the A/B connecting corridor (not the library side). This resolves the generic “C-block stairs” endpoint for the first two route segments. The existing A/B route-position IDs are retained for the next measured junctions.

| Route step | Cumulative positions | From | To | Weight | Decision |
|---:|---:|---|---|---:|---|
| 1 | 0→36 | `B018` | `STAIR_C_04_F0` | 36 | Accepted: owner-reconciled C Staircase 04 endpoint |
| 2 | 36→74 | `STAIR_C_04_F0` | `A-F0-JUNC-RIGHT-REPORTED` | 38 | Accepted: source-described right A-block route-position endpoint |
| 6 | 115→138 | `A-F0-JUNC-LEFT-REPORTED` | `B-F0-JUNC-REPORTED` | 23 | Accepted: source-described left A to right B route-position segment |
| 7 | 138→145 | `B-F0-JUNC-REPORTED` | `A-F0-JUNC-A013-A012-REPORTED` | 7 | Accepted: source-described B junction to A corridor-position segment |

Each edge includes source section, route-step number, cumulative positions, and mapping basis in `data/edges.json` metadata. No new location IDs are created in this batch.

## 3. Important topology boundary

These four edges connect the B-block measured network to C Staircase 04 and the mapped A/B route-position segment. They do **not** connect the 43-node main C-block measured network to Staircase 04; no measured horizontal edge between those two C areas is present in the current source data.

The cumulative route is still not a complete continuous canonical path. Steps 9–13 and 15–23 include unresolved route-position/composite endpoints. The source's final position 393 is represented by `A-F0-JUNC-ABC-REPORTED`, but that does not automatically connect it to block entrance nodes.

## 4. Still unresolved — do not add without source evidence

| Candidate | Current status | Reason |
|---|---|---|
| Main C-block network ↔ C Staircase 04 | Unresolved | No measured horizontal edge supplied between the main C network and Staircase 04 |
| `A-F0-JUNC-ABC-REPORTED` ↔ `ENTRY_A` | Unresolved | No exact measured endpoint pair/weight |
| `A-F0-JUNC-ABC-REPORTED` ↔ `ENTRY_B` | Unresolved | No exact measured endpoint pair/weight |
| `ENTRY_A_FROM_C` ↔ C-side entry node | Unresolved | Exact C-side canonical endpoint and measured weight not established |
| `ENTRY_B_FROM_C` ↔ C-side entry node | Unresolved | Exact C-side canonical endpoint and measured weight not established |
| Other block entry-to-entry links | Unresolved | No distinct exact endpoints and measured weights |

## 5. Do not confuse physical node roles

- `STAIR_C_04_F0` is a floor-specific staircase access node.
- `A-F0-JUNC-RIGHT-REPORTED`, `A-F0-JUNC-LEFT-REPORTED`, `B-F0-JUNC-REPORTED`, and `A-F0-JUNC-A013-A012-REPORTED` are distinct route-position/junction nodes.
- `A-F0-JUNC-ABC-REPORTED` is the reported cumulative-route endpoint at position 393.
- `ENTRY_A`, `ENTRY_B`, `ENTRY_A_FROM_C`, and `ENTRY_B_FROM_C` remain distinct entrance/exit records. Do not merge them with route-position nodes.

## 6. Validation status

After the four accepted edges, the expected graph snapshot is 157 locations, 111 edges (81 horizontal, 30 stair), 52 undirected components, and 45 isolated nodes. The largest components are 51 nodes (B018 + C Staircase 04 + mapped A/B route-position segment) and 43 nodes (main measured C network). This is a partial measured campus route, not a single connected campus graph.
