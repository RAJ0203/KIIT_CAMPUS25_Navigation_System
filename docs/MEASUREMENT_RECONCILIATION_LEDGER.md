# Measurement and Reconciliation Ledger — 2026-10-31

This ledger accompanies the proposed canonical graph. Weights are movement units. Horizontal movement is measured tile count; each confirmed consecutive-floor staircase transition is 26. Coordinates remain null where no reliable SVG coordinate was supplied.

## Applied owner corrections

- B001 → B002 corrected from stale repository value 21 to 20 (2 shift/cross + 18 straight).
- B staircase approaches: B005→STAIR_B_02_F0=18; B021→STAIR_B_01_F0=20; B016→STAIR_B_03_F0=28; B015→STAIR_B_04_F0=24.
- Separate B girls' washrooms retained: B001→B-F0-FAC-GIRLS-WASHROOM=20; B011→B-F0-FAC-GIRLS-WASHROOM-B011=14. These existed already and are not duplicated.
- C104/C105/C106 represented as one combined office endpoint.
- C lifts 18 and 19 split into distinct metadata nodes on each floor. No lift-to-lift vertical edges are created.
- C Staircases 01–04 have floor nodes F0–F3 and 26-unit consecutive-floor transitions. Staircase 04 is near the A/B connecting corridor, not library-side.
- A Staircases 01 and 02 have floor nodes F0–F3 and 26-unit consecutive-floor transitions.
- C Floor 2 and Floor 3 library entrances are distinct; Lift17→Library=40 on each floor.

## B-block horizontal records

All 30 existing B horizontal records are retained, except the B001→B002 correction above. This includes the 30-room/corridor records plus the four staircase approaches and two distinct washroom approaches. No extra B washroom edges are added.

## C-block horizontal records applied

| From | To | Weight |
|---|---|---:|
| `C-F0-FAC-C-BLOCK-LOBBY` | `C-F0-FAC-KIIT-CAFE` | 55 |
| `C-F0-FAC-C-BLOCK-LOBBY` | `C-F0-FAC-KHEL-KUD` | 22 |
| `C-F0-FAC-KHEL-KUD` | `C001` | 16 |
| `C001` | `STAIR_C_03_F0` | 9 |
| `C001` | `LIFT_C_15_16_F0` | 4 |
| `C-F0-FAC-KHEL-KUD` | `LIFT_C_17_F0` | 28 |
| `LIFT_C_17_F0` | `C-F0-FAC-FACULTY-LOUNGE` | 30 |
| `C-F0-FAC-FACULTY-LOUNGE` | `LIFT_C_20_F0` | 27 |
| `C-F0-FAC-FACULTY-LOUNGE` | `C011` | 52 |
| `C-F0-FAC-FACULTY-LOUNGE` | `C013` | 52 |
| `C-F0-FAC-FACULTY-LOUNGE` | `C012` | 90 |
| `C-F0-FAC-FACULTY-LOUNGE` | `LIFT_C_19_F0` | 32 |
| `C-F0-FAC-FACULTY-LOUNGE` | `STAIR_C_01_F0` | 24 |
| `C012` | `C-F0-FAC-MALE-WASHROOM` | 14 |
| `C012` | `C-F0-FAC-FEMALE-WASHROOM` | 14 |
| `C-F1-FAC-OFFICE-104-106` | `C-F1-FAC-CONFERENCE` | 52 |
| `C-F1-FAC-OFFICE-104-106` | `LIFT_C_20_F1` | 30 |
| `C-F1-FAC-OFFICE-104-106` | `STAIR_C_01_F1` | 34 |
| `C-F1-FAC-OFFICE-104-106` | `C101` | 65 |
| `C-F1-FAC-OFFICE-104-106` | `LIFT_C_19_F1` | 32 |
| `C-F1-FAC-OFFICE-104-106` | `LIFT_C_17_F1` | 25 |
| `C-F1-FAC-OFFICE-104-106` | `C-F1-FAC-CAFETERIA` | 25 |
| `C101` | `STAIR_C_03_F1` | 9 |
| `C101` | `LIFT_C_15_16_F1` | 4 |
| `STAIR_C_02_F2` | `C203` | 15 |
| `C203` | `LIFT_C_17_F2` | 20 |
| `C203` | `LIFT_C_19_F2` | 24 |
| `C203` | `LIFT_C_20_F2` | 16 |
| `C203` | `C211` | 52 |
| `C203` | `C213` | 52 |
| `C211` | `C213` | 8 |
| `C213` | `LIFT_C_20_F2` | 20 |
| `LIFT_C_17_F2` | `C-F2-FAC-LIBRARY` | 40 |
| `LIFT_C_17_F3` | `C-F3-FAC-LIBRARY` | 40 |
| `LIFT_C_17_F2` | `C201` | 45 |
| `C201` | `STAIR_C_03_F2` | 9 |
| `C201` | `LIFT_C_15_16_F2` | 4 |

All C measurements above are represented as direct horizontal endpoint-to-endpoint measurements, as confirmed by the owner. Lift nodes are used only as same-floor horizontal access points; they are not vertical Dijkstra connectors.

## A-block measurements: applied vs preserved

Applied as a canonical horizontal edge only where the user provided an unambiguous endpoint pair: `A001 → STAIR_A_02_F0 = 14` (9 straight + 5 left). The user also confirmed the two A staircases continue F0–F3; their vertical transitions are included at 26 each.

The B018 position 0 → reported A/B/C junction position 393 cumulative route remains fully preserved in `docs/A_BLOCK_CUMULATIVE_ROUTE_RECONCILIATION.md`. It is **partially represented** as canonical edges: steps 1–8, 14, 17–20 and 24–27 are promoted. Steps 9–13, 15–16 and 22–23 remain unpromoted; step 21 is held because its cumulative 9-unit value conflicts with the separate owner-confirmed A001→STAIR_A_02_F0=14 measurement. The full trace is not yet a continuous canonical path.

## Known limits / do not infer

- Four source-measured route-position links from the B018 cumulative route are now canonical (steps 1, 2, 6 and 7). Other entry-to-entry links remain unresolved; the reported final A/B/C junction is not automatically connected to ENTRY_A, ENTRY_B, or the C-block main network.
- Do not turn every room-to-room measurement into a direct edge unless the owner's measurement is explicitly between those access endpoints; the C list is confirmed as direct endpoint measurements.
- Do not add corridor junctions solely for turns or crossings.
- Do not add lift vertical edges.
- Do not create reverse duplicate records; the graph consumer must treat each horizontal/stair record as bidirectional per the project contract.


## 2026-11-01 cumulative-route promotions
The following measured consecutive segments are represented in `data/edges.json`: route steps 1–8, 14, 17–20 and 24–27. Steps 1 and 2 use owner-confirmed C Staircase 04 near the A/B connecting corridor; steps 6 and 7 use existing A/B route-position nodes; steps 17–20 map Lift 3/A005 area to A005, IoT lab to A004, Project lab to A003, Research lab to A002, and Lift 2/A001 area to A001. Step 21 remains unpromoted because its 9-unit value conflicts with the separately owner-confirmed 14-unit A001→Staircase 02 approach. Exact IDs, cumulative positions, weights and mapping basis are documented in `A_BLOCK_ROUTE_EDGE_PROMOTION_2026-11-01.md`. The total 393-unit trace is preserved and is not yet a continuous canonical path.

## Lift connectivity audit correction
Measured same-floor horizontal edges to lift metadata nodes are valid horizontal endpoints under the owner-approved graph semantics. Lift metadata nodes are never vertical connectors. The connectivity audit must include such nodes when referenced by horizontal edges; excluding all lift metadata nodes incorrectly split C-block components. See updated `DATA_SCHEMA.md` and `scripts/audit_graph_data.py`.


## 2026-11-01 route connector correction

The latest owner clarification resolves the generic “C-block stairs” landmark in cumulative route steps 1 and 2 as `STAIR_C_04_F0`, because Staircase 04 is near the A/B connecting corridor (not library-side). The four newly promoted horizontal edges are:

- B018 → STAIR_C_04_F0 = 36 (positions 0→36)
- STAIR_C_04_F0 → A-F0-JUNC-RIGHT-REPORTED = 38 (positions 36→74)
- A-F0-JUNC-LEFT-REPORTED → B-F0-JUNC-REPORTED = 23 (positions 115→138)
- B-F0-JUNC-REPORTED → A-F0-JUNC-A013-A012-REPORTED = 7 (positions 138→145)

Each is source-measured; the endpoint mapping basis and route provenance are stored in edge metadata. This creates a 51-node measured component spanning B, C Staircase 04 and the mapped A/B route-position segment. It does not connect the 43-node main C-block network or the final reported A/B/C junction to all block entrances. Do not infer those missing connections.


## 2026-11-01 A-block lab/room endpoint resolution

The owner clarified that IoT lab = A004, Project lab = A003, Research lab = A002, Lift 3/A005 area = A005, and Lift 2/A001 area = A001. This resolves cumulative route steps 17–20 as four direct measured room-to-room segments:

| Route step | From | To | Weight | Cumulative positions |
|---:|---|---|---:|---|
| 17 | A005 | A004 | 19 | 268→287 |
| 18 | A004 | A003 | 12 | 287→299 |
| 19 | A003 | A002 | 5 | 299→304 |
| 20 | A002 | A001 | 7 | 304→311 |

The three duplicate provisional facility nodes `A-F0-FAC-IOT-LAB`, `A-F0-FAC-PROJECT-LAB`, and `A-F0-FAC-RESEARCH-LAB` were removed from `locations.json`; their names are stored as aliases on canonical room nodes A004, A003, and A002. No separate graph vertex is retained for the same physical room.

### Cumulative step 21 conflict

Cumulative step 21 would map to A001→STAIR_A_02_F0=9. This conflicts with the separately owner-confirmed direct approach measurement A001→STAIR_A_02_F0=14 (9 straight + 5 left). The graph retains the 14-unit edge and does not add the conflicting 9-unit edge. Both source records remain documented; the discrepancy is not averaged or silently overwritten.
