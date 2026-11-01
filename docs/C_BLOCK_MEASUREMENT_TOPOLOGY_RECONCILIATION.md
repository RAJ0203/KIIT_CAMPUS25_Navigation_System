# C-Block Measurement and Topology Reconciliation

**Project:** KIIT CAMPUS25 Navigation System\
**Scope:** C-block collected measurements, Floors 0–3\
**Status:** Reconciliation record only — not a replacement for canonical JSON data

## 1. Rules retained

- Horizontal movement weights are measured tile counts; 1 tile = 1 movement unit.
- A measurement in the source is not automatically a direct graph edge.
- Room, facility, staircase-access, and corridor-junction nodes remain distinct where the physical map supports distinct locations.
- A verified staircase connection between consecutive floors costs exactly 26 movement units.
- Lifts are metadata/UI locations only. No lift-to-lift or cross-floor lift routing edges are permitted.
- Do not invent missing endpoint IDs, junctions, intermediate segment weights, coordinates, or physical links.
- The C-block layout is handled from its own mapped facilities and labels; do not impose A/B classroom topology on it.

## 2. Ground-floor C-block measurements (Master section 8.1)

The following values are preserved from the Master Team Coordination Document. The endpoint and topology qualifications below are important: source transcription does not, by itself, establish a canonical graph edge.

| Record | Reported connection | Weight | Reconciliation status / action |
|---|---|---:|---|
| C-G1 | C-block entrance → KIIT Cafe | 55 | Keep as source measurement. Entrance endpoint ID is not established; do not add edge yet. |
| C-G2 | C-block entrance → Khel Kud area entrance | 22 | Keep as source measurement. Exact entrance node identity remains to be resolved. |
| C-G3 | Khel Kud area entrance → C001 | 16 | Keep as source measurement. Confirm whether the mapped Khel Kud Area node is exactly the named entrance before using it as endpoint. |
| C-G4 | C001 → stairs | 9 | Horizontal access measurement; exact staircase identity/access node unresolved. Not a 26-unit vertical edge. |
| C-G5 | C001 → Lift 15/16 | 4 | Horizontal access to lift metadata only. Never create a vertical lift edge. |
| C-G6 | Khel Kud area entrance → Lift 17 | 28 | Horizontal access to lift metadata only; entrance identity still needs confirmation. |
| C-G7 | Lift 17 → Faculty Lounge | 30 | Horizontal access between mapped locations, subject to corridor-topology review. Lift remains metadata only. |
| C-G8 | Faculty Lounge → Lift 20 | 27 | Horizontal access to lift metadata only. |
| C-G9 | Faculty Lounge → C011 | 52 | Source-named endpoints; retain 52. Do not infer a direct room-to-room edge without corridor topology review. |
| C-G10 | Faculty Lounge → C013 | 52 | Source-named endpoints; retain 52. Do not infer a direct room-to-room edge without corridor topology review. |
| C-G11 | Faculty Lounge → C012 | 90 | Source-named endpoints; retain 90. Do not infer a direct room-to-room edge without corridor topology review. |
| C-G12 | Faculty Lounge → Lift 18/19 | 32 | Horizontal access to lift metadata only. |
| C-G13 | Faculty Lounge → staircase | 24 | Horizontal staircase-approach measurement; exact staircase/access node unresolved. Not a vertical edge. |
| C-G14 | C012 → male WC | 14 | Preserve as a separate facility-access measurement. Exact male-WC/access node ID and door approach need mapping. |
| C-G15 | C012 → female WC | 14 | Preserve as a separate facility-access measurement. Keep distinct from male WC; exact access node needs mapping. |

### Ground-floor interpretation

1. Keep male and female WC destinations distinct; do not merge them into one washroom node.
2. The generic `stairs` / `staircase` descriptions in C-G4 and C-G13 must not be assigned to a particular staircase merely by proximity or numbering.
3. Lift access records are horizontal only. Lift locations can appear as map/UI metadata, but cannot connect floors in Dijkstra.
4. Faculty Lounge measurements to C011, C013, and C012 retain their reported weights of 52, 52, and 90 respectively. Whether each is represented as a direct edge or via corridor junctions depends on the actual corridor topology and access points.

## 3. First-floor C-block measurements (Master section 8.2)

| Record | Reported connection | Weight | Reconciliation status / action |
|---|---|---:|---|
| C-F1 | Ground → 1st staircase transition | 26 | Fixed project convention, not a measured horizontal edge. Both floor-specific staircase endpoint IDs and physical pairing must be established. |
| C-F2 | Stairs → C104/105/106 office | 20 | Combined office description does not identify one canonical endpoint. Resolve exact office/location and staircase. |
| C-F3 | Office → Conference | 52 | Generic office endpoint and exact conference destination/access point need mapping. |
| C-F4 | Office → Lift 20 | 30 | Generic office endpoint unresolved; lift is metadata only. |
| C-F5 | Office → staircase | 34 | Both office endpoint and staircase identity unresolved. Horizontal approach only. |
| C-F6 | Office → C101 | 65 | Generic office endpoint unresolved; preserve value without creating an edge. |
| C-F7 | Office → Lift 18/19 | 32 | Generic office endpoint unresolved; lift is metadata only. |
| C-F8 | Office → Lift 17 / Gallery | 25 | Composite endpoint must be separated into distinct physical locations if the map supports them. Do not merge lift and gallery. |
| C-F9 | Office → Cafeteria via stairs | 25 | Composite route; exact office, staircase and cafeteria endpoint/route sequence unresolved. Do not treat as a single direct edge. |
| C-F10 | C101 → stairs | 9 | Horizontal staircase access; exact staircase/access node unresolved. |
| C-F11 | C101 → Lift 15/16 | 4 | Horizontal access to lift metadata only. |

## 4. Second-floor C-block measurements (Master section 8.3)

| Record | Reported connection | Weight | Reconciliation status / action |
|---|---|---:|---|
| C-S1 | Stair 1 → C203 | 15 | Horizontal access measurement; `Stair 1` must be mapped to an exact floor-specific staircase node. |
| C-S2 | C203 → Lift 17 | 20 | Horizontal access to lift metadata only. |
| C-S3 | C203 → Lift 18/19 | 24 | Horizontal access to lift metadata only. |
| C-S4 | C203 → Lift 20 | 16 | Horizontal access to lift metadata only. |
| C-S5 | C203 → C211 | **52 (user-approved revision)** | Original Master/inventory value is 36. User explicitly directed changing this measurement to 52 based on the repeated-layout/orientation comparison. Preserve the original 36 as source history and record 52 as the current reconciled decision. |
| C-S6 | C203 → C213 | **52 (user-approved revision)** | Original Master/inventory value is 36. User explicitly directed changing this measurement to 52 based on the repeated-layout/orientation comparison. Preserve the original 36 as source history and record 52 as the current reconciled decision. |
| C-S7 | C211 → C213 | 8 | Retain 8. User confirmed C203, C211 and C213 are on the same corridor. This still does not alone prove that all three reported values are direct graph edges rather than corridor-route measurements. |
| C-S8 | C213 → Lift 20 | 20 | Horizontal access to lift metadata only. |
| C-S9 | Lift 17 → Library entrance | 40 | Floor-specific library entrance endpoint needs mapping. Lift is metadata only. |
| C-S10 | Lift 17 → C201 | 45 | Horizontal access to C201 via mapped lift-area location; topology still requires review. Lift is metadata only. |
| C-S11 | C201 → stairs | 9 | Horizontal staircase access; exact staircase/access node unresolved. |
| C-S12 | C201 → lift | 4 | Generic lift label cannot be assigned to a specific lift without map evidence. Metadata only. |

### Explicit user-approved measurement revision

The current reconciliation decision is:

- C203 → C211 = 52 movement units (revised from 36)
- C203 → C213 = 52 movement units (revised from 36)
- C211 → C213 = 8 movement units (unchanged)

The original Master-document transcription and prior inventory values of 36 must remain visible in provenance/history. Do not silently overwrite the original source record. Apply 52 as the current approved value when the canonical measurement documentation and graph are updated. This decision is based on the user's stated repeated-layout/orientation comparison; it is not an independent field remeasurement.

## 5. Third-floor treatment (Master section 8.4)

The Master document says the supplied floor layout is treated as repeating across Floors 0–3 and that a separate third-floor tile-count survey is not required for the initial graph if corresponding segments are confirmed to match.

This is a structural reuse rule only. It does not authorize:
- copying a floor-2 room ID to floor 3;
- assuming every staircase serves every floor;
- creating vertical lift edges;
- copying a measurement to a physically different corridor segment;
- creating a floor-3 edge before matching the corresponding floor-specific endpoints.

Any segment that differs physically remains unverified and requires its own measurement.

## 6. Staircase and lift handling

### Staircases

For each physical staircase, use a separate access node on each floor it serves, following the project's agreed floor-specific naming convention where the physical identity is verified. Only verified consecutive-floor pairs may receive vertical edges, each with weight exactly 26.

The source measurements `C001 → stairs = 9`, `Faculty Lounge → staircase = 24`, `C101 → stairs = 9`, and `C201 → stairs = 9` are horizontal access measurements. They must not be mistaken for vertical staircase costs.

### Lifts

Keep the source labels L15/16, L17, L18/19 and L20 as lift metadata/location records where supported by the map. No lift-to-lift or cross-floor lift edge may be included in the routing graph.

The handwritten C-block map labels previously clarified by the project owner are **L17, L18, L19 and L20** (not L8/L9/L20). Preserve those exact labels; do not merge L17/L18 or L19/L20 into one lift simply because they are close together. Whether each label represents an individual lift or a paired lift bank must follow the map/source representation.

## 7. Items not approved for canonical `edges.json` yet

Do not add the following merely from the measurement table:

- C-block entrance links until the exact entrance node IDs are established;
- generic staircase links until each staircase access node is identified;
- male/female WC access until separate facility/access nodes are established;
- composite office/gallery/cafeteria routes until their physical endpoints and route segments are separated;
- floor-to-floor staircase edges until the same physical staircase is verified on both consecutive floors;
- any lift-based vertical connection;
- direct room-to-room edges where corridor topology requires junctions.

The C203/C211/C213 revised weights are approved measurement decisions, but their final graph representation still requires corridor-topology review.

## 8. Current implementation recommendation

1. Keep the existing canonical JSON files unchanged during this documentation pass.
2. Update the measurement reconciliation source record so C-S5 and C-S6 show original value 36 and current approved value 52, with the decision provenance stated above.
3. Verify exact C-block entrance, WC access, and staircase access node IDs against the floor map.
4. Resolve corridor/junction decomposition before adding graph edges.
5. Run structural validation and connectivity audit only after a deliberate JSON update.
6. Do not claim the C-block subgraph or full campus graph is routing-ready until endpoint and topology checks are complete.

## 9. Source and decision provenance

- Master Team Coordination Document, sections 8.1–8.4: source measurement values and floor-reuse statement.
- `EDGE_INVENTORY.md`: endpoint mapping/status rules and source-transcribed C-block records.
- C-block floor-map PDF: mapped labels and relative physical layout; drawing alone does not supply missing tile-count measurements.
- Project-owner decisions in the working conversation: C203→C211 and C203→C213 revised to 52; C211→C213 remains 8; handwritten labels corrected to L17, L18, L19, L20.

**This document records reconciliation decisions and unresolved evidence. It does not replace the canonical JSON files or claim that every listed measurement is an accepted graph edge.**
