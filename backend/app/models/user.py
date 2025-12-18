import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, JSON
from sqlalchemy.orm import relationship

from ..database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False, index=True)
    username = Column(String, unique=True, nullable=True, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    role = Column(String, default="client", nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    expert_profile = relationship(
        "ExpertProfile",
        uselist=False,
        back_populates="user",
        cascade="all, delete-orphan",
    )
    questions = relationship("Question", back_populates="client", cascade="all, delete")
    answers = relationship("Answer", back_populates="author", cascade="all, delete")

    @property
    def answers_count(self) -> int:
        if self.answers is None:
            return 0
        return len(self.answers)


class ExpertProfile(Base):
    __tablename__ = "expert_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    full_name = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    primary_role = Column(String, nullable=True)
    skills = Column(JSON, default=list)
    github_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    experience_years = Column(Integer, default=0)
    average_rating = Column(Integer, default=0)
    resolved_questions = Column(Integer, default=0)

    user = relationship("User", back_populates="expert_profile")

