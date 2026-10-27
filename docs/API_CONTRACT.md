# API Contract

## 1. Purpose

This document defines the frozen backend API contract for the KIIT CAMPUS25 Navigation System.

The frontend and backend must follow these endpoint names, request fields, response fields, and authentication requirements.

No endpoint, request field, or response field should be changed silently.

---

## 2. Base API Endpoints

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
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

- `POST /auth/register`
- `POST /auth/login`
- `GET /locations`

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

A valid JWT must be supplied through the authentication mechanism.

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

Locations must use the canonical node IDs defined by the graph/data contract.

The frontend must not create its own alternative location IDs.

### Example location shape

```json
{
  "id": "B018",
  "name": "Room B018",
  "block": "B",
  "floor": 0,
  "x": 120,
  "y": 340,
  "type": "room"
}