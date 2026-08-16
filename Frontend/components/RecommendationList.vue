<template>
  <div ref="listRef" class="space-y-16 mt-12">
    <div
      v-for="item in recommendations"
      :key="item.id" 
      class="relative bg-surface rounded-3xl p-8 md:p-12 shadow-xl"
    >
      <!-- Aspas Iniciais -->
      <span class="absolute top-4 left-2 md:left-4 text-[6rem] text-primary/30 font-serif leading-none select-none">“</span>
      
      <!-- Texto da Recomendação -->
      <p class="font-display text-lg md:text-xl leading-relaxed text-text mb-8 relative z-10 pt-2 text-justify">
        {{ item.quote }}
      </p>

      <!-- Aspas Finais -->
      <span class="absolute -bottom-12 right-2 md:right-4 text-[6rem] text-primary/30 font-serif leading-none select-none">”</span>

      <!-- Informações do Recomendador -->
      <div class="mt-4 border-t border-border/50 pt-6 flex flex-col relative z-10">
        <a 
          v-if="item.linkedin_recommender_url" 
          :href="item.linkedin_recommender_url" 
          target="_blank" 
          rel="noopener noreferrer"
          class="text-base font-display small-caps text-primary font-bold hover:underline hover:text-primary/80 transition-colors self-start"
        >
          — {{ item.name }}
        </a>
        <span v-else class="text-base font-display small-caps text-primary font-bold self-start">
          — {{ item.name }}
        </span>
        <span v-if="item.date" class="text-xs text-muted font-mono mt-1">{{ item.date }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Testimonial } from '~/composables/usePortfolioApi'

const props = defineProps<{
  recommendations: Testimonial[]
}>()

const listRef = ref<HTMLElement | null>(null)
useScrollStagger(listRef, computed(() => props.recommendations.length), { y: 30, duration: 0.6, stagger: 0.15 })
</script>
