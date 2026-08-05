import { ref } from 'vue'

export function useBlink() {
  const targetBlinkScale = ref(1)
  let nextBlinkTime = 0

  const updateBlink = (timestamp: number) => {
    if (nextBlinkTime === 0) nextBlinkTime = timestamp + 2000

    if (timestamp > nextBlinkTime) {
      targetBlinkScale.value = 0.1
      setTimeout(() => { targetBlinkScale.value = 1 }, 150)
      nextBlinkTime = timestamp + 3000 + Math.random() * 5000
    }
  }

  return { targetBlinkScale, updateBlink }
}
