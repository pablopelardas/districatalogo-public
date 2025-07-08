<template>
  <Transition name="scroll-to-top">
    <button
      v-if="showButton"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 z-50 group cursor-pointer"
      :aria-label="'Volver arriba'"
    >
      <!-- Button -->
      <div class="relative">
        <div 
          class="flex items-center justify-center w-14 h-14 rounded-full shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300"
          :style="{ background: 'var(--theme-accent)' }"
        >
          <ChevronUpIcon class="w-8 h-8 text-white stroke-2" />
        </div>
        
        <!-- Subtle pulse animation -->
        <div 
          class="absolute inset-0 rounded-full animate-ping opacity-30" 
          :style="{ background: 'var(--theme-accent)' }"
        ></div>
      </div>
      
      <!-- Tooltip -->
      <div class="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div class="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap">
          Volver arriba
          <div class="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronUpIcon } from '@heroicons/vue/24/outline'

const showButton = ref(false)

const handleScroll = () => {
  // Show button when user has scrolled down more than 300px
  showButton.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Scroll to top button transitions */
.scroll-to-top-enter-active,
.scroll-to-top-leave-active {
  transition: all 0.3s ease;
}

.scroll-to-top-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.scroll-to-top-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}
</style>