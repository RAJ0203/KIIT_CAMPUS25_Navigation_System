# Measurement Reconciliation

Status: provisional Phase 3 measured-edge inventory.

This document preserves prior measurement transcriptions and the source-backed records read from `docs/source/KIIT_CAMPUS25_Navigation_System_Master_Team_Document_Updated.docx`. The original raw field notes are not present in the workspace. Values cited to the Master Team Coordination Document are verified against that document, but not against unavailable raw field notes.

## Verification status

The following statuses are used throughout this document:

- **Source-transcribed**: reported in the supplied Phase 3 transcription.
- **Arithmetically checked**: arithmetic was checked from the supplied values only.
- **Map-verified**: endpoint identity and physical topology have been checked against an authoritative map. Measurement records may have source-backed endpoints while still requiring graph-topology reconciliation.
- **Canonically accepted**: approved for the final graph schema and data set. No measurement record in this document currently has this status.
- **Pending reconciliation**: requires the original master document, raw notes, and/or physical map before acceptance.

## Fixed graph rules

- Horizontal edge weight equals the measured tile count.
- One tile equals one movement unit.
- Every verified staircase connecting consecutive floors costs exactly 26 movement units.
- Lifts are metadata/UI locations only and must not create vertical graph edges.
- Opposite A/B classrooms remain separate room nodes and connect through corridor or junction nodes.
- A measurement does not automatically imply a direct room-to-room graph edge. Physical corridor topology must determine the canonical graph endpoints.
- A/B topology repeats across Floors 0-3, but floor-specific endpoints require verification.
- C block follows its separate mapped facility layout.
- No Dijkstra implementation or final `edges.json`, `locations.json`, or `floors.json` is created by this artifact.

## 1. Provisional B-block horizontal measurements

These are the 30 reported B-block ground-floor records. Values are preserved exactly as supplied. The values and normalization wording match section 7.1, `B-block measured network`, of `docs/source/KIIT_CAMPUS25_Navigation_System_Master_Team_Document_Updated.docx`. The endpoint descriptions are not canonical node IDs, and room-to-room descriptions do not automatically become direct graph edges.

| Record | Reported endpoints | Reported weight (movement units) | Verification status | Reconciliation note |
|---:|---|---:|---|---|
| 1 | B018 — B019 | 38 | Source-transcribed; pending reconciliation | Map/topology verification pending |
| 2 | B019 — B020 | 14 | Source-transcribed; pending reconciliation | Map/topology verification pending |
| 3 | B020 — B022 | 12 | Source-transcribed; pending reconciliation | Map/topology verification pending |
| 4 | B022 — B021 | 13 | Source-transcribed; pending reconciliation | Map/topology verification pending |
| 5 | B021 — staircase access | 20 | Source-transcribed; pending reconciliation | Staircase identity and endpoint are unresolved |
| 6 | B021 — B001 | 34 | Source-transcribed; pending reconciliation | May represent a composite corridor route |
| 7 | B001 — girls' washroom access | 20 | Source-transcribed; pending reconciliation | Facility/access-point identity is unresolved |
| 8 | B001 — B002 | 21 | Source-transcribed; pending reconciliation | May represent a composite corridor route |
| 9 | B002 — B003 | 14 | Source-transcribed; pending reconciliation | May represent a composite corridor route |
| 10 | B003 — B004 | 8 | Source-transcribed; pending reconciliation | May represent a composite corridor route |
| 11 | B002 — B004 | 19 | Source-transcribed; pending reconciliation | May represent a composite corridor route |
| 12 | B004 — B005 | 10 | Source-transcribed; pending reconciliation | May represent a composite corridor route |
| 13 | B005 — staircase access | 18 | Source-transcribed; pending reconciliation | Staircase identity and endpoint are unresolved |
| 14 | B005 — B006 | 40 | Source-transcribed; pending reconciliation | May represent a composite corridor route |
| 15 | B006 — B007 | 18 | Source-transcribed; pending reconciliation | May represent a composite corridor route |
| 16 | B006 — B008 | 20 | Source-transcribed; pending reconciliation | May represent a composite corridor route |
| 17 | B007 — B009 | 18 | Source-transcribed; pending reconciliation | May represent a composite corridor route |
| 18 | B007 — B010 | 20 | Source-transcribed; pending reconciliation | May represent a composite corridor route |
| 19 | B009 — B016 | 15 | Source-transcribed; pending reconciliation | May represent a composite corridor route |
| 20 | B010 — B016 | 12 | Source-transcribed; pending reconciliation | May represent a composite corridor route |
| 21 | B016 — B017 | 12 | Source-transcribed; pending reconciliation | May represent a composite corridor route |
| 22 | B017 — B018 | 34 | Source-transcribed; pending reconciliation | May represent a composite corridor route |
| 23 | B016 — B011 | 34 | Source-transcribed; pending reconciliation | May represent a composite corridor route |
| 24 | B016 — staircase access | 28 | Source-transcribed; pending reconciliation | Staircase identity and endpoint are unresolved |
| 25 | B011 — girls' washroom access | 14 | Source-transcribed; pending reconciliation | Facility/access-point identity is unresolved |
| 26 | B011 — B012 | 25 | Source-transcribed; pending reconciliation | May represent a composite corridor route |
| 27 | B012 — B013 | 16 | Source-transcribed; pending reconciliation | May represent a composite corridor route |
| 28 | B013 — B014 | 6 | Source-transcribed; pending reconciliation | May represent a composite corridor route |
| 29 | B014 — B015 | 10 | Source-transcribed; pending reconciliation | May represent a composite corridor route |
| 30 | B015 — staircase access | 24 | Source-transcribed; pending reconciliation | Staircase identity and endpoint are unresolved |

None of these records is map-verified or canonically accepted. In particular, descriptions such as `staircase access` must not be merged into one node merely because the description is repeated.

### Master-document normalization wording

The following raw normalization expressions are preserved from section 7.1 of `KIIT_CAMPUS25_Navigation_System_Master_Team_Document_Updated.docx`:

```text
B018 -> B019 = 38
B019 -> B020 = 2 + 12 = 14
B020 -> B022 = 12
B022 -> B021 = 2 + 11 = 13
B021 -> staircase = 20
B021 -> B001 = 34
B001 -> girls washroom = 20
B001 -> B002 = 3 + 18 = 21
B002 -> B003 = 2 + 12 = 14
B003 -> B004 = 2 + 6 = 8
B002 -> B004 = 19
B004 -> B005 = 3 + 7 = 10
B005 -> staircase = 18
B005 -> B006 = 20 + 20 = 40
B006 -> B007 = 18
B006 -> B008 = 2 + 18 = 20
B007 -> B009 = 18
B007 -> B010 = 2 + 18 = 20
B009 -> B016 = 8 + 7 = 15
B010 -> B016 = 8 + 4 = 12
B016 -> B017 = 12
B017 -> B018 = 2 + 32 = 34
B016 -> B011 = 34
B016 -> staircase = 28
B011 -> girls washroom = 14
B011 -> B012 = 3 + 22 = 25
B012 -> B013 = 2 + 14 = 16
B013 -> B014 = 2 + 4 = 6
B014 -> B015 = 2 + 8 = 10
B015 -> staircase = 24
```

This source reconciliation confirms the reported values and their stated decompositions. It does not resolve which physical staircase or corridor/junction node each generic description denotes.

## 2. B018 cumulative route

The supplied consecutive differences are preserved below. The cumulative total starts at 0. Each cumulative value is derived by adding the supplied difference to the previous cumulative value.

The supplied differences are arithmetically consistent with the reported final cumulative position of 393. This means **internally consistent, source reconciliation still required**. Arithmetic checking does not establish endpoint identity, physical topology, or canonical acceptance.

| Route step | Consecutive route positions | Reported endpoint description | Difference-derived weight | Cumulative total | Verification status |
|---:|---|---|---:|---:|---|
| 1 | 0 -> 1 | B018 -> C-block stairs | 36 | 36 | Source-transcribed from Master section 7.2; arithmetically checked; canonical staircase identity pending |
| 2 | 1 -> 2 | C-block stairs -> Right A-block / staircase junction | 38 | 74 | Source-transcribed from Master section 7.2; arithmetically checked; junction identity pending |
| 3 | 2 -> 3 | Right A-block / staircase junction -> A015 | 17 | 91 | Source-transcribed from Master section 7.2; arithmetically checked; corridor topology pending |
| 4 | 3 -> 4 | A015 -> A014 | 12 | 103 | Source-transcribed from Master section 7.2; arithmetically checked; corridor topology pending |
| 5 | 4 -> 5 | A014 -> Left A-block junction | 12 | 115 | Source-transcribed from Master section 7.2; arithmetically checked; junction identity pending |
| 6 | 5 -> 6 | Left A-block junction -> Right B-block / staircase junction | 23 | 138 | Source-transcribed from Master section 7.2; arithmetically checked; cross-corridor topology pending |
| 7 | 6 -> 7 | Right B-block / staircase junction -> A013 / A012 corridor position | 7 | 145 | Source-transcribed from Master section 7.2; arithmetically checked; corridor topology pending |
| 8 | 7 -> 8 | A013 / A012 corridor position -> A011 | 18 | 163 | Source-transcribed from Master section 7.2; arithmetically checked; corridor topology pending |
| 9 | 8 -> 9 | A011 -> Left route toward A-block exit | 30 | 193 | Source-transcribed from Master section 7.2; arithmetically checked; exit junction pending |
| 10 | 9 -> 10 | Left route toward A-block exit -> Front toward gents washroom | 15 | 208 | Source-transcribed from Master section 7.2; arithmetically checked; facility access topology pending |
| 11 | 10 -> 11 | Front toward gents washroom -> A010 / A009 corridor position | 5 | 213 | Source-transcribed from Master section 7.2; arithmetically checked; corridor topology pending |
| 12 | 11 -> 12 | A010 / A009 corridor position -> A008 / A007 corridor position | 18 | 231 | Source-transcribed from Master section 7.2; arithmetically checked; corridor topology pending |
| 13 | 12 -> 13 | A008 / A007 corridor position -> Lift 4 location | 6 | 237 | Source-transcribed from Master section 7.2; arithmetically checked; lift is metadata only |
| 14 | 13 -> 14 | Lift 4 location -> A006 / left staircase | 12 | 249 | Source-transcribed from Master section 7.2; arithmetically checked; staircase identity pending |
| 15 | 14 -> 15 | A006 / left staircase -> Ladies washroom / A-block exit | 4 | 253 | Source-transcribed from Master section 7.2; arithmetically checked; access topology pending |
| 16 | 15 -> 16 | Ladies washroom / A-block exit -> Lift 3 / A005 area | 15 | 268 | Source-transcribed from Master section 7.2; arithmetically checked; lift is metadata only |
| 17 | 16 -> 17 | Lift 3 / A005 area -> IoT lab / A004 | 19 | 287 | Source-transcribed from Master section 7.2; arithmetically checked; facility/room access topology pending |
| 18 | 17 -> 18 | IoT lab / A004 -> Project lab / A003 | 12 | 299 | Source-transcribed from Master section 7.2; arithmetically checked; facility/room access topology pending |
| 19 | 18 -> 19 | Project lab / A003 -> Research lab / A002 | 5 | 304 | Source-transcribed from Master section 7.2; arithmetically checked; facility/room access topology pending |
| 20 | 19 -> 20 | Research lab / A002 -> Lift 2 / A001 area | 7 | 311 | Source-transcribed from Master section 7.2; arithmetically checked; lift is metadata only |
| 21 | 20 -> 21 | Lift 2 / A001 area -> Left staircase | 9 | 320 | Source-transcribed from Master section 7.2; arithmetically checked; staircase identity pending |
| 22 | 21 -> 22 | Left staircase -> Lift 1 / A-block exit | 10 | 330 | Source-transcribed from Master section 7.2; arithmetically checked; lift is metadata only |
| 23 | 22 -> 23 | Lift 1 / A-block exit -> Gents washroom | 16 | 346 | Source-transcribed from Master section 7.2; arithmetically checked; access topology pending |
| 24 | 23 -> 24 | Gents washroom -> A018 / A017 corridor position | 5 | 351 | Source-transcribed from Master section 7.2; arithmetically checked; corridor topology pending |
| 25 | 24 -> 25 | A018 / A017 corridor position -> A016 | 12 | 363 | Source-transcribed from Master section 7.2; arithmetically checked; corridor topology pending |
| 26 | 25 -> 26 | A016 -> Staff toilet | 10 | 373 | Source-transcribed from Master section 7.2; arithmetically checked; facility access topology pending |
| 27 | 26 -> 27 | Staff toilet -> A/B/C block intersection | 20 | 393 | Source-transcribed from Master section 7.2; arithmetically checked; final junction endpoints pending |

### Cumulative arithmetic

```text
0 + 36 = 36
36 + 38 = 74
74 + 17 = 91
91 + 12 = 103
103 + 12 = 115
115 + 23 = 138
138 + 7 = 145
145 + 18 = 163
163 + 30 = 193
193 + 15 = 208
208 + 5 = 213
213 + 18 = 231
231 + 6 = 237
237 + 12 = 249
249 + 4 = 253
253 + 15 = 268
268 + 19 = 287
287 + 12 = 299
299 + 5 = 304
304 + 7 = 311
311 + 9 = 320
320 + 10 = 330
330 + 16 = 346
346 + 5 = 351
351 + 12 = 363
363 + 10 = 373
373 + 20 = 393
```

The earlier route transcription described positions involving B018 and C-block staircase access, A-block junctions, A015, A014, A013/A012, A011, A010/A009, A008/A007, lifts, A006, A005, IoT lab, project lab, research lab, A002, A001, staircases, washrooms, A018/A017, A016, staff toilet, and the A/B/C intersection. These descriptions are now aligned to the consecutive endpoint table above, but their canonical node decomposition remains subject to map/topology review.

## 3. Source-backed C-block measurements

The following records are transcribed from sections 8.1-8.4 of `docs/source/KIIT_CAMPUS25_Navigation_System_Master_Team_Document_Updated.docx`. Their values are source-confirmed against that document, not against unavailable raw field notes. C-block map page references are maintained in `docs/NODE_INVENTORY.md`.

### Ground floor (Master section 8.1)

| Reported connection | Weight (movement units) | Verification status |
|---|---:|---|
| C-block entrance -> KIIT Cafe | 55 | Source-confirmed in Master section 8.1; topology endpoints pending |
| C-block entrance -> Khel Kud area entrance | 22 | Source-confirmed in Master section 8.1; topology endpoints pending |
| Khel Kud area entrance -> C001 | 16 | Source-confirmed in Master section 8.1; topology endpoints pending |
| C001 -> stairs | 9 | Source-confirmed in Master section 8.1; staircase identity pending |
| C001 -> Lift 15/16 | 4 | Source-confirmed in Master section 8.1; lift metadata only |
| Khel Kud area entrance -> Lift 17 | 28 | Source-confirmed in Master section 8.1; lift metadata only |
| Lift 17 -> Faculty Lounge | 30 | Source-confirmed in Master section 8.1; lift metadata only |
| Faculty Lounge -> Lift 20 | 27 | Source-confirmed in Master section 8.1; lift metadata only |
| Faculty Lounge -> C011 | 52 | Source-confirmed in Master section 8.1; topology endpoints pending |
| Faculty Lounge -> C013 | 52 | Source-confirmed in Master section 8.1; topology endpoints pending |
| Faculty Lounge -> C012 | 90 | Source-confirmed in Master section 8.1; topology endpoints pending |
| Faculty Lounge -> Lift 18/19 | 32 | Source-confirmed in Master section 8.1; lift metadata only |
| Faculty Lounge -> staircase | 24 | Source-confirmed in Master section 8.1; staircase identity pending |
| C012 -> male WC | 14 | Source-confirmed in Master section 8.1; facility endpoint pending |
| C012 -> female WC | 14 | Source-confirmed in Master section 8.1; facility endpoint pending |

### First floor (Master section 8.2)

| Reported connection | Weight (movement units) | Verification status |
|---|---:|---|
| Ground -> 1st staircase transition | 26 by project convention | Source-confirmed in Master section 8.2; floor-specific staircase pairing pending |
| Stairs -> C104/105/106 office | 20 | Source-confirmed in Master section 8.2; exact office node identity pending |
| Office -> Conference | 52 | Source-confirmed in Master section 8.2; facility endpoint pending |
| Office -> Lift 20 | 30 | Source-confirmed in Master section 8.2; lift metadata only |
| Office -> staircase | 34 | Source-confirmed in Master section 8.2; staircase identity pending |
| Office -> C101 | 65 | Source-confirmed in Master section 8.2; topology endpoints pending |
| Office -> Lift 18/19 | 32 | Source-confirmed in Master section 8.2; lift metadata only |
| Office -> Lift 17 / Gallery | 25 | Source-confirmed in Master section 8.2; lift metadata only |
| Office -> Cafeteria via stairs | 25 | Source-confirmed in Master section 8.2; composite route requires topology review |
| C101 -> stairs | 9 | Source-confirmed in Master section 8.2; staircase identity pending |
| C101 -> Lift 15/16 | 4 | Source-confirmed in Master section 8.2; lift metadata only |

### Second floor (Master section 8.3)

| Reported connection | Weight (movement units) | Verification status |
|---|---:|---|
| Stair 1 -> C203 | 15 | Source-confirmed in Master section 8.3; staircase identity pending |
| C203 -> Lift 17 | 20 | Source-confirmed in Master section 8.3; lift metadata only |
| C203 -> Lift 18/19 | 24 | Source-confirmed in Master section 8.3; lift metadata only |
| C203 -> Lift 20 | 16 | Source-confirmed in Master section 8.3; lift metadata only |
| C203 -> C211 | 36 | Source-confirmed in Master section 8.3; topology endpoints pending |
| C203 -> C213 | 36 | Source-confirmed in Master section 8.3; topology endpoints pending |
| C211 -> C213 | 8 | Source-confirmed in Master section 8.3; corridor topology pending |
| C213 -> Lift 20 | 20 | Source-confirmed in Master section 8.3; lift metadata only |
| Lift 17 -> Library entrance | 40 | Source-confirmed in Master section 8.3; lift metadata only |
| Lift 17 -> C201 | 45 | Source-confirmed in Master section 8.3; lift metadata only |
| C201 -> stairs | 9 | Source-confirmed in Master section 8.3; staircase identity pending |
| C201 -> lift | 4 | Source-confirmed in Master section 8.3; lift metadata only |

### Third-floor treatment (Master section 8.4)

The master document states that the supplied floor layout is treated as repeating across Floors 0-3 and that no independent third-floor tile-count survey is required for the initial graph if corresponding segments are confirmed to match. Any physically different segment must remain unverified and be measured before use in a claimed shortest route.

## 4. Staircase and cross-block connections

### Staircase-access measurement records

The following reported horizontal records refer to unspecified staircase access points. They are not vertical staircase edges:

| Reported connection | Reported horizontal weight | Floor-specific endpoint status | Verification status |
|---|---:|---|---|
| B021 — staircase access | 20 | B-floor-0 room endpoint reported; staircase identity unresolved | Source-transcribed; pending reconciliation |
| B005 — staircase access | 18 | B-floor-0 room endpoint reported; staircase identity unresolved | Source-transcribed; pending reconciliation |
| B016 — staircase access | 28 | B-floor-0 room endpoint reported; staircase identity unresolved | Source-transcribed; pending reconciliation |
| B015 — staircase access | 24 | B-floor-0 room endpoint reported; staircase identity unresolved | Source-transcribed; pending reconciliation |
| B018 — C-block staircase access | Not supplied as a standalone weight | Both physical endpoints unresolved | Source-transcribed description; pending reconciliation |

A verified consecutive-floor staircase connector must have weight exactly 26 movement units. The horizontal values above must not be substituted for that fixed vertical value.

### Cross-block connections

| Reported connection | Known endpoints | Required evidence | Canonical status |
|---|---|---|---|
| A-block entry from C block | C-side and A-side endpoints not uniquely identified | Physical map and measured horizontal route | Cannot add yet |
| B-block entry from C block near B018 | C-side and B-side endpoints not uniquely identified | Physical map and measured horizontal route | Cannot add yet |
| B018 and C-block staircase access | Descriptive route relationship only | Exact endpoints, map topology, and raw measurement | Cannot add yet |

Lifts remain metadata/UI locations only. No vertical graph edges may be created through lifts.

## 5. Unresolved endpoint and topology records

The following items remain unresolved and must not be silently converted into canonical edges:

- All four generic `staircase access` endpoints in the B-block table.
- The girls' washroom access endpoint in records 7 and 25.
- Whether any reported room-to-room record is a direct corridor segment or a composite route.
- All intermediate endpoint identities in the 27-step B018 route.
- The exact alignment between B018 cumulative differences and the described route landmarks.
- The physical junctions between opposite classrooms and their corridor access points.
- The exact A-side and C-side endpoints of the A-block C entry.
- The exact B-side and C-side endpoints of the B-block C entry near B018.
- The floor-specific endpoints of every staircase connector.
- The map relationship between lifts and nearby route nodes; lifts remain metadata regardless.

## Acceptance boundary

This document is a reconciliation artifact, not canonical graph data. Source-transcribed values remain provisional. Arithmetic checking applies only to the B018 cumulative sum and does not establish map verification. No record is map-verified or canonically accepted until the original measurement notes, physical maps, and Master Team Coordination Document have been reconciled.
