# Graph Reconciliation Plan

Status: proposal only. This report does not create `data/edges.json` and does not implement Dijkstra.

## Source basis

The 95 records below are preserved from the inspected sources:

- B-block records 1-30: `KIIT_CAMPUS25_Navigation_System_Master_Team_Document_Updated.docx`, section 7.1.
- B018 cumulative steps 1-27: the same DOCX, section 7.2. Each difference is preserved as `end - start`; the final cumulative value is 393.
- C-block records C-G1 through C-G15: the same DOCX, section 8.1.
- C-block records C-F1 through C-F11: the same DOCX, section 8.2.
- C-block records C-S1 through C-S12: the same DOCX, section 8.3.
- A/B JPEG and all four C-block PDF pages were inspected for labels and mapped feature context. They do not establish unsupported corridor junction IDs or generic staircase identities.

A numeric measurement is source-supported below where the master document states it. That does not automatically make the row a direct graph edge. `Safe now` means safe to contribute as a canonical edge to `data/edges.json`; all rows are currently `NO` because the physical graph topology still requires reconciliation.

## Action meanings

- `READY_FOR_GRAPH`: both endpoints and the direct physical connection are source-supported. None is assigned at this stage.
- `NEEDS_CORRIDOR_NODE`: the measurement is valid, but a supported corridor/junction access node is required.
- `NEEDS_ENDPOINT_ID`: the source names an endpoint that has no canonical location ID.
- `COMPOSITE_ROUTE`: the source describes multiple route segments or combined locations and must be decomposed without changing its total weight.
- `HORIZONTAL_STAIR_ACCESS`: a horizontal route to a staircase description; it is not the 26-unit vertical transition.
- `METADATA_ONLY`: a lift or other UI location; it must not create a vertical graph edge.
- `UNRESOLVED`: source evidence is insufficient for a safe interpretation.

## 1. B-block measurements

Source for every row: master DOCX section 7.1. The A/B JPEG supports the room labels and mapped washrooms. Room-to-room measurements do not prove direct room-to-room graph edges.

| ID | Source-supported measurement | Action | Evidence and missing information | Safe now |
|---:|---|---|---|---|
| 1 | B018 -> B019 = 38 | NEEDS_CORRIDOR_NODE | Room labels are mapped; corridor access/junction decomposition is not supplied. | NO |
| 2 | B019 -> B020 = 14 | NEEDS_CORRIDOR_NODE | Room labels are mapped; direct room edge is not established. | NO |
| 3 | B020 -> B022 = 12 | NEEDS_CORRIDOR_NODE | Room labels are mapped; corridor route is not decomposed. | NO |
| 4 | B022 -> B021 = 13 | NEEDS_CORRIDOR_NODE | Room labels are mapped; direct room edge is not established. | NO |
| 5 | B021 -> staircase = 20 | HORIZONTAL_STAIR_ACCESS | Horizontal access weight is supported; physical staircase ID and floor endpoint are missing. | NO |
| 6 | B021 -> B001 = 34 | NEEDS_CORRIDOR_NODE | Room endpoints are mapped; the source does not explicitly identify a composite route, and corridor/junction topology is still required. | NO |
| 7 | B001 -> girls washroom = 20 | NEEDS_ENDPOINT_ID | Washroom is mapped, but the measured access point has no canonical location ID. | NO |
| 8 | B001 -> B002 = 21 | NEEDS_CORRIDOR_NODE | Room labels are mapped; direct room edge is not established. | NO |
| 9 | B002 -> B003 = 14 | NEEDS_CORRIDOR_NODE | Room labels are mapped; corridor access is not decomposed. | NO |
| 10 | B003 -> B004 = 8 | NEEDS_CORRIDOR_NODE | Room labels are mapped; direct room edge is not established. | NO |
| 11 | B002 -> B004 = 19 | NEEDS_CORRIDOR_NODE | Branch measurement is supported, but its corridor/junction endpoints are not identified. | NO |
| 12 | B004 -> B005 = 10 | NEEDS_CORRIDOR_NODE | Room labels are mapped; corridor access is not decomposed. | NO |
| 13 | B005 -> staircase = 18 | HORIZONTAL_STAIR_ACCESS | Horizontal access weight is supported; physical staircase ID is missing. | NO |
| 14 | B005 -> B006 = 40 | NEEDS_CORRIDOR_NODE | The source preserves 20 + 20 = 40, but the arithmetic alone does not identify intermediate graph nodes. | NO |
| 15 | B006 -> B007 = 18 | NEEDS_CORRIDOR_NODE | Room labels are mapped; direct room edge is not established. | NO |
| 16 | B006 -> B008 = 20 | NEEDS_CORRIDOR_NODE | Room labels are mapped; corridor access is not decomposed. | NO |
| 17 | B007 -> B009 = 18 | NEEDS_CORRIDOR_NODE | Room labels are mapped; direct room edge is not established. | NO |
| 18 | B007 -> B010 = 20 | NEEDS_CORRIDOR_NODE | Room labels are mapped; corridor access is not decomposed. | NO |
| 19 | B009 -> B016 = 15 | NEEDS_CORRIDOR_NODE | The source preserves 8 + 7 = 15, but the arithmetic alone does not identify intermediate graph nodes. | NO |
| 20 | B010 -> B016 = 12 | NEEDS_CORRIDOR_NODE | The source preserves 8 + 4 = 12, but the arithmetic alone does not identify intermediate graph nodes. | NO |
| 21 | B016 -> B017 = 12 | NEEDS_CORRIDOR_NODE | Room labels are mapped; direct room edge is not established. | NO |
| 22 | B017 -> B018 = 34 | NEEDS_CORRIDOR_NODE | The source preserves 2 + 32 = 34; room labels do not prove a direct edge or identify intermediate nodes. | NO |
| 23 | B016 -> B011 = 34 | NEEDS_CORRIDOR_NODE | Room labels are mapped; corridor route is not decomposed. | NO |
| 24 | B016 -> staircase = 28 | HORIZONTAL_STAIR_ACCESS | Horizontal access weight is supported; staircase identity is missing. | NO |
| 25 | B011 -> girls washroom = 14 | NEEDS_ENDPOINT_ID | Washroom is mapped, but the measured access point has no canonical location ID. | NO |
| 26 | B011 -> B012 = 25 | NEEDS_CORRIDOR_NODE | The source preserves 3 + 22 = 25; room-to-room wording is not a direct-edge guarantee. | NO |
| 27 | B012 -> B013 = 16 | NEEDS_CORRIDOR_NODE | The source preserves 2 + 14 = 16; corridor topology, not arithmetic alone, must determine the graph nodes. | NO |
| 28 | B013 -> B014 = 6 | NEEDS_CORRIDOR_NODE | The source preserves 2 + 4 = 6; corridor topology, not arithmetic alone, must determine the graph nodes. | NO |
| 29 | B014 -> B015 = 10 | NEEDS_CORRIDOR_NODE | The source preserves 2 + 8 = 10; corridor topology, not arithmetic alone, must determine the graph nodes. | NO |
| 30 | B015 -> staircase = 24 | HORIZONTAL_STAIR_ACCESS | Horizontal access weight is supported; staircase identity is missing. | NO |

## 2. B018 cumulative route

Source for every row: master DOCX section 7.2. The cumulative sequence is preserved exactly. The calculation shown is `end - start`.

| Step | Cumulative values and calculation | Action | Evidence and missing information | Safe now |
|---:|---|---|---|---|
| 1 | B018 -> C-block stairs; 0 -> 36; 36 - 0 = 36 | HORIZONTAL_STAIR_ACCESS | C-block stairs has no canonical staircase ID. | NO |
| 2 | C-block stairs -> Right A-block / staircase junction; 36 -> 74; 74 - 36 = 38 | NEEDS_ENDPOINT_ID | Stair endpoint is missing; right junction is only provisional. | NO |
| 3 | Right A-block / staircase junction -> A015; 74 -> 91; 91 - 74 = 17 | NEEDS_CORRIDOR_NODE | A015 exists, but the junction is a route description rather than a verified physical node. | NO |
| 4 | A015 -> A014; 91 -> 103; 103 - 91 = 12 | NEEDS_CORRIDOR_NODE | Room labels and value are supported; direct room-to-room interpretation is not. | NO |
| 5 | A014 -> Left A-block junction; 103 -> 115; 115 - 103 = 12 | NEEDS_CORRIDOR_NODE | Left junction is provisional and needs map-backed identity. | NO |
| 6 | Left A-block junction -> Right B-block / staircase junction; 115 -> 138; 138 - 115 = 23 | NEEDS_CORRIDOR_NODE | Both route positions are provisional; staircase correspondence is missing. | NO |
| 7 | Right B-block / staircase junction -> A013 / A012 corridor position; 138 -> 145; 145 - 138 = 7 | NEEDS_CORRIDOR_NODE | Corridor position is provisional; A013 and A012 remain separate rooms. | NO |
| 8 | A013 / A012 corridor position -> A011; 145 -> 163; 163 - 145 = 18 | NEEDS_CORRIDOR_NODE | Existing corridor-position record is provisional. | NO |
| 9 | A011 -> Left route toward A-block exit; 163 -> 193; 193 - 163 = 30 | NEEDS_ENDPOINT_ID | The route position is not a confirmed entrance/exit node; the source does not describe multiple physical segments. | NO |
| 10 | Left route toward A-block exit -> Front toward gents washroom; 193 -> 208; 208 - 193 = 15 | NEEDS_ENDPOINT_ID | Both descriptions are route positions without canonical facility/junction IDs. | NO |
| 11 | Front toward gents washroom -> A010 / A009 corridor position; 208 -> 213; 213 - 208 = 5 | NEEDS_ENDPOINT_ID | Combined corridor position has no canonical ID. | NO |
| 12 | A010 / A009 corridor position -> A008 / A007 corridor position; 213 -> 231; 231 - 213 = 18 | NEEDS_ENDPOINT_ID | Neither combined corridor position has a canonical ID. | NO |
| 13 | A008 / A007 corridor position -> Lift 4 location; 231 -> 237; 237 - 231 = 6 | METADATA_ONLY | Horizontal access evidence is preserved; Lift 4 is provisional UI metadata and must not be a vertical Dijkstra connector; the corridor position is unmapped. | NO |
| 14 | Lift 4 location -> A006 / left staircase; 237 -> 249; 249 - 237 = 12 | HORIZONTAL_STAIR_ACCESS | Combined A006/staircase endpoint is not one canonical node; Lift 4 is metadata-only. | NO |
| 15 | A006 / left staircase -> Ladies washroom / A-block exit; 249 -> 253; 253 - 249 = 4 | COMPOSITE_ROUTE | Both descriptions combine multiple physical locations. | NO |
| 16 | Ladies washroom / A-block exit -> Lift 3 / A005 area; 253 -> 268; 268 - 253 = 15 | COMPOSITE_ROUTE | Combined facility/exit and lift/room descriptions require decomposition. | NO |
| 17 | Lift 3 / A005 area -> IoT lab / A004; 268 -> 287; 287 - 268 = 19 | COMPOSITE_ROUTE | Both endpoints combine multiple locations; IoT lab is provisional. | NO |
| 18 | IoT lab / A004 -> Project lab / A003; 287 -> 299; 299 - 287 = 12 | COMPOSITE_ROUTE | Combined facility/room endpoints require decomposition. | NO |
| 19 | Project lab / A003 -> Research lab / A002; 299 -> 304; 304 - 299 = 5 | COMPOSITE_ROUTE | Combined facility/room endpoints require decomposition. | NO |
| 20 | Research lab / A002 -> Lift 2 / A001 area; 304 -> 311; 311 - 304 = 7 | COMPOSITE_ROUTE | Combined facility/room and lift/room endpoints require decomposition. | NO |
| 21 | Lift 2 / A001 area -> Left staircase; 311 -> 320; 320 - 311 = 9 | HORIZONTAL_STAIR_ACCESS | Staircase identity is missing; Lift 2 is metadata-only and must not be a vertical Dijkstra connector. | NO |
| 22 | Left staircase -> Lift 1 / A-block exit; 320 -> 330; 330 - 320 = 10 | COMPOSITE_ROUTE | Both endpoints are generic route descriptions; Lift 1 is provisional metadata. | NO |
| 23 | Lift 1 / A-block exit -> Gents washroom; 330 -> 346; 346 - 330 = 16 | COMPOSITE_ROUTE | First endpoint combines lift and exit; it is not a single canonical node. | NO |
| 24 | Gents washroom -> A018 / A017 corridor position; 346 -> 351; 351 - 346 = 5 | NEEDS_CORRIDOR_NODE | Corridor position is provisional; A018 and A017 stay separate. | NO |
| 25 | A018 / A017 corridor position -> A016; 351 -> 363; 363 - 351 = 12 | NEEDS_CORRIDOR_NODE | Corridor position is provisional. | NO |
| 26 | A016 -> Staff toilet; 363 -> 373; 373 - 363 = 10 | NEEDS_ENDPOINT_ID | Staff toilet is provisional and its access point is unresolved; the source does not describe multiple segments. | NO |
| 27 | Staff toilet -> A/B/C block intersection; 373 -> 393; 393 - 373 = 20 | NEEDS_ENDPOINT_ID | Staff toilet and the cross-block intersection are not fully identified; no cross-block link is inferred. | NO |

The 27 differences sum to 393. No staircase transition is inferred from this route, and no lift becomes a vertical connector.

## 3. C-block measurements

Sources: master DOCX sections 8.1-8.3 and the four-page C-block PDF. The PDF supports visible labels and facilities; generic entrances, offices, stairs, WC access, and library entrance identities remain unresolved where no matching canonical ID exists.

| ID | Source-supported measurement | Action | Evidence and missing information | Safe now |
|---|---|---|---|---|
| C-G1 | C-block entrance -> KIIT Cafe = 55 | NEEDS_ENDPOINT_ID | Cafe is mapped on PDF page 1; C-block entrance lacks a canonical ID. | NO |
| C-G2 | C-block entrance -> Khel Kud area entrance = 22 | NEEDS_ENDPOINT_ID | Khel Kud area is mapped on page 1; entrance endpoint lacks a canonical ID. | NO |
| C-G3 | Khel Kud area entrance -> C001 = 16 | NEEDS_ENDPOINT_ID | “Khel Kud area entrance” is not proven identical to `C-F0-FAC-KHEL-KUD`; no new ID may be invented. | NO |
| C-G4 | C001 -> stairs = 9 | HORIZONTAL_STAIR_ACCESS | Staircase identity is not established. | NO |
| C-G5 | C001 -> Lift 15/16 = 4 | METADATA_ONLY | Horizontal access evidence is preserved; Lift 15/16 is UI metadata and must not be a vertical Dijkstra connector. | NO |
| C-G6 | Khel Kud area entrance -> Lift 17 = 28 | NEEDS_ENDPOINT_ID | Entrance endpoint is ambiguous; Lift 17 is metadata-only. | NO |
| C-G7 | Lift 17 -> Faculty Lounge = 30 | METADATA_ONLY | Horizontal access evidence is preserved; Lift 17 is UI metadata and must not be a vertical Dijkstra connector. | NO |
| C-G8 | Faculty Lounge -> Lift 20 = 27 | METADATA_ONLY | Horizontal access evidence is preserved; Lift 20 is UI metadata and must not be a vertical Dijkstra connector. | NO |
| C-G9 | Faculty Lounge -> C011 = 52 | NEEDS_CORRIDOR_NODE | Named endpoints are source-supported on page 1, but the source does not expose the intervening access topology. | NO |
| C-G10 | Faculty Lounge -> C013 = 52 | NEEDS_CORRIDOR_NODE | Named endpoints are source-supported; corridor/access decomposition is missing. | NO |
| C-G11 | Faculty Lounge -> C012 = 90 | NEEDS_CORRIDOR_NODE | Named endpoints are source-supported; corridor/access decomposition is missing. | NO |
| C-G12 | Faculty Lounge -> Lift 18/19 = 32 | METADATA_ONLY | Horizontal access evidence is preserved; Lifts 18/19 are UI metadata and must not be vertical Dijkstra connectors. | NO |
| C-G13 | Faculty Lounge -> staircase = 24 | HORIZONTAL_STAIR_ACCESS | Generic staircase identity is missing. | NO |
| C-G14 | C012 -> male WC = 14 | NEEDS_ENDPOINT_ID | WC access point lacks a canonical location ID. | NO |
| C-G15 | C012 -> female WC = 14 | NEEDS_ENDPOINT_ID | WC access point lacks a canonical location ID. | NO |
| C-F1 | Ground -> 1st staircase transition = 26 | UNRESOLVED | The 26-unit vertical convention is preserved, but both floor-specific staircase endpoints are missing; no vertical edge is created. | NO |
| C-F2 | Stairs -> C104/105/106 office = 20 | COMPOSITE_ROUTE | Combined office endpoint and generic stairs must be decomposed. | NO |
| C-F3 | Office -> Conference = 52 | NEEDS_ENDPOINT_ID | Generic office endpoint and exact Conference location are not jointly established. | NO |
| C-F4 | Office -> Lift 20 = 30 | METADATA_ONLY | Horizontal access evidence is preserved; Office is generic, and Lift 20 is UI metadata, never a vertical Dijkstra connector. | NO |
| C-F5 | Office -> staircase = 34 | HORIZONTAL_STAIR_ACCESS | Generic office and staircase endpoints are unresolved. | NO |
| C-F6 | Office -> C101 = 65 | NEEDS_ENDPOINT_ID | Generic office endpoint lacks a canonical ID. | NO |
| C-F7 | Office -> Lift 18/19 = 32 | METADATA_ONLY | Horizontal access evidence is preserved; Office is generic, and Lifts 18/19 are UI metadata, never vertical Dijkstra connectors. | NO |
| C-F8 | Office -> Lift 17 / Gallery = 25 | COMPOSITE_ROUTE | Combined lift/gallery endpoint cannot map to one location. | NO |
| C-F9 | Office -> Cafeteria via stairs = 25 | COMPOSITE_ROUTE | Composite route; office and stair endpoints unresolved. | NO |
| C-F10 | C101 -> stairs = 9 | HORIZONTAL_STAIR_ACCESS | Staircase identity is missing. | NO |
| C-F11 | C101 -> Lift 15/16 = 4 | METADATA_ONLY | Horizontal access evidence is preserved; Lifts 15/16 are UI metadata and must not be vertical Dijkstra connectors. | NO |
| C-S1 | Stair 1 -> C203 = 15 | HORIZONTAL_STAIR_ACCESS | `Stair 1` has no canonical staircase ID. | NO |
| C-S2 | C203 -> Lift 17 = 20 | METADATA_ONLY | Horizontal access evidence is preserved; Lift 17 is UI metadata and must not be a vertical Dijkstra connector. | NO |
| C-S3 | C203 -> Lift 18/19 = 24 | METADATA_ONLY | Horizontal access evidence is preserved; Lifts 18/19 are UI metadata and must not be vertical Dijkstra connectors. | NO |
| C-S4 | C203 -> Lift 20 = 16 | METADATA_ONLY | Horizontal access evidence is preserved; Lift 20 is UI metadata and must not be a vertical Dijkstra connector. | NO |
| C-S5 | C203 -> C211 = 36 | NEEDS_CORRIDOR_NODE | Room labels and value are supported on page 3/section 8.3, but direct room edge is not established. | NO |
| C-S6 | C203 -> C213 = 36 | NEEDS_CORRIDOR_NODE | Room labels and value are supported; corridor topology is not supplied. | NO |
| C-S7 | C211 -> C213 = 8 | NEEDS_CORRIDOR_NODE | Room labels and value are supported; direct room edge is not established. | NO |
| C-S8 | C213 -> Lift 20 = 20 | METADATA_ONLY | Horizontal access evidence is preserved; Lift 20 is UI metadata and must not be a vertical Dijkstra connector. | NO |
| C-S9 | Lift 17 -> Library entrance = 40 | NEEDS_ENDPOINT_ID | Source says “Library entrance”; the available location record is Floor 3 Library, so the exact entrance endpoint is unresolved. | NO |
| C-S10 | Lift 17 -> C201 = 45 | NEEDS_CORRIDOR_NODE | Named endpoints are supported on page 3, but the access topology is not explicit. | NO |
| C-S11 | C201 -> stairs = 9 | HORIZONTAL_STAIR_ACCESS | Staircase identity is missing. | NO |
| C-S12 | C201 -> lift = 4 | METADATA_ONLY | Generic lift identity is unresolved; any lift is UI metadata and must not be a vertical Dijkstra connector. | NO |

## 4. Cross-block and staircase boundary

No A/B/C cross-block record is classified as ready. The A/B map shows C-block entries and the B018 route ends at an A/B/C intersection, but exact canonical endpoints and measured cross-block routes are not jointly established.

The only permitted vertical staircase weight is 26 movement units, and only after both physical staircase endpoints and consecutive floors are source-supported. No such vertical edge is proposed here.

## Validation

- Records covered: **95** (`30 + 27 + 38`)
- Duplicate record IDs: **none**
- Unsupported direct graph connections claimed: **none**
- Numeric values preserved: **yes**
- B018 cumulative values and differences preserved: **yes; final total 393**
- `data/edges.json` created: **no**
- Dijkstra implemented: **no**
