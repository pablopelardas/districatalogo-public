<!-- AppHeader.vue - Header mejorado con mejor spacing -->
<template>
  <header class="transition-all duration-300" :class="{ 'shadow-lg': isScrolled }">
    <!-- Main Header -->
    <div class="glass-header">
      <div class="container">
        <div class="flex items-center justify-between py-8 sm:py-4">
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
        </div>

        <!-- Search Bar con mejor padding -->
        <div class="pb-10 sm:pb-6">
          <div class="max-w-xl mx-auto">
            <SearchBar 
              v-model="searchQuery"
              @search="handleSearch"
              @searchWithScroll="handleSearchWithScroll"
              placeholder="¿Qué estás buscando hoy?"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Section expandido -->
    <div v-if="catalogStore.loadingCategories || (hasCategories && catalogStore.hasProducts)" class="py-4 bg-white/10 backdrop-blur-sm border-t border-white/10">
      <div class="container py-6">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
          <!-- Show skeleton only when loading categories OR when searching (loadingProducts + searchQuery) -->
          <template v-if="catalogStore.loadingCategories || (catalogStore.loadingProducts && catalogStore.searchQuery)">
            <CategoryChipSkeleton v-for="i in 12" :key="`chip-skeleton-${i}`" />
          </template>
          
          <!-- Show actual categories when not loading -->
          <template v-else>
            <button
              class="category-pill"
              :class="{ active: selectedCategory === null }"
              @click="setCategory(null)"
            >
              <ViewGridIcon class="h-4 w-4" />
              <span>Todos</span>
              <span class="count">({{ totalProducts }})</span>
            </button>
            
            <button
              v-for="category in categories"
              :key="category.id"
              class="category-pill"
              :class="{ active: selectedCategory === category.codigo_rubro }"
              @click="setCategory(category.codigo_rubro)"
            >
              <!-- Category Icon -->
              <span 
                v-if="category.icono" 
                class="category-icon-text"
                :style="{ color: category.color || 'var(--theme-accent)' }"
              >
                {{ category.icono }}
              </span>
              
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
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
const categories = computed(() => catalogStore.displayCategories)
const hasCategories = computed(() => catalogStore.hasCategories)
const totalProducts = computed(() => {
  // If there's a search query, show the total results from search
  if (catalogStore.searchQuery) {
    return catalogStore.totalCount
  }
  // Otherwise, show original total count (for category filtering without search)
  return catalogStore.originalTotalCount || catalogStore.totalCount
})

// Methods
const handleSearch = async () => {
  await catalogStore.setSearch(searchQuery.value)
}

const handleSearchWithScroll = async () => {
  await catalogStore.setSearch(searchQuery.value)
  // Scroll to products after search is complete
  requestAnimationFrame(() => {
    const toolbarElement = document.querySelector('.products-toolbar')
    if (toolbarElement) {
      const yOffset = 10;
      const y = toolbarElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      // Custom easing function
      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };
      
      // Animate scroll with 300ms duration
      const duration = 300;
      const startY = window.pageYOffset;
      const distance = y - startY;
      const startTime = performance.now();
      
      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);
        
        window.scrollTo(0, startY + distance * easedProgress);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      
      requestAnimationFrame(animateScroll);
    }
  })
}

const setCategory = async (categoryId: number | null) => {
  selectedCategory.value = categoryId
  await catalogStore.setCategory(categoryId)
}


const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

// Watch for store changes to sync UI with store state
watch(() => catalogStore.selectedCategory, (newCategory) => {
  selectedCategory.value = newCategory
})

watch(() => catalogStore.searchQuery, (newQuery) => {
  searchQuery.value = newQuery
})

onMounted(() => {
  // Sync initial state from store
  selectedCategory.value = catalogStore.selectedCategory
  searchQuery.value = catalogStore.searchQuery
  
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
 @reference "tailwindcss";
.category-pill {
  @apply flex items-center gap-2 px-3 py-2 rounded-full text-white text-sm font-medium transition-all justify-center min-h-[2.5rem] cursor-pointer;
  background: var(--theme-secondary);
}

.category-pill:hover {
  filter: brightness(1.1);
}

.category-pill.active {
  filter: brightness(1.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.category-pill .count {
  @apply text-xs opacity-70;
}

.category-icon-text {
  @apply text-lg font-bold flex-shrink-0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
</style>