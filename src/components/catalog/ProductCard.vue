<template>
  <article 
    :class="[
      'card-product group rounded-lg shadow-sm bg-white h-full',
      viewMode === 'list' 
        ? 'flex items-center gap-4 px-3 py-2' 
        : 'flex flex-col p-3'
    ]"
  >
    <!-- Imagen -->
    <div 
      :class="viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'w-full mb-2'"
      :style="viewMode === 'grid' ? 'height: 350px;' : ''"
    >
      <div class="w-full h-full bg-gray-50 rounded-md overflow-hidden">
        <img 
          v-if="product.imagen_urls?.length" 
          :src="product.imagen_urls[0]" 
          :alt="product.nombre"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <ShoppingBagIcon class="h-10 w-10 text-gray-300" />
        </div>
      </div>
    </div>

    <!-- Contenido -->
    <div :class="[
      viewMode === 'list' ? 'flex-1' : 'w-full text-center flex flex-col flex-1'
    ]">
      <h3 class="text-sm font-medium text-gray-800 mb-1 line-clamp-2 leading-snug flex-shrink-0">
        {{ product.nombre }}
      </h3>

      <div class="mt-auto">
        <div class="text-base font-semibold text-gray-900">
          ${{ product.precio }}
        </div>

        <div v-if="product.lista" class="text-xs text-gray-500 mt-0.5">
          {{ product.lista }}
        </div>
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