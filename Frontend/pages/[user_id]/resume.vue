<template>
  <div class="max-w-7xl mx-auto px-4 md:px-6 pt-0 pb-10 min-h-[125vh] h-[calc(100vh-8rem)] flex flex-col">
    <div class="flex items-center justify-between mb-4 px-2">
      <h1 class="text-2xl font-display small-caps text-text">Meu Currículo</h1>
    </div>
    <div class="flex-1 w-full border border-border rounded-2xl overflow-y-auto bg-surface flex justify-center p-4 md:p-8">
      <ClientOnly>
        <VuePdfEmbed v-if="pdfUrl" :source="pdfUrl" class="w-full max-w-3xl drop-shadow-2xl" />
        <template #fallback>
          <div class="text-muted p-10 flex items-center justify-center animate-pulse">Carregando PDF...</div>
        </template>
      </ClientOnly>
      <div v-if="!pdfUrl" class="p-6 text-muted flex items-center justify-center h-full w-full">
        Nenhum currículo cadastrado para este idioma.
      </div>
    </div>
  </div>
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