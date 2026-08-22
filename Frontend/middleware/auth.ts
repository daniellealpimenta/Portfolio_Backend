import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const isProtected = to.path.startsWith('/admin') && to.path !== '/admin/login'
  const isLoginPage = to.path === '/admin/login'

  if (!isProtected && !isLoginPage) return

  const { currentUser, fetchSession } = useAuth()

  // currentUser já pode estar populado em memória (ex: acabou de logar nesta mesma
  // sessão do app) — só bate no backend se ainda não sabemos quem é.
  if (!currentUser.value) {
    await fetchSession()
  }

  if (isProtected && !currentUser.value) {
    return navigateTo('/admin/login')
  }

  if (isLoginPage && currentUser.value) {
    return navigateTo('/admin')
  }
})
