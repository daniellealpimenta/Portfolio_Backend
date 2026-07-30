<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      ref="modalRef" 
      class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-black/50 p-4"
      @click.self="close"
    >
      <div 
        ref="panelRef" 
        class="bg-navy rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto modal-scroll p-8 border ink-border"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-display text-2xl small-caps text-paper font-semibold">{{ project?.title }}</h3>
          <button @click="close" class="text-xl leading-none text-paper cursor-pointer p-1" aria-label="Fechar">✕</button>
        </div>
        <p class="text-xs ink-muted mb-6">Ano: {{ project?.year }}</p>
        <p class="ink-muted leading-relaxed mb-8">{{ project?.desc }}</p>
        <div class="flex items-center gap-3">
          <a 
            v-if="project?.github_url" 
            :href="project.github_url" 
            target="_blank" 
            class="px-4 py-2 rounded-full border ink-border text-xs font-display small-caps ink-muted hover:text-paper transition flex items-center gap-1.5"
          >
            🐙 GitHub
          </a>
          <a 
            v-if="project?.test_url" 
            :href="project.test_url" 
            target="_blank" 
            class="px-4 py-2 rounded-full bg-periwinkle text-navy text-xs font-display small-caps hover:opacity-85 transition flex items-center gap-1.5 font-semibold"
          >
            🔗 Demo Direct
          </a>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import type { Project } from '~/composables/usePortfolioApi'

const props = defineProps<{
  project: Project | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const modalRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

watch(() => props.isOpen, async (val) => {
  if (val) {
    await nextTick()
    if (modalRef.value && panelRef.value) {
      gsap.timeline()
        .fromTo(modalRef.value, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power1.out' })
        .fromTo(panelRef.value, { opacity: 0, y: 24, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'expo.out' }, '-=0.15')
    }
  }
})

function close() {
  if (modalRef.value && panelRef.value) {
    gsap.timeline({
      onComplete: () => {
        emit('close')
      }
    })
      .to(panelRef.value, { opacity: 0, y: 16, scale: 0.97, duration: 0.25, ease: 'power2.in' })
      .to(modalRef.value, { opacity: 0, duration: 0.15 }, '-=0.1')
  } else {
    emit('close')
  }
}
</script>
