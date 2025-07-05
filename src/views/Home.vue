<template>
  <AppLayout>
    <!-- Hero Section -->
    <div class="section text-center">
      <div class="info-container max-w-2xl mx-auto">
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">
          Bienvenido a {{ companyName }}
        </h1>
        <p v-if="company?.razon_social" class="text-lg text-white/90 mb-8">
          {{ company.razon_social }}
        </p>
        <RouterLink
          to="/catalog"
          class="btn btn-secondary inline-flex items-center text-base"
        >
          Ver catálogo completo
          <ArrowRightIcon class="ml-2 h-5 w-5" />
        </RouterLink>
      </div>
    </div>
      
    <!-- Productos destacados -->
    <div v-if="hasFeaturedProducts" class="section">
      <div class="section-header flex items-center justify-between">
        <h2 class="text-2xl font-bold text-white">Productos Destacados</h2>
        <RouterLink
          to="/catalog?destacados=true"
          class="text-white/80 hover:text-white underline font-medium transition-colors"
        >
          Ver todos →
        </RouterLink>
      </div>
      
      <div v-if="loadingFeatured" class="flex justify-center py-12">
        <div class="text-center text-white">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando productos destacados...</p>
        </div>
      </div>
      
      <div v-else-if="featuredError" class="text-center py-12">
        <div class="info-container max-w-md mx-auto">
          <div class="text-red-400 mb-4">{{ featuredError }}</div>
          <button
            @click="loadFeaturedProducts"
            class="btn btn-ghost"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in featuredProducts"
          :key="product.codigo"
          :product="product"
        />
      </div>
    </div>
      
    <!-- Categorías -->
    <div v-if="hasCategories" class="section">
      <div class="section-header">
        <h2 class="text-2xl font-bold text-white">Categorías</h2>
      </div>
      
      <div v-if="loadingCategories" class="flex justify-center py-12">
        <div class="text-center text-white">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando categorías...</p>
        </div>
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <RouterLink
          v-for="category in categories"
          :key="category.id"
          :to="`/category/${category.codigo_rubro}`"
          class="category-card group"
        >
          <div class="category-card-content">
            <div class="category-header">
              <div
                class="category-icon"
                :style="{ 
                  background: `linear-gradient(135deg, ${category.color}, ${adjustColorBrightness(category.color, -20)})`
                }"
              >
                {{ category.nombre.charAt(0).toUpperCase() }}
              </div>
              <div class="category-count">
                {{ category.product_count }}
              </div>
            </div>
            <div class="category-info">
              <h3 class="category-name">{{ category.nombre }}</h3>
              <p class="category-description">
                {{ category.product_count }} producto{{ category.product_count !== 1 ? 's' : '' }}
              </p>
            </div>
            <div class="category-arrow">
              <ArrowRightIcon class="w-5 h-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
      
    <!-- Información de contacto -->
    <div v-if="company" class="section">
      <div class="info-container max-w-2xl mx-auto text-center">
        <h2 class="text-2xl font-bold text-white mb-4">¿Necesitas ayuda?</h2>
        <p class="text-white/90 mb-6">
          Contáctanos para obtener más información sobre nuestros productos
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            v-if="whatsappUrl"
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-success inline-flex items-center"
          >
            <ChatBubbleLeftRightIcon class="h-5 w-5 mr-2" />
            WhatsApp
          </a>
          
          <a
            v-if="company.telefono"
            :href="`tel:${company.telefono}`"
            class="btn btn-secondary inline-flex items-center"
          >
            <PhoneIcon class="h-5 w-5 mr-2" />
            {{ company.telefono }}
          </a>
          
          <a
            v-if="company.email"
            :href="`mailto:${company.email}`"
            class="btn btn-secondary inline-flex items-center"
          >
            <EnvelopeIcon class="h-5 w-5 mr-2" />
            {{ company.email }}
          </a>
        </div>
      </div>
    </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useCompanyStore } from '@/stores/company'
import { useCatalogStore } from '@/stores/catalog'
import { ArrowRightIcon, ChatBubbleLeftRightIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/vue/24/outline'
import AppLayout from '@/components/layout/AppLayout.vue'
import ProductCard from '@/components/catalog/ProductCard.vue'
import LoadingSpinner from '@/components/ui/Loading.vue'

// Stores
const companyStore = useCompanyStore()
const catalogStore = useCatalogStore()

// Computed
const company = computed(() => companyStore.company)
const companyName = computed(() => companyStore.companyName)
const whatsappUrl = computed(() => companyStore.whatsappUrl)

const featuredProducts = computed(() => catalogStore.featuredProducts)
const categories = computed(() => catalogStore.categories)
const hasFeaturedProducts = computed(() => catalogStore.hasFeaturedProducts)
const hasCategories = computed(() => catalogStore.hasCategories)

const loadingFeatured = computed(() => catalogStore.loadingFeatured)
const loadingCategories = computed(() => catalogStore.loadingCategories)
const featuredError = computed(() => catalogStore.featuredError)

// Methods
const loadFeaturedProducts = async () => {
  await catalogStore.fetchFeaturedProducts(8)
}

const loadCategories = async () => {
  await catalogStore.fetchCategories()
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

// Initialize
onMounted(async () => {
  // Initialize company data
  await companyStore.init()
  
  // Set page title
  companyStore.updateTitle('Inicio')
  
  // Load featured products and categories in parallel
  const promises = []
  
  if (!hasFeaturedProducts.value) {
    promises.push(loadFeaturedProducts())
  }
  
  if (!hasCategories.value) {
    promises.push(loadCategories())
  }
  
  await Promise.all(promises)
})
</script>