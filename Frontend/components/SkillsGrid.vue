<template>
  <div class="bg-surface rounded-3xl p-6 border border-border flex flex-col justify-between">
    <div>
      <div class="flex items-center gap-2 mb-5">
        <PhGear :size="24" weight="fill" class="text-text" />
        <h3 class="font-display small-caps text-lg text-text font-semibold">Habilidades</h3>
      </div>
      <div ref="gridRef" class="grid grid-cols-3 gap-3">
        <div
          v-for="skill in previewSkills"
          :key="skill.id"
          @click="selectedSkill = skill"
          class="icon-tile rounded-xl bg-surface p-3 border border-border flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer hover:border-primary hover:text-primary transition-colors group"
        >
          <span class="text-xs font-display small-caps text-text font-medium group-hover:text-primary transition-colors">{{ skill.name }}</span>
        </div>
      </div>
    </div>
    <button 
      v-if="skills.length > 6"
      @click="showModal = true" 
      class="mt-6 self-start px-5 py-2.5 rounded-full bg-primary text-background text-sm font-display small-caps tracking-wide hover:opacity-85 transition font-semibold cursor-pointer"
    >
      Ver Mais
    </button>

    <!-- Modal Habilidades (Todas) -->
    <Teleport to="body">
      <div 
        v-if="showModal" 
        ref="modalRef" 
        class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-black/60 p-4"
        @click.self="closeModal"
      >
        <div 
          ref="panelRef" 
          class="bg-background rounded-3xl w-full max-w-3xl max-h-[80vh] overflow-y-auto modal-scroll p-6 border border-border shadow-2xl"
        >
          <div class="mb-6 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <PhGear :size="24" weight="fill" class="text-text" />
              <h3 class="font-display small-caps text-lg text-text font-semibold">Habilidades</h3>
            </div>
            <button @click="closeModal" class="text-xl leading-none text-muted hover:text-text cursor-pointer p-1" aria-label="Fechar">✕</button>
          </div>
          <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
            <div 
              v-for="skill in skills" 
              :key="skill.id" 
              @click="selectedSkill = skill"
              class="icon-tile rounded-xl bg-surface p-3 border border-border flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer hover:border-primary hover:text-primary transition-colors group"
            >
              <span class="text-xs font-display small-caps text-text font-medium group-hover:text-primary transition-colors">{{ skill.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Detalhe da Habilidade -->
    <Teleport to="body">
      <div 
        v-if="selectedSkill" 
        class="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur bg-black/60 p-4"
        @click.self="selectedSkill = null"
      >
        <div class="bg-background rounded-3xl w-full max-w-lg p-8 border border-border shadow-2xl animate-in zoom-in-95 duration-200">
          <div class="flex justify-between items-start mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center">
                <PhGear :size="20" weight="fill" class="text-primary" />
              </div>
              <h4 class="font-display text-2xl small-caps text-text font-bold tracking-tight">{{ selectedSkill.name }}</h4>
            </div>
            <button @click="selectedSkill = null" class="text-2xl leading-none text-muted hover:text-text cursor-pointer p-1 transition-colors" aria-label="Fechar">✕</button>
          </div>
          <div class="prose prose-invert max-w-none">
            <p class="text-base text-text leading-relaxed whitespace-pre-line">{{ selectedSkill.desc }}</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { PhGear } from '@phosphor-icons/vue'
import { gsap } from 'gsap'
import type { Skill } from '~/composables/usePortfolioApi'

const props = defineProps<{
  skills: Skill[]
}>()

const showModal = ref(false)
const modalRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const selectedSkill = ref<Skill | null>(null)

const previewSkills = computed(() => props.skills.slice(0, 6))

useScrollStagger(gridRef, computed(() => previewSkills.value.length))

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
