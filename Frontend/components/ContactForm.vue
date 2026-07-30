<template>
  <section id="contact" class="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-10 items-center">
    <svg width="180" height="180" viewBox="0 0 180 180" fill="none" stroke="#F1F0F7" stroke-width="1.4" class="mx-auto md:mx-0">
      <rect x="20" y="70" width="110" height="80" rx="6"/>
      <path d="M20 78 75 118 130 78"/>
      <circle cx="150" cy="55" r="16"/>
      <path d="M150 39v-14M150 39l10-6"/>
    </svg>
    <form @submit.prevent="handleSubmit" class="space-y-3">
      <input 
        v-model="name" 
        required 
        type="text" 
        placeholder="Nome" 
        class="w-full rounded-lg bg-navypanel border ink-border px-4 py-3 text-sm placeholder:text-mist text-paper focus:outline-none focus:border-periwinkle transition" 
      />
      <input 
        v-model="email" 
        required 
        type="email" 
        placeholder="E-mail" 
        class="w-full rounded-lg bg-navypanel border ink-border px-4 py-3 text-sm placeholder:text-mist text-paper focus:outline-none focus:border-periwinkle transition" 
      />
      <textarea 
        v-model="message" 
        required 
        rows="4" 
        placeholder="Mensagem" 
        class="w-full rounded-lg bg-navypanel border ink-border px-4 py-3 text-sm placeholder:text-mist text-paper focus:outline-none focus:border-periwinkle transition"
      ></textarea>
      <div class="flex justify-end">
        <button 
          type="submit" 
          :disabled="sending"
          class="px-5 py-2.5 rounded-full bg-periwinkle text-navy text-sm font-display small-caps tracking-wide hover:opacity-85 transition font-semibold cursor-pointer disabled:opacity-50"
        >
          {{ sending ? 'Enviando...' : 'Enviar Mensagem' }}
        </button>
      </div>
      <p v-if="statusMsg" class="text-xs text-mint h-4 text-right font-medium">{{ statusMsg }}</p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')
const sending = ref(false)
const statusMsg = ref('')

async function handleSubmit() {
  sending.value = true
  statusMsg.value = 'Enviando sua mensagem...'
  
  // Simulação / Integração com backend
  setTimeout(() => {
    sending.value = false
    statusMsg.value = '✓ Mensagem enviada com sucesso!'
    name.value = ''
    email.value = ''
    message.value = ''
    setTimeout(() => {
      statusMsg.value = ''
    }, 4000)
  }, 1000)
}
</script>
