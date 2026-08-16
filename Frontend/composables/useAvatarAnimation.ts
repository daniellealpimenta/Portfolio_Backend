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

  // Dizzy state — mouse se movendo continuamente por DIZZY_REQUIRED_TIME dentro de uma zona ao redor do avatar o deixa tonto
  const isDizzy = ref(false)
  const dizzyIntensity = ref(0) // 0-1, suavizado, controla o blend com a animação normal
  const dizzySpiralRot = ref(0) // graus, rotação contínua da espiral que substitui a íris
  const dizzyStars = reactive([
    { x: 0, y: 0, rot: 0, opacity: 0 },
    { x: 0, y: 0, rot: 0, opacity: 0 },
    { x: 0, y: 0, rot: 0, opacity: 0 },
  ])

  const DIZZY_RADIUS_FACTOR = 1.4   // raio da "zona" ao redor do avatar, em múltiplos do seu próprio tamanho
  const DIZZY_REQUIRED_TIME = 1500  // ms de movimento contínuo dentro da zona pra ficar tonto
  const DIZZY_MAX_GAP = 200         // ms — gap maior que isso entre eventos de mouse conta como "parou"
  const DIZZY_DURATION = 2800       // duração do estado tonto, em ms

  let zoneTime = 0        // ms acumulados de movimento contínuo dentro da zona
  let wasInZone = false
  let dizzyEndTime = 0
  let lastMoveTime = 0
  let lastFrameTime = 0

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

    // --- Cronômetro de tontura: mouse precisa se mover continuamente dentro da zona por DIZZY_REQUIRED_TIME ---
    const now = performance.now()
    if (!isDizzy.value) {
      const distFromCenter = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2)
      const avatarRadius = Math.max(rect.width, rect.height) * DIZZY_RADIUS_FACTOR
      const inZone = distFromCenter < avatarRadius

      if (inZone) {
        const gap = lastMoveTime > 0 ? now - lastMoveTime : Infinity
        if (wasInZone && gap < DIZZY_MAX_GAP) {
          zoneTime += gap
          if (zoneTime >= DIZZY_REQUIRED_TIME) {
            isDizzy.value = true
            dizzyEndTime = now + DIZZY_DURATION
          }
        } else {
          zoneTime = 0 // acabou de entrar na zona (ou voltou depois de uma pausa) — recomeça a contagem
        }
      } else {
        zoneTime = 0
      }
      wasInZone = inZone
    }
    lastMoveTime = now
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

    // 1b. Dizzy state machine (o gatilho em si acontece no onMouseMove, aqui só cuida do fim do efeito)
    const frameDt = lastFrameTime > 0 ? timestamp - lastFrameTime : 16
    lastFrameTime = timestamp

    if (isDizzy.value && timestamp > dizzyEndTime) {
      isDizzy.value = false
      zoneTime = 0
      wasInZone = false
    }

    dizzyIntensity.value = lerp(dizzyIntensity.value, isDizzy.value ? 1 : 0, 0.05)
    const d = dizzyIntensity.value

    // 2. Head Tracking (com blend pro giro de tontura)
    const trackHeadX = (mouseTarget.x * 12) + (isHovering.value ? 0 : idleX)
    const trackHeadY = (mouseTarget.y * 12) + (isHovering.value ? 0 : idleY)
    const trackHeadRot = (mouseTarget.x * 3) + (isHovering.value ? 0 : idleRot)

    const dizzyHeadX = Math.cos(time * 5) * 16
    const dizzyHeadY = Math.sin(time * 6.2) * 12
    const dizzyHeadRot = Math.sin(time * 4) * 14

    const targetHeadX = lerp(trackHeadX, dizzyHeadX, d)
    const targetHeadY = lerp(trackHeadY, dizzyHeadY, d)
    const targetHeadRot = lerp(trackHeadRot, dizzyHeadRot, d)

    currentHead.x = lerp(currentHead.x, targetHeadX, 0.06)
    currentHead.y = lerp(currentHead.y, targetHeadY, 0.06)
    currentHead.r = lerp(currentHead.r, targetHeadRot, 0.06)

    // 3. Iris Tracking (clampped, com blend pro giro de tontura)
    // Tonto: a íris centraliza (a espiral que substitui ela gira no próprio eixo, ver 3b)
    const irisMaxDist = 8
    const trackIrisX = mouseTarget.x * irisMaxDist
    const trackIrisY = mouseTarget.y * irisMaxDist

    const targetIrisX = lerp(trackIrisX, 0, d)
    const targetIrisY = lerp(trackIrisY, 0, d)

    currentIrisL.x = lerp(currentIrisL.x, targetIrisX, 0.15)
    currentIrisL.y = lerp(currentIrisL.y, targetIrisY, 0.15)
    currentIrisR.x = lerp(currentIrisR.x, targetIrisX, 0.15)
    currentIrisR.y = lerp(currentIrisR.y, targetIrisY, 0.15)

    // 3b. Espiral de tontura — gira continuamente, mais rápido quanto mais "tonto"
    dizzySpiralRot.value = (dizzySpiralRot.value + frameDt * 0.35 * (0.15 + d)) % 360

    // 4. Eyebrows (com blend pra flutter de tontura)
    const trackEyebrowY = isHovering.value ? (mouseTarget.y < 0 ? -4 : 2) : Math.sin(time * 3) * 1
    const trackEyebrowRot = mouseTarget.x * 2

    const dizzyEyebrowY = Math.sin(time * 10) * 5 - 3
    const dizzyEyebrowRot = Math.sin(time * 8) * 6

    const targetEyebrowY = lerp(trackEyebrowY, dizzyEyebrowY, d)
    const targetEyebrowRot = lerp(trackEyebrowRot, dizzyEyebrowRot, d)
    currentEyebrow.y = lerp(currentEyebrow.y, targetEyebrowY, 0.1)
    currentEyebrow.r = lerp(currentEyebrow.r, targetEyebrowRot, 0.1)

    // 5. Mouth & Mustache (com blend pra careta de tontura)
    const trackMouthX = mouseTarget.x * 5
    const trackMouthY = mouseTarget.y * 3
    const trackMouthRot = mouseTarget.x * 2

    const dizzyMouthX = Math.sin(time * 6) * 4
    const dizzyMouthY = Math.cos(time * 5) * 3 + 2
    const dizzyMouthRot = Math.cos(time * 7) * 8

    const targetMouthX = lerp(trackMouthX, dizzyMouthX, d)
    const targetMouthY = lerp(trackMouthY, dizzyMouthY, d)
    const targetMouthRot = lerp(trackMouthRot, dizzyMouthRot, d)
    currentMouth.x = lerp(currentMouth.x, targetMouthX, 0.08)
    currentMouth.y = lerp(currentMouth.y, targetMouthY, 0.08)
    currentMouth.r = lerp(currentMouth.r, targetMouthRot, 0.08)

    // 5b. Dizzy stars (orbitam acima da cabeça enquanto tonto)
    if (d > 0.01) {
      const starAngleBase = time * 4.2
      const starCenterX = 380
      const starCenterY = -10
      const starRadius = 46
      for (let i = 0; i < 3; i++) {
        const angle = starAngleBase + (i * (Math.PI * 2)) / 3
        dizzyStars[i].x = starCenterX + Math.cos(angle) * starRadius
        dizzyStars[i].y = starCenterY + Math.sin(angle) * starRadius * 0.6
        dizzyStars[i].rot = (angle * 60) % 360
        dizzyStars[i].opacity = d
      }
    } else {
      dizzyStars[0].opacity = 0
      dizzyStars[1].opacity = 0
      dizzyStars[2].opacity = 0
    }

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
    currentBlinkScale,
    isDizzy,
    dizzyIntensity,
    dizzySpiralRot,
    dizzyStars
  }
}
