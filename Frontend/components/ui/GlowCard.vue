<template>
  <div
    ref="cardRef"
    data-glow
    :style="inlineStyles"
    :class="[
      sizeClasses,
      !customSize ? 'aspect-[3/4]' : '',
      'rounded-2xl relative grid grid-rows-[1fr_auto] shadow-[0_1rem_2rem_-1rem_black] p-4 gap-4 backdrop-blur-[5px] transition-all duration-300',
      className
    ]"
    @pointermove="handlePointerMove"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
  >
    <div ref="innerRef" data-glow></div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export interface GlowCardProps {
  className?: string
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange'
  size?: 'sm' | 'md' | 'lg'
  width?: string | number
  height?: string | number
  customSize?: boolean
}

const props = withDefaults(defineProps<GlowCardProps>(), {
  className: '',
  glowColor: 'blue',
  size: 'md',
  customSize: false
})

const cardRef = ref<HTMLDivElement | null>(null)
const innerRef = ref<HTMLDivElement | null>(null)
const isHovered = ref(false)

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 }
}

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96'
}

function handlePointerEnter() {
  isHovered.value = true
}

function handlePointerLeave() {
  isHovered.value = false
}

function handlePointerMove(e: PointerEvent) {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  cardRef.value.style.setProperty('--x', x.toFixed(2))
  cardRef.value.style.setProperty('--xp', (x / rect.width).toFixed(2))
  cardRef.value.style.setProperty('--y', y.toFixed(2))
  cardRef.value.style.setProperty('--yp', (y / rect.height).toFixed(2))
}

const sizeClasses = computed(() => {
  if (props.customSize) return ''
  return sizeMap[props.size] || ''
})

const inlineStyles = computed(() => {
  const { base, spread } = glowColorMap[props.glowColor] || glowColorMap.blue
  const baseStyles: Record<string, any> = {
    '--base': base,
    '--spread': spread,
    '--radius': '14',
    '--border': '2',
    '--backdrop': 'hsl(0 0% 60% / 0.12)',
    '--backup-border': 'var(--backdrop)',
    '--size': '220',
    '--outer': '1',
    '--border-size': 'calc(var(--border, 2) * 1px)',
    '--spotlight-size': 'calc(var(--size, 220) * 1px)',
    '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
    '--opacity': isHovered.value ? '1' : '0',
    '--border-spot-opacity': isHovered.value ? '1' : '0',
    '--border-light-opacity': isHovered.value ? '1' : '0',
    '--bg-spot-opacity': isHovered.value ? '0.15' : '0',
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0)), transparent
    )`,
    backgroundColor: 'var(--backdrop, transparent)',
    backgroundSize: '100% 100%',
    backgroundPosition: '50% 50%',
    border: 'var(--border-size) solid var(--backup-border)',
    position: 'relative',
    touchAction: 'none',
    transition: 'border-color 0.3s ease, background-color 0.3s ease'
  }

  if (props.width !== undefined) {
    baseStyles.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  if (props.height !== undefined) {
    baseStyles.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }

  return baseStyles
})
</script>

<style>
[data-glow]::before,
[data-glow]::after {
  pointer-events: none;
  content: "";
  position: absolute;
  inset: calc(var(--border-size, 2px) * -1);
  border: var(--border-size, 2px) solid transparent;
  border-radius: calc(var(--radius, 14) * 1px);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
  mask-clip: padding-box, border-box;
  mask-composite: intersect;
  -webkit-mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
  -webkit-mask-clip: padding-box, border-box;
  -webkit-mask-composite: destination-in;
  opacity: var(--opacity, 0);
  transition: opacity 0.25s ease;
}

[data-glow]::before {
  background-image: radial-gradient(
    calc(var(--spotlight-size, 220px) * 0.75) calc(var(--spotlight-size, 220px) * 0.75) at
    calc(var(--x, 0) * 1px)
    calc(var(--y, 0) * 1px),
    hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)), transparent 100%
  );
  filter: brightness(2);
}

[data-glow]::after {
  background-image: radial-gradient(
    calc(var(--spotlight-size, 220px) * 0.5) calc(var(--spotlight-size, 220px) * 0.5) at
    calc(var(--x, 0) * 1px)
    calc(var(--y, 0) * 1px),
    hsl(0 100% 100% / var(--border-light-opacity, 1)), transparent 100%
  );
}

[data-glow] [data-glow] {
  position: absolute;
  inset: 0;
  will-change: filter;
  opacity: var(--opacity, 0);
  border-radius: calc(var(--radius, 14) * 1px);
  border-width: calc(var(--border-size, 2px) * 20);
  filter: blur(calc(var(--border-size, 2px) * 10));
  background: none;
  pointer-events: none;
  border: none;
  transition: opacity 0.25s ease;
}

[data-glow] > [data-glow]::before {
  inset: -10px;
  border-width: 10px;
}
</style>
