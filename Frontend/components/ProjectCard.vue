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
          <svg 
            width="14" height="14" viewBox="0 0 24 24" 
            :fill="project.liked ? 'currentColor' : 'none'" 
            stroke="currentColor" stroke-width="2" 
            stroke-linecap="round" stroke-linejoin="round"
            class="transition-colors"
            :class="project.liked ? 'text-primary' : ''"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          {{ project.likes }}
        </span>
      </div>
      <p class="font-display text-sm mt-1.5 small-caps text-text font-semibold">{{ project.title }}</p>
    </div>
  </NuxtLink>
</template>

<style scoped>
/* Removed old heart icon mask */
</style>

<script setup lang="ts">
import { usePortfolioApi, type Project } from '~/composables/usePortfolioApi'

const props = defineProps<{
  project: Project
}>()

const { likeProject } = usePortfolioApi()

async function toggleLike() {
  const p = props.project as any
  if (p.liked) {
    p.likes--
    p.liked = false
  } else {
    p.likes++
    p.liked = true
  }
  
  try {
    await likeProject(p.id, p.likes)
  } catch (e) {
    console.error('Failed to update likes', e)
    if (p.liked) {
      p.likes--
      p.liked = false
    } else {
      p.likes++
      p.liked = true
    }
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
