<template>
  <div>
    <button
      type="button"
      @click="open = true"
      class="w-full flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-3 text-text hover:border-primary transition-colors"
    >
      <span class="w-6 h-6 flex items-center justify-center shrink-0">
        <IconRenderer :icon="modelValue" :size="22" />
      </span>
      <span class="text-sm text-muted truncate">{{ modelValue ? iconLabel(modelValue) : 'Escolher ícone...' }}</span>
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-black/60 p-4"
        @click.self="open = false"
      >
        <div class="bg-background rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col border border-border shadow-2xl overflow-hidden">
          <div class="p-4 border-b border-border flex items-center justify-between shrink-0">
            <h3 class="font-display small-caps text-text font-semibold">Escolher ícone</h3>
            <button @click="open = false" class="text-xl leading-none text-muted hover:text-text cursor-pointer p-1" aria-label="Fechar">✕</button>
          </div>

          <div class="flex gap-2 px-4 pt-4 shrink-0">
            <button
              type="button"
              @click="tab = 'custom'"
              class="px-4 py-2 rounded-full text-xs font-display small-caps tracking-wide font-semibold transition-colors"
              :class="tab === 'custom' ? 'bg-primary text-background' : 'bg-surface text-muted hover:text-text'"
            >
              Marcas
            </button>
            <button
              type="button"
              @click="tab = 'system'"
              class="px-4 py-2 rounded-full text-xs font-display small-caps tracking-wide font-semibold transition-colors"
              :class="tab === 'system' ? 'bg-primary text-background' : 'bg-surface text-muted hover:text-text'"
            >
              Ícones do sistema
            </button>
          </div>

          <div v-if="tab === 'system'" class="px-4 pt-4 shrink-0">
            <input
              v-model="query"
              type="text"
              placeholder="Buscar ícone (ex: github, link, seta...)"
              class="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-primary transition-colors"
            >
          </div>

          <div class="flex-1 overflow-y-auto modal-scroll p-4">
            <div v-if="tab === 'custom'" class="grid grid-cols-5 sm:grid-cols-6 gap-2">
              <button
                v-for="file in customIcons"
                :key="file"
                type="button"
                @click="select(`custom:${file}`)"
                class="aspect-square rounded-xl border border-border bg-surface p-2.5 flex items-center justify-center text-text hover:border-primary transition-colors"
                :class="modelValue === `custom:${file}` ? 'border-primary ring-2 ring-primary/30' : ''"
                :title="file"
              >
                <span
                  class="icon-mask w-full h-full"
                  :style="{ WebkitMaskImage: `url(/icons/${file})`, maskImage: `url(/icons/${file})` }"
                  role="img"
                  :aria-label="file"
                ></span>
              </button>
            </div>

            <div v-else>
              <p v-if="!query" class="text-xs text-muted mb-3">Sugestões — digite acima para buscar entre os {{ totalPhosphorCount }} ícones do sistema.</p>
              <p v-else class="text-xs text-muted mb-3">{{ filteredPhosphorNames.length }} resultado(s) para "{{ query }}"</p>

              <div class="grid grid-cols-5 sm:grid-cols-6 gap-2">
                <button
                  v-for="name in visiblePhosphorNames"
                  :key="name"
                  type="button"
                  @click="select(`phosphor:${name}`)"
                  class="aspect-square rounded-xl border border-border bg-surface p-2.5 flex items-center justify-center hover:border-primary transition-colors"
                  :class="modelValue === `phosphor:${name}` ? 'border-primary ring-2 ring-primary/30' : ''"
                  :title="name.replace(/^Ph/, '')"
                >
                  <component :is="phosphorIcons[name]" :size="22" class="text-text" />
                </button>
              </div>

              <p v-if="query && filteredPhosphorNames.length === 0" class="text-sm text-muted text-center py-8">
                Nenhum ícone encontrado para "{{ query }}".
              </p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import * as phosphorIcons from '@phosphor-icons/vue'
import IconRenderer from '~/components/ui/IconRenderer.vue'

const modelValue = defineModel<string>({ default: '' })

const open = ref(false)
const tab = ref<'custom' | 'system'>('custom')
const query = ref('')

// Ícones de marca custom, servidos estaticamente em /public/icons
const customIcons = [
  'github-logo.png',
  'linkedin-logo.svg',
  'instagram-logo.svg',
  'whatsapp-logo.svg',
  'figma-logo.svg',
  'excalidraw-logo.svg',
  'medium-logo.svg',
  'pinterest-logo.svg',
  'youtube-logo.svg',
  'app-store-ios-logo.svg',
  'discord-logo.svg'
]

// Sugestões exibidas antes de o usuário buscar algo
const suggestedPhosphorNames = [
  'PhGithubLogo', 'PhLinkedinLogo', 'PhGlobe', 'PhRocketLaunch', 'PhPlayCircle',
  'PhArrowSquareOut', 'PhPackage', 'PhFileText', 'PhNotebook', 'PhYoutubeLogo',
  'PhFigmaLogo', 'PhXLogo', 'PhInstagramLogo', 'PhWhatsappLogo', 'PhDownloadSimple',
  'PhBookOpen', 'PhLink', 'PhAppStoreLogo', 'PhGooglePlayLogo', 'PhBehanceLogo'
]

const allPhosphorNames = Object.keys(phosphorIcons).filter(k => k.startsWith('Ph'))
const totalPhosphorCount = allPhosphorNames.length

const filteredPhosphorNames = computed(() => {
  if (!query.value.trim()) return suggestedPhosphorNames
  const q = query.value.trim().toLowerCase()
  return allPhosphorNames.filter(name => name.slice(2).toLowerCase().includes(q))
})

// Limita o grid renderizado por vez pra não pesar com termos de busca muito genéricos
const visiblePhosphorNames = computed(() => filteredPhosphorNames.value.slice(0, 120))

function iconLabel(icon: string): string {
  if (icon.startsWith('custom:')) return icon.replace('custom:', '')
  if (icon.startsWith('phosphor:')) return icon.replace('phosphor:', '').replace(/^Ph/, '')
  return icon
}

function select(icon: string) {
  modelValue.value = icon
  open.value = false
}
</script>
