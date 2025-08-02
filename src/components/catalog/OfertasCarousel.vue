<template>
  <div v-if="showCarousel">
    <ProductCarousel
      title="Ofertas"
      :products="products"
      :icon="TagIcon"
      :autoplay-interval="3000"
      @open-cart="$emit('openCart', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { TagIcon } from '@heroicons/vue/24/outline'
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

// Fetch ofertas
const fetchOfertas = async () => {
  loading.value = true
  error.value = null
  
  try {
    const result = await apiService.getOfertas()
    products.value = result.data
    
    if (result.error) {
      error.value = result.error
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error loading ofertas'
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  fetchOfertas()
})
</script>