<template>
  <div 
    class="question-card"
    :class="{
      'has-answers': question.answersCount > 0,
      'is-solved': question.isSolved,
      'is-highlighted': question.__highlight
    }"
    :data-question-id="question.id"
    @click="handleClick"
  >
    <div class="question-content">
      <h3 class="question-title">{{ question.title }}</h3>
      
      <div class="question-tags" v-if="question.tags && question.tags.length > 0">
        <span 
          v-for="tag in question.tags" 
          :key="tag"
          class="tag"
        >
          {{ tag }}
        </span>
      </div>

      <div class="question-meta">
        <div class="meta-left">
          <span class="answers-count">
            {{ question.answersCount || 0 }} answers
          </span>
          <span class="separator">•</span>
          <span class="author">
            <template v-if="isOwnQuestion">You</template>
            <button
              v-else-if="question.clientId"
              type="button"
              class="author-link"
              @click.stop="handleAuthorClick"
            >
              {{ question.clientName }}
            </button>
            <span v-else>{{ question.clientName }}</span>
          </span>
        </div>
        <span class="time">
          {{ timeAgo(displayCreatedAt) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { buildProfileQuery } from '@/utils/profileFallback'

const props = defineProps({
  question: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const authStore = useAuthStore()
const displayCreatedAt = computed(
  () => props.question.createdAtOverride || props.question.createdAt
)

const isOwnQuestion = computed(() => {
  const currentUserId = authStore.user?.id
  if (!currentUserId || !props.question?.clientId) {
    return false
  }
  return props.question.clientId === currentUserId
})

const handleClick = () => {
  if (props.question.id) {
    router.push(`/questions/${props.question.id}`)
  }
}

const handleAuthorClick = (event) => {
  event?.stopPropagation?.()
  if (!props.question?.clientId) {
    return
  }
  if (isOwnQuestion.value) {
    router.push('/profile')
    return
  }
  const query = buildProfileQuery({
    name: props.question?.clientName,
    email: props.question?.clientEmail,
    userRole: props.question?.clientRole,
    primaryRole: props.question?.clientProfile?.primaryRole,
    profile: props.question?.clientProfile
  })
  router.push({
    path: `/profile/${props.question.clientId}`,
    query
  })
}

const timeAgo = (dateString) => {
  if (!dateString) return 'just now'
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now - date
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'just now'
  if (diffInHours < 24) return `${diffInHours} hours ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return 'yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`
  
  return date.toLocaleDateString('en-US')
}
</script>

<style scoped>
.question-card {
  position: relative;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-right: none;
  border-radius: 0;
  padding: 1rem 2rem;
  cursor: pointer;
  transition: all 0.2s;
  
}

/* Жауаптары бар сұрақтар үшін border */
.question-card.has-answers {
  border: 2px solid #e5e7eb;
}

/* Шешілген сұрақтар үшін жасыл border */
.question-card.has-answers.is-solved {
  border: 2px solid #4CAF4F;
}

.question-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.question-card.has-answers:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.question-card.has-answers.is-solved:hover {
  border-color: #45a049;
  box-shadow: 0 2px 12px rgba(76, 175, 79, 0.2);
}

.question-card.is-highlighted {
  border: 2px solid #f97316;
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.15);
}

.question-card.is-highlighted:hover {
  border-color: #ea580c;
}

.question-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.question-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  line-height: 1.4;
}

.question-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  background-color: #f3f4f6;
  color: #6b7280;
  font-size: 0.8125rem;
  border-radius: 4px;
  font-weight: 500;
}

.question-meta {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.answers-count {
  font-weight: 600;
  color: #374151;
}

.author {
  color: #374151;
}

.author-link {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: #2563eb;
  cursor: pointer;
}

.author-link:hover {
  text-decoration: underline;
}

.time {
  color: #9ca3af;
  white-space: nowrap;
}

.separator {
  color: #d1d5db;
}
</style>

