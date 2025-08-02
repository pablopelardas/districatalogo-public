<template>
  <div v-if="showCarousel">
    <ProductCarousel
      title="Novedades"
      :products="products"
      :icon="SparklesIcon"
      :autoplay-interval="3000"
      @open-cart="$emit('openCart', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { SparklesIcon } from '@heroicons/vue/24/outline'
import ProductCarousel from './ProductCarousel.vue'
import { apiService, type Product } from '@/services/api'

defineEmits<{
  openCart: [product: Product]
}>()

// State
const products = ref<Product[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Only show carousel if we have products
const showCarousel = computed(() => products.value.length > 0)

// Fetch novedades
const fetchNovedades = async () => {
  loading.value = true
  error.value = null
  
  try {
    const result = await apiService.getNovedades()
    products.value = result.data
    
    if (result.error) {
      error.value = result.error
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error loading novedades'
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  fetchNovedades()
})
</script>