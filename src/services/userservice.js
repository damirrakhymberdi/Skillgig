import { apiGet, apiPut } from './api'
import { normalizeUser } from './authservice'

const toArray = (value) => {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const normalizeExpertProfile = (rawProfile = null) => {
  if (!rawProfile) {
    return null
  }

  return {
    fullName: rawProfile.full_name ?? rawProfile.fullName ?? null,
    bio: rawProfile.bio ?? '',
    primaryRole: rawProfile.primary_role ?? rawProfile.primaryRole ?? '',
    skills: toArray(rawProfile.skills),
    githubUrl: rawProfile.github_url ?? rawProfile.githubUrl ?? '',
    linkedinUrl: rawProfile.linkedin_url ?? rawProfile.linkedinUrl ?? '',
    portfolioUrl: rawProfile.portfolio_url ?? rawProfile.portfolioUrl ?? '',
    experienceYears:
      rawProfile.experience_years ?? rawProfile.experienceYears ?? 0,
    averageRating:
      rawProfile.average_rating ?? rawProfile.averageRating ?? 0,
    resolvedQuestions:
      rawProfile.resolved_questions ?? rawProfile.resolvedQuestions ?? 0
  }
}

const normalizeUserWithProfile = (payload = null) => {
  if (!payload) {
    return null
  }

  const user = normalizeUser(payload)
  const answersCount = toNumber(
    payload.answers_count ??
      payload.answersCount ??
      user?.answersCount ??
      0
  )

  return {
    ...user,
    answersCount,
    isActive: payload.is_active ?? payload.isActive ?? null,
    createdAt: payload.created_at ?? payload.createdAt ?? null,
    expertProfile: normalizeExpertProfile(
      payload.expert_profile ?? payload.expertProfile ?? null
    )
  }
}

export const fetchCurrentUser = async (options = {}) => {
  const data = await apiGet('/users/me', options)
  return normalizeUserWithProfile(data)
}

export const updateExpertProfile = async (profilePayload = {}, options = {}) => {
  const payload = {
    full_name: profilePayload.fullName ?? profilePayload.full_name ?? '',
    bio: profilePayload.bio ?? '',
    primary_role:
      profilePayload.primaryRole ?? profilePayload.primary_role ?? '',
    skills: profilePayload.skills ?? [],
    github_url:
      profilePayload.githubUrl ?? profilePayload.github_url ?? '',
    linkedin_url:
      profilePayload.linkedinUrl ?? profilePayload.linkedin_url ?? '',
    portfolio_url:
      profilePayload.portfolioUrl ?? profilePayload.portfolio_url ?? '',
    experience_years:
      profilePayload.experienceYears ??
      profilePayload.experience_years ??
      0
  }

  const data = await apiPut('/users/me/profile', payload, options)

  return normalizeExpertProfile(data ?? payload)
}

export const fetchExperts = async (options = {}) => {
  const data = await apiGet('/users/experts', options)

  if (Array.isArray(data)) {
    return data.map((item) => normalizeUserWithProfile(item)).filter(Boolean)
  }

  return []
}

export const fetchUserById = async (userId, options = {}) => {
  if (!userId) {
    throw new Error('User ID қажет')
  }

  const targets = [
    `/users/profile/${encodeURIComponent(userId)}`,
    `/users/${encodeURIComponent(userId)}`
  ]

  let lastError = null

  for (const path of targets) {
    try {
      const data = await apiGet(path, options)
      return normalizeUserWithProfile(data)
    } catch (error) {
      lastError = error
      if (!error?.status || ![404, 405].includes(error.status)) {
        throw error
      }
    }
  }

  throw lastError || new Error('Пайдаланушы табылмады')
}


