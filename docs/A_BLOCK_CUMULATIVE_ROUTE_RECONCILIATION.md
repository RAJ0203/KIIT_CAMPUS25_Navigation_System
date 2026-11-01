# A-Block Cumulative Route Reconciliation

**Current status (2026-11-01): partially represented in the canonical graph.** This document preserves the source route and records which measured segments have been promoted using owner-confirmed endpoint mappings.

## 1. Source and arithmetic

The source is `KIIT_CAMPUS25_Navigation_System_Master_Team_Document_Updated.docx`, section 7.2, “A/B route cumulative measurements”, transcribed in the project measurement inventory.

The cumulative route starts at B018 at position 0 and ends at the reported A/B/C intersection at position 393. Every source segment weight is the difference between consecutive cumulative positions:

`weight = next cumulative position - previous cumulative position`

The 27 differences are arithmetically consistent and sum to 393. Arithmetic consistency alone does not establish that every source endpoint is a direct graph node.

## 2. Canonical promotion status

| Step | Cumulative positions | Source endpoint descriptions | Weight | Canonical endpoints | Current disposition |
|---:|---:|---|---:|---|---|
| 1 | 0→36 | B018 → C-block stairs | 36 | `B018` → `STAIR_C_04_F0` | **Promoted.** Owner-confirmed Staircase 04 is near the A/B connecting corridor; mapping is recorded in edge metadata. |
| 2 | 36→74 | C-block stairs → right A-block / staircase junction | 38 | `STAIR_C_04_F0` → `A-F0-JUNC-RIGHT-REPORTED` | **Promoted.** Existing route-position node retained. |
| 3 | 74→91 | Right A-block junction → A015 | 17 | `A-F0-JUNC-RIGHT-REPORTED` → `A015` | **Promoted.** Existing owner-reconciled route-position node retained. |
| 4 | 91→103 | A015 → A014 | 12 | `A015` → `A014` | **Promoted.** Source records this as a consecutive measured segment; both room IDs are distinct. |
| 5 | 103→115 | A014 → left A-block junction | 12 | `A014` → `A-F0-JUNC-LEFT-REPORTED` | **Promoted.** Existing route-position node retained. |
| 6 | 115→138 | Left A-block junction → right B-block junction | 23 | `A-F0-JUNC-LEFT-REPORTED` → `B-F0-JUNC-REPORTED` | **Promoted.** Source-measured route-position link; no staircase identity inferred. |
| 7 | 138→145 | Right B-block junction → A013/A012 corridor position | 7 | `B-F0-JUNC-REPORTED` → `A-F0-JUNC-A013-A012-REPORTED` | **Promoted.** Corridor-position node remains distinct from rooms A013 and A012. |
| 8 | 145→163 | A013/A012 corridor position → A011 | 18 | `A-F0-JUNC-A013-A012-REPORTED` → `A011` | **Promoted.** Existing route-position node retained. |
| 9 | 163→193 | A011 → left route toward A-block exit | 30 | `A011` → `A-F0-EXIT-REPORTED` | **Not promoted.** Route description does not establish the exact exit/access topology. |
| 10 | 193→208 | Left route toward A-block exit → front toward gents washroom | 15 | unresolved → unresolved | **Not promoted.** Second endpoint is a descriptive route position, not a distinct canonical access node. |
| 11 | 208→213 | Front toward gents washroom → A010/A009 corridor position | 5 | unresolved → unresolved | **Not promoted.** Combined corridor description has no exact canonical endpoint. |
| 12 | 213→231 | A010/A009 corridor position → A008/A007 corridor position | 18 | unresolved → unresolved | **Not promoted.** Neither combined corridor position is a measured canonical endpoint. |
| 13 | 231→237 | A008/A007 corridor position → Lift 4 | 6 | unresolved → `A-F0-LIFT-04` | **Not promoted.** Start endpoint remains unresolved; Lift 4 is metadata only. |
| 14 | 237→249 | Lift 4 → A006 / left staircase | 12 | `A-F0-LIFT-04` → `A006` | **Promoted.** Owner clarification maps the composite destination to A006; Lift 4 is a same-floor horizontal landmark only. |
| 15 | 249→253 | A006 / left staircase → ladies washroom / A-block exit | 4 | unresolved → unresolved | **Not promoted.** Destination combines two physical locations; no split or zero-distance assumption is made. |
| 16 | 253→268 | Ladies washroom / A-block exit → Lift 3 / A005 area | 15 | unresolved → `A005` | **Not promoted.** Destination is mapped to A005, but the source endpoint remains composite. |
| 17 | 268→287 | Lift 3 / A005 area → IoT lab / A004 | 19 | `A005` → `A004` | **Promoted.** Owner clarifications resolve the source descriptions to room A005 and room A004. |
| 18 | 287→299 | IoT lab / A004 → Project lab / A003 | 12 | `A004` → `A003` | **Promoted.** Owner clarifications resolve both endpoints to their room IDs. |
| 19 | 299→304 | Project lab / A003 → Research lab / A002 | 5 | `A003` → `A002` | **Promoted.** Owner clarifications resolve both endpoints to their room IDs. |
| 20 | 304→311 | Research lab / A002 → Lift 2 / A001 area | 7 | `A002` → `A001` | **Promoted.** Owner clarification maps the destination description to room A001; no lift node is used. |
| 21 | 311→320 | Lift 2 / A001 area → left staircase | 9 | `A001` → `STAIR_A_02_F0` (candidate) | **Conflict — not promoted.** Owner separately confirmed A001→Staircase 02 as 14 (9 straight + 5 left). The cumulative-route value 9 conflicts with that measurement. Keep the existing 14-unit edge; do not add a second 9-unit edge. |
| 22 | 320→330 | Left staircase → Lift 1 / A-block exit | 10 | generic staircase → composite lift/exit | **Not promoted.** The source endpoint is a lift beside Staircase 02, but lifts are not A/B routing nodes; no replacement edge is inferred. |
| 23 | 330→346 | Lift 1 / A-block exit → gents washroom | 16 | composite lift/exit → gents washroom | **Not promoted.** Source start is not a canonical routing endpoint. |
| 24 | 346→351 | Gents washroom → A018/A017 corridor position | 5 | `A-F0-FAC-GENTS-WASHROOM` → `A-F0-JUNC-A018-A017-REPORTED` | **Promoted.** Existing distinct facility and corridor-position nodes retained. |
| 25 | 351→363 | A018/A017 corridor position → A016 | 12 | `A-F0-JUNC-A018-A017-REPORTED` → `A016` | **Promoted.** A017 and A018 remain separate room nodes. |
| 26 | 363→373 | A016 → staff toilet | 10 | `A016` → `A-F0-FAC-STAFF-TOILET` | **Promoted.** Existing facility node retained. |
| 27 | 373→393 | Staff toilet → reported A/B/C intersection | 20 | `A-F0-FAC-STAFF-TOILET` → `A-F0-JUNC-ABC-REPORTED` | **Promoted.** This reaches the reported position 393 node; it does not automatically connect to ENTRY_A, ENTRY_B, or the main C-block network. |

## 3. A-block lab aliases and canonical room IDs

The owner clarified:
- IoT lab = A004
- Project lab = A003
- Research lab = A002
- Lift 3 / A005 area = A005
- Lift 2 / A001 area = A001

Therefore, A002, A003 and A004 are the canonical graph locations for the corresponding named labs. The redundant provisional facility records `A-F0-FAC-RESEARCH-LAB`, `A-F0-FAC-PROJECT-LAB`, and `A-F0-FAC-IOT-LAB` have been removed from `locations.json`; their names are retained as aliases in the corresponding room metadata. This avoids representing one physical room twice.

## 4. Separate A001-to-staircase measurement conflict

The independent owner-confirmed route is:

`A001 → STAIR_A_02_F0 = 14` (9 straight + 5 left)

Cumulative step 21, after owner endpoint mapping, would imply `A001 → STAIR_A_02_F0 = 9`. These values conflict. The canonical graph retains the explicit 14-unit owner-confirmed edge and does not add the conflicting 9-unit edge. This discrepancy remains recorded for provenance; no averaging or silent substitution is performed.

## 5. Remaining route gaps

The cumulative trace is still not a continuous canonical path. Steps 9–13, 15–16, and 22–23 remain unpromoted; step 21 is held because of the 9-versus-14 conflict. In particular:
- The route gap between A006 and A005 remains unresolved because step 15/16 contains a composite ladies-washroom/exit endpoint.
- The route from A011 through the exit/gents-washroom front and A010/A009/A008/A007 corridor positions remains unresolved.
- Lift 1 and Lift 2 are not inserted as A/B routing nodes.
- The reported position 393 is not automatically connected to `ENTRY_A`, `ENTRY_B`, `ENTRY_A_FROM_C`, or `ENTRY_B_FROM_C`.

## 6. Graph safety rules

- Preserve source weights and route order.
- Horizontal edges are stored once and interpreted bidirectionally.
- Do not invent intermediate junctions or split a measured segment without a source-supported measurement.
- Do not merge A012 with A013, A010 with A009, A008 with A007, or A017 with A018.
- A/B lifts remain metadata-only; they are not routing nodes or vertical connectors.
- Staircase vertical transitions remain separate 26-unit edges.

## 7. Provenance

- Master Team Coordination Document, section 7.2: original cumulative route and cumulative positions.
- Owner clarifications: Lift 3/A005 area = A005; IoT lab = A004; Project lab = A003; Research lab = A002; Lift 2/A001 area = A001; A001→Staircase 02 = 14; left staircase at cumulative position 320 = Staircase 02.
- `data/edges.json`: canonical promoted segments and edge-level provenance metadata.
