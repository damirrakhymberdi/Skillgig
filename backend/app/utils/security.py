from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from ..core.config import get_settings

settings = get_settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def _create_token(
    subject: str,
    token_type: str,
    expires_delta: timedelta,
    additional_claims: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    now = datetime.now(timezone.utc)
    expire = now + expires_delta
    payload: Dict[str, Any] = {
        "sub": subject,
        "type": token_type,
        "iat": now,
        "exp": expire,
    }
    if additional_claims:
        payload.update(additional_claims)

    encoded_jwt = jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)
    return {"token": encoded_jwt, "expires_at": expire}


def decode_token(token: str, expected_type: str = "access") -> Dict[str, Any]:
    payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    token_type = payload.get("type")
    if token_type != expected_type:
        raise JWTError("Invalid token type")
    return payload


def create_access_token(subject: str, extra: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    expires = timedelta(minutes=settings.access_token_expire_minutes)
    return _create_token(subject, "access", expires, extra)


def create_refresh_token(subject: str, extra: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    expires = timedelta(minutes=settings.refresh_token_expire_minutes)
    return _create_token(subject, "refresh", expires, extra)

