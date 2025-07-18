<!-- AppLayout.vue actualizado con mejor estructura -->
<template>
  <div class="min-h-screen flex flex-col" :style="{ background: `linear-gradient(135deg, var(--theme-primary), var(--theme-primary-dark))` }">
    <!-- Header -->
    <AppHeader />
    
    <!-- Main Content con container apropiado -->
    <main class="flex-1">
      <div class="container">
        <slot />
      </div>
    </main>
    
    <!-- Footer -->
    <AppFooter />
    
    <!-- Floating Cart Button -->
    <FloatingCart 
      :always-show="true" 
      @open-summary="showCartSummary = true"
      @open-export="showExportOptions = true"
    />
    
    <!-- Cart Summary Modal -->
    <CartSummary 
      :is-open="showCartSummary"
      @close="showCartSummary = false"
      @open-export="openExportFromSummary"
    />
    
    <!-- Export Options Modal -->
    <ExportOptions 
      :is-open="showExportOptions"
      @close="showExportOptions = false"
      @exported="onExported"
    />
    
    <!-- Welcome Back Modal -->
    <WelcomeBackModal
      :is-open="showWelcomeModal"
      :item-count="cartStore.itemCount"
      @keep="handleKeepList"
      @clear="handleClearList"
    />
    
    <!-- Floating WhatsApp Button -->
    <FloatingWhatsApp />
    
    <!-- Scroll to Top Button -->
    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useWelcomeBack } from '@/composables/useWelcomeBack'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import FloatingCart from '@/components/cart/FloatingCart.vue'
import CartSummary from '@/components/cart/CartSummary.vue'
import ExportOptions from '@/components/cart/ExportOptions.vue'
import WelcomeBackModal from '@/components/ui/WelcomeBackModal.vue'
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp.vue'
import ScrollToTop from '@/components/ui/ScrollToTop.vue'

// Stores
const cartStore = useCartStore()

// Composables
const { showWelcomeModal, checkWelcomeBack, handleKeepList, handleClearList } = useWelcomeBack()

// Modal state
const showCartSummary = ref(false)
const showExportOptions = ref(false)

// Methods
const openExportFromSummary = () => {
  showCartSummary.value = false
  showExportOptions.value = true
}

const onExported = (type: string) => {
  console.log(`Exported as: ${type}`)
  // Could show a toast notification here
}

// Initialize welcome back check
onMounted(() => {
  // Small delay to ensure all stores are initialized
  setTimeout(checkWelcomeBack, 500)
})
</script>