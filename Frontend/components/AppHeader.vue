<template>
  <header ref="headerRef" class="force-dark fixed top-0 inset-x-0 z-40 bg-background backdrop-blur border-b border-border">
    <div class="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
      <NuxtLink :to="userPrefix" class="flex items-center gap-2 text-meta text-base text-text" id="logo">
        <svg class="logo-bubble" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <path d="M12 3C6.9 3 3 6.4 3 10.6c0 2.4 1.3 4.6 3.4 6.1-.1 1-.5 2.2-1.3 3.3 1.6-.3 3-1 4.1-1.8 .9.2 1.8.4 2.8.4 5.1 0 9-3.4 9-7.6S17.1 3 12 3Z"/>
        </svg>
        Hire Me
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-8 text-meta text-sm">
        <NuxtLink :to="userPrefix" exact-active-class="underline underline-offset-4 decoration-primary text-text font-semibold" class="text-muted hover:text-text transition">Home</NuxtLink>
        <NuxtLink :to="`${userPrefix}/about`.replace('//', '/')" active-class="text-text font-semibold" class="text-muted hover:text-text transition">About</NuxtLink>
        <NuxtLink :to="`${userPrefix}/work`.replace('//', '/')" active-class="underline underline-offset-4 decoration-primary text-text font-semibold" class="text-muted hover:text-text transition">Work</NuxtLink>
        <NuxtLink :to="`${userPrefix}/resume`.replace('//', '/')" active-class="text-text font-semibold" class="text-muted hover:text-text transition">Resume</NuxtLink>
      </nav>

      <div class="flex items-center gap-4">
        <!-- Theme Palette & Mode Switchers -->
        <ThemePaletteSwitcher />
        <ThemeSwitch />

        <button @click="toggleLang" class="text-meta text-sm flex items-center gap-1 cursor-pointer ml-2">
          <span :class="lang === 'pt' ? 'underline underline-offset-4 decoration-primary text-text' : 'text-muted'">Pt</span>
          <span class="text-muted">|</span>
          <span :class="lang === 'en' ? 'underline underline-offset-4 decoration-primary text-text' : 'text-muted'">En</span>
        </button>

        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-text p-1 focus:outline-none ml-2" aria-label="Abrir menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Menu -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-surface border-b border-border px-6 py-4 flex flex-col gap-4 text-meta text-base">
      <NuxtLink :to="userPrefix" @click="mobileMenuOpen = false" class="text-text hover:text-primary transition">Home</NuxtLink>
      <NuxtLink :to="`${userPrefix}/about`.replace('//', '/')" @click="mobileMenuOpen = false" class="text-text hover:text-primary transition">About</NuxtLink>
      <NuxtLink :to="`${userPrefix}/work`.replace('//', '/')" @click="mobileMenuOpen = false" class="text-text hover:text-primary transition">Work</NuxtLink>
      <NuxtLink :to="`${userPrefix}/resume`.replace('//', '/')" @click="mobileMenuOpen = false" class="text-text hover:text-primary transition">Resume</NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ThemeSwitch from '~/components/ui/ThemeSwitch.vue'
import ThemePaletteSwitcher from '~/components/ui/ThemePaletteSwitcher.vue'
import { useLanguage } from '~/composables/useLanguage'
import { useRoute } from 'vue-router'

const route = useRoute()
const mobileMenuOpen = ref(false)
const { lang, toggleLang } = useLanguage()

const userPrefix = computed(() => {
  const userId = route.params.user_id as string
  return userId ? `/${userId}` : '/'
})

</script>
