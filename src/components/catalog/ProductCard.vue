<template>
  <article 
    :class="[
      'card-product group rounded-lg shadow-sm bg-white',
      viewMode === 'list' 
        ? 'flex items-center gap-4 px-3 py-2' 
        : 'flex flex-col items-center p-3'
    ]"
  >
    <!-- Imagen -->
    <div :class="viewMode === 'list' ? 'w-24 h-24' : 'w-full aspect-square mb-2'">
      <div class="w-full h-full bg-gray-50 rounded-md flex items-center justify-center">
        <img 
          v-if="product.imagen_urls?.length" 
          :src="product.imagen_urls[0]" 
          :alt="product.nombre"
          class="max-h-full max-w-full object-contain"
        />
        <ShoppingBagIcon v-else class="h-10 w-10 text-gray-300" />
      </div>
    </div>

    <!-- Contenido -->
    <div :class="viewMode === 'list' ? 'flex-1' : 'w-full text-center'">
      <h3 class="text-sm font-medium text-gray-800 mb-1 line-clamp-2 leading-snug">
        {{ product.nombre }}
      </h3>

      <div class="text-base font-semibold text-gray-900">
        ${{ product.precio }}
      </div>

      <div v-if="product.lista" class="text-xs text-gray-500 mt-0.5">
        {{ product.lista }}
      </div>
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
