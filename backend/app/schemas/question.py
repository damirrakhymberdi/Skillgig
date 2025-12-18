from datetime import datetime
from typing import List, Optional

from pydantic import Field

from .common import CamelModel
from .user import ExpertProfilePublic


class QuestionBase(CamelModel):
    title: str = Field(..., max_length=255)
    description: str
    code_example: Optional[str] = None
    category: str
    subcategory: Optional[str] = None
    difficulty: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    links: List[str] = Field(default_factory=list)
    code_link: Optional[str] = None
    deadline: Optional[datetime] = None
    status: str = Field(default="draft")


class QuestionCreate(QuestionBase):
    pass


class QuestionUpdate(CamelModel):
    title: Optional[str] = None
    description: Optional[str] = None
    code_example: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    difficulty: Optional[str] = None
    tags: Optional[List[str]] = None
    links: Optional[List[str]] = None
    code_link: Optional[str] = None
    deadline: Optional[datetime] = None
    status: Optional[str] = None


class QuestionOut(QuestionBase):
    id: str
    client_id: str
    client_name: str
    client_email: Optional[str] = None
    client_role: Optional[str] = None
    client_profile: Optional[ExpertProfilePublic] = None
    answers_count: int = 0
    is_solved: bool = False
    accepted_answer_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


class QuestionListResponse(CamelModel):
    total: int
    items: List[QuestionOut]
