"""Password hashing and JWT helpers.

Plaintext passwords must never be stored.
PBKDF2-HMAC-SHA256 is used for password hashing.
JWT authentication uses HS256 with a secret supplied through the environment.
"""

import base64
import hashlib
import hmac
import os
from datetime import datetime, timedelta, timezone

import jwt


# JWT configuration
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))

# Password hashing configuration
PBKDF2_ITERATIONS = int(os.getenv("PBKDF2_ITERATIONS", "600000"))
MIN_PBKDF2_ITERATIONS = 100_000
MAX_PBKDF2_ITERATIONS = 2_000_000


# Restrict JWT signing to the configured shared-secret algorithm.
if JWT_ALGORITHM != "HS256":
    raise RuntimeError("Only HS256 is supported for JWT authentication")

if JWT_EXPIRE_MINUTES <= 0:
    raise RuntimeError("JWT_EXPIRE_MINUTES must be positive")

if not MIN_PBKDF2_ITERATIONS <= PBKDF2_ITERATIONS <= MAX_PBKDF2_ITERATIONS:
    raise RuntimeError(
        f"PBKDF2_ITERATIONS must be between "
        f"{MIN_PBKDF2_ITERATIONS} and {MAX_PBKDF2_ITERATIONS}"
    )


def _secret_key() -> str:
    """Return the JWT secret or raise if it is not configured."""
    if not JWT_SECRET_KEY:
        raise RuntimeError(
            "JWT_SECRET_KEY must be set before issuing or validating JWTs"
        )

    return JWT_SECRET_KEY


def hash_password(password: str) -> str:
    """Hash a password using PBKDF2-HMAC-SHA256 with a random salt."""
    if not isinstance(password, str):
        raise TypeError("Password must be a string")

    salt = os.urandom(16)

    derived_key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        PBKDF2_ITERATIONS,
    )

    salt_b64 = base64.urlsafe_b64encode(salt).decode("ascii")
    derived_b64 = base64.urlsafe_b64encode(derived_key).decode("ascii")

    return (
        f"pbkdf2_sha256${PBKDF2_ITERATIONS}"
        f"${salt_b64}${derived_b64}"
    )


def verify_password(password: str, stored_hash: str) -> bool:
    """Verify a password against its stored hash.

    Malformed hashes and unsupported iteration counts are rejected.
    """
    if not isinstance(password, str) or not isinstance(stored_hash, str):
        return False

    try:
        scheme, iterations_text, salt_b64, digest_b64 = stored_hash.split("$", 3)

        if scheme != "pbkdf2_sha256":
            return False

        # Reject malformed iteration counts before performing expensive work.
        if not iterations_text.isdecimal():
            return False

        iterations = int(iterations_text)

        if not MIN_PBKDF2_ITERATIONS <= iterations <= MAX_PBKDF2_ITERATIONS:
            return False

        salt = base64.b64decode(
            salt_b64.encode("ascii"),
            altchars=b"-_",
            validate=True,
        )

        expected_digest = base64.b64decode(
            digest_b64.encode("ascii"),
            altchars=b"-_",
            validate=True,
        )

        if len(salt) != 16 or len(expected_digest) != 32:
            return False

        actual_digest = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt,
            iterations,
        )

        return hmac.compare_digest(actual_digest, expected_digest)

    except (ValueError, TypeError, AttributeError, UnicodeError):
        return False


def create_access_token(user_id: int) -> str:
    """Create a signed JWT access token for a user."""
    if isinstance(user_id, bool) or not isinstance(user_id, int) or user_id <= 0:
        raise ValueError("user_id must be a positive integer")

    now = datetime.now(timezone.utc)
    expires = now + timedelta(minutes=JWT_EXPIRE_MINUTES)

    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": expires,
    }

    return jwt.encode(
        payload,
        _secret_key(),
        algorithm="HS256",
    )


def decode_access_token(token: str) -> int:
    """Validate a JWT and return its user ID.

    Invalid signatures, expired tokens, missing claims, and malformed
    subjects are rejected with JWT-specific exceptions.
    """
    if not isinstance(token, str) or not token:
        raise jwt.InvalidTokenError("Token must be a non-empty string")

    payload = jwt.decode(
        token,
        _secret_key(),
        algorithms=["HS256"],
        options={"require": ["sub", "iat", "exp"]},
    )

    subject = payload.get("sub")

    if not isinstance(subject, str) or not subject.isdecimal():
        raise jwt.InvalidTokenError("Invalid token subject")

    user_id = int(subject)

    if user_id <= 0:
        raise jwt.InvalidTokenError("Invalid user ID")

    return user_id