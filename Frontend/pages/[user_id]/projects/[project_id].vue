<template>
  <main class="max-w-4xl mx-auto px-6 pb-24 pt-8" ref="containerRef">
    <div v-if="loading" class="animate-pulse text-center py-20 text-muted">Carregando projeto...</div>
    <div v-else-if="project" class="space-y-12">
      
      <!-- Cabeçalho -->
      <header class="text-left">
        <h1 class="text-h1 mb-4 uppercase text-text font-bold tracking-tight text-4xl md:text-5xl">{{ project.title }}</h1>
        
        <!-- Links do Projeto -->
        <div v-if="projectLinks.length > 0" class="flex items-center justify-start gap-3 flex-wrap">
          <a
            v-for="link in projectLinks"
            :key="link.id"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="px-5 py-2 rounded-full bg-text text-background text-xs font-display small-caps tracking-wide hover:opacity-85 transition font-semibold flex items-center gap-2"
          >
            <IconRenderer :icon="link.icon" :size="16" />
            {{ link.name }}
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
        class="text-body text-text leading-relaxed markdown-content"
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
import { usePortfolioApi, type Project, type ProjectLink } from '~/composables/usePortfolioApi'
import { gsap } from 'gsap'
import { marked } from 'marked'
import IconRenderer from '~/components/ui/IconRenderer.vue'

const route = useRoute()
const projectId = route.params.project_id as string
const { projects, loadData, getProjectImages, getProjectLinks } = usePortfolioApi()

const loading = ref(true)
const projectMedias = ref<any[]>([])
const projectLinks = ref<ProjectLink[]>([])
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
    try {
      projectLinks.value = await getProjectLinks(projectId)
    } catch (e) {
      console.error('Erro ao carregar links do projeto:', e)
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
/* Estilos do markdown renderizado (v-html) — a página não tem o plugin de
   tipografia do Tailwind instalado, então isso é escrito à mão, usando as
   variáveis de tema do site. overflow-wrap/overflow-x são de propósito:
   sem eles, um link comprido ou uma linha de código longa estoura a
   largura da página inteira. */
.markdown-content {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.25;
  margin-top: 2rem;
  margin-bottom: 1rem;
}
.markdown-content h1 { font-size: 1.75rem; }
.markdown-content h2 { font-size: 1.5rem; }
.markdown-content h3 { font-size: 1.25rem; }
.markdown-content h4 { font-size: 1.125rem; }
.markdown-content > :first-child {
  margin-top: 0;
}

.markdown-content p {
  margin-bottom: 1.5rem;
}

.markdown-content strong {
  color: var(--color-text);
  font-weight: 700;
}

.markdown-content a {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.markdown-content ul,
.markdown-content ol {
  margin: 0 0 1.5rem 1.5rem;
  color: var(--color-text);
}
.markdown-content ul { list-style: disc; }
.markdown-content ol { list-style: decimal; }
.markdown-content li { margin-bottom: 0.5rem; }

.markdown-content code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875em;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  padding: 0.125rem 0.375rem;
  color: var(--color-primary);
}

.markdown-content pre {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.25rem;
  margin: 0 0 1.5rem;
  overflow-x: auto;
  max-width: 100%;
}
.markdown-content pre code {
  background: none;
  border: none;
  padding: 0;
  color: var(--color-text);
  white-space: pre;
  overflow-wrap: normal;
  word-break: normal;
}

.markdown-content table {
  display: block;
  overflow-x: auto;
  max-width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}
.markdown-content th,
.markdown-content td {
  border: 1px solid var(--color-border);
  padding: 0.5rem 1rem;
  text-align: left;
  white-space: nowrap;
}
.markdown-content th {
  background-color: var(--color-surface);
  color: var(--color-text);
  font-weight: 600;
}

.markdown-content blockquote {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-primary);
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 0 0 1.5rem;
  font-style: italic;
  color: var(--color-muted);
}
.markdown-content blockquote p {
  margin-bottom: 0.5rem;
}
.markdown-content blockquote p:last-child {
  margin-bottom: 0;
}
</style>
