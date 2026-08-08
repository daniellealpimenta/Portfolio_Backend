<template>
  <footer class="border-t border-border pt-10 pb-10 text-center">
    <div class="flex justify-center gap-6 text-muted text-lg">
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
</style>

<script setup lang="ts">
import { usePortfolioApi } from '~/composables/usePortfolioApi'

const { user } = usePortfolioApi()
</script>

