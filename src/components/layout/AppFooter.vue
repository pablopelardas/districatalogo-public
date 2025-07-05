<template>
  <footer class="glass-dark mt-auto">
    <div class="container py-8">
      <div class="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <!-- Logo y nombre -->
        <div class="flex items-center space-x-4 mb-6 md:mb-0">
          <div 
            v-if="companyLogo"
            class="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30"
          >
            <img 
              :src="companyLogo" 
              :alt="companyName"
              class="w-full h-full object-cover"
            />
          </div>
          <div 
            v-else 
            class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
            :style="{ background: 'var(--theme-accent)' }"
          >
            {{ companyName.charAt(0) }}
          </div>
          <div class="text-white">
            <h3 class="font-bold text-lg leading-tight">{{ companyName }}</h3>
            <p v-if="company?.razon_social" class="text-sm opacity-80 leading-tight">{{ company.razon_social }}</p>
          </div>
        </div>
        
        <!-- Copyright -->
        <div class="text-white/70 text-sm">
          <p>© {{ currentYear }} {{ companyName }}. Todos los derechos reservados.</p>
          <p class="mt-1">
            Powered by 
            <a href="https://districatalogo.com" class="text-white hover:text-white/80 underline font-medium transition-colors">
              DistriCatalogo
            </a>
          </p>
        </div>
      </div>
    </div>
    
    <!-- Botón de WhatsApp flotante -->
    <div v-if="whatsappUrl" class="fixed bottom-6 right-6 z-50">
      <a 
        :href="whatsappUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="glass bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-105"
        title="Contactar por WhatsApp"
      >
        <ChatBubbleLeftRightIcon class="h-6 w-6" />
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCompanyStore } from '@/stores/company'
import { ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline'

// Stores
const companyStore = useCompanyStore()

// Computed
const company = computed(() => companyStore.company)
const companyName = computed(() => companyStore.companyName)
const companyLogo = computed(() => companyStore.companyLogo)
const whatsappUrl = computed(() => companyStore.whatsappUrl)
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
/* Custom social media icons could be added here */
</style>