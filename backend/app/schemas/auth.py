from typing import Optional

from .common import CamelModel
from .user import UserPublic


class RegisterResponse(CamelModel):
    user: UserPublic


class TokenResponse(CamelModel):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int
    user: UserPublic


class RefreshRequest(CamelModel):
    refresh_token: str



