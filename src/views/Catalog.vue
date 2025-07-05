<!-- Catalog.vue permanece igual -->
<template>
  <AppLayout>
    <ProductGrid />
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCompanyStore } from '@/stores/company'
import AppLayout from '@/components/layout/AppLayout.vue'
import ProductGrid from '@/components/catalog/ProductGrid.vue'

const companyStore = useCompanyStore()

onMounted(async () => {
  await companyStore.init()
  companyStore.updateTitle('Catálogo')
})
</script>