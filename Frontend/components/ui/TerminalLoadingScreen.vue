<template>
  <div class="fixed inset-0 z-[999] flex items-center justify-center bg-[#0a0a0b] px-4">
    <div class="w-full max-w-2xl rounded-xl border border-white/15 bg-[#111113] shadow-2xl overflow-hidden">
      <div class="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
        <span class="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
        <span class="w-3 h-3 rounded-full bg-[#febc2e]"></span>
        <span class="w-3 h-3 rounded-full bg-[#28c840]"></span>
        <span class="ml-3 font-mono text-[11px] text-white/40 select-none">terminal</span>
      </div>
      <div class="p-5 font-mono text-[12px] md:text-[13px] leading-relaxed min-h-[20rem]">
        <div class="flex items-center gap-2 text-white/90">
          <span class="select-none text-white/40">$</span>
          <span>{{ typedCommand }}</span>
          <span v-if="isTypingCommand" class="inline-block w-[7px] h-[15px] bg-white/80 animate-pulse"></span>
        </div>
        <div class="mt-2 space-y-0.5">
          <div
            v-for="(line, i) in visibleLines"
            :key="i"
            :class="line.color || 'text-white/70'"
          >
            {{ line.text || ' ' }}
          </div>
        </div>
        <div v-if="!isTypingCommand" class="flex items-center gap-2 mt-2 text-white/90">
          <span class="select-none text-white/40">$</span>
          <span v-if="scriptDone" class="inline-block w-[7px] h-[15px] bg-white/80 animate-pulse"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = withDefaults(defineProps<{ username?: string }>(), {
  username: 'usuario'
})

const emit = defineEmits<{ complete: [] }>()

interface OutputLine {
  text: string
  color?: string
  delay: number
}
interface CommandBlock {
  command: string
  lines: OutputLine[]
}

const blocks = computed<CommandBlock[]>(() => [
  {
    command: `npm run start ${props.username}`,
    lines: [
      { text: 'Listening on http://localhost:3000', color: 'text-cyan-400', delay: 120 },
      { text: '✓ Carregando dados...', color: 'text-emerald-400', delay: 160 },
      { text: 'Pronto ✓', color: 'text-emerald-400', delay: 140 }
    ]
  }
])

const activeBlockIndex = ref(0)
const typedCommand = ref('')
const visibleLineCount = ref(0)
const isTypingCommand = ref(true)
const scriptDone = ref(false)

const visibleLines = computed(() =>
  blocks.value[activeBlockIndex.value]?.lines.slice(0, visibleLineCount.value) ?? []
)

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function runScript() {
  for (let b = 0; b < blocks.value.length; b++) {
    activeBlockIndex.value = b
    typedCommand.value = ''
    visibleLineCount.value = 0
    isTypingCommand.value = true

    const command = blocks.value[b].command
    for (let i = 0; i < command.length; i++) {
      typedCommand.value += command[i]
      await sleep(15)
    }
    await sleep(100)
    isTypingCommand.value = false

    const lines = blocks.value[b].lines
    for (let i = 0; i < lines.length; i++) {
      await sleep(lines[i].delay)
      visibleLineCount.value = i + 1
    }
  }
  scriptDone.value = true
  emit('complete')
}

onMounted(() => {
  runScript()
})
</script>
