# Edge Inventory

Status: measured topology specification. This is not `data/edges.json` and contains no Dijkstra implementation.

## Interpretation and status rules

- Horizontal weights are measured tile counts. One tile equals one movement unit.
- A reported measurement is source evidence, not automatically a direct canonical room-to-room edge.
- Opposite rooms remain separate locations and require a documented corridor or junction route.
- A confirmed consecutive-floor staircase connection has vertical cost exactly 26 movement units. Horizontal access-route measurements to a staircase are not the vertical staircase cost.
- Lifts are metadata/UI locations only. No lift is proposed as a vertical graph connector.
- `confirmed`: both endpoint IDs are confidently mapped and the measured connection does not depend on an unresolved endpoint. This does not override any later graph-schema review.
- `provisional`: endpoint IDs are available only as provisional inventory records, or the measurement is a room-to-room/corridor description whose direct graph-edge interpretation still requires topology review.
- `unresolved`: at least one endpoint cannot be mapped to an existing location ID without inventing an identity or connection.
- A `null` endpoint is deliberate and means that the source description cannot yet be mapped to one existing location ID.

The full master-document filename used below is `KIIT_CAMPUS25_Navigation_System_Master_Team_Document_Updated.docx`.

## Summary

- Source measurement segments reviewed: **95**
- Confirmed mappings: **16**
- Provisional mappings: **35**
- Unresolved mappings: **44**
- No final graph edges are accepted by this document.

## 1. B-block horizontal measurements

Source: `KIIT_CAMPUS25_Navigation_System_Master_Team_Document_Updated.docx`, section 7.1, `B-block measured network`. The normalization expressions are preserved in `docs/MEASUREMENT_RECONCILIATION.md`. Room-to-room records remain provisional graph connections until the physical corridor topology is reconciled.

| Record | Original endpoint descriptions | Proposed from | Proposed to | Weight | Status | Ambiguity |
|---:|---|---|---|---:|---|---|
| 1 | B018 -> B019 | B018 | B019 | 38 | provisional | Room endpoints are mapped, but the source does not establish a direct room-to-room graph edge. |
| 2 | B019 -> B020 | B019 | B020 | 14 | provisional | Room endpoints are mapped; corridor/junction interpretation remains pending. |
| 3 | B020 -> B022 | B020 | B022 | 12 | provisional | Room endpoints are mapped; corridor/junction interpretation remains pending. |
| 4 | B022 -> B021 | B022 | B021 | 13 | provisional | Room endpoints are mapped; corridor/junction interpretation remains pending. |
| 5 | B021 -> staircase | B021 | null | 20 | unresolved | The source does not identify which physical staircase or access node is meant. |
| 6 | B021 -> B001 | B021 | B001 | 34 | provisional | Room endpoints are mapped; the measurement may be a composite corridor route. |
| 7 | B001 -> girls washroom | B001 | null | 20 | unresolved | The facility is mapped, but the measured access point has no distinct canonical location ID. |
| 8 | B001 -> B002 | B001 | B002 | 21 | provisional | Room endpoints are mapped; corridor topology must determine graph endpoints. |
| 9 | B002 -> B003 | B002 | B003 | 14 | provisional | Room endpoints are mapped; corridor topology must determine graph endpoints. |
| 10 | B003 -> B004 | B003 | B004 | 8 | provisional | Room endpoints are mapped; corridor topology must determine graph endpoints. |
| 11 | B002 -> B004 | B002 | B004 | 19 | provisional | Room endpoints are mapped; this may represent a branch route rather than a direct room edge. |
| 12 | B004 -> B005 | B004 | B005 | 10 | provisional | Room endpoints are mapped; corridor topology must determine graph endpoints. |
| 13 | B005 -> staircase | B005 | null | 18 | unresolved | The source does not identify which physical staircase or access node is meant. |
| 14 | B005 -> B006 | B005 | B006 | 40 | provisional | Source normalization is 20 + 20; room-to-room wording does not establish a direct edge. |
| 15 | B006 -> B007 | B006 | B007 | 18 | provisional | Room endpoints are mapped; corridor topology must determine graph endpoints. |
| 16 | B006 -> B008 | B006 | B008 | 20 | provisional | Room endpoints are mapped; corridor topology must determine graph endpoints. |
| 17 | B007 -> B009 | B007 | B009 | 18 | provisional | Room endpoints are mapped; corridor topology must determine graph endpoints. |
| 18 | B007 -> B010 | B007 | B010 | 20 | provisional | Room endpoints are mapped; corridor topology must determine graph endpoints. |
| 19 | B009 -> B016 | B009 | B016 | 15 | provisional | Source normalization is 8 + 7; physical route may contain a junction. |
| 20 | B010 -> B016 | B010 | B016 | 12 | provisional | Source normalization is 8 + 4; physical route may contain a junction. |
| 21 | B016 -> B017 | B016 | B017 | 12 | provisional | Room endpoints are mapped; corridor topology must determine graph endpoints. |
| 22 | B017 -> B018 | B017 | B018 | 34 | provisional | Source normalization is 2 + 32; room-to-room wording does not establish a direct edge. |
| 23 | B016 -> B011 | B016 | B011 | 34 | provisional | Room endpoints are mapped; corridor topology must determine graph endpoints. |
| 24 | B016 -> staircase | B016 | null | 28 | unresolved | The source does not identify which physical staircase or access node is meant. |
| 25 | B011 -> girls washroom | B011 | null | 14 | unresolved | The facility is mapped, but the measured access point has no distinct canonical location ID. |
| 26 | B011 -> B012 | B011 | B012 | 25 | provisional | Source normalization is 3 + 22; room-to-room wording does not establish a direct edge. |
| 27 | B012 -> B013 | B012 | B013 | 16 | provisional | Source normalization is 2 + 14; corridor topology must determine graph endpoints. |
| 28 | B013 -> B014 | B013 | B014 | 6 | provisional | Source normalization is 2 + 4; corridor topology must determine graph endpoints. |
| 29 | B014 -> B015 | B014 | B015 | 10 | provisional | Source normalization is 2 + 8; corridor topology must determine graph endpoints. |
| 30 | B015 -> staircase | B015 | null | 24 | unresolved | The source does not identify which physical staircase or access node is meant. |

## 2. B018 cumulative route

Source: `KIIT_CAMPUS25_Navigation_System_Master_Team_Document_Updated.docx`, section 7.2, `A/B route cumulative measurements`.

Each weight is calculated from consecutive cumulative positions:

```text
weight = current cumulative position - previous cumulative position
```

The cumulative sequence starts at 0 and ends at 393. The endpoint descriptions and cumulative values below are preserved from the source. Provisional inventory IDs are used only where an existing provisional location record has the same route description; this does not make the route edge canonical.

| Step | Raw cumulative positions | Original endpoint descriptions | Proposed from | Proposed to | Weight calculation | Status | Ambiguity |
|---:|---|---|---|---|---|---|---|
| 1 | 0 -> 36 | B018 -> C-block stairs | B018 | null | 36 - 0 = 36 | unresolved | C-block staircase identity is not established. |
| 2 | 36 -> 74 | C-block stairs -> Right A-block / staircase junction | null | A-F0-JUNC-RIGHT-REPORTED | 74 - 36 = 38 | unresolved | The C-block staircase endpoint is unknown; the junction ID is provisional. |
| 3 | 74 -> 91 | Right A-block / staircase junction -> A015 | A-F0-JUNC-RIGHT-REPORTED | A015 | 91 - 74 = 17 | provisional | The route description has an existing provisional junction record, not a confirmed physical junction ID. |
| 4 | 91 -> 103 | A015 -> A014 | A015 | A014 | 103 - 91 = 12 | provisional | The measured consecutive route is source-supported, but the source does not establish a direct room-to-room graph edge; corridor access must be represented separately. |
| 5 | 103 -> 115 | A014 -> Left A-block junction | A014 | A-F0-JUNC-LEFT-REPORTED | 115 - 103 = 12 | provisional | The junction record is a provisional route description. |
| 6 | 115 -> 138 | Left A-block junction -> Right B-block / staircase junction | A-F0-JUNC-LEFT-REPORTED | B-F0-JUNC-REPORTED | 138 - 115 = 23 | provisional | Both junction IDs are provisional route descriptions; staircase identity is unresolved. |
| 7 | 138 -> 145 | Right B-block / staircase junction -> A013 / A012 corridor position | B-F0-JUNC-REPORTED | A-F0-JUNC-A013-A012-REPORTED | 145 - 138 = 7 | provisional | Both route-position IDs are provisional; A013 and A012 remain separate rooms. |
| 8 | 145 -> 163 | A013 / A012 corridor position -> A011 | A-F0-JUNC-A013-A012-REPORTED | A011 | 163 - 145 = 18 | provisional | The corridor position is provisional and is not a room-to-room shortcut. |
| 9 | 163 -> 193 | A011 -> Left route toward A-block exit | A011 | A-F0-EXIT-REPORTED | 193 - 163 = 30 | provisional | The exit route position is provisional and not a confirmed entrance/exit node. |
| 10 | 193 -> 208 | Left route toward A-block exit -> Front toward gents washroom | A-F0-EXIT-REPORTED | null | 208 - 193 = 15 | unresolved | The second endpoint is a route position, not the canonical washroom location. |
| 11 | 208 -> 213 | Front toward gents washroom -> A010 / A009 corridor position | null | null | 213 - 208 = 5 | unresolved | No A010/A009 corridor location ID exists in the inventory; no ID is invented. |
| 12 | 213 -> 231 | A010 / A009 corridor position -> A008 / A007 corridor position | null | null | 231 - 213 = 18 | unresolved | Neither combined corridor position has a canonical location ID. |
| 13 | 231 -> 237 | A008 / A007 corridor position -> Lift 4 location | null | A-F0-LIFT-04 | 237 - 231 = 6 | unresolved | The corridor position is unmapped; Lift 4 remains provisional metadata only. |
| 14 | 237 -> 249 | Lift 4 location -> A006 / left staircase | A-F0-LIFT-04 | null | 249 - 237 = 12 | unresolved | The combined A006/staircase endpoint has no single canonical ID. |
| 15 | 249 -> 253 | A006 / left staircase -> Ladies washroom / A-block exit | null | null | 253 - 249 = 4 | unresolved | Both descriptions combine multiple physical locations. |
| 16 | 253 -> 268 | Ladies washroom / A-block exit -> Lift 3 / A005 area | null | null | 268 - 253 = 15 | unresolved | Both descriptions combine multiple physical locations. |
| 17 | 268 -> 287 | Lift 3 / A005 area -> IoT lab / A004 | null | null | 287 - 268 = 19 | unresolved | Both endpoints combine a provisional lift/room or facility/room description. |
| 18 | 287 -> 299 | IoT lab / A004 -> Project lab / A003 | null | null | 299 - 287 = 12 | unresolved | Combined facility/room endpoints cannot be reduced to one location each. |
| 19 | 299 -> 304 | Project lab / A003 -> Research lab / A002 | null | null | 304 - 299 = 5 | unresolved | Combined facility/room endpoints cannot be reduced to one location each. |
| 20 | 304 -> 311 | Research lab / A002 -> Lift 2 / A001 area | null | null | 311 - 304 = 7 | unresolved | Combined facility/room endpoints cannot be reduced to one location each. |
| 21 | 311 -> 320 | Lift 2 / A001 area -> Left staircase | null | null | 320 - 311 = 9 | unresolved | Combined lift/room and staircase descriptions have no single canonical endpoint. |
| 22 | 320 -> 330 | Left staircase -> Lift 1 / A-block exit | null | null | 330 - 320 = 10 | unresolved | Both endpoints are generic route descriptions. |
| 23 | 330 -> 346 | Lift 1 / A-block exit -> Gents washroom | null | A-F0-FAC-GENTS-WASHROOM | 346 - 330 = 16 | unresolved | The first endpoint is a combined provisional description. |
| 24 | 346 -> 351 | Gents washroom -> A018 / A017 corridor position | A-F0-FAC-GENTS-WASHROOM | A-F0-JUNC-A018-A017-REPORTED | 351 - 346 = 5 | provisional | The corridor position is provisional and does not merge A018 and A017. |
| 25 | 351 -> 363 | A018 / A017 corridor position -> A016 | A-F0-JUNC-A018-A017-REPORTED | A016 | 363 - 351 = 12 | provisional | The corridor position is provisional; A018 and A017 remain separate rooms. |
| 26 | 363 -> 373 | A016 -> Staff toilet | A016 | A-F0-FAC-STAFF-TOILET | 373 - 363 = 10 | provisional | Staff toilet is a provisional transcription with unresolved access point. |
| 27 | 373 -> 393 | Staff toilet -> A/B/C block intersection | A-F0-FAC-STAFF-TOILET | A-F0-JUNC-ABC-REPORTED | 393 - 373 = 20 | provisional | Both records are provisional; cross-block endpoints are not established. |

The 27 differences sum to 393. No lift in this route is a vertical connector, and no staircase transition is inferred from a route description.

## 3. C-block measurements

The following records are from `KIIT_CAMPUS25_Navigation_System_Master_Team_Document_Updated.docx`, sections 8.1-8.3. The C-block PDF pages are cited in the location inventory for labeled rooms and lift metadata. Generic stairs, WC access, and composite office descriptions remain unresolved.

### Ground floor - section 8.1

| Record | Original endpoint descriptions | Proposed from | Proposed to | Weight | Status | Ambiguity |
|---:|---|---|---|---:|---|---|
| C-G1 | C-block entrance -> KIIT Cafe | null | C-F0-FAC-KIIT-CAFE | 55 | unresolved | No canonical C-block entrance ID is present. |
| C-G2 | C-block entrance -> Khel Kud area entrance | null | C-F0-FAC-KHEL-KUD | 22 | unresolved | No canonical C-block entrance ID is present. |
| C-G3 | Khel Kud area entrance -> C001 | C-F0-FAC-KHEL-KUD | C001 | 16 | unresolved | The source names the entrance, while the existing location is the general Khel Kud Area; equivalence is not proven. |
| C-G4 | C001 -> stairs | C001 | null | 9 | unresolved | Staircase identity is not established. |
| C-G5 | C001 -> Lift 15/16 | C001 | LIFT_C_15_16_F0 | 4 | confirmed | Horizontal access to lift metadata; no vertical connector. |
| C-G6 | Khel Kud area entrance -> Lift 17 | C-F0-FAC-KHEL-KUD | LIFT_C_17_F0 | 28 | unresolved | The source names the entrance, while the existing location is the general Khel Kud Area; equivalence is not proven. |
| C-G7 | Lift 17 -> Faculty Lounge | LIFT_C_17_F0 | C-F0-FAC-FACULTY-LOUNGE | 30 | confirmed | Horizontal access to lift metadata; no vertical connector. |
| C-G8 | Faculty Lounge -> Lift 20 | C-F0-FAC-FACULTY-LOUNGE | LIFT_C_20_F0 | 27 | confirmed | Horizontal access to lift metadata; no vertical connector. |
| C-G9 | Faculty Lounge -> C011 | C-F0-FAC-FACULTY-LOUNGE | C011 | 52 | confirmed | Both named locations are source-supported. |
| C-G10 | Faculty Lounge -> C013 | C-F0-FAC-FACULTY-LOUNGE | C013 | 52 | confirmed | Both named locations are source-supported. |
| C-G11 | Faculty Lounge -> C012 | C-F0-FAC-FACULTY-LOUNGE | C012 | 90 | confirmed | Both named locations are source-supported. |
| C-G12 | Faculty Lounge -> Lift 18/19 | C-F0-FAC-FACULTY-LOUNGE | LIFT_C_18_19_F0 | 32 | confirmed | Horizontal access to lift metadata; no vertical connector. |
| C-G13 | Faculty Lounge -> staircase | C-F0-FAC-FACULTY-LOUNGE | null | 24 | unresolved | Staircase identity is not established. |
| C-G14 | C012 -> male WC | C012 | null | 14 | unresolved | WC access point has no canonical location ID. |
| C-G15 | C012 -> female WC | C012 | null | 14 | unresolved | WC access point has no canonical location ID. |

### First floor - section 8.2

| Record | Original endpoint descriptions | Proposed from | Proposed to | Weight | Status | Ambiguity |
|---:|---|---|---|---:|---|---|
| C-F1 | Ground -> 1st staircase transition | null | null | 26 | unresolved | Floor-specific staircase endpoints are not identified. This is the fixed vertical convention, not a measured horizontal edge. |
| C-F2 | Stairs -> C104/105/106 office | null | null | 20 | unresolved | The source names a combined office endpoint and does not identify one canonical office node. |
| C-F3 | Office -> Conference | null | C-F1-FAC-CONFERENCE | 52 | unresolved | The source office endpoint is generic and the facility label is not map-position resolved. |
| C-F4 | Office -> Lift 20 | null | LIFT_C_20_F1 | 30 | unresolved | The source office endpoint is generic. |
| C-F5 | Office -> staircase | null | null | 34 | unresolved | Both the office and staircase identities are unresolved. |
| C-F6 | Office -> C101 | null | C101 | 65 | unresolved | The source office endpoint is generic. |
| C-F7 | Office -> Lift 18/19 | null | LIFT_C_18_19_F1 | 32 | unresolved | The source office endpoint is generic. |
| C-F8 | Office -> Lift 17 / Gallery | null | null | 25 | unresolved | Combined lift/gallery endpoint description cannot map to one node. |
| C-F9 | Office -> Cafeteria via stairs | null | C-F1-FAC-CAFETERIA | 25 | unresolved | Composite route and generic office/stair endpoints are unresolved. |
| C-F10 | C101 -> stairs | C101 | null | 9 | unresolved | Staircase identity is not established. |
| C-F11 | C101 -> Lift 15/16 | C101 | LIFT_C_15_16_F1 | 4 | confirmed | Horizontal access to lift metadata; no vertical connector. |

### Second floor - section 8.3

| Record | Original endpoint descriptions | Proposed from | Proposed to | Weight | Status | Ambiguity |
|---:|---|---|---|---:|---|---|
| C-S1 | Stair 1 -> C203 | null | C203 | 15 | unresolved | `Stair 1` has no canonical staircase ID. |
| C-S2 | C203 -> Lift 17 | C203 | LIFT_C_17_F2 | 20 | confirmed | Horizontal access to lift metadata; no vertical connector. |
| C-S3 | C203 -> Lift 18/19 | C203 | LIFT_C_18_19_F2 | 24 | confirmed | Horizontal access to lift metadata; no vertical connector. |
| C-S4 | C203 -> Lift 20 | C203 | LIFT_C_20_F2 | 16 | confirmed | Horizontal access to lift metadata; no vertical connector. |
| C-S5 | C203 -> C211 | C203 | C211 | 36 | confirmed | Both room labels are source-supported. |
| C-S6 | C203 -> C213 | C203 | C213 | 36 | confirmed | Both room labels are source-supported. |
| C-S7 | C211 -> C213 | C211 | C213 | 8 | confirmed | Both room labels are source-supported; corridor interpretation remains documented. |
| C-S8 | C213 -> Lift 20 | C213 | LIFT_C_20_F2 | 20 | confirmed | Horizontal access to lift metadata; no vertical connector. |
| C-S9 | Lift 17 -> Library entrance | LIFT_C_17_F2 | null | 40 | unresolved | The source says library entrance, while the location inventory has Library on Floor 3; floor-specific endpoint cannot be inferred. |
| C-S10 | Lift 17 -> C201 | LIFT_C_17_F2 | C201 | 45 | confirmed | Both named floor-2 locations are source-supported. |
| C-S11 | C201 -> stairs | C201 | null | 9 | unresolved | Staircase identity is not established. |
| C-S12 | C201 -> lift | C201 | null | 4 | unresolved | The lift label is generic and cannot be mapped to one lift record. |

## 4. Staircases, lifts, and cross-block boundaries

### Staircases

The source maps show staircase symbols, and the master document fixes every verified consecutive-floor staircase connector at 26 movement units. The available sources do not assign unique canonical IDs to every physical staircase or establish every floor correspondence. No staircase edge is proposed here.

The horizontal records to generic `staircase`, `stairs`, `Stair 1`, or `C-block stairs` remain unresolved. Their access-route weights must not be treated as 26-unit vertical edges.

### Lifts

All lift-related records above are horizontal access-to-location descriptions or metadata locations. No lift is a vertical Dijkstra connector. The four mapped C-block labels are represented in the location inventory on Floors 0-3, but this inventory creates no lift-to-lift or cross-floor lift edges.

### A/B/C cross-block connections

The A/B map shows entries from C block and the source route descriptions mention the A/B/C intersection. Exact canonical endpoints and a measured horizontal connection for each cross-block route are not jointly established. No cross-block edge is proposed.

## 5. Unresolved measurements and required evidence

The following records cannot currently map both endpoints to canonical location IDs:

- B-block records 5, 7, 13, 24, 25, and 30.
- B018 route steps 1, 2, and 10-23.
- C-block records C-G1, C-G2, C-G4, C-G13, C-G14, C-G15, C-F1-C-F10, C-S1, C-S9, C-S11, and C-S12.

The missing evidence is specific rather than numerical invention:

- Unique floor-specific staircase IDs and staircase correspondences.
- Distinct WC access-point IDs.
- Exact corridor junction IDs for combined route descriptions.
- Floor-specific library entrance identity.
- Exact A/B/C cross-block endpoints and measured horizontal routes.
- Confirmation of whether source-described composite routes should be decomposed into room-access and corridor-junction segments.

No edge in this document should be promoted to canonical `edges.json` without those endpoint and topology checks.
