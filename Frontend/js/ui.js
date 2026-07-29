/* =========================================================================
   UI RENDERING MODULE — MODAL CONTROLS & COMPONENT RENDERERS
   ========================================================================= */

const CAT_COLOR = { mobile: 'bg-lilac', back: 'bg-blush', data: 'bg-mint' };
const CAT_LABEL = { mobile: 'Mobile', back: 'Back', data: 'Data' };

function heartIcon() {
  return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="inline-block -mt-0.5"><path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.4-9.5 9-9.5 9Z"/></svg>';
}

/* Modals */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  const panel = modal.querySelector('[id$="-panel"]');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (window.gsap) {
    gsap.timeline()
      .fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power1.out' })
      .fromTo(panel, { opacity: 0, y: 24, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'expo.out' }, '-=0.15');
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  const panel = modal.querySelector('[id$="-panel"]');
  if (window.gsap && panel) {
    gsap.timeline({ onComplete: () => { modal.classList.add('hidden'); modal.classList.remove('flex'); } })
      .to(panel, { opacity: 0, y: 16, scale: 0.97, duration: 0.3, ease: 'power2.in' })
      .to(modal, { opacity: 0, duration: 0.2 }, '-=0.15');
  } else {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function openProjectModal(p) {
  const titleEl = document.getElementById('pm-title');
  const yearEl = document.getElementById('pm-year');
  const descEl = document.getElementById('pm-desc');
  const linksEl = document.getElementById('pm-links');

  if (titleEl) titleEl.innerHTML = p.title;
  if (yearEl) yearEl.textContent = p.year;
  if (descEl) descEl.textContent = p.desc;

  if (linksEl) {
    linksEl.innerHTML = `
      ${p.github_url ? `<a href="${p.github_url}" target="_blank" class="px-4 py-2 rounded-full border ink-border text-xs font-display small-caps ink-muted hover:text-paper transition flex items-center gap-1.5">🐙 GitHub</a>` : ''}
      ${p.test_url ? `<a href="${p.test_url}" target="_blank" class="px-4 py-2 rounded-full bg-periwinkle text-navy text-xs font-display small-caps hover:opacity-85 transition flex items-center gap-1.5">🔗 Demo Direct</a>` : ''}
    `;
  }

  openModal('project-modal');
}

/* Projects Rendering */
function renderProjectsGrid(projects, filter = 'all', limit = null) {
  const grid = document.getElementById('project-grid');
  if (!grid) return;
  grid.innerHTML = '';

  let list = projects.filter(p => filter === 'all' || p.cat === filter);
  if (limit) list = list.slice(0, limit);

  if (list.length === 0) {
    grid.innerHTML = '<p class="text-sm ink-muted col-span-full py-8 text-center">Nenhum projeto encontrado nesta categoria.</p>';
    return;
  }

  list.forEach(p => {
    const card = document.createElement('button');
    card.className = 'work-card text-left bg-navy rounded-2xl p-3 pre-anim border ink-border w-full flex flex-col justify-between';
    card.innerHTML = `
      <div>
        <div class="rounded-xl bg-navypanel h-28 mb-3 relative overflow-hidden flex items-center justify-center">
          <span class="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full text-navy font-display small-caps ${CAT_COLOR[p.cat] || 'bg-periwinkle'}">${CAT_LABEL[p.cat] || p.cat}</span>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#8FA0C4" stroke-width="1.2" opacity="0.6">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </div>
        <div class="flex items-center justify-between text-xs ink-muted">
          <span>${p.year}</span>
          <span class="flex items-center gap-1">${heartIcon()} ${p.likes}</span>
        </div>
        <p class="font-display text-sm mt-1.5 small-caps text-paper font-semibold">${p.title}</p>
      </div>
    `;
    card.addEventListener('click', () => openProjectModal(p));
    grid.appendChild(card);
  });

  if (window.gsap) {
    gsap.fromTo(grid.children, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.05 });
  }
}

/* Tools Rendering */
function renderToolsPreview(tools) {
  const preview = document.getElementById('tools-grid-preview');
  if (!preview) return;
  preview.innerHTML = tools.slice(0, 9).map(t => `
    <div class="icon-tile bg-navy border ink-border rounded-xl p-3 text-center">
      <div class="w-8 h-8 mx-auto mb-1 rounded bg-periwinkle/30 border ink-border flex items-center justify-center text-xs font-display text-periwinkle font-semibold">${t.name.slice(0, 2).toUpperCase()}</div>
      <p class="text-[10px] font-display small-caps text-paper truncate">${t.name}</p>
    </div>`).join('');
}

function renderToolsFull(tools) {
  const full = document.getElementById('tools-grid-full');
  if (!full) return;
  full.innerHTML = tools.map(t => `
    <div class="icon-tile bg-navy border ink-border rounded-xl p-3 text-center">
      <div class="w-8 h-8 mx-auto mb-1 rounded bg-periwinkle/30 border ink-border flex items-center justify-center text-xs font-display text-periwinkle font-semibold">${t.name.slice(0, 2).toUpperCase()}</div>
      <p class="text-[10px] font-display small-caps text-paper truncate">${t.name}</p>
    </div>`).join('');
}

/* Skills Rendering */
function renderSkillsPreview(skills) {
  const preview = document.getElementById('skills-grid-preview');
  if (!preview) return;
  preview.innerHTML = skills.map(s => `
    <div class="icon-tile bg-navy border ink-border rounded-xl p-3 text-center">
      <div class="w-8 h-8 mx-auto mb-1 rounded bg-lilac/30 border ink-border flex items-center justify-center text-xs font-display text-lilac font-semibold">${s.name.slice(0, 2).toUpperCase()}</div>
      <p class="text-[10px] font-display small-caps text-paper truncate">${s.name}</p>
    </div>`).join('');
}

function renderSkillsFull(skills) {
  const full = document.getElementById('skills-list-full');
  if (!full) return;
  full.innerHTML = skills.map(s => `
    <div class="flex items-start gap-4">
      <div class="w-10 h-10 shrink-0 rounded bg-lilac/30 border ink-border flex items-center justify-center font-display text-lilac font-semibold text-sm">${s.name.slice(0, 2).toUpperCase()}</div>
      <div>
        <p class="font-display small-caps text-paper font-semibold">${s.name}</p>
        <p class="ink-muted text-sm mt-0.5">${s.desc}</p>
      </div>
    </div>`).join('');
}

/* Experiences Rendering */
function renderExperiencesTimeline(experiences) {
  const container = document.getElementById('experiences-timeline');
  if (!container) return;
  container.innerHTML = experiences.map(e => `
    <div class="page-hero relative">
      <span class="timeline-dot absolute -left-[27px] top-1.5"></span>
      <p class="font-display small-caps text-sm ink-muted">${e.year}</p>
      <h4 class="font-display font-semibold text-paper">${e.title}</h4>
      <p class="ink-muted text-sm mt-1">${e.desc}</p>
    </div>
  `).join('');
}

/* Certificates Rendering */
function renderCertificatesList(certificates) {
  const container = document.getElementById('certificates');
  if (!container) return;
  container.innerHTML = certificates.map(c => `
    <div class="flex items-center justify-between bg-navypanel border ink-border rounded-2xl px-5 py-3 pre-anim">
      <div>
        <p class="font-display small-caps text-sm text-paper font-semibold">${c.title}</p>
        <p class="text-xs ink-muted mt-0.5">${c.issuer}</p>
      </div>
      <span class="text-xs ink-muted border ink-border px-3 py-1 rounded-full">🎓 Verificado</span>
    </div>`).join('');
}

/* Testimonials Rendering */
function renderTestimonialsList(testimonials) {
  const wrap = document.getElementById('testimonials');
  if (!wrap) return;
  wrap.innerHTML = testimonials.map((t, i) => `
    <div class="flex ${i % 2 ? 'md:flex-row-reverse text-right' : ''} items-start gap-5 pre-anim">
      <div class="w-16 h-16 rounded-full bg-navypanel border ink-border shrink-0 flex items-center justify-center font-display text-periwinkle font-semibold text-xl">${t.name.slice(0, 1)}</div>
      <div>
        <p class="text-2xl leading-none text-periwinkle/50">&ldquo;</p>
        <p class="ink-muted leading-relaxed max-w-md">${t.quote}</p>
        <p class="font-display small-caps text-sm mt-3 text-paper font-semibold">${t.name}</p>
      </div>
    </div>`).join('');
}
