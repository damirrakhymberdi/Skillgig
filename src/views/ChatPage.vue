<template>
  <div class="chat-page">
    <div class="chat-container">
      <!-- Chat Header -->
      <div class="chat-header">
        <button class="btn-back" @click="handleBack">
          ← Артқа
        </button>
        <div class="chat-partner-info">
          <div class="partner-avatar">
            {{ partnerName?.charAt(0) || 'U' }}
          </div>
          <div class="partner-details">
            <h2 class="partner-name">{{ partnerName }}</h2>
            <p class="partner-role">{{ isExpert ? 'Эксперт' : 'Клиент' }}</p>
          </div>
        </div>
      </div>

      <!-- Сұрақ ақпараты -->
      <div class="question-info">
        <h3 class="question-title">{{ questionTitle }}</h3>
      </div>

      <!-- Messages -->
      <div class="messages-container" ref="messagesContainer">
        <div v-if="loading" class="loading-messages">
          Жүктелуде...
        </div>
        
        <div v-else class="messages-list">
          <div
            v-for="message in messages"
            :key="message.id"
            class="message"
            :class="{ 'message-own': message.isOwn, 'message-other': !message.isOwn }"
          >
            <div class="message-avatar" v-if="!message.isOwn">
              {{ partnerName?.charAt(0) || 'U' }}
            </div>
            
            <div class="message-content">
              <div class="message-text">{{ message.text }}</div>
              <div class="message-time">{{ formatTime(message.createdAt) }}</div>
            </div>

            <div class="message-avatar" v-if="message.isOwn">
              {{ currentUserName?.charAt(0) || 'M' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="message-input-container">
        <form @submit.prevent="handleSendMessage" class="message-form">
          <textarea
            v-model="messageText"
            class="message-input"
            placeholder="Хабарлама жазу..."
            rows="1"
            @keydown.enter.exact.prevent="handleSendMessage"
            @keydown.shift.enter="handleNewLine"
            ref="messageInputRef"
          ></textarea>
          <button
            type="submit"
            class="btn-send"
            :disabled="!messageText.trim()"
          >
            Жіберу
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const questionId = route.params.questionId
const loading = ref(false)
const messages = ref([])
const messageText = ref('')
const partnerName = ref('')
const questionTitle = ref('')
const isExpert = ref(false)
const currentUserName = ref('Мен')

const messagesContainer = ref(null)
const messageInputRef = ref(null)

// Хабарламаларды жүктеу
const loadMessages = async () => {
  loading.value = true
  try {
    // Backend дайын болғанда:
    // const response = await fetch(`/api/questions/${questionId}/chat`)
    // const data = await response.json()
    // messages.value = data.messages
    // partnerName.value = data.partnerName
    // questionTitle.value = data.questionTitle

    // MOCK деректер
    await new Promise(resolve => setTimeout(resolve, 500))
    
    partnerName.value = 'Ерлан Б.'
    questionTitle.value = 'Flutter-де ListView lag болады'
    isExpert.value = true
    
    messages.value = [
      {
        id: 1,
        text: 'ListView.builder пайдаланыңыз, ол әлдеқайда тиімдірек.',
        isOwn: false,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 2,
        text: 'Рахмет! Мысал кода бермесіз бе?',
        isOwn: true,
        createdAt: new Date(Date.now() - 3500000).toISOString()
      },
      {
        id: 3,
        text: 'Әрине! Міне мысал:\n\n```dart\nListView.builder(\n  itemCount: items.length,\n  itemBuilder: (context, index) => ItemWidget(items[index]),\n)\n```',
        isOwn: false,
        createdAt: new Date(Date.now() - 3400000).toISOString()
      }
    ]
    
    // Скроллды төменге жылжыту
    await nextTick()
    scrollToBottom()
    
  } catch (error) {
    console.error('Error loading messages:', error)
  } finally {
    loading.value = false
  }
}

// Хабарлама жіберу
const handleSendMessage = async () => {
  if (!messageText.value.trim()) return

  const newMessage = {
    id: messages.value.length + 1,
    text: messageText.value.trim(),
    isOwn: true,
    createdAt: new Date().toISOString()
  }

  // Жібергеннен кейін деректерді тізімге қосу (optimistic update)
  messages.value.push(newMessage)
  messageText.value = ''
  
  // Input-ты қайта өлшемдеу
  await nextTick()
  adjustTextareaHeight()

  // Скроллды төменге жылжыту
  scrollToBottom()

  try {
    // Backend дайын болғанда:
    // await fetch(`/api/questions/${questionId}/chat/messages`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   },
    //   body: JSON.stringify({ text: newMessage.text })
    // })
    
    console.log('Message sent:', newMessage.text)
    
  } catch (error) {
    console.error('Error sending message:', error)
    // Хабарламаны жою егер қате болса
    messages.value.pop()
    alert('Хабарлама жіберу мүмкін болмады')
  }
}

// Enter + Shift = жаңа жол
const handleNewLine = () => {
  // Shift+Enter арқылы жаңа жол қосуға мүмкіндік беру
  messageText.value += '\n'
  nextTick(() => {
    adjustTextareaHeight()
  })
}

// Textarea биіктігін автоматты түрде реттеу
const adjustTextareaHeight = () => {
  if (messageInputRef.value) {
    messageInputRef.value.style.height = 'auto'
    messageInputRef.value.style.height = messageInputRef.value.scrollHeight + 'px'
  }
}

// Скроллды төменге жылжыту
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Уақытты форматтау
const formatTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now - date
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  
  if (diffInMinutes < 1) return 'just now'
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} h ago`
  
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

// Артқа бату
const handleBack = () => {
  router.back()
}

// Хабарламаларды автоматты түрде жаңарту (polling)
let pollingInterval = null

const startPolling = () => {
  // 5 секунд сайын жаңарту (чат онлайн емес, тек refresh арқылы)
  pollingInterval = setInterval(() => {
    // Backend дайын болғанда:
    // loadNewMessages()
  }, 5000)
}

const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

// Textarea биіктігін реттеу
watch(() => messageText.value, () => {
  nextTick(() => {
    adjustTextareaHeight()
  })
})

onMounted(async () => {
  await loadMessages()
  adjustTextareaHeight()
  // startPolling() // Қазір қосылмаған, себебі онлайн чат жоқ
})

onUnmounted(() => {
  stopPolling()
})
</script>

<style scoped>
.chat-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 80px;
  display: flex;
  flex-direction: column;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

/* Chat Header */
.chat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: white;
}

.btn-back {
  padding: 0.5rem;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-back:hover {
  color: #111827;
}

.chat-partner-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.partner-avatar {
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

.partner-details {
  flex: 1;
}

.partner-name {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.partner-role {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

/* Question Info */
.question-info {
  padding: 0.75rem 1.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.question-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

/* Messages Container */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #f9fafb;
}

.loading-messages {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Message */
.message {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  max-width: 70%;
}

.message-own {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-other {
  align-self: flex-start;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.message-text {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.5;
}

.message-own .message-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message-other .message-text {
  background-color: white;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 0.75rem;
  color: #9ca3af;
  padding: 0 0.5rem;
}

/* Message Input */
.message-input-container {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background-color: white;
}

.message-form {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-family: inherit;
  color: #111827;
  resize: none;
  max-height: 120px;
  overflow-y: auto;
  transition: border-color 0.2s;
}

.message-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.message-input::placeholder {
  color: #9ca3af;
}

.btn-send {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-send:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .chat-page {
    padding-top: 0;
  }

  .chat-container {
    height: 100vh;
    border-radius: 0;
  }

  .message {
    max-width: 85%;
  }
}
</style>

