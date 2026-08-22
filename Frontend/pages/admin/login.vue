<template>
  <div class="fixed inset-0 flex items-center justify-center bg-background text-text p-4 overflow-y-auto">
    <div class="bg-surface border border-border rounded-2xl p-8 w-full max-w-md my-auto">
      <h1 class="text-h2 text-center mb-2 text-primary">Painel Administrativo</h1>

      <!-- PASSO 1: E-MAIL -->
      <template v-if="step === 'email'">
        <p class="text-sm text-muted text-center mb-6">Entre com seu e-mail para receber um código de acesso.</p>
        <form @submit.prevent="handleEmailSubmit" class="space-y-4">
          <div>
            <label class="block text-sm text-muted mb-2">Email</label>
            <input
              v-model="email"
              type="email"
              required
              autofocus
              class="w-full bg-background border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <p v-if="error" class="text-error text-sm">{{ error }}</p>
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary text-background font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {{ loading ? 'Verificando...' : 'Continuar' }}
          </button>
        </form>
      </template>

      <!-- PASSO 2: CÓDIGO -->
      <template v-else-if="step === 'code'">
        <p class="text-sm text-muted text-center mb-6">
          Enviamos um código de 6 dígitos para <span class="text-text font-medium">{{ email }}</span>.
          Ele expira em 10 minutos.
        </p>
        <form @submit.prevent="handleCodeSubmit" class="space-y-4">
          <div>
            <label class="block text-sm text-muted mb-2">Código</label>
            <input
              v-model="code"
              type="text"
              inputmode="numeric"
              pattern="[0-9]{6}"
              maxlength="6"
              required
              autofocus
              placeholder="000000"
              class="w-full bg-background border border-border rounded-xl px-4 py-3 text-text text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <p v-if="error" class="text-error text-sm">{{ error }}</p>
          <button
            type="submit"
            :disabled="loading || code.length !== 6"
            class="w-full bg-primary text-background font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
          <div class="flex items-center justify-between pt-1">
            <button
              type="button"
              @click="backToEmail"
              class="text-sm text-muted hover:text-text transition-colors py-1"
            >
              Usar outro e-mail
            </button>
            <button
              type="button"
              :disabled="loading || resendCooldown > 0"
              @click="handleResend"
              class="text-sm text-muted hover:text-text transition-colors py-1 disabled:opacity-50 disabled:hover:text-muted"
            >
              {{ resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : 'Reenviar código' }}
            </button>
          </div>
        </form>
      </template>

      <!-- PASSO 3: CADASTRO (e-mail não encontrado) -->
      <template v-else-if="step === 'signup'">
        <p class="text-sm text-muted text-center mb-6">
          Não encontramos uma conta para <span class="text-text font-medium">{{ email }}</span>.
          Preencha os dados abaixo para criar a sua.
        </p>
        <form @submit.prevent="handleSignupSubmit" class="space-y-4">
          <div>
            <label class="block text-sm text-muted mb-2">Nome</label>
            <input
              v-model="name"
              type="text"
              required
              autofocus
              class="w-full bg-background border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm text-muted mb-2">Nome de usuário</label>
            <div class="flex items-center bg-background border border-border rounded-xl overflow-hidden focus-within:border-primary transition-colors">
              <span class="pl-4 text-muted text-sm">/</span>
              <input
                v-model="username"
                type="text"
                required
                placeholder="seu.nome"
                class="w-full bg-transparent px-2 py-3 text-text focus:outline-none"
              />
            </div>
            <p class="text-xs text-muted mt-1.5">Esse será o endereço do seu portfólio: /{{ username || 'seu.nome' }}</p>
          </div>
          <p v-if="error" class="text-error text-sm">{{ error }}</p>
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary text-background font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {{ loading ? 'Criando...' : 'Criar conta' }}
          </button>
          <button
            type="button"
            @click="backToEmail"
            class="w-full text-sm text-muted hover:text-text transition-colors py-1"
          >
            Voltar
          </button>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { definePageMeta } from '#imports'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'auth' })

const { loading, error, requestCode, verifyCode, signup } = useAuth()

const step = ref<'email' | 'code' | 'signup'>('email')
const email = ref('')
const code = ref('')
const name = ref('')
const username = ref('')

const resendCooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

function startResendCooldown() {
  resendCooldown.value = 30
  if (cooldownTimer) clearInterval(cooldownTimer)
  cooldownTimer = setInterval(() => {
    resendCooldown.value -= 1
    if (resendCooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})

async function handleEmailSubmit() {
  try {
    const result = await requestCode(email.value)
    if (result === 'sent') {
      step.value = 'code'
      startResendCooldown()
    } else if (result === 'not_found') {
      step.value = 'signup'
    }
  } catch {
    // erro já fica em `error`, exibido no template
  }
}

async function handleCodeSubmit() {
  await verifyCode(email.value, code.value)
}

async function handleResend() {
  if (resendCooldown.value > 0) return
  code.value = '' // o código antigo deixa de valer assim que um novo é gerado
  try {
    await requestCode(email.value)
    startResendCooldown()
  } catch {
    // erro já fica em `error`
  }
}

async function handleSignupSubmit() {
  const ok = await signup(name.value, username.value, email.value)
  if (ok) {
    step.value = 'code'
    startResendCooldown()
  }
}

function backToEmail() {
  step.value = 'email'
  code.value = ''
  error.value = ''
}
</script>
