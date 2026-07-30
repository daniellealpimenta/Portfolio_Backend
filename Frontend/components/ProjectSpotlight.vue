<template>
  <div class="space-y-12">
    <!-- Anchor Project 1: AgroBot -->
    <div class="project-spotlight">
      <div class="project-spotlight__media">
        <span class="project-spotlight__tag bg-lilac">Mobile</span>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#8FA0C4" stroke-width="1.2" opacity="0.6">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      </div>
      <div>
        <span class="eyebrow">TCC · 2026</span>
        <h3 class="font-display text-3xl small-caps text-paper font-semibold mt-2">AgroBot</h3>
        <p class="project-spotlight__desc">
          Aplicativo mobile de assistência agrícola desenvolvido em Swift. Projeto de TCC do curso de Engenharia de Software focado em solucionar desafios do campo com interface intuitiva e processamento offline.
        </p>
        <div class="project-spotlight__stack">
          <span>Swift</span>
          <span>SwiftUI</span>
          <span>SwiftData</span>
          <span>iOS</span>
        </div>
      </div>
    </div>

    <!-- Anchor Project 2: DioramaVirtual -->
    <div class="project-spotlight project-spotlight--reverse">
      <div class="project-spotlight__media">
        <span class="project-spotlight__tag bg-lilac">Mobile</span>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#8FA0C4" stroke-width="1.2" opacity="0.6">
          <circle cx="12" cy="12" r="10"/>
          <polygon points="10 8 16 12 10 16 10 8"/>
        </svg>
      </div>
      <div>
        <span class="eyebrow">Challenge 15 · 2025</span>
        <h3 class="font-display text-3xl small-caps text-paper font-semibold mt-2">DioramaVirtual</h3>
        <p class="project-spotlight__desc">
          App iOS interativo em SwiftUI e SwiftData, criado para o desafio Challenge 15 da Apple Developer Academy, integrando modelo 3D leve e animações nativas.
        </p>
        <div class="project-spotlight__stack">
          <span>SwiftUI</span>
          <span>SwiftData</span>
          <span>SceneKit</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
