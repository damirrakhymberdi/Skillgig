<template>
  <section class="about-hero-section">
    <div class="about-hero-container">
      <h1 class="about-hero-title">Let's build from <span class="text-green">here</span></h1>
      <p class="about-hero-subtitle">Building the future of IT collaboration through community-driven knowledge sharing</p>
    </div>
  </section>
</template>

<script setup>
// Компонент не требует логики
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sofia+Sans:wght@300;400;500;600;700;800;900&display=swap');

.about-hero-section {
  width: 100%;
  background: #F5F7FA;
  padding: 11rem 2rem 6rem;
  font-family: 'Sofia Sans', Arial, Helvetica, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.about-hero-container {
  max-width: 1200px;
  width: 100%;
  text-align: center;
}

.about-hero-title {
  font-size: 7rem;
  font-weight: 700;
  color: #000000;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.about-hero-title .text-green {
  color: #4CAF4F;
}

.about-hero-subtitle {
  font-size: 2rem;
  font-weight: 400;
  color: #4D4D4D;
  margin: 0;
  line-height: 1.2;
  max-width: 850px;
  margin-left: auto;
  margin-right: auto;
}

/* Адаптивность */
@media (max-width: 968px) {
  .about-hero-section {
    padding: 10rem 2rem 6rem;
  }

  .about-hero-title {
    font-size: 3.5rem;
  }

  .about-hero-subtitle {
    font-size: 1.125rem;
  }
}

@media (max-width: 768px) {
  .about-hero-section {
    padding: 8rem 1.5rem 5rem;
    min-height: 50vh;
  }

  .about-hero-title {
    font-size: 2.5rem;
  }

  .about-hero-subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .about-hero-section {
    padding: 6rem 1rem 4rem;
    min-height: 40vh;
  }

  .about-hero-title {
    font-size: 2rem;
  }

  .about-hero-subtitle {
    font-size: 0.9rem;
  }
}
</style>

