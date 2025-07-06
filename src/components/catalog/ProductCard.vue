<!-- ProductCard.vue - Ejemplo de tarjeta de producto -->
<template>
  <article 
    :class="[
      'card-product group',
      viewMode === 'list' ? 'flex gap-4 p-4' : 'flex flex-col'
    ]"
  >
    <!-- Imagen -->
    <div :class="viewMode === 'list' ? 'w-32 h-32' : 'aspect-square p-4'">
      <div class="w-full h-full bg-white rounded-lg flex items-center justify-center">
        <img 
          v-if="product.imagen_urls && product.imagen_urls.length > 0" 
          :src="product.imagen_urls[0]" 
          :alt="product.nombre"
          class="max-w-full max-h-full object-contain"
        />
        <ShoppingBagIcon v-else class="h-12 w-12 text-gray-300" />
      </div>
    </div>
    
    <!-- Contenido -->
    <div :class="viewMode === 'list' ? 'flex-1' : 'p-4 pt-0'">
      <h3 class="font-medium text-gray-800 mb-2 line-clamp-2">{{ product.nombre }}</h3>
      
      <!-- Precio -->
      <div class="flex items-baseline gap-2 mb-3">
        <span class="text-2xl font-bold text-gray-900">${{ product.precio }}</span>
        <span v-if="product.lista" class="text-sm text-gray-500">{{ product.lista }}</span>
      </div>
      
      <!-- Actions -->
      <a class="w-full btn btn-primary" 
         :href="`/producto/${product.codigo}`"
         :class="viewMode === 'list' ? 'w-full' : ''"
        
      >
        Ver detalles
      </a>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ShoppingBagIcon } from '@heroicons/vue/24/outline'

interface Props {
  product: any
  viewMode?: 'grid' | 'list'
}

withDefaults(defineProps<Props>(), {
  viewMode: 'grid'
})
</script>