import { gsap } from 'gsap'

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return

  nuxtApp.hook('app:mounted', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isFinePointer = window.matchMedia('(pointer: fine)').matches

    if (!isFinePointer) {
      document.documentElement.classList.add('no-fine-pointer')
    }

    initStarfield({ reduceMotion })
    initCursorGlow({ enabled: isFinePointer && !reduceMotion })
    initMagneticButtons({ enabled: isFinePointer && !reduceMotion })
    // initScrollDots() is now handled natively by components/ui/ScrollSpy.vue
    initTimelineDraw({ reduceMotion })
  })
})

/* Starfield Canvas Background (Optimized 60 FPS) */
function initStarfield({ reduceMotion }: { reduceMotion: boolean }) {
  if (document.body.classList.contains('light')) return

  let canvas = document.getElementById('starfield') as HTMLCanvasElement | null
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.id = 'starfield'
    document.body.prepend(canvas)
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let stars: Array<{ x: number; y: number; r: number; baseAlpha: number; phase: number; speed: number }> = []
  let width = 0
  let height = 0

  function resize() {
    if (!canvas) return
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
    const density = Math.min(90, Math.floor((width * height) / 12000))
    stars = Array.from({ length: density }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.3,
      baseAlpha: Math.random() * 0.4 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.001 + 0.0005,
    }))
  }

  function draw(time: number) {
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#F1F0F7'
    
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i]
      const twinkle = reduceMotion ? s.baseAlpha : s.baseAlpha + Math.sin(time * s.speed + s.phase) * 0.15
      ctx.globalAlpha = Math.max(0.1, Math.min(0.8, twinkle))
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
    if (!reduceMotion) requestAnimationFrame(draw)
  }

  resize()
  window.addEventListener('resize', resize)
  requestAnimationFrame(draw)
}

/* Fast & Fluid Cursor Glow (0.15s duration) */
function initCursorGlow({ enabled }: { enabled: boolean }) {
  if (!enabled) return

  let glow = document.querySelector('.cursor-glow') as HTMLDivElement | null
  if (!glow) {
    glow = document.createElement('div')
    glow.className = 'cursor-glow'
    document.body.appendChild(glow)
  }

  const moveX = gsap.quickTo(glow, 'x', { duration: 0.15, ease: 'power2.out' })
  const moveY = gsap.quickTo(glow, 'y', { duration: 0.15, ease: 'power2.out' })

  window.addEventListener('mousemove', e => {
    moveX(e.clientX)
    moveY(e.clientY)
  })
}

/* Magnetic Buttons Attraction */
function initMagneticButtons({ enabled }: { enabled: boolean }) {
  if (!enabled) return

  const attachEvents = () => {
    const targets = document.querySelectorAll('[data-magnetic]')
    if (targets.length === 0) return

    targets.forEach(el => {
      const strength = 0.35
      const target = el as HTMLElement

      target.addEventListener('mousemove', e => {
        const rect = target.getBoundingClientRect()
        const relX = e.clientX - (rect.left + rect.width / 2)
        const relY = e.clientY - (rect.top + rect.height / 2)
        const x = relX * strength
        const y = relY * strength

        gsap.to(target, { x, y, duration: 0.25, ease: 'power2.out' })
      })

      target.addEventListener('mouseleave', () => {
        gsap.to(target, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' })
      })
    })
  }

  setTimeout(attachEvents, 300)
}

// Scroll-Spy Dots logic was removed in favor of components/ui/ScrollSpy.vue

/* Timeline Draw-Line */
function initTimelineDraw({ reduceMotion }: { reduceMotion: boolean }) {
  const setupTimeline = () => {
    const timeline = document.getElementById('experiences-timeline')
    if (!timeline) return

    let track = timeline.querySelector('.timeline-track') as HTMLDivElement | null
    if (!track) {
      track = document.createElement('div')
      track.className = 'timeline-track'
      const progress = document.createElement('div')
      progress.className = 'timeline-track__progress'
      track.appendChild(progress)
      timeline.prepend(track)
    }

    const progress = track.querySelector('.timeline-track__progress') as HTMLDivElement | null
    if (!progress) return

    if (reduceMotion) {
      progress.style.height = '100%'
      return
    }

    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger)
      gsap.to(progress, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: timeline,
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: 0.5,
        },
      })
    })
  }

  setTimeout(setupTimeline, 400)
}
