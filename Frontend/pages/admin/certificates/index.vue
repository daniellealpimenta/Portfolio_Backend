<template>
  <div class="space-y-6 max-w-5xl">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-h1 mb-1">Certificados</h1>
        <p class="text-body text-muted text-sm">Gerencie certificados.</p>
      </div>
      <NuxtLink to="/admin/certificates/new" class="btn-cta bg-primary text-background px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Novo(a)
      </NuxtLink>
    </div>

    <div class="bg-surface border border-border rounded-2xl overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-meta text-muted animate-pulse">Carregando...</div>
      
      <table v-else-if="certificates.length > 0" class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-border bg-background/50">
            <th class="py-4 px-6 text-meta text-xs text-muted font-medium">Item</th>
            <th class="py-4 px-6 text-meta text-xs text-muted font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in certificates" :key="item.id" class="border-b border-border hover:bg-background/30 transition-colors">
            <td class="py-4 px-6 text-body font-medium">{{ item.title || item.name || item.role }}</td>
            <td class="py-4 px-6 text-right space-x-3">
              <NuxtLink :to="`/admin/certificates/${item.id}`" class="text-meta text-xs text-muted hover:text-primary transition-colors">Editar</NuxtLink>
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
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const { certificates, loading, loadData, deleteCertificate } = usePortfolioApi()
const { adminUserId } = useAuth()

onMounted(() => loadData(adminUserId.value))

async function handleDelete(id: string) {
  if (confirm('Tem certeza que deseja excluir?')) {
    try {
      await deleteCertificate(id)
      alert('Excluído com sucesso!')
    } catch (e) {
      alert('Erro ao excluir.')
    }
  }
}
</script>
