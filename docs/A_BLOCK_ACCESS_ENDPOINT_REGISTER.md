# A-Block Staircase and Facility Access Endpoint Register

**Project:** KIIT CAMPUS25 Navigation System\
**Scope:** A-block ground-floor facilities, lifts, staircase identity and upper-floor matching\
**Status:** Reconciliation register only. No canonical JSON changes.

## 1. Safe decisions

- A001–A018 remain distinct room nodes.
- A-block ladies' washroom and gents' washroom are separate facilities.
- Staff toilet remains a provisional transcription until its exact map label and access position are confirmed.
- Lift 1–4 are A/B route descriptions. Do not merge them with C-block lifts 15/16, 17, 18/19 or 20.
- Lifts are metadata/UI destinations only, never vertical Dijkstra connectors.
- A block has multiple staircases. Generic descriptions such as “left staircase” and “staircase junction” do not uniquely identify a physical staircase.
- Every verified consecutive-floor staircase edge has weight exactly 26. Similar-looking symbols alone do not prove physical continuity.

## 2. Facility and access endpoint register

| Route/source description | Existing inventory ID | Status and action |
|---|---|---|
| A-block ladies' washroom | `A-F0-FAC-LADIES-WASHROOM` | Facility label source-confirmed; exact access point unresolved. Retain; no edge yet. |
| A-block gents' washroom | `A-F0-FAC-GENTS-WASHROOM` | Facility label source-confirmed; access point unresolved. Retain; no edge yet. |
| A-block staff toilet | `A-F0-FAC-STAFF-TOILET` | Provisional transcription. Do not promote without a legible map label and placement. |
| Lift 1 | `A-F0-LIFT-01` | Provisional metadata-only node; route endpoint is combined with A-block exit. |
| Lift 2 | `A-F0-LIFT-02` | Provisional metadata-only node; route endpoint is combined with A001 area. |
| Lift 3 | `A-F0-LIFT-03` | Provisional metadata-only node; route endpoint is combined with A005 area. |
| Lift 4 | `A-F0-LIFT-04` | Provisional metadata-only node; preceding A008/A007 corridor position is unresolved. |
| A-block entrance | `ENTRY_A` | Source-confirmed feature; §7.2 does not establish its measured endpoint. |
| Entry from C block to A area | `ENTRY_A_FROM_C` | Feature source-confirmed; exact graph endpoint and measured cross-block route unresolved. |

## 3. Staircase identity register

The project naming pattern is:

`STAIR_A_<stair-number>_F<floor-number>`

The following are naming targets, not permission to add unverified nodes or edges:

| Physical staircase | Floor-specific ID pattern | Promotion rule |
|---|---|---|
| A-block Staircase 01 | `STAIR_A_01_F0` through `STAIR_A_01_F3` | Create only on floors where the same physical staircase is clearly matched |
| A-block Staircase 02 | `STAIR_A_02_F0` through `STAIR_A_02_F3` | Create only on floors where the same physical staircase is clearly matched |
| Other visible stair symbols | `STAIR_A_<n>_F<floor>` | Number separately from the map; do not infer numbers from route wording |

The B018 cumulative route mentions a “right A-block / staircase junction”, a “left A-block junction”, and later a “left staircase”. The text alone does not prove whether these refer to the same or different staircases, or whether any corresponds to Staircase 01 or 02.

For each staircase, record the map page, floor, position relative to stable room labels/walls, and whether the same shaft is visibly present on adjacent floors. Only verified consecutive-floor pairs receive 26-unit edges.

## 4. A/B cumulative route: facility and staircase endpoint disposition

The 27 cumulative differences and their arithmetic remain unchanged. The following route segments are not yet promoted to canonical edges:

| Step | Source description | Weight | Why not promoted |
|---:|---|---:|---|
| 9 | A011 → left route toward A-block exit | 30 | Exit route landmark unresolved |
| 10 | Left exit route → front toward gents washroom | 15 | Composite route description |
| 13 | A008/A007 corridor position → Lift 4 | 6 | Corridor position unresolved; lift metadata only |
| 14 | Lift 4 → A006/left staircase | 12 | Composite endpoint |
| 15 | A006/left staircase → ladies washroom/A-block exit | 4 | Two physical destinations combined |
| 16 | Ladies washroom/A-block exit → Lift 3/A005 area | 15 | Composite endpoints |
| 17 | Lift 3/A005 area → IoT lab/A004 | 19 | Composite endpoints |
| 20 | Research lab/A002 → Lift 2/A001 area | 7 | Composite endpoint |
| 21 | Lift 2/A001 area → left staircase | 9 | Composite endpoint and generic stair |
| 22 | Left staircase → Lift 1/A-block exit | 10 | Generic stair and composite endpoint |
| 23 | Lift 1/A-block exit → gents washroom | 16 | Composite starting endpoint |
| 26 | A016 → staff toilet | 10 | Staff toilet access remains provisional |
| 27 | Staff toilet → A/B/C intersection | 20 | Both endpoints need physical/topology review |

Do not convert these descriptions into direct room-to-facility or room-to-stair edges without resolving the actual access nodes.

## 5. Upper-floor rule

The project owner has stated that A/B topology repeats across Floors 0–3. This does not automatically establish upper-floor room labels, exact staircase correspondence, facility placement, or horizontal measurements.

For Staircases 01 and 02, use floor-specific IDs only where the supplied maps clearly show the same physical staircase. Uncertain matches remain provisional. Do not create a vertical edge unless both adjacent-floor endpoints are verified.

## 6. Implementation boundary

No `locations.json`, `edges.json`, or `floors.json` entries are added or modified in this phase. The route descriptions do not yet identify every physical staircase/facility access endpoint precisely enough. This is an intentional safeguard against inventing connections.

## 7. Promotion checklist

Before promoting a facility/stair access record:
1. Destination/access point is visibly identifiable on a source map.
2. Exact block and floor are known.
3. It is distinct from nearby rooms, facilities, lifts and other stairs.
4. Map position matches the route description.
5. Measurement is tied to that exact access point.
6. For staircases, continuity is verified on both adjacent-floor maps.

Update canonical JSON and source inventories together after these checks, then run both repository validators.
