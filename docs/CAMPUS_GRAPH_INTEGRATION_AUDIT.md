# Campus Graph Integration Audit

**Project:** KIIT CAMPUS25 Navigation System\
**Owner:** Graph/Data Engineering\
**Audit date:** 2026-10-30\
**Status:** Integration review — canonical JSON not modified by this audit

## 1. Purpose

Bring the current B-block, A-block, C-block and cross-block reconciliation work into one controlled implementation plan. This audit distinguishes:

- source-reported measurements;
- user-approved reconciliation decisions;
- map-supported location/position evidence;
- accepted canonical graph edges;
- unresolved endpoint or topology work.

A measurement being present in a document does not automatically make it an accepted direct edge.

## 2. Current canonical snapshot

The latest user-reported validation after the B-block Phase 2 patch was:

| Item | Current result |
|---|---:|
| Locations | 127 |
| Edges | 16 |
| Floors | 4 |
| Stair edges | 12 |
| Horizontal edges | 4 |
| Source-confirmed locations | 92 |
| Provisional-transcription locations | 35 |
| Connected components (undirected) | 111 |
| Isolated nodes | 107 |

The structural validator passed with one warning for 35 provisional locations. The connectivity audit reported many isolated room nodes awaiting corridor/junction edges.

These counts describe the user's last reported run. They are not a fresh execution against the local repository in this audit.

## 3. Current edge snapshot — what is actually in the graph

The latest reported `edges.json` contains 16 edges:

### 3.1 Vertical staircase edges (12)

Four B-block staircase identities, each with three consecutive-floor transitions:

- `STAIR_B_01_F0` ↔ `STAIR_B_01_F1` ↔ `STAIR_B_01_F2` ↔ `STAIR_B_01_F3`
- `STAIR_B_02_F0` ↔ `STAIR_B_02_F1` ↔ `STAIR_B_02_F2` ↔ `STAIR_B_02_F3`
- `STAIR_B_03_F0` ↔ `STAIR_B_03_F1` ↔ `STAIR_B_03_F2` ↔ `STAIR_B_03_F3`
- `STAIR_B_04_F0` ↔ `STAIR_B_04_F1` ↔ `STAIR_B_04_F2` ↔ `STAIR_B_04_F3`

Each consecutive-floor transition uses the frozen weight 26. The floor-map review supports corresponding staircase positions, but the audit warning should remain until each same-stair correspondence is explicitly documented with page/position evidence. Do not remove or silently relabel these existing edges in this documentation-only audit.

### 3.2 Horizontal staircase approaches (4)

| From | To | Weight |
|---|---|---:|
| B005 | `STAIR_B_02_F0` | 18 |
| B021 | `STAIR_B_01_F0` | 20 |
| B016 | `STAIR_B_03_F0` | 28 |
| B015 | `STAIR_B_04_F0` | 24 |

These are horizontal approach measurements, not vertical stair costs.

## 4. Block-wise reconciliation status

### 4.1 B-block

Completed decisions:
- The four numbered ground-floor junction records were added in the Phase 2 patch: `B-F0-JUNC-01` through `B-F0-JUNC-04`.
- The four horizontal staircase approaches above are present in the reported 16-edge snapshot.
- Room-to-room source measurements remain documented; they are not all accepted as direct graph edges.
- Girls' washroom access measurements remain distinct: B001-side access = 20 and B011-side access = 14. Exact separate canonical facility/access node IDs and topology still need confirmation.
- Composite route measurements must be split only when each intermediate segment weight is supported by the raw measurement.

Open:
- Establish which measured room/corridor segments terminate at each numbered junction.
- Add only supported consecutive edges; do not fabricate segment weights by dividing a total.
- Finalize separate washroom access nodes without merging the two physical access points.

### 4.2 A-block

Completed decisions:
- Preserve the 27 consecutive differences in the B018 cumulative route.
- Preserve the cumulative route total of 393 movement units.
- Retain the established provisional junction identifiers:
  - `A-F0-JUNC-RIGHT-REPORTED`
  - `A-F0-JUNC-LEFT-REPORTED`
  - `A-F0-JUNC-A013-A012-REPORTED`
  - `A-F0-JUNC-A018-A017-REPORTED`
  - `A-F0-JUNC-ABC-REPORTED`
- Keep room/facility nodes distinct and preserve original cumulative measurement values.

Open:
- Match each cumulative position to an exact physical endpoint.
- Resolve provisional junction descriptions against the map.
- Do not promote a cumulative difference to an edge until both endpoint IDs and its physical route are supported.

### 4.3 C-block

Preserved ground-floor source measurements include:
- C-block entrance → KIIT Cafe = 55
- C-block entrance → Khel Kud area entrance = 22
- Khel Kud area entrance → C001 = 16
- C001 → stairs = 9
- C001 → Lift 15/16 = 4
- Khel Kud area entrance → Lift 17 = 28
- Lift 17 → Faculty Lounge = 30
- Faculty Lounge → Lift 20 = 27
- Faculty Lounge → C011 = 52
- Faculty Lounge → C013 = 52
- Faculty Lounge → C012 = 90
- Faculty Lounge → Lift 18/19 = 32
- Faculty Lounge → staircase = 24
- C012 → male WC = 14
- C012 → female WC = 14

User-approved second-floor decisions:
- C203 → C211 = 52 (revised from source value 36)
- C203 → C213 = 52 (revised from source value 36)
- C211 → C213 = 8 (unchanged)

Keep the original 36 values as source history and 52 as the current user-approved reconciled values. This is a decision based on the user's stated layout/orientation comparison, not an independent field remeasurement.

Open:
- Resolve generic staircase endpoints to exact floor-specific staircase access IDs.
- Resolve separate male/female washroom destination/access IDs.
- Resolve the exact C-block entrance and facility access nodes.
- Review room/facility corridor topology before accepting direct edges.
- Keep lifts as metadata only; no vertical lift edges.

### 4.4 Cross-block connections

The source documents describe:
- B018 → C-block stairs = 36 (first cumulative segment from position 0 to 36).
- C-block stairs → right A-block / staircase junction = 38 (next cumulative segment from 36 to 74).
- The B018 cumulative route reaches the reported A/B/C intersection at cumulative position 393.

These are source-derived candidate segments and route descriptions. Exact canonical endpoint IDs, intermediate topology, and map-supported continuity are not yet fully established. Do not add guessed cross-block edges.

## 5. Frozen project constraints

1. Horizontal edge weight = measured tile count; one tile = one movement unit.
2. Each verified staircase transition between consecutive floors = exactly 26 movement units.
3. Lifts are metadata/UI locations only and are not Dijkstra vertical connectors.
4. Use floor-specific node IDs; never infer a room or staircase solely from numbering patterns.
5. Opposite rooms connect through their corridor/junction topology, not directly through each other.
6. Preserve raw measurement provenance and original values when a user-approved reconciliation changes a value.
7. Unknown coordinates remain null; do not fabricate SVG coordinates.
8. Do not claim a route is verified if any edge in that route is provisional or unresolved.

## 6. Implementation gates

| Gate | Required work | Exit condition |
|---|---|---|
| G1 — Source/endpoint closure | Map every measurement endpoint to an exact canonical node or keep it unresolved | No guessed endpoint IDs |
| G2 — Segment topology | Resolve corridor turns, junctions and composite routes | Every proposed edge is a supported consecutive physical segment |
| G3 — Measurement closure | Preserve source values and approved revisions with provenance | Every accepted weight has a traceable measurement |
| G4 — Vertical closure | Verify same physical staircase on consecutive floors | Every vertical edge is a verified pair with weight 26 |
| G5 — Cross-block closure | Resolve exact A/B/C entry and junction endpoints | Every cross-block edge has map evidence and measured weight |
| G6 — Canonical JSON update | Apply only accepted nodes/edges; keep floors consistent | Schema validator passes |
| G7 — Graph audit | Check endpoint integrity, duplicates, weights, lift exclusion and connectivity | All warnings explained; no unsupported edge |
| G8 — Routing handoff | Publish one frozen graph snapshot and known-route test fixtures | Dijkstra owner can consume a stable canonical graph |

## 7. Required graph checks before handoff

- Every edge endpoint exists in `locations.json`.
- Every edge weight is a non-negative integer.
- Every vertical staircase edge is between consecutive floors and has weight 26.
- No lift is used as a vertical Dijkstra connector.
- No duplicate or contradictory edge records exist.
- Every accepted edge has source/provenance documentation.
- Opposite classrooms connect through supported corridor/junction nodes.
- Cumulative measurements are converted using consecutive differences, with endpoint identities preserved.
- Cross-block edges correspond to a real continuous walkable route and a measured weight.
- Isolated nodes are reviewed individually; they are not automatically errors, but important destinations must not remain disconnected without explanation.

## 8. Immediate implementation order

1. Close B-block corridor/junction segment endpoints using the raw measurement decompositions.
2. Close the B018 cumulative route endpoint mapping and A-block junction identities.
3. Resolve C-block generic staircase, entrance, washroom and facility endpoints.
4. Verify all four B-block staircase correspondences and identify any additional A/C staircase connectors that are actually supported.
5. Close A/B/C cross-block links with exact endpoint IDs and measured segment weights.
6. Update `locations.json`, `edges.json`, and `floors.json` together only after the above evidence is available.
7. Run `validate_graph_data.py` and `audit_graph_data.py`; inspect all warnings rather than treating structural PASS as routing readiness.
8. Freeze the graph snapshot and hand it to the Dijkstra/backend owner.

## 9. Files and documents to keep together

Canonical data:
- `data/locations.json`
- `data/edges.json`
- `data/floors.json`

Source and reconciliation documentation:
- `docs/DATA_SCHEMA.md`
- `docs/NODE_INVENTORY.md`
- `docs/EDGE_INVENTORY.md`
- `docs/MEASUREMENT_RECONCILIATION.md`
- `docs/B_BLOCK_TOPOLOGY_RECONCILIATION.md`
- `docs/B_BLOCK_HORIZONTAL_RECONCILIATION.md`
- `docs/A_BLOCK_CUMULATIVE_ROUTE_RECONCILIATION.md`
- `docs/C_BLOCK_MEASUREMENT_TOPOLOGY_RECONCILIATION.md`
- `docs/CROSS_BLOCK_CONNECTION_RECONCILIATION.md`
- This integration audit

Scripts:
- `scripts/validate_graph_data.py`
- `scripts/audit_graph_data.py`

Keep the master team coordination document and original maps in `docs/source/` as the primary source evidence.

## 10. Audit conclusion

The current graph is structurally valid according to the last user-reported validator run, but it is not a complete, connected, routing-ready campus graph. The current reported snapshot has 127 locations and 16 edges; most measured corridor connections have not yet been promoted to canonical edges because endpoint and segment topology remain open.

**No JSON files are changed by this audit.** This document is the integration control plan. The next code/data update should happen only when the exact segment endpoints and measured weights are supported by the source records and maps.
