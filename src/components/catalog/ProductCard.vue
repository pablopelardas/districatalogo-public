<template>
  <div class="card card-product group">
    <!-- Imagen del producto -->
    <div class="relative">
      <div class="w-full h-44 overflow-hidden">
        <img
          v-if="product.imagen_urls && product.imagen_urls.length > 0"
          :src="product.imagen_urls[0]"
          :alt="product.imagen_alt || product.nombre"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          @error="handleImageError"
        />
        <div 
          v-else 
          class="w-full h-full flex items-center justify-center text-white font-bold text-base text-center p-4 leading-tight"
          :style="getProductImageStyle()"
        >
          {{ product.nombre }}
        </div>
      </div>
      
      <!-- Badge de destacado -->
      <div v-if="product.destacado" class="absolute top-3 left-3">
        <span 
          class="text-white px-2 py-1 rounded-full text-xs font-bold shadow-soft"
          :style="{ background: 'var(--theme-secondary)' }"
        >
          DESTACADO
        </span>
      </div>
    </div>
    
    <!-- Contenido del producto -->
    <div class="p-5">
      <!-- Código del producto -->
      <div class="mb-3">
        <span 
          class="text-white px-3 py-1 rounded-full text-xs font-bold inline-block shadow-soft"
          :style="{ background: 'var(--theme-primary)' }"
        >
          {{ product.codigo }}
        </span>
      </div>
      
      <!-- Nombre del producto -->
      <h3 class="text-base font-semibold text-gray-800 mb-2 line-clamp-2 leading-snug min-h-[2.5rem]">
        {{ product.nombre }}
      </h3>
      
      <!-- Marca -->
      <p v-if="product.marca" class="text-gray-600 text-sm mb-3 font-medium">
        {{ product.marca }}
      </p>
      
      <!-- Precio -->
      <div v-if="showPrices && product.precio !== null" class="mb-4">
        <div 
          class="text-xl font-bold"
          :style="{ color: 'var(--theme-secondary)' }"
        >
          ${{ formatPrice(product.precio) }}
        </div>
        <div v-if="product.lista_precio_nombre" class="text-xs text-gray-500 mt-1">
          {{ product.lista_precio_nombre }}
        </div>
      </div>
      
      <!-- Stock -->
      <div v-if="showStock && product.stock !== null" class="mb-4">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">Stock:</span>
          <span class="font-semibold" :class="stockColorClass">
            {{ product.stock }} {{ product.unidad || 'UN' }}
          </span>
        </div>
      </div>
      
      <!-- Botón de acción -->
      <button
        @click="viewProduct"
        class="btn btn-primary w-full"
      >
        Ver detalles
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCompanyStore } from '@/stores/company'
import { PhotoIcon, PlusIcon } from '@heroicons/vue/24/outline'
import type { Product } from '@/services/api'

// Props
interface Props {
  product: Product
}

const props = defineProps<Props>()

// Composables
const router = useRouter()
const companyStore = useCompanyStore()

// Computed
const showPrices = computed(() => companyStore.showPrices)
const showStock = computed(() => companyStore.showStock)
const allowOrders = computed(() => companyStore.allowOrders)

const stockColorClass = computed(() => {
  if (props.product.stock === null) return 'text-gray-600'
  if (props.product.stock === 0) return 'text-red-600'
  if (props.product.stock < 10) return 'text-yellow-600'
  return 'text-green-600'
})

// Methods
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

const viewProduct = () => {
  router.push(`/product/${props.product.codigo}`)
}

const addToCart = () => {
  // TODO: Implementar funcionalidad de carrito
  console.log('Agregar al carrito:', props.product.codigo)
}

const getProductImageStyle = () => {
  // Generar un color de fondo basado en el nombre del producto
  const colors = [
    'linear-gradient(135deg, #dc143c, #b91c1c)',
    'linear-gradient(135deg, #4169e1, #3b82f6)',
    'linear-gradient(135deg, #ff8c00, #f97316)',
    'linear-gradient(135deg, #0052cc, #2563eb)',
    'linear-gradient(135deg, #00aa44, #16a34a)',
    'linear-gradient(135deg, #87ceeb, #38bdf8)',
    'linear-gradient(135deg, #8b4513, #a16207)',
    'linear-gradient(135deg, #1e3a8a, #1d4ed8)',
    'linear-gradient(135deg, #40e0d0, #06b6d4)',
    'linear-gradient(135deg, #daa520, #eab308)',
    'linear-gradient(135deg, #ff6347, #ef4444)',
    'linear-gradient(135deg, #9932cc, #9333ea)'
  ]
  
  // Usar el código del producto para generar un índice consistente
  const hash = props.product.codigo.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const colorIndex = Math.abs(hash) % colors.length
  
  return {
    background: colors[colorIndex]
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>