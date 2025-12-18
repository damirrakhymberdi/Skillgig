import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior(to, from, savedPosition) {
        // Егер savedPosition бар болса (браузердің кері/алға функционалы), оны қолдану
        if (savedPosition) {
            return savedPosition
        }
        // Әйтпесе, беттің басына прокруттау
        return { top: 0, behavior: 'smooth' }
    },
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/HomePage.vue')
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('@/views/AboutPage.vue')
        },
        {
            path: '/faq',
            name: 'faq',
            component: () => import('@/views/FAQPage.vue')
        },
        {
            path: '/get-started',
            name: 'get-started',
            component: () => import('@/views/GetStartedPage.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginPage.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/RegisterPage.vue')
        },
        {
            path: '/questions/:id',
            name: 'question-detail',
            component: () => import('@/views/QuestionDetailPage.vue')
        },
        {
            path: '/ask',
            name: 'ask-question',
            component: () => import('@/views/AskQuestionPage.vue')
        },
        {
            path: '/questions',
            name: 'questions-list',
            component: () => import('@/views/QuestionsListPage.vue')
        },
        {
            path: '/profile/:id?',
            name: 'profile',
            component: () => import('@/views/ProfilePage.vue')
        },
        {
            path: '/profile/change',
            name: 'profile-change',
            component: () => import('@/views/ChangingProfilePage.vue')
        },
        {
            path: '/questions/:id/edit',
            name: 'edit-question',
            component: () => import('@/views/EditQuestionPage.vue')
        },
        {
            path: '/chat/:questionId',
            name: 'chat',
            component: () => import('@/views/ChatPage.vue')
        }
    ]
})

export default router


