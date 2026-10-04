# KIIT CAMPUS25 Navigation System

## Architecture Document

## 1. Project Overview

The KIIT CAMPUS25 Navigation System is a campus navigation application that models Campus 25 as a weighted graph and uses Dijkstra's shortest-path algorithm to find the minimum-cost route between meaningful campus locations.

The project is a DAA project first and a UI project second. The interface exists to demonstrate the graph model and shortest-path algorithm.

The system covers:

- Campus locations represented as graph vertices
- Walkable connections represented as weighted edges
- Measured horizontal movement represented using tile-count units
- Staircase connections between consecutive floors
- Dijkstra shortest-path calculation
- A FastAPI backend
- A Next.js frontend
- SVG-based route visualization
- Authentication using JWT
- SQLite database support for user/authentication data

---

## 2. Core Architecture

The system follows this flow:

LOGIN
↓
DASHBOARD
↓
Select SOURCE
↓
Select DESTINATION
↓
POST /route
↓
Canonical weighted campus graph
↓
Dijkstra
↓
Shortest node sequence + total movement units
↓
SVG/map route highlight
↓
Optional walking animation

The frontend is responsible for user interaction and visualization.

The backend is responsible for navigation logic and API handling.

The canonical campus data is stored separately from the Dijkstra implementation.

---

## 3. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js + Tailwind CSS |
| Backend | FastAPI + Python |
| Database | SQLite |
| ORM | SQLAlchemy |
| Authentication | JWT + password hashing |
| Algorithm | Dijkstra |
| Map | SVG |
| Animation | Framer Motion or approved equivalent |
| Canonical data | JSON |

No additional framework or major library should be introduced without an approved project need.

---

## 4. Graph Model

Campus locations are represented as vertices in a weighted graph.

Meaningful graph vertices may include:

- Rooms
- Room-access points
- Corridor junctions
- Entrances
- Facilities
- Staircase access nodes

Walkable connections are represented as edges.

The project does not represent every physical floor tile as a graph node.

Tile counts are used to determine horizontal edge weights.

Movement is bidirectional unless a physical connection is explicitly one-way.

Dijkstra is used because all graph weights are non-negative and the objective is to minimize total movement cost.

---

## 5. Edge Weight Rules

### Horizontal movement

Horizontal corridor and room-access edges use the measured tile count as their movement cost.

Example:

B018 → B019 = 38 movement units

### Multi-segment measurements

If a measurement contains multiple segments, the segments are added together.

Example:

20 straight + 20 left = 40 movement units

### Staircase approach

A measured distance from a room or junction to a staircase access node is a normal horizontal edge.

For example:

B021 → staircase = 20

This represents the horizontal movement required to reach the staircase access node.

### Staircase floor transition

Every staircase connecting two consecutive floors has a fixed cost of 26 movement units by project convention.

For example:

STAIR_B_F0 ↔ STAIR_B_F1 = 26

The 26-unit value applies only to the vertical staircase transition, not to the horizontal distance required to reach the staircase.

### Lifts

Lifts are not used as vertical Dijkstra graph transitions.

Lift locations may be displayed as optional user guidance.

---

## 6. Floors

The project models Floors 0, 1, 2 and 3.

Floor-specific locations use floor-specific node IDs.

Room availability must follow the supplied campus maps. A room must not be created merely because a numeric naming pattern suggests that it exists.

The graph uses verified staircase connectors for movement between consecutive floors.

The repeated floor topology may be used only where the supplied maps indicate that the corresponding layout repeats. Any physically different or unverified segment must be marked UNVERIFIED and measured before it is used in a claimed shortest route.

---

## 7. Backend and Frontend Boundary

### Frontend

The frontend owns:

- Login interface
- Dashboard
- Source/destination selection
- Route result display
- SVG visualization
- Route highlighting
- Optional walking animation
- Floor/block transition presentation

The frontend must use canonical node IDs returned or provided by the backend/data layer.

The frontend must not implement a second shortest-path algorithm.

### Backend

The backend owns:

- Canonical graph loading
- Graph representation
- Dijkstra implementation
- Route calculation
- Path reconstruction
- Navigation API endpoints
- Location retrieval

All navigation logic must remain behind the backend API.

---

## 8. Authentication Boundary

Authentication is handled by the backend.

Public endpoints:

- POST /auth/register
- POST /auth/login
- GET /locations

Authenticated endpoints:

- GET /auth/me
- POST /route

A valid JWT is required for protected endpoints.

---

## 9. Navigation API Flow

The frontend sends:

POST /route

with:

```json
{
  "source": "B018",
  "destination": "A015"
}