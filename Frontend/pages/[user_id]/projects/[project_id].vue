<template>
  <main class="max-w-4xl mx-auto px-6 pb-24 pt-8" ref="containerRef">
    <div v-if="loading" class="animate-pulse text-center py-20 text-muted">Carregando projeto...</div>
    <div v-else-if="project" class="space-y-12">
      
      <!-- Cabeçalho -->
      <header class="text-left">
        <h1 class="text-h1 mb-4 uppercase text-text font-bold tracking-tight text-4xl md:text-5xl">{{ project.title }}</h1>
        
        <!-- Badges -->
        <div class="flex items-center justify-start gap-4">
          <a v-if="project.test_url" :href="project.test_url" target="_blank" class="px-5 py-2 rounded-full bg-text text-background text-xs font-display small-caps tracking-wide hover:opacity-85 transition font-semibold">
            Teste
          </a>
          <div v-if="project.test_url && project.github_url" class="w-[1.5px] h-6 bg-border"></div>
          <a v-if="project.github_url" :href="project.github_url" target="_blank" class="px-5 py-2 rounded-full bg-text text-background text-xs font-display small-caps tracking-wide hover:opacity-85 transition font-semibold">
            GitHub
          </a>
        </div>
      </header>

      <!-- Vídeo Principal -->
      <div v-if="videoMedia" class="rounded-3xl overflow-hidden border border-border bg-surface aspect-video flex items-center justify-center shadow-2xl">
        <video controls class="w-full h-full object-cover">
          <source :src="videoMedia.image_path" type="video/mp4" />
          Seu navegador não suporta vídeos.
        </video>
      </div>

      <!-- Descrição -->
      <div 
        class="prose prose-invert prose-lg max-w-none text-body text-text leading-relaxed markdown-content"
        v-html="renderedDescription"
      ></div>

      <!-- Imagens -->
      <div v-if="imageMedias.length > 0" class="space-y-8 pt-8 border-t border-border">
        <h2 class="font-display text-2xl small-caps text-text font-semibold text-center mb-8">Galeria do Projeto</h2>
        <div v-for="(img, idx) in imageMedias" :key="idx" class="rounded-3xl overflow-hidden border border-border bg-surface shadow-xl">
          <img :src="img.image_path" :alt="img.description || 'Imagem do projeto'" class="w-full h-auto object-cover" />
          <p v-if="img.description" class="p-4 text-sm text-center text-muted border-t border-border bg-background/50">
            {{ img.description }}
          </p>
        </div>
      </div>

    </div>
    <div v-else class="text-center py-20 text-meta text-muted">
      Projeto não encontrado.
      <br><br>
      <NuxtLink :to="`/${route.params.user_id}`" class="text-primary hover:underline">Voltar para o início</NuxtLink>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePortfolioApi, type Project } from '~/composables/usePortfolioApi'
import { gsap } from 'gsap'
import { marked } from 'marked'

const route = useRoute()
const projectId = route.params.project_id as string
const { projects, loadData, getProjectImages } = usePortfolioApi()

const loading = ref(true)
const projectMedias = ref<any[]>([])
const containerRef = ref<HTMLElement | null>(null)

const project = computed(() => {
  return projects.value.find((p) => p.id === projectId || p.id == projectId)
})

const renderedDescription = computed(() => {
  if (!project.value?.desc) return ''
  return marked.parse(project.value.desc)
})

const videoMedia = computed(() => {
  return projectMedias.value.find(m => {
    const p = (m.image_path || '').toLowerCase()
    return p.endsWith('.mp4') || p.endsWith('.webm') || p.endsWith('.mov')
  })
})

const imageMedias = computed(() => {
  return projectMedias.value.filter(m => {
    const p = (m.image_path || '').toLowerCase()
    return p && !(p.endsWith('.mp4') || p.endsWith('.webm') || p.endsWith('.mov'))
  })
})

onMounted(async () => {
  if (projects.value.length === 0) {
    await loadData(route.params.user_id as string)
  }
  
  if (project.value) {
    try {
      projectMedias.value = await getProjectImages(projectId)
    } catch (e) {
      console.error('Erro ao carregar imagens do projeto:', e)
    }
  }
  
  loading.value = false

  // Animação de entrada
  setTimeout(() => {
    if (containerRef.value) {
      gsap.fromTo(containerRef.value, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
    }
  }, 50)
})
</script>

<style>
.markdown-content p {
  margin-bottom: 1.5rem;
}
.markdown-content blockquote {
  background-color: var(--color-surface, #F3F4F6);
  border: 1px solid var(--color-border, #E5E7EB);
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 2rem 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
}
.markdown-content blockquote p {
  margin-bottom: 0.5rem;
}
.markdown-content blockquote p:last-child {
  margin-bottom: 0;
}
/* Adaptação para o dark mode do Tailwind/Site */
.dark .markdown-content blockquote {
  background-color: #1F2937;
  border-color: #374151;
}
</style>
