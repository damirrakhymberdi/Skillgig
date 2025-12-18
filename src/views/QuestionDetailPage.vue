<template>
  <div class="page">
    <div class="container">
      <!-- Loading -->
      <div v-if="loading" class="loading">
        Loading...
      </div>

      <div v-else-if="question" class="content">
        <!-- Question Header -->
        <div class="header">
          <h1>{{ question.title }}</h1>
          
          <div class="meta">
            <span class="author">
              <template v-if="isOwnQuestion">You</template>
              <button
                v-else-if="question.clientId"
                type="button"
                class="link"
                @click="navigateToProfile({
                  userId: question.clientId,
                  name: question.clientName,
                  email: question.clientEmail,
                  userRole: question.clientRole,
                  primaryRole: question.clientProfile?.primaryRole,
                  profile: question.clientProfile
                })"
              >
                {{ question.clientName }}
              </button>
              <span v-else>{{ question.clientName }}</span>
            </span>
            <span>•</span>
            <span>{{ timeAgo(question.createdAt) }}</span>
            <span>•</span>
            <span>{{ question.category }}</span>
          </div>

          <div v-if="isOwnQuestion" class="actions">
            <button @click="router.push(`/questions/${question.id}/edit`)">
              Edit
            </button>
            <button class="danger" @click="handleDeleteQuestion">
              Delete
            </button>
          </div>

          <div class="tags">
            <span v-for="tag in question.tags" :key="tag">
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Question Body -->
        <div class="body">
          <div v-html="formatDescription(question.description)"></div>

          <div v-if="question.codeExample" class="code">
            <div class="code-label">Code example</div>
            <pre><code>{{ question.codeExample }}</code></pre>
          </div>
          
          <div v-if="question.codeLink" class="link-box">
            <a :href="question.codeLink" target="_blank">
              🔗 View code on GitHub
            </a>
          </div>
        </div>

        <!-- Answers -->
        <div class="answers">
          <h2>Answers ({{ answers.length }})</h2>
          
          <p v-if="verificationError" class="error">
            {{ verificationError }}
          </p>

          <div v-if="answers.length > 0" class="answers-list">
            <AnswerCard
              v-for="answer in answers"
              :key="answer.id"
              :answer="answer"
              :isAccepted="Boolean(answer.isAccepted)"
              :isOwn="isOwnAnswer(answer)"
              :can-edit="isOwnAnswer(answer)"
              :can-delete="isOwnAnswer(answer)"
              :can-moderate="canModerateAnswer(answer)"
              :verifying="verifyingAnswerId === answer.id"
              @edit="startEditAnswer"
              @delete="handleDeleteAnswer"
              @verify="handleAnswerVerification"
            />
          </div>

          <div v-else-if="!isOwnQuestion" class="empty">
            <p>No answers yet. Be the first to answer!</p>
          </div>
        </div>

        <!-- Edit Answer -->
        <div v-if="editingAnswerId" class="edit-panel">
          <h3>Edit answer</h3>
          <textarea
            v-model="editingData.answerText"
            rows="6"
            placeholder="Answer..."
          />
          <textarea
            v-model="editingData.codeExample"
            rows="4"
            placeholder="Code example (optional)"
          />
          <input
            v-model="editingData.linksInput"
            type="text"
            placeholder="Links (comma separated)"
          />
          <p v-if="editingError" class="error">{{ editingError }}</p>
          <div class="edit-actions">
            <button @click="saveEditedAnswer" :disabled="savingEdit">
              {{ savingEdit ? 'Saving...' : 'Save' }}
            </button>
            <button class="secondary" @click="cancelEditAnswer">
              Cancel
            </button>
          </div>
        </div>

        <!-- Answer Form -->
        <div v-else>
          <div v-if="isOwnQuestion" class="empty">
            <p>You cannot answer your own question.</p>
          </div>
          <AnswerForm
            v-else
            :question-id="questionId"
            @answer-submitted="handleAnswerSubmitted"
          />
        </div>
      </div>

      <div v-else class="empty">
        <p>Question not found</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import AnswerCard from '@/components/questions/AnswerCard.vue'
import AnswerForm from '@/components/questions/AnswerForm.vue'
import {
  fetchQuestionById,
  fetchQuestionAnswers,
  deleteQuestion,
  deleteAnswer,
  updateAnswer,
  verifyAnswer
} from '@/services/questionsService'
import { buildProfileQuery } from '@/utils/profileFallback'
import { useAuthStore } from '@/stores/useAuthStore'

const route = useRoute()
const router = useRouter()
const questionId = route.params.id
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const loading = ref(false)
const question = ref(null)
const answers = ref([])
const editingAnswerId = ref(null)
const editingData = ref({
  answerText: '',
  codeExample: '',
  linksInput: ''
})
const editingError = ref('')
const savingEdit = ref(false)
const verifyingAnswerId = ref(null)
const verificationError = ref('')

const exampleQuestion = {
  id: 'mock-question-001',
  title: 'React компонентінде state жаңармайды',
  description:
    'Формадан мәнді setState арқылы жаңартсам да, UI өзгермейді. useState-ті қалай дұрыс қолдануға болады?\n\n```jsx\nconst [value, setValue] = useState(\"\")\n// ...\n```',
  category: 'Web Development',
  subcategory: 'React',
  tags: ['React', 'useState', 'Forms'],
  clientName: 'Айгерім Т.',
  clientEmail: 'aigerim@example.com',
  clientRole: 'Frontend Developer',
  clientProfile: {
    fullName: 'Айгерім Темірхан',
    bio: 'React және Vue бойынша ментор.',
    primaryRole: 'Web Development',
    skills: ['React', 'Vue', 'TypeScript'],
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    experienceYears: 3,
    averageRating: 4.8,
    resolvedQuestions: 42
  },
  codeLink: 'https://github.com/demo/react-state-bug',
  acceptedAnswerId: 'mock-answer-001',
  createdAt: '2025-12-01T09:30:00Z'
}

const exampleAnswers = [
  {
    id: 'mock-answer-001',
    questionId: exampleQuestion.id,
    authorId: 'mock-answer-author-01',
    authorEmail: 'erlan@example.com',
    authorRole: 'Fullstack',
    authorProfile: {
      fullName: 'Ерлан Батыр',
      bio: 'Fullstack инженер.',
      primaryRole: 'Fullstack',
      skills: ['Node.js', 'React', 'PostgreSQL'],
      githubUrl: '',
      linkedinUrl: '',
      portfolioUrl: '',
      experienceYears: 5,
      averageRating: 4.9,
      resolvedQuestions: 58
    },
    answerText:
      'Классикалық қате — setState асинхронды. Input-ты `value={value}` және `onChange={(e) => setValue(e.target.value)}` сияқты байлаңыз. Сонымен қатар, форма сабмитінде preventDefault жасауды ұмытпаңыз.',
    codeExample:
      "const handleChange = (event) => {\n  setValue(event.target.value);\n};",
    links: ['https://react.dev/learn/state-a-components-memory'],
    expertName: 'Ерлан Б.',
    expertRating: 4.9,
    isAccepted: true,
    createdAt: '2025-12-01T10:05:00Z'
  }
]

const isExampleQuestion = computed(() => {
  return (question.value?.id || questionId) === exampleQuestion.id
})

const loadQuestion = async () => {
  loading.value = true
  try {
    const data = await fetchQuestionById(questionId)
    question.value = data || exampleQuestion
  } catch (error) {
    console.error('Error loading question:', error)
    question.value = exampleQuestion
  } finally {
    loading.value = false
  }
}

const loadAnswers = async () => {
  try {
    const data = await fetchQuestionAnswers(questionId)
    if (Array.isArray(data) && data.length > 0) {
      answers.value = data
    } else if (isExampleQuestion.value) {
      answers.value = exampleAnswers
    } else {
      answers.value = []
    }
  } catch (error) {
    console.error('Error loading answers:', error)
    answers.value = isExampleQuestion.value ? exampleAnswers : []
  }
}

const isOwnQuestion = computed(() => {
  if (!user.value?.id || !question.value?.clientId) return false
  return question.value.clientId === user.value.id
})

const isOwnAnswer = (answer) => {
  if (!user.value?.id) return false
  return answer.authorId === user.value.id
}

const canModerateAnswer = (answer) => {
  if (!isOwnQuestion.value) {
    return false
  }
  if (!answer || !answer.id) {
    return false
  }
  if (!answer.authorId) {
    return true
  }
  return answer.authorId !== user.value?.id
}

const navigateToProfile = (meta = {}) => {
  const targetUserId = typeof meta === 'string' ? meta : meta.userId
  if (!targetUserId) {
    return
  }

  if (user.value?.id && targetUserId === user.value.id) {
    router.push('/profile')
    return
  }

  const query =
    typeof meta === 'object' ? buildProfileQuery(meta) : { name: meta }

  router.push({
    path: `/profile/${targetUserId}`,
    query
  })
}

const handleAnswerSubmitted = async (answerData) => {
  if (answerData) {
    answers.value = [answerData, ...answers.value]
    if (answerData.authorId === user.value?.id) {
      adjustCurrentUserAnswersCount(1)
    }
    await scrollToAnswer(answerData.id)
  } else {
    await loadAnswers()
  }
}

const startEditAnswer = (answer) => {
  editingAnswerId.value = answer.id
  editingData.value = {
    answerText: answer.answerText,
    codeExample: answer.codeExample || '',
    linksInput: (answer.links || []).join(', ')
  }
  editingError.value = ''
  nextTick(() => {
    const panel = document.querySelector('.edit-panel')
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
}

const cancelEditAnswer = () => {
  editingAnswerId.value = null
  editingData.value = {
    answerText: '',
    codeExample: '',
    linksInput: ''
  }
  editingError.value = ''
}

const adjustCurrentUserAnswersCount = (delta = 0) => {
  if (!delta || !authStore.user) {
    return
  }
  const currentValue = Number(authStore.user.answersCount ?? 0)
  const nextValue = Math.max(0, currentValue + delta)
  authStore.updateUser({
    ...authStore.user,
    answersCount: nextValue
  })
}

const adjustCurrentUserResolvedCount = (delta = 0) => {
  if (!delta || !authStore.user) {
    return
  }
  const profile = authStore.user.expertProfile || {}
  const currentValue = Number(profile.resolvedQuestions ?? 0)
  const nextValue = Math.max(0, currentValue + delta)
  authStore.updateUser({
    ...authStore.user,
    expertProfile: {
      ...profile,
      resolvedQuestions: nextValue
    }
  })
}

const updateQuestionAcceptanceState = (preferredAnswerId = null) => {
  const acceptedAnswers = answers.value.filter((entry) => entry.isAccepted)
  const hasAccepted = acceptedAnswers.length > 0
  const chosenId =
    preferredAnswerId &&
    acceptedAnswers.some((entry) => entry.id === preferredAnswerId)
      ? preferredAnswerId
      : hasAccepted
        ? acceptedAnswers[0].id
        : null

  const baseQuestion = question.value
    ? { ...question.value }
    : { ...exampleQuestion }

  question.value = {
    ...baseQuestion,
    acceptedAnswerId: chosenId,
    status: hasAccepted ? 'resolved' : 'published'
  }
}

const handleAnswerVerification = async (payload) => {
  const targetAnswer = payload?.answer
  const markAsCorrect = Boolean(payload?.isCorrect)

  if (!targetAnswer?.id) {
    return
  }

  verificationError.value = ''
  const existingAnswer = answers.value.find(
    (entry) => entry.id === targetAnswer.id
  )
  const wasAccepted = existingAnswer?.isAccepted ?? false
  const isCurrentUserAuthor = targetAnswer.authorId === user.value?.id
  const sameAuthorAcceptedIdsBefore = answers.value
    .filter(
      (entry) => entry.authorId === targetAnswer.authorId && entry.isAccepted
    )
    .map((entry) => entry.id)
  const otherAcceptedIdsBefore = sameAuthorAcceptedIdsBefore.filter(
    (id) => id !== targetAnswer.id
  )

  if (isExampleQuestion.value) {
    answers.value = answers.value.map((current) => {
      if (current.authorId === targetAnswer.authorId) {
        if (current.id === targetAnswer.id) {
          return { ...current, isAccepted: markAsCorrect }
        }
        if (markAsCorrect && current.isAccepted) {
          return { ...current, isAccepted: false }
        }
      }
      return current
    })
    updateQuestionAcceptanceState(markAsCorrect ? targetAnswer.id : null)
    if (isCurrentUserAuthor) {
      if (!wasAccepted && markAsCorrect) {
        adjustCurrentUserResolvedCount(1)
      } else if (wasAccepted && !markAsCorrect) {
        adjustCurrentUserResolvedCount(-1)
      }
      if (markAsCorrect && otherAcceptedIdsBefore.length) {
        adjustCurrentUserResolvedCount(-otherAcceptedIdsBefore.length)
      }
    }
    return
  }

  if (verifyingAnswerId.value) {
    return
  }

  verifyingAnswerId.value = targetAnswer.id

  try {
    const updatedAnswer = await verifyAnswer(
      questionId,
      targetAnswer.id,
      markAsCorrect
    )

    answers.value = answers.value.map((current) => {
      if (current.id === updatedAnswer.id) {
        return { ...current, ...updatedAnswer }
      }
      if (
        markAsCorrect &&
        current.authorId === updatedAnswer.authorId &&
        current.isAccepted
      ) {
        return { ...current, isAccepted: false }
      }
      return current
    })

    updateQuestionAcceptanceState(
      updatedAnswer.isAccepted ? updatedAnswer.id : null
    )
    if (updatedAnswer.authorId === user.value?.id) {
      const becameAccepted = !wasAccepted && updatedAnswer.isAccepted
      const becameRejected = wasAccepted && !updatedAnswer.isAccepted
      if (becameAccepted) {
        adjustCurrentUserResolvedCount(1)
      } else if (becameRejected) {
        adjustCurrentUserResolvedCount(-1)
      }
      if (markAsCorrect && otherAcceptedIdsBefore.length) {
        adjustCurrentUserResolvedCount(-otherAcceptedIdsBefore.length)
      }
    }
  } catch (error) {
    console.error('Error verifying answer:', error)
    verificationError.value =
      error?.response?.data?.detail ||
      error?.message ||
      'Error marking the answer.'
  } finally {
    verifyingAnswerId.value = null
  }
}

const saveEditedAnswer = async () => {
  if (!editingAnswerId.value) return
  savingEdit.value = true
  editingError.value = ''
  try {
    const links = editingData.value.linksInput
      .split(',')
      .map((link) => link.trim())
      .filter((link) => link.length > 0)

    const updated = await updateAnswer(questionId, editingAnswerId.value, {
      answerText: editingData.value.answerText,
      codeExample: editingData.value.codeExample,
      links
    })

    answers.value = answers.value.map((answer) =>
      answer.id === updated.id ? updated : answer
    )
    cancelEditAnswer()
    await scrollToAnswer(updated.id)
  } catch (error) {
    console.error('Error updating answer:', error)
    editingError.value = 'Could not update the answer.'
  } finally {
    savingEdit.value = false
  }
}

const handleDeleteAnswer = async (answer) => {
  if (!answer?.id) return
  const confirmed = window.confirm('Delete this answer?')
  if (!confirmed) return
  try {
    await deleteAnswer(questionId, answer.id)
    if (editingAnswerId.value === answer.id) {
      cancelEditAnswer()
    }
    if (answer.authorId === user.value?.id) {
      adjustCurrentUserAnswersCount(-1)
    }
    await loadAnswers()
  } catch (error) {
    console.error('Error deleting answer:', error)
    window.alert('Could not delete the answer.')
  }
}

const handleDeleteQuestion = async () => {
  const confirmed = window.confirm('Delete this question?')
  if (!confirmed) return
  try {
    await deleteQuestion(questionId)
    router.push('/questions')
  } catch (error) {
    console.error('Error deleting question:', error)
    window.alert('Question was not deleted. Please try again later.')
  }
}

const formatDescription = (text) => {
  if (!text) return ''
  return text.replace(/\n/g, '<br>')
}

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

  return date.toLocaleDateString('en-US')
}

const scrollToAnswer = async (answerId) => {
  await nextTick()
  const element = document.querySelector(`[data-answer-id="${answerId}"]`)
  if (element) {
    element.classList.add('is-highlighted')
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => {
      element.classList.remove('is-highlighted')
    }, 2500)
  }
}

onMounted(async () => {
  await loadQuestion()
  await loadAnswers()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 80px 20px 40px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.loading,
.empty {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Header */
.header {
  background: white;
  padding: 24px;
  border-radius: 8px;
}

.header h1 {
  font-size: 26px;
  font-weight: 600;
  color: #232629;
  margin-bottom: 12px;
  line-height: 1.3;
}

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6a737c;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.author {
  font-weight: 600;
  color: #3b4045;
}

.link {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: #0a95ff;
  cursor: pointer;
}

.link:hover {
  text-decoration: underline;
}

.actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tags span {
  padding: 4px 8px;
  background: #e1ecf4;
  color: #39739d;
  font-size: 12px;
  border-radius: 3px;
}

/* Body */
.body {
  background: white;
  padding: 24px;
  border-radius: 8px;
  line-height: 1.7;
  color: #3b4045;
}

.code {
  background: #f6f6f6;
  padding: 16px;
  border-radius: 6px;
  margin: 16px 0;
}

.code-label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #3b4045;
}

.code pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  white-space: pre-wrap;
  color: #232629;
}

.link-box {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e3e6e8;
}

.link-box a {
  color: #0a95ff;
  text-decoration: none;
  font-weight: 500;
}

.link-box a:hover {
  text-decoration: underline;
}

/* Answers */
.answers h2 {
  font-size: 20px;
  font-weight: 600;
  color: #232629;
  margin-bottom: 16px;
}

.answers-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Edit Panel */
.edit-panel {
  background: white;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.edit-panel h3 {
  font-size: 18px;
  font-weight: 600;
  color: #232629;
  margin-bottom: 8px;
}

.edit-panel textarea,
.edit-panel input {
  width: 100%;
  padding: 10px;
  border: 1px solid #d6d9dc;
  border-radius: 4px;
  font-size: 13px;
  font-family: inherit;
}

.edit-panel textarea:focus,
.edit-panel input:focus {
  outline: none;
  border-color: #0a95ff;
  box-shadow: 0 0 0 4px rgba(10, 149, 255, 0.1);
}

.edit-actions {
  display: flex;
  gap: 8px;
}

/* Buttons */
button {
  padding: 8px 16px;
  border: 1px solid #d6d9dc;
  border-radius: 4px;
  background: white;
  color: #3b4045;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover:not(:disabled) {
  background: #f8f9f9;
}

button.danger {
  color: #c02d2e;
  border-color: #c02d2e;
}

button.danger:hover {
  background: #fdf3f4;
}

button.secondary {
  background: #f8f9f9;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  color: #c02d2e;
  font-size: 13px;
}

@media (max-width: 768px) {
  .page {
    padding: 60px 12px 24px;
  }
  
  .header h1 {
    font-size: 22px;
  }
  
  .body,
  .header,
  .edit-panel {
    padding: 16px;
  }
}
</style>  