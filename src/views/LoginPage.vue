<template>
  <div class="login-page-overlay" @click.self="closeModal">
    <div class="login-modal" @click.stop>
      <!-- Заголовок -->
      <h2 class="login-title">С возвращением.</h2>

      <!-- Кнопка Google -->
      <button class="google-button" @click="handleGoogleLogin">
        <svg class="google-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Войти с помощью Google
      </button>

      <!-- Разделитель -->
      <div class="divider">
        <span class="divider-text">Или войдите с помощью своей электронной почты</span>
      </div>

      <p v-if="errorMessage" class="form-error">
        {{ errorMessage }}
      </p>

      <!-- Форма -->
      <form class="login-form" @submit.prevent="handleSubmit">
        <!-- Email -->
        <div class="form-group">
          <label for="email" class="form-label">Электронная почта</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            placeholder="name@email.com"
            class="form-input"
            required
          />
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password" class="form-label">Пароль</label>
          <div class="password-input-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="formData.password"
              placeholder="Пароль"
              class="form-input password-input"
              required
            />
            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
              aria-label="Toggle password visibility"
            >
              <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Забыли пароль -->
        <div class="forgot-password">
          <a href="#" class="forgot-password-link" @click.prevent="handleForgotPassword">
            Забыли пароль?
          </a>
        </div>

        <!-- Кнопка Войти -->
        <button type="submit" class="submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Жүктелуде...' : 'Войти' }}
        </button>
      </form>

      <!-- Кнопка закрытия -->
      <button class="close-button" @click="closeModal" aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { loginUser } from '@/services/authservice'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  if (isSubmitting.value) {
    return
  }

  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const authData = await loginUser({
      email: formData.value.email.trim(),
      password: formData.value.password
    })

    authStore.login(authData)
    await authStore.hydrateUser({ force: true })
    router.push('/')
  } catch (error) {
    errorMessage.value =
      error?.payload?.detail ||
      error?.payload?.message ||
      error.message ||
      'Кіру сәтсіз аяқталды. Қайта көріңіз.'
  } finally {
    isSubmitting.value = false
  }
}

const handleGoogleLogin = () => {
  console.log('Google login')
  // Здесь будет логика входа через Google
}

const handleForgotPassword = () => {
  console.log('Forgot password')
  // Здесь будет логика восстановления пароля
}

const closeModal = () => {
  router.back()
}

// Закрытие по ESC
const handleEscape = (e) => {
  if (e.key === 'Escape') {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  // Блокируем прокрутку body при открытом модальном окне
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.login-page-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.login-modal {
  position: relative;
  background: #FFFFFF;
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666666;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  border-radius: 50%;
  width: 32px;
  height: 32px;
}

.close-button:hover {
  color: #1a1a1a;
  background: #f5f5f5;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 2rem 0;
  text-align: left;
}

/* Google Button */
.google-button {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1rem;
  background: #FFFFFF;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
}

.google-button:hover {
  border-color: #c0c0c0;
  background: #FAFAFA;
}

.google-icon {
  flex-shrink: 0;
}

/* Divider */
.divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #E5E5E5;
}

.divider-text {
  position: relative;
  background: #FFFFFF;
  padding: 0 1rem;
  font-size: 0.875rem;
  color: #666666;
}

.form-error {
  font-size: 0.875rem;
  color: #e11d48;
  margin: 0 0 1rem 0;
  text-align: left;
}

/* Form */
.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  text-align: left;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 0.9375rem;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  background: #FFFFFF;
  color: #1a1a1a;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #5CBFA1;
  box-shadow: 0 0 0 3px rgba(92, 191, 161, 0.1);
}

.form-input::placeholder {
  color: #999999;
}

.password-input-wrapper {
  position: relative;
}

.password-input {
  padding-right: 3rem;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666666;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #1a1a1a;
}

/* Forgot Password */
.forgot-password {
  text-align: left;
  margin-bottom: 1.5rem;
}

.forgot-password-link {
  font-size: 0.875rem;
  color: #4CAF4F;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.forgot-password-link:hover {
  color: #45a049;
}

/* Submit Button */
.submit-button {
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #FFFFFF;
  background: #4CAF4F;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
  margin-top: 0.5rem;
}

.submit-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.submit-button:hover {
  background: #45a049;
}

.submit-button:active {
  transform: translateY(1px);
}

/* Адаптивность */
@media (max-width: 640px) {
  .login-modal {
    padding: 2rem 1.5rem;
    max-width: 100%;
  }

  .login-title {
    font-size: 1.75rem;
  }

  .login-page-overlay {
    padding: 1rem;
  }
}
</style>

