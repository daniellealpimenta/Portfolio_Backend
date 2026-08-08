<template>
  <div class="min-h-screen bg-navy text-paper flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-navypanel border-r ink-border flex flex-col hidden md:flex shrink-0">
      <div class="p-6 border-b ink-border flex flex-col gap-2">
        <h1 class="text-h2 text-periwinkle m-0">Admin Panel</h1>
        <span class="text-meta text-xs text-mist truncate">Olá, {{ adminUserName || 'Admin' }}</span>
      </div>
      
      <nav class="flex-1 p-4 space-y-1 text-meta text-sm overflow-y-auto">
        <NuxtLink to="/admin" exact-active-class="bg-navy border ink-border text-periwinkle" class="flex items-center gap-3 px-4 py-3 rounded-xl ink-muted hover:bg-navy hover:text-paper transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Dashboard
        </NuxtLink>
        <NuxtLink to="/admin/user" active-class="bg-navy border ink-border text-periwinkle" class="flex items-center gap-3 px-4 py-3 rounded-xl ink-muted hover:bg-navy hover:text-paper transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c1-4 4-6 8-6s7 2 8 6"/></svg>
          Meu Perfil
        </NuxtLink>
        <NuxtLink to="/admin/projects" active-class="bg-navy border ink-border text-periwinkle" class="flex items-center gap-3 px-4 py-3 rounded-xl ink-muted hover:bg-navy hover:text-paper transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
          Projetos
        </NuxtLink>
        <NuxtLink to="/admin/project-images" active-class="bg-navy border ink-border text-periwinkle" class="flex items-center gap-3 px-4 py-3 rounded-xl ink-muted hover:bg-navy hover:text-paper transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          Mídia Projetos
        </NuxtLink>
        <NuxtLink to="/admin/skills" active-class="bg-navy border ink-border text-periwinkle" class="flex items-center gap-3 px-4 py-3 rounded-xl ink-muted hover:bg-navy hover:text-paper transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          Habilidades
        </NuxtLink>
        <NuxtLink to="/admin/experiences" active-class="bg-navy border ink-border text-periwinkle" class="flex items-center gap-3 px-4 py-3 rounded-xl ink-muted hover:bg-navy hover:text-paper transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          Experiências
        </NuxtLink>
        <NuxtLink to="/admin/tools" active-class="bg-navy border ink-border text-periwinkle" class="flex items-center gap-3 px-4 py-3 rounded-xl ink-muted hover:bg-navy hover:text-paper transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          Ferramentas
        </NuxtLink>
        <NuxtLink to="/admin/certificates" active-class="bg-navy border ink-border text-periwinkle" class="flex items-center gap-3 px-4 py-3 rounded-xl ink-muted hover:bg-navy hover:text-paper transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
          Certificados
        </NuxtLink>
        <NuxtLink to="/admin/recommendations" active-class="bg-navy border ink-border text-periwinkle" class="flex items-center gap-3 px-4 py-3 rounded-xl ink-muted hover:bg-navy hover:text-paper transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Recomendações
        </NuxtLink>
      </nav>

      <div class="p-4 border-t ink-border">
        <button @click="logout" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-meta text-sm text-blush hover:bg-navy border border-transparent hover:ink-border transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sair
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      <!-- Topbar Mobile -->
      <header class="md:hidden bg-navypanel border-b ink-border p-4 flex items-center justify-between shrink-0">
        <h1 class="text-h2 text-periwinkle m-0">Admin</h1>
        <button @click="logout" class="text-meta text-sm text-blush">Sair</button>
      </header>

      <div class="flex-1 overflow-y-auto p-6 lg:p-10">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { adminUserName, logout } = useAuth()
</script>
