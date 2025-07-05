<template>
  <AppLayout>
    <!-- Product Grid -->
    <ProductGrid />
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCompanyStore } from '@/stores/company'
import AppLayout from '@/components/layout/AppLayout.vue'
import ProductGrid from '@/components/catalog/ProductGrid.vue'

// Composables
const companyStore = useCompanyStore()

// Initialize
onMounted(async () => {
  await companyStore.init()
  companyStore.updateTitle('Catálogo')
})
</script>