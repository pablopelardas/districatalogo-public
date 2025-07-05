<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <AppHeader />
    
    <!-- Main Content -->
    <main class="flex-1 py-8">
      <div class="container">
        <slot />
      </div>
    </main>
    
    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
</script>