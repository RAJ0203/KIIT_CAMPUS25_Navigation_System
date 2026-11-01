# A-Block Ground-Floor Route Reconciliation

**Project:** KIIT CAMPUS25 Navigation System\
**Scope:** A/B cumulative route, A-block ground-floor portion\
**Source:** Master Team Coordination Document §7.2; `EDGE_INVENTORY.md`; annotated A/B ground-floor map, page 1\
**Status:** Source route transcribed and map landmarks cross-checked; canonical edge approval remains limited by endpoint/topology ambiguity\
**Canonical JSON changes:** None

## 1. Route interpretation

The Master Team Coordination Document provides one cumulative route beginning at B018 (position 0) and ending at the reported A/B/C intersection (position 393). The route is not a list of 27 independently approved canonical graph edges.

For each consecutive pair:

`segment weight = next cumulative position - previous cumulative position`

All 27 arithmetic differences are internally consistent and sum to 393. A route segment can be added to the canonical graph only when both endpoints correspond to exact canonical nodes and the segment represents a supported traversable connection. Combined descriptions such as "A013/A012 corridor position" must not merge the room nodes A013 and A012.

## 2. Full cumulative route

| Step | Cumulative positions | Source endpoint descriptions | Weight | Endpoint/topology status |
|---:|---:|---|---:|---|
| 1 | 0 → 36 | B018 → C-block stairs | 36 | Unresolved: exact C-block staircase identity missing |
| 2 | 36 → 74 | C-block stairs → Right A-block / staircase junction | 38 | Unresolved: C-side endpoint unknown; A junction provisional |
| 3 | 74 → 91 | Right A-block / staircase junction → A015 | 17 | Provisional: junction identity/position pending |
| 4 | 91 → 103 | A015 → A014 | 12 | Room labels visible; direct graph endpoint/access interpretation still needs topology review |
| 5 | 103 → 115 | A014 → Left A-block junction | 12 | Provisional: junction identity/position pending |
| 6 | 115 → 138 | Left A-block junction → Right B-block / staircase junction | 23 | Provisional: both route landmarks and staircase identity pending |
| 7 | 138 → 145 | Right B-block / staircase junction → A013 / A012 corridor position | 7 | Provisional: route position not an A013/A012 room node |
| 8 | 145 → 163 | A013 / A012 corridor position → A011 | 18 | Provisional: corridor position/access point pending |
| 9 | 163 → 193 | A011 → Left route toward A-block exit | 30 | Provisional: exit route position is not a confirmed entrance/exit node |
| 10 | 193 → 208 | Left route toward A-block exit → Front toward gents washroom | 15 | Unresolved: second endpoint is a route description |
| 11 | 208 → 213 | Front toward gents washroom → A010 / A009 corridor position | 5 | Unresolved: combined corridor position has no canonical node |
| 12 | 213 → 231 | A010 / A009 corridor position → A008 / A007 corridor position | 18 | Unresolved: neither combined corridor position has an exact node |
| 13 | 231 → 237 | A008 / A007 corridor position → Lift 4 location | 6 | Unresolved: first endpoint unknown; lift is metadata only |
| 14 | 237 → 249 | Lift 4 location → A006 / left staircase | 12 | Unresolved: combined A006/staircase endpoint has no single node |
| 15 | 249 → 253 | A006 / left staircase → Ladies washroom / A-block exit | 4 | Unresolved: both endpoints combine distinct physical locations |
| 16 | 253 → 268 | Ladies washroom / A-block exit → Lift 3 / A005 area | 15 | Unresolved: both endpoint descriptions are composite |
| 17 | 268 → 287 | Lift 3 / A005 area → IoT lab / A004 | 19 | Unresolved: composite lift/room and facility/room descriptions |
| 18 | 287 → 299 | IoT lab / A004 → Project lab / A003 | 12 | Unresolved: composite facility/room endpoints |
| 19 | 299 → 304 | Project lab / A003 → Research lab / A002 | 5 | Unresolved: composite facility/room endpoints |
| 20 | 304 → 311 | Research lab / A002 → Lift 2 / A001 area | 7 | Unresolved: composite facility/room endpoints |
| 21 | 311 → 320 | Lift 2 / A001 area → Left staircase | 9 | Unresolved: composite lift/room endpoint and generic staircase |
| 22 | 320 → 330 | Left staircase → Lift 1 / A-block exit | 10 | Unresolved: generic staircase and composite lift/exit endpoint |
| 23 | 330 → 346 | Lift 1 / A-block exit → Gents washroom | 16 | Unresolved: first endpoint is a composite route description |
| 24 | 346 → 351 | Gents washroom → A018 / A017 corridor position | 5 | Provisional: A018/A017 corridor position is not a room node |
| 25 | 351 → 363 | A018 / A017 corridor position → A016 | 12 | Provisional: corridor position needs exact map placement |
| 26 | 363 → 373 | A016 → Staff toilet | 10 | Provisional: staff-toilet access point is not established |
| 27 | 373 → 393 | Staff toilet → A/B/C block intersection | 20 | Provisional: staff toilet access and intersection endpoints pending |

## 3. Map cross-check

The annotated ground-floor map visibly identifies A-block room labels A001 through A018 and separate ladies'/gents' toilet symbols. It also shows multiple staircase symbols and the A-block entrance area.

The following source facts can be retained:

- A001–A018 are distinct room labels on Floor 0.
- A012 and A013 are separate rooms; the route's "A013/A012 corridor position" is a corridor landmark, not a replacement for either room.
- A018 and A017 are separate rooms; the route's "A018/A017 corridor position" is a corridor landmark, not a replacement for either room.
- Ladies' washroom, gents' washroom, staff toilet, lifts, stairs, and entrances must remain distinct physical destinations/access points where the map supports them.
- The map contains handwritten staircase annotations, but each route's generic "left staircase" or "staircase junction" wording must be matched to a specific physical staircase before assigning a canonical stair ID.
- Lift 1–4 route descriptions must not be merged with C-block Lift 15/16, 17, 18/19, or 20 labels without explicit evidence. Lifts remain metadata/UI nodes, never vertical Dijkstra connectors.

The map is a layout source. It does not supply new horizontal movement weights or SVG coordinates for this cumulative route.

## 4. A-block node references already present in the inventory

The following semantic route-landmark IDs are already listed as provisional in `NODE_INVENTORY.md`:

- `A-F0-JUNC-RIGHT-REPORTED`
- `A-F0-JUNC-LEFT-REPORTED`
- `A-F0-JUNC-A013-A012-REPORTED`
- `A-F0-JUNC-A018-A017-REPORTED`
- `A-F0-EXIT-REPORTED`
- `A-F0-JUNC-ABC-REPORTED`

They are descriptive placeholders, not automatically map-confirmed junctions. Do not create duplicate IDs for the same named route landmarks. Do not assign arbitrary coordinates.

The route also describes a B-side junction (`B-F0-JUNC-REPORTED`) and multiple composite A-block facility/route positions. Those must not be collapsed into A-block room nodes.

## 5. What can be approved now

- The 27 cumulative differences are arithmetically consistent.
- The cumulative route starts at B018 = 0 and ends at the A/B/C intersection = 393.
- The A-block room labels A001–A018 are visible on the ground-floor map.
- The route landmarks A015, A014, A013/A012 corridor position, A011, A010/A009 corridor position, A008/A007 corridor position, A018/A017 corridor position, and A016 are preserved as source descriptions.
- The A-block facilities and access points remain distinct from room nodes.
- No new staircase or lift vertical connector is justified by this cumulative route alone.

## 6. What must not be added to `edges.json` yet

Do not add the 27 differences as 27 canonical edges. In particular, do not:

- create edges to/from generic descriptions such as "left staircase", "front toward gents washroom", or "A006 / left staircase";
- connect A013 directly to A012 or A018 directly to A017 based on combined corridor-position labels;
- turn Lift 1–4 route descriptions into vertical connectors;
- infer a staircase identity from proximity alone;
- create a direct edge between composite facility/room descriptions;
- invent an intermediate junction or split a measured segment without source-supported segment weights.

A015 → A014 = 12 is the only consecutive segment in this route whose two endpoint labels are exact room labels. However, the measurement inventory still classifies its direct room-to-room graph interpretation as provisional because the route source does not define the physical corridor access topology. Keep it documented as a candidate, not a released canonical edge, until the team's edge semantics confirm that this measured room-to-room route is represented by a direct room-node edge.

## 7. Next implementation gates

1. Confirm the exact map position and identity of the right A-block junction at cumulative 74.
2. Confirm the exact map position and identity of the left A-block junction at cumulative 115.
3. Map the A013/A012 and A018/A017 corridor positions to distinct physical junction nodes without merging rooms.
4. Resolve the gents' washroom front/access point and the A-block exit route position.
5. Resolve each A-block staircase and lift description independently.
6. Resolve the composite facility/room route descriptions for A001–A010.
7. Confirm which of the cumulative segments are valid direct graph edges versus segments that require corridor/access nodes.
8. Add only the approved segments with their original difference-derived weights and provenance.
9. Run graph validation and connectivity audit.

## 8. Implementation decision

**No changes to `locations.json`, `edges.json`, or `floors.json` are made by this reconciliation.**

The source route provides a measured cumulative walk, but most endpoints are composite descriptions or provisional route landmarks. This phase closes the arithmetic and map-label review, not the physical endpoint topology. Keeping the graph conservative prevents invented room, facility, staircase, or cross-block connections.

## 9. Provenance

- `KIIT_CAMPUS25_Navigation_System_Master_Team_Document_Updated.docx`, §7.2, A/B route cumulative measurements.
- `docs/EDGE_INVENTORY.md`, §2, B018 cumulative route, including original endpoint descriptions, difference-derived weights, and ambiguity notes.
- `docs/NODE_INVENTORY.md`, A-block Floor 0 room labels and provisional corridor/route landmarks.
- Annotated `A,B,C Block GF_261028_164441.pdf`, page 1, Block A & B ground-floor map.
