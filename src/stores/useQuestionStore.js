import { defineStore } from 'pinia'

export const useQuestionStore = defineStore('question', {
    state: () => ({
        questions: [],
        currentQuestion: null,
        loading: false,
        error: null
    }),

    getters: {
        getQuestions: (state) => state.questions,
        getCurrentQuestion: (state) => state.currentQuestion,
        isLoading: (state) => state.loading,
        getError: (state) => state.error
    },

    actions: {
        setQuestions(questions) {
            this.questions = questions
        },

        addQuestion(question) {
            this.questions.push(question)
        },

        setCurrentQuestion(question) {
            this.currentQuestion = question
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





