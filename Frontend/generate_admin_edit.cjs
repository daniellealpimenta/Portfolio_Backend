const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'pages', 'admin');

const entities = [
  { 
    name: 'projects', 
    title: 'Projeto',
    composableKey: 'projects',
    updateFn: 'updateProject',
    fields: [
      { key: 'name', label: 'Nome do Projeto', type: 'text', req: true, vModel: 'title' },
      { key: 'category', label: 'Categoria', type: 'select', req: true, options: ['FrontEnd', 'BackEnd', 'FullStack', 'DataScience', 'GameDev', 'Mobile', 'Other'], vModel: 'cat' },
      { key: 'github_url', label: 'GitHub URL', type: 'url', req: false, vModel: 'github_url' },
      { key: 'test_url', label: 'Test URL', type: 'url', req: false, vModel: 'test_url' }
    ]
  },
  { 
    name: 'skills', 
    title: 'Habilidade',
    composableKey: 'skills', 
    updateFn: 'updateSkill',
    fields: [
      { key: 'name', label: 'Nome', type: 'text', req: true, vModel: 'name' },
      { key: 'description', label: 'Descrição', type: 'text', req: true, vModel: 'desc' }
    ]
  },
  { 
    name: 'experiences', 
    title: 'Experiência',
    composableKey: 'experiences', 
    updateFn: 'updateExperience',
    fields: [
      { key: 'role', label: 'Cargo / Título', type: 'text', req: true, vModel: 'title' },
      { key: 'description', label: 'Descrição', type: 'text', req: false, vModel: 'desc' }
    ]
  },
  { 
    name: 'recommendations', 
    title: 'Depoimento',
    composableKey: 'testimonials', 
    updateFn: 'updateRecommendation',
    fields: [
      { key: 'name_recommender', label: 'Nome do Autor', type: 'text', req: true, vModel: 'name' },
      { key: 'description', label: 'Depoimento', type: 'text', req: true, vModel: 'quote' }
    ]
  },
  { 
    name: 'tools', 
    title: 'Ferramenta',
    composableKey: 'tools', 
    updateFn: 'updateTool',
    fields: [
      { key: 'name', label: 'Nome', type: 'text', req: true, vModel: 'name' }
    ]
  },
  { 
    name: 'certificates', 
    title: 'Certificado',
    composableKey: 'certificates', 
    updateFn: 'updateCertificate',
    fields: [
      { key: 'name_course', label: 'Nome do Curso', type: 'text', req: true, vModel: 'title' },
      { key: 'plataform', label: 'Emissor', type: 'text', req: true, vModel: 'issuer' }
    ]
  }
];

function generateEditVue(entity) {
  const formState = entity.fields.map(f => `${f.key}: ''`).join(',\n  ');
  const formSync = entity.fields.map(f => `form.value.${f.key} = item.${f.vModel} || ''`).join('\n      ');

  let formHtml = '';
  entity.fields.forEach(f => {
    if (f.type === 'select') {
      const opts = f.options.map(o => `<option value="${o}">${o}</option>`).join('');
      formHtml += `
      <div>
        <label class="block text-meta text-xs text-mist mb-2">${f.label} ${f.req ? '*' : ''}</label>
        <select v-model="form.${f.key}" ${f.req ? 'required' : ''} class="w-full bg-navy border ink-border rounded-xl px-4 py-3 text-paper text-body focus:outline-none focus:border-periwinkle transition-colors appearance-none">
          ${opts}
        </select>
      </div>`;
    } else {
      formHtml += `
      <div>
        <label class="block text-meta text-xs text-mist mb-2">${f.label} ${f.req ? '*' : ''}</label>
        <input v-model="form.${f.key}" type="${f.type}" ${f.req ? 'required' : ''} class="w-full bg-navy border ink-border rounded-xl px-4 py-3 text-paper text-body focus:outline-none focus:border-periwinkle transition-colors">
      </div>`;
    }
  });

  return `<template>
  <div class="max-w-2xl">
    <div class="mb-6 flex items-center gap-4">
      <NuxtLink to="/admin/${entity.name}" class="w-10 h-10 rounded-full bg-navypanel border ink-border flex items-center justify-center text-mist hover:text-paper hover:bg-navy transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      </NuxtLink>
      <h1 class="text-h2 m-0 text-paper">Editar ${entity.title}</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-navypanel border ink-border rounded-2xl p-6 space-y-6">
      ${formHtml}
      
      <div v-if="errorMsg" class="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
        {{ errorMsg }}
      </div>

      <div class="pt-4 border-t ink-border flex justify-end">
        <button type="submit" :disabled="saving" class="btn-cta bg-periwinkle text-navy px-6 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2">
          <span v-if="saving">Salvando...</span>
          <span v-else>Salvar Alterações</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { definePageMeta, useRouter, useRoute } from '#imports'
import { usePortfolioApi } from '~/composables/usePortfolioApi'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const router = useRouter()
const route = useRoute()
const id = route.params.id as string

const { ${entity.composableKey}, ${entity.updateFn}, loadData } = usePortfolioApi()
const { adminUserId } = useAuth()

const form = ref({
  ${formState}
})

const saving = ref(false)
const errorMsg = ref('')

onMounted(async () => {
  if (${entity.composableKey}.value.length === 0) {
    await loadData()
  }
  syncData()
})

watch(${entity.composableKey}, () => syncData())

function syncData() {
  const item = ${entity.composableKey}.value.find((x: any) => x.id === id || x.id == id)
  if (item) {
      ${formSync}
  }
}

async function handleSubmit() {
  saving.value = true
  errorMsg.value = ''

  try {
    const payload = { ...form.value }
    // Clean empty values
    Object.keys(payload).forEach(k => {
      if ((payload as any)[k] === '') {
        (payload as any)[k] = null
      }
    })
    
    await ${entity.updateFn}(id, payload)
    router.push('/admin/${entity.name}')
  } catch (e: any) {
    console.error(e)
    errorMsg.value = 'Ocorreu um erro ao salvar as alterações.'
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
  fs.writeFileSync(path.join(dir, '[id].vue'), generateEditVue(entity));
});

// Atualiza também as páginas de listagem para colocar o NuxtLink para a página de edição (substituindo o comentário)
entities.forEach(entity => {
  const indexPath = path.join(baseDir, entity.name, 'index.vue');
  if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf-8');
    content = content.replace(
      /<!-- Edit feature planned for next phase, crud delete working -->/,
      `<NuxtLink :to="\`/admin/${entity.name}/\${item.id}\`" class="text-meta text-xs text-mist hover:text-periwinkle transition-colors">Editar</NuxtLink>`
    );
    // for projects
    content = content.replace(
      /<button class="text-meta text-xs text-mist hover:text-periwinkle transition-colors">Editar<\/button>/,
      `<NuxtLink :to="\`/admin/${entity.name}/\${proj.id}\`" class="text-meta text-xs text-mist hover:text-periwinkle transition-colors">Editar</NuxtLink>`
    );
    fs.writeFileSync(indexPath, content);
  }
});

console.log('Edit pages generated!');
