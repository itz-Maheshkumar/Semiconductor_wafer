import bcrypt

# Bcrypt has a maximum password length of 72 bytes
MAX_PASSWORD_LENGTH = 72


def hash_password(password: str) -> str:
    """Hash a password using bcrypt. Truncates to 72 bytes if needed."""
    # Truncate password to bcrypt's maximum length
    truncated = password[:MAX_PASSWORD_LENGTH]
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(truncated.encode(), salt).decode()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password."""
    # Truncate password to bcrypt's maximum length for verification
    truncated = plain_password[:MAX_PASSWORD_LENGTH]
    return bcrypt.checkpw(truncated.encode(), hashed_password.encode())
