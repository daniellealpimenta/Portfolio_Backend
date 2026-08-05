const fs = require('fs');
const path = require('path');

let allDefs = '';

function getSvgStr(filename) {
  const filepath = path.join(__dirname, 'assets', 'character', filename);
  return fs.readFileSync(filepath, 'utf8');
}

function extractDefs(svgStr) {
  const match = svgStr.match(/<defs>([\s\S]*?)<\/defs>/i);
  if (match) {
    let defsContent = match[1];
    defsContent = defsContent.replace(/stroke="black"/g, 'stroke="currentColor"');
    defsContent = defsContent.replace(/fill="black"/g, 'fill="currentColor"');
    allDefs += defsContent + '\n';
  }
  return svgStr.replace(/<defs>[\s\S]*?<\/defs>/i, '');
}

function extractContent(svgStr) {
  let cleanStr = extractDefs(svgStr);
  const match = cleanStr.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  let content = match ? match[1].trim() : '';
  content = content.replace(/stroke="black"/g, 'stroke="currentColor"');
  content = content.replace(/fill="black"/g, 'fill="currentColor"');
  return content;
}

const face = extractContent(getSvgStr('rosto.svg'));
const nose = extractContent(getSvgStr('Nariz.svg'));
const mouth = extractContent(getSvgStr('Boca.svg'));
const mustacheL = extractContent(getSvgStr('bigode esquerdo.svg'));
const mustacheR = extractContent(getSvgStr('bigode direito.svg'));
const eyeL = extractContent(getSvgStr('olho esquerdo.svg'));
const eyeR = extractContent(getSvgStr('olho direito.svg'));
const irisL = extractContent(getSvgStr('íris esquerda.svg'));
const irisR = extractContent(getSvgStr('íris direita.svg'));
const eyebrowL = extractContent(getSvgStr('sobrancelha esquerda.svg'));
const eyebrowR = extractContent(getSvgStr('sobrancelha direita.svg'));

const vueTemplate = `<template>
  <div 
    ref="containerRef"
    class="w-full h-full flex items-center justify-center overflow-visible text-navy dark:text-paper"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <svg 
      viewBox="0 0 817 815" 
      class="w-full h-full max-w-full overflow-visible"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        ${allDefs}
      </defs>

      <g 
        id="avatar" 
        :style="{ 
          transform: \`translate(\${currentHead.x}px, \${currentHead.y}px) rotate(\${currentHead.r}deg)\`,
          transformOrigin: '380px 407px'
        }"
      >
        <!-- Face Base -->
        <g id="face" style="transform: scale(1.12); transform-origin: 380px 407px;">
          ${face}
        </g>

        <!-- Eyebrows (Shifted up 15px) -->
        <g 
          id="left-eyebrow" 
          :style="{ 
            transform: \`translate(240px, \${205 + currentEyebrow.y}px) rotate(\${currentEyebrow.r}deg)\`,
            transformOrigin: '57px 28px'
          }"
        >
          ${eyebrowL}
        </g>
        <g 
          id="right-eyebrow" 
          :style="{ 
            transform: \`translate(410px, \${205 + currentEyebrow.y}px) rotate(\${currentEyebrow.r}deg)\`,
            transformOrigin: '57px 28px'
          }"
        >
          ${eyebrowR}
        </g>

        <!-- Eyes Container (Shifted up 15px) -->
        <g 
          id="eyes-container" 
          :style="{ 
            transform: \`scaleY(\${currentBlinkScale})\`,
            transformOrigin: '380px 305px'
          }"
        >
          <!-- Left Eye Group -->
          <g id="left-eye" transform="translate(245, 260) scale(1.15)">
            ${eyeL}
            <g id="left-iris" :style="{ 
              transform: \`translate(\${currentIrisL.x + 44 - 17}px, \${currentIrisL.y + 21 - 17}px) scale(0.65)\`,
              transformOrigin: '17px 17px'
            }">
              ${irisL}
            </g>
          </g>

          <!-- Right Eye Group -->
          <g id="right-eye" transform="translate(425, 260) scale(1.15)">
            ${eyeR}
            <g id="right-iris" :style="{ 
              transform: \`translate(\${currentIrisR.x + 45 - 17}px, \${currentIrisR.y + 20 - 17}px) scale(0.65)\`,
              transformOrigin: '17px 17px'
            }">
              ${irisR}
            </g>
          </g>
        </g>

        <!-- Nose (Shifted up 15px) -->
        <g id="nose" transform="translate(343, 300)">
          ${nose}
        </g>

        <!-- Mouth & Mustache Group -->
        <g 
          id="mouth-mustache"
          :style="{ 
            transform: \`translate(\${currentMouth.x}px, \${currentMouth.y}px) rotate(\${currentMouth.r}deg)\`,
            transformOrigin: '380px 440px'
          }"
        >
          <!-- Mustache (moved slightly apart by 5px each) -->
          <g id="left-mustache" transform="translate(300, 415)">
            ${mustacheL}
          </g>
          <g id="right-mustache" transform="translate(360, 415)">
            ${mustacheR}
          </g>

          <!-- Mouth (moved down 7px to create gap) -->
          <g id="mouth" transform="translate(325, 442)">
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
console.log('InteractiveAvatar updated with fine-tuned coordinates!');
