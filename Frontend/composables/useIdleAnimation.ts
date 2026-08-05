export function useIdleAnimation() {
  const getIdleNoise = (timestamp: number) => {
    const time = timestamp * 0.001
    return {
      x: Math.sin(time * 2) * 1.5,
      y: Math.cos(time * 1.5) * 1.5,
      rot: Math.sin(time * 0.8) * 1,
      eyebrow: Math.sin(time * 3) * 1
    }
  }
  return { getIdleNoise }
}
