# Graph Connectivity Audit — A-block Room Endpoint Correction (2026-11-01)

## Snapshot

This report is calculated from the proposed 154-location, 115-edge graph after promoting cumulative route steps 17–20 and consolidating the three lab aliases onto their canonical room nodes.

- Locations: 154
- Edges: 115 (85 horizontal, 30 stair)
- Floors: 4
- Staircase families: A=2, B=4, C=4
- Stair transitions: 30
- Undirected components: 45
- Isolated nodes: 38
- Largest component sizes: 51, 43, 9, 5, 4, 2, 2
- Exact duplicate edges: 0
- Duplicate undirected same-type edges: 0
- Unknown endpoints: 0

## Largest components

| Component | Size | Block(s) | Interpretation |
|---:|---:|---|---|
| 1 | 51 | A, B, C | B measured network + C Staircase 04 + promoted A/B route-position segment |
| 2 | 43 | C | Main measured C-block network, including same-floor lift landmarks and C staircases 01–03 |
| 3 | 9 | A | A001–A005 room chain + A Staircase 02 F0–F3 through the separately confirmed 14-unit A001 approach |
| 4 | 5 | A | Gents washroom → A018/A017 corridor position → A016 → staff toilet → reported position 393 |
| 5 | 4 | A | A Staircase 01 F0–F3 vertical stack |
| 6 | 2 | A | A006 ↔ Lift 4 same-floor measured landmark |
| 7 | 2 | C | Floor 3 Library ↔ Lift 17 same-floor measured access |

The remaining 38 nodes are isolated in this undirected graph snapshot. Isolated status is a review flag, not proof that a room is physically unreachable; several locations have no approved measured access edge in the available source records.

## A-block change in this batch

Four owner-mapped measured segments were added:

| Route step | Cumulative positions | From | To | Weight |
|---:|---|---|---|---:|
| 17 | 268→287 | A005 | A004 | 19 |
| 18 | 287→299 | A004 | A003 | 12 |
| 19 | 299→304 | A003 | A002 | 5 |
| 20 | 304→311 | A002 | A001 | 7 |

The three provisional facility nodes for IoT lab, Project lab and Research lab were removed because the owner confirmed those destinations are the numbered rooms A004, A003 and A002. Their names are retained as aliases in the corresponding room metadata.

## Important unresolved boundaries

- The 43-node main C-block network remains separate from C Staircase 04 and the 51-node A/B/C route component. No measured horizontal link between them is present.
- A-block cumulative steps 9–13 and 15–16 remain unresolved because their source endpoints are composite or unmapped.
- Cumulative step 21 would imply A001→STAIR_A_02_F0=9, conflicting with the separately owner-confirmed 14-unit edge. The 9-unit edge is not added.
- Steps 22–23 contain generic staircase / Lift 1 / exit descriptions. A/B lifts remain metadata-only.
- The reported cumulative endpoint at position 393 is not automatically connected to `ENTRY_A`, `ENTRY_B`, `ENTRY_A_FROM_C` or `ENTRY_B_FROM_C`.

## Interpretation

This graph is structurally valid and has a measured route component spanning A, B and C. It is **not** a single connected campus graph and is not yet proven end-to-end Dijkstra/API ready. No edges have been invented to force connectivity.
