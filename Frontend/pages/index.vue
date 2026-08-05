<template>
  <div class="h-screen flex items-center justify-center bg-background text-text">
    <p>Redirecionando para o seu portfólio...</p>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(() => {
  // Redireciona para o username recém criado
  router.push('/daniel.pimenta')
})
</script>
