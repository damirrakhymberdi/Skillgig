from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Question, User
from ..schemas.stats import PlatformStats

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("", response_model=PlatformStats)
def platform_stats(db: Session = Depends(get_db)) -> PlatformStats:
    total_questions = db.query(func.count(Question.id)).scalar() or 0
    # Count all registered users as IT specialists
    total_experts = db.query(func.count(User.id)).scalar() or 0
    resolved_questions = (
        db.query(func.count(Question.id))
        .filter(Question.status == "resolved")
        .scalar()
        or 0
    )

    success_rate = 0.0
    if total_questions:
        success_rate = round((resolved_questions / total_questions) * 100, 2)

    return PlatformStats(
        total_questions=total_questions,
        total_experts=total_experts,
        success_rate=success_rate,
    )

