/* =========================================================================
   EFFECTS MODULE — starfield, cursor glow, magnetic buttons, scroll-spy,
   timeline draw-line.
   Carregue este arquivo DEPOIS do gsap/ScrollTrigger e ANTES (ou junto) do
   seu js/main.js. Tudo aqui é defensivo: se um elemento não existir na
   página, o trecho correspondente simplesmente não faz nada.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (!isFinePointer) {
    document.documentElement.classList.add('no-fine-pointer');
  }

  initStarfield({ reduceMotion });
  initCursorGlow({ enabled: isFinePointer && !reduceMotion });
  initMagneticButtons({ enabled: isFinePointer && !reduceMotion });
  initScrollDots();
  initTimelineDraw({ reduceMotion });
  initSpotlightCards({ reduceMotion, isFinePointer });
});

/* -------------------------------------------------------------------------
   Starfield — canvas discreto atrás do conteúdo
   ------------------------------------------------------------------------- */
function initStarfield({ reduceMotion }) {
  if (document.body.classList.contains('light')) return;

  let canvas = document.getElementById('starfield');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'starfield';
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let stars = [];
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const density = Math.min(140, Math.floor((width * height) / 9000));
    stars = Array.from({ length: density }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.2,
      baseAlpha: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005,
    }));
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#F1F0F7';
    stars.forEach(s => {
      const twinkle = reduceMotion ? s.baseAlpha : s.baseAlpha + Math.sin(time * s.speed + s.phase) * 0.2;
      ctx.globalAlpha = Math.max(0, Math.min(1, twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (!reduceMotion) requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
}

/* -------------------------------------------------------------------------
   Cursor glow — segue o ponteiro com leve atraso (gsap.quickTo se houver)
   ------------------------------------------------------------------------- */
function initCursorGlow({ enabled }) {
  if (!enabled) return;

  let glow = document.querySelector('.cursor-glow');
  if (!glow) {
    glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
  }

  if (window.gsap) {
    const moveX = gsap.quickTo(glow, 'x', { duration: 0.5, ease: 'power3.out' });
    const moveY = gsap.quickTo(glow, 'y', { duration: 0.5, ease: 'power3.out' });
    window.addEventListener('mousemove', e => { moveX(e.clientX); moveY(e.clientY); });
  } else {
    window.addEventListener('mousemove', e => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
  }
}

/* -------------------------------------------------------------------------
   Botões magnéticos — puxam sutilmente em direção ao cursor
   ------------------------------------------------------------------------- */
function initMagneticButtons({ enabled }) {
  const targets = document.querySelectorAll('[data-magnetic]');
  if (!enabled || targets.length === 0) return;

  targets.forEach(el => {
    const strength = 0.35;

    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      const x = relX * strength;
      const y = relY * strength;

      if (window.gsap) {
        gsap.to(el, { x, y, duration: 0.35, ease: 'power2.out' });
      } else {
        el.style.transform = `translate(${x}px, ${y}px)`;
      }
    });

    el.addEventListener('mouseleave', () => {
      if (window.gsap) {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      } else {
        el.style.transform = 'translate(0, 0)';
      }
    });
  });
}

/* -------------------------------------------------------------------------
   Scroll-spy dots — uma trilha de pontos fixa que acende conforme a seção
   Marque suas seções com data-section="rótulo" para que apareçam aqui.
   ------------------------------------------------------------------------- */
function initScrollDots() {
  const sections = document.querySelectorAll('[data-section]');
  if (sections.length === 0) return;

  const wrap = document.createElement('div');
  wrap.className = 'scroll-dots';
  sections.forEach((section, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', section.dataset.section);
    dot.dataset.active = i === 0 ? 'true' : 'false';
    dot.addEventListener('click', () => section.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    wrap.appendChild(dot);
  });
  document.body.appendChild(wrap);

  const dots = wrap.querySelectorAll('button');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const idx = [...sections].indexOf(entry.target);
        dots.forEach((d, i) => (d.dataset.active = i === idx ? 'true' : 'false'));
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );
  sections.forEach(s => observer.observe(s));
}

/* -------------------------------------------------------------------------
   Timeline draw-line — o traço da linha do tempo se desenha ao rolar
   ------------------------------------------------------------------------- */
function initTimelineDraw({ reduceMotion }) {
  const timeline = document.getElementById('experiences-timeline');
  if (!timeline) return;

  let track = timeline.querySelector('.timeline-track');
  if (!track) {
    track = document.createElement('div');
    track.className = 'timeline-track';
    const progress = document.createElement('div');
    progress.className = 'timeline-track__progress';
    track.appendChild(progress);
    timeline.prepend(track);
  }
  const progress = track.querySelector('.timeline-track__progress');

  if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
    progress.style.height = '100%';
    return;
  }

  gsap.to(progress, {
    height: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: timeline,
      start: 'top 70%',
      end: 'bottom 60%',
      scrub: 0.5,
    },
  });
}

/* -------------------------------------------------------------------------
   Spotlight Cards — Glow usando GSAP
   ------------------------------------------------------------------------- */
function initSpotlightCards({ reduceMotion, isFinePointer }) {
  if (!isFinePointer || reduceMotion) return;

  // Usa mutation observer para capturar os cards dinâmicos do UI.js
  const updateCards = () => document.querySelectorAll('.work-card, .project-spotlight__media');
  let cards = updateCards();

  const observer = new MutationObserver(() => {
    cards = updateCards();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  if (window.gsap) {
    window.addEventListener('pointermove', e => {
      if (cards.length === 0) return;
      const x = e.clientX;
      const y = e.clientY;
      const xp = x / window.innerWidth;
      const yp = y / window.innerHeight;
      
      gsap.to(cards, {
        "--x": x,
        "--y": y,
        "--xp": xp,
        "--yp": yp,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
  }
}
