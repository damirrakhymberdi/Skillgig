import { defineStore } from 'pinia'
import { fetchCurrentUser } from '@/services/userservice'

const AUTH_STORAGE_KEY = 'skillgig_auth'

const normalizeTokenType = (type) => {
    if (!type) {
        return null
    }
    if (typeof type === 'string' && type.toLowerCase() === 'bearer') {
        return 'Bearer'
    }
    return type
}

const createDefaultState = () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    tokenType: 'Bearer',
    expiresAt: null,
    isAuthenticated: false,
    token: null,
    isFetchingUser: false,
    hydratedAt: null
})

const loadInitialState = () => {
    if (typeof window === 'undefined') {
        return createDefaultState()
    }

    try {
        const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
        if (!raw) {
            return createDefaultState()
        }

        const parsed = JSON.parse(raw)
        return {
            ...createDefaultState(),
            ...parsed
        }
    } catch {
        return createDefaultState()
    }
}

export const useAuthStore = defineStore('auth', {
    state: () => loadInitialState(),

    getters: {
        getUser: (state) => state.user,
        getIsAuthenticated: (state) => state.isAuthenticated,
        getToken: (state) => state.accessToken,
        authHeader: (state) =>
            state.accessToken && state.tokenType
                ? `${normalizeTokenType(state.tokenType) || 'Bearer'} ${
                      state.accessToken
                  }`
                : null
    },

    actions: {
        persist() {
            if (typeof window === 'undefined') {
                return
            }

            const payload = {
                user: this.user,
                accessToken: this.accessToken,
                refreshToken: this.refreshToken,
                tokenType: this.tokenType,
                expiresAt: this.expiresAt,
                isAuthenticated: this.isAuthenticated,
                token: this.accessToken,
                hydratedAt: this.hydratedAt
            }

            window.localStorage.setItem(
                AUTH_STORAGE_KEY,
                JSON.stringify(payload)
            )
        },

        login(session) {
            this.user = session?.user ?? null
            this.accessToken = session?.accessToken ?? null
            this.refreshToken = session?.refreshToken ?? null
            this.tokenType = normalizeTokenType(
                session?.tokenType ?? 'Bearer'
            )
            this.expiresAt =
                session?.expiresAt ??
                (session?.expiresIn
                    ? Date.now() + session.expiresIn * 1000
                    : null)
            this.token = this.accessToken
            this.isAuthenticated = Boolean(this.accessToken)
            this.hydratedAt = session?.user ? Date.now() : this.hydratedAt
            this.persist()
        },

        updateUser(user) {
            this.user = user
            this.isAuthenticated = Boolean(user && this.accessToken)
            this.persist()
        },

        setTokens(tokens) {
            this.accessToken = tokens?.accessToken ?? null
            this.refreshToken = tokens?.refreshToken ?? null
            this.tokenType = normalizeTokenType(tokens?.tokenType ?? 'Bearer')
            this.expiresAt = tokens?.expiresAt ?? null
            this.token = this.accessToken
            this.isAuthenticated = Boolean(this.accessToken)
            this.persist()
        },

        async hydrateUser({ force = false } = {}) {
            if (!this.accessToken || !this.authHeader) {
                return null
            }

            if (this.isFetchingUser) {
                return null
            }

            if (this.user && !force) {
                return this.user
            }

            this.isFetchingUser = true
            try {
                const profile = await fetchCurrentUser({
                    headers: {
                        Authorization: this.authHeader
                    }
                })

                if (profile) {
                    this.user = profile
                    this.isAuthenticated = Boolean(this.accessToken)
                    this.hydratedAt = Date.now()
                    this.persist()
                }

                return profile
            } catch (error) {
                console.error('Auth hydrate error:', error)
                return null
            } finally {
                this.isFetchingUser = false
            }
        },

        logout() {
            const defaults = createDefaultState()
            Object.assign(this, defaults)
            this.persist()
        }
    }
})