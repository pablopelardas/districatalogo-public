<template>
  <div class="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
    <!-- Información móvil -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="$emit('prev')"
        :disabled="!hasPrev"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
      >
        Anterior
      </button>
      <button
        @click="$emit('next')"
        :disabled="!hasNext"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
      >
        Siguiente
      </button>
    </div>
    
    <!-- Información desktop -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between sm:gap-5">
      <div>
        <p class="text-sm text-gray-700">
          Página <span class="font-medium">{{ currentPage }}</span> de
          <span class="font-medium">{{ totalPages }}</span>
        </p>
      </div>
      
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <!-- Botón anterior -->
          <button
            @click="$emit('prev')"
            :disabled="!hasPrev"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-600 transition-colors focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-400"
          >
            <span class="sr-only">Anterior</span>
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </button>
          
          <!-- Números de página -->
          <template v-for="page in visiblePages" :key="page">
            <button
              v-if="page !== '...'"
              @click="$emit('goto', page)"
              :class="[
                page === currentPage
                  ? 'relative z-10 inline-flex items-center bg-[--theme-primary] px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--theme-primary]'
                  : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-700 transition-colors focus:z-20 focus:outline-offset-0'
              ]"
            >
              {{ page }}
            </button>
            <span
              v-else
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
            >
              ...
            </span>
          </template>
          
          <!-- Botón siguiente -->
          <button
            @click="$emit('next')"
            :disabled="!hasNext"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-600 transition-colors focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-400"
          >
            <span class="sr-only">Siguiente</span>
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'

// Props
interface Props {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  maxVisible?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxVisible: 7
})

// Emits
defineEmits<{
  next: []
  prev: []
  goto: [page: number | string]
}>()

// Computed
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const { currentPage, totalPages, maxVisible } = props
  
  if (totalPages <= maxVisible) {
    // Mostrar todas las páginas
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Mostrar páginas con elipsis
    const halfVisible = Math.floor(maxVisible / 2)
    
    // Siempre mostrar la primera página
    pages.push(1)
    
    let start = Math.max(2, currentPage - halfVisible)
    let end = Math.min(totalPages - 1, currentPage + halfVisible)
    
    // Ajustar para mantener maxVisible páginas
    if (end - start + 1 < maxVisible - 2) {
      if (start === 2) {
        end = Math.min(totalPages - 1, start + maxVisible - 3)
      } else {
        start = Math.max(2, end - maxVisible + 3)
      }
    }
    
    // Agregar elipsis antes si es necesario
    if (start > 2) {
      pages.push('...')
    }
    
    // Agregar páginas del medio
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    // Agregar elipsis después si es necesario
    if (end < totalPages - 1) {
      pages.push('...')
    }
    
    // Siempre mostrar la última página
    if (totalPages > 1) {
      pages.push(totalPages)
    }
  }
  
  return pages
})
</script>