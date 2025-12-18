<template>
  <section class="birde-section">
    <div class="birde-content">
      <h1 class="birde-title">Solve. Grow. Shine.</h1>
      <p class="birde-subtitle">Where questions get asked and careers get built</p>
    </div>
  </section>
</template>

<script setup>
// Компонент не требует логики
</script>

<style scoped>



.birde-section {
  width: 100%;
  padding: 3.5rem 1rem;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
}

.birde-content {
  max-width: 800px;
  margin: 0 auto;
}

.birde-title {
  font-size: 3.3rem;
  font-weight: 600;
  color: #111111;
  margin-bottom: 1rem;
  line-height: 0.5;
}

.birde-subtitle {
  font-size: 1.7rem;
  font-weight: 400;
  color: #111111;
  margin: 0;
  line-height: 1.6;
}

/* Адаптивность */
@media (max-width: 768px) {
  .birde-section {
    padding: 4rem 1.5rem;
  }

  .birde-title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .birde-subtitle {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .birde-section {
    padding: 3rem 1rem;
  }

  .birde-title {
    font-size: 2rem;
  }

  .birde-subtitle {
    font-size: 1rem;
  }
}
</style>

