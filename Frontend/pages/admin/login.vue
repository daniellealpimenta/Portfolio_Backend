<template>
  <div class="min-h-screen flex items-center justify-center bg-background text-text p-4">
    <div class="bg-surface border border-border rounded-2xl p-8 w-full max-w-md">
      <h1 class="text-h2 text-center mb-6 text-primary">Login Administrativo</h1>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm text-muted mb-2">Email</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            class="w-full bg-background border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label class="block text-sm text-muted mb-2">Senha</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            class="w-full bg-background border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <p v-if="errorMsg" class="text-error text-sm">{{ errorMsg }}</p>
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-primary text-background font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from '#imports'
import { useAuth } from '~/composables/useAuth'

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

const router = useRouter()
const { setAdminUserId } = useAuth()

const handleLogin = async () => {
  loading.value = true
  errorMsg.value = ''
  
  try {
    // Basic mock authentication for now, accepting any login to map to daniel.pimenta ID
    // Em um sistema real, você chamaria um endpoint /auth/login
    if (email.value.includes('@') && password.value.length > 3) {
      setAdminUserId('019fb45c-4672-7ab1-8d67-c04858251df8')
      router.push('/admin')
    } else {
      errorMsg.value = 'Credenciais inválidas.'
    }
  } catch (e) {
    errorMsg.value = 'Erro ao fazer login.'
  } finally {
    loading.value = false
  }
}
</script>