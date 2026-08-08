<template>
  <section id="contact" class="max-w-4xl mx-auto px-6 pb-24">
    <div class="flex flex-col md:flex-row items-center md:items-stretch gap-10 justify-center">
      <div class="w-40 h-40 md:w-64 md:h-auto flex items-center justify-center shrink-0">
        <PhEnvelope size="100%" weight="fill" class="text-text" />
      </div>
      <form @submit.prevent="handleSubmit" class="space-y-4 w-full max-w-lg">
        <input 
          v-model="name" 
          required 
          type="text" 
          placeholder="Nome" 
          class="w-full rounded-lg bg-surface border border-border px-4 py-3 text-sm placeholder:text-muted text-text focus:outline-none focus:border-primary transition" 
        />
        <input 
          v-model="email" 
          required 
          type="email" 
          placeholder="Seu email" 
          class="w-full rounded-lg bg-surface border border-border px-4 py-3 text-sm placeholder:text-muted text-text focus:outline-none focus:border-primary transition" 
        />
        <input 
          v-model="subject" 
          required 
          type="text" 
          placeholder="Assunto" 
          class="w-full rounded-lg bg-surface border border-border px-4 py-3 text-sm placeholder:text-muted text-text focus:outline-none focus:border-primary transition" 
        />
        <textarea 
          v-model="message" 
          required 
          rows="5" 
          placeholder="Mensagem" 
          class="w-full rounded-lg bg-surface border border-border px-4 py-3 text-sm placeholder:text-muted text-text focus:outline-none focus:border-primary transition resize-none"
        ></textarea>
        <div class="flex justify-end">
          <button 
            type="submit" 
            :disabled="sending"
            class="px-8 py-3 rounded-full bg-primary text-background text-sm font-display small-caps tracking-wide hover:opacity-85 transition font-semibold cursor-pointer disabled:opacity-50"
          >
            {{ sending ? 'Enviando...' : 'Enviar Mensagem' }}
          </button>
        </div>
        <p v-if="statusMsg" class="text-xs text-success h-4 text-right font-medium">{{ statusMsg }}</p>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PhEnvelope } from '@phosphor-icons/vue'
import { usePortfolioApi } from '~/composables/usePortfolioApi'

const { user, sendContactMessage } = usePortfolioApi()

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')
const sending = ref(false)
const statusMsg = ref('')

async function handleSubmit() {
  if (!user.value || !user.value.id) {
    statusMsg.value = 'Erro: Usuário não carregado.'
    return
  }
  
  sending.value = true
  statusMsg.value = 'Enviando sua mensagem...'
  
  try {
    await sendContactMessage({
      user_id: user.value.id,
      name: name.value,
      email: email.value,
      subject: subject.value,
      message: message.value
    })
    
    statusMsg.value = '✓ Mensagem enviada com sucesso!'
    name.value = ''
    email.value = ''
    subject.value = ''
    message.value = ''
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    statusMsg.value = '❌ Ocorreu um erro ao enviar.'
  } finally {
    sending.value = false
    setTimeout(() => {
      statusMsg.value = ''
    }, 4000)
  }
}
</script>
