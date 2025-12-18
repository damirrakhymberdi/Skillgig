<template>
  <div
    class="answer-card"
    :class="{ 'is-accepted': isAccepted }"
    :data-answer-id="answer.id"
  >
    <!-- Эксперт ақпараты -->
    <div class="answer-header">
      <div class="expert-info">
        <div class="expert-avatar">
          {{ displayName.charAt(0) }}
        </div>
        <div class="expert-details">
          <RouterLink
            v-if="showProfileLink"
            class="expert-name expert-name-link"
            :to="profileLinkTarget"
            @click.stop
          >
            {{ displayName }}
          </RouterLink>
          <h4 v-else class="expert-name">{{ displayName }}</h4>
          <div class="expert-meta">
        <span class="meta-chip">Correct: {{ resolvedCount }}</span>
            <span class="meta-chip">Level: {{ levelLabel }}</span>
          </div>
        </div>
      </div>
      <div class="answer-header-right">
        <span v-if="isAccepted" class="accepted-badge">✓ Accepted answer</span>
        <span class="answer-time">{{ timeAgo(answer.createdAt) }}</span>
      </div>
    </div>

    <div class="answer-content">
      <p class="answer-text" v-html="formattedAnswerText"></p>
      
      <div v-if="codeSnippet" class="code-block">
        <pre><code>{{ codeSnippet }}</code></pre>
      </div>

      <div v-if="answer.links && answer.links.length > 0" class="answer-links">
        <a 
          v-for="(link, index) in answer.links" 
          :key="index"
          :href="link" 
          target="_blank"
          class="link-item"
        >
          🔗 {{ link }}
        </a>
      </div>
    </div>

    <div
      v-if="canEdit || canDelete || canModerate"
      class="answer-actions"
    >
      <div
        v-if="canEdit || canDelete"
        class="action-buttons"
      >
        <button
          v-if="canEdit && !isAccepted"
          type="button"
          class="action-btn"
          @click.stop="$emit('edit', answer)"
        >
          Edit
        </button>
        <button
          v-if="canDelete"
          type="button"
          class="action-btn danger"
          @click.stop="$emit('delete', answer)"
        >
          Delete
        </button>
      </div>

      <div v-if="canModerate" class="verify-actions">
        <button
          type="button"
          class="action-btn success"
          :disabled="verifying || isAccepted"
          @click.stop="$emit('verify', { answer, isCorrect: true })"
        >
          {{ verifying ? 'Checking...' : isAccepted ? 'Accepted' : 'Mark correct' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { buildProfileQuery } from '@/utils/profileFallback'
import { useAuthStore } from '@/stores/useAuthStore'

const toNumber = (value, fallback = 0) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

const authStore = useAuthStore()
const { user: storeUser } = storeToRefs(authStore)

const props = defineProps({
  answer: {
    type: Object,
    required: true
  },
  isAccepted: {
    type: Boolean,
    default: false
  },
  canEdit: {
    type: Boolean,
    default: false
  },
  canDelete: {
    type: Boolean,
    default: false
  },
  canModerate: {
    type: Boolean,
    default: false
  },
  isOwn: {
    type: Boolean,
    default: false
  },
  verifying: {
    type: Boolean,
    default: false
  }
})

defineEmits(['edit', 'delete', 'verify'])

const showProfileLink = computed(() => {
  return Boolean(props.answer?.authorId) && !props.isOwn
})

const profileLinkTarget = computed(() => {
  if (!showProfileLink.value) {
    return null
  }

  const query = buildProfileQuery({
    name: props.answer?.expertName,
    email: props.answer?.authorEmail,
    userRole: props.answer?.authorRole,
    primaryRole: props.answer?.authorProfile?.primaryRole,
    avgRating: props.answer?.expertRating,
    profile: props.answer?.authorProfile
  })

  return {
    path: `/profile/${props.answer.authorId}`,
    query
  }
})

const displayName = computed(() => {
  if (props.isOwn) {
    return 'You'
  }
  return props.answer.expertName || 'Аноним'
})

const formattedAnswerText = computed(() => {
  const text = props.answer?.answerText || ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')
})

const codeSnippet = computed(() => {
  if (props.answer?.codeExample) {
    return props.answer.codeExample
  }

  const text = props.answer?.answerText || ''
  const marker = /Code example:\s*/i
  if (marker.test(text)) {
    const [, ...rest] = text.split(marker)
    const candidate = rest.join('Code example:').trim()
    if (candidate) return candidate
  }

  const fence = text.match(/```(?:\\w+)?\\n([\\s\\S]*?)```/m)
  if (fence && fence[1]) {
    return fence[1].trim()
  }

  return ''
})

const resolvedCount = computed(() =>
  toNumber(
    props.answer?.authorProfile?.resolvedQuestions ??
      props.answer?.authorResolved ??
      props.answer?.authorResolvedQuestions ??
      0
  )
)

const levelLabel = computed(() => {
  const accepted = resolvedCount.value
  if (accepted >= 50) return 'Expert'
  if (accepted >= 20) return 'Pro'
  if (accepted >= 5) return 'Rising'
  return 'Newcomer'
})

const timeAgo = (dateString) => {
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
.answer-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.answer-card.is-accepted {
  border: 1.5px solid #4CAF4F;
  background-color: #f6fef7;
}

.answer-card.is-highlighted {
  border-color: #f97316;
}

.answer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.expert-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.expert-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
}

.expert-details {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.expert-name,
.expert-name-link {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.expert-name-link {
  display: inline-block;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
}

.expert-name-link:hover {
  text-decoration: underline;
}

.expert-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.2rem;
  font-size: 0.85rem;
  color: #4b5563;
}

.meta-chip {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0.25rem 0.55rem;
  font-weight: 600;
}

.answer-time {
  font-size: 0.875rem;
  color: #9ca3af;
}

.accepted-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.28rem 0.7rem;
  background-color: #e8f8eb;
  color: #1f7a33;
  font-size: 0.78rem;
  font-weight: 700;
  border-radius: 10px;
  white-space: nowrap;
}

.answer-content {
  color: #374151;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.answer-text {
  margin: 0 0 1rem 0;
  white-space: pre-wrap;
  margin: 0;
}

.code-block {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #111827;
}

.answer-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.link-item {
  color: #667eea;
  text-decoration: none;
  font-size: 0.875rem;
  word-break: break-all;
  transition: color 0.2s;
}

.link-item:hover {
  color: #764ba2;
  text-decoration: underline;
}

.answer-actions {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.verify-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-left: auto;
}

.action-btn {
  padding: 0.45rem 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background-color: #f9fafb;
  color: #374151;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #eef2ff;
  border-color: #c7d2fe;
  color: #4338ca;
}

.action-btn.danger {
  border-color: #fecaca;
  color: #b91c1c;
  background-color: #fff5f5;
}

.action-btn.danger:hover {
  background-color: #fee2e2;
  border-color: #fca5a5;
  color: #991b1b;
}

.action-btn.success {
  border-color: #bbf7d0;
  color: #15803d;
  background-color: #f0fdf4;
}

.action-btn.success:hover:not(:disabled) {
  background-color: #dcfce7;
  border-color: #86efac;
  color: #166534;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

