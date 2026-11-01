# B-Block Staircase Endpoint Correction — Applied to JSON Snapshot

The supplied current `edges.json` snapshot still contained the two old mappings. The validation output alone did not detect this because it checks structure, not map-to-staircase identity.

This corrected file changes exactly two endpoints and preserves the weights and total edge count.

| From | Old endpoint | New endpoint | Weight |
|---|---|---|---:|
| B021 | `STAIR_B_01_F0` | `STAIR_B_04_F0` | 20 |
| B015 | `STAIR_B_04_F0` | `STAIR_B_01_F0` | 24 |

Unchanged horizontal approaches:
- B005 → `STAIR_B_02_F0` = 18
- B016 → `STAIR_B_03_F0` = 28

Unchanged:
- all 12 vertical staircase edges;
- all weights;
- all 127 locations;
- all other edge records.

## Apply

Replace the existing `data/edges.json` in the original repository with the supplied corrected `edges.json`.

Then run:
```powershell
python scripts/validate_graph_data.py
python scripts/audit_graph_data.py
```

Also verify the exact four horizontal records in the JSON. The structural validator does not test the physical correctness of staircase labels.
