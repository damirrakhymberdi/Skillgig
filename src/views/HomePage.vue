<template>
  <div class="home-page">
    <HeroSection />
    <Section />
    <RealExperts />
    <WhatSkill />
    <WhoCanUse />
  </div>
</template>

<script setup>
import HeroSection from '@/components/home/HeroSection.vue'
import Section from '@/components/home/Section.vue'
import WhatSkill from '@/components/home/WhatSkill.vue'
import RealExperts from '@/components/home/RealExperts.vue'
import WhoCanUse from '@/components/home/WhoCanUse.vue'
</script>

<style scoped>
.home-page {
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>