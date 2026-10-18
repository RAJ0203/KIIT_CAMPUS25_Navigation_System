# Kshitish — Auth + Database + QA Initial Handoff

This package is the initial Auth/DB/QA implementation based on the Master Team Coordination Document.

## Intended repository paths

```text
backend/app/database.py
backend/app/models.py
backend/app/security.py
backend/app/dependencies.py
backend/app/auth_router.py
backend/app/schemas/auth.py

tests/conftest.py
tests/test_auth.py
tests/test_navigation_contract.py

docs/TEST_MATRIX.md
```

`main.py` is intentionally not created here because FastAPI application integration is owned by Riddhiraj/Bhavya.

## Auth schema proposal

`users` table:

- `id` — integer primary key
- `username` — unique, required
- `password_hash` — required; never plaintext
- `created_at` — required UTC timestamp

This is the initial auth-only schema. If the team wants email, roles, or other fields, that is a deliberate schema change and must follow the Master Document's change-control process.

## JWT

- Algorithm: HS256 by default.
- Secret: required through `JWT_SECRET_KEY` environment variable.
- Expiry: `JWT_EXPIRE_MINUTES`, default 60 minutes.
- Subject (`sub`): user ID.

## Password hashing

PBKDF2-HMAC-SHA256 with a random 16-byte salt is used so the starter structure has no additional password-hashing package dependency. The stored format records the algorithm, iteration count, salt and derived key. Plaintext is never persisted.

## Integration

Riddhiraj's FastAPI app should include `backend.app.auth_router.router`. The app's `get_db` dependency must remain the shared database dependency; do not create a second database session layer.

## Current limitations

The repository currently has only the initial `.gitignore` and one-line README on GitHub. No backend/data graph/API implementation was present to integrate against when this package was prepared.
