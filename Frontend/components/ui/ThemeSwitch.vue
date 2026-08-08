<template>
  <div class="inline-flex items-center gap-2">
    <button
      id="icon-label"
      type="button"
      role="switch"
      :aria-checked="currentMode === 'light'"
      aria-label="Alternar modo claro e escuro"
      @click="toggleMode"
      class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      :class="currentMode === 'light' ? 'bg-primary' : 'bg-surface border-border'"
    >
      <span class="sr-only">Alternar tema</span>
      <span
        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center"
        :class="currentMode === 'light' ? 'translate-x-5 bg-text' : 'translate-x-0 bg-primary'"
      >
        <PhMoon weight="fill" v-if="currentMode !== 'light'" class="w-3 h-3 text-background" />
        <PhSun weight="fill" v-else class="w-3 h-3 text-background" />
      </span>
    </button>
    <label htmlFor="icon-label" class="cursor-pointer" @click="toggleMode">
      <span class="sr-only">Toggle switch</span>
      <PhMoon weight="fill" v-if="currentMode !== 'light'" class="w-4 h-4 text-muted hover:text-text transition" aria-hidden="true" />
      <PhSun weight="fill" v-else class="w-4 h-4 text-primary hover:text-text transition" aria-hidden="true" />
    </label>
  </div>
</template>

<script setup lang="ts">
import { PhSun, PhMoon } from '@phosphor-icons/vue'
import { useTheme } from '~/composables/useTheme'

const { currentMode, toggleMode } = useTheme()
</script>
