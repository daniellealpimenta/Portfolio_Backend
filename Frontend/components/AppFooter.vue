<template>
  <footer class="border-t border-border pt-14 pb-10 text-center">
    <h2 class="font-display text-3xl small-caps tracking-widest text-text font-semibold">Hire Me</h2>
    <p class="text-muted mt-2 text-sm">Entre em contato comigo</p>
    <a :href="whatsappLink" :target="whatsappLink.startsWith('http') ? '_blank' : undefined" :rel="whatsappLink.startsWith('http') ? 'noopener noreferrer' : undefined" class="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full border border-border text-sm font-display small-caps tracking-wide text-text hover:bg-primary hover:text-background hover:border-primary transition">
      <span class="icon-whatsapp"></span>
      Converse Comigo
    </a>
    <div class="flex justify-center gap-5 mt-10 text-muted text-lg">
      <a v-if="user?.instagram_url" :href="user.instagram_url" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="hover:opacity-80 transition hover:-translate-y-1">
        <img src="~/assets/icons/instagram-logo.png" alt="Instagram" class="w-6 h-6 object-contain filter invert opacity-70 hover:opacity-100" />
      </a>
      <a v-if="user?.github_url" :href="user.github_url" target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="hover:opacity-80 transition hover:-translate-y-1">
        <img src="~/assets/icons/github-logo.png" alt="GitHub" class="w-6 h-6 object-contain filter invert opacity-70 hover:opacity-100" />
      </a>
      <a v-if="user?.linkedin_url" :href="user.linkedin_url" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="hover:opacity-80 transition hover:-translate-y-1">
        <img src="~/assets/icons/linkedin-logo.png" alt="LinkedIn" class="w-6 h-6 object-contain filter invert opacity-70 hover:opacity-100" />
      </a>
      <a v-if="user?.medium_url" :href="user.medium_url" target="_blank" rel="noopener noreferrer" aria-label="Medium" class="hover:opacity-80 transition hover:-translate-y-1">
        <img src="~/assets/icons/medium-logo.png" alt="Medium" class="w-6 h-6 object-contain filter invert opacity-70 hover:opacity-100" />
      </a>
    </div>
  </footer>
</template>

<style scoped>
.icon-whatsapp {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  background-color: currentColor;
  -webkit-mask-image: url('~/assets/icons/whatsapp-logo.svg');
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioApi } from '~/composables/usePortfolioApi'

const { user } = usePortfolioApi()

const whatsappLink = computed(() => {
  if (!user.value || !user.value.cellphone_number) {
    return '/#contact'
  }
  const cleanPhone = user.value.cellphone_number.replace(/\D/g, '')
  // Pega apenas o primeiro nome se houver espaços
  const firstName = user.value.name ? user.value.name.split(' ')[0] : 'Daniel'
  const message = encodeURIComponent(`Olá ${firstName}, vi o seu portfólio e gostaria de conversar sobre um projeto ou oportunidade!`)
  return `https://wa.me/${cleanPhone}?text=${message}`
})
</script>

