const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'pages', 'admin');

const entities = [
  { 
    name: 'skills', 
    title: 'Habilidades', 
    composableKey: 'skills', 
    fields: [
      { key: 'name', label: 'Nome', type: 'text', req: true },
      { key: 'description', label: 'Descrição', type: 'text', req: true }
    ],
    createFn: 'createSkill', deleteFn: 'deleteSkill'
  },
  { 
    name: 'experiences', 
    title: 'Experiências', 
    composableKey: 'experiences', 
    fields: [
      { key: 'role', label: 'Cargo / Título', type: 'text', req: true },
      { key: 'company', label: 'Empresa', type: 'text', req: false },
      { key: 'start_date', label: 'Data de Início', type: 'date', req: true },
      { key: 'end_date', label: 'Data de Fim', type: 'date', req: false },
      { key: 'description', label: 'Descrição', type: 'text', req: false }
    ],
    createFn: 'createExperience', deleteFn: 'deleteExperience'
  },
  { 
    name: 'recommendations', 
    title: 'Depoimentos', 
    composableKey: 'testimonials', 
    fields: [
      { key: 'name_recommender', label: 'Nome do Autor', type: 'text', req: true },
      { key: 'company', label: 'Empresa', type: 'text', req: false },
      { key: 'description', label: 'Depoimento', type: 'text', req: true }
    ],
    createFn: 'createRecommendation', deleteFn: 'deleteRecommendation'
  },
  { 
    name: 'tools', 
    title: 'Ferramentas', 
    composableKey: 'tools', 
    fields: [
      { key: 'name', label: 'Nome', type: 'text', req: true },
      { key: 'icon_url', label: 'URL do Ícone', type: 'text', req: false }
    ],
    createFn: 'createTool', deleteFn: 'deleteTool'
  },
  { 
    name: 'certificates', 
    title: 'Certificados', 
    composableKey: 'certificates', 
    fields: [
      { key: 'name_course', label: 'Nome do Curso', type: 'text', req: true },
      { key: 'plataform', label: 'Plataforma / Emissor', type: 'text', req: true },
      { key: 'url', label: 'URL do Certificado', type: 'url', req: false },
      { key: 'date', label: 'Data', type: 'date', req: false }
    ],
    createFn: 'createCertificate', deleteFn: 'deleteCertificate'
  }
];

function generateIndexVue(entity) {
  return `<template>
  <div class="space-y-6 max-w-5xl">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-h1 mb-1">${entity.title}</h1>
        <p class="text-body text-muted text-sm">Gerencie ${entity.title.toLowerCase()}.</p>
      </div>
      <NuxtLink to="/admin/${entity.name}/new" class="btn-cta bg-primary text-background px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Novo(a)
      </NuxtLink>
    </div>

    <div class="bg-surface border border-border rounded-2xl overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-meta text-muted animate-pulse">Carregando...</div>
      
      <table v-else-if="${entity.composableKey}.length > 0" class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-border bg-background/50">
            <th class="py-4 px-6 text-meta text-xs text-muted font-medium">Item</th>
            <th class="py-4 px-6 text-meta text-xs text-muted font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in ${entity.composableKey}" :key="item.id" class="border-b border-border hover:bg-background/30 transition-colors">
            <td class="py-4 px-6 text-body font-medium">{{ item.title || item.name || item.role }}</td>
            <td class="py-4 px-6 text-right space-x-3">
              <!-- Edit feature planned for next phase, crud delete working -->
              <button @click="handleDelete(item.id)" class="text-meta text-xs text-blush hover:opacity-70 transition-colors">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-else class="p-8 text-center text-body text-muted">
        Nenhum item encontrado.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { definePageMeta } from '#imports'
import { usePortfolioApi } from '~/composables/usePortfolioApi'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const { ${entity.composableKey}, loading, loadData, ${entity.deleteFn} } = usePortfolioApi()

onMounted(() => loadData())

async function handleDelete(id: string) {
  if (confirm('Tem certeza que deseja excluir?')) {
    try {
      await ${entity.deleteFn}(id)
      alert('Excluído com sucesso!')
    } catch (e) {
      alert('Erro ao excluir.')
    }
  }
}
</script>
`;
}

function generateNewVue(entity) {
  const formState = entity.fields.map(f => `${f.key}: ''`).join(',\n  ');
  const formHtml = entity.fields.map(f => `
      <div>
        <label class="block text-meta text-xs text-muted mb-2">${f.label} ${f.req ? '*' : ''}</label>
        <input v-model="form.${f.key}" type="${f.type}" ${f.req ? 'required' : ''} class="w-full bg-background border border-border rounded-xl px-4 py-3 text-text text-body focus:outline-none focus:border-primary transition-colors">
      </div>
  `).join('');

  return `<template>
  <div class="max-w-2xl">
    <div class="mb-6 flex items-center gap-4">
      <NuxtLink to="/admin/${entity.name}" class="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-muted hover:text-text hover:bg-background transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      </NuxtLink>
      <h1 class="text-h2 m-0 text-text">Novo(a) ${entity.title}</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-surface border border-border rounded-2xl p-6 space-y-6">
      ${formHtml}
      
      <div v-if="errorMsg" class="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
        {{ errorMsg }}
      </div>

      <div class="pt-4 border-t border-border flex justify-end">
        <button type="submit" :disabled="saving" class="btn-cta bg-primary text-background px-6 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2">
          <span v-if="saving">Salvando...</span>
          <span v-else>Salvar</span>
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
const { ${entity.createFn} } = usePortfolioApi()
const { adminUserId } = useAuth()

const form = ref({
  ${formState}
})

const saving = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  if (!adminUserId.value) return;
  saving.value = true
  errorMsg.value = ''

  try {
    const payload = {
      user_id: adminUserId.value,
      ...form.value
    }
    // Clean up empty strings to undefined/null if needed, handled by API schema mostly
    await ${entity.createFn}(payload)
    router.push('/admin/${entity.name}')
  } catch (e: any) {
    console.error(e)
    errorMsg.value = 'Ocorreu um erro ao salvar.'
  } finally {
    saving.value = false
  }
}
</script>
`;
}

entities.forEach(entity => {
  const dir = path.join(baseDir, entity.name);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  fs.writeFileSync(path.join(dir, 'index.vue'), generateIndexVue(entity));
  fs.writeFileSync(path.join(dir, 'new.vue'), generateNewVue(entity));
});

console.log('Admin pages generated!');
