<template>
  <span
    v-if="isCustom"
    class="icon-mask shrink-0"
    :style="{
      width: typeof size === 'number' ? `${size}px` : size,
      height: typeof size === 'number' ? `${size}px` : size,
      WebkitMaskImage: `url(/icons/${customFilename})`,
      maskImage: `url(/icons/${customFilename})`
    }"
    role="img"
    :aria-label="alt"
  ></span>
  <component :is="resolvedComponent" v-else :size="size" :weight="weight" />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { PhLink } from '@phosphor-icons/vue'

const props = withDefaults(defineProps<{
  icon: string | null | undefined // "custom:<filename>" | "phosphor:<IconName>"
  size?: number | string
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
  alt?: string
}>(), {
  size: 20,
  weight: 'regular',
  alt: ''
})

const isCustom = computed(() => !!props.icon?.startsWith('custom:'))
const customFilename = computed(() => props.icon?.replace('custom:', '') ?? '')

// Carrega o componente Phosphor sob demanda (por nome), em vez de empacotar a biblioteca inteira
// (que tem ~1500 ícones) em todo lugar que renderiza um único ícone.
const asyncCache = new Map<string, ReturnType<typeof defineAsyncComponent>>()

const resolvedComponent = computed(() => {
  const name = props.icon?.startsWith('phosphor:') ? props.icon.replace('phosphor:', '') : ''
  if (!name) return PhLink

  if (!asyncCache.has(name)) {
    asyncCache.set(name, defineAsyncComponent({
      loader: () =>
        import(`@phosphor-icons/vue/dist/icons/${name}.vue.mjs`)
          .then((m: any) => m.default)
          .catch(() => PhLink),
      errorComponent: PhLink
    }))
  }
  return asyncCache.get(name)
})
</script>
