<template>
  <div v-if="spotlightProjects.length > 0" class="space-y-12">
    <div 
      v-for="(project, index) in spotlightProjects" 
      :key="project.id"
      class="project-spotlight cursor-pointer hover:opacity-90 transition-opacity" 
      :class="{ 'project-spotlight--reverse': index % 2 !== 0 }"
      @click="openProject(project.id)"
    >
      <div class="project-spotlight__media">
        <span class="project-spotlight__tag bg-lilac">{{ project.cat }}</span>
        <!-- Default icon placeholder -->
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#8FA0C4" stroke-width="1.2" opacity="0.6">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      </div>
      <div>
        <span class="eyebrow flex items-center gap-2">
          {{ project.year }}
          <span class="flex items-center gap-1 text-primary">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            {{ project.likes }}
          </span>
        </span>
        <h3 class="font-display text-3xl small-caps text-paper font-semibold mt-2">{{ project.title }}</h3>
        <p class="project-spotlight__desc line-clamp-3">
          {{ project.desc }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePortfolioApi } from '~/composables/usePortfolioApi'

const route = useRoute()
const { projects } = usePortfolioApi()

const spotlightProjects = computed(() => {
  return [...projects.value]
    .filter(p => p.likes > 0)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 2)
})

function openProject(projectId: string | number) {
  navigateTo(`/${route.params.user_id}/projects/${projectId}`.replace('//', '/'))
}
</script>
