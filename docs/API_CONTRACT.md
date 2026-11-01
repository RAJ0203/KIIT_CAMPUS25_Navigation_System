# API Contract

## 1. Purpose

This document defines the frozen backend API contract for the KIIT CAMPUS25 Navigation System.

The frontend and backend must follow these endpoint names, request fields, response fields, and authentication requirements.

No endpoint, request field, or response field should be changed silently.

---

## 2. Base API Endpoints

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
| GET | `/` | API health check | Public |
| POST | `/auth/register` | Create a new user | Public |
| POST | `/auth/login` | Authenticate a user and return JWT information | Public |
| GET | `/auth/me` | Return the currently authenticated user | JWT required |
| GET | `/locations` | Return the canonical location list | Public |
| POST | `/route` | Calculate the shortest route | JWT required |

---

## 3. Authentication

The system uses JWT-based authentication.

Passwords must be hashed and must never be stored in plaintext.

Protected endpoints require a valid JWT.

Protected endpoints:

- `GET /auth/me`
- `POST /route`

Public endpoints:

- `GET /`
- `POST /auth/register`
- `POST /auth/login`
- `GET /locations`

### Authorization Header

Protected endpoints require the JWT in the following format:

```http
Authorization: Bearer <token>
```

---

## 4. POST /auth/register

### Purpose

Create a new user account.

### Authentication

Public. No JWT required.

### Request

The exact registration request fields are to be finalized by the authentication/database implementation while remaining compatible with the project's authentication requirements.

### Requirements

- User credentials must be validated.
- Passwords must be securely hashed before storage.
- Plaintext passwords must never be stored.

---

## 5. POST /auth/login

### Purpose

Authenticate an existing user.

### Authentication

Public. No JWT required.

### Request

The exact login request fields are to be finalized by the authentication/database implementation while remaining compatible with the project's authentication requirements.

### Response

Successful authentication provides JWT authentication information and basic user information.

The exact response field names are to be finalized by the authentication implementation before the authentication contract is considered complete.

---

## 6. GET /auth/me

### Purpose

Return information about the currently authenticated user.

### Authentication

JWT required.

### Request

No request body is required.

A valid JWT must be supplied through the Authorization header.

### Behavior

- Valid JWT → return authenticated user data.
- Missing or invalid JWT → reject the request.

---

## 7. GET /locations

### Purpose

Return the canonical campus locations available for source and destination selection.

### Authentication

Public. No JWT required.

### Data requirements

- Locations must use the canonical node IDs defined by the graph/data contract.
- The frontend must not create its own alternative location IDs.
- Location data is loaded from the canonical `locations.json` file.

### Successful Response

HTTP status: `200 OK`

```json
{
  "locations": [
    {
      "id": "B018",
      "name": "Room B018",
      "block": "B",
      "floor": 0,
      "x": 120,
      "y": 340,
      "type": "room"
    }
  ]
}
```

The example is illustrative. Actual location records come from the canonical campus data.

### Error Response

- `503 Service Unavailable` → Canonical campus graph data is missing or invalid.

---

## 8. POST /route

### Purpose

Calculate the shortest path between two campus locations using Dijkstra's shortest-path algorithm.

### Authentication

JWT required.

A valid JWT must be supplied through the Authorization header.

### Request

Content-Type: `application/json`

```json
{
  "source": "B018",
  "destination": "A015"
}
```

### Request Fields

| Field | Type | Description |
|---|---|---|
| `source` | String | Canonical ID of the starting location |
| `destination` | String | Canonical ID of the destination location |

Both fields are required and must contain at least one character.

Leading and trailing whitespace is removed before location validation.

### Successful Response

HTTP status: `200 OK`

```json
{
  "distance": 42,
  "path": [
    "B018",
    "B019",
    "B020",
    "A015"
  ]
}
```

The example values are illustrative and do not represent a verified campus route.

### Response Fields

| Field | Type | Description |
|---|---|---|
| `distance` | Integer | Total shortest-path distance in movement units |
| `path` | Array of Strings | Ordered location IDs from source to destination |

### Response Requirements

- The path must begin with the requested source.
- The path must end with the requested destination.
- Intermediate elements must be valid canonical location IDs.
- Distance must represent the total weight of the selected shortest path.
- The algorithm must use Dijkstra's algorithm.
- Edge weights must follow the canonical graph data.

### Error Responses

| HTTP Status | Condition | Description |
|---|---|---|
| `401 Unauthorized` | Missing or invalid JWT | Authentication is required |
| `404 Not Found` | Source location does not exist | Invalid source ID |
| `404 Not Found` | Destination location does not exist | Invalid destination ID |
| `404 Not Found` | No route exists | No valid path connects the selected locations |
| `422 Unprocessable Entity` | Invalid request body | Missing or invalid request fields |
| `503 Service Unavailable` | Campus graph unavailable | Canonical campus data is missing or invalid |

### Example Error Response

```json
{
  "detail": "No route exists between the selected locations."
}
```

The exact `detail` message depends on the error condition.

---

## 9. Navigation and Graph Rules

The backend navigation implementation must follow the frozen graph model:

- Dijkstra's algorithm is used for shortest-path calculation.
- Horizontal edge weights represent measured tile counts.
- One tile equals one movement unit.
- Staircase connections between consecutive floors have a weight of 26 movement units.
- Lifts are not included as vertical Dijkstra edges.
- `edges.json` is the only source for routing adjacency.
- `floors.json` is used to validate staircase connectors and must not add duplicate adjacency connections.
- Each undirected physical connection is stored once in `edges.json`. The backend creates reverse adjacency automatically.
- All edge weights must be non-negative.

---

## 10. Contract Change Policy

The API contract is shared between the frontend and backend teams.

Any change to the following must be communicated and agreed upon before implementation:

- Endpoint names
- HTTP methods
- Request field names
- Response field names
- Authentication requirements
- Response status codes
- Graph and navigation rules

The frontend must integrate according to this document and must not independently assume undocumented backend behavior.