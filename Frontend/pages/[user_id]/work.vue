<template>
  <main class="max-w-6xl mx-auto px-6 pb-24" ref="containerRef">
    <div v-if="hasSpotlightProjects">
      <h1 ref="titleRef" class="font-display text-3xl small-caps text-paper mb-2 font-semibold">Projetos em Destaque</h1>
      <p ref="subRef" class="ink-muted mb-8 max-w-lg leading-relaxed">
        Projetos-âncora desenvolvidos com alto nível de engenharia, arquitetura e atenção ao detalhe.
      </p>

      <!-- SPOTLIGHT PROJECTS -->
      <section class="mb-16">
        <ProjectSpotlight />
      </section>
    </div>

    <div class="border-t ink-border pt-12 mb-8">
      <h2 class="font-display text-2xl small-caps text-paper font-semibold mb-2">Outros Trabalhos</h2>
      <p class="ink-muted mb-6">Filtre por categoria para explorar mais projetos.</p>

      <!-- TAB FILTER BUTTONS -->
      <div class="flex gap-2 mb-6 flex-wrap">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="setFilter(tab.id)"
          class="tab-btn px-4 py-2 rounded-full border ink-border text-xs font-display small-caps tracking-wide cursor-pointer font-semibold"
          :class="activeFilter === tab.id ? 'bg-periwinkle text-navy' : 'ink-muted hover:text-paper'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- PROJECTS GRID -->
      <div class="bg-navypanel rounded-3xl p-4 md:p-6 border ink-border">
        <div ref="gridRef" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <ProjectCard 
            v-for="project in filteredProjects" 
            :key="project.id" 
            :project="project"
            @click="openProject(project.id)"
          />
        </div>
        <p v-if="filteredProjects.length === 0" class="text-sm ink-muted col-span-full py-8 text-center">
          Nenhum projeto encontrado nesta categoria.
        </p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { useRouter, useRoute } from 'vue-router'
import { usePortfolioApi, type Project } from '~/composables/usePortfolioApi'
import ProjectSpotlight from '~/components/ProjectSpotlight.vue'

const { projects, loadData } = usePortfolioApi()
const router = useRouter()
const route = useRoute()

const hasSpotlightProjects = computed(() => {
  return projects.value.some(p => p.likes > 0)
})

const activeFilter = ref('all')

const tabs = [
  { id: 'all', label: 'Todos' },
  { id: 'data', label: 'Data' },
  { id: 'back', label: 'Back' },
  { id: 'mobile', label: 'Mobile' }
]

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') return projects.value
  return projects.value.filter(p => p.cat === activeFilter.value)
})

const containerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)

useGsap(containerRef, () => {
  if (titleRef.value) gsap.fromTo(titleRef.value, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 })
  if (subRef.value) gsap.fromTo(subRef.value, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.1 })
})

async function setFilter(filterId: string) {
  activeFilter.value = filterId
  await nextTick()
  if (gridRef.value && gridRef.value.children.length > 0) {
    gsap.fromTo(gridRef.value.children, 
      { opacity: 0, y: 16 }, 
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.05 }
    )
  }
}

function openProject(projectId: string | number) {
  window.open(`/${route.params.user_id}/projects/${projectId}`.replace('//', '/'), '_blank')
}

onMounted(() => {
  loadData(route.params.user_id as string)
})
</script>
