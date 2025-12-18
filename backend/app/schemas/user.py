from datetime import datetime
from typing import List, Optional

from pydantic import EmailStr, Field

from .common import CamelModel


class ExpertProfileBase(CamelModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    primary_role: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    experience_years: int = 0


class ExpertProfilePublic(ExpertProfileBase):
    average_rating: float = 0.0
    resolved_questions: int = 0


class ExpertProfileUpdate(ExpertProfileBase):
    pass


class UserBase(CamelModel):
    id: str
    email: EmailStr
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: str


class UserPublic(UserBase):
    is_active: Optional[bool] = None
    created_at: Optional[datetime] = None
    expert_profile: Optional[ExpertProfilePublic] = None
    answers_count: int = 0


class UserCreate(CamelModel):
    email: EmailStr
    password: str
    role: str = "client"
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserProfileResponse(UserPublic):
    pass

