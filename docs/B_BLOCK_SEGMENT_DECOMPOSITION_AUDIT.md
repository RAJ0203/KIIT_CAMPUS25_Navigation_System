# B-Block Segment Decomposition Audit

**Project:** KIIT CAMPUS25 Navigation System\
**Scope:** B-block ground-floor measurements, section 7.1 of the Master Team Coordination Document\
**Status:** Source decomposition extracted; junction-to-segment mapping remains to be verified against the map.\
**Canonical JSON changes:** None

## 1. Why this audit exists

The Master Team Coordination Document provides both total movement weights and, for many B-block routes, their raw segment decomposition. Those raw expressions are valuable: they show that a total such as 40 is made from two measured segments of 20 + 20.

However, a numeric decomposition does not identify the exact graph node at the turn. A segment may be promoted to `edges.json` only when its endpoints are known canonical nodes and the map supports the physical connection.

This audit therefore records every raw split without inventing junction IDs or assigning arbitrary segment lengths to the four existing numbered junction nodes.

## 2. Raw measurements with explicit segment decomposition

| Record | Original route | Raw decomposition | Total | Segment-level implementation status |
|---:|---|---:|---:|---|
| 2 | B019 → B020 | 2 + 12 | 14 | Two measured parts; intermediate junction identity not established |
| 4 | B022 → B021 | 2 + 11 | 13 | Two measured parts; intermediate junction identity not established |
| 8 | B001 → B002 | 3 + 18 | 21 | Two measured parts; intermediate junction identity not established |
| 9 | B002 → B003 | 2 + 12 | 14 | Two measured parts; intermediate junction identity not established |
| 10 | B003 → B004 | 2 + 6 | 8 | Two measured parts; intermediate junction identity not established |
| 12 | B004 → B005 | 3 + 7 | 10 | Two measured parts; intermediate junction identity not established |
| 14 | B005 → B006 | 20 + 20 | 40 | Two measured parts; intermediate junction identity not established |
| 16 | B006 → B008 | 2 + 18 | 20 | Two measured parts; intermediate junction identity not established |
| 18 | B007 → B010 | 2 + 18 | 20 | Two measured parts; intermediate junction identity not established |
| 19 | B009 → B016 | 8 + 7 | 15 | Two measured parts; intermediate junction identity not established |
| 20 | B010 → B016 | 8 + 4 | 12 | Two measured parts; intermediate junction identity not established |
| 22 | B017 → B018 | 2 + 32 | 34 | Two measured parts; intermediate junction identity not established |
| 26 | B011 → B012 | 3 + 22 | 25 | Two measured parts; intermediate junction identity not established |
| 27 | B012 → B013 | 2 + 14 | 16 | Two measured parts; intermediate junction identity not established |
| 28 | B013 → B014 | 2 + 4 | 6 | Two measured parts; intermediate junction identity not established |
| 29 | B014 → B015 | 2 + 8 | 10 | Two measured parts; intermediate junction identity not established |

All 16 decompositions above are transcribed from Master Team Coordination Document section 7.1. The arithmetic totals match the reported normalized weights.

## 3. Measurements with no explicit internal decomposition

| Record | Original route | Total | Current treatment |
|---:|---|---:|---|
| 1 | B018 → B019 | 38 | Preserve as reported route measurement; no internal segment split supplied |
| 3 | B020 → B022 | 12 | Preserve as reported measurement |
| 6 | B021 → B001 | 34 | Possible composite corridor route; no internal segment split supplied |
| 11 | B002 → B004 | 19 | Branch interpretation unresolved |
| 15 | B006 → B007 | 18 | Preserve as reported measurement |
| 17 | B007 → B009 | 18 | Preserve as reported measurement |
| 21 | B016 → B017 | 12 | Preserve as reported measurement |
| 23 | B016 → B011 | 34 | Preserve as reported measurement |

These values remain source-supported totals. The absence of a decomposition is not permission to estimate one.

## 4. Staircase and washroom records

| Record | Measurement | Weight | Required resolution |
|---:|---|---:|---|
| 5 | B021 → staircase | 20 | The previously approved map-based mapping is B021 → `STAIR_B_01_F0`; retain 20 |
| 7 | B001 → girls' washroom | 20 | Create/use a distinct mapped washroom access node only when its exact position and stable ID are confirmed |
| 13 | B005 → staircase | 18 | The previously approved mapping is B005 → `STAIR_B_02_F0`; retain 18 |
| 24 | B016 → staircase | 28 | The previously approved mapping is B016 → `STAIR_B_03_F0`; retain 28 |
| 25 | B011 → girls' washroom | 14 | Keep separate from B001-side access; exact distinct access node ID needs confirmation |
| 30 | B015 → staircase | 24 | The previously approved mapping is B015 → `STAIR_B_04_F0`; retain 24 |

These four staircase approaches are already represented in the current reported canonical snapshot. Do not add duplicates.

## 5. Existing junction registry

The Phase 2 patch added these four ground-floor junction records:

- `B-F0-JUNC-01`
- `B-F0-JUNC-02`
- `B-F0-JUNC-03`
- `B-F0-JUNC-04`

This audit does not assign any particular raw split to one of these IDs. That assignment requires a clear match between the map's physical turn/intersection and the measured route. The IDs must not be allocated in numeric order merely because the measurements appear in a certain order.

For each junction assignment, record:
1. The map page and visible location.
2. Which corridor arms meet at that point.
3. The source measurement record(s) that terminate there.
4. The exact measured segment weight on each side.
5. The canonical node ID.

If a measured split point is not one of the four existing junctions, add another junction only if the map supports a meaningful physical decision point and the project owner approves the node addition.

## 6. Safe graph update rule

For a source route `A → B` with decomposition `x + y`, the graph can use:

`A → J` with weight `x`, and `J → B` with weight `y`

only if all three nodes `A`, `J`, and `B` are exact physical endpoints and the map confirms that the measured route passes through `J`.

Do not:
- create `J` at an arbitrary coordinate;
- assign `x` or `y` to a junction based on visual proportions;
- connect A and B directly with the total if the graph contract requires a meaningful intermediate junction;
- create two edges with invented endpoint IDs;
- discard the original total or raw decomposition from the measurement record.

## 7. Validation checks completed in this document

- 16 source decompositions transcribed.
- All 16 arithmetic sums match their reported totals.
- 8 additional measurements retained as unsplit source totals.
- 4 previously approved staircase approaches identified as already present.
- 2 girls' washroom access records kept distinct.
- No new canonical node or edge proposed without an exact map-supported endpoint.

## 8. Immediate next implementation action

Use the B-block ground-floor map to match the 16 measured intermediate split points to the four existing junctions (or to additional map-supported junctions if required). Once each split point is identified, update `locations.json` only if a genuinely new junction is needed, then add the consecutive measured segments to `edges.json`.

Until that mapping is complete, keep the current canonical JSON snapshot unchanged. Structural validation passing does not make an unverified corridor route safe for Dijkstra.

## 9. Source provenance

- `KIIT_CAMPUS25_Navigation_System_Master_Team_Document_Updated.docx`, section 7.1, B-block measured network.
- `docs/EDGE_INVENTORY.md`, B-block records 1–30.
- `docs/MEASUREMENT_RECONCILIATION.md`, B-block normalization records.
- Approved project decisions for B015/B016/B005/B021 staircase approaches and numbered junction naming.

**This is a measurement decomposition audit, not an accepted edge list.**
