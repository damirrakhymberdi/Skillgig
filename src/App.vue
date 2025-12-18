<template>
  <div id="app">
    <Header v-if="showHeader" />
    <router-view />
    <Footer v-if="showFooter" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from './components/common/Header.vue';
import Footer from './components/common/Footer.vue';

const route = useRoute()

const showFooter = computed(() =>
  route.path !== '/faq' &&
  route.path !== '/register' &&
  route.path !== '/login' &&
  route.path !== '/get-started' &&
  route.path !== '/questions'
)

const showHeader = computed(() => route.path !== '/register' && route.path !== '/login')
</script>