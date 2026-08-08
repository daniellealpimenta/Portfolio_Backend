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
  experience_id?: string | number
  linkedin_recommender_url?: string
  date?: string
  description?: string
}

export interface User {
  id: string
  name: string
  description: string
  main_phrase: string | null
  email: string
  cellphone_number: string | null
  avatar_url: string
  linkedin_url: string
  github_url: string | null
  medium_url: string | null
  instagram_url: string | null
  personality_test_url: string | null
  curriculum_url: string
}

const API_BASE_URL = 'http://127.0.0.1:8000'



function normalizeCategory(category?: string): string {
  if (!category) return 'back'
  const c = category.toLowerCase()
  if (c.includes('mobile') || c.includes('ios') || c.includes('swift')) return 'mobile'
  if (c.includes('data') || c.includes('datascience')) return 'data'
  return 'back'
}

export function usePortfolioApi() {
  const user = useState<User | null>('portfolio-user', () => null)
  const projects = useState<Project[]>('portfolio-projects', () => [])
  const tools = useState<Tool[]>('portfolio-tools', () => [])
  const skills = useState<Skill[]>('portfolio-skills', () => [])
  const experiences = useState<Experience[]>('portfolio-experiences', () => [])
  const certificates = useState<Certificate[]>('portfolio-certificates', () => [])
  const testimonials = useState<Testimonial[]>('portfolio-testimonials', () => [])
  const loading = useState('portfolio-loading', () => false)

  async function loadData(userIdOrUsername: string) {
    if (!userIdOrUsername) {
      console.error('loadData: userIdOrUsername is required')
      return
    }
    
    loading.value = true
    try {
      // 1. Fetch user first using identifier (username or UUID)
      const userRes = await $fetch<any>(`${API_BASE_URL}/users/${userIdOrUsername}`, { timeout: 3000 }).catch(() => null)
      
      if (userRes) {
        user.value = userRes
        const actualUserId = userRes.id // Always the UUID
        
        // 2. Fetch dependencies using the actual UUID
        const [projRes, toolRes, skillRes, expRes, certRes, testRes] = await Promise.allSettled([
          $fetch<any[]>(`${API_BASE_URL}/projects/user/${actualUserId}`, { timeout: 3000 }).catch(() => $fetch<any[]>(`${API_BASE_URL}/projects/`, { timeout: 3000 })),
          $fetch<any[]>(`${API_BASE_URL}/tools/user/${actualUserId}`, { timeout: 3000 }).catch(() => $fetch<any[]>(`${API_BASE_URL}/tools/`, { timeout: 3000 })),
          $fetch<any[]>(`${API_BASE_URL}/skills/user/${actualUserId}`, { timeout: 3000 }).catch(() => $fetch<any[]>(`${API_BASE_URL}/skills/`, { timeout: 3000 })),
          $fetch<any[]>(`${API_BASE_URL}/experiences/user/${actualUserId}`, { timeout: 3000 }).catch(() => $fetch<any[]>(`${API_BASE_URL}/experiences/`, { timeout: 3000 })),
          $fetch<any[]>(`${API_BASE_URL}/certificates/user/${actualUserId}`, { timeout: 3000 }).catch(() => $fetch<any[]>(`${API_BASE_URL}/certificates/`, { timeout: 3000 })),
          $fetch<any[]>(`${API_BASE_URL}/recommendations/user/${actualUserId}`, { timeout: 3000 }).catch(() => $fetch<any[]>(`${API_BASE_URL}/recommendations/`, { timeout: 3000 }))
        ])

        if (projRes.status === 'fulfilled' && Array.isArray(projRes.value)) {
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
        }

        if (toolRes.status === 'fulfilled' && Array.isArray(toolRes.value)) {
          tools.value = toolRes.value.map(t => ({ id: t.id, name: t.name }))
        }

        if (skillRes.status === 'fulfilled' && Array.isArray(skillRes.value)) {
          skills.value = skillRes.value.map(s => ({ id: s.id, name: s.name, desc: s.description || s.desc }))
        }

        if (expRes.status === 'fulfilled' && Array.isArray(expRes.value)) {
          experiences.value = expRes.value.map(e => ({ id: e.id, year: e.year || e.start_date?.substring(0,4) || '2025', title: e.position || e.role || e.title, desc: e.description || e.desc }))
        }

        if (certRes.status === 'fulfilled' && Array.isArray(certRes.value)) {
          certificates.value = certRes.value.map(c => ({ 
            id: c.id, 
            title: c.name_course || c.name || c.title, 
            issuer: c.plataform || c.institution || c.issuer,
            workload: c.workload || 0,
            issue_date: c.issue_date || '',
            digital_certificate_url: c.digital_certificate_url || '',
            description: c.description || ''
          }))
        }

        if (testRes.status === 'fulfilled' && Array.isArray(testRes.value)) {
          testimonials.value = testRes.value.map(r => ({ 
            id: r.id, 
            name: r.name_recommender || r.author || r.name, 
            quote: r.description || r.content || r.quote,
            description: r.description || r.content || r.quote,
            experience_id: r.experience_id || '',
            linkedin_recommender_url: r.linkedin_recommender_url || '',
            date: r.date || ''
          }))
        }
      }
    } catch (e) {
      console.warn('Erro ao buscar API backend:', e)
    } finally {
      loading.value = false
    }
  }

  // --- ADMIN MUTATIONS ---

  // User
  async function updateUser(id: string, data: any) {
    const res = await $fetch(`${API_BASE_URL}/users/${id}`, { method: 'PATCH', body: data })
    await loadData(id)
    return res
  }

  // Projects
  async function createProject(data: any) {
    const res = await $fetch(`${API_BASE_URL}/projects/`, { method: 'POST', body: data })
    if (user.value) await loadData(user.value.id)
    return res
  }
  async function updateProject(id: string, data: any) {
    const res = await $fetch(`${API_BASE_URL}/projects/${id}`, { method: 'PATCH', body: data })
    if (user.value) await loadData(user.value.id)
    return res
  }
  async function likeProject(id: string, newLikes: number) {
    // Only patches the likes without triggering a full loadData reload
    return await $fetch(`${API_BASE_URL}/projects/${id}`, { method: 'PATCH', body: { likes: newLikes } })
  }
  async function deleteProject(id: string) {
    await $fetch(`${API_BASE_URL}/projects/${id}`, { method: 'DELETE' })
    if (user.value) await loadData(user.value.id)
  }

  // Skills
  async function createSkill(data: any) {
    const res = await $fetch(`${API_BASE_URL}/skills/`, { method: 'POST', body: data })
    if (user.value) await loadData(user.value.id)
    return res
  }
  async function updateSkill(id: string, data: any) {
    const res = await $fetch(`${API_BASE_URL}/skills/${id}`, { method: 'PATCH', body: data })
    if (user.value) await loadData(user.value.id)
    return res
  }
  async function deleteSkill(id: string) {
    await $fetch(`${API_BASE_URL}/skills/${id}`, { method: 'DELETE' })
    if (user.value) await loadData(user.value.id)
  }

  // Experiences
  async function createExperience(data: any) {
    const res = await $fetch(`${API_BASE_URL}/experiences/`, { method: 'POST', body: data })
    if (user.value) await loadData(user.value.id)
    return res
  }
  async function updateExperience(id: string, data: any) {
    const res = await $fetch(`${API_BASE_URL}/experiences/${id}`, { method: 'PATCH', body: data })
    if (user.value) await loadData(user.value.id)
    return res
  }
  async function deleteExperience(id: string) {
    await $fetch(`${API_BASE_URL}/experiences/${id}`, { method: 'DELETE' })
    if (user.value) await loadData(user.value.id)
  }

  // Certificates
  async function createCertificate(data: any) {
    const res = await $fetch(`${API_BASE_URL}/certificates/`, { method: 'POST', body: data })
    if (user.value) await loadData(user.value.id)
    return res
  }
  async function updateCertificate(id: string, data: any) {
    const res = await $fetch(`${API_BASE_URL}/certificates/${id}`, { method: 'PATCH', body: data })
    if (user.value) await loadData(user.value.id)
    return res
  }
  async function deleteCertificate(id: string) {
    await $fetch(`${API_BASE_URL}/certificates/${id}`, { method: 'DELETE' })
    if (user.value) await loadData(user.value.id)
  }

  // Tools
  async function createTool(data: any) {
    const res = await $fetch(`${API_BASE_URL}/tools/`, { method: 'POST', body: data })
    if (user.value) await loadData(user.value.id)
    return res
  }
  async function updateTool(id: string, data: any) {
    const res = await $fetch(`${API_BASE_URL}/tools/${id}`, { method: 'PATCH', body: data })
    if (user.value) await loadData(user.value.id)
    return res
  }
  async function deleteTool(id: string) {
    await $fetch(`${API_BASE_URL}/tools/${id}`, { method: 'DELETE' })
    if (user.value) await loadData(user.value.id)
  }

  // Recommendations
  async function createRecommendation(data: any) {
    const res = await $fetch(`${API_BASE_URL}/recommendations/`, { method: 'POST', body: data })
    if (user.value) await loadData(user.value.id)
    return res
  }
  async function updateRecommendation(id: string, data: any) {
    const res = await $fetch(`${API_BASE_URL}/recommendations/${id}`, { method: 'PATCH', body: data })
    if (user.value) await loadData(user.value.id)
    return res
  }
  async function deleteRecommendation(id: string) {
    await $fetch(`${API_BASE_URL}/recommendations/${id}`, { method: 'DELETE' })
    if (user.value) await loadData(user.value.id)
  }

  // Project Images
  async function getProjectImages(projectId: string) {
    return await $fetch<any[]>(`${API_BASE_URL}/project-images/project/${projectId}`)
  }
  async function createProjectImage(data: { project_id: string, image_path: string }) {
    return await $fetch(`${API_BASE_URL}/project-images/`, { method: 'POST', body: data })
  }
  async function updateProjectImage(id: string, data: { image_path: string }) {
    return await $fetch(`${API_BASE_URL}/project-images/${id}`, { method: 'PATCH', body: data })
  }

  // Contact
  async function sendContactMessage(data: { user_id: string, name: string, email: string, subject: string, message: string }) {
    return await $fetch(`${API_BASE_URL}/contact/`, { method: 'POST', body: data })
  }

  // System
  async function importSystemData(userId: string, data: any) {
    const res = await $fetch(`${API_BASE_URL}/system/import/${userId}`, { method: 'POST', body: data })
    await loadData(userId)
    return res
  }

  async function exportSystemData(userId: string) {
    return await $fetch(`${API_BASE_URL}/system/export/${userId}`)
  }

  return {
    user,
    projects,
    tools,
    skills,
    experiences,
    certificates,
    testimonials,
    loading,
    loadData,
    updateUser,
    createProject,
    updateProject,
    likeProject,
    deleteProject,
    getProjectImages,
    createProjectImage,
    updateProjectImage,
    createSkill,
    updateSkill,
    deleteSkill,
    createExperience,
    updateExperience,
    deleteExperience,
    createCertificate,
    updateCertificate,
    deleteCertificate,
    createTool,
    updateTool,
    deleteTool,
    createRecommendation,
    updateRecommendation,
    deleteRecommendation,
    sendContactMessage,
    importSystemData,
    exportSystemData
  }
}

