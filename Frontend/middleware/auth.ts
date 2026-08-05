import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  const adminUserId = useCookie('adminUserId')
  
  // Se estiver tentando acessar /admin (mas não for /admin/login) e não estiver logado
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    if (!adminUserId.value) {
      return navigateTo('/admin/login')
    }
  }

  // Se já estiver logado e tentar acessar o login, redirecionar pro dashboard admin
  if (to.path === '/admin/login' && adminUserId.value) {
    return navigateTo('/admin')
  }
})
