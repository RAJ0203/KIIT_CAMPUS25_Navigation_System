# B-Block Map-to-Measurement Staircase Conflict Audit

**Project:** KIIT CAMPUS25 Navigation System\
**Scope:** B-block ground-floor staircase approaches and corridor topology\
**Status:** Conflict flagged for owner confirmation\
**Canonical JSON changes:** None

## 1. Purpose

A higher-resolution inspection of page 1 of `A,B,C Block GF_261028_164441.pdf` reveals a possible mismatch between handwritten staircase labels/physical positions and the staircase identities recorded for four measured room-to-staircase approaches.

This document records the conflict. It does not silently replace previously approved mappings.

## 2. Map labels visible on the ground-floor plan

The handwritten labels appear to indicate the following physical positions:

| Handwritten staircase label | Approximate position on the B-block map |
|---|---|
| `STAIR_B_01_F0` | Near the B015/B013 side of the upper/central B-block corridor |
| `STAIR_B_02_F0` | Near B008/B005 |
| `STAIR_B_03_F0` | Near B016 |
| `STAIR_B_04_F0` | Near B021/B001 and the ground-floor entry side |

The position descriptions are visual observations from the annotated map, not measured coordinates.

## 3. Previously recorded room-to-staircase mappings

The current working decisions recorded in the project context are:

| Room | Reported horizontal weight | Previously recorded staircase ID |
|---|---:|---|
| B021 | 20 | `STAIR_B_01_F0` |
| B005 | 18 | `STAIR_B_02_F0` |
| B016 | 28 | `STAIR_B_03_F0` |
| B015 | 24 | `STAIR_B_04_F0` |

## 4. Potential conflicts

| Room approach | Previously recorded ID | Apparent map proximity/label | Review |
|---|---|---|---|
| B021 → staircase (20) | `STAIR_B_01_F0` | Map appears to label the nearby B021/B001-side stair as `STAIR_B_04_F0` | Conflict — do not change without confirmation |
| B005 → staircase (18) | `STAIR_B_02_F0` | Map appears to label the nearby B008/B005-side stair as `STAIR_B_02_F0` | Appears consistent |
| B016 → staircase (28) | `STAIR_B_03_F0` | Map appears to label the nearby B016-side stair as `STAIR_B_03_F0` | Appears consistent |
| B015 → staircase (24) | `STAIR_B_04_F0` | Map appears to label the nearby B015/B013-side stair as `STAIR_B_01_F0` | Conflict — do not change without confirmation |

## 5. Required owner confirmation

Before changing any canonical edge, confirm which interpretation is correct:

- **Map labels are authoritative:** B021 approaches B-04 and B015 approaches B-01; preserve weights 20 and 24 respectively.
- **Previously recorded mapping is authoritative:** B021 approaches B-01 and B015 approaches B-04; the apparent handwritten map labels or proximity need another explanation.
- **The measurement endpoint is not the nearest staircase:** the measured route may intentionally reach a different staircase; document the route path/turns before mapping it.

This is the only unresolved decision raised by this audit. The weights 20 and 24 are not being changed.

## 6. Other B-block corridor observations

The map shows a corridor network with distinct branches around:
- B009/B007/B006 and the upper corridor;
- B010/B008 and the B-02 staircase area;
- B005/B004/B002/B001 along the right-side room branch;
- B018/B003 and the central block area;
- B019/B021/B020/B022 along the lower corridor;
- B016/B017 on the left-side vertical branch.

These observations help identify where junctions may be meaningful, but they do not determine the intermediate measured split points for all 16 decomposed measurements. A junction ID should be assigned only when the source measurement's split point can be tied to a specific physical corridor point.

## 7. Existing numbered junction nodes

The current Phase 2 data contains:
- `B-F0-JUNC-01`
- `B-F0-JUNC-02`
- `B-F0-JUNC-03`
- `B-F0-JUNC-04`

This audit does not map these IDs to specific physical points. Their positions must be explicitly matched to the measured route splits; they should not be assigned by numeric order or by convenience.

## 8. Implementation decision

- Keep `locations.json`, `edges.json`, and `floors.json` unchanged.
- Keep the four horizontal staircase approach weights unchanged.
- Do not relabel B-01/B-04 or change endpoint IDs until the owner resolves the apparent map conflict.
- Do not add junction-split edges until the exact intermediate point is identified.
- After confirmation, update the edge endpoints and documentation together, then run both graph scripts.

## 9. Source provenance

- `A,B,C Block GF_261028_164441.pdf`, page 1, annotated ground-floor plan.
- Master Team Coordination Document, section 7.1, B-block measured network.
- Existing `EDGE_INVENTORY.md` and B-block reconciliation decisions.

**This is a conflict audit, not a graph update.**
