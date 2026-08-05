const fs = require('fs');
const path = require('path');

const svgs = JSON.parse(fs.readFileSync('svgs.json', 'utf8'));

// Extract inner content of svg
function extractContent(svgStr) {
  const match = svgStr.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  return match ? match[1].trim() : '';
}

const face = extractContent(svgs['rosto.svg']);
const nose = extractContent(svgs['Nariz.svg']);
const mouth = extractContent(svgs['Boca.svg']);
const mustacheL = extractContent(svgs['bigode esquerdo.svg']);
const mustacheR = extractContent(svgs['bigode direito.svg']);
const eyeL = extractContent(svgs['olho esquerdo.svg']);
const eyeR = extractContent(svgs['olho direito.svg']);
const irisL = extractContent(svgs['íris esquerda.svg']);
const irisR = extractContent(svgs['íris direita.svg']);
const eyebrowL = extractContent(svgs['sobrancelha esquerda.svg']);
const eyebrowR = extractContent(svgs['sobrancelha direita.svg']);

const vueTemplate = `<template>
  <div 
    ref="containerRef"
    class="w-full h-full flex items-center justify-center overflow-visible"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <svg 
      viewBox="0 0 817 815" 
      class="w-full h-full max-w-full overflow-visible"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <g 
        id="avatar" 
        :style="{ 
          transform: \`translate(\${currentHead.x}px, \${currentHead.y}px) rotate(\${currentHead.r}deg)\`,
          transformOrigin: '408px 407px'
        }"
      >
        <!-- Face Base -->
        <g id="face">
          ${face}
        </g>

        <!-- Eyebrows -->
        <g 
          id="left-eyebrow" 
          :style="{ 
            transform: \`translate(220px, \${300 + currentEyebrow.y}px) rotate(\${currentEyebrow.r}deg)\`,
            transformOrigin: '57px 28px'
          }"
        >
          ${eyebrowL}
        </g>
        <g 
          id="right-eyebrow" 
          :style="{ 
            transform: \`translate(470px, \${300 + currentEyebrow.y}px) rotate(\${currentEyebrow.r}deg)\`,
            transformOrigin: '57px 28px'
          }"
        >
          ${eyebrowR}
        </g>

        <!-- Eyes Container (For Blinking) -->
        <g 
          id="eyes-container" 
          :style="{ 
            transform: \`scaleY(\${currentBlinkScale})\`,
            transformOrigin: '408px 370px'
          }"
        >
          <!-- Left Eye Group -->
          <g id="left-eye" transform="translate(230, 340)">
            ${eyeL}
            <g id="left-iris" :style="{ transform: \`translate(\${currentIrisL.x + 44 - 17}px, \${currentIrisL.y + 21 - 17}px)\` }">
              ${irisL}
            </g>
          </g>

          <!-- Right Eye Group -->
          <g id="right-eye" transform="translate(480, 340)">
            ${eyeR}
            <g id="right-iris" :style="{ transform: \`translate(\${currentIrisR.x + 45 - 17}px, \${currentIrisR.y + 20 - 17}px)\` }">
              ${irisR}
            </g>
          </g>
        </g>

        <!-- Nose -->
        <g id="nose" transform="translate(370, 390)">
          ${nose}
        </g>

        <!-- Mouth & Mustache Group -->
        <g 
          id="mouth-mustache"
          :style="{ 
            transform: \`translate(\${currentMouth.x}px, \${currentMouth.y}px) rotate(\${currentMouth.r}deg)\`,
            transformOrigin: '408px 520px'
          }"
        >
          <!-- Mustache -->
          <g id="left-mustache" transform="translate(305, 485)">
            ${mustacheL}
          </g>
          <g id="right-mustache" transform="translate(415, 485)">
            ${mustacheR}
          </g>

          <!-- Mouth -->
          <g id="mouth" transform="translate(350, 520)">
            ${mouth}
          </g>
        </g>

      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { useAvatarAnimation } from '~/composables/useAvatarAnimation'

const {
  containerRef,
  onMouseEnter,
  onMouseLeave,
  currentHead,
  currentIrisL,
  currentIrisR,
  currentEyebrow,
  currentMouth,
  currentBlinkScale
} = useAvatarAnimation()
</script>
`;

fs.writeFileSync(path.join(__dirname, 'components', 'ui', 'InteractiveAvatar.vue'), vueTemplate);
console.log('Component generated!');
