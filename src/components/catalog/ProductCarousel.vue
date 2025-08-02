<template>
  <div class="carousel-container py-6">
    <!-- Title -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
        <component 
          :is="icon" 
          class="h-8 w-8 text-yellow-400"
        />
        {{ title }}
      </h2>
      
      <!-- Manual Controls -->
      <div v-if="products.length > visibleProducts" class="hidden sm:flex items-center gap-2">
        <button
          @click="prevSlide"
          :disabled="currentIndex === 0"
          class="control-btn w-12 h-12"
          :class="{ 'opacity-50 cursor-not-allowed': currentIndex === 0 }"
          aria-label="Anterior"
        >
          <ChevronLeftIcon class="h-5 w-5" />
        </button>
        <button
          @click="nextSlide"
          :disabled="currentIndex >= maxIndex"
          class="control-btn w-12 h-12"
          :class="{ 'opacity-50 cursor-not-allowed': currentIndex >= maxIndex }"
          aria-label="Siguiente"
        >
          <ChevronRightIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
    
    <!-- Carousel -->
    <div 
      class="relative overflow-hidden rounded-xl"
      @mouseenter="pauseAutoplay"
      @mouseleave="resumeAutoplay"
    >
      <!-- Products Track -->
      <div 
        class="flex transition-transform duration-500 ease-in-out"
        :style="{ transform: `translateX(-${(currentIndex * 100) / visibleProducts}%)` }"
      >
        <div
          v-for="product in products"
          :key="product.codigo"
          :class="[
            'flex-shrink-0 px-3',
            isMobile ? 'w-full' : 'w-1/4'
          ]"
        >
          <div 
            class="carousel-card group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
            @click="openAddToCartModal(product)"
          >
            <!-- Image -->
            <div class="aspect-square bg-gray-50 rounded-t-xl overflow-hidden relative">
              <img 
                v-if="product.imagen_urls?.length" 
                :src="product.imagen_urls[0]" 
                :alt="product.nombre"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <ShoppingBagIcon class="h-16 w-16 text-gray-300" />
              </div>
              
              <!-- Hover overlay -->
              <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div class="bg-white/90 text-gray-800 px-4 py-2 rounded-lg shadow-lg font-medium">
                  Agregar a mi lista
                </div>
              </div>
            </div>
            
            <!-- Content -->
            <div class="p-4">
              <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2 leading-snug min-h-[3rem]">
                {{ product.nombre }}
              </h3>
              
              <div class="flex items-center justify-between">
                <div class="text-xl font-bold" :style="{ color: 'var(--theme-accent)' }">
                  ${{ product.precio }}
                </div>
                
                <button
                  @click.stop="openAddToCartModal(product)"
                  class="add-btn w-12 h-12"
                  :style="{ background: 'var(--theme-accent)' }"
                  aria-label="Agregar a mi lista"
                >
                  <PlusIcon class="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mobile Navigation Dots -->
    <div v-if="isMobile && products.length > 1" class="flex justify-center mt-4 gap-2">
      <button
        v-for="(_, index) in products"
        :key="index"
        @click="goToSlide(index)"
        class="dot"
        :class="{ 'active': index === currentIndex }"
        :aria-label="`Ir al producto ${index + 1}`"
      ></button>
    </div>
    
    <!-- Desktop Pagination Indicators -->
    <div v-if="!isMobile && products.length > visibleProducts" class="flex justify-center mt-6 gap-2">
      <button
        v-for="(_, index) in Array(Math.ceil(products.length / visibleProducts))"
        :key="index"
        @click="goToSlide(index * visibleProducts)"
        class="dot"
        :class="{ 'active': Math.floor(currentIndex / visibleProducts) === index }"
        :aria-label="`Ir a la página ${index + 1}`"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon, ShoppingBagIcon, PlusIcon } from '@heroicons/vue/24/outline'
import type { Product } from '@/services/api'

interface Props {
  title: string
  products: Product[]
  icon: unknown
  autoplayInterval?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoplayInterval: 3000
})

const emit = defineEmits<{
  openCart: [product: Product]
}>()

// Reactive data
const currentIndex = ref(0)
const autoplayTimer = ref<number | null>(null)
const isPaused = ref(false)

// Responsive behavior
const isMobile = ref(false)
const visibleProducts = computed(() => isMobile.value ? 1 : 4)
const maxIndex = computed(() => Math.max(0, props.products.length - visibleProducts.value))

// Check if screen is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

// Navigation methods
const nextSlide = () => {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value += isMobile.value ? 1 : visibleProducts.value
  } else {
    currentIndex.value = 0 // Loop back to start
  }
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= isMobile.value ? 1 : visibleProducts.value
  } else {
    currentIndex.value = maxIndex.value // Loop to end
  }
}

const goToSlide = (index: number) => {
  currentIndex.value = Math.min(index, maxIndex.value)
}

// Autoplay methods
const startAutoplay = () => {
  if (props.products.length <= visibleProducts.value) return
  
  autoplayTimer.value = setInterval(() => {
    if (!isPaused.value) {
      nextSlide()
    }
  }, props.autoplayInterval)
}

const stopAutoplay = () => {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value)
    autoplayTimer.value = null
  }
}

const pauseAutoplay = () => {
  isPaused.value = true
}

const resumeAutoplay = () => {
  isPaused.value = false
}

// Cart modal handler
const openAddToCartModal = (product: Product) => {
  // Pause autoplay when user interacts
  pauseAutoplay()
  setTimeout(resumeAutoplay, 2000) // Resume after 2 seconds
  
  emit('openCart', product)
}

// Watch for products changes to reset carousel
watch(() => props.products, () => {
  currentIndex.value = 0
  stopAutoplay()
  if (props.products.length > 0) {
    startAutoplay()
  }
})

// Lifecycle
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  if (props.products.length > 0) {
    startAutoplay()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  stopAutoplay()
})
</script>

<style scoped>
@reference "tailwindcss";

.carousel-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.control-btn {
  @apply rounded-full flex items-center justify-center text-white transition-all duration-200;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.carousel-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.add-btn {
  @apply rounded-full flex items-center justify-center transition-transform duration-200 shadow-lg;
}

.add-btn:hover {
  transform: scale(1.1);
}

.dot {
  @apply w-3 h-3 rounded-full transition-all duration-200;
  background: rgba(255, 255, 255, 0.4);
}

.dot:hover {
  background: rgba(255, 255, 255, 0.6);
}

.dot.active {
  @apply transform scale-125;
  background: white;
}

/* Text clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>