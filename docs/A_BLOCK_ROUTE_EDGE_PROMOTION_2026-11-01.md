# A-Block Route Edge Promotion — 2026-11-01

**Status:** 17 of the 27 measured cumulative-route segments are represented as canonical horizontal edges. Four additional edges in this batch promote steps 17–20 using owner-confirmed room endpoint mappings.

## Newly promoted in this batch

| Route step | Cumulative positions | From | To | Weight | Owner-confirmed endpoint mapping |
|---:|---:|---|---|---:|---|
| 17 | 268→287 | `A005` | `A004` | 19 | Lift 3/A005 area = A005; IoT lab = A004 |
| 18 | 287→299 | `A004` | `A003` | 12 | IoT lab = A004; Project lab = A003 |
| 19 | 299→304 | `A003` | `A002` | 5 | Project lab = A003; Research lab = A002 |
| 20 | 304→311 | `A002` | `A001` | 7 | Research lab = A002; Lift 2/A001 area = A001 |

Each edge carries the source section, cumulative route step, cumulative positions, mapping basis and `owner-confirmed` status in its `metadata`.

## Previously promoted cumulative-route segments

Steps 1–8, 14 and 24–27 remain in the graph from earlier correction batches. Their endpoint mappings and weights are recorded in `data/edges.json` and `A_BLOCK_CUMULATIVE_ROUTE_RECONCILIATION.md`.

## Canonical room aliases

The owner confirmed:
- `A004` is the IoT lab.
- `A003` is the Project lab.
- `A002` is the Research lab.

The duplicate provisional facility nodes `A-F0-FAC-IOT-LAB`, `A-F0-FAC-PROJECT-LAB` and `A-F0-FAC-RESEARCH-LAB` are removed from `locations.json`. Their display names are preserved as aliases on A004, A003 and A002 respectively. The room IDs remain canonical and unchanged.

## Conflict deliberately not promoted

Cumulative step 21 (positions 311→320) would map to `A001 → STAIR_A_02_F0 = 9`. The separate owner-confirmed approach measurement is 14 (9 straight + 5 left). The graph retains the 14-unit edge and does **not** add a conflicting 9-unit edge.

## Remaining unpromoted segments

- Steps 9–13: unresolved exit/gents-washroom-front and combined A010/A009, A008/A007 corridor positions.
- Steps 15–16: composite A006 / ladies-washroom / exit route endpoint.
- Step 21: conflicting 9-unit cumulative value versus 14-unit owner-confirmed direct approach.
- Steps 22–23: generic staircase and Lift 1 / A-block exit composite; A/B lifts remain metadata-only.

The full 393-unit cumulative trace remains preserved, but it is not a continuous canonical graph path yet.

## Expected graph snapshot after this batch

- Locations: 154 (three redundant provisional lab facility records consolidated as aliases on A002–A004)
- Edges: 115 (85 horizontal, 30 stair)
- Undirected components: 45
- Isolated nodes: 38
- Largest components: 51, 43, 9, 5, 4, 2, 2
- Duplicate edges: 0
- Unknown endpoints: 0

These counts describe structural connectivity, not end-to-end `/route` readiness.
