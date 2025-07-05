interface ApiResponse<T> {
  data?: T
  error?: string
}

interface Product {
  codigo: string
  nombre: string
  descripcion: string
  descripcion_corta: string | null
  precio: number | null
  destacado: boolean
  imagen_urls: string[]
  stock: number | null
  tags: string[]
  marca: string
  unidad: string
  codigo_barras: string | null
  codigo_rubro: number
  imagen_alt: string | null
  tipo_producto: string
  lista_precio_id: number | null
  lista_precio_nombre: string | null
  lista_precio_codigo: string | null
}

interface Category {
  id: number
  codigo_rubro: number
  nombre: string
  descripcion: string
  icono: string
  color: string
  orden: number
  product_count: number
}

interface CatalogResponse {
  productos: Product[]
  total_count: number
  page: number
  page_size: number
  total_pages: number
  categorias: Category[]
}

interface Company {
  id: number
  codigo: string
  nombre: string
  razon_social: string
  telefono: string
  email: string
  direccion: string
  logo_url: string
  colores_tema: string
  favicon_url: string
  dominio_personalizado: string
  url_whatsapp: string
  url_facebook: string
  url_instagram: string
  mostrar_precios: boolean
  mostrar_stock: boolean
  permitir_pedidos: boolean
  productos_por_pagina: number
  plan: string
  activa: boolean
}

interface CatalogFilters {
  listaPrecioId?: number
  categoria?: string
  busqueda?: string
  destacados?: boolean
  codigoRubro?: number
  page?: number
  pageSize?: number
}

class ApiService {
  private baseUrl: string
  private empresaId: number | null = null

  constructor() {
    // Detect if we're in development or production
    const isDev = import.meta.env.DEV
    
    if (isDev) {
      // Development: use localhost with empresaId parameter
      this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:7000'
      this.empresaId = parseInt(import.meta.env.VITE_EMPRESA_ID || '1')
    } else {
      // Production: use current subdomain
      this.baseUrl = `https://${window.location.hostname}`
    }
  }

  // Resolve company ID from subdomain or use override
  private getCompanyId(): number | null {
    if (this.empresaId) {
      return this.empresaId
    }
    
    // In production, company is resolved automatically by subdomain
    // so we don't need to pass empresaId
    return null
  }

  // Build query string with company ID if needed
  private buildQueryString(params: Record<string, any> = {}): string {
    const companyId = this.getCompanyId()
    
    if (companyId) {
      params.empresaId = companyId
    }
    
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')
    
    return queryString ? `?${queryString}` : ''
  }

  // Generic fetch method
  private async fetch<T>(endpoint: string, params: Record<string, any> = {}): Promise<ApiResponse<T>> {
    try {
      const queryString = this.buildQueryString(params)
      const url = `${this.baseUrl}${endpoint}${queryString}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error)
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Get company information
  async getCompany(): Promise<ApiResponse<Company>> {
    return this.fetch<Company>('/api/catalog/empresa')
  }

  // Get catalog with filters
  async getCatalog(filters: CatalogFilters = {}): Promise<ApiResponse<CatalogResponse>> {
    return this.fetch<CatalogResponse>('/api/catalog', filters)
  }

  // Get categories
  async getCategories(): Promise<ApiResponse<{ categorias: Category[] }>> {
    return this.fetch<{ categorias: Category[] }>('/api/catalog/categorias')
  }

  // Get product by code
  async getProduct(codigo: string, listaPrecioId?: number): Promise<ApiResponse<Product>> {
    const params = listaPrecioId ? { listaPrecioId } : {}
    return this.fetch<Product>(`/api/catalog/producto/${codigo}`, params)
  }

  // Get featured products
  async getFeaturedProducts(listaPrecioId?: number, limit: number = 10): Promise<ApiResponse<{ productos: Product[] }>> {
    const params = {
      listaPrecioId,
      limit
    }
    return this.fetch<{ productos: Product[] }>('/api/catalog/destacados', params)
  }
}

// Export singleton instance
export const apiService = new ApiService()

// Export types for use in components
export type { 
  Product, 
  Category, 
  Company, 
  CatalogResponse, 
  CatalogFilters, 
  ApiResponse 
}