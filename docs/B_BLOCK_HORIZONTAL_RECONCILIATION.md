# B-Block Ground-Floor Horizontal Reconciliation — Phase 3

Date: 2026-10-30\
Status: topology review completed to the limit supported by the supplied map and measurement inventory; remaining measured records are not yet accepted as canonical edges.

## Source basis and fixed rules

- Ground-floor A/B map: `A,B,C Block GF_261028_164441.pdf`, page 1.
- Measurement source: `MEASUREMENT_RECONCILIATION.md`, section 1, preserving the 30 B-block records transcribed from Master Team Coordination Document section 7.1.
- Current working data snapshot: 127 locations and 16 edges (`locations.json`, `edges.json` supplied on 2026-10-30).
- Horizontal weights remain measured tile counts (1 tile = 1 movement unit).
- A reported room-to-room measurement does not automatically authorize a direct room-to-room graph edge. Preserve the total, and only split it when the original segment measurements identify the split point and each segment weight.
- Opposite rooms remain separate. Lifts are not routing nodes. The four approved B-block staircase approaches remain distinct from 26-unit vertical stair transitions.

## Map topology observations

The page-1 map visibly supports the B-block ground-floor room layout and corridor branches around:

- the north corridor serving B009, B007, and B006, turning toward the east-side B005/gents-washroom side;
- the east-side room run around B005, B004, B002, and B001;
- the central area around B010, B008, B003, B018, and the central staircase approach;
- the south/west run around B019, B021, B020, and B022;
- the left-side corridor/staircase approach near B016/B017 and B015/B013.

The drawing establishes physical layout and visible turns, but does not label tile-count positions at each proposed junction. Therefore it cannot, by itself, convert a total room-to-room measurement into multiple weighted junction-to-junction segments.

## Existing junction nodes

The current `locations.json` already contains four provisional junction records:

| ID | Map role recorded in metadata | Status |
|---|---|---|
| `B-F0-JUNC-01` | North-east corridor bend near B009/B007/B006 and east-side corridor | Provisional location; no measured segment weights assigned |
| `B-F0-JUNC-02` | East-side corridor around B005/B004/B002 | Provisional location; no measured segment weights assigned |
| `B-F0-JUNC-03` | Central corridor decision area around B010/B008 and central stair approach | Provisional location; no measured segment weights assigned |
| `B-F0-JUNC-04` | South-east entry/corridor area around B001 and B021/B022 | Provisional location; no measured segment weights assigned |

These nodes are useful topology anchors for reconciliation, not permission to invent edges. Their `x`/`y` values remain null until reliable SVG coordinates are established.

## Reconciliation of all 30 reported B-block measurements

`Current graph treatment` distinguishes already represented staircase approaches from measurements that remain unaccepted as graph edges.

| Record | Reported measurement | Weight | Current graph treatment | Reason / next required evidence |
|---:|---|---:|---|---|
| 1 | B018 — B019 | 38 | Pending corridor decomposition | Need exact room-door/corridor access endpoints and segment split, if any |
| 2 | B019 — B020 | 14 | Pending corridor decomposition | Same; do not assume a direct room edge |
| 3 | B020 — B022 | 12 | Pending corridor decomposition | Same; preserve measured total |
| 4 | B022 — B021 | 13 | Pending corridor decomposition | Same; preserve measured total |
| 5 | B021 — staircase access | 20 | **Represented** as B021 → `STAIR_B_01_F0` = 20 | Uses the previously approved B-01 mapping |
| 6 | B021 — B001 | 34 | Pending corridor decomposition | Likely traverses the south/east corridor; exact segment endpoints/weights are not supplied |
| 7 | B001 — girls' washroom access | 20 | Pending distinct access-node confirmation | Map shows a girls' toilet on the B001/east-side; keep separate from the B011-side toilet |
| 8 | B001 — B002 | 21 | Pending corridor decomposition | Need measured room-access-to-corridor segment(s) |
| 9 | B002 — B003 | 14 | Pending corridor decomposition | Do not infer a direct room-to-room edge |
| 10 | B003 — B004 | 8 | Pending corridor decomposition | Do not infer a direct room-to-room edge |
| 11 | B002 — B004 | 19 | Pending branch/topology review | Alternate reported route; reconcile with records 8–10 without creating a shortcut |
| 12 | B004 — B005 | 10 | Pending corridor decomposition | Need exact access endpoints/segment split |
| 13 | B005 — staircase access | 18 | **Represented** as B005 → `STAIR_B_02_F0` = 18 | Uses the previously approved B-02 mapping |
| 14 | B005 — B006 | 40 | Pending corridor decomposition | Long route around east/north corridor; no split weights at junctions supplied |
| 15 | B006 — B007 | 18 | Pending corridor decomposition | Need exact access endpoints/segment split |
| 16 | B006 — B008 | 20 | Pending branch/topology review | Separate branch; do not collapse into record 15 |
| 17 | B007 — B009 | 18 | Pending corridor decomposition | Need exact access endpoints/segment split |
| 18 | B007 — B010 | 20 | Pending branch/topology review | Separate branch; do not infer same access point as record 17 |
| 19 | B009 — B016 | 15 | Pending corridor decomposition | Crosses north/central-to-left side; intermediate junction split unknown |
| 20 | B010 — B016 | 12 | Pending corridor decomposition | Separate branch from record 19; split unknown |
| 21 | B016 — B017 | 12 | Pending corridor decomposition | Need exact access endpoints/segment split |
| 22 | B017 — B018 | 34 | Pending corridor decomposition | Likely composite route; preserve total until split evidence exists |
| 23 | B016 — B011 | 34 | Pending corridor decomposition | Need map-aligned route and segment weights; avoid shortcut |
| 24 | B016 — staircase access | 28 | **Represented** as B016 → `STAIR_B_03_F0` = 28 | Uses the previously approved B-03 mapping |
| 25 | B011 — girls' washroom access | 14 | Pending distinct access-node confirmation | Map shows a separate girls' toilet on the B011/north-west side; do not merge with record 7 endpoint |
| 26 | B011 — B012 | 25 | Pending corridor decomposition | Need exact access endpoints/segment split |
| 27 | B012 — B013 | 16 | Pending corridor decomposition | Need exact access endpoints/segment split |
| 28 | B013 — B014 | 6 | Pending corridor decomposition | Need exact access endpoints/segment split |
| 29 | B014 — B015 | 10 | Pending corridor decomposition | Need exact access endpoints/segment split |
| 30 | B015 — staircase access | 24 | **Represented** as B015 → `STAIR_B_04_F0` = 24 | Uses the previously approved B-04 mapping |

## Accepted vs pending outcome

- The four staircase approach measurements are already present in the current 16-edge file: 12 vertical stair transitions + 4 horizontal staircase approaches.
- The remaining 26 records are retained as measured evidence, not inserted as direct room-to-room edges.
- The two girls' washroom measurements are kept distinct (B001-side = 20; B011-side = 14). The map visually supports two separate toilet locations. The current graph still has one generic girls'-washroom location, so the two access endpoints need distinct canonical location IDs before either measurement is accepted as an edge.
- The four numbered junction nodes remain provisional anchors. No edge is attached to them until each source measurement is split into explicit segment weights.

## Why no additional weighted edges were added in this phase

The inventory gives endpoint-to-endpoint totals (and in some rows arithmetic expressions such as `2 + 12 = 14`), but it does not identify which addend terminates at which named junction. The map shows corridor geometry but has no tile-count labels at those junctions. Assigning invented values to room-to-junction or junction-to-junction segments would change the source measurements and could create false shortest paths.

## Exact next implementation requirement

For each pending record, obtain one of:

1. the original field-note segment breakdown with each intermediate point named; or
2. a verified statement that the reported measurement is a single traversable segment between the two canonical access nodes, with no intervening junction requiring a graph node.

Then add the appropriate canonical edges while preserving the reported total. For washrooms, add two distinct facility/access location IDs (B001-side and B011-side) and connect each only to its own measured access endpoint. Do not merge the two toilets.

## Current JSON files

No changes to `locations.json` or `edges.json` are proposed by this reconciliation report. The current graph remains at 127 locations and 16 edges until the missing segment-level evidence is supplied. This is intentional: a structurally valid graph with unsupported weights is worse than a conservative incomplete graph.
