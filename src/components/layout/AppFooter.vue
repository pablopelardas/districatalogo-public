<!-- AppFooter.vue - Footer más compacto -->
<template>
  <footer class="mt-auto bg-white/10 backdrop-blur-md border-t border-white/20">
    <div class="container py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Info de la empresa -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div 
              v-if="companyLogo"
              class="w-10 h-10 rounded-lg overflow-hidden"
            >
              <img 
                :src="companyLogo" 
                :alt="companyName"
                class="w-full h-full object-cover"
              />
            </div>
            <div 
              v-else 
              class="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
              :style="{ background: 'var(--theme-accent)' }"
            >
              {{ companyName.charAt(0) }}
            </div>
            <div>
              <h3 class="font-semibold text-white">{{ companyName }}</h3>
              <p v-if="company?.razon_social" class="text-sm text-white/70">{{ company.razon_social }}</p>
            </div>
          </div>
          
          <p class="text-sm text-white/70 mb-4">
            Tu catálogo online confiable. Encuentra todos nuestros productos disponibles las 24 horas.
          </p>
          
          <!-- Social links -->
          <div class="flex gap-2">
            <a href="#" class="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" class="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
              </svg>
            </a>
            <a href="#" class="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <!-- Enlaces rápidos -->
        <div>
          <h4 class="font-semibold text-white mb-4">Enlaces Rápidos</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-sm text-white/70 hover:text-white transition-colors">Catálogo completo</a></li>
            <li><a href="#" class="text-sm text-white/70 hover:text-white transition-colors">Ofertas especiales</a></li>
            <li><a href="#" class="text-sm text-white/70 hover:text-white transition-colors">Nuevos productos</a></li>
            <li><a href="#" class="text-sm text-white/70 hover:text-white transition-colors">Productos destacados</a></li>
            <li><a href="#" class="text-sm text-white/70 hover:text-white transition-colors">Términos y condiciones</a></li>
          </ul>
        </div>
        
        <!-- Contacto -->
        <div>
          <h4 class="font-semibold text-white mb-4">Contacto</h4>
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <MapPinIcon class="h-5 w-5 text-white/70 mt-0.5" />
              <span class="text-sm text-white/70">Av. Ejemplo 123, Ciudad, País</span>
            </div>
            <div class="flex items-center gap-3">
              <PhoneIcon class="h-5 w-5 text-white/70" />
              <span class="text-sm text-white/70">+54 11 1234-5678</span>
            </div>
            <div class="flex items-center gap-3">
              <EnvelopeIcon class="h-5 w-5 text-white/70" />
              <span class="text-sm text-white/70">info@empresa.com</span>
            </div>
          </div>
          
          <!-- Newsletter -->
          <div class="mt-6">
            <p class="text-sm text-white/70 mb-2">Recibe nuestras ofertas</p>
            <form class="flex gap-2">
              <input 
                type="email" 
                placeholder="Tu email"
                class="flex-1 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 text-sm border border-white/20 focus:outline-none focus:border-white/40"
              />
              <button type="submit" class="px-4 py-2 rounded-lg bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-colors">
                Suscribir
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <!-- Bottom bar -->
      <div class="border-t border-white/10 mt-8 pt-8">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <p>© {{ currentYear }} {{ companyName }}. Todos los derechos reservados.</p>
          <p>
            Powered by 
            <a href="https://districatalogo.com" class="text-white/80 hover:text-white transition-colors">
              DistriCatalogo
            </a>
          </p>
        </div>
      </div>
    </div>
    
    <!-- WhatsApp flotante -->
    <div v-if="whatsappUrl" class="fixed bottom-6 right-6 z-50">
      <a 
        :href="whatsappUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110"
      >
        <ChatBubbleLeftRightIcon class="h-6 w-6" />
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCompanyStore } from '@/stores/company'
import { 
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/vue/24/outline'

// Stores
const companyStore = useCompanyStore()

// Computed
const company = computed(() => companyStore.company)
const companyName = computed(() => companyStore.companyName)
const companyLogo = computed(() => companyStore.companyLogo)
const whatsappUrl = computed(() => companyStore.whatsappUrl)
const currentYear = computed(() => new Date().getFullYear())
</script>