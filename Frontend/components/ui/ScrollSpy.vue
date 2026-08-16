<template>
  <div v-if="sections.length > 0" class="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3">
    <div
      v-for="(section, index) in sections"
      :key="index"
      class="group relative flex items-center justify-center cursor-pointer p-2"
      @click="scrollTo(section.id)"
    >
      <div
        class="w-2 h-2 rounded-full transition-all duration-300 bg-text"
        :class="activeSection === section.id ? 'scale-[1.8] opacity-100 bg-primary shadow-[0_0_8px_rgba(143,160,196,0.6)]' : 'opacity-30 hover:opacity-70'"
      ></div>
      <span
        class="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-display small-caps text-text pointer-events-none px-2 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/5 shadow-sm"
      >
        {{ section.name }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Section {
  id: string
  name: string
}

const sections = ref<Section[]>([])
const activeSection = ref<string>('')
let observer: IntersectionObserver | null = null

onMounted(() => {
  // Give the DOM a tiny moment to render the sections (especially if there's GSAP loading them)
  setTimeout(() => {
    const sectionElements = document.querySelectorAll('[data-section]')
    
    const newSections: Section[] = []
    sectionElements.forEach((el, i) => {
      if (!el.id) {
        el.id = `section-${i}`
      }
      newSections.push({
        id: el.id,
        name: el.getAttribute('data-section') || ''
      })
    })
    sections.value = newSections

    observer = new IntersectionObserver((entries) => {
      // Find the currently intersecting entry
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    }, {
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0
    })

    sectionElements.forEach(el => observer?.observe(el))
  }, 300)
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>
