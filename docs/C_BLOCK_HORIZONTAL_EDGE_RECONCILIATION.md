# C-Block Horizontal Measurement Reconciliation

**Project:** KIIT CAMPUS25 Navigation System\
**Scope:** C-block ground, first and second floors\
**Sources:** Master Team Coordination Document sections 8.1–8.3; current `EDGE_INVENTORY.md`; `MEASUREMENT_RECONCILIATION.md`; C-block map references recorded in `NODE_INVENTORY.md`\
**Status:** Measurement/end-point audit complete for this phase. No canonical graph edges are approved by this document.

## 1. Important distinction

The Master document supplies measured values. The current graph reconciliation rules say that a source-supported number and two named endpoints do not automatically establish a direct walkable graph edge. The current `GRAPH_RECONCILIATION_PLAN.md` explicitly classifies every proposed edge as not safe to add yet because physical corridor topology still needs reconciliation.

Therefore this document preserves the measurements and records the exact next action. It does **not** authorize copying the candidate rows into `data/edges.json`.

## 2. Ground floor — section 8.1

| Record | Source measurement | Current endpoint assessment | Disposition |
|---|---|---|---|
| C-G1 | C-block entrance → KIIT Cafe = 55 | C-block entrance has no canonical ID | Hold; resolve entrance node |
| C-G2 | C-block entrance → Khel Kud area entrance = 22 | C-block entrance has no canonical ID | Hold; resolve entrance node |
| C-G3 | Khel Kud area entrance → C001 = 16 | Existing Khel Kud node represents general area; equivalence to entrance is unproven | Hold; resolve distinct entrance/access node |
| C-G4 | C001 → stairs = 9 | Staircase identity unresolved | Hold; identify physical stair |
| C-G5 | C001 → Lift 15/16 = 4 | Both endpoint IDs mapped; horizontal access to lift metadata | Candidate; verify direct corridor access against map |
| C-G6 | Khel Kud area entrance → Lift 17 = 28 | Entrance/access endpoint equivalence unresolved | Hold; resolve access node |
| C-G7 | Lift 17 → Faculty Lounge = 30 | Both endpoint IDs mapped; horizontal access to lift metadata | Candidate; verify direct corridor access against map |
| C-G8 | Faculty Lounge → Lift 20 = 27 | Both endpoint IDs mapped; horizontal access to lift metadata | Candidate; verify direct corridor access against map |
| C-G9 | Faculty Lounge → C011 = 52 | Both named endpoint IDs mapped; room/facility corridor topology still needs review | Candidate only; no direct room edge until topology approved |
| C-G10 | Faculty Lounge → C013 = 52 | Both named endpoint IDs mapped; room/facility corridor topology still needs review | Candidate only; no direct room edge until topology approved |
| C-G11 | Faculty Lounge → C012 = 90 | Both named endpoint IDs mapped; room/facility corridor topology still needs review | Candidate only; no direct room edge until topology approved |
| C-G12 | Faculty Lounge → Lift 18/19 = 32 | Both endpoint IDs mapped; horizontal access to lift metadata | Candidate; verify direct corridor access against map |
| C-G13 | Faculty Lounge → staircase = 24 | Staircase identity unresolved | Hold; identify physical stair |
| C-G14 | C012 → male WC = 14 | Male WC access node missing | Hold; identify and add distinct WC access node |
| C-G15 | C012 → female WC = 14 | Female WC access node missing | Hold; identify and add distinct WC access node |

## 3. First floor — section 8.2

| Record | Source measurement | Current endpoint assessment | Disposition |
|---|---|---|---|
| C-F1 | Ground → first-floor staircase transition = 26 | Both floor-specific stair endpoints unresolved | Hold; identify same physical staircase on both floors |
| C-F2 | Stairs → C104/105/106 office = 20 | Generic stair and combined office endpoint | Hold; separate exact endpoints |
| C-F3 | Office → Conference = 52 | Generic office endpoint; conference placement unresolved | Hold |
| C-F4 | Office → Lift 20 = 30 | Generic office endpoint | Hold |
| C-F5 | Office → staircase = 34 | Office and stair endpoints unresolved | Hold |
| C-F6 | Office → C101 = 65 | Generic office endpoint | Hold |
| C-F7 | Office → Lift 18/19 = 32 | Generic office endpoint | Hold |
| C-F8 | Office → Lift 17 / Gallery = 25 | Composite endpoint | Hold; separate lift metadata and gallery |
| C-F9 | Office → Cafeteria via stairs = 25 | Composite route and generic endpoints | Hold; do not turn this into a lift or staircase vertical edge |
| C-F10 | C101 → stairs = 9 | Staircase identity unresolved | Hold |
| C-F11 | C101 → Lift 15/16 = 4 | Both endpoint IDs mapped; horizontal access to lift metadata | Candidate; verify direct corridor access against map |

## 4. Second floor — section 8.3

| Record | Source measurement | Current endpoint assessment | Disposition |
|---|---|---|---|
| C-S1 | Stair 1 → C203 = 15 | Stair 1 has no canonical ID | Hold |
| C-S2 | C203 → Lift 17 = 20 | Both endpoint IDs mapped; horizontal access to lift metadata | Candidate; verify direct corridor access against map |
| C-S3 | C203 → Lift 18/19 = 24 | Both endpoint IDs mapped; horizontal access to lift metadata | Candidate; verify direct corridor access against map |
| C-S4 | C203 → Lift 20 = 16 | Both endpoint IDs mapped; horizontal access to lift metadata | Candidate; verify direct corridor access against map |
| C-S5 | C203 → C211 = 52 | User-approved reconciliation changed the original inventory value 36 to 52; both room IDs mapped, corridor topology still needs review | Candidate only; preserve original 36 in provenance and document the user's 52 decision |
| C-S6 | C203 → C213 = 52 | User-approved reconciliation changed the original inventory value 36 to 52; both room IDs mapped, corridor topology still needs review | Candidate only; preserve original 36 in provenance and document the user's 52 decision |
| C-S7 | C211 → C213 = 8 | Both room IDs mapped; corridor interpretation still needs review | Candidate only |
| C-S8 | C213 → Lift 20 = 20 | Both endpoint IDs mapped; horizontal access to lift metadata | Candidate; verify direct corridor access against map |
| C-S9 | Lift 17 → Library entrance = 40 | Floor-specific library entrance ID unresolved | Hold |
| C-S10 | Lift 17 → C201 = 45 | Both endpoint IDs mapped; horizontal access to named room | Candidate; verify direct corridor access against map |
| C-S11 | C201 → stairs = 9 | Staircase identity unresolved | Hold |
| C-S12 | C201 → lift = 4 | Lift identity unresolved | Hold |

## 5. Edge semantics

- Lift records may be used as horizontal landmarks/access destinations if the map supports the physical approach. They must never become vertical Dijkstra connectors.
- A horizontal edge to a staircase is an approach measurement, not the 26-unit vertical staircase transition.
- A vertical staircase edge may be added only after the same physical staircase is identified on both consecutive floors. Its weight is exactly 26.
- C203, C211 and C213 remain distinct room nodes. Do not merge them or silently replace the raw source measurement.
- For C-S5 and C-S6, retain the original source value 36 in the reconciliation history and record the project owner's approved revised value 52 as a separate decision with rationale.
- No coordinates are inferred from the schematic maps.

## 6. Required map review before JSON changes

1. On the ground-floor map, identify the exact C-block entrance endpoint and determine whether the Khel Kud area entrance is a distinct access node from the general Khel Kud Area facility.
2. Match each visible staircase to a unique physical staircase identity; record floor-specific nodes only where the same shaft is visible on adjacent floors.
3. Identify male and female WC access points separately near C012.
4. On the first-floor map, resolve the exact C104/105/106 office endpoint and distinguish office, conference, gallery and cafeteria locations.
5. On the second-floor map, inspect the corridor between C203, C211 and C213 to determine whether the source measurements represent direct walkable connections or require corridor junction nodes.
6. Verify the physical approach routes to each lift metadata location.
7. Update `locations.json`, `edges.json`, `EDGE_INVENTORY.md`, and `MEASUREMENT_RECONCILIATION.md` together only after these checks.

## 7. Current implementation decision

**No canonical JSON files are changed in this phase.** The measurements are preserved and the endpoint/topology work is itemized. This avoids treating a mapped room label or a reported measurement as proof of a direct graph edge.
