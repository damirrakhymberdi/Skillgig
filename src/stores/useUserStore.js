import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [],
        currentUser: null,
        loading: false,
        error: null
    }),

    getters: {
        getUsers: (state) => state.users,
        getCurrentUser: (state) => state.currentUser,
        isLoading: (state) => state.loading,
        getError: (state) => state.error
    },

    actions: {
        setUsers(users) {
            this.users = users
        },

        addUser(user) {
            this.users.push(user)
        },

        updateUser(userId, userData) {
            const index = this.users.findIndex(user => user.id === userId)
            if (index !== -1) {
                this.users[index] = { ...this.users[index], ...userData }
            }
        },

        deleteUser(userId) {
            this.users = this.users.filter(user => user.id !== userId)
        },

        setCurrentUser(user) {
            this.currentUser = user
        },

        setLoading(loading) {
            this.loading = loading
        },

        setError(error) {
            this.error = error
        },

        clearError() {
            this.error = null
        }
    }
})


