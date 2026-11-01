# B-Block Measurement Normalization — Corrected Implementation Rule

**Project:** KIIT CAMPUS25 Navigation System\
**Scope:** B-block ground-floor horizontal measurements\
**Authority:** Master Team Coordination Document, section 5.3 (raw measurement normalization) and section 7.1 (B-block measured network)\
**Status:** Corrected implementation guidance; no canonical JSON changes in this document

## 1. Correction to the earlier segment-decomposition audit

The earlier `B_BLOCK_SEGMENT_DECOMPOSITION_AUDIT.md` suggested that every source expression such as `20 + 20` must be represented as two graph edges through an intermediate junction. That is too strict and does not match the Master Team Coordination Document's explicit normalization example.

Section 5.3 states:

Raw note:
`B005 → B006 = 20 straight + 20 left`

Canonical edge:
`B005 --40--> B006`

Therefore, a turn or multiple measured subsegments do not automatically require a graph junction. When the source measurement is a complete route measurement between two canonical endpoints, sum the subsegments and use the normalized total as the edge weight.

## 2. Correct normalization rule

For a source measurement from endpoint A to endpoint B:

1. Add all explicitly reported consecutive movement segments.
2. Preserve the raw decomposition in measurement documentation.
3. Use the sum as the normalized edge weight between A and B, provided A and B are the accepted endpoints of that measured route.
4. Introduce an intermediate junction only when it is a meaningful navigation point supported by the map and the measurement data identifies the relevant segment endpoint(s).
5. Never invent a junction or infer a segment weight by visual proportion.

A turn is not automatically a junction node. A junction is a graph node when it represents a meaningful mapped corridor branch, intersection, entrance connection, or other navigation decision.

## 3. Explicit B-block normalizations from the Master Document

| Measurement | Raw decomposition | Normalized total |
|---|---:|---:|
| B019 → B020 | 2 + 12 | 14 |
| B022 → B021 | 2 + 11 | 13 |
| B001 → B002 | 3 + 18 | 21 |
| B002 → B003 | 2 + 12 | 14 |
| B003 → B004 | 2 + 6 | 8 |
| B004 → B005 | 3 + 7 | 10 |
| B005 → B006 | 20 + 20 | 40 |
| B006 → B008 | 2 + 18 | 20 |
| B007 → B010 | 2 + 18 | 20 |
| B009 → B016 | 8 + 7 | 15 |
| B010 → B016 | 8 + 4 | 12 |
| B017 → B018 | 2 + 32 | 34 |
| B011 → B012 | 3 + 22 | 25 |
| B012 → B013 | 2 + 14 | 16 |
| B013 → B014 | 2 + 4 | 6 |
| B014 → B015 | 2 + 8 | 10 |

These sums are arithmetic normalization of the source measurements. Whether each normalized A-to-B route is accepted as a canonical direct edge still depends on endpoint identity, physical walkability, and the project graph model.

## 4. Treatment of the four numbered B-block junctions

The four existing node records:
- `B-F0-JUNC-01`
- `B-F0-JUNC-02`
- `B-F0-JUNC-03`
- `B-F0-JUNC-04`

must be retained only if they correspond to actual meaningful mapped corridor decision points. Their existence does not mean every measured route must pass through them. Do not assign them to arbitrary turn points merely to consume the IDs.

If a measured route is a single source-defined A-to-B connection and the map does not require a separate graph decision node, retain one normalized A-to-B edge with the summed weight.

If a meaningful junction is required, add consecutive edges only when the segment endpoint and each segment weight are supported by source measurements.

## 5. Staircase approaches remain separate

The four horizontal staircase approach mappings are:

| From | To | Weight |
|---|---|---:|
| B021 | `STAIR_B_04_F0` | 20 |
| B005 | `STAIR_B_02_F0` | 18 |
| B016 | `STAIR_B_03_F0` | 28 |
| B015 | `STAIR_B_01_F0` | 24 |

The B021/B015 endpoint assignment follows the project owner's explicit confirmation of the handwritten map labels. Preserve weights and existing metadata.

Vertical staircase transitions remain separate and use exactly 26 between verified consecutive floors.

## 6. Measurements that remain unresolved

The following are not resolved merely by summing numbers:

- `B021 → B001 = 34`: determine whether this is a complete measured route between those room endpoints or a route whose meaningful intermediate endpoint is separately documented.
- `B002 → B004 = 19`: source calls this a branch/alternate route; check map and measurement interpretation before adding.
- `B006 → B007 = 18`, `B007 → B009 = 18`, `B016 → B017 = 12`, `B016 → B011 = 34`: preserve reported totals; confirm they represent accepted traversable connections and not overlapping/composite routes.
- B001-side girls' washroom access = 20 and B011-side girls' washroom access = 14: preserve separate physical access points and exact node identities.
- All room/corridor endpoints must be checked against the mapped physical access points. Do not treat every room label as a door coordinate.

## 7. Immediate implementation sequence

1. Confirm the two corrected staircase endpoints are present in the actual `edges.json`.
2. Review each B-block source measurement as a whole route between its stated endpoints.
3. Normalize explicit raw subsegments by summing them.
4. Add a direct normalized edge when the source and map support that A-to-B graph connection.
5. Use an intermediate junction only where the map identifies a meaningful navigation point and the measurements support the segment weights.
6. Keep alternate/branch routes separate where they are genuinely distinct.
7. Update `edges.json` and the measurement reconciliation documentation together.
8. Run both validators and manually inspect the resulting edge list.

## 8. Source provenance

- `KIIT_CAMPUS25_Navigation_System_Master_Team_Document_Updated.docx`, section 5.3: explicit example that a raw `20 + 20` measurement normalizes to one canonical edge of weight 40.
- Master Team Coordination Document, section 7.1: B-block raw measurement list.
- Owner-confirmed staircase endpoint correction: B021 → B-04 (20) and B015 → B-01 (24).

**No JSON files are changed by this document.**
