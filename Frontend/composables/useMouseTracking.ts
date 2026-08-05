import { reactive, ref, onMounted, onUnmounted, type Ref } from 'vue'
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
