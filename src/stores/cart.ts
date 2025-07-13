import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useCompanyStore } from './company'

export interface CartItem {
  codigo: string
  nombre: string
  precio: number
  cantidad: number
  imagen_urls?: string[]
  lista?: string
}

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])
  
  // Load from localStorage on initialization
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('shopping-cart')
      if (stored) {
        items.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error)
      items.value = []
    }
  }
  
  // Save to localStorage whenever items change
  const saveToStorage = () => {
    try {
      localStorage.setItem('shopping-cart', JSON.stringify(items.value))
    } catch (error) {
      console.error('Error saving cart to storage:', error)
    }
  }
  
  // Watch for changes and auto-save
  watch(items, saveToStorage, { deep: true })
  
  // Getters
  const totalItems = computed(() => 
    items.value.reduce((total, item) => total + item.cantidad, 0)
  )
  
  const totalAmount = computed(() => 
    items.value.reduce((total, item) => total + (item.precio * item.cantidad), 0)
  )
  
  const itemCount = computed(() => items.value.length)
  
  const isEmpty = computed(() => items.value.length === 0)
  
  const getItemByCode = (codigo: string) => {
    return items.value.find(item => item.codigo === codigo)
  }
  
  // Actions
  const addItem = (product: any, cantidad: number = 1) => {
    if (cantidad <= 0) return
    
    const existingItem = getItemByCode(product.codigo)
    
    if (existingItem) {
      // Update existing item quantity
      existingItem.cantidad += cantidad
    } else {
      // Add new item
      const newItem: CartItem = {
        codigo: product.codigo,
        nombre: product.nombre,
        precio: product.precio || 0,
        cantidad,
        imagen_urls: product.imagen_urls,
        lista: product.lista
      }
      items.value.push(newItem)
    }
  }
  
  const updateQuantity = (codigo: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeItem(codigo)
      return
    }
    
    const item = getItemByCode(codigo)
    if (item) {
      item.cantidad = cantidad
    }
  }
  
  const removeItem = (codigo: string) => {
    const index = items.value.findIndex(item => item.codigo === codigo)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }
  
  const clearCart = () => {
    items.value = []
  }
  
  const incrementItem = (codigo: string, amount: number = 1) => {
    const item = getItemByCode(codigo)
    if (item) {
      item.cantidad += amount
    }
  }
  
  const decrementItem = (codigo: string, amount: number = 1) => {
    const item = getItemByCode(codigo)
    if (item) {
      const newQuantity = item.cantidad - amount
      if (newQuantity <= 0) {
        removeItem(codigo)
      } else {
        item.cantidad = newQuantity
      }
    }
  }
  
  // Export functions
  const exportToText = () => {
    if (isEmpty.value) return ''
    
    const companyStore = useCompanyStore()
    const companyName = companyStore.companyName || 'Empresa'
    
    let text = `Lista de Compras - ${companyName}\n`
    text += '==========================================\n\n'
    
    items.value.forEach(item => {
      const total = item.precio * item.cantidad
      text += `${item.nombre}\n`
      text += `  Código: ${item.codigo}\n`
      text += `  Cantidad: ${item.cantidad}\n`
      text += `  Precio unitario: $${item.precio.toFixed(2)}\n`
      text += `  Subtotal: $${total.toFixed(2)}\n\n`
    })
    
    text += `Total items: ${totalItems.value}\n`
    text += `Total general: $${totalAmount.value.toFixed(2)}\n\n`
    text += `* Los precios mostrados están sujetos a cambios por parte del vendedor. Los precios en esta página web pueden no reflejar los precios finales del local.\n`
    
    return text
  }
  
  const exportForWhatsApp = () => {
    if (isEmpty.value) return ''
    
    const companyStore = useCompanyStore()
    const companyName = companyStore.companyName || 'Empresa'
    
    let message = `*Lista de Compras - ${companyName}*\n\n`
    
    items.value.forEach(item => {
      const total = item.precio * item.cantidad
      message += `• *${item.nombre}*\n`
      message += `   Código: ${item.codigo}\n`
      message += `   Cantidad: ${item.cantidad}\n`
      message += `   Precio: $${item.precio.toFixed(2)} c/u\n`
      message += `   Subtotal: $${total.toFixed(2)}\n\n`
    })
    
    message += `*Total: ${totalItems.value} productos*\n`
    message += `*Total general: $${totalAmount.value.toFixed(2)}*\n\n`
    message += `_* Los precios mostrados están sujetos a cambios por parte del vendedor. Los precios en esta página web pueden no reflejar los precios finales del local._`
    
    return encodeURIComponent(message)
  }
  
  const exportForEmail = () => {
    if (isEmpty.value) return ''
    
    const companyStore = useCompanyStore()
    const companyName = companyStore.companyName || 'Empresa'
    
    let body = `Lista de Compras - ${companyName}\n\n`
    
    items.value.forEach(item => {
      const total = item.precio * item.cantidad
      body += `${item.nombre}\n`
      body += `Código: ${item.codigo}\n`
      body += `Cantidad: ${item.cantidad}\n`
      body += `Precio unitario: $${item.precio.toFixed(2)}\n`
      body += `Subtotal: $${total.toFixed(2)}\n\n`
    })
    
    body += `Total items: ${totalItems.value}\n`
    body += `Total general: $${totalAmount.value.toFixed(2)}\n\n`
    body += `* Los precios mostrados están sujetos a cambios por parte del vendedor. Los precios en esta página web pueden no reflejar los precios finales del local.`
    
    return encodeURIComponent(body)
  }
  
  // Initialize from storage
  loadFromStorage()
  
  return {
    // State
    items,
    
    // Getters
    totalItems,
    totalAmount,
    itemCount,
    isEmpty,
    getItemByCode,
    
    // Actions
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    incrementItem,
    decrementItem,
    
    // Export functions
    exportToText,
    exportForWhatsApp,
    exportForEmail,
    
    // Utility
    loadFromStorage,
    saveToStorage
  }
})