<template>
  <div
    class="work-card text-left bg-background rounded-2xl p-3 border border-border w-full flex flex-col justify-between cursor-pointer block"
  >
    <div>
      <div class="rounded-xl bg-surface h-28 mb-3 relative overflow-hidden flex items-center justify-center">
        <div class="absolute top-2 left-2 right-2 flex flex-wrap gap-1">
          <span
            v-for="cat in displayCategories"
            :key="cat"
            class="text-[10px] px-2 py-0.5 rounded-full text-background font-display small-caps font-semibold"
            :class="categoryColorClass(cat)"
          >
            {{ cat }}
          </span>
        </div>
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
  </div>
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
  const wasLiked = !!p.liked
  p.liked = !wasLiked
  p.likes += wasLiked ? -1 : 1

  try {
    const res: any = await likeProject(p.id, p.liked)
    if (res && typeof res.likes === 'number') p.likes = res.likes
  } catch (e) {
    console.error('Failed to update likes', e)
    p.liked = wasLiked
    p.likes += wasLiked ? 1 : -1
  }
}

const displayCategories = computed(() => {
  const cats = props.project.categories
  if (cats && cats.length > 0) return cats
  // Projetos antigos/sem categorias reais caem no balde simplificado
  return [props.project.cat]
})

function categoryColorClass(cat: string) {
  switch (cat) {
    case 'Mobile': return 'bg-secondary'
    case 'BackEnd': return 'bg-danger'
    case 'DataScience': return 'bg-success'
    case 'FrontEnd': return 'bg-primary'
    case 'FullStack': return 'bg-warning'
    case 'GameDev': return 'bg-danger'
    default: return 'bg-muted'
  }
}
</script>
