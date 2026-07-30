<template>
  <div ref="containerRef">
    <!-- HERO SECTION -->
    <section 
      data-section="Início"
      class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-start gap-10 md:gap-14 pb-24"
    >
      <div ref="heroAvatarRef" class="relative shrink-0">
        <div class="aurora"></div>
        <svg width="150" height="150" viewBox="0 0 150 150" fill="none" stroke="#F1F0F7" stroke-width="1.4">
          <circle cx="75" cy="55" r="30" />
          <path d="M45 60c0 10 5 18 8 20M105 60c0 10-5 18-8 20"/>
          <path d="M40 120c2-22 15-34 35-34s33 12 35 34" />
          <path d="M60 86l15 14 15-14" />
        </svg>
      </div>
      <div class="max-w-xl">
        <span class="eyebrow hero-kicker">Dev Full Stack &amp; Mobile</span>
        <h1 ref="heroTitleRef" class="font-display hero-statement font-semibold text-paper">
          Código com propósito<span class="cursor-blink"></span>
        </h1>
        <p ref="heroSubRef" class="mt-5 ink-muted leading-relaxed">
          Desenvolvedor freelancer especializado em aplicativos mobile, sistemas web
          e automações sob medida. Aluno de Engenharia de Software, apaixonado por
          transformar problemas reais em produtos bem construídos.
        </p>
        <NuxtLink 
          ref="heroBtnRef"
          to="/resume#about" 
          data-magnetic
          class="inline-block mt-6 px-5 py-2.5 rounded-full bg-periwinkle text-navy text-sm font-display small-caps tracking-wide hover:opacity-85 transition font-semibold"
        >
          Sobre Mim
        </NuxtLink>
      </div>
    </section>

    <!-- WORK PREVIEW SECTION WITH SPOTLIGHT GLOW CARDS -->
    <section 
      data-section="Projetos"
      ref="workSectionRef" 
      class="max-w-6xl mx-auto px-6 pb-24"
    >
      <div class="flex items-end justify-between mb-6">
        <h2 class="font-display text-2xl small-caps text-paper font-semibold">Projetos Recentes</h2>
        <NuxtLink to="/work" class="text-xs font-display small-caps ink-muted hover:text-paper transition">Ver todos →</NuxtLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <GlowCard
          v-for="(project, index) in featuredProjects"
          :key="project.id"
          :glow-color="getGlowColor(index)"
          custom-size
          class="cursor-pointer transition-transform hover:-translate-y-1"
          @click="selectedProject = project"
        >
          <div class="flex flex-col justify-between h-full p-2">
            <div>
              <div class="rounded-xl bg-navypanel h-32 mb-3 relative overflow-hidden flex items-center justify-center border ink-border">
                <span class="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full text-navy font-display small-caps font-semibold bg-periwinkle">
                  {{ project.cat }}
                </span>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8FA0C4" stroke-width="1.2" opacity="0.6">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div class="flex items-center justify-between text-xs ink-muted">
                <span>{{ project.year }}</span>
                <span class="flex items-center gap-1">❤️ {{ project.likes }}</span>
              </div>
              <p class="font-display text-base mt-2 small-caps text-paper font-semibold">{{ project.title }}</p>
            </div>
            <p class="text-xs ink-muted mt-3 line-clamp-3 leading-relaxed">{{ project.desc }}</p>
          </div>
        </GlowCard>
      </div>
    </section>

    <!-- TOOLS & SKILLS SECTION -->
    <section 
      data-section="Ferramentas"
      ref="toolsSectionRef" 
      class="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-8"
    >
      <ToolsGrid :tools="tools" />
      <SkillsGrid :skills="skills" />
    </section>

    <!-- TESTIMONIALS SECTION -->
    <section 
      data-section="Depoimentos"
      ref="testimonialsSectionRef" 
      class="max-w-4xl mx-auto px-6 pb-24 space-y-14"
    >
      <h2 class="font-display text-2xl small-caps text-paper font-semibold text-center mb-8">Depoimentos</h2>
      <TestimonialList :testimonials="testimonials" />
    </section>

    <!-- CONTACT SECTION -->
    <section data-section="Contato">
      <ContactForm />
    </section>

    <!-- PROJECT MODAL -->
    <ProjectModal 
      :project="selectedProject" 
      :is-open="!!selectedProject" 
      @close="selectedProject = null" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { gsap } from 'gsap'
import { usePortfolioApi, type Project } from '~/composables/usePortfolioApi'
import GlowCard from '~/components/ui/GlowCard.vue'

const { projects, tools, skills, testimonials, loadData } = usePortfolioApi()

const selectedProject = ref<Project | null>(null)
const featuredProjects = computed(() => projects.value.slice(0, 3))

function getGlowColor(index: number): 'blue' | 'purple' | 'green' {
  const colors: ('blue' | 'purple' | 'green')[] = ['purple', 'blue', 'green']
  return colors[index % colors.length]
}

const containerRef = ref<HTMLElement | null>(null)
const heroAvatarRef = ref<HTMLElement | null>(null)
const heroTitleRef = ref<HTMLElement | null>(null)
const heroSubRef = ref<HTMLElement | null>(null)
const heroBtnRef = ref<HTMLElement | null>(null)

const workSectionRef = ref<HTMLElement | null>(null)
const toolsSectionRef = ref<HTMLElement | null>(null)
const testimonialsSectionRef = ref<HTMLElement | null>(null)

useGsap(containerRef, () => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  if (heroAvatarRef.value) {
    tl.fromTo(heroAvatarRef.value, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.8 })
  }
  if (heroTitleRef.value) {
    tl.fromTo(heroTitleRef.value, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
  }
  if (heroSubRef.value) {
    tl.fromTo(heroSubRef.value, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
  }
  if (heroBtnRef.value) {
    tl.fromTo(heroBtnRef.value, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
  }

  if (workSectionRef.value) {
    gsap.fromTo(workSectionRef.value, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: workSectionRef.value, start: 'top 85%' }
    })
  }

  if (toolsSectionRef.value) {
    gsap.fromTo(toolsSectionRef.value, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: toolsSectionRef.value, start: 'top 85%' }
    })
  }

  if (testimonialsSectionRef.value) {
    gsap.fromTo(testimonialsSectionRef.value, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: testimonialsSectionRef.value, start: 'top 85%' }
    })
  }
})

onMounted(() => {
  loadData()
})
</script>
