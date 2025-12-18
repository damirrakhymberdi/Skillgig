import { apiGet } from './api'

const normalizeCategory = (raw) => {
  if (!raw) return null
  if (typeof raw === 'string') {
    return {
      id: raw,
      name: raw,
      icon: '📁'
    }
  }

  const id = raw.id ?? raw.slug ?? raw.name
  const name = raw.name ?? raw.label ?? raw.title ?? 'Категория'

  return {
    id: String(id),
    name,
    icon: raw.icon ?? raw.emoji ?? '📁',
    description: raw.description ?? '',
    totalQuestions:
      raw.totalQuestions ?? raw.total_questions ?? raw.questions_count ?? 0
  }
}

export const fetchCategories = async () => {
  const data = await apiGet('/categories')

  if (Array.isArray(data)) {
    return data
      .map(normalizeCategory)
      .filter(Boolean)
  }

  if (data?.items && Array.isArray(data.items)) {
    return data.items
      .map(normalizeCategory)
      .filter(Boolean)
  }

  return []
}




