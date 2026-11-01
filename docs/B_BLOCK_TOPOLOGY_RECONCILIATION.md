# B-block topology reconciliation — Phase 2

**Source:** `A,B,C Block GF_261028_164441.pdf`, page 1; `docs/EDGE_INVENTORY.md`, section 1; `docs/MEASUREMENT_RECONCILIATION.md`, section 1; user-confirmed staircase approach decisions.

## 1. Confirmed horizontal staircase approaches

| From | To | Weight | Basis |
|---|---|---:|---|
| B005 | STAIR_B_02_F0 | 18 | Previously confirmed by user |
| B021 | STAIR_B_04_F0 | 20 | Owner-confirmed annotated map mapping; corrected endpoint |
| B016 | STAIR_B_03_F0 | 28 | User-confirmed physical staircase identity B-03 |
| B015 | STAIR_B_01_F0 | 24 | Owner-confirmed annotated map mapping; corrected endpoint |

These are horizontal access distances. They are not the vertical staircase cost.

## 2. Numbered junction register

The following IDs are introduced as provisional-transcription records. Page 1 shows corridor bends/branching areas in these parts of the B-block plan. The IDs provide stable handles for later measurement reconciliation; they do not assert a coordinate or distance.

| ID | Map-supported description | Current status |
|---|---|---|
| `B-F0-JUNC-01` | North-east corridor bend near B009/B007/B006 and the east-side corridor | Provisional ID; exact measured access point pending |
| `B-F0-JUNC-02` | East-side corridor turn/branch around B005/B004/B002 | Provisional ID; exact measured access point pending |
| `B-F0-JUNC-03` | Central corridor decision area around B010/B008 and staircase access | Provisional ID; exact measured access point pending |
| `B-F0-JUNC-04` | South-east corridor decision area around B001, B021/B022 and entry approach | Provisional ID; exact measured access point pending |

Coordinates remain `null`. No edges are attached to these junctions yet.

## 3. Why junction edges are not added yet

The source inventory lists the B-block room measurements as provisional because the measurement endpoints are not necessarily direct room-to-room graph edges. Some records contain decompositions such as `20 + 20`, `8 + 7`, `8 + 4`, and `2 + 32`, but the available transcription does not identify each segment's exact physical endpoint at a named junction. Assigning those values to newly named junctions without that correspondence would fabricate topology.

Accordingly, this patch preserves all original measurement values in the inventory and does not convert the remaining room-to-room records into graph edges. The four junction nodes are a registry for the next measurement-mapping pass, not a claim that the paths have been fully reconciled.

## 4. Still pending

- Map each of the 30 original B-block ground-floor measurement records to actual corridor access points.
- Confirm whether the reported room-to-room value is a direct access-to-access path or a composite route through one or more junctions.
- Split a composite total only when its segment values and junction correspondence are source-supported. Preserve the total as a reconciliation check.
- Add separate access nodes for the B001 and B011 girls-washroom measurements; do not merge the two access points.
- Verify all four staircase identities and cross-floor continuity independently before routing release.

## 5. Edge count after this patch

The uploaded edge file had 14 edges: 12 vertical stair transitions and two horizontal staircase approaches. This patch adds the two previously user-confirmed B016 and B015 approaches. The resulting file has **16 edges**: 12 stair and 4 horizontal.

> **Historical count note:** The 16-edge count above describes the earlier B-block patch snapshot, not the current integrated campus graph. The current canonical graph contains 154 locations and 115 edges.
