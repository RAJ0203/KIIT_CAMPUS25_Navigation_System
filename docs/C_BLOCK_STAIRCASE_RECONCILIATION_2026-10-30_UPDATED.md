# C-Block Staircase Reconciliation — Owner-Confirmed Update 2026-11-01

This document supersedes older statements in this file that describe Staircase 04 as library-side or its Floor 0 endpoint as unresolved.

## 1. Confirmed physical staircase positions

| Staircase | Ground-floor physical reference | Floor coverage | Owner confirmation |
|---|---|---|---|
| 01 | Near Faculty Lounge / C013 / Lifts 19–20 | F0–F3 | Confirmed |
| 02 | Near Lift 17 / Khel Kud | F0–F3 | Confirmed |
| 03 | Near C001 / Lifts 15–16 | F0–F3 | Confirmed |
| 04 | Near the A/B connecting corridor | F0–F3 | Confirmed; **not library-side** |

Each physical staircase has a floor-specific node for F0, F1, F2 and F3 in `data/locations.json`.

## 2. Vertical graph representation

Each staircase has three consecutive-floor transitions:

- F0 ↔ F1 = 26
- F1 ↔ F2 = 26
- F2 ↔ F3 = 26

The current canonical graph contains 12 C-block staircase edges (four staircases × three transitions). `floors.json.connectors` mirrors these edges for metadata only. The graph loader must not load the mirrors into adjacency a second time.

Lifts remain metadata/UI locations. They must never be used as vertical Dijkstra connectors.

## 3. Measured horizontal access links

The following owner-provided measurements are represented in `data/edges.json`:

| Measurement | Canonical endpoints | Weight |
|---|---|---:|
| C001 → Staircase 03 F0 | `C001` → `STAIR_C_03_F0` | 9 |
| Faculty Lounge → Staircase 01 F0 | `C-F0-FAC-FACULTY-LOUNGE` → `STAIR_C_01_F0` | 24 |
| B018 → C Staircase 04 F0 (cumulative route step 1) | `B018` → `STAIR_C_04_F0` | 36 |
| C Staircase 04 F0 → right A-block route junction (cumulative route step 2) | `STAIR_C_04_F0` → `A-F0-JUNC-RIGHT-REPORTED` | 38 |

The last two records use the owner-confirmed physical placement of Staircase 04 near the A/B connecting corridor to resolve the cumulative route's generic “C-block stairs” landmark. Their source step and cumulative positions are preserved in edge metadata.

## 4. C-block horizontal route context

C-block horizontal measurements use the supplied total distances between the recorded endpoints. They remain horizontal edges even when one endpoint is a lift access location. A lift node used as a same-floor measured endpoint does not imply elevator travel or a vertical lift edge.

## 5. Connectivity boundary

The main measured C-block network is currently a 43-node component. C Staircase 04's four floor nodes are connected through the B018 cumulative route to the A/B route-position segment, but there is no measured horizontal edge in the current source snapshot connecting Staircase 04 to the 43-node main C network.

Do not invent a connection between those two C-block areas. The 26-unit vertical staircase edges are already present and do not solve the missing same-floor horizontal access link.

## 6. Validation checklist

- [x] Staircases 01–04 have F0–F3 floor-specific nodes.
- [x] Twelve C-block consecutive-floor staircase transitions use weight 26.
- [x] Staircase 04 is near the A/B connecting corridor, not the library side.
- [x] No lift-to-lift or lift floor-change edge is present.
- [x] Same-floor measured lift access endpoints remain horizontal only.
- [ ] A measured horizontal route from Staircase 04 to the main C-block network is not yet present.
