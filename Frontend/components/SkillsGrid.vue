<template>
  <div class="bg-navypanel rounded-3xl p-6 border ink-border flex flex-col justify-between">
    <div>
      <div class="flex items-center gap-2 mb-5">
        <span class="icon-habilidades text-text"></span>
        <h3 class="font-display small-caps text-lg text-text font-semibold">Habilidades</h3>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div 
          v-for="skill in previewSkills" 
          :key="skill.id" 
          class="icon-tile rounded-xl bg-navy p-3 border ink-border flex flex-col items-center justify-center text-center gap-1.5"
        >
          <span class="text-xs font-display small-caps text-paper font-medium">{{ skill.name }}</span>
        </div>
      </div>
    </div>
    <button 
      v-if="skills.length > 6"
      @click="showModal = true" 
      class="mt-6 self-start px-4 py-2 rounded-full bg-periwinkle text-navy text-xs font-display small-caps tracking-wide hover:opacity-85 transition font-semibold cursor-pointer"
    >
      Ver Mais
    </button>

    <!-- Modal Habilidades -->
    <Teleport to="body">
      <div 
        v-if="showModal" 
        ref="modalRef" 
        class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-black/50 p-4"
        @click.self="closeModal"
      >
        <div 
          ref="panelRef" 
          class="bg-navypanel rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-y-auto modal-scroll p-6 border ink-border"
        >
          <div class="mb-6 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="icon-habilidades text-text"></span>
              <h3 class="font-display small-caps text-lg text-text font-semibold">Habilidades</h3>
            </div>
            <button @click="closeModal" class="text-xl leading-none text-paper cursor-pointer p-1" aria-label="Fechar">✕</button>
          </div>
          <div class="space-y-4">
            <div 
              v-for="skill in skills" 
              :key="skill.id" 
              class="rounded-xl bg-navy p-4 border ink-border"
            >
              <h4 class="font-display text-sm small-caps text-paper font-semibold mb-1">{{ skill.name }}</h4>
              <p class="text-xs ink-muted leading-relaxed">{{ skill.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.icon-habilidades {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  background-color: currentColor;
  -webkit-mask-image: url('~/assets/icons/habilidades.svg');
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}
</style>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import type { Skill } from '~/composables/usePortfolioApi'

const props = defineProps<{
  skills: Skill[]
}>()

const showModal = ref(false)
const modalRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

const previewSkills = computed(() => props.skills.slice(0, 6))

watch(showModal, async (val) => {
  if (val) {
    await nextTick()
    if (modalRef.value && panelRef.value) {
      gsap.timeline()
        .fromTo(modalRef.value, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power1.out' })
        .fromTo(panelRef.value, { opacity: 0, y: 20, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'expo.out' }, '-=0.1')
    }
  }
})

function closeModal() {
  if (modalRef.value && panelRef.value) {
    gsap.timeline({ onComplete: () => { showModal.value = false } })
      .to(panelRef.value, { opacity: 0, y: 15, scale: 0.97, duration: 0.2, ease: 'power2.in' })
      .to(modalRef.value, { opacity: 0, duration: 0.15 }, '-=0.1')
  } else {
    showModal.value = false
  }
}
</script>
