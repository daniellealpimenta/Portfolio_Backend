import { ref } from 'vue'
import { useRouter, useCookie } from '#imports'

export const useAuth = () => {
  const router = useRouter()
  // Armazena a sessão em cookies para persistir após recarregar a página
  const adminUserId = useCookie<string | null>('adminUserId')
  const adminUserName = useCookie<string | null>('adminUserName')
  
  const loading = ref(false)
  const error = ref('')

  const login = async (email: string) => {
    loading.value = true
    error.value = ''
    try {
      const res = await $fetch<any>(`http://127.0.0.1:8000/users/email/${email}`)
      if (res && res.id) {
        adminUserId.value = res.id
        adminUserName.value = res.name || res.email
        router.push('/admin')
        return true
      }
    } catch (e: any) {
      console.error(e)
      if (e.response && e.response.status === 404) {
        error.value = 'E-mail não encontrado no banco de dados.'
      } else {
        error.value = 'Erro ao tentar fazer login. O backend está rodando?'
      }
    } finally {
      loading.value = false
    }
    return false
  }

  const logout = () => {
    adminUserId.value = null
    adminUserName.value = null
    router.push('/admin/login')
  }

  return { adminUserId, adminUserName, loading, error, login, logout }
}
