<template>
  <div class="space-y-12">
    <div 
      v-for="item in testimonials" 
      :key="item.id" 
      class="relative bg-navypanel rounded-3xl p-6 md:p-8 border ink-border"
    >
      <span class="absolute -top-4 left-6 text-2xl px-3 py-0.5 rounded-full bg-blush text-navy font-display small-caps font-semibold">“</span>
      <p class="font-display italic text-lg leading-relaxed text-paper mb-4">"{{ item.quote }}"</p>
      <span class="text-xs font-display small-caps text-periwinkle font-semibold">— {{ item.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Testimonial } from '~/composables/usePortfolioApi'

defineProps<{
  testimonials: Testimonial[]
}>()
</script>
