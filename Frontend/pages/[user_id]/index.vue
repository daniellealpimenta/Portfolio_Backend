<template>
  <div ref="containerRef">
    <!-- HERO SECTION -->
    <section 
      id="inicio"
      data-section="Início"
      class="relative w-full pb-24 pt-12 md:pt-20 overflow-visible md:overflow-hidden"
    >
      <!-- BACKGROUND FULL WIDTH -->
      <div class="absolute inset-0 z-0 opacity-[0.20] text-primary pointer-events-none flex items-start justify-center">
        <!-- SVG esticado na largura total (w-full ou w-[120vw]) e com altura fixa menor -->
        <HeroBackground class="w-[150vw] md:w-[120vw] h-[250px] md:h-[300px] object-cover" />
      </div>

      <!-- CONTEÚDO CENTRALIZADO -->
      <div class="relative z-10 max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center gap-12 md:gap-20">
        <div ref="heroAvatarRef" class="relative shrink-0 w-[200px] md:w-[250px] aspect-square flex items-center justify-center mt-12 md:mt-0">
          <div class="aurora"></div>
          <InteractiveAvatar class="relative z-10 scale-[1.35]" />
        </div>
        <div class="max-w-xl relative z-10">
        <span class="eyebrow hero-kicker">Dev Full Stack &amp; Mobile</span>
        <h1 ref="heroTitleRef" class="text-hero">
          {{ user?.main_phrase || 'Código com propósito' }}<span class="cursor-blink"></span>
        </h1>
        <p ref="heroSubRef" class="mt-5 text-body text-muted whitespace-pre-line">
          {{ user?.description || 'Desenvolvedor freelancer especializado em aplicativos mobile, sistemas web\n e automações sob medida. Aluno de Engenharia de Software, apaixonado por\n transformar problemas reais em produtos bem construídos.' }}
        </p>
          <NuxtLink 
            ref="heroBtnRef"
            :to="`/${route.params.user_id}/about`.replace('//', '/')" 
            data-magnetic
            class="inline-block mt-6 px-5 py-2.5 rounded-full bg-primary text-background text-sm font-display small-caps tracking-wide hover:opacity-85 transition font-semibold"
          >
            Sobre Mim
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- WORK PREVIEW SECTION WITH SPOTLIGHT GLOW CARDS -->
    <section 
      id="projetos"
      data-section="Projetos"
      ref="workSectionRef" 
      class="max-w-6xl mx-auto px-6 pb-24"
    >
      <div class="flex items-end justify-between mb-6">
        <h2 class="font-display text-2xl small-caps text-text font-semibold">Projetos Recentes</h2>
        <NuxtLink :to="`/${route.params.user_id}/work`.replace('//', '/')" class="text-xs font-display small-caps text-muted hover:text-text transition">Ver todos →</NuxtLink>
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
              <div class="rounded-xl bg-surface h-32 mb-3 relative overflow-hidden flex items-center justify-center border border-border">
                <span class="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full text-background font-display small-caps font-semibold bg-primary">
                  {{ project.cat }}
                </span>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8FA0C4" stroke-width="1.2" opacity="0.6">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div class="flex items-center justify-between text-xs text-muted">
                <span>{{ project.year }}</span>
                <span class="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors" @click.stop="toggleLike(project)">
                  <span class="icon-coracao" :class="project.liked ? 'bg-primary' : 'bg-currentColor'"></span>
                  {{ project.likes }}
                </span>
              </div>
              <p class="font-display text-base mt-2 small-caps text-text font-semibold">{{ project.title }}</p>
            </div>
            <p class="text-xs text-muted mt-3 line-clamp-3 leading-relaxed">{{ project.desc }}</p>
          </div>
        </GlowCard>
      </div>
    </section>

    <!-- TOOLS & SKILLS SECTION -->
    <section 
      id="ferramentas"
      data-section="Ferramentas"
      ref="toolsSectionRef" 
      class="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-8"
    >
      <ToolsGrid :tools="tools" />
      <SkillsGrid :skills="skills" />
    </section>

    <!-- TESTIMONIALS SECTION -->
    <section 
      id="depoimentos"
      data-section="Depoimentos"
      ref="testimonialsSectionRef" 
      class="max-w-4xl mx-auto px-6 pb-24 space-y-14"
    >
      <h2 class="font-display text-2xl small-caps text-text font-semibold text-center mb-8">Depoimentos</h2>
      <TestimonialList :testimonials="testimonials" />
    </section>

    <!-- CONTACT SECTION -->
    <section id="contato" data-section="Contato">
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

<style scoped>
.icon-coracao {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  -webkit-mask-image: url('~/assets/icons/coracao.svg');
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { gsap } from 'gsap'
import { usePortfolioApi, type Project } from '~/composables/usePortfolioApi'
import GlowCard from '~/components/ui/GlowCard.vue'
import InteractiveAvatar from '~/components/ui/InteractiveAvatar.vue'
import HeroBackground from '~/components/ui/HeroBackground.vue'

const route = useRoute()
const { user, projects, tools, skills, testimonials, loadData } = usePortfolioApi()

const selectedProject = ref<Project | null>(null)
const featuredProjects = computed(() => projects.value.slice(0, 3))

function getGlowColor(index: number): 'blue' | 'purple' | 'green' {
  const colors: ('blue' | 'purple' | 'green')[] = ['purple', 'blue', 'green']
  return colors[index % colors.length]
}

function toggleLike(project: any) {
  if (project.liked) {
    project.likes--
    project.liked = false
  } else {
    project.likes++
    project.liked = true
  }
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
  loadData(route.params.user_id as string)
})
</script>
