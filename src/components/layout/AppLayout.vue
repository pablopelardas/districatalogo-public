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
    
    <!-- Floating WhatsApp Button -->
    <FloatingWhatsApp />
    
    <!-- Scroll to Top Button -->
    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp.vue'
import ScrollToTop from '@/components/ui/ScrollToTop.vue'
</script>