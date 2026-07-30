<template>
  <div class="grid sm:grid-cols-2 gap-4">
    <div 
      v-for="cert in certificates" 
      :key="cert.id" 
      class="bg-navypanel p-4 rounded-2xl border ink-border flex flex-col justify-between"
    >
      <h4 class="font-display text-sm small-caps text-paper font-semibold">{{ cert.title }}</h4>
      <span class="text-xs ink-muted mt-2">{{ cert.issuer }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Certificate } from '~/composables/usePortfolioApi'

defineProps<{
  certificates: Certificate[]
}>()
</script>
