<template>
  <div class="inline-flex items-center gap-2">
    <button
      id="icon-label"
      type="button"
      role="switch"
      :aria-checked="isLight"
      aria-label="Alternar modo claro e escuro"
      @click="toggle"
      class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-periwinkle"
      :class="isLight ? 'bg-periwinkle' : 'bg-navypanel border-navyline'"
    >
      <span class="sr-only">Alternar tema</span>
      <span
        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-navy shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center"
        :class="isLight ? 'translate-x-5 bg-paper' : 'translate-x-0 bg-periwinkle'"
      >
        <Moon v-if="!isLight" class="w-3 h-3 text-navy" />
        <Sun v-else class="w-3 h-3 text-navy" />
      </span>
    </button>
    <label htmlFor="icon-label" class="cursor-pointer" @click="toggle">
      <span class="sr-only">Toggle switch</span>
      <Moon v-if="!isLight" class="w-4 h-4 text-mist hover:text-paper transition" aria-hidden="true" />
      <Sun v-else class="w-4 h-4 text-periwinkle hover:text-paper transition" aria-hidden="true" />
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'

const isLight = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('portfolio-theme')
  if (saved === 'light') {
    isLight.value = true
    document.body.classList.add('light')
  }
})

function toggle() {
  isLight.value = !isLight.value
  if (isLight.value) {
    document.body.classList.add('light')
    localStorage.setItem('portfolio-theme', 'light')
  } else {
    document.body.classList.remove('light')
    localStorage.setItem('portfolio-theme', 'dark')
  }
}
</script>
