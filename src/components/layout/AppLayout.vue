<!-- AppLayout.vue actualizado con mejor estructura -->
<template>
  <div class="min-h-screen flex flex-col" :style="{ background: `linear-gradient(135deg, var(--theme-primary), var(--theme-primary-dark))` }">
    <!-- Header -->
    <AppHeader />
    
    <!-- Main Content con container apropiado -->
    <main class="flex-1">
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