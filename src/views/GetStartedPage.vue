<template>
  <div class="get-started-page">
    <!-- Hero Section -->
    <GetHeroSection />

    <!-- Статистика жолағы -->
    <StatsBar />

    <!-- Негізгі контент: Sidebar + Сұрақтар -->
    <div class="main-content">
      <div class="container">
        <div class="content-grid">
          
          <!-- Sidebar: Категориялар -->
          <CategoriesSidebar
            :disable-navigation="true"
            @change="handleCategoryChange"
          />

          <!-- Main: Соңғы сұрақтар -->
          <main class="questions-section">
            <div class="header-card">
              <div class="section-header">
                <h2>Latest questions</h2>
                <div class="header-filters">
                  <label class="filter-label">Sort by:</label>
                  <select v-model="sortBy" class="filter-select" @change="handleSortSelect">
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="most-answered">Most answers</option>
                    <option value="least-answered">Fewest answers</option>
                  </select>
                </div>
                <button class="btn-ask-question" @click="handleAskQuestion">
                  Ask Question
                </button>
              </div>
            </div>
            
            <!-- QuestionsList компоненті -->
            <QuestionsList
              :hide-filters="true"
              :external-sort="sortBy"
              :max-items="3"
              :category="selectedCategory"
              @update:sort="handleSortSelect"
            />
            <div class="see-more-wrap">
              <button class="see-more-btn" @click="handleSeeMore">See more</button>
            </div>
            
          </main>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import GetHeroSection from '@/components/getstarted/GetHeroSection.vue'
import StatsBar from '@/components/getstarted/StatsBar.vue'
import CategoriesSidebar from '@/components/getstarted/CategoriesSidebar.vue'
import QuestionsList from '@/components/getstarted/QuestionsList.vue'

const router = useRouter()
const sortBy = ref('newest')
const selectedCategory = ref('')

const handleAskQuestion = () => {
  router.push('/ask')
}

const handleSeeMore = () => {
  router.push('/questions')
}

const handleSortSelect = (eventOrValue) => {
  // eventOrValue can be DOM event or direct value from child emit
  const value = typeof eventOrValue === 'string' ? eventOrValue : eventOrValue?.target?.value
  if (value) {
    sortBy.value = value
  }
}

const handleCategoryChange = (val) => {
  selectedCategory.value = val || ''
}
</script>

<style scoped>
.get-started-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 0px; /* Header үшін орын (fixed header) */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0rem;
}

.main-content {
  padding: 0rem 0 0rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 0rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.header-card {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 1.20rem 1.20rem 0rem 1.20rem;
  margin-bottom: 0rem;
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.05);
}

.questions-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.btn-ask-question {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF4F;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}

.btn-ask-question:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.25);
}

.see-more-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.75rem;
}

.see-more-btn {
  padding: 0.65rem 1.25rem;
  background: transparent;
  color: #4CAF4F;
  border: 1px solid #4CAF4F;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.see-more-btn:hover {
  background: rgba(76, 175, 79, 0.08);
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(76, 175, 79, 0.15);
}

.header-filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.9rem;
  color: #374151;
  font-weight: 600;
  white-space: nowrap;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: white;
  cursor: pointer;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-ask-question {
    width: 100%;
  }

  .header-filters {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
    