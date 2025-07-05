<template>
  <div class="section">
    <!-- Stats -->
    <div class="stats-container mb-6">
      <span>{{ totalCount }} producto{{ totalCount !== 1 ? 's' : '' }} encontrado{{ totalCount !== 1 ? 's' : '' }}</span>
    </div>

    <!-- Filtros activos -->
    <div v-if="hasActiveFilters" class="info-container mb-6">
      <div class="flex flex-wrap gap-3 items-center">
        <span class="text-white text-sm font-medium">Filtros activos:</span>
        
        <span v-if="selectedCategory" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white shadow-soft" :style="{ background: 'var(--theme-secondary)' }">
          {{ getCategoryName(selectedCategory) }}
          <button @click="clearCategory" class="ml-2 hover:text-white/80 transition-colors">
            <XMarkIcon class="h-3 w-3" />
          </button>
        </span>
        
        <span v-if="searchQuery" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white shadow-soft" :style="{ background: 'var(--theme-secondary)' }">
          "{{ searchQuery }}"
          <button @click="clearSearch" class="ml-2 hover:text-white/80 transition-colors">
            <XMarkIcon class="h-3 w-3" />
          </button>
        </span>
        
        <span v-if="showFeaturedOnly" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white shadow-soft" :style="{ background: 'var(--theme-secondary)' }">
          Destacados
          <button @click="clearFeatured" class="ml-2 hover:text-white/80 transition-colors">
            <XMarkIcon class="h-3 w-3" />
          </button>
        </span>
        
        <button @click="clearAllFilters" class="text-xs text-white hover:text-white/80 underline font-medium transition-colors">
          Limpiar todos
        </button>
      </div>
    </div>

    <!-- Content -->
    <div>
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center py-16">
        <div class="text-center text-white">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p class="text-lg">Cargando productos...</p>
        </div>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="text-center py-16">
        <div class="info-container max-w-md mx-auto">
          <div class="text-white mb-4 text-lg">{{ error }}</div>
          <button
            @click="retry"
            class="btn btn-secondary"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
      
      <!-- Empty state -->
      <div v-else-if="!hasProducts" class="text-center py-16">
        <div class="info-container max-w-md mx-auto">
          <div class="text-white mb-4 text-lg">No se encontraron productos</div>
          <button
            v-if="hasActiveFilters"
            @click="clearAllFilters"
            class="btn btn-secondary"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
      
      <!-- Products grid -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <ProductCard
            v-for="product in products"
            :key="product.codigo"
            :product="product"
          />
        </div>
        
        <!-- Paginación -->
        <div v-if="totalPages > 1" class="flex justify-center">
          <div class="glass px-6 py-4 rounded-xl">
            <Pagination
              :current-page="currentPage"
              :total-pages="totalPages"
              :has-next="hasNext"
              :has-prev="hasPrev"
              @next="nextPage"
              @prev="prevPage"
              @goto="goToPage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { useCompanyStore } from '@/stores/company'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import ProductCard from './ProductCard.vue'
import Pagination from '@/components/ui/Pagination.vue'

// Stores
const catalogStore = useCatalogStore()
const companyStore = useCompanyStore()

// Local state - sincronizar con el store
const searchQuery = ref('')
const selectedCategory = ref<number | null>(null)
const showFeaturedOnly = ref(false)

// Computed
const products = computed(() => catalogStore.products)
const loading = computed(() => catalogStore.loadingProducts)
const error = computed(() => catalogStore.productsError)
const hasProducts = computed(() => catalogStore.hasProducts)
const currentPage = computed(() => catalogStore.currentPage)
const totalPages = computed(() => catalogStore.totalPages)
const totalCount = computed(() => catalogStore.totalCount)
const hasNext = computed(() => catalogStore.hasNextPage)
const hasPrev = computed(() => catalogStore.hasPrevPage)

const hasActiveFilters = computed(() => 
  selectedCategory.value !== null || 
  searchQuery.value.length > 0 || 
  showFeaturedOnly.value
)

// Methods
const getCategoryName = (categoryId: number) => {
  const category = catalogStore.getCategoryByCode.value(categoryId)
  return category?.nombre || 'Categoría'
}

const clearCategory = () => {
  selectedCategory.value = null
  catalogStore.setCategory(null)
  fetchProducts()
}

const clearSearch = () => {
  searchQuery.value = ''
  catalogStore.setSearch('')
  fetchProducts()
}

const clearFeatured = () => {
  showFeaturedOnly.value = false
  catalogStore.setFeaturedOnly(false)
  fetchProducts()
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = null
  showFeaturedOnly.value = false
  catalogStore.clearFilters()
  fetchProducts()
}

const nextPage = () => {
  catalogStore.nextPage()
  fetchProducts()
}

const prevPage = () => {
  catalogStore.prevPage()
  fetchProducts()
}

const goToPage = (page: number) => {
  catalogStore.goToPage(page)
  fetchProducts()
}

const fetchProducts = async () => {
  await catalogStore.fetchProducts()
}

const retry = () => {
  fetchProducts()
}

// Watch for URL changes to sync filters
const syncFiltersFromStore = () => {
  searchQuery.value = catalogStore.searchQuery
  selectedCategory.value = catalogStore.selectedCategory
  showFeaturedOnly.value = catalogStore.showFeaturedOnly
}

// Initialize
onMounted(async () => {
  await companyStore.init()
  catalogStore.initWithCompany()
  
  // Load categories and initial products
  if (!catalogStore.hasCategories) {
    await catalogStore.fetchCategories()
  }
  
  syncFiltersFromStore()
  await fetchProducts()
})
</script>