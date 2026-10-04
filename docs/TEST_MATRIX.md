# Test Matrix

## 1. Purpose

This document defines the verification and testing requirements for the KIIT CAMPUS25 Navigation System.

Testing must verify:

- Canonical graph integrity
- Dijkstra correctness
- Route API behavior
- Authentication behavior
- Data validation
- Cross-floor and cross-block navigation
- Frontend/backend integration
- Route visualization

A route must not be presented as verified when its underlying graph measurements or physical connections are still `UNVERIFIED`.

---

## 2. Testing Principle

The project follows:

```text
Verified data
      ↓
Verified graph
      ↓
Verified Dijkstra
      ↓
Verified API
      ↓
Verified frontend integration
```

Testing must not rely on invented campus measurements, coordinates, route distances, or physical connections.

Where a physical measurement or connection is not confirmed, it must be marked:

```text
UNVERIFIED
```

and must not be used to claim that a route is correct.

---

## 3. Graph Data Sanity Checks

| ID | Test | Expected Result | Status |
|---|---|---|---|
| G01 | Every edge endpoint exists in `locations.json` | No edge references an unknown node | Pending |
| G02 | Every edge weight is numeric | All weights are numeric | Pending |
| G03 | Every edge weight is non-negative | No negative edge weights exist | Pending |
| G04 | Every staircase floor connector has weight `26` | All verified staircase transitions use `26` | Pending |
| G05 | No lift is used as a vertical Dijkstra connector | Lift metadata does not create vertical route edges | Pending |
| G06 | Important rooms/junctions are not accidentally isolated | Only physically isolated nodes are isolated | Pending |
| G07 | Opposite rooms connect through the correct corridor/junction | Graph follows physical layout | Pending |
| G08 | Cumulative measurements are normalized correctly | Stored edge weights equal measured totals | Pending |
| G09 | Cross-block edges correspond to real walkable connections | No invented cross-block connection exists | Pending |
| G10 | Floor-specific node IDs follow verified floor numbering | IDs match verified floor mapping | Pending |

---

## 4. Dijkstra Algorithm Tests

### D01 — Same Node

**Input:**

```text
B018 → B018
```

**Expected:**

```text
distance = 0
path = ["B018"]
```

**Purpose:**

Verifies the zero-cost route from a node to itself.

**Status:** Pending

---

### D02 — Direct Route

**Input:**

A source and destination connected by one verified edge.

Example:

```text
B018 → B019
```

**Expected:**

The returned distance equals the verified edge weight and the path contains the two nodes in order.

**Status:** Pending

---

### D03 — Multi-Edge Route

**Input:**

A route requiring multiple verified edges.

Example:

```text
B018 → B020
```

where:

```text
B018 → B019
B019 → B020
```

are verified.

**Expected:**

The returned distance equals the sum of the selected edge weights.

The returned path contains the ordered node sequence.

**Status:** Pending

---

### D04 — Weighted Shortest Path

**Input:**

A graph where a route with fewer edges is not necessarily the route with the lowest total weight.

**Expected:**

Dijkstra selects the route with the minimum total movement cost rather than the route with the fewest edges.

**Status:** Pending

---

### D05 — Reverse Route

**Input:**

A verified bidirectional connection in the reverse direction.

Example:

```text
B019 → B018
```

**Expected:**

The route is valid when the underlying graph connection is bidirectional.

**Status:** Pending

---

### D06 — Cross-Block Route

**Input:**

A source and destination in different blocks with a fully verified walkable graph connection.

Example:

```text
B018 → A015
```

**Expected:**

Dijkstra returns a valid route only when every required cross-block connection is verified.

**Status:** Pending

---

### D07 — Cross-Floor Route

**Input:**

A source and destination on different floors with a verified staircase connection.

**Expected:**

The route uses the canonical staircase connector.

Each consecutive-floor staircase transition contributes:

```text
26 movement units
```

**Status:** Pending

---

### D08 — Staircase Approach Distance

**Input:**

A room/junction connected horizontally to a staircase access node.

Example:

```text
B021 → STAIR_B_F0
```

with a verified measured horizontal weight.

**Expected:**

The horizontal approach weight remains the measured horizontal distance.

It must not be replaced with `26`.

**Status:** Pending

---

### D09 — Lift Guidance

**Input:**

A route where a lift exists as a physical campus location.

**Expected:**

The lift may be displayed as optional user guidance.

The lift must not be used as a vertical Dijkstra edge.

**Status:** Pending

---

### D10 — Unreachable Route

**Input:**

A source and destination that have no connected path.

**Expected:**

The route engine returns a clear no-route result.

It must not fabricate a path.

**Status:** Pending

---

## 5. Route API Tests

| ID | Request | Expected Result | Status |
|---|---|---|---|
| API01 | Valid authenticated route | Distance + ordered path returned | Pending |
| API02 | Same source and destination | Distance `0`, single-node path | Pending |
| API03 | Invalid source | Validation error | Pending |
| API04 | Invalid destination | Validation error | Pending |
| API05 | Unreachable source/destination | Clear no-route response | Pending |
| API06 | Missing JWT on `/route` | Request rejected | Pending |
| API07 | Invalid JWT on `/route` | Request rejected | Pending |
| API08 | Valid JWT on `/route` | Request accepted if graph request is valid | Pending |
| API09 | `/locations` without authentication | Canonical locations returned | Pending |
| API10 | `/locations` contains canonical IDs | Returned IDs match graph data | Pending |

---

## 6. Authentication Tests

### AUTH01 — Registration

**Purpose:**

Verify that a new user can register according to the authentication implementation.

**Expected:**

- Valid registration is accepted.
- Password is securely hashed.
- Plaintext password is never stored.

**Status:** Pending

---

### AUTH02 — Duplicate User

**Purpose:**

Verify that duplicate user registration is handled correctly.

**Expected:**

The backend rejects the duplicate according to the implemented authentication contract.

**Status:** Pending

---

### AUTH03 — Valid Login

**Purpose:**

Verify successful authentication.

**Expected:**

Valid credentials produce the authentication response defined by the implementation.

JWT information must be provided as required by the API contract.

**Status:** Pending

---

### AUTH04 — Invalid Login

**Purpose:**

Verify rejection of invalid credentials.

**Expected:**

Authentication fails cleanly.

**Status:** Pending

---

### AUTH05 — `/auth/me` Without JWT

**Purpose:**

Verify protected endpoint behavior.

**Expected:**

The request is rejected.

**Status:** Pending

---

### AUTH06 — `/auth/me` With Valid JWT

**Purpose:**

Verify authenticated user retrieval.

**Expected:**

The authenticated user's data is returned.

**Status:** Pending

---

### AUTH07 — `/route` Without JWT

**Purpose:**

Verify that route calculation is protected.

**Expected:**

The request is rejected.

**Status:** Pending

---

### AUTH08 — `/route` With Valid JWT

**Purpose:**

Verify that an authenticated user can access route calculation.

**Expected:**

A valid route request proceeds to the route engine.

**Status:** Pending

---

## 7. Data Validation Tests

| ID | Test | Expected Result | Status |
|---|---|---|---|
| DATA01 | Unknown edge endpoint | Data validation fails | Pending |
| DATA02 | Negative edge weight | Data validation fails | Pending |
| DATA03 | Missing location ID | Data validation fails | Pending |
| DATA04 | Duplicate canonical node ID | Data validation fails | Pending |
| DATA05 | Staircase connector with weight other than `26` | Data validation fails | Pending |
| DATA06 | Invalid floor mapping | Data validation fails | Pending |
| DATA07 | Lift represented as vertical Dijkstra edge | Data validation fails | Pending |
| DATA08 | Unverified physical connection used as verified route data | Data validation fails or route remains unverified | Pending |

---

## 8. Frontend Integration Tests

### UI01 — Location Loading

**Test:**

Load locations through:

```text
GET /locations
```

**Expected:**

The frontend receives and uses the canonical location IDs.

**Status:** Pending

---

### UI02 — Source Selection

**Test:**

Select a valid source location.

**Expected:**

The selected source corresponds to the correct canonical node ID.

**Status:** Pending

---

### UI03 — Destination Selection

**Test:**

Select a valid destination location.

**Expected:**

The selected destination corresponds to the correct canonical node ID.

**Status:** Pending

---

### UI04 — Route Request

**Test:**

Submit a source and destination.

**Expected:**

The frontend sends:

```json
{
  "source": "B018",
  "destination": "A015"
}
```

to:

```text
POST /route
```

with the required JWT authentication.

**Status:** Pending

---

### UI05 — Route Rendering

**Test:**

Receive a valid route response.

**Expected:**

The frontend renders the returned path exactly as supplied by the backend.

The frontend must not calculate a separate shortest path.

**Status:** Pending

---

### UI06 — Distance Display

**Test:**

Receive a valid route response.

**Expected:**

The frontend displays the returned movement-unit distance.

The displayed metric represents normalized movement units.

**Status:** Pending

---

### UI07 — Floor/Block Changes

**Test:**

Display a verified route crossing floors or blocks.

**Expected:**

The interface correctly indicates the floor/block changes represented by the returned node sequence.

**Status:** Pending

---

### UI08 — Optional Animation

**Test:**

Run route animation if implemented.

**Expected:**

The animation follows the backend-returned path.

Animation must not modify the route or calculate a different route.

**Status:** Pending

---

## 9. End-to-End Integration Tests

### E2E01 — Complete Same-Floor Navigation

```text
Login
  ↓
Dashboard
  ↓
Source selection
  ↓
Destination selection
  ↓
POST /route
  ↓
Dijkstra
  ↓
Distance + path
  ↓
SVG route highlight
```

**Expected:**

A verified same-floor route completes successfully from login through visualization.

**Status:** Pending

---

### E2E02 — Complete Cross-Block Navigation

**Expected:**

A fully verified cross-block route can be requested and displayed.

The route must use only verified cross-block connections.

**Status:** Pending

---

### E2E03 — Complete Cross-Floor Navigation

**Expected:**

A fully verified multi-floor route can be requested and displayed.

The route uses the appropriate `26`-unit staircase connector for each consecutive-floor transition.

**Status:** Pending

---

## 10. Regression Tests

Regression testing must be performed after major merges.

At minimum, re-run:

- Graph sanity checks
- Same-node route
- Direct route
- Multi-edge route
- Reverse route
- Cross-block route where verified
- Cross-floor route where verified
- Invalid source
- Invalid destination
- Unreachable route
- Authentication tests
- Protected `/route` access
- `/locations`
- Frontend route rendering

**Status:** Pending

---

## 11. First Integration Gate

The first integration gate is considered passed only when the following complete flow has been verified:

```text
Authenticated user
        ↓
Source selection
        ↓
Destination selection
        ↓
POST /route
        ↓
Canonical weighted graph
        ↓
Dijkstra
        ↓
Distance + ordered path
        ↓
Frontend route visualization
```

All underlying graph data used by the demonstrated route must be verified.

**Status:** Pending

---

## 12. Test Status Definitions

Use the following status values:

```text
Pending
Pass
Fail
Blocked
Unverified
```

### Pending

The test has not yet been executed.

### Pass

The test was executed and the expected behavior was confirmed.

### Fail

The test was executed and the expected behavior was not confirmed.

### Blocked

The test cannot currently be executed because a required dependency is unavailable.

### Unverified

The test depends on physical graph data or measurements that have not yet been verified.

---

## 13. Test Evidence

For important failures or integration tests, record enough information to reproduce the result.

Useful evidence includes:

- Test ID
- Date
- Branch
- Input
- Expected result
- Actual result
- Error message
- Relevant commit
- Relevant file
- Resolution

Do not record fabricated test results.

A test may only be marked `Pass` after it has actually been executed and verified.

---

## 14. Test Ownership

| Area | Primary Owner |
|---|---|
| Graph/data validation | Kushagra |
| Dijkstra correctness | Riddhiraj |
| FastAPI route validation | Riddhiraj |
| Authentication | Kshitish |
| Database validation | Kshitish |
| Frontend integration | Bhavya |
| SVG/map rendering | Anubha |
| Animation behavior | Anubha |
| Regression testing | Kshitish |
| Final integration verification | Bhavya |

All teammates are responsible for reporting failures that affect their work.

---

## 15. Testing Principle

The project must demonstrate that:

```text
One canonical graph
        +
Verified measurements
        +
Non-negative edge weights
        +
Dijkstra
        =
Minimum-cost verified route
```

The project must never claim a route is correct merely because the UI displays a path.

The graph data, algorithm, API response, and frontend visualization must all agree.