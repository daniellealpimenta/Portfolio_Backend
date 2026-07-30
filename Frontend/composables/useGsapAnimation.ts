import { onMounted, onUnmounted, nextTick, type Ref } from 'vue'
import { gsap } from 'gsap'

let registered = false

export function initGsapPlugins() {
  if (import.meta.client && !registered) {
    if (typeof window !== 'undefined') {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)
        registered = true
      }).catch(() => {})
    }
  }
}

/**
 * Standardized Composable for GSAP Animations with Vue 3 Template Refs.
 * Automatically cleans up GSAP context (tweens, timelines, ScrollTriggers) on unmount.
 */
export function useGsap(
  scopeRef: Ref<HTMLElement | null>,
  animationFn: (ctx: gsap.Context) => void
) {
  let ctx: gsap.Context | null = null

  onMounted(async () => {
    initGsapPlugins()
    await nextTick()
    if (scopeRef.value) {
      ctx = gsap.context(() => {
        animationFn(ctx!)
      }, scopeRef.value)
    }
  })

  onUnmounted(() => {
    ctx?.revert()
  })

  return {
    get ctx() {
      return ctx
    }
  }
}
