<template>
  <button 
    @click="$emit('select', project)"
    class="work-card text-left bg-navy rounded-2xl p-3 border ink-border w-full flex flex-col justify-between cursor-pointer"
  >
    <div>
      <div class="rounded-xl bg-navypanel h-28 mb-3 relative overflow-hidden flex items-center justify-center">
        <span 
          class="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full text-navy font-display small-caps font-semibold"
          :class="categoryColorClass"
        >
          {{ categoryLabel }}
        </span>
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#8FA0C4" stroke-width="1.2" opacity="0.6">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      </div>
      <div class="flex items-center justify-between text-xs ink-muted">
        <span>{{ project.year }}</span>
        <span class="flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="inline-block -mt-0.5">
            <path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.4-9.5 9-9.5 9Z"/>
          </svg>
          {{ project.likes }}
        </span>
      </div>
      <p class="font-display text-sm mt-1.5 small-caps text-paper font-semibold">{{ project.title }}</p>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { Project } from '~/composables/usePortfolioApi'

const props = defineProps<{
  project: Project
}>()

defineEmits<{
  (e: 'select', project: Project): void
}>()

const categoryColorClass = computed(() => {
  switch (props.project.cat) {
    case 'mobile': return 'bg-lilac'
    case 'back': return 'bg-blush'
    case 'data': return 'bg-mint'
    default: return 'bg-periwinkle'
  }
})

const categoryLabel = computed(() => {
  switch (props.project.cat) {
    case 'mobile': return 'Mobile'
    case 'back': return 'Back'
    case 'data': return 'Data'
    default: return props.project.cat
  }
})
</script>
