/* =========================================================================
   MAIN APP CONTROLLER — PAGE INITIALIZATION, ANIMATIONS, EVENTS & THEMES
   ========================================================================= */

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  wireCommonUI();

  // Load backend/fallback data concurrently
  const [projects, tools, skills, experiences, certificates, testimonials] = await Promise.all([
    fetchProjectsFromAPI(),
    fetchToolsFromAPI(),
    fetchSkillsFromAPI(),
    fetchExperiencesFromAPI(),
    fetchCertificatesFromAPI(),
    fetchTestimonialsFromAPI()
  ]);

  // Render components based on present elements in current HTML page
  if (document.getElementById('project-grid')) {
    const isHomePage = !!document.getElementById('hero-title');
    renderProjectsGrid(projects, 'all', isHomePage ? 3 : null);
  }

  if (document.getElementById('tools-grid-preview')) {
    renderToolsPreview(tools);
    renderToolsFull(tools);
  }

  if (document.getElementById('skills-grid-preview')) {
    renderSkillsPreview(skills);
    renderSkillsFull(skills);
  }

  if (document.getElementById('experiences-timeline')) {
    renderExperiencesTimeline(experiences);
  }

  if (document.getElementById('certificates')) {
    renderCertificatesList(certificates);
  }

  if (document.getElementById('testimonials')) {
    renderTestimonialsList(testimonials);
  }

  // Setup tab filter listeners for work page
  const tabs = document.getElementById('tabs');
  if (tabs) {
    tabs.addEventListener('click', e => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.dataset.active = 'false';
        b.classList.remove('bg-periwinkle', 'text-navy');
        b.classList.add('ink-muted');
      });
      btn.dataset.active = 'true';
      btn.classList.add('bg-periwinkle', 'text-navy');
      btn.classList.remove('ink-muted');
      renderProjectsGrid(projects, btn.dataset.filter);
    });
  }

  // Init GSAP animations
  runIntro({ hasHero: !!document.getElementById('hero-title') });
});

/* Theme Preference (LocalStorage) */
function initTheme() {
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
    const knob = document.getElementById('theme-knob');
    if (knob && window.gsap) gsap.set(knob, { x: 16 });
  }
}

/* Event Handlers & Global Wiring */
function wireCommonUI() {
  // Modal Close buttons
  document.querySelectorAll('.modal-close').forEach(btn =>
    btn.addEventListener('click', () => closeModal(btn.dataset.target))
  );

  document.querySelectorAll('[id$="-modal"]').forEach(modal =>
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(modal.id); })
  );

  // More Tools & Skills Modal triggers
  const toolsMore = document.getElementById('tools-more');
  if (toolsMore) toolsMore.addEventListener('click', () => openModal('tools-modal'));
  const skillsMore = document.getElementById('skills-more');
  if (skillsMore) skillsMore.addEventListener('click', () => openModal('skills-modal'));

  // Theme Toggle Button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light');
      const isLight = document.body.classList.contains('light');
      localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
      if (window.gsap) {
        gsap.to('#theme-knob', { x: isLight ? 16 : 0, duration: 0.25, ease: 'power2.out' });
      }
    });
  }

  // Mobile Menu Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    // Close drawer on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  // Language Toggle Placeholder
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const pt = document.getElementById('lang-pt');
      const en = document.getElementById('lang-en');
      if (!pt || !en) return;
      const ptActive = pt.classList.contains('underline');
      pt.classList.toggle('underline', !ptActive);
      pt.classList.toggle('ink-muted', ptActive);
      pt.classList.toggle('text-paper', !ptActive);
      en.classList.toggle('underline', ptActive);
      en.classList.toggle('ink-muted', !ptActive);
      en.classList.toggle('text-paper', ptActive);
    });
  }

  // Contact Form Submission Handler
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const status = document.getElementById('form-status');
      if (status) {
        status.textContent = 'Mensagem enviada com sucesso — obrigado pelo contato!';
        if (window.gsap) gsap.fromTo(status, { opacity: 0 }, { opacity: 1, duration: 0.4 });
      }
      e.target.reset();
    });
  }
}

/* GSAP Scroll & Hero Intro Animations */
function runIntro({ hasHero = false } = {}) {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    gsap.set('.pre-anim', { opacity: 1, y: 0 });
    return;
  }

  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });

  const logo = document.getElementById('logo');
  if (logo) {
    intro.fromTo('#logo', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 });
  }

  if (hasHero) {
    intro
      .fromTo('#hero-avatar', { opacity: 0, scale: 0.92, y: 12 }, { opacity: 1, scale: 1, y: 0, duration: 0.7 }, '-=0.15')
      .fromTo('#hero-title', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.45')
      .fromTo('#hero-sub', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .fromTo('#about-me-btn', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');
  } else {
    const pageHeroes = document.querySelectorAll('.page-hero');
    if (pageHeroes.length > 0) {
      intro.fromTo('.page-hero', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, '-=0.2');
    }
  }

  const logoBubble = document.querySelector('.logo-bubble');
  if (logoBubble) {
    intro.fromTo('.logo-bubble', { scale: 1 }, { scale: 1.15, duration: 0.35, yoyo: true, repeat: 1, ease: 'power1.inOut' }, '-=0.9');
  }

  document.querySelectorAll('.reveal-section').forEach(section => {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(section, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 82%' }
      });
    } else {
      gsap.to(section, { opacity: 1, y: 0, duration: 0.7 });
    }
  });

  const hobbiesOrbit = document.getElementById('hobby-orbit');
  if (hobbiesOrbit) {
    const HOBBIES = ['Código', 'Café', 'Livros', 'Música', 'Games', 'Fotografia', 'Corrida', 'Viagem'];
    const radius = 150, center = 170;
    hobbiesOrbit.innerHTML = `<svg class="absolute inset-0" width="340" height="340"><circle cx="170" cy="170" r="${radius}" fill="none" stroke="#212C50" stroke-width="1" stroke-dasharray="4 6"/></svg>` +
      HOBBIES.map((h, i) => {
        const angle = (i / HOBBIES.length) * 2 * Math.PI - Math.PI / 2;
        const x = center + radius * Math.cos(angle) - 32;
        const y = center + radius * Math.sin(angle) - 32;
        return `<div class="hobby-node" style="left:${x}px; top:${y}px;">${h}</div>`;
      }).join('');

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo('.hobby-node', { opacity: 0, scale: 0.7 }, {
        opacity: 1, scale: 1, duration: 0.5, stagger: 0.07, ease: 'back.out(1.6)',
        scrollTrigger: { trigger: '#hobby-orbit', start: 'top 85%' }
      });
    } else {
      gsap.to('.hobby-node', { opacity: 1, scale: 1, duration: 0.5 });
    }
  }
}
