<template>
  <div class="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-navyline">
    <div 
      v-for="item in experiences" 
      :key="item.id" 
      class="relative pl-10 flex flex-col gap-1"
    >
      <span class="absolute left-2 top-1.5 timeline-dot"></span>
      <span class="text-xs font-display small-caps text-periwinkle font-semibold">{{ item.year }}</span>
      <h3 class="font-display text-lg small-caps text-paper font-semibold">{{ item.title }}</h3>
      <p class="ink-muted text-sm leading-relaxed">{{ item.desc }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Experience } from '~/composables/usePortfolioApi'

defineProps<{
  experiences: Experience[]
}>()
</script>
