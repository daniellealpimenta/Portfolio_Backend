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
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:    ['"Plus Jakarta Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        xxs:  ['0.5rem',   { lineHeight: '1.4' }],   // $fontSizeXS · XXS · 8pt
        xs:   ['0.875rem', { lineHeight: '1.4' }],   // $fontSizeS  · XS  · 14pt
        s:    ['1rem',     { lineHeight: '1.5' }],   // S  · 16pt
        m:    ['1.125rem', { lineHeight: '1.6' }],   // M  · 18pt
        l:    ['1.25rem',  { lineHeight: '1.4' }],   // L  · 20pt
        xl:   ['1.5rem',   { lineHeight: '1.25' }],  // XL  · 24pt
        xxl:  ['2rem',     { lineHeight: '1.15' }],  // XXL · 32pt
        xxxl: ['2.5rem',   { lineHeight: '1.08' }],  // XXXL · 40pt
      },
    }
  }
}
