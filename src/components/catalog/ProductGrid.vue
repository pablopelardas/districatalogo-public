<!-- ProductGrid.vue - Grid de productos con mejor spacing -->
<template>
  <div class="py-6">
    <!-- Toolbar simplificado -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <!-- Contador y filtros activos -->
        <div class="flex items-center gap-4">
          <h2 class="text-xl font-semibold text-white">
            {{ totalCount }} productos
          </h2>
          
          <!-- Filtros activos inline -->
          <div v-if="hasActiveFilters" class="flex items-center gap-2">
            <span 
              v-if="selectedCategory" 
              class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white bg-white/20"
            >
              {{ getCategoryName(selectedCategory) }}
              <button @click="clearCategory" class="hover:opacity-70">
                <XMarkIcon class="h-3 w-3" />
              </button>
            </span>
            
            <span 
              v-if="searchQuery" 
              class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white bg-white/20"
            >
              "{{ searchQuery }}"
              <button @click="clearSearch" class="hover:opacity-70">
                <XMarkIcon class="h-3 w-3" />
              </button>
            </span>
          </div>
        </div>
        
        <!-- Controles -->
        <div class="flex items-center gap-3">
          <select class="px-4 py-2 rounded-lg bg-white/90 text-sm font-medium">
            <option>Más relevantes</option>
            <option>Precio: menor a mayor</option>
            <option>Precio: mayor a menor</option>
            <option>Más nuevos</option>
          </select>
          
          <div class="flex gap-1 bg-white/10 rounded-lg p-1">
            <button 
              @click="viewMode = 'grid'"
              :class="viewMode === 'grid' ? 'bg-white/20' : ''"
              class="p-2 rounded transition-all"
            >
              <ViewGridIcon class="h-5 w-5 text-white" />
            </button>
            <button 
              @click="viewMode = 'list'"
              :class="viewMode === 'list' ? 'bg-white/20' : ''"
              class="p-2 rounded transition-all"
            >
              <ListBulletIcon class="h-5 w-5 text-white" />
            </button>
          </div>
          
          <button class="btn btn-secondary flex items-center gap-2">
            <AdjustmentsHorizontalIcon class="h-5 w-5" />
            <span class="hidden sm:inline">Filtros</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div>
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-white">Cargando productos...</p>
        </div>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="flex justify-center py-20">
        <div class="glass max-w-md p-8 rounded-xl text-center">
          <ExclamationTriangleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p class="text-gray-800 mb-4">{{ error }}</p>
          <button @click="retry" class="btn btn-primary">
            Intentar nuevamente
          </button>
        </div>
      </div>
      
      <!-- Empty state -->
      <div v-else-if="!hasProducts" class="flex justify-center py-20">
        <div class="glass max-w-md p-8 rounded-xl text-center">
          <ShoppingBagIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-800 mb-2">No se encontraron productos</h3>
          <p class="text-gray-600 mb-4">
            {{ hasActiveFilters ? 'Intenta con otros filtros' : 'No hay productos disponibles' }}
          </p>
          <button v-if="hasActiveFilters" @click="clearAllFilters" class="btn btn-primary">
            Limpiar filtros
          </button>
        </div>
      </div>
      
      <!-- Products grid -->
      <div v-else>
        <div 
          :class="viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'"
        >
          <ProductCard
            v-for="product in products"
            :key="product.codigo"
            :product="product"
            :view-mode="viewMode"
          />
        </div>
        
        <!-- Paginación -->
        <div v-if="totalPages > 1" class="flex justify-center mt-10">
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
import { ref, computed, onMounted } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { useCompanyStore } from '@/stores/company'
import { 
  XMarkIcon,
  Squares2X2Icon as ViewGridIcon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
  ExclamationTriangleIcon,
  ShoppingBagIcon
} from '@heroicons/vue/24/outline'
import ProductCard from './ProductCard.vue'
import Pagination from '@/components/ui/Pagination.vue'

// Stores
const catalogStore = useCatalogStore()
const companyStore = useCompanyStore()

// State
const searchQuery = ref('')
const selectedCategory = ref<number | null>(null)
const showFeaturedOnly = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')

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

const syncFiltersFromStore = () => {
  searchQuery.value = catalogStore.searchQuery
  selectedCategory.value = catalogStore.selectedCategory
  showFeaturedOnly.value = catalogStore.showFeaturedOnly
}

// Initialize
onMounted(async () => {
  await companyStore.init()
  catalogStore.initWithCompany()
  
  if (!catalogStore.hasCategories) {
    await catalogStore.fetchCategories()
  }
  
  syncFiltersFromStore()
  await fetchProducts()
})
</script>