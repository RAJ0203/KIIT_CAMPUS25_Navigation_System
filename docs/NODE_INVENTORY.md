# Node Inventory

Status: evidence-bounded preliminary inventory. This document establishes proposed graph-relevant node identities without creating canonical graph JSON.

## Accessible source evidence

The following workspace files were inspected:

- `README.md`: contains only the project title.
- `docs/MEASUREMENT_RECONCILIATION.md`: contains prior transcribed B-block measurements, the B018 route transcription, and descriptive route landmarks.
- `docs/source/WhatsApp Image 2026-10-03 at 11.59.07.jpeg`: A/B ground-floor map image.
- `docs/source/C- Block Map_261003_142107.pdf`, pages 1-4: C-block ground, first, second, and third-floor map pages.
- `docs/source/KIIT_CAMPUS25_Navigation_System_Master_Team_Document_Updated.docx`, sections 2, 5-8, and 10: graph rules, measurements, floor conventions, and canonical schema.

The original raw field notes are not present. The Master Team Coordination Document is present and is used for the source citations below. Items supported directly by the JPEG or PDF maps are marked `source-confirmed`; items supported only by the reconciliation transcription are marked `provisional-transcription`; items that cannot be uniquely established are marked `unresolved`.

## Status definitions

- **source-confirmed**: supported by an inspected map or the Master Team Coordination Document.
- **provisional-transcription**: label or description appears in the accessible reconciliation artifact but still requires authoritative source reconciliation.
- **unresolved**: a node or identity is required or described, but its exact label, physical identity, endpoint, or count cannot be established from accessible evidence.

## Node categories and rules

- `room`: a distinct classroom or mapped room.
- `corridor_junction`: a meaningful corridor intersection or route position.
- `corridor_turn`: a meaningful corridor turn.
- `entrance_exit`: an entrance or exit node when its source label and physical position are known.
- `facility`: a mapped destination such as a washroom, laboratory, or toilet.
- `stair_access`: a floor-specific staircase access point. Different physical staircases must not be merged because they share a description.
- `lift_metadata`: a UI/location record only. It is not a vertical routing connector.

Node IDs below are stable proposed formats, not canonical IDs. No distances, coordinates, or edges are defined here.

## 1. A-block ground-floor rooms

The following labels are visible on the inspected A/B ground-floor map. They are distinct room nodes on Floor 0; their corridor access still requires topology verification.

| Proposed node ID | Display label | Block | Floor | Category | Status | Source/evidence note |
|---|---|---|---:|---|---|---|
| `A001` | A001 | A | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `A002` | A002 | A | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `A003` | A003 | A | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `A004` | A004 | A | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `A005` | A005 | A | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `A006` | A006 | A | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `A007` | A007 | A | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `A008` | A008 | A | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `A009` | A009 | A | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `A010` | A010 | A | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `A011` | A011 | A | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `A012` | A012 | A | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `A013` | A013 | A | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `A014` | A014 | A | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `A015` | A015 | A | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `A016` | A016 | A | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `A017` | A017 | A | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `A018` | A018 | A | 0 | room | source-confirmed | A/B ground-floor map JPEG |

A012 and A013 remain separate nodes. No direct room-to-room edge is implied between them.

## 2. B-block ground-floor rooms

The following labels are visible on the inspected A/B ground-floor map. They are distinct room nodes on Floor 0; their corridor access still requires topology verification.

| Proposed node ID | Display label | Block | Floor | Category | Status | Source/evidence note |
|---|---|---|---:|---|---|---|
| `B001` | B001 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `B002` | B002 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `B003` | B003 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `B004` | B004 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `B005` | B005 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `B006` | B006 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `B007` | B007 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `B008` | B008 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `B009` | B009 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `B010` | B010 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `B011` | B011 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `B012` | B012 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `B013` | B013 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `B014` | B014 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `B015` | B015 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `B016` | B016 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `B017` | B017 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `B018` | B018 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG; Master section 7.1 |
| `B019` | B019 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `B020` | B020 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `B021` | B021 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |
| `B022` | B022 | B | 0 | room | source-confirmed | A/B ground-floor map JPEG |

No B-block room measurement is treated as proof of a direct room-to-room graph edge.

## 3. A/B facilities and route landmarks

These entries are descriptive transcriptions from the accessible reconciliation artifact. They are not map-confirmed node identities.

| Proposed node ID | Display label | Block | Floor | Category | Status | Source/evidence note |
|---|---|---|---:|---|---|---|
| `A-F0-FAC-IOT-LAB` | IoT lab | A | 0 | facility | provisional-transcription | Mentioned in B018 route description; exact map label pending |
| `A-F0-FAC-PROJECT-LAB` | Project lab | A | 0 | facility | provisional-transcription | Mentioned in B018 route description; exact map label pending |
| `A-F0-FAC-RESEARCH-LAB` | Research lab | A | 0 | facility | provisional-transcription | Mentioned in B018 route description; exact map label pending |
| `A-F0-FAC-LADIES-WASHROOM` | Ladies' washroom | A | 0 | facility | source-confirmed | A/B ground-floor map JPEG; access point still requires topology mapping |
| `A-F0-FAC-GENTS-WASHROOM` | Gents' washroom | A | 0 | facility | source-confirmed | A/B ground-floor map JPEG; access point still requires topology mapping |
| `A-F0-FAC-STAFF-TOILET` | Staff toilet | A | 0 | facility | provisional-transcription | Mentioned in B018 route description; exact access point pending |
| `B-F0-FAC-GIRLS-WASHROOM` | Girls' washroom | B | 0 | facility | source-confirmed | A/B ground-floor map JPEG; access point still requires topology mapping |
| `A-F0-LIFT-01` | Lift 1 | A | 0 | lift_metadata | provisional-transcription | Mentioned in B018 route description; metadata only |
| `A-F0-LIFT-02` | Lift 2 | A | 0 | lift_metadata | provisional-transcription | Mentioned in B018 route description; metadata only |
| `A-F0-LIFT-03` | Lift 3 | A | 0 | lift_metadata | provisional-transcription | Mentioned in B018 route description; metadata only |
| `A-F0-LIFT-04` | Lift 4 | A | 0 | lift_metadata | provisional-transcription | Mentioned in B018 route description; metadata only |

Lift entries above must not receive vertical graph edges.

### A/B ground-floor entrances

| Proposed node ID | Display label | Block | Floor | Category | Status | Source/evidence note |
|---|---|---|---:|---|---|---|
| `ENTRY_A` | A-block entry | A | 0 | entrance_exit | source-confirmed | A/B ground-floor map JPEG |
| `ENTRY_A_FROM_C` | Entry from C block to A area | A/C | 0 | entrance_exit | source-confirmed | A/B ground-floor map JPEG; exact graph endpoints pending |
| `ENTRY_B` | B-block entry | B | 0 | entrance_exit | source-confirmed | A/B ground-floor map JPEG |
| `ENTRY_B_FROM_C` | Entry from C block to B area | B/C | 0 | entrance_exit | source-confirmed | A/B ground-floor map JPEG; exact graph endpoints pending |

## 4. C-block map-supported rooms and facilities

These labels were read from the four-page C-block PDF. Page numbers refer to `C- Block Map_261003_142107.pdf`.

| Proposed node ID | Display label | Block | Floor | Category | Status | Source/evidence note |
|---|---|---|---:|---|---|---|
| `C001` | C001 | C | 0 | room | source-confirmed | C-block map, page 1 |
| `C008` | C008 | C | 0 | room | source-confirmed | C-block map, page 1 |
| `C011` | C011 | C | 0 | room | source-confirmed | C-block map, page 1 |
| `C012` | C012 | C | 0 | room | source-confirmed | C-block map, page 1 |
| `C013` | C013 | C | 0 | room | source-confirmed | C-block map, page 1 |
| `C101` | C101 | C | 1 | room | source-confirmed | C-block map, page 2 |
| `C108` | C108 | C | 1 | room | source-confirmed | C-block map, page 2 |
| `C201` | C201 | C | 2 | room | source-confirmed | C-block map, page 3 |
| `C203` | C203 | C | 2 | room | source-confirmed | C-block map, page 2 |
| `C208` | C208 | C | 2 | room | source-confirmed | C-block map, page 3 |
| `C211` | C211 | C | 2 | room | source-confirmed | C-block map, page 2 |
| `C213` | C213 | C | 2 | room | source-confirmed | C-block map, page 2 |
| `C301` | C301 | C | 3 | room | source-confirmed | C-block map, page 4 |
| `C303` | C303 | C | 3 | room | source-confirmed | C-block map, page 3 |
| `C308` | C308 | C | 3 | room | source-confirmed | C-block map, page 4 |
| `C312` | C312 | C | 3 | room | source-confirmed | C-block map, page 3 |
| `C-F0-FAC-KIIT-CAFE` | KIIT Cafe | C | 0 | facility | source-confirmed | C-block map, page 1 |
| `C-F0-FAC-KHEL-KUD` | Khel Kud Area | C | 0 | facility | source-confirmed | C-block map, page 1 |
| `C-F0-FAC-FACULTY-LOUNGE` | Faculty Lounge | C | 0 | facility | source-confirmed | C-block map, page 1 |
| `C-F0-FAC-DG-OFFICE` | DG Office | C | 0 | facility | source-confirmed | C-block map, page 1 |
| `C-F0-FAC-CONFERENCE-HALL` | Conference Hall | C | 0 | facility | source-confirmed | C-block map, page 1 |
| `C-F0-FAC-C-BLOCK-LOBBY` | C Block Lobby | C | 0 | facility | source-confirmed | C-block map, page 1 |
| `C-F1-FAC-OFFICE-104` | C104 office | C | 1 | facility | source-confirmed | Master section 8.2; exact map placement pending |
| `C-F1-FAC-OFFICE-105` | C105 office | C | 1 | facility | source-confirmed | Master section 8.2; exact map placement pending |
| `C-F1-FAC-OFFICE-106` | C106 office | C | 1 | facility | source-confirmed | Master section 8.2; exact map placement pending |
| `C-F1-FAC-CONFERENCE` | Conference | C | 1 | facility | source-confirmed | Master section 8.2; exact map label/placement pending |
| `C-F1-FAC-GALLERY` | Gallery | C | 1 | facility | source-confirmed | Master section 8.2; exact map label/placement pending |
| `C-F1-FAC-CAFETERIA` | Cafeteria | C | 1 | facility | source-confirmed | Master section 8.2; exact map label/placement pending |
| `C-F3-FAC-LIBRARY` | Library | C | 3 | facility | source-confirmed | C-block map, pages 3-4 |
| `LIFT_C_15_16` | Lifts 15/16 | C | 0-3 | lift_metadata | source-confirmed | C-block map, pages 1-4; metadata only |
| `LIFT_C_17` | Lift 17 | C | 0-3 | lift_metadata | source-confirmed | C-block map, pages 1-4; metadata only |
| `LIFT_C_18_19` | Lifts 18/19 | C | 0-3 | lift_metadata | source-confirmed | C-block map, pages 1-4; metadata only |
| `LIFT_C_20` | Lift 20 | C | 0-3 | lift_metadata | source-confirmed | C-block map, pages 1-4; metadata only |

The PDF visibly marks washrooms/WCs, stairs, and floor-to-floor access, but it does not provide unique canonical IDs for every physical staircase or every WC access point. Those remain unresolved below.

## 5. Provisional corridor and junction landmarks

The reconciliation artifact describes these route positions, but does not establish exact physical junction IDs or coordinates. They are provisional descriptive nodes only.

| Proposed node ID | Display label | Block | Floor | Category | Status | Source/evidence note |
|---|---|---|---:|---|---|---|
| `A-F0-JUNC-RIGHT-REPORTED` | Right A-block junction | A | 0 | corridor_junction | provisional-transcription | B018 route description; exact position pending |
| `A-F0-JUNC-LEFT-REPORTED` | Left A-block junction | A | 0 | corridor_junction | provisional-transcription | B018 route description; exact position pending |
| `A-F0-JUNC-A013-A012-REPORTED` | A013/A012 corridor position | A | 0 | corridor_junction | provisional-transcription | Opposite-room corridor position; exact junction pending |
| `A-F0-JUNC-A018-A017-REPORTED` | A018/A017 corridor position | A | 0 | corridor_junction | provisional-transcription | Opposite-room corridor position; exact junction pending |
| `B-F0-JUNC-REPORTED` | B-block junction | B | 0 | corridor_junction | provisional-transcription | B018 route description; exact position pending |
| `A-F0-EXIT-REPORTED` | A-block exit route position | A | 0 | entrance_exit | provisional-transcription | B018 route description; exact exit label pending |
| `A-F0-JUNC-ABC-REPORTED` | A/B/C intersection | A/B/C | 0 | corridor_junction | provisional-transcription | B018 route endpoint description; exact endpoints pending |

These rows do not establish a junction count. Additional corridor branches and turns must be extracted from authoritative maps and measurements.

## 6. Staircase access inventory

The accessible reconciliation artifact reports several staircase-access descriptions but does not provide unique canonical staircase IDs or enough map evidence to distinguish all physical staircases. The following are unresolved placeholders, not asserted physical identities.

| Proposed node ID | Display label | Block | Floor | Category | Status | Required evidence |
|---|---|---|---:|---|---|---|
| `B-F0-STAIR-UNRESOLVED-01` | Staircase access from B021 record | B | 0 | stair_access | unresolved | Exact staircase identity and map endpoint |
| `B-F0-STAIR-UNRESOLVED-02` | Staircase access from B005 record | B | 0 | stair_access | unresolved | Exact staircase identity and map endpoint |
| `B-F0-STAIR-UNRESOLVED-03` | Staircase access from B016 record | B | 0 | stair_access | unresolved | Exact staircase identity and map endpoint |
| `B-F0-STAIR-UNRESOLVED-04` | Staircase access from B015 record | B | 0 | stair_access | unresolved | Exact staircase identity and map endpoint |
| `A-F0-STAIR-UNRESOLVED` | A-block staircase access | A | 0 | stair_access | unresolved | Number and identity of each physical staircase |
| `C-F0-STAIR-UNRESOLVED` | C-block staircase access | C | 0 | stair_access | unresolved | Exact C-block staircase label and endpoint |

The four B-block rows preserve separate measurement occurrences. They must not be merged or treated as four confirmed physical staircases without map reconciliation. Floor-specific staircase nodes for Floors 1-3 cannot be created from the accessible evidence.

## 7. C-block inventory boundary

The labeled C-block rooms, named facilities, and lift metadata listed above are supported by the inspected four-page PDF. The map also shows additional washrooms/WCs, stairs, and route/access marks whose exact labels or distinct physical identities are not established by the accessible source. Those remain unresolved rather than being assigned guessed IDs.

C block retains its separate facility layout. No A/B-style classroom structure is inferred for unlabeled C-block spaces.

## 8. Floor-by-floor inventory status

| Block | Floor | Accessible room labels | Accessible facilities/landmarks | Status |
|---|---:|---|---|---|
| A | 0 | A001-A018 | A/B route-described facilities and landmarks listed above | Source-confirmed room labels; access topology unresolved |
| A | 1 | None accessible | None accessible | Unresolved; do not duplicate Floor 0 |
| A | 2 | None accessible | None accessible | Unresolved; do not duplicate Floor 0 |
| A | 3 | None accessible | None accessible | Unresolved; do not duplicate Floor 0 |
| B | 0 | B001-B022 | B-block girls' washroom description and route landmarks | Source-confirmed room labels; access topology unresolved |
| B | 1 | None accessible | None accessible | Unresolved; do not duplicate Floor 0 |
| B | 2 | None accessible | None accessible | Unresolved; do not duplicate Floor 0 |
| B | 3 | None accessible | None accessible | Unresolved; do not duplicate Floor 0 |
| C | 0 | C001, C008, C011, C012, C013 | KIIT Cafe, Khel Kud Area, Faculty Lounge, DG Office, Conference Hall, C Block Lobby, lifts | Source-confirmed labels; WC/stair access identities unresolved |
| C | 1 | C101, C108 | Lifts and stairs shown; exact facility labels unresolved | Source-confirmed labels; access topology unresolved |
| C | 2 | C201, C203, C208, C211, C213 | Lifts and WCs shown; exact facility/access IDs unresolved | Source-confirmed labels; access topology unresolved |
| C | 3 | C301, C303, C308, C312 | Library and lifts shown; exact staircase/access IDs unresolved | Source-confirmed labels; access topology unresolved |

A/B topology repetition across Floors 0-3 is recorded in the reconciliation artifact as project-owner information, but it does not establish floor-specific room labels, staircase endpoints, or facility nodes.

## 9. Unresolved items

The following cannot be established from accessible workspace evidence:

- Authoritative A/B floor maps and exact room placement.
- Floor-specific A/B room IDs for Floors 1-3.
- Exact corridor junction and turn positions.
- Exact room access points and corridor connections.
- Main entrance labels and physical endpoints.
- Complete exit labels and physical endpoints.
- Distinct identity of every A-block staircase on Floor 0.
- Distinct identity of every B-block staircase on Floor 0 beyond unresolved measurement occurrences.
- C-block staircase identity and floor correspondences.
- The inspected maps show staircase symbols but do not provide a unique canonical label for every physical staircase; each symbol must be separately indexed from the map before a staircase ID is accepted.
- Staircase access identities for Floors 1-3.
- A-side and C-side endpoints of cross-block entries.
- B-side and C-side endpoints of cross-block entries near B018.
- C-block room and facility labels on Floors 0-3.
- Whether described laboratories and facilities are exact map labels or route shorthand.
- Whether any lift label is associated with A, B, or C block from an authoritative map.
- Whether the route transcription labels `Lift 1`-`Lift 4` refer to the C-block map labels `Lift 15/16`, `Lift 17`, `Lift 18/19`, or `Lift 20`; they must not be merged without evidence.
- Coordinates for any node.
- Any edge weights or canonical graph connections.

The Master document's schema examples use source-style IDs such as `B018`, `J_A_01`, `ENTRY_C`, and `STAIR_C_F0`. The room IDs above now follow the source labels; proposed junction, entrance, and staircase IDs remain provisional until the team reconciles them with the master naming contract.

## Acceptance boundary

This inventory is a structured proposal based only on accessible workspace evidence. `provisional-transcription` does not mean map-verified, and `unresolved` rows are placeholders rather than confirmed physical nodes. No distance weights, final graph edges, vertical lift connectors, or Dijkstra implementation are included.
