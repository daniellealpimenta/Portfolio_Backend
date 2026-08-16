<template>
  <div class="space-y-3">
    <div
      v-for="(link, index) in modelValue"
      :key="link.id || `new-${index}`"
      class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center bg-background border border-border rounded-xl p-3"
    >
      <div class="w-full sm:w-40 shrink-0">
        <IconPicker v-model="link.icon" />
      </div>
      <input
        v-model="link.name"
        type="text"
        placeholder="Nome (ex: Repositório)"
        class="flex-1 bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-primary transition-colors"
      >
      <input
        v-model="link.url"
        type="url"
        placeholder="https://..."
        class="flex-1 bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-primary transition-colors"
      >
      <button
        type="button"
        @click="remove(index)"
        class="shrink-0 w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-muted hover:text-error hover:border-error transition-colors self-center"
        aria-label="Remover link"
      >
        ✕
      </button>
    </div>

    <button
      type="button"
      @click="add"
      class="w-full py-2.5 rounded-xl border border-dashed border-border text-sm text-muted hover:text-text hover:border-primary transition-colors"
    >
      + Adicionar link
    </button>
  </div>
</template>

<script setup lang="ts">
import IconPicker from '~/components/ui/IconPicker.vue'

export interface EditableProjectLink {
  id?: string
  name: string
  url: string
  icon: string
}

const modelValue = defineModel<EditableProjectLink[]>({ default: () => [] })

function add() {
  modelValue.value = [...modelValue.value, { name: '', url: '', icon: '' }]
}

function remove(index: number) {
  modelValue.value = modelValue.value.filter((_, i) => i !== index)
}
</script>
