<template>
  <div class="min-h-screen font-body antialiased flex flex-col justify-between relative">
    <a href="#main" class="skip-link">Pular para o conteúdo</a>
    <AppHeader />
    <main id="main" class="flex-1 pt-28">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
</script>
