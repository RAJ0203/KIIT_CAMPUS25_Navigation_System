# Demo Known Limitations

**Project:** KIIT CAMPUS25 Navigation System  
**Purpose:** Record the current graph's known limitations for the demo and distinguish verified software behaviour from work still requiring physical or source verification.  
**Status:** Demo reference only — no canonical graph changes are proposed by this document.

## 1. Current demo scope

The current graph is a partially connected campus graph. It supports selected routes within the connected components represented in the current canonical data. It does not yet provide routes between every location or every block.

The following API tests have previously succeeded against the tested backend and graph snapshot:

| Test | Previously observed result |
|---|---|
| A015 → B018 | HTTP 200; distance 91 |
| B018 → A015 | HTTP 200; distance 91 |
| B005 → STAIR_B_02_F1 | HTTP 200; distance 44 |
| Verified consecutive-floor staircase transitions | Weight 26 per transition |

These results demonstrate that the tested API routes can be calculated using the current graph. They are not independent physical remeasurements of every corridor or route segment.

## 2. Known routing limitations

### 2.1 The campus graph is not fully connected

The current graph contains multiple disconnected components. A route request between locations in different components will return no route.

This is a known limitation of the current graph snapshot, not necessarily an API failure.

### 2.2 Main C-block network is disconnected from the A/B-connected network

The main measured C-block network containing C211 is disconnected from the component containing A015 and B018.

C Staircase 04 (`STAIR_C_04_F0`) is already connected to the B018/A-B route-position network through the accepted measured links:

- `B018` → `STAIR_C_04_F0`: 36 movement units
- `STAIR_C_04_F0` → `A-F0-JUNC-RIGHT-REPORTED`: 38 movement units

However, no measured horizontal connection has yet been established between the main C-block network and Staircase 04.

Consequently, the tested route `C211` → `A015` currently has no path. Do not add a guessed edge or weight to make this route succeed.

### 2.3 Some rooms and facilities do not yet have complete access topology

Some locations are isolated or belong to smaller components because their physical access points and measured corridor connections have not yet been established.

An isolated location is not automatically an error. Lift metadata locations, for example, are intentionally not connected vertically for routing.

## 3. Upper-floor inventory is a separate task

The supplied A/B floor plans show 120 upper-floor room labels that are not currently represented as A/B room nodes in the current `locations.json`:

- A-block: 18 rooms on each of Floors 1, 2 and 3 — 54 rooms.
- B-block: 22 rooms on each of Floors 1, 2 and 3 — 66 rooms.
- Total: 120 proposed room records.

The floor plans also show upper-floor toilet/facility locations. These are candidates for a separate inventory and review; their canonical IDs, exact labels and access positions must be confirmed before adding records.

**Important:** Preparing the room and facility inventory does not automatically establish routing connectivity. Do not create horizontal edges or copy ground-floor weights merely because the upper-floor layouts look similar.

## 4. Staircase and lift rules

- Horizontal movement weights must be supported by measured tile counts; 1 tile = 1 movement unit.
- Every verified connection between consecutive floors using the same physical staircase has a weight of exactly 26.
- Staircase identity and continuity must be verified on the relevant adjacent-floor maps before treating a pair as a valid vertical connection.
- Lifts are metadata/UI locations only. They must not be used as vertical Dijkstra connectors.
- The runtime must load staircase transitions from `data/edges.json` exactly once. `data/floors.json` is a metadata mirror and must not be appended to adjacency when those edges have already been loaded.

## 5. Evidence required before connecting the main C network to Staircase 04

Before proposing or adding this connection, collect:

1. The exact existing canonical start-node ID in the main C-block network.
2. Physical confirmation of the destination access point represented by `STAIR_C_04_F0`.
3. The actual walkable corridor route between the endpoints, including any intermediate junctions.
4. The measured horizontal tile count for each segment, recorded in route order.
5. A marked floor-plan or other source evidence showing the start, route, junctions and destination.
6. The verifier and measurement date.

If the route passes through one or more corridor junctions, record those separately where the topology requires them. Do not assume the entire route is one direct edge.

The 26-unit staircase rule does not apply to this horizontal approach measurement.

## 6. Demo guidance

For the demo:

- Use the currently tested routes listed in Section 1.
- Treat `C211` → `A015` as a known disconnected route and explain why.
- Do not add speculative connections.
- Do not rush the 120 upper-floor room records or the upper-floor facility records into the canonical graph.
- Keep the canonical `data/locations.json`, `data/edges.json` and `data/floors.json` unchanged for the demo.
- Describe the current graph as partially connected and the listed routes as tested software behaviour, not as proof that every campus route has been physically validated.

## 7. Suggested explanation for the demo

> Our current navigation graph supports selected routes that have been represented and tested in the graph. Some campus areas are still disconnected because their physical access connections have not yet been measured or confirmed. We have documented these gaps and are keeping estimated connections out of the routing data. The upper-floor room inventory is being handled separately from routing connectivity so that adding destinations does not introduce unverified paths.

## 8. Post-demo work

1. Review the proposed 120 A/B upper-floor room records.
2. Confirm upper-floor toilet/facility labels, IDs and access positions.
3. Physically verify the route from the main C-block network to Staircase 04 and record its measured segments.
4. Review proposed location and edge changes before implementation.
5. After approval, update canonical data and run structural, connectivity and route tests.

---

**Change boundary:** This document records known limitations and demo guidance only. It does not authorize or perform changes to canonical graph data.
