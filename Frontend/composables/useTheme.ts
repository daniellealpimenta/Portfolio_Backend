import { ref, onMounted } from 'vue'

export type ThemeName = 'refined' | 'forest' | 'burgundy' | 'amber' | 'ocean' | 'slate'
export type ThemeMode = 'dark' | 'light'

// Global shared state
const currentTheme = ref<ThemeName>('refined')
const currentMode = ref<ThemeMode>('dark')
let isInitialized = false

export function useTheme() {
  onMounted(() => {
    if (isInitialized) return
    isInitialized = true

    const savedTheme = localStorage.getItem('portfolio-theme') as ThemeName
    if (savedTheme) currentTheme.value = savedTheme
    
    const savedMode = localStorage.getItem('portfolio-mode') as ThemeMode
    if (savedMode) {
      currentMode.value = savedMode
    } else {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        currentMode.value = 'light'
      }
    }
    
    applyTheme(currentTheme.value, currentMode.value)
  })

  function applyTheme(theme: ThemeName, mode: ThemeMode) {
    if (process.client) {
      document.body.setAttribute('data-theme', theme)
      if (mode === 'light') {
        document.body.classList.add('light')
      } else {
        document.body.classList.remove('light')
      }
    }
  }

  function setTheme(theme: ThemeName) {
    currentTheme.value = theme
    localStorage.setItem('portfolio-theme', theme)
    applyTheme(theme, currentMode.value)
  }

  function setMode(mode: ThemeMode) {
    currentMode.value = mode
    localStorage.setItem('portfolio-mode', mode)
    applyTheme(currentTheme.value, mode)
  }

  function toggleMode() {
    setMode(currentMode.value === 'dark' ? 'light' : 'dark')
  }

  return { currentTheme, currentMode, setTheme, setMode, toggleMode }
}
