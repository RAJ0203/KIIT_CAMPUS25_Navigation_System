# KIIT CAMPUS25 Navigation System

An interactive, graph-based campus navigation application developed as a **Design and Analysis of Algorithms (DAA)** project at KIIT University.

The system represents KIIT Campus 25 as a weighted graph and applies **Dijkstra's Shortest Path Algorithm** to calculate minimum-cost routes between supported campus locations.

## 1. Project Overview

Navigating a multi-floor campus can be challenging when locating classrooms, laboratories, facilities and other destinations.

The KIIT CAMPUS25 Navigation System aims to simplify campus navigation through an interactive map interface and shortest-path calculation.

The primary academic objective is to demonstrate the practical application of graph data structures and Dijkstra's algorithm.

## 2. Features

- Interactive campus navigation dashboard.
- Four-floor map selection: Ground, First, Second and Third.
- Source and destination selection.
- Shortest-path calculation using Dijkstra's algorithm.
- Weighted graph representation of campus locations and connections.
- Route and waypoint visualization.
- Navigation playback with Start, Pause, Resume and Replay controls.
- Automatic floor switching during navigation.
- Active waypoint highlighting.
- User registration and authentication.

## 3. Algorithm and Graph Representation

The campus is represented as a weighted graph:

- **Vertices (Nodes):** Meaningful campus locations, junctions and staircase points.
- **Edges:** Traversable connections between locations.
- **Edge Weights:** Movement costs associated with connections.

Horizontal movement weights are based on measured floor-tile counts, where one tile represents one movement unit.

Staircase transitions between consecutive floors are represented as graph edges with a cost of 26 movement units.

Lifts are maintained as location metadata and are not used as vertical Dijkstra connections.

### Dijkstra's Shortest Path Algorithm

When a user selects a source and destination:

1. The backend retrieves the campus graph.
2. Dijkstra's algorithm calculates the minimum-cost available path.
3. The resulting path and total cost are returned by the backend.
4. The frontend displays the route and its waypoints.

**Time Complexity:** `O((V + E) log V)`

Using an adjacency-list representation and a min-priority queue, where V is the number of vertices and E is the number of edges.

## 4. Technology Stack

| Component | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS, CSS |
| Animations | Framer Motion |
| Backend | Python, FastAPI |
| Database | SQLite |
| ORM | SQLAlchemy |
| Authentication | JWT |
| Algorithm | Dijkstra's Shortest Path |
| Graph Storage | JSON |

## 5. Project Structure

```text
KIIT_CAMPUS25_Navigation_System/
│
├── backend/                 # FastAPI backend
├── frontend/                # Next.js frontend
│   ├── public/               # Campus maps and static assets
│   └── src/                  # Application source code
│
├── data/                     # Canonical campus graph data
│   ├── locations.json
│   ├── edges.json
│   └── floors.json
│
├── docs/                     # Technical documentation
├── tests/                    # Project tests
├── requirements.txt          # Python dependencies
├── README.md
└── .env.example              # Backend environment template
```

## 6. Local Setup and Installation

### Prerequisites

- Python 3.10 or later
- Node.js and npm
- Git

### Step 1: Clone the repository

```bash
git clone https://github.com/RAJ0203/KIIT_CAMPUS25_Navigation_System.git

cd KIIT_CAMPUS25_Navigation_System
```

### Step 2: Set up the backend

Create a Python virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Create a local `.env` file by copying `.env.example` and configure a secure JWT secret key.

Start the backend from the repository root:

```bash
python -m uvicorn app.main:app --reload --app-dir backend --env-file .env
```

Backend URL:

`http://127.0.0.1:8000`

Interactive API documentation:

`http://127.0.0.1:8000/docs`

### Step 3: Set up the frontend

Open a separate terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm ci
```

Create a `.env.local` file with:

```env
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend URL:

`http://localhost:3000/dashboard`

Run the backend and frontend in separate terminals.

## 7. Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Authenticate a user |
| GET | `/auth/me` | Retrieve authenticated user details |
| GET | `/locations` | Retrieve campus locations |
| POST | `/route` | Calculate a route between two locations |

The route endpoint requires JWT authentication.

Refer to the interactive API documentation at `/docs` for request and response details.

## 8. Documentation

Detailed technical documentation is available in the `docs/` directory.

| Document | Description |
|---|---|
| [Architecture](docs/ARCHITECTURE.md) | System architecture and design |
| [API Contract](docs/API_CONTRACT.md) | Backend API specifications |
| [Data Schema](docs/DATA_SCHEMA.md) | Graph and data structures |
| [Team State](docs/TEAM_STATE.md) | Shared project status |
| [Test Matrix](docs/TEST_MATRIX.md) | Testing strategy |
| [Validation Report](docs/VALIDATION_REPORT.md) | Graph validation results |
| [Viva Notes](docs/VIVA_NOTES.md) | Technical and viva preparation |
| [Demo Limitations](docs/DEMO_KNOWN_LIMITATIONS.md) | Known limitations and demo considerations |

## 9. Current Scope and Limitations

The navigation graph contains verified campus locations and connections. Some campus areas have incomplete connectivity because certain corridor endpoints and movement measurements remain unresolved.

The application calculates routes supported by the current canonical graph and reports when a route is unavailable rather than introducing unverified connections.

Canonical graph data is maintained separately from visual map coordinates.

## 10. Team

Developed by a team of five students from KIIT University.

- Bhavya Mishra
- Kushagra
- Riddhiraj
- Anubha
- Kshitish

**Institution:** Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar

**Subject:** Design and Analysis of Algorithms (DAA)

**Project:** KIIT CAMPUS25 Navigation System
