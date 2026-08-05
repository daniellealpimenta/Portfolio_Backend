import { useState } from '#imports'

export function useLanguage() {
  const lang = useState<'pt' | 'en'>('global_lang', () => 'pt')
  
  function toggleLang() {
    lang.value = lang.value === 'pt' ? 'en' : 'pt'
  }

  return { lang, toggleLang }
}
