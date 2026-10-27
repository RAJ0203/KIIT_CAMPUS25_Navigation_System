# Team State

## 1. Purpose

This document records the current shared state of the KIIT CAMPUS25 Navigation System.

It is the handoff document for the five students and their assisting GPTs.

Before making integration, architecture, graph, API, or Git decisions, teammates should use this document together with:

- `docs/ARCHITECTURE.md`
- `docs/DATA_SCHEMA.md`
- `docs/API_CONTRACT.md`
- `docs/CHANGELOG.md`
- `docs/TEST_MATRIX.md`
- `docs/VIVA_NOTES.md`

The Master Coordination Document remains the authoritative project specification.

---

## 2. Project

**Project:** KIIT CAMPUS25 Navigation System

**Primary objective:** Build a campus navigation system that models KIIT Campus 25 as a weighted graph and uses Dijkstra's algorithm to calculate minimum-cost walking routes.

**Primary DAA concept:**

```text
Weighted Graph
      ↓
Dijkstra
      ↓
Shortest path
      ↓
Distance + ordered node path
      ↓
Frontend route visualization
```

The project is DAA-first.

Authentication, map rendering, animation, and styling support the core navigation system but must not replace or overshadow the graph and shortest-path implementation.

---

## 3. Team

| Member | Responsibility |
|---|---|
| Bhavya | Lead Architect + Frontend + Integration |
| Kushagra | Graph/Data Engineering |
| Riddhiraj | Dijkstra + FastAPI Backend |
| Anubha | UI/UX + SVG + Animation |
| Kshitish | Authentication + Database + QA |

---

## 4. Ownership

### Bhavya — Lead Architect + Frontend + Integration

Responsible for:

- Overall architecture
- Repository structure
- Frontend dashboard
- API integration
- Release coordination
- Final merge decisions
- `docs/ARCHITECTURE.md`
- `docs/TEAM_STATE.md`
- Coordination of graph/data/API contracts
- Keeping `main` stable

Bhavya must not independently redefine:

- Node naming
- Edge schema
- API contract
- Dijkstra behavior
- Canonical graph structure

---

### Kushagra — Graph/Data Engineering

Responsible for:

- Normalizing collected A/B/C tile-count measurements
- Creating the canonical node naming convention
- Creating the junction list from maps and measured turns
- Creating floor-specific node mappings for Floors 0–3
- Adding staircase edges with the frozen weight of `26`
- Keeping lift locations as metadata/optional UI points rather than vertical Dijkstra edges
- Producing:
  - `data/locations.json`
  - `data/edges.json`
  - `data/floors.json`

Current status:

- Graph/data work has started locally.
- Kushagra's work has not yet been pushed to GitHub.
- His local work must be preserved before any branch switching, rebasing, or integration.
- No local graph work should be discarded, overwritten, or silently redesigned.

---

### Riddhiraj — Dijkstra + FastAPI Backend

Responsible for:

- Loading the canonical graph
- Building the adjacency-list representation
- Implementing Dijkstra
- Implementing relaxation
- Implementing predecessor/path reconstruction
- Implementing `GET /locations`
- Implementing `POST /route`
- Writing route and graph tests

Backend work must consume the canonical graph data rather than creating a second graph representation.

---

### Anubha — UI/UX + SVG + Animation

Responsible for:

- Minimal dashboard visual hierarchy
- SVG map representation
- SVG coordinate strategy
- Mapping visual node IDs to canonical node IDs
- Rendering source and destination
- Rendering the returned shortest path
- Showing floor/block changes
- Optional walking animation
- Optional lift guidance without changing the route algorithm

---

### Kshitish — Authentication + Database + QA

Responsible for:

- SQLite authentication schema
- SQLAlchemy integration
- Registration/login
- JWT authentication
- Password hashing
- Route/API validation tests
- 15–25 route test cases after graph data stabilizes
- Regression testing after major merges

---

## 5. Frozen Technology Stack

The project stack is:

### Frontend

- Next.js
- Tailwind CSS
- SVG
- Framer Motion or approved equivalent for optional animation

### Backend

- FastAPI
- Python

### Database

- SQLite
- SQLAlchemy

### Authentication

- JWT
- Secure password hashing

### Algorithm

- Dijkstra's shortest-path algorithm

### Data

- JSON

No additional library or framework should be introduced without a documented need and project approval.

---

## 6. Canonical Graph Rules

The campus is modeled as one weighted graph.

### Nodes

Graph nodes represent meaningful navigational locations.

Examples include:

- Rooms
- Junctions
- Room-access points
- Entrances
- Facilities
- Staircase access nodes

Every floor tile must not become a graph node.

Tiles are used to measure walking distances.

### Edges

Edges represent walkable physical connections.

Horizontal edge weights are based on measured tile counts.

Multi-segment measurements must be normalized into one numeric edge weight.

Example:

```text
20 straight + 20 left
```

becomes:

```text
40 movement units
```

Movement is bidirectional unless the physical connection is explicitly one-way.

---

## 7. Staircase Rule

The fixed staircase convention is:

```text
26 movement units
```

This value applies only to the vertical staircase edge connecting corresponding staircase nodes on consecutive floors.

Example:

```text
B021 → STAIR_B_F0
weight = 20
```

is a horizontal approach measurement.

Whereas:

```text
STAIR_B_F0 → STAIR_B_F1
weight = 26
```

is the vertical staircase transition.

The two must not be confused.

Measured horizontal distances to a staircase are not substitutes for the `26`-unit vertical staircase edge.

---

## 8. Lift Rule

Lifts are not vertical Dijkstra edges.

They may be represented as optional metadata or user guidance.

The route engine uses staircase connectors for vertical graph transitions.

---

## 9. Floor Rules

The project represents Floors:

```text
0
1
2
3
```

The supplied floor layout may be treated as repeated topology when the corresponding physical segments are confirmed to match.

Any physically different or uncertain segment must be marked:

```text
UNVERIFIED
```

and measured before being used in a claimed shortest route.

The graph must not silently assume unverified physical connections.

---

## 10. Canonical Data Files

The canonical graph data consists of:

```text
data/
├── locations.json
├── edges.json
└── floors.json
```

### `locations.json`

Contains:

- Canonical node ID
- Display name
- Block
- Floor
- SVG `x` and `y` coordinates
- Optional metadata

Must not contain Dijkstra temporary state or duplicated edge weights.

### `edges.json`

Contains:

- `from`
- `to`
- Numeric `weight`
- Optional edge type

Must not contain UI coordinates or raw measurement prose.

### `floors.json`

Contains:

- Floor/block metadata
- Floor-to-floor staircase connectors
- Optional lift metadata

Must not contain Dijkstra temporary state.

---

## 11. Frozen API

The current backend endpoints are:

| Method | Endpoint | Authentication |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| GET | `/auth/me` | JWT required |
| GET | `/locations` | Public |
| POST | `/route` | JWT required |

The route request is:

```json
{
  "source": "B018",
  "destination": "A015"
}
```

The route response shape is:

```json
{
  "distance": 91,
  "path": [
    "B018",
    "B019",
    "B020",
    "...",
    "A015"
  ]
}
```

The value `91` is only an API-shape example.

It is not a verified final route distance.

Exact registration/login request and response fields are not frozen beyond the authentication requirements and must not be invented without coordination.

---

## 12. Frontend/Backend Boundary

### Frontend

Responsible for:

- Source selection
- Destination selection
- API requests
- Route display
- Distance display
- Floor/block change display
- SVG route visualization
- Optional animation

### Backend

Responsible for:

- Graph loading
- Input validation
- Dijkstra
- Path reconstruction
- Returning distance
- Returning ordered canonical node path

The frontend must render the route returned by the backend.

The frontend must not implement a second shortest-path algorithm.

---

## 13. Git Branch Structure

The project uses:

```text
main
  ↑
release PR
  │
dev
  ↑
feature branches
```

Expected feature branches include:

```text
feature/graph
feature/backend
feature/frontend
feature/auth
feature/animation
```

The actual branch must be created when the teammate begins that work from the latest `dev`.

### Git rules

- Nobody pushes directly to `main`.
- Feature branches merge into `dev`.
- Only tested `dev` changes reach `main`.
- Pull the latest `dev` before starting new work.
- Do not rewrite another teammate's work merely to simplify a local branch.
- Do not create empty feature branches just for the sake of having them.

---

## 14. Current Git State

### Repository

```text
KIIT_CAMPUS25_Navigation_System
```

### Current working branch

```text
feature/project-foundation
```

### Branch status

The branch is currently synchronized with:

```text
origin/feature/project-foundation
```

The working tree is clean.

### Project foundation commits

Current commits on the project-foundation branch include:

```text
8ec0695  Initialize project architecture and shared state
5d30232  Define project architecture
46093f0  Define backend API contract
```

### Pull Request

A pull request exists from:

```text
feature/project-foundation
```

into:

```text
dev
```

The project foundation PR must merge into `dev`, not directly into `main`.

---

## 15. Completed Foundation Work

The following shared documents have been populated and committed:

```text
docs/ARCHITECTURE.md
docs/API_CONTRACT.md
docs/DATA_SCHEMA.md
```

The initial shared documentation files were created as part of the project foundation.

The remaining shared-state documents are:

```text
docs/TEAM_STATE.md
docs/CHANGELOG.md
docs/TEST_MATRIX.md
docs/VIVA_NOTES.md
```

---

## 16. Current Project Status

### Completed

- Repository established
- `dev` branch established
- `feature/project-foundation` established
- Initial shared documentation files created
- `ARCHITECTURE.md` defined
- `API_CONTRACT.md` defined
- `DATA_SCHEMA.md` defined
- Project foundation changes committed and pushed

### In progress

- Shared project-state documentation
- Kushagra's canonical graph/data work
- Backend implementation
- Authentication/database implementation
- Frontend/SVG implementation
- Testing infrastructure

### Not yet considered complete

The project is not yet at the first integration milestone.

The following complete flow still needs to be implemented and tested:

```text
Authenticated user
        ↓
Source selection
        ↓
Destination selection
        ↓
POST /route
        ↓
Dijkstra
        ↓
Distance + ordered path
        ↓
Frontend route visualization
```

---

## 17. Kushagra Graph/Data Integration Status

Kushagra's current graph/data work exists only on his local machine.

Nothing from that work has been pushed to GitHub yet.

Before changing Kushagra's Git state, the following must be inspected:

```bash
git status
git branch
git log --oneline --decorate -5
```

His existing local work must be backed up and preserved.

The team must not:

- Delete his work
- Force-reset his work
- Overwrite his local branch
- Rebuild his graph from scratch without reason
- Push unreviewed graph work directly to `main` or `dev`

The intended next integration step is to safely bring his work onto:

```text
feature/graph
```

after the shared foundation has been established.

---

## 18. Immediate Integration Sequence

The current project sequence is:

```text
1. Populate shared documentation
        ↓
2. Push documentation changes
        ↓
3. Merge project foundation into dev
        ↓
4. Safely bring Kushagra's graph work onto feature/graph
        ↓
5. Create other feature branches when teammates begin work
        ↓
6. Implement and test individual components
        ↓
7. Integrate through dev
        ↓
8. Test complete navigation flow
        ↓
9. Release tested dev to main
```

Do not skip the verification steps between these stages.

---

## 19. First Integration Milestone

The first meaningful end-to-end milestone is:

```text
Verified source selector
        ↓
Verified destination selector
        ↓
Authenticated POST /route
        ↓
Canonical graph
        ↓
Dijkstra
        ↓
Returned ordered path + distance
        ↓
SVG route highlight
```

This milestone demonstrates the actual DAA value of the project.

Optional animation and additional visual polish come after the core navigation path works correctly.

---

## 20. Required Testing Categories

The project must eventually test at least:

- Same-node route
- Direct route
- Multi-edge route
- Reverse route
- Cross-block route
- Cross-floor route
- Lift guidance behavior
- Invalid source
- Invalid destination
- Unreachable route
- Authentication
- Protected route access

Routes must not be presented as verified when their underlying graph measurements or connections are still UNVERIFIED.

---

## 21. AI Handoff Rules

Every GPT assisting the project must:

- Treat the Master Coordination Document and repository shared-state files as the source of truth.
- Never invent campus locations.
- Never invent measurements.
- Never invent route distances.
- Never invent physical connections.
- Never create a second node naming convention.
- Never create a second graph implementation in another layer.
- Mark genuinely missing measurements as `UNVERIFIED`.
- Use the `26`-unit staircase cost only for staircase edges.
- Never silently change API endpoints, request fields, response fields, node IDs, edge format, or data schema.
- State which files a code suggestion changes.
- Provide a test or verification procedure for implementations.
- Never claim that code works unless it has actually been run or tested.
- Avoid unnecessary libraries.
- Avoid features outside the frozen project scope without approval.
- Provide a handoff summary after substantial work.

---

## 22. Change Control

Changes to the following require coordination:

- Node IDs
- Edge format
- Edge weights
- Staircase cost
- API endpoints
- API request fields
- API response fields
- Database schema
- Responsibility boundaries
- Dijkstra implementation
- Frozen technology stack

Before implementing a contract-level change:

1. Explain the proposed change.
2. Explain why it is needed.
3. Identify affected files.
4. Identify affected teammates.
5. Record the proposal in `CHANGELOG.md`.
6. Update the relevant shared contract.
7. Obtain the required approval.
8. Implement consistently across the project.

No silent contract changes are permitted.

---

## 23. Current Source of Truth

When information conflicts, use this priority:

```text
Master Coordination Document
        ↓
Shared project-state documents
        ↓
Canonical graph/data files
        ↓
Implemented code
        ↓
Individual assumptions
```

Individual assumptions never override the shared project contract.

The project principle is:

```text
ONE GRAPH.
ONE SCHEMA.
ONE API CONTRACT.
ONE SOURCE OF TRUTH.
```