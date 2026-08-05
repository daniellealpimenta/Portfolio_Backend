<template>
  <div class="space-y-8 max-w-4xl">
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-h1 mb-2">Visão Geral</h1>
        <p class="text-body text-muted">Bem-vindo ao painel de controle do seu portfólio.</p>
      </div>
      <div>
        <input type="file" ref="fileInput" accept=".json" class="hidden" @change="handleFileUpload" />
        <div class="flex gap-2">
          <button 
            @click="handleExport" 
            :disabled="exporting"
            class="bg-surface border border-border text-text px-4 py-2 rounded-xl text-sm font-semibold hover:bg-border transition disabled:opacity-50 flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            {{ exporting ? 'Exportando...' : 'Exportar JSON' }}
          </button>
          
          <button 
            @click="$refs.fileInput.click()" 
            :disabled="importing"
            class="bg-primary text-background px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            {{ importing ? 'Importando...' : 'Importar JSON' }}
          </button>
        </div>
        <p v-if="importStatus" class="text-xs mt-2 text-right" :class="importError ? 'text-error' : 'text-success'">{{ importStatus }}</p>
      </div>
    </div>

    <!-- Cards de Resumo -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Projetos -->
      <NuxtLink to="/admin/projects" class="bg-surface border border-border rounded-2xl p-6 hover:-translate-y-1 transition-transform group">
        <div class="flex items-start justify-between mb-4">
          <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
          </div>
          <span class="text-meta text-xs text-muted group-hover:text-primary transition-colors">Gerenciar &rarr;</span>
        </div>
        <h3 class="text-h2 text-text text-xl mb-1">Projetos</h3>
        <p class="text-body text-muted text-sm">
          <span v-if="loading" class="animate-pulse">...</span>
          <span v-else>{{ projects.length }} projetos publicados</span>
        </p>
      </NuxtLink>

      <!-- Habilidades -->
      <NuxtLink to="/admin/skills" class="bg-surface border border-border rounded-2xl p-6 hover:-translate-y-1 transition-transform group">
        <div class="flex items-start justify-between mb-4">
          <div class="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <span class="text-meta text-xs text-muted group-hover:text-success transition-colors">Gerenciar &rarr;</span>
        </div>
        <h3 class="text-h2 text-text text-xl mb-1">Habilidades</h3>
        <p class="text-body text-muted text-sm">
          <span v-if="loading" class="animate-pulse">...</span>
          <span v-else>{{ skills.length }} habilidades listadas</span>
        </p>
      </NuxtLink>

      <!-- Experiências -->
      <NuxtLink to="/admin/experiences" class="bg-surface border border-border rounded-2xl p-6 hover:-translate-y-1 transition-transform group">
        <div class="flex items-start justify-between mb-4">
          <div class="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <span class="text-meta text-xs text-muted group-hover:text-secondary transition-colors">Gerenciar &rarr;</span>
        </div>
        <h3 class="text-h2 text-text text-xl mb-1">Experiências</h3>
        <p class="text-body text-muted text-sm">
          <span v-if="loading" class="animate-pulse">...</span>
          <span v-else>{{ experiences.length }} experiências</span>
        </p>
      </NuxtLink>
      <!-- Ferramentas -->
      <NuxtLink to="/admin/tools" class="bg-surface border border-border rounded-2xl p-6 hover:-translate-y-1 transition-transform group">
        <div class="flex items-start justify-between mb-4">
          <div class="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </div>
          <span class="text-meta text-xs text-muted group-hover:text-orange-400 transition-colors">Gerenciar &rarr;</span>
        </div>
        <h3 class="text-h2 text-text text-xl mb-1">Ferramentas</h3>
        <p class="text-body text-muted text-sm">
          <span v-if="loading" class="animate-pulse">...</span>
          <span v-else>{{ tools.length }} ferramentas</span>
        </p>
      </NuxtLink>

      <!-- Certificados -->
      <NuxtLink to="/admin/certificates" class="bg-surface border border-border rounded-2xl p-6 hover:-translate-y-1 transition-transform group">
        <div class="flex items-start justify-between mb-4">
          <div class="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
          </div>
          <span class="text-meta text-xs text-muted group-hover:text-yellow-400 transition-colors">Gerenciar &rarr;</span>
        </div>
        <h3 class="text-h2 text-text text-xl mb-1">Certificados</h3>
        <p class="text-body text-muted text-sm">
          <span v-if="loading" class="animate-pulse">...</span>
          <span v-else>{{ certificates.length }} certificados</span>
        </p>
      </NuxtLink>

      <!-- Depoimentos -->
      <NuxtLink to="/admin/recommendations" class="bg-surface border border-border rounded-2xl p-6 hover:-translate-y-1 transition-transform group">
        <div class="flex items-start justify-between mb-4">
          <div class="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <span class="text-meta text-xs text-muted group-hover:text-pink-400 transition-colors">Gerenciar &rarr;</span>
        </div>
        <h3 class="text-h2 text-text text-xl mb-1">Depoimentos</h3>
        <p class="text-body text-muted text-sm">
          <span v-if="loading" class="animate-pulse">...</span>
          <span v-else>{{ testimonials.length }} depoimentos</span>
        </p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { definePageMeta } from '#imports'
import { usePortfolioApi } from '~/composables/usePortfolioApi'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const { user, projects, skills, experiences, tools, certificates, testimonials, loading, loadData, importSystemData, exportSystemData } = usePortfolioApi()

const fileInput = ref<HTMLInputElement | null>(null)
const importing = ref(false)
const exporting = ref(false)
const importStatus = ref('')
const importError = ref(false)

const handleExport = async () => {
  exporting.value = true
  importError.value = false
  importStatus.value = 'Gerando JSON...'
  
  try {
    const userIdToExport = user.value?.id || '019fb45c-4672-7ab1-8d67-c04858251df8'
    const data = await exportSystemData(userIdToExport)
    
    // Download logic
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `portfolio_backup_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    importStatus.value = '✓ Backup baixado!'
  } catch (error) {
    console.error(error)
    importError.value = true
    importStatus.value = 'Erro ao exportar.'
  } finally {
    exporting.value = false
    setTimeout(() => { if (!importError.value) importStatus.value = '' }, 3000)
  }
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]
  if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
    importError.value = true
    importStatus.value = 'Formato inválido. Envie um .json'
    return
  }

  importing.value = true
  importStatus.value = 'Lendo arquivo...'
  importError.value = false

  try {
    const text = await file.text()
    const json = JSON.parse(text)
    
    // Supondo que estamos usando o usuário daniel.pimenta ou o ID que já está carregado
    const userIdToImport = user.value?.id || '019fb45c-4672-7ab1-8d67-c04858251df8'
    
    importStatus.value = 'Processando dados...'
    await importSystemData(userIdToImport, json)
    
    importStatus.value = '✓ Sistema atualizado!'
    target.value = '' // reset input
  } catch (error) {
    console.error(error)
    importError.value = true
    importStatus.value = 'Erro ao importar. Verifique o console.'
  } finally {
    importing.value = false
    setTimeout(() => { if (!importError.value) importStatus.value = '' }, 3000)
  }
}

onMounted(() => {
  loadData('daniel.pimenta')
})
</script>