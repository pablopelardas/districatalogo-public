<!-- AppHeader.vue - Header mejorado con mejor spacing -->
<template>
  <header class="sticky top-0 z-50 transition-all duration-300" :class="{ 'shadow-lg': isScrolled }">
    <!-- Main Header -->
    <div class="glass-header">
      <div class="container">
        <div class="flex items-center justify-between py-6">
          <!-- Logo y nombre con mejor proporción -->
          <RouterLink to="/" class="group flex items-center gap-3">
            <div class="relative">
              <div 
                v-if="companyLogo"
                class="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/20 shadow-md group-hover:shadow-lg transition-all"
              >
                <img 
                  :src="companyLogo" 
                  :alt="companyName"
                  class="w-full h-full object-cover"
                />
              </div>
              <div 
                v-else 
                class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
                :style="{ background: 'var(--theme-accent)' }"
              >
                {{ companyName.charAt(0) }}
              </div>
              <!-- Status indicator -->
              <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            
            <div class="text-white">
              <h1 class="text-lg font-semibold">{{ companyName }}</h1>
              <p v-if="company?.razon_social" class="text-sm opacity-80">{{ company.razon_social }}</p>
            </div>
          </RouterLink>

          <!-- Badge y acciones -->
          <div class="flex items-center gap-4">
            <div 
              class="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium"
              :style="{ background: 'var(--theme-secondary)' }"
            >
              <SparklesIcon class="h-4 w-4" />
              CATÁLOGO ONLINE
            </div>
            
            <!-- Iconos de acción móvil -->
            <div class="flex items-center gap-2 md:hidden">
              <button class="p-2 text-white/80 hover:text-white">
                <HeartIcon class="h-5 w-5" />
              </button>
              <button class="p-2 text-white/80 hover:text-white relative">
                <ShoppingCartIcon class="h-5 w-5" />
                <span v-if="cartCount > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {{ cartCount }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Search Bar con mejor padding -->
        <div class="pb-4">
          <div class="max-w-xl mx-auto">
            <SearchBar 
              v-model="searchQuery"
              @search="handleSearch"
              placeholder="¿Qué estás buscando hoy?"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Section simplificado -->
    <div v-if="catalogStore.loadingCategories || hasCategories" class="bg-white/10 backdrop-blur-sm border-t border-white/10">
      <div class="container py-3">
        <div class="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
          <button
            v-if="!catalogStore.loadingCategories"
            class="category-pill"
            :class="{ active: selectedCategory === null }"
            @click="setCategory(null)"
          >
            <ViewGridIcon class="h-4 w-4" />
            <span>Todos</span>
            <span class="count">({{ totalProducts }})</span>
          </button>
          
          <template v-if="catalogStore.loadingCategories">
            <CategoryChipSkeleton v-for="i in 7" :key="`chip-skeleton-${i}`" />
          </template>
          <template v-else>
            <button
              v-for="category in categories"
              :key="category.id"
              class="category-pill"
              :class="{ active: selectedCategory === category.codigo_rubro }"
              @click="setCategory(category.codigo_rubro)"
            >
              <span>{{ category.nombre }}</span>
              <span class="count">({{ category.product_count || 0 }})</span>
            </button>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useCompanyStore } from '@/stores/company'
import { useCatalogStore } from '@/stores/catalog'
import SearchBar from '@/components/catalog/SearchBar.vue'
import CategoryChipSkeleton from '@/components/ui/CategoryChipSkeleton.vue'
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  SparklesIcon, 
  Squares2X2Icon as ViewGridIcon
} from '@heroicons/vue/24/outline'

// Stores
const companyStore = useCompanyStore()
const catalogStore = useCatalogStore()

// State
const searchQuery = ref('')
const selectedCategory = ref<number | null>(null)
const isScrolled = ref(false)
const cartCount = ref(3) // Ejemplo

// Computed
const company = computed(() => companyStore.company)
const companyName = computed(() => companyStore.companyName)
const companyLogo = computed(() => companyStore.companyLogo)
const categories = computed(() => catalogStore.categories)
const hasCategories = computed(() => catalogStore.hasCategories)
const totalProducts = computed(() => catalogStore.totalCount)

// Methods
const handleSearch = async () => {
  await catalogStore.setSearch(searchQuery.value)
}

const setCategory = async (categoryId: number | null) => {
  selectedCategory.value = categoryId
  await catalogStore.setCategory(categoryId)
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
 @reference "tailwindcss";
.category-pill {
  @apply flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium whitespace-nowrap transition-all hover:bg-white/20;
}

.category-pill.active {
  @apply bg-white/25;
}

.category-pill .count {
  @apply text-xs opacity-70;
}
</style>