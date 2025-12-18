<template>
    <section class="mission-section">
      <div class="mission-container">
        <span class="mission-label">Our Mission</span>
        
  
        <div class="mission-grid">
          <div 
            v-for="(item, index) in missionItems" 
            :key="index"
            class="mission-card"
          >
            <span class="card-number">0{{ index + 1 }}</span>
            <p class="card-text">{{ item.text }}</p>
          </div>
        </div>
  
        <div class="mission-quote">
          <p class="quote-text">
            "Knowledge should be free, accessible, and collaborative."
          </p>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  const missionItems = [
    { text: 'Get help with real technical problems' },
    { text: 'Share their knowledge and experience' },
    { text: 'Build their professional reputation' },
    { text: 'Learn by teaching others' },
    { text: 'Connect with like-minded professionals' }
  ]
  </script>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sofia+Sans:wght@300;400;500;600;700;800;900&display=swap');

.mission-section {
  width: 100%;
  background: #FFFFFF;
  padding: 8rem 2rem 6rem;
  font-family: 'Sofia Sans', Arial, Helvetica, sans-serif;
}
  
  .mission-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .mission-label {
    display: inline-block;
    font-size: 2.9rem;
    font-weight: 650;
    letter-spacing: 0.01em;
    color: #4CAF4F;
    margin-bottom: 4rem;
  }
  
  .mission-heading {
    font-size: 3rem;
    font-weight: 500;
    color: #1a1a1a;
    line-height: 1.4;
    margin: 0 0 5rem 0;
    max-width: 900px;
  }
  
  .mission-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }
  
  .mission-card {
    padding: 2rem 0;
    border-top: 1px solid #e5e7eb;
    transition: border-color 0.3s ease;
  }
  
  .mission-card:hover {
    border-top-color: #4CAF4F;
  }
  
  .card-number {
    display: block;
    font-size: 1rem;
    font-weight: 600;
    color: #4CAF4F;
    margin-bottom: 1rem;
    letter-spacing: 0.05em;
  }
  
  .card-text {
    font-size: 1.3rem;
    font-weight: 400;
    color: #4a5568;
    line-height: 1.3;
    margin: 0;
  }
  
  .mission-quote {
    text-align: end;
    padding: 1.6rem 2rem;
    position: relative;
  }
  
  .mission-quote::before {
    content: '';
    position: absolute;
    top: 0;
    left: 74%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: #4CAF4F;
  }
  
  .quote-text {
    font-size: 1.5rem;
    font-weight: 300;
    color: #1a1a1a;
    line-height: 1.6;
    margin: 0;
    font-style: italic;
  }
  
  /* Адаптивность */
  @media (max-width: 968px) {
    .mission-section {
      padding: 6rem 2rem;
    }
  
    .mission-heading {
      font-size: 2rem;
      margin-bottom: 4rem;
    }
  
    .mission-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  
    .quote-text {
      font-size: 1.25rem;
    }
  }
  
  @media (max-width: 768px) {
    .mission-section {
      padding: 5rem 1.5rem;
    }
  
    .mission-label {
      font-size: 0.8125rem;
      margin-bottom: 1.5rem;
    }
  
    .mission-heading {
      font-size: 1.75rem;
      margin-bottom: 3rem;
    }
  
    .mission-card {
      padding: 1.5rem 0;
    }
  
    .card-text {
      font-size: 1rem;
    }
  
    .mission-quote {
      padding: 2rem 1rem;
    }
  
    .quote-text {
      font-size: 1.125rem;
    }
  }
  
  @media (max-width: 480px) {
    .mission-section {
      padding: 4rem 1rem;
    }
  
    .mission-heading {
      font-size: 1.5rem;
    }
  
    .card-number {
      font-size: 0.8125rem;
    }
  
    .card-text {
      font-size: 0.9375rem;
    }
  
    .quote-text {
      font-size: 1rem;
    }
  }
  </style>