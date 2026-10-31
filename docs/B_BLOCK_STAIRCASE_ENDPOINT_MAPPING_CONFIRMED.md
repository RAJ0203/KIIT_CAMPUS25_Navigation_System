# B-Block Staircase Endpoint Mapping — Confirmed Correction

**Project:** KIIT CAMPUS25 Navigation System\
**Decision status:** Confirmed by project owner\
**Source authority:** Annotated A/B ground-floor map, page 1, and explicit owner confirmation\
**Canonical file affected:** `data/edges.json` only

## Confirmed mapping

The project owner has confirmed that the handwritten staircase labels on the ground-floor map are authoritative for these two measured approaches.

| Room | Correct staircase endpoint | Horizontal weight | Action |
|---|---|---:|---|
| B021 | `STAIR_B_04_F0` | 20 | Replace previous endpoint `STAIR_B_01_F0` |
| B015 | `STAIR_B_01_F0` | 24 | Replace previous endpoint `STAIR_B_04_F0` |

The other two previously recorded approaches remain unchanged:

| Room | Staircase endpoint | Horizontal weight |
|---|---|---:|
| B005 | `STAIR_B_02_F0` | 18 |
| B016 | `STAIR_B_03_F0` | 28 |

## Required edit to `data/edges.json`

Replace the two existing horizontal edge records. Do not append duplicates.

```json
{
  "from": "B021",
  "to": "STAIR_B_04_F0",
  "weight": 20,
  "type": "horizontal"
}
```

```json
{
  "from": "B015",
  "to": "STAIR_B_01_F0",
  "weight": 24,
  "type": "horizontal"
}
```

When editing the existing records, preserve any additional fields already present, such as `status`, `source`, `notes`, or provenance. Only the `to` endpoint changes in each record.

## Do not change

- B021 approach weight remains 20.
- B015 approach weight remains 24.
- B005 → `STAIR_B_02_F0` remains 18.
- B016 → `STAIR_B_03_F0` remains 28.
- Staircase node IDs and vertical edges remain unchanged.
- The fixed vertical staircase transition cost remains 26.

## Validation after applying

From the repository root, run:

```powershell
python scripts/validate_graph_data.py
python scripts/audit_graph_data.py
```

Then inspect `data/edges.json` and confirm:
- exactly one B021 horizontal approach to `STAIR_B_04_F0` with weight 20;
- exactly one B015 horizontal approach to `STAIR_B_01_F0` with weight 24;
- no stale duplicates remain for the previous endpoints.

## Scope

This correction resolves only the two staircase endpoint identities. It does not resolve the 16 B-block corridor segment decompositions or approve additional room-to-junction edges.
