<template>
  <section class="categories-section">
    <div class="section-container">
      <div class="categories-content">
        <!-- 3D Карусель слева -->
        <div class="carousel-wrapper">
          <div class="card-3d">
            <div 
              v-for="(image, index) in categoryImages" 
              :key="index"
              :style="{ backgroundImage: `url(${image})` }"
            ></div>
          </div>
        </div>
        
        <!-- Текст и кнопка справа -->
        <div class="text-content">
          <h2 class="categories-title">Categories</h2>
          <RouterLink to="/categories" class="learn-more-btn">Learn More</RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'

// Импорт изображений из папки mamandyks
import image1 from '@/assets/images/mamandyks/216cd939a2108361936eaf287247a27c.png'
import image2 from '@/assets/images/mamandyks/353f2055215421816e22d27cdbf933b8.jpg'
import image3 from '@/assets/images/mamandyks/68747470733a2f2f63646e2e776f726c64766563746f726c6f676f2e636f6d2f6c6f676f732f666c75747465722d6c6f676f2e737667.svg'
import image4 from '@/assets/images/mamandyks/a6cb786aeee17aad94fb796e5544deaf.webp'
import image5 from '@/assets/images/mamandyks/unnamed.jpg'

// Используем все 5 изображений и повторяем их для 10 карточек
const categoryImages = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image1,
  image2,
  image3,
  image4,
  image5
]
</script>

<style scoped>
.categories-section {
  width: 100%;
  background-color: var(--accent); /* Светло-зеленый/лаймовый фон */
  padding: 6rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: var(--font-display);
}

.section-container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.categories-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.carousel-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  background-color: #000000;
  height: 350px;
  width: 450px;
  border-radius: 15px;
  margin-left: 100px;
}

.text-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: flex-start;
}

.categories-title {
  font-size: 4rem;
  font-weight: 700;
  color: black; /* Фиолетовый цвет */
  margin: 0;
  line-height: 1.2;
}

.learn-more-btn {
  display: inline-block;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 15px;
  background-color: black; /* Фиолетовый цвет */
  color: #ffffff;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);
}

.learn-more-btn:hover {
  background-color: #7C3AED;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(139, 92, 246, 0.4);
}

/* 3D Карусель стили */
@keyframes autoRun3d {
  from {
    transform: perspective(400px) rotateY(-360deg);
  }
  to {
    transform: perspective(400px) rotateY(0deg);
  }
}

@keyframes animateBrightness {
  10% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(0.1);
  }
  90% {
    filter: brightness(1);
  }
}

.card-3d {
  position: relative;
  width: 500px;
  height: 200px;
  transform-style: preserve-3d;
  transform: perspective(800px);
  animation: autoRun3d 20s linear infinite;
  will-change: transform;
}

.card-3d div {
  position: absolute;
  width: 80px;
  height: 112px;
  background-color: #FFD700; /* Желтый фон вместо серого */ 
  border-radius: 0.5rem;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  animation: animateBrightness 20s linear infinite;
  transition-duration: 200ms;
  will-change: transform, filter;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.card-3d:hover {
  animation-play-state: paused !important;
}

.card-3d:hover div {
  animation-play-state: paused !important;
}

.card-3d div:nth-child(1) {
  transform: translate(-50%, -50%) rotateY(0deg) translateZ(150px);
  animation-delay: -0s;
}

.card-3d div:nth-child(2) {
  transform: translate(-50%, -50%) rotateY(36deg) translateZ(150px);
  animation-delay: -2s;
}

.card-3d div:nth-child(3) {
  transform: translate(-50%, -50%) rotateY(72deg) translateZ(150px);
  animation-delay: -4s;
}

.card-3d div:nth-child(4) {
  transform: translate(-50%, -50%) rotateY(108deg) translateZ(150px);
  animation-delay: -6s;
}

.card-3d div:nth-child(5) {
  transform: translate(-50%, -50%) rotateY(144deg) translateZ(150px);
  animation-delay: -8s;
}

.card-3d div:nth-child(6) {
  transform: translate(-50%, -50%) rotateY(180deg) translateZ(150px);
  animation-delay: -10s;
}

.card-3d div:nth-child(7) {
  transform: translate(-50%, -50%) rotateY(216deg) translateZ(150px);
  animation-delay: -12s;
}

.card-3d div:nth-child(8) {
  transform: translate(-50%, -50%) rotateY(252deg) translateZ(150px);
  animation-delay: -14s;
}

.card-3d div:nth-child(9) {
  transform: translate(-50%, -50%) rotateY(288deg) translateZ(150px);
  animation-delay: -16s;
}

.card-3d div:nth-child(10) {
  transform: translate(-50%, -50%) rotateY(324deg) translateZ(150px);
  animation-delay: -18s;
}

/* Адаптивность */
@media (max-width: 968px) {
  .categories-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .carousel-wrapper {
    order: 1;
    margin:auto;    
  }

  .text-content {
    order: 2;
    align-items: center;
    text-align: center;
  }

  .categories-title {
    font-size: 3rem;
  }

  .card-3d {
    width: 350px;
    height: 180px;
  }
}

@media (max-width: 768px) {
  .categories-section {
    padding: 3rem 1.5rem;
  }

  .categories-content {
    gap: 2rem;
  }

  .categories-title {
    font-size: 2.5rem;
  }

  .card-3d {
    width: 300px;
    height: 160px;
  }

  .card-3d div {
    width: 70px;
    height: 100px;
  }
}

@media (max-width: 480px) {
  .categories-section {
    padding: 2rem 1rem;
  }


  @keyframes autoRun3d {
  from {
    transform: perspective(800px) rotateY(-360deg);
  }
  to {
    transform: perspective(800px) rotateY(0deg);
  }
}

.card-3d div {
  position: absolute;
  width: 50px;
  height: 80px;
  background-color: #FFD700; /* Желтый фон вместо серого */ 
  border-radius: 0.5rem;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  animation: animateBrightness 20s linear infinite;
  transition-duration: 200ms;
  will-change: transform, filter;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

  .carousel-wrapper {
    margin: auto;    
    height: 250px;
    width: 350px;
  }

  .categories-title {
    font-size: 2rem;
  }

  .card-3d {
    width: 250px;
    height: 140px;
  }

  .card-3d div {
    width: 60px;
    height: 85px;
  }

  .learn-more-btn {
    padding: 0.875rem 2rem;
    font-size: 1rem;
  }
}
</style>

