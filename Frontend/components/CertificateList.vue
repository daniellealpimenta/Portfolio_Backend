<template>
  <div ref="listRef" class="flex flex-col gap-12 mt-8 max-w-4xl mx-auto">
    <div
      v-for="(cert, index) in certificates"
      :key="cert.id" 
      class="flex flex-col md:flex-row items-center gap-6"
      :class="{ 'md:flex-row-reverse': index % 2 !== 0 }"
    >
      <!-- Icon -->
      <div class="shrink-0">
        <!-- SVG that looks more like a certificate with a ribbon -->
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-text">
          <rect x="3" y="3" width="18" height="14" rx="2"></rect>
          <circle cx="16" cy="10" r="3"></circle>
          <polyline points="14.5 12.5 14 20 16 18 18 20 17.5 12.5"></polyline>
          <line x1="7" y1="7" x2="11" y2="7"></line>
          <line x1="7" y1="10" x2="11" y2="10"></line>
        </svg>
      </div>
      
      <!-- Content -->
      <div class="flex-1 flex flex-col" :class="index % 2 !== 0 ? 'items-end text-right' : 'items-start text-left'">
        <p class="text-base md:text-lg text-text leading-relaxed">
          <span class="font-bold uppercase tracking-wide">{{ cert.title }}</span>: {{ cert.issuer || cert.description }}
        </p>
        
        <!-- Buttons -->
        <div class="flex items-center gap-3 mt-4">
          <a v-if="cert.digital_certificate_url" :href="cert.digital_certificate_url" target="_blank" class="px-6 py-2.5 rounded-full bg-text text-background font-semibold text-[10px] md:text-xs uppercase tracking-wider hover:opacity-80 transition">
            Ver Mais
          </a>
          <button @click="handleDownload(cert)" class="px-6 py-2.5 rounded-full bg-text text-background font-semibold text-[10px] md:text-xs uppercase tracking-wider hover:opacity-80 transition flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Certificado
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Certificate } from '~/composables/usePortfolioApi'

const props = defineProps<{
  certificates: Certificate[]
}>()

const listRef = ref<HTMLElement | null>(null)
useScrollStagger(listRef, computed(() => props.certificates.length), { y: 30, duration: 0.6, stagger: 0.12 })

function handleDownload(cert: Certificate) {
  if (cert.digital_certificate_url) {
    window.open(cert.digital_certificate_url, '_blank')
  }
}
</script>
