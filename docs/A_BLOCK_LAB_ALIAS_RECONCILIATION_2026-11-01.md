# A-block Lab Alias Reconciliation — 2026-11-01

## Owner-confirmed physical identity

The project owner clarified that the following lab names refer to existing numbered A-block rooms:

| Name used in route notes | Canonical room ID |
|---|---|
| IoT lab | `A004` |
| Project lab | `A003` |
| Research lab | `A002` |

The route wording “Lift 3 / A005 area” maps to room `A005`; “Lift 2 / A001 area” maps to room `A001`.

## Canonical data decision

Each physical room is represented once:
- `A004` retains the room ID and has `IoT lab` in `metadata.aliases`.
- `A003` retains the room ID and has `Project lab` in `metadata.aliases`.
- `A002` retains the room ID and has `Research lab` in `metadata.aliases`.

The provisional duplicate facility records `A-F0-FAC-IOT-LAB`, `A-F0-FAC-PROJECT-LAB`, and `A-F0-FAC-RESEARCH-LAB` have been removed from `data/locations.json`. They were provisional transcriptions, and the owner has since confirmed the room IDs. Their names remain discoverable through aliases.

## Measured route segments now represented

The owner-confirmed endpoint mappings resolve cumulative route steps 17–20:

| Step | Cumulative positions | Canonical edge | Weight |
|---:|---|---|---:|
| 17 | 268→287 | `A005` → `A004` | 19 |
| 18 | 287→299 | `A004` → `A003` | 12 |
| 19 | 299→304 | `A003` → `A002` | 5 |
| 20 | 304→311 | `A002` → `A001` | 7 |

All weights are unchanged differences from the source cumulative positions. No intermediate junction or extra distance is invented.

## Conflict held out

Cumulative step 21 would imply `A001 → STAIR_A_02_F0 = 9`. The separately owner-confirmed direct approach is 14 (9 straight + 5 left). The canonical graph retains 14 and does not add the conflicting 9-unit edge.

## Consequences

This adds four horizontal edges and consolidates three redundant location records:
- Locations: 157 → 154
- Edges: 111 → 115
- The A001–A005 room chain joins the existing A001 / Staircase 02 component, making a 9-node A-block component.

This correction does not resolve the remaining cumulative-route gaps or connect the main C-block network to C Staircase 04.
