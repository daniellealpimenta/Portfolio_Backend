<template>
  <div class="max-w-2xl">
    <div class="mb-6 flex items-center gap-4">
      <NuxtLink to="/admin/projects" class="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-muted hover:text-text hover:bg-border/50 transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      </NuxtLink>
      <h1 class="text-h2 m-0 text-text">Novo Projeto</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-surface border border-border rounded-2xl p-6 space-y-6">
      <div>
        <label class="block text-meta text-xs text-muted mb-2">Nome do Projeto *</label>
        <input v-model="form.name" type="text" required class="w-full bg-background border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors">
      </div>

      <div>
        <label class="block text-meta text-xs text-muted mb-2">Categoria *</label>
        <select v-model="form.category" required class="w-full bg-background border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors appearance-none">
          <option value="FrontEnd">FrontEnd</option>
          <option value="BackEnd">BackEnd</option>
          <option value="FullStack">FullStack</option>
          <option value="DataScience">DataScience</option>
          <option value="GameDev">GameDev</option>
          <option value="Mobile">Mobile</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label class="block text-meta text-xs text-muted mb-2">Descrição</label>
        <textarea v-model="form.description" rows="4" class="w-full bg-background border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors"></textarea>
      </div>

      <div>
        <label class="block text-meta text-xs text-muted mb-2">URL do GitHub</label>
        <input v-model="form.github_url" type="url" class="w-full bg-background border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors">
      </div>

      <div>
        <label class="block text-meta text-xs text-muted mb-2">URL de Teste / Deploy</label>
        <input v-model="form.test_url" type="url" class="w-full bg-background border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors">
      </div>
      
      <div v-if="errorMsg" class="text-sm text-error bg-error/10 border border-error/20 rounded-xl p-3">
        {{ errorMsg }}
      </div>

      <div class="pt-4 border-t border-border flex justify-end">
        <button type="submit" :disabled="saving" class="bg-primary text-background px-6 py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2">
          <span v-if="saving">Salvando...</span>
          <span v-else>Salvar Projeto</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { definePageMeta, useRouter } from '#imports'
import { usePortfolioApi } from '~/composables/usePortfolioApi'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const router = useRouter()
const { createProject } = usePortfolioApi()
const { adminUserId } = useAuth()

const form = ref({
  name: '',
  category: 'FrontEnd',
  description: '',
  github_url: '',
  test_url: ''
})

const saving = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  saving.value = true
  errorMsg.value = ''

  try {
    const payload = {
      user_id: adminUserId.value || '019fb45c-4672-7ab1-8d67-c04858251df8',
      ...form.value
    }
    
    // Clean empty values
    Object.keys(payload).forEach(k => {
      if ((payload as any)[k] === '') {
        (payload as any)[k] = null
      }
    })

    await createProject(payload)
    router.push('/admin/projects')
  } catch (e: any) {
    console.error(e)
    errorMsg.value = 'Ocorreu um erro ao salvar.'
  } finally {
    saving.value = false
  }
}
</script>
