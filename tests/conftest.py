import os

# Test-only JWT secret (>=32 bytes). Production/development must set JWT_SECRET_KEY explicitly.
os.environ.setdefault("JWT_SECRET_KEY", "test-only-secret-change-me-32-bytes-long")
