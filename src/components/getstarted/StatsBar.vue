<template>
  <div class="stats-bar">
      <div class="container stats-content">
      <span class="stat-item">
        <strong>{{ stats.totalQuestions.toLocaleString() }}</strong> questions asked
      </span>
      <span class="separator">•</span>
      <span class="stat-item">
        <strong>{{ stats.totalExperts }}</strong> IT specialists
      </span>
      <span class="separator">•</span>
      <span class="stat-item">
        <strong>{{ stats.successRate }}%</strong> success rate
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchPlatformStats } from '@/services/statsService'

const stats = ref({
  totalQuestions: 0,
  totalExperts: 0,
  successRate: 0
})

const loading = ref(false)

const loadStats = async () => {
  loading.value = true
  try {
    stats.value = await fetchPlatformStats()
  } catch (error) {
    console.error('Error loading stats:', error)
    stats.value = {
      totalQuestions: 0,
      totalExperts: 0,
      successRate: 0
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.stats-bar {
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.stats-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 0.95rem;
  color: #6b7280;
}

.stat-item strong {
  color: #111827;
  font-weight: 600;
}

.separator {
  color: #d1d5db;
}

@media (max-width: 768px) {
  .stats-content {
    flex-direction: column;
    gap: 0.5rem;
  }

  .separator {
    display: none;
  }
}
</style>
