from typing import Optional

from .common import CamelModel


class Category(CamelModel):
    id: str
    name: str
    icon: str = "📁"
    description: Optional[str] = ""
    total_questions: int = 0

