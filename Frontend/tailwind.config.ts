import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface:    'var(--color-surface)',
        border:     'var(--color-border)',
        muted:      'var(--color-muted)',
        text:       'var(--color-text)',
        primary:    'var(--color-primary)',
        secondary:  'var(--color-secondary)',
        success:    'var(--color-accent-1)',
        danger:     'var(--color-accent-2)',
        warning:    'var(--color-accent-3)',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body:    ['"Inter"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
    }
  }
}
