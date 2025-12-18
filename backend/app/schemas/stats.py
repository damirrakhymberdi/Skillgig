from .common import CamelModel


class PlatformStats(CamelModel):
    total_questions: int = 0
    total_experts: int = 0
    success_rate: float = 0.0

