import { nextTick, watch, type Ref } from 'vue'
import { gsap } from 'gsap'
import { initGsapPlugins } from './useGsapAnimation'

/**
 * Anima os filhos diretos de containerRef com stagger quando o container entra na
 * viewport. Disparado quando `length` sai de 0 para >0 — os dados desses grids vêm
 * de uma API assíncrona, então os itens não existem ainda no mount do componente.
 */
export function useScrollStagger(
  containerRef: Ref<HTMLElement | null>,
  length: Ref<number>,
  options: { stagger?: number; y?: number; duration?: number; start?: string } = {}
) {
  const { stagger = 0.06, y = 20, duration = 0.5, start = 'top 88%' } = options

  watch(length, async (len, prevLen) => {
    if (len > 0 && !prevLen) {
      initGsapPlugins()
      await nextTick()
      if (!containerRef.value) return
      const children = containerRef.value.children
      if (!children.length) return

      gsap.fromTo(children,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: 'power2.out',
          scrollTrigger: { trigger: containerRef.value, start }
        }
      )
    }
  }, { immediate: true })
}
