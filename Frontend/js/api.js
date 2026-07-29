/* =========================================================================
   API SERVICE LAYER — INTEGRATION WITH FASTAPI BACKEND & FALLBACK DATA
   ========================================================================= */

const API_BASE_URL = 'http://127.0.0.1:8000';

/* Fallback Mock Data in case API is offline or unpopulated */
const FALLBACK_PROJECTS = [
  { id: '1', title: 'AgroBot', year: 2026, likes: 10, cat: 'mobile', desc: 'Aplicativo mobile de assistência agrícola desenvolvido em Swift, projeto de TCC do curso de Engenharia de Software.', github_url: 'https://github.com/daniel/agrobot', test_url: null },
  { id: '2', title: 'DioramaVirtual', year: 2025, likes: 5, cat: 'mobile', desc: 'App iOS em SwiftUI e SwiftData, criado para o desafio Challenge 15.', github_url: 'https://github.com/daniel/diorama-virtual', test_url: null },
  { id: '3', title: 'Refatoração — Sist. Manutenção', year: 2025, likes: 3, cat: 'back', desc: 'Reconstrução completa em Angular de um sistema de gestão de manutenção, do zero.', github_url: 'https://github.com/daniel/manutencao-app', test_url: null },
  { id: '4', title: 'Painel de Automação', year: 2024, likes: 7, cat: 'back', desc: 'Painel web para acompanhamento de rotinas de automação de processos para clientes freelance.', github_url: 'https://github.com/daniel/automacao-panel', test_url: null },
  { id: '5', title: 'Coleta & Análise de Dados', year: 2024, likes: 1, cat: 'data', desc: 'Pipeline de coleta e tratamento de dados para geração de relatórios automatizados.', github_url: 'https://github.com/daniel/data-pipeline', test_url: null },
  { id: '6', title: 'App de Monitoramento', year: 2023, likes: 2, cat: 'mobile', desc: 'Aplicativo mobile de monitoramento em tempo real, integrado a notificações via WhatsApp.', github_url: 'https://github.com/daniel/app-monitoramento', test_url: null }
];

const FALLBACK_TOOLS = [
  { id: '1', name: 'PHP' },
  { id: '2', name: 'Swift' },
  { id: '3', name: 'Angular' },
  { id: '4', name: 'TypeScript' },
  { id: '5', name: 'Python' },
  { id: '6', name: 'Node.js' },
  { id: '7', name: 'Docker' },
  { id: '8', name: 'Git' },
  { id: '9', name: 'Figma' }
];

const FALLBACK_SKILLS = [
  { id: '1', name: 'Dev. Mobile', desc: 'Construção de apps iOS nativos com Swift, SwiftUI e SwiftData.' },
  { id: '2', name: 'Dev. Backend', desc: 'APIs e sistemas web com Angular, Node.js e PHP.' },
  { id: '3', name: 'Automação', desc: 'Fluxos automatizados que eliminam tarefas manuais repetitivas.' },
  { id: '4', name: 'Documentação', desc: 'Propostas técnicas e documentação clara para clientes e equipes.' },
  { id: '5', name: 'UI/UX', desc: 'Interfaces simples, funcionais e agradáveis de usar.' },
  { id: '6', name: 'Comunicação', desc: 'Tradução de necessidades de negócio em soluções técnicas.' }
];

const FALLBACK_EXPERIENCES = [
  { id: '1', year: '2026', title: 'TCC — Engenharia de Software', desc: 'Desenvolvimento do AgroBot, projeto final de curso, em Swift.' },
  { id: '2', year: '2025', title: 'Projetos Freelance — Mobile & Web', desc: 'Desenvolvimento e refatoração de sistemas para clientes, em Angular e Swift.' },
  { id: '3', year: '2023', title: 'Início da Graduação', desc: 'Início do curso de Engenharia de Software.' }
];

const FALLBACK_CERTIFICATES = [
  { id: '1', title: 'Desenvolvimento iOS com Swift', issuer: 'Apple Developer Academy' },
  { id: '2', title: 'Angular Avançado', issuer: 'Udemy' },
  { id: '3', title: 'Fundamentos de UI/UX', issuer: 'Figma Community' },
  { id: '4', title: 'Automação de Processos', issuer: 'Coursera' },
  { id: '5', title: 'Boas Práticas de API REST', issuer: 'FastAPI Docs' }
];

const FALLBACK_TESTIMONIALS = [
  { id: '1', name: 'Cliente — Setor Imobiliário', quote: 'Entregou exatamente o que precisávamos, com comunicação clara em cada etapa do projeto.' },
  { id: '2', name: 'Cliente — Projeto de Manutenção', quote: 'Refez nosso sistema do zero e o resultado ficou muito mais estável e rápido.' },
  { id: '3', name: 'Colega de Curso — Academia Mobile', quote: 'Atenção aos detalhes e disposição para resolver problemas difíceis sem atalhos.' }
];

/* Helper to map backend category strings to frontend categories */
function normalizeCategory(category) {
  if (!category) return 'back';
  const c = category.toLowerCase();
  if (c.includes('mobile') || c.includes('ios') || c.includes('swift')) return 'mobile';
  if (c.includes('data') || c.includes('datascience')) return 'data';
  return 'back';
}

/* API Fetch Helpers */
async function fetchProjectsFromAPI() {
  try {
    const res = await fetch(`${API_BASE_URL}/projects/`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data && data.length > 0) {
      return data.map(p => ({
        id: p.id,
        title: p.name || p.title,
        year: p.date ? new Date(p.date).getFullYear() : (p.year || 2025),
        likes: p.likes ?? 0,
        cat: normalizeCategory(p.category),
        desc: p.description || p.desc || 'Projeto cadastrado via API Backend FastAPI.',
        github_url: p.github_url || null,
        test_url: p.test_url || null
      }));
    }
  } catch (err) {
    console.warn('API /projects offline ou vazia, utilizando fallback data:', err.message);
  }
  return FALLBACK_PROJECTS;
}

async function fetchToolsFromAPI() {
  try {
    const res = await fetch(`${API_BASE_URL}/tools/`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data && data.length > 0) {
      return data.map(t => ({ id: t.id, name: t.name }));
    }
  } catch (err) {
    console.warn('API /tools offline ou vazia, utilizando fallback data:', err.message);
  }
  return FALLBACK_TOOLS;
}

async function fetchSkillsFromAPI() {
  try {
    const res = await fetch(`${API_BASE_URL}/skills/`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data && data.length > 0) {
      return data.map(s => ({ id: s.id, name: s.name, desc: s.description || 'Habilidade técnica.' }));
    }
  } catch (err) {
    console.warn('API /skills offline ou vazia, utilizando fallback data:', err.message);
  }
  return FALLBACK_SKILLS;
}

async function fetchExperiencesFromAPI() {
  try {
    const res = await fetch(`${API_BASE_URL}/experiences/`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data && data.length > 0) {
      return data.map(e => ({
        id: e.id,
        year: e.start_date ? new Date(e.start_date).getFullYear().toString() : '2025',
        title: e.title,
        desc: e.description || `${e.company || ''}`
      }));
    }
  } catch (err) {
    console.warn('API /experiences offline ou vazia, utilizando fallback data:', err.message);
  }
  return FALLBACK_EXPERIENCES;
}

async function fetchCertificatesFromAPI() {
  try {
    const res = await fetch(`${API_BASE_URL}/certificates/`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data && data.length > 0) {
      return data.map(c => ({
        id: c.id,
        title: c.title,
        issuer: c.issuing_organization || 'Instituição Certificadora'
      }));
    }
  } catch (err) {
    console.warn('API /certificates offline ou vazia, utilizando fallback data:', err.message);
  }
  return FALLBACK_CERTIFICATES;
}

async function fetchTestimonialsFromAPI() {
  try {
    const res = await fetch(`${API_BASE_URL}/recommendations/`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data && data.length > 0) {
      return data.map(r => ({
        id: r.id,
        name: `${r.recommender_name} ${r.recommender_title ? '— ' + r.recommender_title : ''}`,
        quote: r.content
      }));
    }
  } catch (err) {
    console.warn('API /recommendations offline ou vazia, utilizando fallback data:', err.message);
  }
  return FALLBACK_TESTIMONIALS;
}
