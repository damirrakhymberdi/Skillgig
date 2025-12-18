<template>
  <div class="ask-question-page">
    <div class="page-header outer-header">
      <h1 class="page-title">Ask a question</h1>
    </div>

    <div class="layout">
      <div class="form-column">
        <div class="form-container">
          <div v-if="errorMessage" class="form-error">
            {{ errorMessage }}
          </div>
          <form @submit.prevent="handleSubmit" class="ask-form">
          <!-- Тақырып -->
          <div class="form-group">
            <label for="title" class="form-label">
              Question title *
            </label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              class="form-input"
              placeholder="Example: ListView lagging in Flutter"
              required
              maxlength="200"
            />
            <p class="form-hint">{{ formData.title.length }}/200</p>
          </div>

          <!-- Сипаттама -->
          <div class="form-group">
            <label for="description" class="form-label">
              Full description *
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              class="form-textarea"
              rows="10"
              placeholder="Describe what happens, where it occurs, and what you've tried..."
              required
            ></textarea>
            <p class="form-hint">The more detail you give, the faster you'll get help</p>
          </div>

          <div class="form-group">
            <label for="codeExample" class="form-label">
              Code example (optional)
            </label>
            <textarea
              id="codeExample"
              v-model="formData.codeExample"
              class="form-textarea"
              rows="6"
              placeholder="Paste a minimal code example that reproduces the issue"
            ></textarea>
            <p class="form-hint">Provide a runnable, minimal snippet if possible</p>
          </div>

          <!-- Категория және Подкатегория -->
          <div class="form-row">
            <div class="form-group">
              <label for="category" class="form-label">
                Category *
              </label>
              <select
                id="category"
                v-model="formData.category"
                class="form-select"
                required
                @change="handleCategoryChange"
              >
                <option value="">Select a category</option>
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
                Subcategory
              </label>
              <select
                id="subcategory"
                v-model="formData.subcategory"
                class="form-select"
              >
                <option value="">Select a subcategory (optional)</option>
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
              Tags *
            </label>
            <input
              id="tags"
              v-model="tagsInput"
              type="text"
              class="form-input"
              placeholder="Flutter, Performance, ListView (add with comma or Enter)"
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
            <p class="form-hint">Add tags with comma (,) or Enter. At least one tag is required.</p>
          </div>

          <!-- Код сілтемесі -->
          <div class="form-group">
            <label for="codeLink" class="form-label">
              GitHub/Code link (optional)
            </label>
            <input
              id="codeLink"
              v-model="formData.codeLink"
              type="url"
              class="form-input"
              placeholder="https://github.com/username/repo"
            />
            <p class="form-hint">If the issue is in code, add a GitHub link</p>
          </div>

          <!-- Форма әрекеттері -->
          <div class="form-actions">
            <button
              type="button"
              class="btn-secondary"
              @click="handleCancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="submitting || formData.tags.length === 0"
            >
              <span v-if="!submitting">Submit question</span>
              <span v-else>Submitting...</span>
            </button>
          </div>
        </form>
      </div>
      </div>
      <aside class="guide-column">
        <div class="guide-card">
          <h3 class="guide-title">Сформулируйте свой вопрос</h3>
          <p class="guide-note">
            Сообщество здесь, чтобы помочь вам с конкретными проблемами по программированию.
          </p>
          <p class="guide-note">
            Избегайте вопросов, на которые невозможно дать объективный ответ.
          </p>
          <div class="accordion">
            <div
              v-for="(item, idx) in accordionItems"
              :key="idx"
              class="accordion-item"
            >
              <button class="accordion-header" type="button" @click="toggleAccordion(idx)">
                <span class="step-number">{{ idx + 1 }}.</span>
                <span class="acc-title">{{ item.title }}</span>
                <span class="chevron" :class="{ open: accordionOpen[idx] }">▾</span>
              </button>
              <ul v-if="accordionOpen[idx]" class="accordion-body">
                <li v-for="(line, i) in item.lines" :key="i">{{ line }}</li>
              </ul>
            </div>
          </div>
          
        </div>
      </aside>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { createQuestion } from '@/services/questionsService'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

const submitting = ref(false)
const tagsInput = ref('')
const errorMessage = ref('')

// Подкатегориялар (категорияға байланысты)
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

// Тег қосу (жалпы функция)
const addTag = (tagText) => {
  const tag = tagText.trim()
  if (tag && tag.length > 0 && !formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag)
  }
}

// Тегтер инпутын өңдеу (үтірмен бөлінген немесе жалғыз тег)
const handleTagInput = () => {
  if (!tagsInput.value) return
  
  // Үтірмен бөлінген тегтерді бөлу
  const tags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t.length > 0)
  
  // Әр тегті қосу
  tags.forEach(tag => {
    addTag(tag)
  })
  
  // Инпутты тазалау
  tagsInput.value = ''
}

// Тегтер инпутында клавиатура басымдарын өңдеу
const handleTagKeydown = (event) => {
  // Үтір басылғанда (188 - үтір, 190 - нүкте)
  if (event.key === ',' || event.keyCode === 188) {
    event.preventDefault()
    handleTagInput()
  }
}

// Тег жою
const removeTag = (index) => {
  formData.value.tags.splice(index, 1)
}

// Форма жіберу
const handleSubmit = async () => {
  if (formData.value.tags.length === 0) {
    errorMessage.value = 'Кемінде бір тег қосыңыз.'
    return
  }

  if (!authStore.getIsAuthenticated) {
    errorMessage.value = 'Сұрақ қою үшін жүйеге кіріңіз.'
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
      links: formData.value.codeLink ? [formData.value.codeLink] : [],
      status: 'published'
    }

    const createdQuestion = await createQuestion(questionData)

    router.push({
      path: '/questions',
      query: {
        highlight: createdQuestion.id,
        postedAt: Date.now().toString()
      }
    })
  } catch (error) {
    console.error('Error submitting question:', error)
    errorMessage.value =
      error?.message || 'Сұрақ жіберу кезінде қате кетті. Кейінірек қайталап көріңіз.'
  } finally {
    submitting.value = false
  }
}

// Болдырмау
const handleCancel = () => {
  if (confirm('Сіз шынымен болдырмауға қалайсыз ба? Енгізілген деректер жоғалады.')) {
    router.push('/get-started')
  }
}

const accordionItems = [
  {
    title: 'Опишите проблему кратко',
    lines: [
      'Включите подробную информацию о вашей цели',
      'Опишите, что вы ожидали и что получили',
      'Добавьте сообщения об ошибках'
    ]
  },
  {
    title: 'Опишите, что вы пробовали',
    lines: [
      'Опишите все шаги, которые вы уже предприняли',
      'Укажите, что сработало, а что нет',
      'Добавьте ссылки на источники, которые вы использовали'
    ]
  },
  {
    title: 'Добавьте немного кода',
    lines: [
      'Вставьте минимальный пример кода, который вызывает проблему',
      'Убедитесь, что код можно запустить',
      'Удалите лишние части, не относящиеся к проблеме'
    ]
  }
]

const accordionOpen = ref(accordionItems.map(() => false))
const toggleAccordion = (idx) => {
  accordionOpen.value[idx] = !accordionOpen.value[idx]
}
</script>

<style scoped>
.ask-question-page {
  min-height: 100vh;
  background-color: #f5f6f7;
  padding: 90px 120px 32px;
}

.layout {
  max-width: 1300px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2.3fr 0.9fr;
  gap: 24px;
  align-items: start;
}

.form-column {
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 0px 3px rgba(15, 23, 42, 0.08);
  padding: 24px 24px 32px;
  border: 1px solid rgba(128, 128, 128, 0.232);
}

.guide-column {
  position: sticky;
  top: 80px;
}

.guide-card {
  background-color: #ffffff;
  border-radius: 6px;
  border: 1px solid #e3e6e8;
  box-shadow: none;
  padding: 20px 16px 20px;
}

.guide-title {
  margin: 0 0 8px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
}

.guide-note {
  margin: 0 0 8px;
  font-size: 0.93rem;
  color: #3b4045;
  line-height: 1.45;
}

.accordion {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
}

.accordion-item {
  background: #fff;
  box-shadow: none;
}

.accordion-header {
  width: 100%;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  border: none;
  cursor: pointer;
  font-weight: 700;
  color: #111827;
  gap: 8px;
}

.acc-title {
  text-align: left;
  margin-right: 8px;
  flex: 1;
}

.chevron {
  transition: transform 0.2s;
  color: #6b7280;
}

.chevron.open {
  transform: rotate(180deg);
}

.accordion-body {
  margin: 0;
  padding: 0 14px 10px 28px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #3b4045;
  font-weight: 500;
  list-style: disc;
}

.step-number {
  color: #2e6db0;
  font-weight: 800;
}

.guide-links button {
  width: 100%;
  padding: 0.65rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(128, 128, 128, 0.232);
  background: #ffffff;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.guide-links button:hover {
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.12);
  transform: translateY(-1px);
}

.more-link {
  color: #2e6db0;
  font-weight: 700;
  text-decoration: none;
}

.more-link:hover {
  text-decoration: underline;
}

.page-header {
  text-align: left;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 1rem 0 -0.5rem 0;
}

.page-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.outer-header {
  padding: 0 8px;
}

.form-container {
  background-color: white;
}

.form-error {
  margin-bottom: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(128, 128, 128, 0.232);
  background-color: #fee2e2;
  color: #b91c1c;
  font-weight: 500;
}

.ask-form {
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
  border: 1px solid rgba(128, 128, 128, 0.451);
  border-radius: 5px;
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
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #4CAF4F;
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
  background-color: #ffffff;
  border: 1px solid rgba(128, 128, 128, 0.451);
  color: #374151;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .guide-column {
    position: static;
  }
}

@media (max-width: 768px) {
  .ask-question-page {
    padding: 72px 16px 40px;
  }

  .form-container {
    padding: 1.25rem;
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

