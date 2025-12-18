<template>
  <section class="real-experts-section">
    <div class="section-container">
      <div class="section-content">
        <div class="text-content">
          <h2 class="main-title">
            <span class="purple-text">Get</span> IT Help<br>
            <span class="purple-text">from</span> Real Experts
          </h2>
          <p class="subtitle">
            We reached here with our hard work<br class="subtitle-break"> and dedication
          </p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-item">
            <img src="@/assets/images/logos/Vector (7).png" alt="Questions asked" class="stat-icon">
            <div class="stat-content">
              <div class="stat-number">1,123</div>
              <div class="stat-label">Questions asked</div>
            </div>
          </div>
          
          <div class="stat-item">
            <img src="@/assets/images/logos/Vector (8).png" alt="Active experts" class="stat-icon">
            <div class="stat-content">
              <div class="stat-number">46,328</div>
              <div class="stat-label">Active experts</div>
            </div>
          </div>
          
          <div class="stat-item">
            <img src="@/assets/images/logos/Vector (9).png" alt="Average Rating" class="stat-icon">
            <div class="stat-content">
              <div class="stat-number">828,867</div>
              <div class="stat-label">Average Rating</div>
            </div>
          </div>
          
          <div class="stat-item">
            <img src="@/assets/images/logos/Group 2 (1).png" alt="Success Rate" class="stat-icon">
            <div class="stat-content">
              <div class="stat-number">1,926,436</div>
              <div class="stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Компонент не требует логики
</script>

<style scoped>
.real-experts-section {
  width: 100%;
  position: relative;
  background-color: #F5F7FA;
  padding: 2rem 0rem;
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, Helvetica, sans-serif;
}

.section-container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0 5rem;
  position: relative;
}

.section-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.text-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-title {
  font-size: 2.7rem;
  font-weight: 700;
  color: #111111;
  margin: 0;
  line-height: 1.2;
  width: 90%;
}

.main-title .purple-text {
  color: #4CAF4F;
}

.subtitle {
  font-size: 1.25rem;
  font-weight: 400;
  color: #4CAF4F;
  margin: 0;
  line-height: 1.4;
}

.subtitle-break {
  display: none;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.4rem;
  width: 100%;
  justify-items: start;
}



.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: transparent;
}

.stat-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111111;
  line-height: 1;
}

.stat-label {
  font-size: 1rem;
  font-weight: 400;
  color: #4D4D4D;
  line-height: 1.4;
}

/* Адаптивность */
@media (max-width: 968px) {
  .section-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .text-content {
    order: 1;
    text-align: center;
  }

  .stats-grid {
    order: 2;
  }

  .main-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .section-container {
    padding: 0 5rem;
  }

  .real-experts-section {
    padding: 3rem 0;
  }

  .section-content {
    gap: 2rem;
  }

  .main-title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.1rem;
    margin-right: 40px;
  }

  .subtitle-break {
    display: inline;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    justify-items: center;
  }

  .stat-item {
    justify-content: center;
    max-width: 300px;
    width: 50%;
  }

  .stat-number {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .section-container {
    padding: 0 0rem;
  }

  .real-experts-section {
    padding: 3rem 0;
  }

  .main-title {
    font-size: 2.45rem;
    margin-left: 10px;
  }

  .subtitle {
    font-size: 1rem;
    margin-left: 10px;
  }

  .stat-item {
    padding: 1rem;
  }

  .stat-number {
    font-size: 1.75rem;
  }

  .stat-label {
    font-size: 0.9rem;
  }
}
</style>

