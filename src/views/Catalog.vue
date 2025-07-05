<!-- Catalog.vue - Soporte para lista de precios -->
<template>
  <AppLayout>
    <ProductGrid />
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCompanyStore } from '@/stores/company'
import { useCatalogStore } from '@/stores/catalog'
import AppLayout from '@/components/layout/AppLayout.vue'
import ProductGrid from '@/components/catalog/ProductGrid.vue'

interface Props {
  withPriceList?: boolean
}

const props = defineProps<Props>()
const companyStore = useCompanyStore()
const catalogStore = useCatalogStore()

onMounted(async () => {
  await companyStore.init()
  
  if (props.withPriceList) {
    // Set a default price list ID for lista route
    // This could be configured based on your business logic
    await catalogStore.setPriceList(1)
    companyStore.updateTitle('Catálogo - Lista de Precios')
  } else {
    companyStore.updateTitle('Catálogo')
  }
})
</script>