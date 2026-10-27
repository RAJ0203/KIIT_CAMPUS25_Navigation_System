# Auth/QA dependency delta

The auth skeleton relies on the project's frozen FastAPI + SQLAlchemy stack and adds only:

- `PyJWT` — JWT encoding/decoding.
- `pytest` — test execution (dev dependency).
- `httpx` — FastAPI `TestClient` dependency in the current test setup (dev dependency).

Password hashing uses Python's standard-library `hashlib.pbkdf2_hmac`, so no separate hashing package is required by this starter.
