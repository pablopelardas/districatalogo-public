import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService, type Product, type Category, type CatalogFilters } from '@/services/api'
import { useCompanyStore } from './company'

export const useCatalogStore = defineStore('catalog', () => {
  // State
  const products = ref<Product[]>([])
  const featuredProducts = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const currentProduct = ref<Product | null>(null)
  
  // Pagination
  const currentPage = ref(1)
  const pageSize = ref(20)
  const totalCount = ref(0)
  const totalPages = ref(0)
  
  // Filters
  const selectedCategory = ref<number | null>(null)
  const searchQuery = ref('')
  const selectedPriceList = ref<number | null>(null)
  const showFeaturedOnly = ref(false)
  const sortBy = ref<'precio_asc' | 'precio_desc' | 'nombre_asc' | 'nombre_desc' | null>('nombre_asc')
  
  // Loading states
  const loadingProducts = ref(false)
  const loadingCategories = ref(false)
  const loadingFeatured = ref(false)
  const loadingProduct = ref(false)
  
  // Errors
  const productsError = ref<string | null>(null)
  const categoriesError = ref<string | null>(null)
  const featuredError = ref<string | null>(null)
  const productError = ref<string | null>(null)

  // Getters
  const hasProducts = computed(() => products.value.length > 0)
  const hasCategories = computed(() => categories.value.length > 0)
  const hasFeaturedProducts = computed(() => featuredProducts.value.length > 0)
  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPrevPage = computed(() => currentPage.value > 1)
  
  const currentFilters = computed((): CatalogFilters => ({
    listaPrecioId: selectedPriceList.value || undefined,
    busqueda: searchQuery.value || undefined,
    destacados: showFeaturedOnly.value || undefined,
    codigoRubro: selectedCategory.value || undefined,
    ordenarPor: sortBy.value || undefined,
    page: currentPage.value,
    pageSize: pageSize.value
  }))

  // Get category by ID
  const getCategoryById = computed(() => {
    return (id: number) => categories.value.find(cat => cat.id === id)
  })

  // Get category by code
  const getCategoryByCode = computed(() => {
    return (code: number) => categories.value.find(cat => cat.codigo_rubro === code)
  })

  // Actions
  const fetchProducts = async (filters: CatalogFilters = {}) => {
    loadingProducts.value = true
    productsError.value = null
    
    try {
      const mergedFilters = { ...currentFilters.value, ...filters }
      const response = await apiService.getCatalog(mergedFilters)
      
      if (response.error) {
        productsError.value = response.error
        return
      }
      
      if (response.data) {
        products.value = response.data.productos
        totalCount.value = response.data.total_count
        totalPages.value = response.data.total_pages
        currentPage.value = response.data.page
        pageSize.value = response.data.page_size
        
        // Categories should only be managed by fetchCategories(), not overwritten here
      }
    } catch (err) {
      productsError.value = err instanceof Error ? err.message : 'Error loading products'
    } finally {
      loadingProducts.value = false
    }
  }

  const fetchCategories = async () => {
    loadingCategories.value = true
    categoriesError.value = null
    
    try {
      const response = await apiService.getCategories()
      
      if (response.error) {
        categoriesError.value = response.error
        return
      }
      
      if (response.data) {
        categories.value = response.data.categorias
      }
    } catch (err) {
      categoriesError.value = err instanceof Error ? err.message : 'Error loading categories'
    } finally {
      loadingCategories.value = false
    }
  }

  const fetchFeaturedProducts = async (limit: number = 10) => {
    loadingFeatured.value = true
    featuredError.value = null
    
    try {
      const response = await apiService.getFeaturedProducts(selectedPriceList.value || undefined, limit)
      
      if (response.error) {
        featuredError.value = response.error
        return
      }
      
      if (response.data) {
        featuredProducts.value = response.data.productos
      }
    } catch (err) {
      featuredError.value = err instanceof Error ? err.message : 'Error loading featured products'
    } finally {
      loadingFeatured.value = false
    }
  }

  const fetchProduct = async (codigo: string) => {
    loadingProduct.value = true
    productError.value = null
    
    try {
      const response = await apiService.getProduct(codigo, selectedPriceList.value || undefined)
      
      if (response.error) {
        productError.value = response.error
        return
      }
      
      if (response.data) {
        currentProduct.value = response.data
      }
    } catch (err) {
      productError.value = err instanceof Error ? err.message : 'Error loading product'
    } finally {
      loadingProduct.value = false
    }
  }

  // Filter actions
  const setCategory = async (categoryId: number | null) => {
    selectedCategory.value = categoryId
    currentPage.value = 1 // Reset to first page when filtering
    await fetchProducts() // Fetch products with new filter
  }

  const setSearch = async (query: string) => {
    searchQuery.value = query
    currentPage.value = 1 // Reset to first page when searching
    await fetchProducts() // Fetch products with new search
  }

  const setPriceList = async (priceListId: number | null) => {
    selectedPriceList.value = priceListId
    currentPage.value = 1 // Reset to first page when changing price list
    await fetchProducts() // Fetch products with new price list
  }

  const setFeaturedOnly = async (featured: boolean) => {
    showFeaturedOnly.value = featured
    currentPage.value = 1
    await fetchProducts()
  }

  const setSortBy = async (sort: 'precio_asc' | 'precio_desc' | 'nombre_asc' | 'nombre_desc' | null) => {
    sortBy.value = sort
    currentPage.value = 1
    await fetchProducts()
  }

  const clearFilters = async () => {
    selectedCategory.value = null
    searchQuery.value = ''
    showFeaturedOnly.value = false
    selectedPriceList.value = null
    sortBy.value = 'nombre_asc' // Mantener ordenamiento alfabético por defecto
    currentPage.value = 1
    await fetchProducts()
  }


  // Pagination actions
  const nextPage = () => {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (hasPrevPage.value) {
      currentPage.value--
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }


  // Initialize with company's default page size
  const initWithCompany = () => {
    const companyStore = useCompanyStore()
    if (companyStore.productsPerPage) {
      pageSize.value = companyStore.productsPerPage
    }
  }

  return {
    // State
    products,
    featuredProducts,
    categories,
    currentProduct,
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    selectedCategory,
    searchQuery,
    selectedPriceList,
    showFeaturedOnly,
    sortBy,
    
    // Loading states
    loadingProducts,
    loadingCategories,
    loadingFeatured,
    loadingProduct,
    
    // Errors
    productsError,
    categoriesError,
    featuredError,
    productError,
    
    // Getters
    hasProducts,
    hasCategories,
    hasFeaturedProducts,
    hasNextPage,
    hasPrevPage,
    currentFilters,
    getCategoryById,
    getCategoryByCode,
    
    // Actions
    fetchProducts,
    fetchCategories,
    fetchFeaturedProducts,
    fetchProduct,
    setCategory,
    setSearch,
    setPriceList,
    setFeaturedOnly,
    setSortBy,
    nextPage,
    prevPage,
    goToPage,
    clearFilters,
    initWithCompany
  }
})