import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        navy:      '#0A0F22',   // page background — deep, near-night blue
        navypanel: '#131B36',   // card / panel surface
        navyline:  '#212C50',   // borders & dividers
        mist:      '#8FA0C4',   // muted secondary text
        paper:     '#F1F0F7',   // primary text, soft lilac-white
        periwinkle:'#A8C0F0',   // primary accent
        lilac:     '#CBB8ED',   // tag — mobile
        mint:      '#A9E4C4',   // tag — data
        blush:     '#F0C4D3',   // tag — back / testimonials
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body:    ['"Inter"', 'sans-serif'],
      },
    }
  }
}
