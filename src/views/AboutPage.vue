<template>
  <div class="about-page">
    <AboutHeroSection />
    <SecondAboutHero />
    <div class="about-real-experts-wrapper">
      <RealExperts />
    </div>
    <MissionSection />
    <OurTeam />
  </div>
</template>

<script setup>
import AboutHeroSection from '@/components/about/AboutHeroSection.vue'
import SecondAboutHero from '@/components/about/SecondAboutHero.vue'
import MissionSection from '@/components/about/MissionSection.vue'
import RealExperts from '@/components/home/RealExperts.vue'
import OurTeam from '@/components/about/OurTeam.vue'
</script>

<style scoped>
.about-page {
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>

<style>
@import url('https://fonts.googleapis.com/css2?family=Sofia+Sans:wght@300;400;500;600;700;800;900&display=swap');

/* Изменяем шрифт RealExperts на странице About - универсальный селектор */
.about-real-experts-wrapper * {
  font-family: 'Sofia Sans', Arial, Helvetica, sans-serif !important;
}
</style>

