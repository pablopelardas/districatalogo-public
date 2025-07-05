<template>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
    </div>
    
    <input
      v-model="localValue"
      type="text"
      :placeholder="placeholder"
      class="input-glass block w-full pl-10 pr-10"
      @keyup.enter="handleSearch"
      @input="handleInput"
    />
    
    <div class="absolute inset-y-0 right-0 flex items-center">
      <button
        v-if="localValue"
        @click="clearSearch"
        class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        title="Limpiar búsqueda"
      >
        <XMarkIcon class="h-4 w-4" />
      </button>
      
      <button
        @click="handleSearch"
        class="p-2 text-gray-400 hover:text-[--theme-primary] transition-colors"
        title="Buscar"
      >
        <MagnifyingGlassIcon class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'

// Props
interface Props {
  modelValue: string
  placeholder?: string
  debounceMs?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Buscar...',
  debounceMs: 500
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': []
}>()

// Local state
const localValue = ref(props.modelValue)
let debounceTimer: NodeJS.Timeout | null = null

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
})

// Methods
const handleInput = () => {
  // Clear existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  // Update model value immediately for UI responsiveness
  emit('update:modelValue', localValue.value)
  
  // Debounce the search
  debounceTimer = setTimeout(() => {
    handleSearch()
  }, props.debounceMs)
}

const handleSearch = () => {
  // Clear any pending debounce
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  
  emit('update:modelValue', localValue.value)
  emit('search')
}

const clearSearch = () => {
  localValue.value = ''
  emit('update:modelValue', '')
  emit('search')
}
</script>