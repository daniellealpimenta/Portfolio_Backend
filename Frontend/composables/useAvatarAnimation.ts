import { ref, onMounted, onUnmounted, reactive } from 'vue'
import type { Point, Transform } from './types'

export function useAvatarAnimation() {
  const containerRef = ref<HTMLElement | null>(null)

  // Tracking mouse
  const mouseTarget = reactive<Point>({ x: 0, y: 0 })
  const isHovering = ref(false)

  // Lerp values
  const currentIrisL = reactive<Point>({ x: 0, y: 0 })
  const currentIrisR = reactive<Point>({ x: 0, y: 0 })
  const currentHead = reactive<Transform>({ x: 0, y: 0, r: 0, s: 1 })
  const currentEyebrow = reactive<Transform>({ x: 0, y: 0, r: 0, s: 1 })
  const currentMouth = reactive<Transform>({ x: 0, y: 0, r: 0, s: 1 })

  // Blink state
  const targetBlinkScale = ref(1)
  const currentBlinkScale = ref(1)
  let nextBlinkTime = 0

  let animationFrameId: number

  // Math utils
  const lerp = (start: number, end: number, amt: number) => {
    return (1 - amt) * start + amt * end
  }

  // Handle Mouse Move
  const onMouseMove = (e: MouseEvent) => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    // Normalize -1 to 1 based on container center
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    
    // Limits the mouse max influence relative to window to prevent extreme values
    mouseTarget.x = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)))
    mouseTarget.y = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)))
  }

  const onMouseEnter = () => { isHovering.value = true }
  const onMouseLeave = () => { 
    isHovering.value = false 
    mouseTarget.x = 0
    mouseTarget.y = 0
  }

  // Animation Loop
  const loop = (timestamp: number) => {
    // 1. Idle animation calculation
    const time = timestamp * 0.001
    const idleX = Math.sin(time * 2) * 1.5
    const idleY = Math.cos(time * 1.5) * 1.5
    const idleRot = Math.sin(time * 0.8) * 1

    // 2. Head Tracking
    const targetHeadX = (mouseTarget.x * 12) + (isHovering.value ? 0 : idleX)
    const targetHeadY = (mouseTarget.y * 12) + (isHovering.value ? 0 : idleY)
    const targetHeadRot = (mouseTarget.x * 3) + (isHovering.value ? 0 : idleRot)
    
    currentHead.x = lerp(currentHead.x, targetHeadX, 0.06)
    currentHead.y = lerp(currentHead.y, targetHeadY, 0.06)
    currentHead.r = lerp(currentHead.r, targetHeadRot, 0.06)

    // 3. Iris Tracking (clampped)
    const irisMaxDist = 8
    const targetIrisX = mouseTarget.x * irisMaxDist
    const targetIrisY = mouseTarget.y * irisMaxDist

    currentIrisL.x = lerp(currentIrisL.x, targetIrisX, 0.15)
    currentIrisL.y = lerp(currentIrisL.y, targetIrisY, 0.15)
    currentIrisR.x = lerp(currentIrisR.x, targetIrisX, 0.15)
    currentIrisR.y = lerp(currentIrisR.y, targetIrisY, 0.15)

    // 4. Eyebrows
    const targetEyebrowY = isHovering.value ? (mouseTarget.y < 0 ? -4 : 2) : Math.sin(time * 3) * 1
    const targetEyebrowRot = mouseTarget.x * 2
    currentEyebrow.y = lerp(currentEyebrow.y, targetEyebrowY, 0.1)
    currentEyebrow.r = lerp(currentEyebrow.r, targetEyebrowRot, 0.1)

    // 5. Mouth & Mustache
    const targetMouthX = mouseTarget.x * 5
    const targetMouthY = mouseTarget.y * 3
    const targetMouthRot = mouseTarget.x * 2
    currentMouth.x = lerp(currentMouth.x, targetMouthX, 0.08)
    currentMouth.y = lerp(currentMouth.y, targetMouthY, 0.08)
    currentMouth.r = lerp(currentMouth.r, targetMouthRot, 0.08)

    // 6. Blink Logic
    if (timestamp > nextBlinkTime) {
      targetBlinkScale.value = 0.1 // Fechar o olho
      // Agendar abrir o olho logo depois
      setTimeout(() => {
        targetBlinkScale.value = 1
      }, 150)
      
      // Próxima piscada entre 3s e 8s
      nextBlinkTime = timestamp + 3000 + Math.random() * 5000
    }
    
    currentBlinkScale.value = lerp(currentBlinkScale.value, targetBlinkScale.value, 0.3)

    animationFrameId = requestAnimationFrame(loop)
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', onMouseMove)
      nextBlinkTime = performance.now() + 2000
      animationFrameId = requestAnimationFrame(loop)
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
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
