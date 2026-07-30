<template>
  <header ref="headerRef" class="fixed top-0 inset-x-0 z-40 bg-navy/90 backdrop-blur border-b ink-border">
    <div class="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
      <NuxtLink to="/" class="flex items-center gap-2 font-display text-sm tracking-widest small-caps text-paper" id="logo">
        <svg class="logo-bubble" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <path d="M12 3C6.9 3 3 6.4 3 10.6c0 2.4 1.3 4.6 3.4 6.1-.1 1-.5 2.2-1.3 3.3 1.6-.3 3-1 4.1-1.8 .9.2 1.8.4 2.8.4 5.1 0 9-3.4 9-7.6S17.1 3 12 3Z"/>
        </svg>
        Hire Me
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-8 text-xs tracking-widest small-caps font-display">
        <NuxtLink to="/" exact-active-class="underline underline-offset-4 decoration-periwinkle text-paper font-semibold" class="ink-muted hover:text-paper transition">Home</NuxtLink>
        <NuxtLink to="/resume#about" active-class="text-paper font-semibold" class="ink-muted hover:text-paper transition">About</NuxtLink>
        <NuxtLink to="/work" active-class="underline underline-offset-4 decoration-periwinkle text-paper font-semibold" class="ink-muted hover:text-paper transition">Work</NuxtLink>
        <NuxtLink to="/resume#resume" active-class="text-paper font-semibold" class="ink-muted hover:text-paper transition">Resume</NuxtLink>
      </nav>

      <div class="flex items-center gap-4">
        <!-- Theme Switch with Sun / Moon Icons -->
        <ThemeSwitch />

        <button @click="toggleLang" class="text-xs font-display tracking-widest small-caps flex items-center gap-1 cursor-pointer">
          <span :class="lang === 'pt' ? 'underline underline-offset-4 decoration-periwinkle text-paper' : 'ink-muted'">Pt</span>
          <span class="ink-muted">|</span>
          <span :class="lang === 'en' ? 'underline underline-offset-4 decoration-periwinkle text-paper' : 'ink-muted'">En</span>
        </button>

        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-paper p-1 focus:outline-none" aria-label="Abrir menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Menu -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-navypanel border-b ink-border px-6 py-4 flex flex-col gap-4 text-sm font-display small-caps tracking-widest">
      <NuxtLink to="/" @click="mobileMenuOpen = false" class="text-paper hover:text-periwinkle transition">Home</NuxtLink>
      <NuxtLink to="/resume#about" @click="mobileMenuOpen = false" class="text-paper hover:text-periwinkle transition">About</NuxtLink>
      <NuxtLink to="/work" @click="mobileMenuOpen = false" class="text-paper hover:text-periwinkle transition">Work</NuxtLink>
      <NuxtLink to="/resume#resume" @click="mobileMenuOpen = false" class="text-paper hover:text-periwinkle transition">Resume</NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ThemeSwitch from '~/components/ui/ThemeSwitch.vue'

const mobileMenuOpen = ref(false)
const lang = ref('pt')

function toggleLang() {
  lang.value = lang.value === 'pt' ? 'en' : 'pt'
}
</script>
