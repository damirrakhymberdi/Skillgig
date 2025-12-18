from datetime import datetime
from typing import List, Optional

from pydantic import Field

from .common import CamelModel
from .user import ExpertProfilePublic


class AnswerBase(CamelModel):
    answer_text: str = Field(..., min_length=1)
    code_example: Optional[str] = None
    links: List[str] = Field(default_factory=list)


class AnswerCreate(AnswerBase):
    pass


class AnswerUpdate(CamelModel):
    answer_text: Optional[str] = None
    code_example: Optional[str] = None
    links: Optional[List[str]] = None


class AnswerModerationRequest(CamelModel):
    is_correct: bool


class AnswerOut(AnswerBase):
    id: str
    question_id: str
    question_title: Optional[str] = None
    author_id: str
    author_answers_count: Optional[int] = 0
    author_email: Optional[str] = None
    author_role: Optional[str] = None
    author_profile: Optional[ExpertProfilePublic] = None
    expert_name: Optional[str] = None
    expert_rating: Optional[float] = 0.0
    is_accepted: bool = False
    created_at: datetime

