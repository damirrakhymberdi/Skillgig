<template>
  <div class="answer-form-container">
    <h3 class="form-title">Write an answer</h3>
    
    <form @submit.prevent="handleSubmit" class="answer-form">
      <!-- Текст инпут -->
      <div class="form-group">
        <label for="answerText" class="form-label">
          Your answer *
        </label>
        <textarea
          id="answerText"
          v-model="formData.answerText"
          class="form-textarea"
          rows="8"
          placeholder="Write your full answer..."
          required
        ></textarea>
      </div>

      <!-- Код инпут (опционалды) -->
      <div class="form-group">
        <label for="codeExample" class="form-label">
          Code example (optional)
        </label>
        <textarea
          id="codeExample"
          v-model="formData.codeExample"
          class="form-textarea code-textarea"
          rows="6"
          placeholder="const example = ..."
        ></textarea>
      </div>

      <!-- Сілтемелер (опционалды) -->
      <div class="form-group">
        <label for="links" class="form-label">
          Links (GitHub, docs, etc.)
        </label>
        <input
          id="links"
          v-model="formData.linksInput"
          type="text"
          class="form-input"
          placeholder="https://github.com/... (separate multiple links with commas)"
        />
        <p class="form-hint">Separate multiple links with commas (,)</p>
      </div>

      <!-- Жіберу батырмасы -->
      <p v-if="errorMessage" class="form-error">
        {{ errorMessage }}
      </p>
      <div class="form-actions">
        <button 
          type="submit" 
          class="submit-button"
          :disabled="submitting"
        >
          <span v-if="!submitting">Submit answer</span>
          <span v-else>Submitting...</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createAnswer } from '@/services/questionsService'

const props = defineProps({
  questionId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['answer-submitted'])

const formData = ref({
  answerText: '',
  codeExample: '',
  linksInput: ''
})

const submitting = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  submitting.value = true
  errorMessage.value = ''

  try {
    const links = formData.value.linksInput
      .split(',')
      .map((link) => link.trim())
      .filter((link) => link.length > 0)

    const payload = {
      answerText: formData.value.answerText,
      codeExample: formData.value.codeExample || null,
      links
    }

    const newAnswer = await createAnswer(String(props.questionId), payload)

    emit('answer-submitted', newAnswer)

    formData.value = {
      answerText: '',
      codeExample: '',
      linksInput: ''
    }
  } catch (error) {
    console.error('Error submitting answer:', error)
    errorMessage.value =
      error?.message || 'Something went wrong while submitting your answer. Please try again later.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.answer-form-container {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
}

.answer-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.form-textarea,
.form-input {
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

.form-textarea:focus,
.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea::placeholder,
.form-input::placeholder {
  color: #9ca3af;
}

.code-textarea {
  font-family: 'Courier New', monospace;
  background-color: #f9fafb;
}

.form-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-error {
  margin-top: 0.5rem;
  padding: 0.6rem 0.85rem;
  border-radius: 8px;
  border: 1px solid #fecaca;
  background-color: #fee2e2;
  color: #b91c1c;
  font-size: 0.875rem;
}
</style>

