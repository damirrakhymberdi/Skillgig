<template>
  <div class="edit-question-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Сұрақты өңдеу</h1>
        <p class="page-subtitle">Сұрақ мазмұнын өзгертіңіз</p>
      </div>

      <div v-if="loading" class="loading">
        Жүктелуде...
      </div>
      <div v-else class="form-container">
        <div v-if="errorMessage" class="form-error">
          {{ errorMessage }}
        </div>
        <form @submit.prevent="handleSubmit" class="edit-form">
          <!-- Тақырып -->
          <div class="form-group">
            <label for="title" class="form-label">
              Сұрақ тақырыбы *
            </label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              class="form-input"
              placeholder="Мысалы: Flutter-де ListView lag болады"
              required
              maxlength="200"
            />
            <p class="form-hint">{{ formData.title.length }}/200</p>
          </div>

          <!-- Сипаттама -->
          <div class="form-group">
            <label for="description" class="form-label">
              Толық сипаттама *
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              class="form-textarea"
              rows="10"
              placeholder="Мәселені егжей-тегжейлі сипаттаңыз..."
              required
            ></textarea>
          </div>

          <!-- Code example -->
          <div class="form-group">
            <label for="codeExample" class="form-label">
              Код мысалы (опционалды)
            </label>
            <textarea
              id="codeExample"
              v-model="formData.codeExample"
              class="form-textarea"
              rows="8"
              placeholder="Мысалы, проблеманы шығаратын код үзіндісін енгізіңіз"
            ></textarea>
            <p class="form-hint">Кодты жеке толтырыңыз — ол сипаттамадан бөлек сақталады.</p>
          </div>

          <!-- Категория және Подкатегория -->
          <div class="form-row">
            <div class="form-group">
              <label for="category" class="form-label">
                Категория *
              </label>
              <select
                id="category"
                v-model="formData.category"
                class="form-select"
                required
                @change="handleCategoryChange"
              >
                <option value="">Категория таңдаңыз</option>
                <option
                  v-for="cat in categories"
                  :key="cat.id"
                  :value="cat.name"
                >
                  {{ cat.icon }} {{ cat.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="subcategory" class="form-label">
                Подкатегория
              </label>
              <select
                id="subcategory"
                v-model="formData.subcategory"
                class="form-select"
              >
                <option value="">Подкатегория таңдаңыз (опционалды)</option>
                <option
                  v-for="subcat in availableSubcategories"
                  :key="subcat"
                  :value="subcat"
                >
                  {{ subcat }}
                </option>
              </select>
            </div>
          </div>

          <!-- Тегтер -->
          <div class="form-group">
            <label for="tags" class="form-label">
              Тегтер *
            </label>
            <input
              id="tags"
              v-model="tagsInput"
              type="text"
              class="form-input"
              placeholder="Flutter, Performance, ListView (үтірмен бөліңіз)"
              @keydown.enter.prevent="handleTagInput"
              @keydown="handleTagKeydown"
              @blur="handleTagInput"
            />
            <div class="tags-display">
              <span
                v-for="(tag, index) in formData.tags"
                :key="index"
                class="tag-item"
              >
                {{ tag }}
                <button
                  type="button"
                  class="tag-remove"
                  @click="removeTag(index)"
                >
                  ×
                </button>
              </span>
            </div>
            <p class="form-hint">Үтір (,) немесе Enter басып тег қосыңыз</p>
          </div>

          <!-- Код сілтемесі -->
          <div class="form-group">
            <label for="codeLink" class="form-label">
              GitHub/Код сілтемесі (опционалды)
            </label>
            <input
              id="codeLink"
              v-model="formData.codeLink"
              type="url"
              class="form-input"
              placeholder="https://github.com/username/repo"
            />
          </div>

          <!-- Форма әрекеттері -->
          <div class="form-actions">
            <button
              type="button"
              class="btn-secondary"
              @click="handleCancel"
            >
              Болдырмау
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="submitting || formData.tags.length === 0"
            >
              <span v-if="!submitting">Өзгерістерді сақтау</span>
              <span v-else>Сақталуда...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { fetchQuestionById, updateQuestion } from '@/services/questionsService'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const questionId = route.params.id
const submitting = ref(false)
const loading = ref(true)
const tagsInput = ref('')
const errorMessage = ref('')

// Подкатегориялар
const subcategories = {
  'Web Development': ['React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'HTML/CSS'],
  'Mobile Development': ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Android', 'iOS'],
  'UI/UX Design': ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator'],
  'Backend/Database': ['Node.js', 'Python', 'Java', 'PHP', 'MySQL', 'PostgreSQL', 'MongoDB'],
  'AI/ML': ['TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'NLP'],
  'DevOps': ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Azure', 'Git'],
  'Game Development': ['Unity', 'Unreal Engine', 'Game Design', 'C#', 'C++'],
  'Security/Blockchain': ['Cybersecurity', 'Blockchain', 'Smart Contracts', 'Web3', 'Cryptography']
}

const formData = ref({
  title: '',
  description: '',
  codeExample: '',
  category: '',
  subcategory: '',
  tags: [],
  codeLink: ''
})

// Категориялар
const categories = ref([
  { id: 1, name: 'Web Development', icon: '🌐' },
  { id: 2, name: 'Mobile Development', icon: '📱' },
  { id: 3, name: 'UI/UX Design', icon: '🎨' },
  { id: 4, name: 'Backend/Database', icon: '💾' },
  { id: 5, name: 'AI/ML', icon: '🤖' },
  { id: 6, name: 'DevOps', icon: '🔧' },
  { id: 7, name: 'Game Development', icon: '🎮' },
  { id: 8, name: 'Security/Blockchain', icon: '🔐' }
])

// Қолжетімді подкатегориялар
const availableSubcategories = computed(() => {
  if (!formData.value.category) return []
  return subcategories[formData.value.category] || []
})

// Категория өзгергенде подкатегорияны тазалау
const handleCategoryChange = () => {
  formData.value.subcategory = ''
}

// Тег қосу
const addTag = (tagText) => {
  const tag = tagText.trim()
  if (tag && tag.length > 0 && !formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag)
  }
}

// Тегтер инпутын өңдеу
const handleTagInput = () => {
  if (!tagsInput.value) return
  
  const tags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t.length > 0)
  tags.forEach(tag => {
    addTag(tag)
  })
  tagsInput.value = ''
}

// Тегтер инпутында клавиатура басымдарын өңдеу
const handleTagKeydown = (event) => {
  if (event.key === ',' || event.keyCode === 188) {
    event.preventDefault()
    handleTagInput()
  }
}

// Тег жою
const removeTag = (index) => {
  formData.value.tags.splice(index, 1)
}

// Сұрақты жүктеу
const loadQuestion = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const data = await fetchQuestionById(questionId)
    if (!data) {
      throw new Error('Сұрақ табылмады')
    }
    formData.value = {
      title: data.title || '',
      description: data.description || '',
      codeExample: data.codeExample || '',
      category: data.category || '',
      subcategory: data.subcategory || '',
      tags: data.tags || [],
      codeLink: data.codeLink || data.links?.[0] || ''
    }
  } catch (error) {
    console.error('Error loading question:', error)
    errorMessage.value = 'Сұрақты жүктеу мүмкін болмады.'
  } finally {
    loading.value = false
  }
}

// Форма жіберу
const handleSubmit = async () => {
  if (formData.value.tags.length === 0) {
    errorMessage.value = 'Кемінде бір тег қосыңыз.'
    return
  }

  if (!authStore.getIsAuthenticated || !authStore.authHeader) {
    errorMessage.value = 'Сұрақты жаңарту үшін жүйеге кіріңіз.'
    router.push('/login')
    return
  }

  submitting.value = true
  errorMessage.value = ''

  try {
    const questionData = {
      title: formData.value.title,
      description: formData.value.description,
      codeExample: formData.value.codeExample || null,
      category: formData.value.category,
      subcategory: formData.value.subcategory || null,
      tags: formData.value.tags,
      codeLink: formData.value.codeLink || null,
      links: formData.value.codeLink ? [formData.value.codeLink] : []
    }

    await updateQuestion(questionId, questionData, {
      headers: {
        Authorization: authStore.authHeader
      }
    })

    router.push(`/questions/${questionId}`)
  } catch (error) {
    console.error('Error updating question:', error)
    if (error?.status === 401) {
      authStore.logout()
      errorMessage.value = 'Your session has expired. Please log in again.'
      router.push('/login')
      return
    }
    errorMessage.value =
      error?.message || 'Сұрақты жаңарту кезінде қате шықты. Кейінірек қайталап көріңіз.'
  } finally {
    submitting.value = false
  }
}

// Болдырмау
const handleCancel = () => {
  if (confirm('Сіз шынымен болдырмауға қалайсыз ба? Өзгерістер сақталмайды.')) {
    router.back()
  }
}

onMounted(() => {
  loadQuestion()
})
</script>

<style scoped>
.edit-question-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 100px;
  padding-bottom: 4rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.form-container {
  background-color: rgba(243, 244, 246, 0.8);
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.form-error {
  margin-bottom: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  border: 1px solid #fecaca;
  background-color: #fee2e2;
  color: #b91c1c;
  font-weight: 500;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9375rem;
  font-family: inherit;
  color: #111827;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 150px;
}

.form-select {
  cursor: pointer;
}

.form-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

/* Тегтер */
.tags-display {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background-color: #f3f4f6;
  color: #374151;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

.tag-remove {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;
}

.tag-remove:hover {
  color: #ef4444;
}

/* Қиындық деңгейі */
/* Батырмалар */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

@media (max-width: 768px) {
  .edit-question-page {
    padding-top: 80px;
  }

  .form-container {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>

