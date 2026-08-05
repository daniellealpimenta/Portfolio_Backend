<template>
  <main class="max-w-6xl mx-auto px-6 py-32 h-screen flex flex-col">
    <h1 class="text-h2 mb-4 font-display small-caps">Meu Currículo</h1>
    <div class="flex-1 w-full border border-border rounded-2xl overflow-y-auto bg-surface flex justify-center p-4">
      <ClientOnly>
        <VuePdfEmbed v-if="pdfUrl" :source="pdfUrl" class="w-full max-w-3xl drop-shadow-xl" />
        <template #fallback>
          <div class="text-muted p-10 flex items-center justify-center animate-pulse">Carregando PDF...</div>
        </template>
      </ClientOnly>
      <div v-if="!pdfUrl" class="p-6 text-muted flex items-center justify-center h-full w-full">
        Nenhum currículo cadastrado para este idioma.
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'
import { useLanguage } from '~/composables/useLanguage'
import { usePortfolioApi } from '~/composables/usePortfolioApi'

const { lang } = useLanguage()
const { user, loadData } = usePortfolioApi()

const pdfUrl = computed(() => lang.value === 'en' ? user.value?.curriculum_en_url : user.value?.curriculum_url)

onMounted(() => {
  loadData()
})
</script>