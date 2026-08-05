import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compDir = path.join(__dirname, 'composables');

const mouseTracking = `import { reactive, ref, onMounted, onUnmounted, type Ref } from 'vue'
import type { Point } from './types'

export function useMouseTracking(containerRef: Ref<HTMLElement | null>) {
  const mouseTarget = reactive<Point>({ x: 0, y: 0 })
  const isHovering = ref(false)

  const onMouseMove = (e: MouseEvent) => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    
    mouseTarget.x = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)))
    mouseTarget.y = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)))
  }

  const onMouseEnter = () => { isHovering.value = true }
  const onMouseLeave = () => { 
    isHovering.value = false 
    mouseTarget.x = 0
    mouseTarget.y = 0
  }

  onMounted(() => {
    if (typeof window !== 'undefined') window.addEventListener('mousemove', onMouseMove)
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') window.removeEventListener('mousemove', onMouseMove)
  })

  return { mouseTarget, isHovering, onMouseEnter, onMouseLeave }
}
`;

const blink = `import { ref } from 'vue'

export function useBlink() {
  const targetBlinkScale = ref(1)
  let nextBlinkTime = 0

  const updateBlink = (timestamp: number) => {
    if (nextBlinkTime === 0) nextBlinkTime = timestamp + 2000

    if (timestamp > nextBlinkTime) {
      targetBlinkScale.value = 0.1
      setTimeout(() => { targetBlinkScale.value = 1 }, 150)
      nextBlinkTime = timestamp + 3000 + Math.random() * 5000
    }
  }

  return { targetBlinkScale, updateBlink }
}
`;

const idleAnim = `export function useIdleAnimation() {
  const getIdleNoise = (timestamp: number) => {
    const time = timestamp * 0.001
    return {
      x: Math.sin(time * 2) * 1.5,
      y: Math.cos(time * 1.5) * 1.5,
      rot: Math.sin(time * 0.8) * 1,
      eyebrow: Math.sin(time * 3) * 1
    }
  }
  return { getIdleNoise }
}
`;

const avatarAnim = `import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { useMouseTracking } from './useMouseTracking'
import { useBlink } from './useBlink'
import { useIdleAnimation } from './useIdleAnimation'
import type { Point, Transform } from './types'

export function useAvatarAnimation() {
  const containerRef = ref<HTMLElement | null>(null)
  
  const { mouseTarget, isHovering, onMouseEnter, onMouseLeave } = useMouseTracking(containerRef)
  const { targetBlinkScale, updateBlink } = useBlink()
  const { getIdleNoise } = useIdleAnimation()

  const currentIrisL = reactive<Point>({ x: 0, y: 0 })
  const currentIrisR = reactive<Point>({ x: 0, y: 0 })
  const currentHead = reactive<Transform>({ x: 0, y: 0, r: 0, s: 1 })
  const currentEyebrow = reactive<Transform>({ x: 0, y: 0, r: 0, s: 1 })
  const currentMouth = reactive<Transform>({ x: 0, y: 0, r: 0, s: 1 })
  const currentBlinkScale = ref(1)

  let animationFrameId: number

  const lerp = (start: number, end: number, amt: number) => (1 - amt) * start + amt * end

  const loop = (timestamp: number) => {
    updateBlink(timestamp)
    const idle = getIdleNoise(timestamp)

    const targetHeadX = (mouseTarget.x * 12) + (isHovering.value ? 0 : idle.x)
    const targetHeadY = (mouseTarget.y * 12) + (isHovering.value ? 0 : idle.y)
    const targetHeadRot = (mouseTarget.x * 3) + (isHovering.value ? 0 : idle.rot)
    
    currentHead.x = lerp(currentHead.x, targetHeadX, 0.06)
    currentHead.y = lerp(currentHead.y, targetHeadY, 0.06)
    currentHead.r = lerp(currentHead.r, targetHeadRot, 0.06)

    const irisMaxDist = 14
    const targetIrisX = mouseTarget.x * irisMaxDist
    const targetIrisY = mouseTarget.y * irisMaxDist

    currentIrisL.x = lerp(currentIrisL.x, targetIrisX, 0.15)
    currentIrisL.y = lerp(currentIrisL.y, targetIrisY, 0.15)
    currentIrisR.x = lerp(currentIrisR.x, targetIrisX, 0.15)
    currentIrisR.y = lerp(currentIrisR.y, targetIrisY, 0.15)

    const targetEyebrowY = isHovering.value ? (mouseTarget.y < 0 ? -4 : 2) : idle.eyebrow
    const targetEyebrowRot = mouseTarget.x * 2
    currentEyebrow.y = lerp(currentEyebrow.y, targetEyebrowY, 0.1)
    currentEyebrow.r = lerp(currentEyebrow.r, targetEyebrowRot, 0.1)

    const targetMouthX = mouseTarget.x * 5
    const targetMouthY = mouseTarget.y * 3
    const targetMouthRot = mouseTarget.x * 2
    currentMouth.x = lerp(currentMouth.x, targetMouthX, 0.08)
    currentMouth.y = lerp(currentMouth.y, targetMouthY, 0.08)
    currentMouth.r = lerp(currentMouth.r, targetMouthRot, 0.08)

    currentBlinkScale.value = lerp(currentBlinkScale.value, targetBlinkScale.value, 0.3)

    animationFrameId = requestAnimationFrame(loop)
  }

  onMounted(() => {
    animationFrameId = requestAnimationFrame(loop)
  })

  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId)
  })

  return {
    containerRef,
    onMouseEnter,
    onMouseLeave,
    currentHead,
    currentIrisL,
    currentIrisR,
    currentEyebrow,
    currentMouth,
    currentBlinkScale
  }
}
`;

fs.writeFileSync(path.join(compDir, 'useMouseTracking.ts'), mouseTracking);
fs.writeFileSync(path.join(compDir, 'useBlink.ts'), blink);
fs.writeFileSync(path.join(compDir, 'useIdleAnimation.ts'), idleAnim);
fs.writeFileSync(path.join(compDir, 'useAvatarAnimation.ts'), avatarAnim);

console.log('Composables generated!');
