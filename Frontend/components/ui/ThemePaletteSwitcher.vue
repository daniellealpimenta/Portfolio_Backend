<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="isOpen = !isOpen"
      class="p-1.5 text-muted hover:text-text transition-colors rounded-full hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label="Selecionar Tema"
    >
      <Settings class="w-4 h-4" />
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl py-2 z-50 transform origin-top-right transition-all"
    >
      <div class="px-3 py-2 text-xs font-semibold text-muted uppercase tracking-wider border-b border-border mb-1">
        Temas
      </div>
      <button
        v-for="theme in themes"
        :key="theme.id"
        @click="selectTheme(theme.id)"
        class="w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors hover:bg-background group"
        :class="currentTheme === theme.id ? 'text-primary bg-background' : 'text-text'"
      >
        <span class="flex items-center gap-2">
          <span 
            class="w-3 h-3 rounded-full border border-border shadow-sm group-hover:scale-110 transition-transform"
            :style="{ backgroundColor: theme.color }"
          ></span>
          {{ theme.name }}
        </span>
        <Check v-if="currentTheme === theme.id" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Settings, Check } from 'lucide-vue-next'
import { useTheme, type ThemeName } from '~/composables/useTheme'

const { currentTheme, setTheme } = useTheme()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const themes: { id: ThemeName; name: string; color: string }[] = [
  { id: 'refined', name: 'Refined', color: '#9DB9F4' },
  { id: 'forest', name: 'Forest', color: '#8CCFB3' },
  { id: 'burgundy', name: 'Burgundy', color: '#D4A2B8' },
  { id: 'amber', name: 'Amber', color: '#E2C37B' },
  { id: 'ocean', name: 'Ocean', color: '#92B9F8' },
  { id: 'slate', name: 'Slate', color: '#A7BEE5' }
]

function selectTheme(themeId: ThemeName) {
  setTheme(themeId)
  isOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
