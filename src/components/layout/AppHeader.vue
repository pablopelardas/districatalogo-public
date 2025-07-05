<template>
  <header class="sticky top-0 z-50">
    <!-- Main Header -->
    <div class="glass-header">
      <div class="container">
        <div class="flex items-center justify-between py-4">
          <!-- Logo y nombre -->
          <RouterLink to="/" class="flex items-center space-x-4">
            <div 
              v-if="companyLogo"
              class="w-14 h-14 rounded-full overflow-hidden border-2 border-white/30"
            >
              <img 
                :src="companyLogo" 
                :alt="companyName"
                class="w-full h-full object-cover"
              />
            </div>
            <div 
              v-else 
              class="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
              :style="{ background: 'var(--theme-accent)' }"
            >
              {{ companyName.charAt(0) }}
            </div>
            <div class="text-white">
              <h1 class="text-lg font-bold leading-tight">{{ companyName }}</h1>
              <p v-if="company?.razon_social" class="text-sm opacity-90 leading-tight">{{ company.razon_social }}</p>
            </div>
          </RouterLink>

          <!-- Subtitle badge -->
          <div 
            class="hidden md:block px-4 py-2 rounded-full text-white font-bold text-xs"
            :style="{ background: 'var(--theme-secondary)' }"
          >
            CATÁLOGO ONLINE
          </div>
        </div>

        <!-- Search Bar -->
        <div class="pb-4">
          <div class="max-w-md mx-auto">
            <SearchBar 
              v-model="searchQuery"
              @search="handleSearch"
              placeholder="Buscar productos..."
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Section -->
    <div v-if="hasCategories" class="glass-light border-t border-white/10">
      <div class="container py-4">
        <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            class="category-chip"
            :class="{ active: selectedCategory === null }"
            @click="setCategory(null)"
          >
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              <span>🛒</span>
            </div>
            <span class="font-medium">Todos</span>
          </button>
          
          <button
            v-for="category in categories.slice(0, 12)"
            :key="category.id"
            class="category-chip"
            :class="{ active: selectedCategory === category.codigo_rubro }"
            @click="setCategory(category.codigo_rubro)"
          >
            <div 
              class="w-8 h-8 rounded-full text-white font-bold text-sm flex items-center justify-center shadow-lg"
              :style="{ 
                background: `linear-gradient(135deg, ${category.color}, ${adjustColorBrightness(category.color, -20)})`
              }"
            >
              {{ category.nombre.charAt(0).toUpperCase() }}
            </div>
            <span class="font-medium">{{ category.nombre }}</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useCompanyStore } from '@/stores/company'
import { useCatalogStore } from '@/stores/catalog'
import SearchBar from '@/components/catalog/SearchBar.vue'

// Stores
const companyStore = useCompanyStore()
const catalogStore = useCatalogStore()

// State
const searchQuery = ref('')
const selectedCategory = ref<number | null>(null)

// Computed
const company = computed(() => companyStore.company)
const companyName = computed(() => companyStore.companyName)
const companyLogo = computed(() => companyStore.companyLogo)
const categories = computed(() => catalogStore.categories)
const hasCategories = computed(() => catalogStore.hasCategories)

// Methods
const handleSearch = () => {
  catalogStore.setSearch(searchQuery.value)
}

const setCategory = (categoryId: number | null) => {
  selectedCategory.value = categoryId
  catalogStore.setCategory(categoryId)
}

const adjustColorBrightness = (color: string, percent: number) => {
  const usePound = color[0] === '#'
  const col = usePound ? color.slice(1) : color
  const num = parseInt(col, 16)
  let r = (num >> 16) + percent
  let g = (num >> 8 & 0x00FF) + percent
  let b = (num & 0x0000FF) + percent
  r = r > 255 ? 255 : r < 0 ? 0 : r
  g = g > 255 ? 255 : g < 0 ? 0 : g
  b = b > 255 ? 255 : b < 0 ? 0 : b
  return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0')
}
</script>