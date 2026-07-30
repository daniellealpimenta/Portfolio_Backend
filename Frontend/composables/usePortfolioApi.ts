export interface Project {
  id: string | number
  title: string
  year: number
  likes: number
  cat: 'mobile' | 'back' | 'data' | string
  desc: string
  github_url: string | null
  test_url: string | null
}

export interface Tool {
  id: string | number
  name: string
}

export interface Skill {
  id: string | number
  name: string
  desc: string
}

export interface Experience {
  id: string | number
  year: string
  title: string
  desc: string
}

export interface Certificate {
  id: string | number
  title: string
  issuer: string
}

export interface Testimonial {
  id: string | number
  name: string
  quote: string
}

const API_BASE_URL = 'http://127.0.0.1:8000'

const FALLBACK_PROJECTS: Project[] = [
  { id: '1', title: 'AgroBot', year: 2026, likes: 10, cat: 'mobile', desc: 'Aplicativo mobile de assistência agrícola desenvolvido em Swift, projeto de TCC do curso de Engenharia de Software.', github_url: 'https://github.com/daniel/agrobot', test_url: null },
  { id: '2', title: 'DioramaVirtual', year: 2025, likes: 5, cat: 'mobile', desc: 'App iOS em SwiftUI e SwiftData, criado para o desafio Challenge 15.', github_url: 'https://github.com/daniel/diorama-virtual', test_url: null },
  { id: '3', title: 'Refatoração — Sist. Manutenção', year: 2025, likes: 3, cat: 'back', desc: 'Reconstrução completa em Angular de um sistema de gestão de manutenção, do zero.', github_url: 'https://github.com/daniel/manutencao-app', test_url: null },
  { id: '4', title: 'Painel de Automação', year: 2024, likes: 7, cat: 'back', desc: 'Painel web para acompanhamento de rotinas de automação de processos para clientes freelance.', github_url: 'https://github.com/daniel/automacao-panel', test_url: null },
  { id: '5', title: 'Coleta & Análise de Dados', year: 2024, likes: 1, cat: 'data', desc: 'Pipeline de coleta e tratamento de dados para geração de relatórios automatizados.', github_url: 'https://github.com/daniel/data-pipeline', test_url: null },
  { id: '6', title: 'App de Monitoramento', year: 2023, likes: 2, cat: 'mobile', desc: 'Aplicativo mobile de monitoramento em tempo real, integrado a notificações via WhatsApp.', github_url: 'https://github.com/daniel/app-monitoramento', test_url: null }
]

const FALLBACK_TOOLS: Tool[] = [
  { id: '1', name: 'PHP' },
  { id: '2', name: 'Swift' },
  { id: '3', name: 'Angular' },
  { id: '4', name: 'TypeScript' },
  { id: '5', name: 'Python' },
  { id: '6', name: 'Node.js' },
  { id: '7', name: 'Docker' },
  { id: '8', name: 'Git' },
  { id: '9', name: 'Figma' }
]

const FALLBACK_SKILLS: Skill[] = [
  { id: '1', name: 'Dev. Mobile', desc: 'Construção de apps iOS nativos com Swift, SwiftUI e SwiftData.' },
  { id: '2', name: 'Dev. Backend', desc: 'APIs e sistemas web com Angular, Node.js e PHP.' },
  { id: '3', name: 'Automação', desc: 'Fluxos automatizados que eliminam tarefas manuais repetitivas.' },
  { id: '4', name: 'Documentação', desc: 'Propostas técnicas e documentação clara para clientes e equipes.' },
  { id: '5', name: 'UI/UX', desc: 'Interfaces simples, funcionais e agradáveis de usar.' },
  { id: '6', name: 'Comunicação', desc: 'Tradução de necessidades de negócio em soluções técnicas.' }
]

const FALLBACK_EXPERIENCES: Experience[] = [
  { id: '1', year: '2026', title: 'TCC — Engenharia de Software', desc: 'Desenvolvimento do AgroBot, projeto final de curso, em Swift.' },
  { id: '2', year: '2025', title: 'Projetos Freelance — Mobile & Web', desc: 'Desenvolvimento e refatoração de sistemas para clientes, em Angular e Swift.' },
  { id: '3', year: '2023', title: 'Início da Graduação', desc: 'Início do curso de Engenharia de Software.' }
]

const FALLBACK_CERTIFICATES: Certificate[] = [
  { id: '1', title: 'Desenvolvimento iOS com Swift', issuer: 'Apple Developer Academy' },
  { id: '2', title: 'Angular Avançado', issuer: 'Udemy' },
  { id: '3', title: 'Fundamentos de UI/UX', issuer: 'Figma Community' },
  { id: '4', title: 'Automação de Processos', issuer: 'Coursera' },
  { id: '5', title: 'Boas Práticas de API REST', issuer: 'FastAPI Docs' }
]

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { id: '1', name: 'Cliente — Setor Imobiliário', quote: 'Entregou exatamente o que precisávamos, com comunicação clara em cada etapa do projeto.' },
  { id: '2', name: 'Cliente — Projeto de Manutenção', quote: 'Refez nosso sistema do zero e o resultado ficou muito mais estável e rápido.' },
  { id: '3', name: 'Colega de Curso — Academia Mobile', quote: 'Atenção aos detalhes e disposição para resolver problemas difíceis sem atalhos.' }
]

function normalizeCategory(category?: string): string {
  if (!category) return 'back'
  const c = category.toLowerCase()
  if (c.includes('mobile') || c.includes('ios') || c.includes('swift')) return 'mobile'
  if (c.includes('data') || c.includes('datascience')) return 'data'
  return 'back'
}

export function usePortfolioApi() {
  const projects = ref<Project[]>([])
  const tools = ref<Tool[]>([])
  const skills = ref<Skill[]>([])
  const experiences = ref<Experience[]>([])
  const certificates = ref<Certificate[]>([])
  const testimonials = ref<Testimonial[]>([])
  const loading = ref(false)

  async function loadData() {
    loading.value = true
    try {
      const [projRes, toolRes, skillRes, expRes, certRes, testRes] = await Promise.allSettled([
        $fetch<any[]>(`${API_BASE_URL}/projects/`, { timeout: 3000 }),
        $fetch<any[]>(`${API_BASE_URL}/tools/`, { timeout: 3000 }),
        $fetch<any[]>(`${API_BASE_URL}/skills/`, { timeout: 3000 }),
        $fetch<any[]>(`${API_BASE_URL}/experiences/`, { timeout: 3000 }),
        $fetch<any[]>(`${API_BASE_URL}/certificates/`, { timeout: 3000 }),
        $fetch<any[]>(`${API_BASE_URL}/recommendations/`, { timeout: 3000 })
      ])

      // Projects
      if (projRes.status === 'fulfilled' && Array.isArray(projRes.value) && projRes.value.length > 0) {
        projects.value = projRes.value.map(p => ({
          id: p.id,
          title: p.name || p.title,
          year: p.date ? new Date(p.date).getFullYear() : (p.year || 2025),
          likes: p.likes ?? 0,
          cat: normalizeCategory(p.category),
          desc: p.description || p.desc || 'Projeto cadastrado via API Backend FastAPI.',
          github_url: p.github_url || null,
          test_url: p.test_url || null
        }))
      } else {
        projects.value = FALLBACK_PROJECTS
      }

      // Tools
      if (toolRes.status === 'fulfilled' && Array.isArray(toolRes.value) && toolRes.value.length > 0) {
        tools.value = toolRes.value.map(t => ({ id: t.id, name: t.name }))
      } else {
        tools.value = FALLBACK_TOOLS
      }

      // Skills
      if (skillRes.status === 'fulfilled' && Array.isArray(skillRes.value) && skillRes.value.length > 0) {
        skills.value = skillRes.value.map(s => ({ id: s.id, name: s.name, desc: s.description || s.desc }))
      } else {
        skills.value = FALLBACK_SKILLS
      }

      // Experiences
      if (expRes.status === 'fulfilled' && Array.isArray(expRes.value) && expRes.value.length > 0) {
        experiences.value = expRes.value.map(e => ({ id: e.id, year: e.year || '2025', title: e.role || e.title, desc: e.description || e.desc }))
      } else {
        experiences.value = FALLBACK_EXPERIENCES
      }

      // Certificates
      if (certRes.status === 'fulfilled' && Array.isArray(certRes.value) && certRes.value.length > 0) {
        certificates.value = certRes.value.map(c => ({ id: c.id, title: c.name || c.title, issuer: c.institution || c.issuer }))
      } else {
        certificates.value = FALLBACK_CERTIFICATES
      }

      // Testimonials
      if (testRes.status === 'fulfilled' && Array.isArray(testRes.value) && testRes.value.length > 0) {
        testimonials.value = testRes.value.map(r => ({ id: r.id, name: r.author || r.name, quote: r.content || r.quote }))
      } else {
        testimonials.value = FALLBACK_TESTIMONIALS
      }

    } catch (e) {
      console.warn('Erro ou timeout ao buscar API backend, utilizando dados de fallback:', e)
      projects.value = FALLBACK_PROJECTS
      tools.value = FALLBACK_TOOLS
      skills.value = FALLBACK_SKILLS
      experiences.value = FALLBACK_EXPERIENCES
      certificates.value = FALLBACK_CERTIFICATES
      testimonials.value = FALLBACK_TESTIMONIALS
    } finally {
      loading.value = false
    }
  }

  return {
    projects,
    tools,
    skills,
    experiences,
    certificates,
    testimonials,
    loading,
    loadData
  }
}
