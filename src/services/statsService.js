import { apiGet } from './api'

const toNumber = (value, defaultValue = 0) => {
    const numberValue = Number(value)
    return Number.isFinite(numberValue) ? numberValue : defaultValue
}

const normalizeStats = (raw = {}) => ({
    totalQuestions: toNumber(
        raw.totalQuestions ?? raw.total_questions ?? raw.questions,
        0
    ),
    totalExperts: toNumber(
        raw.totalExperts ??
        raw.total_experts ??
        raw.experts ??
        raw.users,
        0
    ),
    successRate: toNumber(
        raw.successRate ?? raw.success_rate ?? raw.success,
        0
    )
})

export const fetchPlatformStats = async () => {
    const data = await apiGet('/stats')
    return normalizeStats(data)
}

