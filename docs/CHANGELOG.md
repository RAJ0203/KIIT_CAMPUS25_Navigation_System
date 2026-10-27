# Changelog

All meaningful project-level, architecture-level, data-contract, API-contract, and workflow changes are recorded here.

This file documents decisions and completed changes.

It must not be used to record unimplemented ideas as if they were completed work.

---

## 2026-10-04

### Project foundation established

**Status:** Completed

The initial shared project foundation was established.

Changes:

- Created the shared documentation structure.
- Established the project architecture documentation.
- Established the backend API contract documentation.
- Established the canonical graph/data schema documentation.
- Established the shared team-state documentation.
- Created the project foundation feature branch.

Git branch:

```text
feature/project-foundation
```

Initial foundation commit:

```text
8ec0695
```

Commit message:

```text
Initialize project architecture and shared state
```

---

### Architecture contract defined

**Status:** Completed

Created and populated:

```text
docs/ARCHITECTURE.md
```

The architecture contract defines:

- Project architecture
- Core weighted-graph navigation model
- Dijkstra as the shortest-path algorithm
- Frozen technology stack
- Graph/data responsibilities
- Frontend/backend boundaries
- Authentication boundary
- Canonical data separation
- Initial integration target

Commit:

```text
5d30232
```

Commit message:

```text
Define project architecture
```

---

### API contract defined

**Status:** Completed

Created and populated:

```text
docs/API_CONTRACT.md
```

The API contract defines the frozen endpoints:

```text
POST /auth/register
POST /auth/login
GET  /auth/me
GET  /locations
POST /route
```

Authentication requirements:

```text
/auth/register  → Public
/auth/login     → Public
/auth/me        → JWT required
/locations      → Public
/route          → JWT required
```

The route request remains:

```json
{
  "source": "B018",
  "destination": "A015"
}
```

The route response shape remains:

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

The example distance `91` is an API-shape example only and is not a verified final route distance.

The exact registration/login request and response field names remain intentionally unfrozen because the authoritative project specification does not define those exact fields.

Commit:

```text
46093f0
```

Commit message:

```text
Define backend API contract
```

---

### Canonical data schema defined

**Status:** Completed

Created and populated:

```text
docs/DATA_SCHEMA.md
```

The canonical graph data files are:

```text
data/
├── locations.json
├── edges.json
└── floors.json
```

The schema establishes:

- Canonical node IDs
- Location metadata
- SVG coordinates
- Numeric edge weights
- Edge types
- Floor metadata
- Staircase connectors
- Optional lift metadata
- Separation of canonical data from Dijkstra temporary state

The fixed staircase convention is:

```text
26 movement units
```

This value applies only to the vertical staircase edge between corresponding staircase nodes on consecutive floors.

Measured horizontal distances to staircase access nodes remain normal horizontal edge weights.

---

### Shared team state established

**Status:** Completed

Created and populated:

```text
docs/TEAM_STATE.md
```

The shared state records:

- Team ownership
- Current repository state
- Current branches
- Completed documentation work
- Kushagra's current local graph/data status
- Planned integration sequence
- First integration milestone
- Testing requirements
- AI operating rules
- Contract change-control rules

Current project-foundation branch:

```text
feature/project-foundation
```

The project foundation branch is intended to merge into:

```text
dev
```

It must not merge directly into:

```text
main
```

---

## Current Contract Decisions

### Staircase measurement clarification

**Status:** Frozen

Measured values such as:

```text
B021 → staircase = 20
B005 → staircase = 18
B016 → staircase = 28
B015 → staircase = 24
```

represent horizontal walking distance to staircase access nodes.

They are not vertical staircase costs.

The vertical staircase transition between consecutive floors uses:

```text
26 movement units
```

Example:

```text
B021 → STAIR_B_F0
weight = 20
```

and:

```text
STAIR_B_F0 → STAIR_B_F1
weight = 26
```

These are separate graph edges.

---

### `/route` authentication clarification

**Status:** Frozen

The route endpoint requires a valid JWT.

```text
POST /route
```

is therefore a protected endpoint.

Current authentication matrix:

| Endpoint | Authentication |
|---|---|
| `POST /auth/register` | Public |
| `POST /auth/login` | Public |
| `GET /locations` | Public |
| `GET /auth/me` | JWT required |
| `POST /route` | JWT required |

This clarification does not change the route endpoint name or route request/response shape.

---

## Git Workflow

**Status:** Frozen

The project follows:

```text
main
  ↑
release PR
  │
dev
  ↑
feature branches
```

The golden rule is:

```text
Nobody pushes directly to main.
```

Feature work is developed on feature branches and merged into `dev`.

Only tested `dev` changes should reach `main`.

Expected feature branches include:

```text
feature/graph
feature/backend
feature/frontend
feature/auth
feature/animation
```

Feature branches should be created when teammates begin their work from the latest `dev`.

Empty feature branches should not be created merely for the sake of having them.

---

## Data Integrity Rules

**Status:** Frozen

The project must:

- Use one canonical node naming convention.
- Use one canonical graph.
- Use one canonical data schema.
- Never invent campus measurements.
- Never invent physical connections.
- Mark genuinely missing measurements as `UNVERIFIED`.
- Keep staircase vertical transitions at `26` movement units.
- Keep horizontal staircase approach measurements separate from vertical staircase transitions.
- Keep lifts out of vertical Dijkstra transitions.
- Ensure edge endpoints exist in `locations.json`.
- Ensure edge weights are non-negative integers.
- Ensure cross-block connections correspond to real walkable connections.
- Ensure floor-specific topology is verified before being used in claimed shortest routes.

---

## API/Data Change-Control Rules

The following changes require coordination before implementation:

- Endpoint names
- HTTP methods
- Request fields
- Response fields
- Authentication requirements
- Canonical node ID format
- Graph/data format
- Edge format
- Edge weights
- Staircase cost
- Database schema
- Algorithm
- Responsibility boundaries
- Technology stack

A proposed change must:

1. Be explained and justified.
2. Identify affected files.
3. Identify affected teammates.
4. Be recorded in this changelog.
5. Update affected shared contracts.
6. Receive the required project approval.
7. Be implemented consistently across the project.

No silent contract changes are permitted.

---

## Current Project Status

At the time of this changelog update:

### Completed

- Shared repository foundation
- `dev` branch setup
- `feature/project-foundation`
- `docs/ARCHITECTURE.md`
- `docs/API_CONTRACT.md`
- `docs/DATA_SCHEMA.md`
- `docs/TEAM_STATE.md`

### In progress

- Canonical graph/data preparation
- Backend implementation
- Authentication/database implementation
- Frontend/SVG implementation
- Testing infrastructure

### Not yet complete

The first complete navigation integration is not yet implemented.

Target flow:

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
SVG route visualization
```

---

## Changelog Rules

When adding future entries:

- Record completed changes accurately.
- Do not record proposals as completed implementation.
- Include the affected files where useful.
- Include relevant commit hashes when a change has been committed.
- Record contract changes before or alongside their implementation.
- Do not silently rewrite historical entries.
- Keep the changelog concise and project-focused.

---

## Project Principle

```text
ONE GRAPH.
ONE SCHEMA.
ONE API CONTRACT.
ONE SOURCE OF TRUTH.
```