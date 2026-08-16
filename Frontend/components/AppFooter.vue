<template>
  <footer class="border-t border-border pt-10 pb-10 text-center">
    <div class="flex justify-center gap-6 text-muted text-lg">
      <a v-if="user?.instagram_url" :href="user.instagram_url" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="hover:text-text transition hover:-translate-y-1">
        <span class="icon-mask w-6 h-6" style="mask-image: url(/icons/instagram-logo.svg); -webkit-mask-image: url(/icons/instagram-logo.svg);" role="img" aria-label="Instagram"></span>
      </a>
      <a v-if="user?.github_url" :href="user.github_url" target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="hover:text-text transition hover:-translate-y-1">
        <span class="icon-mask w-6 h-6" style="mask-image: url(/icons/github-logo.png); -webkit-mask-image: url(/icons/github-logo.png);" role="img" aria-label="GitHub"></span>
      </a>
      <a v-if="user?.linkedin_url" :href="user.linkedin_url" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="hover:text-text transition hover:-translate-y-1">
        <span class="icon-mask w-6 h-6" style="mask-image: url(/icons/linkedin-logo.svg); -webkit-mask-image: url(/icons/linkedin-logo.svg);" role="img" aria-label="LinkedIn"></span>
      </a>
      <a v-if="user?.medium_url" :href="user.medium_url" target="_blank" rel="noopener noreferrer" aria-label="Medium" class="hover:text-text transition hover:-translate-y-1">
        <span class="icon-mask w-6 h-6" style="mask-image: url(/icons/medium-logo.svg); -webkit-mask-image: url(/icons/medium-logo.svg);" role="img" aria-label="Medium"></span>
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { usePortfolioApi } from '~/composables/usePortfolioApi'

const { user } = usePortfolioApi()
</script>

