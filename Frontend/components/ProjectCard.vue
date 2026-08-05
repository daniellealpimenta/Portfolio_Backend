<template>
  <NuxtLink 
    :to="`/projects/${project.id}`"
    class="work-card text-left bg-background rounded-2xl p-3 border border-border w-full flex flex-col justify-between cursor-pointer block"
  >
    <div>
      <div class="rounded-xl bg-surface h-28 mb-3 relative overflow-hidden flex items-center justify-center">
        <span 
          class="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full text-background font-display small-caps font-semibold"
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
      <div class="flex items-center justify-between text-xs text-muted">
        <span>{{ project.year }}</span>
        <span class="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors" @click.stop="toggleLike">
          <span class="icon-coracao" :class="project.liked ? 'bg-primary' : 'bg-muted'"></span>
          {{ project.likes }}
        </span>
      </div>
      <p class="font-display text-sm mt-1.5 small-caps text-text font-semibold">{{ project.title }}</p>
    </div>
  </NuxtLink>
</template>

<style scoped>
.icon-coracao {
  display: inline-block;
  width: 0.875rem;
  height: 0.875rem;
  -webkit-mask-image: url('~/assets/icons/coracao.svg');
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}
</style>

<script setup lang="ts">
import type { Project } from '~/composables/usePortfolioApi'

const props = defineProps<{
  project: Project
}>()

function toggleLike() {
  if ((props.project as any).liked) {
    props.project.likes--
    ;(props.project as any).liked = false
  } else {
    props.project.likes++
    ;(props.project as any).liked = true
  }
}

const categoryColorClass = computed(() => {
  switch (props.project.cat) {
    case 'mobile': return 'bg-secondary'
    case 'back': return 'bg-danger'
    case 'data': return 'bg-success'
    default: return 'bg-primary'
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
