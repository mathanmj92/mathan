// Static Portfolio Frontend (GitHub Pages compatible)
let portfolioData = null;
const eventState = { type: 'all', expanded: false };
const INITIAL_EVENTS = 6;
const pubState = { q: '', cat: 'all', year: 'all', expanded: false };
const SELECTED_FALLBACK = 6;

// Sections that can be reordered or hidden from admin (Settings > Section order)
const SECTION_LABELS = { research: 'Research', appsDetail: 'Apps', publications: 'Publications', experience: 'Experience', skills: 'Skills', courses: 'Courses', events: 'Events', gallery: 'Gallery', jobsSection: 'Open positions', mentors: 'Mentors' };
const DEFAULT_SECTION_ORDER = ['about', 'research', 'appsDetail', 'publications', 'experience', 'skills', 'courses', 'events', 'gallery', 'jobsSection', 'mentors', 'contact'];

function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function dataJsonCandidates() {
  // Try multiple paths (GitHub Pages root, subfolder, relative to script)
  const list = ['./data.json', 'data.json'];
  try {
    const scripts = document.getElementsByTagName('script');
    for (const s of scripts) {
      if (s.src && s.src.indexOf('script.js') !== -1) {
        const base = s.src.replace(/script\.js(\?.*)?$/, '');
        list.unshift(base + 'data.json');
        break;
      }
    }
  } catch (e) {}
  const path = window.location.pathname || '';
  if (path && path !== '/') {
    const dir = path.endsWith('/') ? path : path.replace(/\/[^/]*$/, '/');
    list.push(dir + 'data.json');
  }
  return [...new Set(list)];
}

async function fetchWithTimeout(url, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url + (url.indexOf('?') >= 0 ? '&' : '?') + 't=' + Date.now(), { signal: ctrl.signal, cache: 'no-cache' });
  } finally {
    clearTimeout(t);
  }
}

async function loadData() {
  const candidates = dataJsonCandidates();
  let lastErr = null;
  for (const url of candidates) {
    try {
      const res = await fetchWithTimeout(url, 12000);
      if (!res.ok) { lastErr = new Error(url + ' returned HTTP ' + res.status); continue; }
      portfolioData = await res.json();
      applyThemeColors();
      renderAll();
      hideLoader();
      return;
    } catch (err) {
      console.warn('[portfolio] Failed', url, err);
      lastErr = err;
    }
  }
  const msg = (lastErr && lastErr.message) ? lastErr.message : 'Could not load data.json';
  showError(esc(msg) + '<br><span class="text-xs">Tried: ' + candidates.map(esc).join(', ') + '</span>');
}

function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => { loader.style.display = 'none'; }, 400);
  }
}

function showError(msg) {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.innerHTML = `
      <div class="text-center max-w-md px-4" style="color:#B4441A">
        <p class="font-semibold text-lg">Failed to load portfolio data</p>
        <p class="text-sm mt-2" style="color:var(--text-muted)">${msg}</p>
        <p class="text-xs mt-3" style="color:var(--text-muted)">Upload <b>index.html</b>, <b>script.js</b> and <b>data.json</b> in the <b>same folder</b> (repo root or /docs). File names are case-sensitive.</p>
        <button onclick="location.reload()" class="mt-4 px-4 py-2 rounded-lg text-sm" style="background:var(--color-primary-600);color:var(--on-primary)">Retry</button>
      </div>`;
  }
}

// Darken a hex colour toward black. Keeps the hue but lets small link text reach 4.5:1 on light backgrounds.
function shadeHex(hex, amount) {
  let h = String(hex || '').trim().replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) return hex;
  const n = parseInt(h, 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => Math.round(v * (1 - amount)));
  return '#' + ch.map(v => v.toString(16).padStart(2, '0')).join('');
}

// Inline placeholder for broken images (no network request, so it cannot fail or loop)
const IMG_FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="#E2D6C2"/><path d="M90 200l40-50 30 36 24-28 46 42z" fill="#2E6F73"/><circle cx="116" cy="112" r="16" fill="#2E6F73"/></svg>'
);

// Palette defaults: #0A0F14 ink, #0F3D3E deep teal, #2E6F73 teal, #7FB3B8 mist, #EADCC8 sand, #C6601F ember
function applyThemeColors() {
  const tc = portfolioData?.settings?.themeColors || {};
  const L = {
    from: tc.lightGradientFrom || '#2E6F73', to: tc.lightGradientTo || '#0F3D3E',
    bg: tc.lightBackground || '#F6F1E8', surface: tc.lightSurface || '#FCFAF6', text: tc.lightText || '#0A0F14',
    accent: tc.lightAccent || '#C6601F', muted: tc.lightMuted || '#4A5D60', border: tc.lightBorder || '#E2D6C2'
  };
  const D = {
    from: tc.darkGradientFrom || '#2E6F73', to: tc.darkGradientTo || '#0F3D3E',
    bg: tc.darkBackground || '#0A0F14', surface: tc.darkSurface || '#0F1A1F', text: tc.darkText || '#EADCC8',
    primary: tc.darkPrimary || '#7FB3B8', accent: tc.darkAccent || '#C6601F', muted: tc.darkMuted || '#94ADB0', border: tc.darkBorder || '#1E3A3D'
  };
  const root = document.documentElement;
  ['--gradient-from', '--gradient-to', '--bg-page', '--bg-card', '--text-main', '--color-primary-500', '--color-primary-600', '--color-primary-800']
    .forEach(v => root.style.removeProperty(v));

  let styleEl = document.getElementById('dynamicThemeColors');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'dynamicThemeColors';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = `
    :root {
      --gradient-from: ${L.from}; --gradient-to: ${L.to}; --accent: ${L.accent};
      --bg-page: ${L.bg}; --bg-card: ${L.surface}; --text-main: ${L.text};
      --text-muted: ${L.muted}; --border-color: ${L.border}; --on-primary: #FFFFFF;
      --color-primary-50: color-mix(in srgb, ${L.from} 9%, transparent);
      --color-primary-100: color-mix(in srgb, ${L.from} 16%, transparent);
      --color-primary-500: ${L.from};
      --color-primary-600: ${tc.lightPrimary || shadeHex(L.from, 0.14)};
      --color-primary-700: ${shadeHex(L.from, 0.24)};
      --color-primary-800: ${shadeHex(L.from, 0.3)};
      --color-primary-900: ${shadeHex(L.from, 0.4)};
      --tile-bg: ${tc.lightTileBg || L.to}; --tile-fg: #EADCC8;
    }
    .dark {
      --gradient-from: ${D.from}; --gradient-to: ${D.to}; --accent: ${D.accent};
      --bg-page: ${D.bg}; --bg-card: ${D.surface}; --text-main: ${D.text};
      --text-muted: ${D.muted}; --border-color: ${D.border}; --on-primary: #0A0F14;
      --color-primary-50: color-mix(in srgb, ${D.primary} 13%, transparent);
      --color-primary-100: color-mix(in srgb, ${D.primary} 20%, transparent);
      --color-primary-500: ${D.primary};
      --color-primary-600: ${D.primary};
      --color-primary-700: ${D.text};
      --color-primary-800: ${D.text};
      --color-primary-900: ${D.text};
      --tile-bg: ${tc.darkTileBg || '#EADCC8'}; --tile-fg: ${D.to};
    }
  `;
}

function categoryBadgeClass(cat) {
  if (!cat) return 'cat-badge cat-default';
  const c = String(cat).toLowerCase().replace(/\s+/g, '_');
  const known = {
    article: 'cat-article',
    book_chapter: 'cat-book_chapter', 'book-chapter': 'cat-book_chapter', books: 'cat-books', book: 'cat-books',
    conference: 'cat-conference', workshop: 'cat-workshop',
    videos: 'cat-videos', video: 'cat-videos',
    document: 'cat-document', documents: 'cat-document',
    website: 'cat-website', websites: 'cat-website'
  };
  for (const k of Object.keys(known)) {
    if (c === k || c.includes(k)) return 'cat-badge ' + known[k];
  }
  const palette = ['cat-article', 'cat-book_chapter', 'cat-conference', 'cat-workshop', 'cat-videos', 'cat-document', 'cat-website'];
  let hash = 0;
  for (let i = 0; i < c.length; i++) hash = ((hash << 5) - hash) + c.charCodeAt(i);
  return 'cat-badge ' + palette[Math.abs(hash) % palette.length];
}

function getInitials(name) {
  if (!name) return '??';
  return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function humanizeCategory(cat) {
  if (!cat) return 'Other';
  return String(cat).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function renderAll() {
  if (!portfolioData) return;
  renderHero();
  renderKeywords();
  renderApps();
  renderAppsDetail();
  renderExperience();
  renderResearchAreas();
  renderSkills();
  renderMentors();
  setupPublications();
  renderEvents();
  renderNews();
  renderGallery();
  renderCourses();
  renderJobs();
  renderContact();
  setupEventFilters();
  applySectionOrder();
  enhanceInteractiveCards();
  if (typeof initScrollSpy === 'function') initScrollSpy();
  if (typeof initReveal === 'function') initReveal();
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  if (portfolioData.settings?.footerText) {
    document.getElementById('footerText').textContent = portfolioData.settings.footerText;
  }
  document.title = portfolioData.settings?.siteTitle || ((portfolioData.profile?.name || 'Portfolio') + ' | Portfolio');
}

/* ---------- Section order and visibility (admin: Settings > Section order) ---------- */
function applySectionOrder() {
  const main = document.getElementById('main');
  if (!main) return;
  const s = portfolioData.settings || {};
  const saved = Array.isArray(s.sectionOrder) ? s.sectionOrder.filter(id => DEFAULT_SECTION_ORDER.includes(id)) : [];
  const order = [...saved, ...DEFAULT_SECTION_ORDER.filter(id => !saved.includes(id))];
  const hidden = new Set(Array.isArray(s.hiddenSections) ? s.hiddenSections : []);
  order.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    main.appendChild(el);
    if (hidden.has(id)) el.setAttribute('data-admin-hidden', '');
    else el.removeAttribute('data-admin-hidden');
  });
  buildNavigation(order, hidden);
}

function buildNavigation(order, hidden) {
  const nav = document.getElementById('mainNav');
  const drawerNav = document.getElementById('drawerNav');
  if (!nav) return;
  const emptySection = id => {
    const el = document.getElementById(id);
    return !el || el.hasAttribute('hidden') || hidden.has(id);
  };
  const sectionLinks = Array.from(nav.querySelectorAll('a[data-sec]:not([data-fixed])'));
  const fixedLinks = Array.from(nav.querySelectorAll('a[data-fixed]'));
  sectionLinks.sort((a, b) => order.indexOf(a.dataset.sec) - order.indexOf(b.dataset.sec));
  sectionLinks.forEach(a => { a.hidden = emptySection(a.dataset.sec); nav.appendChild(a); });
  fixedLinks.forEach(a => {
    a.hidden = !!(a.dataset.sec && emptySection(a.dataset.sec));
    nav.appendChild(a);
  });
  if (drawerNav) {
    const items = order.filter(id => SECTION_LABELS[id] && !emptySection(id)).map(id => ({ href: '#' + id, label: SECTION_LABELS[id] }));
    items.push({ href: 'collections.html', label: 'Collections' });
    if (!emptySection('contact')) items.push({ href: '#contact', label: 'Contact' });
    drawerNav.innerHTML = items.map(a =>
      `<a href="${esc(a.href)}" onclick="closeDrawer()" class="px-4 py-3 rounded-lg" style="color: var(--text-main)">${esc(a.label)}</a>`
    ).join('');
  }
}

/* ---------- Hero ---------- */
function renderHero() {
  const p = portfolioData.profile || {};
  const name = p.name || 'Researcher';
  const initials = getInitials(name);

  document.getElementById('headerName').textContent = name;
  document.getElementById('headerTitle').textContent = p.title || '';
  document.getElementById('headerInitials').textContent = initials;
  document.getElementById('heroName').textContent = name;
  document.getElementById('heroTitle').textContent = p.title || '';
  document.getElementById('heroBio').textContent = p.bio || '';
  document.getElementById('heroInitials').textContent = initials;

  const inst = portfolioData.experience?.[0]?.organization || '';
  const instEl = document.getElementById('heroInstitution');
  instEl.textContent = inst;
  instEl.classList.toggle('hidden', !inst);

  const photoEl = document.getElementById('heroPhoto');
  const initialsBox = document.getElementById('heroInitialsBox');
  if (p.photo) {
    photoEl.src = p.photo;
    photoEl.classList.remove('hidden');
    initialsBox.classList.add('hidden');
    photoEl.onerror = () => { photoEl.classList.add('hidden'); initialsBox.classList.remove('hidden'); };
  }

  const metrics = p.metrics || {};
  document.getElementById('metricsContainer').innerHTML = [
    { label: 'Citations', value: metrics.citations },
    { label: 'h-index', value: metrics.hIndex },
    { label: 'i10-index', value: metrics.i10Index },
    { label: 'Publications', value: metrics.publications || (portfolioData.publications?.length || 0) }
  ].filter(m => m.value != null).map(m => `
    <div class="metric-card px-4 py-2 rounded-xl text-center min-w-[80px] shadow-sm">
      <div class="text-lg font-bold leading-tight">${esc(m.value)}</div>
      <div class="text-[11px] opacity-90">${esc(m.label)}</div>
    </div>
  `).join('');

  renderSocialIcons('socialLinksContainer', { includeEmail: true });
  applyHeroBackdrop();
}

function applyHeroBackdrop() {
  const p = portfolioData.profile || {};
  const url = (p.backdrop || '').trim();
  const opacity = parseFloat(p.backdropOpacity != null ? p.backdropOpacity : 0.35);
  const el = document.getElementById('heroBackdrop');
  if (!el) return;
  if (url) {
    el.style.backgroundImage = 'url("' + url.replace(/"/g, '') + '")';
    el.style.display = 'block';
    el.style.opacity = String(Math.min(0.85, Math.max(0.05, opacity)));
  } else {
    el.style.display = 'none';
    el.style.backgroundImage = '';
  }
}

function renderSocialIcons(containerId, opts) {
  opts = opts || {};
  const social = portfolioData.socialLinks || {};
  const icons = {
    linkedin: 'fab fa-linkedin', twitter: 'fab fa-twitter', github: 'fab fa-github', scholar: 'fas fa-graduation-cap',
    orcid: 'fab fa-orcid', researchgate: 'fab fa-researchgate', facebook: 'fab fa-facebook', instagram: 'fab fa-instagram',
    youtube: 'fab fa-youtube', website: 'fas fa-globe'
  };
  const linkClass = 'soc-link text-lg inline-flex items-center justify-center w-8 h-8';
  const parts = Object.entries(social)
    .filter(([k, v]) => v && icons[k])
    .map(([k, url]) => `
      <a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="${linkClass}" title="${esc(k)}" aria-label="${esc(k)}">
        <i class="${icons[k]}" aria-hidden="true"></i>
      </a>`);
  if (opts.includeEmail) {
    const email = portfolioData.profile?.email || portfolioData.contact?.email || '';
    if (email) {
      parts.unshift(`
      <a href="mailto:${esc(email)}" class="${linkClass}" title="Email" aria-label="Email">
        <i class="fas fa-envelope" aria-hidden="true"></i>
      </a>`);
    }
  }
  const cvUrl = (portfolioData.profile?.cvUrl || portfolioData.profile?.cv || portfolioData.settings?.cvUrl || '').trim();
  if (opts.includeEmail && cvUrl) {
    parts.push(`
      <a href="${esc(cvUrl)}" target="_blank" rel="noopener noreferrer" class="${linkClass}" title="Curriculum Vitae" aria-label="Curriculum Vitae">
        <i class="fas fa-file-alt" aria-hidden="true"></i>
      </a>`);
  }
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = parts.join('');
}

function renderKeywords() {
  const keywords = portfolioData.profile?.keywords || [];
  document.getElementById('keywordsList').innerHTML = keywords.map(k => `
    <span class="skill-tag px-3 py-1.5 rounded-full text-sm font-medium">${esc(k)}</span>
  `).join('');
}

/* ---------- Apps launcher (admin: Apps tab) ---------- */
const APP_ICONS = {
  manimo: 'fas fa-wave-square', manim: 'fas fa-wave-square',
  atelier: 'fas fa-pen-ruler', 'atelier lite': 'fas fa-pen-ruler',
  attainly: 'fas fa-bullseye',
  researcher: 'fas fa-flask-vial', 'ex researcher': 'fas fa-flask-vial',
  formify: 'fas fa-clipboard-list', forms: 'fas fa-clipboard-list',
  book: 'fas fa-book-open', chart: 'fas fa-chart-line', code: 'fas fa-code', app: 'fas fa-table-cells-large'
};

function appIconHtml(app) {
  const raw = String(app.icon || '').trim();
  if (/^(https?:\/\/|assets\/|\.\/)/i.test(raw)) {
    return `<img src="${esc(raw)}" alt="" width="32" height="32" loading="lazy">`;
  }
  let cls = APP_ICONS[raw.toLowerCase()] || APP_ICONS[String(app.name || '').toLowerCase()];
  if (!cls && /^fa[a-z]?\s/.test(raw)) cls = raw;               // "fas fa-flask"
  if (!cls && /^fa-/.test(raw)) cls = 'fas ' + raw;             // "fa-flask"
  return `<i class="${esc(cls || APP_ICONS.app)}" aria-hidden="true"></i>`;
}

function renderApps() {
  const section = document.getElementById('apps');
  const row = document.getElementById('appsRow');
  if (!section || !row) return;
  const apps = (portfolioData.apps || []).filter(a => a && a.name);
  if (!apps.length) { section.hidden = true; return; }
  section.hidden = false;
  row.innerHTML = apps.map(a => {
    const url = String(a.url || '').trim();
    const live = /^https?:\/\/\S+/i.test(url);
    const inner = `
      <span class="app-tile-icon">${appIconHtml(a)}</span>
      <span class="app-name text-[10px] font-medium text-center leading-tight whitespace-nowrap transition-colors" style="color: var(--text-main)">${esc(a.name)}</span>`;
    const cls = 'app-tile flex flex-col items-center gap-0.5 min-w-[44px] flex-shrink-0';
    return live
      ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="${cls}" role="listitem" title="${esc(a.tagline || a.name)}" aria-label="Open ${esc(a.name)} (opens in a new tab)">${inner}</a>`
      : `<div class="${cls} is-soon" role="listitem" title="Link coming soon" aria-label="${esc(a.name)} (link coming soon)">${inner}</div>`;
  }).join('');
}

/* ---------- Apps in detail: cards that open the popup (admin: Apps tab) ---------- */
function appHasDetail(a) {
  return a && a.name && ((a.features || []).length || (a.usage || []).length || a.summary);
}

function appDetailItem(a) {
  const url = String(a.url || '').trim();
  const links = [];
  if (/^https?:\/\/\S+/i.test(url)) links.push({ label: 'Open ' + a.name, url });
  (a.links || []).filter(l => l && l.url).forEach(l => links.push({ label: l.label || 'Link', url: l.url, icon: 'fa-download' }));
  return {
    title: a.name,
    meta: a.tagline || '',
    badges: a.platform ? ['<span class="cat-badge cat-website">' + esc(a.platform) + '</span>'] : [],
    iconHtml: '<span class="app-tile-icon flex-shrink-0" style="width:48px;height:48px;border-radius:0.8rem;font-size:1.25rem">' + appIconHtml(a) + '</span>',
    body: a.summary || '',
    features: a.features || [],
    steps: a.usage || [],
    notes: a.notes || '',
    links
  };
}

function renderAppsDetail() {
  const section = document.getElementById('appsDetail');
  const list = document.getElementById('appsDetailList');
  if (!section || !list) return;
  const apps = (portfolioData.apps || []).filter(appHasDetail);
  if (!apps.length) { section.hidden = true; return; }
  section.hidden = false;
  detailSets.apps = apps.map(appDetailItem);
  list.innerHTML = apps.map((a, i) => `
    <button type="button" class="card rounded-2xl p-4 shadow-sm text-left w-full cursor-pointer" onclick="openDetail('apps', ${i})" aria-haspopup="dialog">
      <div class="flex gap-4 items-center">
        <span class="app-tile-icon flex-shrink-0" style="width:56px;height:56px;border-radius:0.9rem;font-size:1.4rem">${appIconHtml(a)}</span>
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="font-semibold text-base leading-snug" style="color: var(--text-main)">${esc(a.name)}</h3>
            ${a.platform ? `<span class="text-xs px-2 py-0.5 rounded-full skill-tag">${esc(a.platform)}</span>` : ''}
          </div>
          ${a.tagline ? `<p class="text-sm mt-1" style="color: var(--color-primary-600)">${esc(a.tagline)}</p>` : ''}
          ${a.summary ? `<p class="text-sm mt-1 line-clamp-2" style="color: var(--text-muted)">${esc(a.summary)}</p>` : ''}
        </div>
        <i class="fas fa-chevron-right text-xs flex-shrink-0" style="color: var(--text-muted)" aria-hidden="true"></i>
      </div>
    </button>`).join('');
}

/* ---------- Detail popup (research, experience, events, skills) ---------- */
const detailSets = {};
let detailKey = null;
let detailIndex = 0;
let lastFocus = null;

function openDetail(key, i) {
  const set = detailSets[key];
  if (!set || !set[i]) return;
  lastFocus = document.activeElement;
  detailKey = key;
  detailIndex = i;
  fillDetail();
  const m = document.getElementById('detailModal');
  m.classList.remove('hidden'); m.classList.add('flex');
  document.body.style.overflow = 'hidden';
  const close = m.querySelector('button');
  if (close) close.focus();
}

function fillDetail() {
  const set = detailSets[detailKey] || [];
  const it = set[detailIndex];
  if (!it) return;
  const img = document.getElementById('dtImage');
  if (it.image) {
    img.onerror = () => img.classList.add('hidden');
    img.src = it.image;
    img.alt = it.title || '';
    img.classList.remove('hidden');
  } else {
    img.classList.add('hidden');
    img.removeAttribute('src');
  }
  const badgesEl = document.getElementById('dtBadges');
  badgesEl.innerHTML = (it.iconHtml ? it.iconHtml : '') + (it.badges || []).join('');
  badgesEl.classList.toggle('items-center', !!it.iconHtml);
  document.getElementById('dtMeta').textContent = it.meta || '';
  document.getElementById('dtTitle').textContent = it.title || '';
  document.getElementById('dtBody').textContent = it.body || '';
  document.getElementById('dtExtra').innerHTML = it.level != null
    ? `<div class="mb-4"><div class="flex justify-between text-xs mb-1" style="color: var(--text-muted)"><span>Proficiency</span><span>${esc(it.level)}%</span></div><div class="h-1.5 rounded-full overflow-hidden" style="background: var(--color-primary-50)"><div class="h-full rounded-full" style="width:${esc(it.level)}%; background: linear-gradient(90deg, var(--gradient-from), var(--accent))"></div></div></div>`
    : '';
  const feat = (it.features || []).map(x => `<li class="flex gap-2.5 text-sm leading-relaxed"><i class="fas fa-check text-xs mt-1.5 flex-shrink-0" style="color: var(--accent)" aria-hidden="true"></i><span>${esc(x)}</span></li>`).join('');
  const steps = (it.steps || []).map((x, i) => `<li class="flex gap-3 text-sm leading-relaxed"><span class="step-num" aria-hidden="true">${i + 1}</span><span class="pt-0.5">${esc(x)}</span></li>`).join('');
  document.getElementById('dtSections').innerHTML = (feat || steps || it.notes) ? `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      ${feat ? `<div><h4 class="font-semibold mb-3" style="font-family: var(--serif); font-size: 1.1rem; color: var(--text-main)">Features</h4><ul class="space-y-2.5">${feat}</ul></div>` : ''}
      ${steps ? `<div><h4 class="font-semibold mb-3" style="font-family: var(--serif); font-size: 1.1rem; color: var(--text-main)">How to use it</h4><ol class="space-y-3">${steps}</ol></div>` : ''}
    </div>
    ${it.notes ? `<p class="text-sm mt-6 pt-4 leading-relaxed" style="color: var(--text-muted); border-top: 1px solid var(--border-color)"><strong style="color: var(--text-main)">Good to know:</strong> ${esc(it.notes)}</p>` : ''}` : '';
  document.getElementById('dtLinks').innerHTML = (it.links || []).map((l, i) =>
    `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style="${i === 0 ? 'background: var(--color-primary-600); color: var(--on-primary)' : 'background: var(--color-primary-50); color: var(--color-primary-800); border: 1px solid var(--border-color)'}">${esc(l.label)} <i class="fas ${l.icon || 'fa-arrow-up-right-from-square'} text-xs" aria-hidden="true"></i></a>`).join('');
  const many = set.length > 1;
  document.getElementById('dtPrev').hidden = !many;
  document.getElementById('dtNext').hidden = !many;
  document.getElementById('dtCount').textContent = many ? (detailIndex + 1) + ' of ' + set.length : '';
}

function stepDetail(d) {
  const set = detailSets[detailKey] || [];
  if (set.length < 2) return;
  detailIndex = (detailIndex + d + set.length) % set.length;
  fillDetail();
  const body = document.querySelector('#detailModal .overflow-y-auto');
  if (body) body.scrollTop = 0;
}

function closeDetail() {
  const m = document.getElementById('detailModal');
  if (!m || m.classList.contains('hidden')) return;
  m.classList.add('hidden'); m.classList.remove('flex');
  document.body.style.overflow = '';
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

/* ---------- Research areas ---------- */
function renderResearchAreas() {
  const areas = portfolioData.researchAreas || [];
  detailSets.research = areas.map(a => ({
    title: a.title, image: a.image, body: a.description,
    meta: a.years ? a.years + (Number(a.years) === 1 ? ' year' : ' years') + ' of experience' : ''
  }));
  document.getElementById('researchAreasList').innerHTML = areas.map((a, i) => `
    <button type="button" class="card rounded-2xl p-4 shadow-sm text-left w-full cursor-pointer" onclick="openDetail('research', ${i})" aria-haspopup="dialog">
      <div class="flex gap-4 items-center">
        ${a.image ? `<img src="${esc(a.image)}" alt="" width="64" height="64" class="w-16 h-16 rounded-xl object-cover flex-shrink-0" loading="lazy" onerror="this.style.display='none'">` : ''}
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="font-semibold text-base leading-snug" style="color: var(--text-main)">${esc(a.title)}</h3>
            ${a.years ? `<span class="text-xs px-2 py-0.5 rounded-full skill-tag">${esc(a.years)} ${Number(a.years) === 1 ? 'year' : 'years'}</span>` : ''}
          </div>
          ${a.description ? `<p class="text-sm mt-1 line-clamp-2" style="color: var(--text-muted)">${esc(a.description)}</p>` : ''}
        </div>
        <i class="fas fa-chevron-right text-xs flex-shrink-0" style="color: var(--text-muted)" aria-hidden="true"></i>
      </div>
    </button>
  `).join('') || '<p style="color:var(--text-muted)">No research areas listed.</p>';
}

/* ---------- Experience and education ---------- */
function parsePeriodEndYear(period) {
  if (!period) return 0;
  const s = String(period);
  if (/present|current/i.test(s)) return 9999;
  const years = s.match(/20\d{2}|19\d{2}/g);
  if (!years || !years.length) return 0;
  return Math.max(...years.map(Number));
}

function renderExperience() {
  const work = (portfolioData.experience || []).map(e => ({
    kind: 'work', title: e.title || '', org: e.organization || '', period: e.period || '',
    description: (e.description || '').trim(), sortYear: parsePeriodEndYear(e.period)
  }));
  const edu = (portfolioData.academic || []).map(e => ({
    kind: 'education', title: e.degree || '', org: e.institution || '', period: e.period || '',
    description: '', sortYear: parsePeriodEndYear(e.period)
  }));
  const items = [...work, ...edu].sort((a, b) => b.sortYear - a.sortYear);
  const clickable = [];

  document.getElementById('experiencesList').innerHTML = items.map(e => {
    const badgeHtml = e.kind === 'education'
      ? '<span class="cat-badge cat-document">Education</span>'
      : '<span class="cat-badge cat-article">Work</span>';
    let click = '';
    if (e.description) {
      clickable.push({ title: e.title, meta: [e.org, e.period].filter(Boolean).join(' | '), badges: [badgeHtml], body: e.description });
      click = `onclick="openDetail('experience', ${clickable.length - 1})" aria-haspopup="dialog"`;
    }
    return `
    <div class="card rounded-2xl p-4 sm:p-5 shadow-sm ${e.description ? 'cursor-pointer' : ''}" ${click}>
      <div class="flex justify-between items-start gap-3">
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <h3 class="font-semibold text-base leading-snug" style="color: var(--text-main)">${esc(e.title)}</h3>
            ${badgeHtml}
          </div>
          <p class="text-sm font-medium" style="color: var(--color-primary-600)">${esc(e.org)}</p>
        </div>
        <span class="text-xs whitespace-nowrap px-2 py-1 rounded flex-shrink-0" style="background: var(--color-primary-50); color: var(--text-muted)">${esc(e.period)}</span>
      </div>
    </div>`;
  }).join('') || '<p style="color:var(--text-muted)">No experience listed.</p>';
  detailSets.experience = clickable;
}

/* ---------- Publications: selected first, search, type, year ---------- */
function setupPublications() {
  const pubs = portfolioData.publications || [];
  const sumEl = document.getElementById('pubSummary');
  if (sumEl) {
    const art = pubs.filter(p => p.category === 'article').length;
    const chap = pubs.filter(p => p.category === 'book_chapter').length;
    sumEl.textContent = `${pubs.length} publications` + (art || chap ? ` (${art} journal articles, ${chap} book chapters)` : '') + '.';
  }

  // Type chips
  buildFilterBar('pubFilters', pubs, 'category', pubState.cat, (f) => { pubState.cat = f; renderPublications(); }, 'pub-filter');

  // Year dropdown
  const yearEl = document.getElementById('pubYear');
  if (yearEl) {
    const years = [...new Set(pubs.map(p => String(p.year || '')).filter(Boolean))].sort((a, b) => Number(b) - Number(a));
    yearEl.innerHTML = '<option value="all">All years</option>' + years.map(y =>
      `<option value="${esc(y)}">${esc(y)} (${pubs.filter(p => String(p.year) === y).length})</option>`).join('');
    yearEl.value = pubState.year;
    yearEl.onchange = () => { pubState.year = yearEl.value; renderPublications(); };
  }

  const searchEl = document.getElementById('pubSearch');
  if (searchEl) searchEl.oninput = () => { pubState.q = searchEl.value.trim().toLowerCase(); renderPublications(); };

  const moreEl = document.getElementById('pubMore');
  if (moreEl) moreEl.onclick = () => { pubState.expanded = !pubState.expanded; renderPublications(); };

  renderPublications();
}

function selectedPublications(sortedPubs) {
  const flagged = sortedPubs.filter(p => p.selected || p.featured);
  return flagged.length ? flagged : sortedPubs.slice(0, SELECTED_FALLBACK);
}

function renderPublications() {
  const all = [...(portfolioData.publications || [])].sort((a, b) => (b.year || 0) - (a.year || 0));
  const filtered = all.filter(p => {
    if (pubState.cat !== 'all' && p.category !== pubState.cat) return false;
    if (pubState.year !== 'all' && String(p.year) !== pubState.year) return false;
    if (pubState.q) {
      const hay = `${p.title} ${p.authors} ${p.journal} ${p.year} ${p.doi}`.toLowerCase();
      if (!hay.includes(pubState.q)) return false;
    }
    return true;
  });
  const filtering = pubState.q !== '' || pubState.cat !== 'all' || pubState.year !== 'all';
  const picks = selectedPublications(all);
  const visible = (pubState.expanded || filtering) ? filtered : picks;

  const countEl = document.getElementById('pubCount');
  if (countEl) countEl.textContent = `Showing ${visible.length} of ${filtered.length} publications`;

  document.getElementById('publicationsList').innerHTML = visible.map(p => {
    const doi = p.doi ? 'https://doi.org/' + String(p.doi).replace(/^https?:\/\/(dx\.)?doi\.org\//, '') : '';
    return `
    <article class="card rounded-2xl p-4 sm:p-5 shadow-sm h-full flex flex-col">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
        <span class="${categoryBadgeClass(p.category)}">${esc(humanizeCategory(p.category || 'other'))}</span>
        ${doi ? `<a href="${esc(doi)}" target="_blank" rel="noopener noreferrer" class="text-xs font-medium hover:underline" style="color: var(--color-primary-600)">DOI</a>` : ''}
      </div>
      <h3 class="font-semibold text-[15px] leading-snug" style="color: var(--text-main)">${esc(p.title)}</h3>
      <p class="text-xs mt-2 line-clamp-2" style="color: var(--text-muted)">${esc(p.authors || '')}</p>
      <p class="text-xs mt-auto pt-2 italic" style="color: var(--color-primary-600)">${esc(p.journal || '')} ${p.year ? '(' + esc(p.year) + ')' : ''}</p>
    </article>`;
  }).join('') || `<div class="col-span-full text-center py-8" style="color: var(--text-muted)"><p class="font-medium" style="color: var(--text-main)">No publications match</p><p class="text-sm">Try clearing the search or filters.</p></div>`;

  const more = document.getElementById('pubMore');
  if (more) {
    if (filtering || filtered.length <= picks.length) {
      more.hidden = true;
    } else {
      more.hidden = false;
      more.textContent = pubState.expanded ? `Show selected papers (${picks.length})` : `View all ${all.length} publications`;
    }
  }
}

/* ---------- Mentors ---------- */
function renderMentors() {
  const mentors = portfolioData.mentors || [];
  document.getElementById('mentorsList').innerHTML = mentors.map(m => `
    <div class="card rounded-2xl p-4 shadow-sm flex gap-3 items-start">
      ${m.photo ? `<img src="${esc(m.photo)}" alt="${esc(m.name)}" width="48" height="48" class="w-12 h-12 rounded-full object-cover flex-shrink-0" loading="lazy" onerror="this.onerror=null;this.src=IMG_FALLBACK">` :
        `<div class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 skill-tag">${esc(getInitials(m.name))}</div>`}
      <div class="min-w-0">
        <h3 class="font-semibold text-[15px] leading-tight" style="color: var(--text-main)">${esc(m.name)}</h3>
        <p class="text-xs mt-1" style="color: var(--color-primary-600)">${esc(m.role || '')}</p>
        <p class="text-xs mt-0.5" style="color: var(--text-muted)">${esc(m.institution || '')}</p>
        ${m.profileUrl ? `<a href="${esc(m.profileUrl)}" target="_blank" rel="noopener noreferrer" class="text-xs hover:underline mt-1 inline-block" style="color: var(--color-primary-600)">Profile</a>` : ''}
      </div>
    </div>
  `).join('') || '<p style="color:var(--text-muted)">No mentors listed.</p>';
}

/* ---------- Events ---------- */
function renderEvents() {
  const events = [...(portfolioData.events || [])];
  events.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  const filtered = eventState.type === 'all' ? events : events.filter(e => (e.type || '') === eventState.type);
  const filtering = eventState.type !== 'all';
  const visible = (eventState.expanded || filtering) ? filtered : filtered.slice(0, INITIAL_EVENTS);
  const clickable = [];

  document.getElementById('eventsList').innerHTML = visible.map(e => {
    const desc = (e.description || '').trim();
    const hasDesc = desc && desc !== 'Event description...';
    const badgeHtml = `<span class="${categoryBadgeClass(e.type)}">${esc(humanizeCategory(e.type || 'event'))}</span>`;
    const when = [e.date, e.location].filter(Boolean).join(', ');
    let click = '';
    if (hasDesc) {
      clickable.push({ title: e.title, meta: when, badges: [badgeHtml], body: desc });
      click = `onclick="openDetail('events', ${clickable.length - 1})" aria-haspopup="dialog"`;
    }
    return `
    <div class="card rounded-2xl p-4 shadow-sm ${hasDesc ? 'cursor-pointer' : ''}" ${click}>
      <div class="flex items-start justify-between gap-3">
        <h3 class="font-semibold text-[15px] leading-snug" style="color: var(--text-main)">${esc(e.title)}</h3>
        ${badgeHtml}
      </div>
      <p class="text-xs mt-1.5" style="color: var(--text-muted)">${esc(when)}</p>
    </div>`;
  }).join('') || '<p style="color:var(--text-muted)">No events listed.</p>';
  detailSets.events = clickable;

  const more = document.getElementById('eventMore');
  if (more) {
    if (filtering || filtered.length <= INITIAL_EVENTS) {
      more.hidden = true;
    } else {
      more.hidden = false;
      more.textContent = eventState.expanded ? 'Show fewer events' : `View all ${filtered.length} events`;
      more.onclick = () => { eventState.expanded = !eventState.expanded; renderEvents(); };
    }
  }
  enhanceInteractiveCards();
}

// Make every clickable card reachable and operable from the keyboard
function enhanceInteractiveCards() {
  document.querySelectorAll('.card[onclick]').forEach(card => {
    if (card.dataset.kb) return;
    card.dataset.kb = '1';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', e => {
      if (e.target !== card) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });
}

/* ---------- Skills ---------- */
function renderSkills() {
  const skills = portfolioData.skills || [];
  const section = document.getElementById('skills');
  const list = document.getElementById('skillsList');
  if (!list) return;
  if (!skills.length) { if (section) section.hidden = true; return; }
  if (section) section.hidden = false;
  const clickable = [];
  list.innerHTML = skills.map(s => {
    const level = Math.min(100, Math.max(0, parseInt(s.level) || 0));
    const link = (s.link || '').trim();
    const desc = (s.description || '').trim();
    const featured = /claude code/i.test(s.name || '');
    let click = '';
    if (desc || link) {
      clickable.push({
        title: s.name, meta: s.software || '', body: desc, level,
        badges: featured ? ['<span class="cat-badge cat-book_chapter">Core expertise</span>'] : [],
        links: link ? [{ label: 'Open link', url: link }] : []
      });
      click = `onclick="openDetail('skills', ${clickable.length - 1})" aria-haspopup="dialog"`;
    }
    return `
    <div class="card rounded-2xl p-4 sm:p-5 shadow-sm ${click ? 'cursor-pointer' : ''}" ${featured ? 'style="border-color: var(--accent)"' : ''} ${click}>
      <div class="flex items-start justify-between gap-2 mb-1">
        <h3 class="font-semibold text-[15px] leading-snug" style="color: var(--text-main)">${esc(s.name)}</h3>
        <span class="text-xs font-medium flex-shrink-0" style="color: var(--color-primary-600)">${level}%</span>
      </div>
      ${featured ? `<p class="text-[11px] font-semibold mb-1" style="color: var(--accent)">Core expertise</p>` : ''}
      ${s.software ? `<p class="text-xs mb-3" style="color: var(--text-muted)"><i class="fas fa-screwdriver-wrench mr-1 opacity-70" aria-hidden="true"></i>${esc(s.software)}</p>` : ''}
      <div class="h-1.5 rounded-full overflow-hidden" style="background: var(--color-primary-50)">
        <div class="h-full rounded-full" style="width:${level}%; background: linear-gradient(90deg, var(--gradient-from), var(--accent))"></div>
      </div>
    </div>`;
  }).join('');
  detailSets.skills = clickable;
}

/* ---------- News (only shown if a container exists) ---------- */
function renderNews() {
  const news = portfolioData.news || [];
  const section = document.getElementById('news');
  const list = document.getElementById('newsList');
  if (!list) return;
  if (!news.length) { if (section) section.hidden = true; return; }
  if (section) section.hidden = false;
  const sorted = [...news].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  list.innerHTML = sorted.map((n, i) => `
    <div class="card rounded-xl p-3 shadow-sm cursor-pointer h-full" onclick="openNewsModal(${i})">
      ${n.image ? `<img src="${esc(n.image)}" alt="" class="w-full h-20 object-cover rounded-lg mb-2" loading="lazy">` : ''}
      <h3 class="font-semibold text-sm leading-snug line-clamp-2" style="color: var(--text-main)">${esc(n.title || 'Untitled')}</h3>
      ${n.date ? `<p class="text-[11px] mt-1" style="color: var(--text-muted)">${esc(n.date)}</p>` : ''}
    </div>
  `).join('');
  window._newsSorted = sorted;
}

function openNewsModal(idx) {
  const n = (window._newsSorted || portfolioData.news || [])[idx];
  if (!n) return;
  document.getElementById('newsModalTitle').textContent = n.title || '';
  document.getElementById('newsModalBody').textContent = n.description || '';
  const img = document.getElementById('newsModalImage');
  if (n.image) { img.src = n.image; img.classList.remove('hidden'); } else { img.src = ''; img.classList.add('hidden'); }
  const link = document.getElementById('newsModalLink');
  const href = n.source || n.url || n.link;
  if (href) { link.href = href; link.style.display = 'inline-block'; } else { link.style.display = 'none'; }
  const modal = document.getElementById('newsModal');
  modal.classList.remove('hidden'); modal.classList.add('flex');
}
function closeNewsModal() {
  const modal = document.getElementById('newsModal');
  if (!modal) return;
  modal.classList.add('hidden'); modal.classList.remove('flex');
}

/* ---------- Gallery ---------- */
function renderGallery() {
  const gallery = portfolioData.gallery || [];
  document.getElementById('galleryImages').innerHTML = gallery.map((g, i) => `
    <button type="button" class="card rounded-xl overflow-hidden shadow-sm cursor-pointer group text-left" onclick="openGalleryItem(${i})" title="${esc(g.title || '')}" aria-label="View photo: ${esc(g.title || 'image')}">
      <div class="relative">
        <img src="${esc(g.image)}" alt="${esc(g.title || '')}" class="gallery-img w-full" width="300" height="300" loading="lazy" onerror="this.onerror=null;this.src=IMG_FALLBACK">
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition flex items-end p-2">
          <p class="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition line-clamp-2">${esc(g.title || '')}</p>
        </div>
      </div>
    </button>`).join('') || '<p class="col-span-full" style="color:var(--text-muted)">No gallery images.</p>';
}

function openGalleryItem(idx) {
  const g = (portfolioData.gallery || [])[idx];
  if (!g) return;
  openModal(g.image || '', g.title || '', g.description || '');
}

/* ---------- Courses with resources (admin: Courses > resources) ---------- */
const RESOURCE_TYPES = {
  link: { icon: 'fa-link', label: 'Link' },
  document: { icon: 'fa-file-lines', label: 'Document' },
  html: { icon: 'fa-window-maximize', label: 'HTML page' }
};

function resourceType(r) {
  const t = String(r.type || '').toLowerCase();
  if (RESOURCE_TYPES[t]) return t;
  const u = String(r.url || '').toLowerCase().split('?')[0];
  if (/\.html?$/.test(u)) return 'html';
  if (/\.(pdf|docx?|pptx?|xlsx?)$/.test(u) || u.includes('drive.google.com')) return 'document';
  return 'link';
}

function renderCourses() {
  const courses = portfolioData.courses || [];
  const section = document.getElementById('courses');
  if (!courses.length) { if (section) section.hidden = true; return; }
  if (section) section.hidden = false;
  document.getElementById('coursesList').innerHTML = courses.map((c, ci) => {
    const resources = (c.resources || []).filter(r => r && r.url);
    const resHtml = resources.map((r, ri) => {
      const type = resourceType(r);
      const meta = RESOURCE_TYPES[type];
      const label = esc(r.title || meta.label);
      const cls = 'res-chip inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition text-left';
      const style = 'background: var(--color-primary-50); color: var(--color-primary-800); border: 1px solid var(--border-color); min-height: 38px';
      const icon = `<i class="fas ${meta.icon}" aria-hidden="true"></i>`;
      return type === 'html'
        ? `<button type="button" class="${cls}" style="${style}" onclick="openResource(${ci}, ${ri})">${icon}<span>${label}</span></button>`
        : `<a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer" class="${cls}" style="${style}">${icon}<span>${label}</span></a>`;
    }).join('');
    return `
    <article class="card rounded-2xl p-4 sm:p-5 shadow-sm flex gap-4">
      ${c.image ? `<img src="${esc(c.image)}" alt="" width="80" height="80" class="w-20 h-20 rounded-xl object-cover flex-shrink-0 hidden sm:block" loading="lazy" onerror="this.style.display='none'">` : ''}
      <div class="min-w-0 flex-1">
        <h3 class="font-semibold text-base leading-snug" style="color: var(--text-main)">${esc(c.name)}</h3>
        <p class="text-sm mt-1.5 line-clamp-3 leading-relaxed" style="color: var(--text-muted)">${esc(c.description || '')}</p>
        <div class="flex flex-wrap gap-2 mt-3">
          ${c.syllabusUrl ? `<a href="${esc(c.syllabusUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium" style="background: var(--color-primary-600); color: var(--on-primary); min-height: 38px"><i class="fas fa-file-lines" aria-hidden="true"></i>Syllabus</a>` : ''}
          ${c.booksUrl ? `<a href="${esc(c.booksUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium" style="background: var(--color-primary-600); color: var(--on-primary); min-height: 38px"><i class="fas fa-book" aria-hidden="true"></i>Reference books</a>` : ''}
        </div>
        ${resHtml ? `<p class="text-xs font-semibold mt-4 mb-2" style="color: var(--text-muted)">Resources</p><div class="flex flex-wrap gap-2">${resHtml}</div>` : ''}
      </div>
    </article>`;
  }).join('');
}

function openResource(ci, ri) {
  const list = (((portfolioData.courses || [])[ci] || {}).resources || []).filter(x => x && x.url);
  const r = list[ri];
  if (!r) return;
  lastFocus = document.activeElement;
  document.getElementById('resTitle').textContent = r.title || 'Resource';
  document.getElementById('resOpen').href = r.url;
  document.getElementById('resFrame').src = r.url;
  const m = document.getElementById('resourceModal');
  m.classList.remove('hidden'); m.classList.add('flex');
  document.body.style.overflow = 'hidden';
}
function closeResource() {
  const m = document.getElementById('resourceModal');
  if (!m || m.classList.contains('hidden')) return;
  m.classList.add('hidden'); m.classList.remove('flex');
  document.getElementById('resFrame').src = 'about:blank';
  document.body.style.overflow = '';
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

/* ---------- Jobs ---------- */
function renderJobs() {
  const jobs = portfolioData.jobs || [];
  const section = document.getElementById('jobsSection');
  if (!jobs.length) { if (section) section.hidden = true; return; }
  if (section) section.hidden = false;
  document.getElementById('jobsList').innerHTML = jobs.map(j => `
    <div class="card rounded-2xl p-4 sm:p-5 shadow-sm">
      <div class="flex justify-between items-start gap-3">
        <h3 class="font-semibold text-base leading-snug" style="color: var(--text-main)">${esc(j.title)}</h3>
        <span class="text-xs px-2 py-0.5 rounded-full skill-tag flex-shrink-0">${esc(j.status || 'open')}</span>
      </div>
      <p class="text-sm mt-1.5" style="color: var(--color-primary-600)">${esc((j.type || '').trim())}${j.type && j.location ? ', ' : ''}${esc(j.location || '')}</p>
      <p class="text-sm mt-2 leading-relaxed" style="color: var(--text-muted)">${esc(j.description || '')}</p>
    </div>
  `).join('');
}

function renderContact() {
  renderSocialIcons('contactSocial', { includeEmail: true });
}

/* ---------- Filters ---------- */
function buildFilterBar(containerId, items, field, currentFilter, onSelect, btnClass) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const cats = [...new Set(items.map(i => i[field]).filter(Boolean))].sort();
  const active = (currentFilter !== 'all' && cats.includes(currentFilter)) ? currentFilter : 'all';
  container.innerHTML = [
    `<button type="button" class="filter-btn ${btnClass} ${active === 'all' ? 'active' : ''} px-3.5 py-1 rounded-full text-sm" data-filter="all" aria-pressed="${active === 'all'}">All</button>`,
    ...cats.map(c => `<button type="button" class="filter-btn ${btnClass} ${active === c ? 'active' : ''} px-3.5 py-1 rounded-full text-sm" data-filter="${esc(c)}" aria-pressed="${active === c}">${esc(humanizeCategory(c))}</button>`)
  ].join('');
  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      onSelect(btn.dataset.filter);
    });
  });
}

function setupEventFilters() {
  buildFilterBar('eventFilters', portfolioData.events || [], 'type', eventState.type, (f) => {
    eventState.type = f;
    renderEvents();
  }, 'event-filter');
}

/* ---------- Image viewer ---------- */
function openModal(src, caption, description) {
  document.getElementById('modalImage').src = src;
  document.getElementById('modalImage').alt = caption || '';
  const cap = document.getElementById('modalCaption');
  cap.innerHTML = '';
  if (caption) {
    const b = document.createElement('span'); b.className = 'font-medium'; b.textContent = caption; cap.appendChild(b);
    if (description) {
      cap.appendChild(document.createElement('br'));
      const d = document.createElement('span'); d.className = 'opacity-80 text-xs'; d.textContent = description; cap.appendChild(d);
    }
  } else if (description) {
    cap.textContent = description;
  }
  const modal = document.getElementById('imageModal');
  modal.classList.remove('hidden'); modal.classList.add('flex');
}
function closeModal() {
  const modal = document.getElementById('imageModal');
  if (!modal) return;
  modal.classList.add('hidden'); modal.classList.remove('flex');
}

document.addEventListener('DOMContentLoaded', loadData);
