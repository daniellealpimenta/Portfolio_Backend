<template>
  <div
    ref="containerRef"
    class="w-full min-h-[700px] h-[80vh] flex flex-col items-center justify-center bg-transparent overflow-hidden relative"
    @click="handleContainerClick"
  >
    <div class="relative w-full max-w-4xl h-full flex items-center justify-center">
      <div
        ref="orbitRef"
        class="absolute w-full h-full flex items-center justify-center"
        :style="{
          perspective: '1000px',
          transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`
        }"
      >
        <!-- Center Pulsing Core -->
        <div class="absolute w-16 h-16 rounded-full bg-gradient-to-br from-primary via-secondary to-success animate-pulse flex items-center justify-center z-10">
          <div class="absolute w-20 h-20 rounded-full border border-text/20 animate-ping opacity-70"></div>
          <div class="absolute w-24 h-24 rounded-full border border-text/10 animate-ping opacity-50" style="animation-delay: 0.5s"></div>
          <div class="w-8 h-8 rounded-full bg-text/80 backdrop-blur-md"></div>
        </div>

        <!-- Orbit Ring -->
        <div class="absolute w-[32rem] h-[32rem] rounded-full border-2 border-dashed border-border/40"></div>

        <!-- Timeline Orbit Nodes -->
        <div
          v-for="(item, index) in timelineData"
          :key="item.id"
          :ref="el => nodeRefs[item.id] = el as HTMLDivElement"
          class="absolute transition-all duration-700 cursor-pointer"
          :style="getNodeStyle(index, timelineData.length, item.id)"
          @click.stop="toggleItem(item.id)"
        >
          <!-- Pulse aura behind node -->
          <div
            v-if="pulseEffect[item.id]"
            class="absolute rounded-full -inset-1 animate-pulse duration-1000"
            :style="{
              background: `radial-gradient(circle, rgba(168,192,240,0.4) 0%, rgba(168,192,240,0) 70%)`,
              width: `${item.energy * 0.5 + 40}px`,
              height: `${item.energy * 0.5 + 40}px`,
              left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
              top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`
            }"
          ></div>

          <!-- Node Icon Badge -->
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 transform"
            :class="[
              expandedItems[item.id]
                ? 'bg-text text-background border-text shadow-lg shadow-primary/30 scale-150'
                : isRelatedToActive(item.id)
                ? 'bg-text/50 text-background border-text animate-pulse'
                : 'bg-surface text-text border-text/40'
            ]"
          >
            <component :is="item.icon" :size="16" weight="fill" />
          </div>

          <!-- Node Title -->
          <div
            class="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold tracking-wider font-display small-caps transition-all duration-300"
            :class="expandedItems[item.id] ? 'text-text scale-125' : 'text-text/70'"
          >
            {{ item.title }}
          </div>

          <!-- Expanded Node Card Popover -->
          <div
            v-if="expandedItems[item.id]"
            class="absolute top-20 left-1/2 -translate-x-1/2 w-64 bg-surface/95 backdrop-blur-lg border border-text/30 rounded-2xl p-4 shadow-xl z-50 overflow-visible text-text"
            @click.stop
          >
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-text/50"></div>
            
            <div class="flex justify-between items-center pb-2">
              <span
                class="px-2 py-0.5 text-[10px] rounded-full font-display small-caps font-semibold"
                :class="getStatusStyles(item.status)"
              >
                {{ item.status === 'completed' ? 'CONCLUÍDO' : item.status === 'in-progress' ? 'EM ANDAMENTO' : 'PLANEJADO' }}
              </span>
              <span class="text-[11px] font-mono text-muted">{{ item.date }}</span>
            </div>

            <h4 class="text-sm font-display small-caps font-semibold mt-1 text-text">{{ item.title }}</h4>
            <p class="text-xs text-muted mt-2 leading-relaxed">{{ item.content }}</p>

            <!-- Energy Bar -->
            <div class="mt-4 pt-3 border-t border-text/10">
              <div class="flex justify-between items-center text-xs mb-1">
                <span class="flex items-center gap-1 text-muted">
                  <PhLightning :size="10" weight="fill" /> Nível de Domínio
                </span>
                <span class="font-mono text-primary">{{ item.energy }}%</span>
              </div>
              <div class="w-full h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-primary to-success transition-all duration-500"
                  :style="{ width: `${item.energy}%` }"
                ></div>
              </div>
            </div>

            <!-- Connected Nodes -->
            <div v-if="item.relatedIds.length > 0" class="mt-4 pt-3 border-t border-text/10">
              <div class="flex items-center mb-2 gap-1 text-muted text-[11px]">
                <PhLink :size="10" weight="fill" />
                <span class="uppercase tracking-wider font-medium">Nós Conectados</span>
              </div>
              <div class="flex flex-wrap gap-1">
                <button
                  v-for="relId in item.relatedIds"
                  :key="relId"
                  @click.stop="toggleItem(relId)"
                  class="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border border-text/20 bg-background/50 hover:bg-primary hover:text-background transition-all font-display small-caps"
                >
                  {{ getRelatedItemTitle(relId) }}
                  <PhArrowRight :size="8" weight="fill" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, type Component } from 'vue'
import { PhArrowRight, PhLink, PhLightning } from '@phosphor-icons/vue'

export interface TimelineItem {
  id: number
  title: string
  date: string
  content: string
  category: string
  icon: Component
  relatedIds: number[]
  status: 'completed' | 'in-progress' | 'pending'
  energy: number
}

const props = defineProps<{
  timelineData: TimelineItem[]
}>()

const expandedItems = ref<Record<number, boolean>>({})
const rotationAngle = ref<number>(0)
const autoRotate = ref<boolean>(true)
const pulseEffect = ref<Record<number, boolean>>({})
const centerOffset = ref<{ x: number; y: number }>({ x: 0, y: 0 })
const activeNodeId = ref<number | null>(null)

const containerRef = ref<HTMLDivElement | null>(null)
const orbitRef = ref<HTMLDivElement | null>(null)
const nodeRefs = ref<Record<number, HTMLDivElement | null>>({})

let animFrameId: number | null = null
let lastTime = 0

onMounted(() => {
  if (autoRotate.value) {
    startRotation()
  }
})

onUnmounted(() => {
  stopRotation()
})

function startRotation() {
  stopRotation()
  lastTime = performance.now()
  const step = (time: number) => {
    const delta = time - lastTime
    lastTime = time
    if (autoRotate.value) {
      rotationAngle.value = (rotationAngle.value + (delta * 0.015)) % 360
    }
    animFrameId = requestAnimationFrame(step)
  }
  animFrameId = requestAnimationFrame(step)
}

function stopRotation() {
  if (animFrameId !== null) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }
}

function handleContainerClick(e: MouseEvent) {
  if (e.target === containerRef.value || e.target === orbitRef.value) {
    expandedItems.value = {}
    activeNodeId.value = null
    pulseEffect.value = {}
    autoRotate.value = true
  }
}

function toggleItem(id: number) {
  const currentState = expandedItems.value[id]
  const newExpanded: Record<number, boolean> = {}

  if (!currentState) {
    newExpanded[id] = true
    activeNodeId.value = id
    autoRotate.value = false

    const related = getRelatedItems(id)
    const newPulse: Record<number, boolean> = {}
    related.forEach(relId => {
      newPulse[relId] = true
    })
    pulseEffect.value = newPulse

    centerViewOnNode(id)
  } else {
    activeNodeId.value = null
    autoRotate.value = true
    pulseEffect.value = {}
  }

  expandedItems.value = newExpanded
}

function centerViewOnNode(nodeId: number) {
  const index = props.timelineData.findIndex(item => item.id === nodeId)
  if (index === -1) return
  const total = props.timelineData.length
  const targetAngle = (index / total) * 360
  rotationAngle.value = (270 - targetAngle + 360) % 360
}

function calculateNodePosition(index: number, total: number) {
  const angle = ((index / total) * 360 + rotationAngle.value) % 360
  const radius = 256 // Increased from 200 to match larger ring
  const radian = (angle * Math.PI) / 180

  const x = radius * Math.cos(radian) + centerOffset.value.x
  const y = radius * Math.sin(radian) + centerOffset.value.y

  const zIndex = Math.round(100 + 50 * Math.cos(radian))
  const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)))

  return { x, y, zIndex, opacity }
}

function getNodeStyle(index: number, total: number, itemId: number) {
  const pos = calculateNodePosition(index, total)
  const isExpanded = expandedItems.value[itemId]
  return {
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    zIndex: isExpanded ? 200 : pos.zIndex,
    opacity: isExpanded ? 1 : pos.opacity
  }
}

function getRelatedItems(itemId: number): number[] {
  const current = props.timelineData.find(item => item.id === itemId)
  return current ? current.relatedIds : []
}

function isRelatedToActive(itemId: number): boolean {
  if (!activeNodeId.value) return false
  return getRelatedItems(activeNodeId.value).includes(itemId)
}

function getRelatedItemTitle(id: number): string {
  const found = props.timelineData.find(item => item.id === id)
  return found ? found.title : `Nó ${id}`
}

function getStatusStyles(status: TimelineItem['status']): string {
  switch (status) {
    case 'completed': return 'bg-success text-background'
    case 'in-progress': return 'bg-primary text-background'
    case 'pending': return 'bg-border text-text'
    default: return 'bg-border text-text'
  }
}
</script>
