<!-- SearchBar.vue - Simplificado -->
<template>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <MagnifyingGlassIcon class="h-5 w-5 text-gray-500" />
    </div>
    
    <input
      v-model="localValue"
      type="text"
      :placeholder="placeholder"
      class="w-full pl-11 pr-11 py-3 rounded-xl bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
      @keyup.enter="handleSearch"
      @input="handleInput"
    />
    
    <div class="absolute inset-y-0 right-0 pr-2 flex items-center">
      <button
        v-if="localValue"
        @click="clearSearch"
        class="p-2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <XMarkIcon class="h-5 w-5" />
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
  placeholder: 'Buscar productos...',
  debounceMs: 500
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': []
}>()

// Local state
const localValue = ref(props.modelValue)
let debounceTimer: number | null = null

// Watch
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
})

// Methods
const handleInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  
  emit('update:modelValue', localValue.value)
  
  debounceTimer = setTimeout(() => {
    handleSearch()
  }, props.debounceMs)
}

const handleSearch = () => {
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