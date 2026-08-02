// Static Portfolio Frontend (GitHub Pages compatible)
let portfolioData = null;
let currentPubFilter = 'all';
let currentLinkFilter = 'all';
let currentEventFilter = 'all';

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
  // If site is at /repo-name/ index may need that base
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
    const res = await fetch(url + (url.indexOf('?') >= 0 ? '&' : '?') + 't=' + Date.now(), {
      signal: ctrl.signal,
      cache: 'no-cache'
    });
    return res;
  } finally {
    clearTimeout(t);
  }
}

async function loadData() {
  const candidates = dataJsonCandidates();
  let lastErr = null;
  for (const url of candidates) {
    try {
      console.log('[portfolio] Trying', url);
      const res = await fetchWithTimeout(url, 12000);
      if (!res.ok) {
        lastErr = new Error(url + ' → HTTP ' + res.status);
        continue;
      }
      portfolioData = await res.json();
      console.log('[portfolio] Loaded from', url);
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
  showError(msg + '<br><span class="text-xs">Tried: ' + candidates.join(', ') + '</span><br><span class="text-xs">Open browser console (F12) for details. All files must be in the same folder on GitHub Pages.</span>');
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
      <div class="text-center max-w-md px-4" style="color:#dc2626">
        <p class="font-semibold text-lg">Failed to load portfolio data</p>
        <p class="text-sm mt-2" style="color:var(--text-muted)">${msg}</p>
        <p class="text-xs mt-3" style="color:var(--text-muted)">Upload <b>index.html</b>, <b>script.js</b>, and <b>data.json</b> in the <b>same folder</b> (repo root or /docs). File names are case-sensitive.</p>
        <button onclick="location.reload()" class="mt-4 px-4 py-2 rounded-lg text-sm text-white" style="background:var(--color-primary-600)">Retry</button>
      </div>`;
  }
}

function applyThemeColors() {
  const tc = portfolioData?.settings?.themeColors || {};
  const lightFrom = tc.lightGradientFrom || '#4f46e5';
  const lightTo = tc.lightGradientTo || '#7c3aed';
  const lightBg = tc.lightBackground || '#f1f5f9';
  const lightSurface = tc.lightSurface || '#ffffff';
  const lightText = tc.lightText || '#0f172a';
  const darkFrom = tc.darkGradientFrom || '#6366f1';
  const darkTo = tc.darkGradientTo || '#a78bfa';
  const darkBg = tc.darkBackground || '#0f172a';
  const darkSurface = tc.darkSurface || '#1e293b';
  const darkText = tc.darkText || '#f1f5f9';

  // Clear any previous inline overrides that would block .dark rules
  const root = document.documentElement;
  ['--gradient-from','--gradient-to','--bg-page','--bg-card','--text-main',
   '--color-primary-500','--color-primary-600','--color-primary-800'].forEach(v => root.style.removeProperty(v));

  let styleEl = document.getElementById('dynamicThemeColors');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'dynamicThemeColors';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = `
    :root {
      --gradient-from: ${lightFrom};
      --gradient-to: ${lightTo};
      --bg-page: ${lightBg};
      --bg-card: ${lightSurface};
      --text-main: ${lightText};
      --text-muted: #64748b;
      --border-color: #e2e8f0;
      --color-primary-50: ${lightFrom}18;
      --color-primary-100: ${lightFrom}28;
      --color-primary-500: ${lightFrom};
      --color-primary-600: ${lightFrom};
      --color-primary-700: ${lightFrom};
      --color-primary-800: ${lightFrom};
      --color-primary-900: ${lightFrom};
    }
    .dark {
      --gradient-from: ${darkFrom};
      --gradient-to: ${darkTo};
      --bg-page: ${darkBg};
      --bg-card: ${darkSurface};
      --text-main: ${darkText};
      --text-muted: #94a3b8;
      --border-color: #334155;
      --color-primary-50: ${darkFrom}22;
      --color-primary-100: ${darkFrom}33;
      --color-primary-500: ${darkFrom};
      --color-primary-600: ${darkFrom};
      --color-primary-700: ${darkText};
      --color-primary-800: ${darkText};
      --color-primary-900: ${darkText};
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
  // Dynamic color for any new category (stable hash → palette index)
  const palette = ['cat-article','cat-book_chapter','cat-conference','cat-workshop','cat-videos','cat-document','cat-website'];
  let hash = 0;
  for (let i = 0; i < c.length; i++) hash = ((hash << 5) - hash) + c.charCodeAt(i);
  const idx = Math.abs(hash) % palette.length;
  return 'cat-badge ' + palette[idx];
}

function faviconUrl(pageUrl) {
  try {
    const u = new URL(pageUrl);
    return 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(u.hostname) + '&sz=64';
  } catch (e) {
    return null;
  }
}

function youtubeThumb(url) {
  if (!url) return null;
  const m = String(url).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{6,})/i);
  return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : null;
}

function getInitials(name) {
  if (!name) return '??';
  return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function renderAll() {
  if (!portfolioData) return;
  renderHero();
  renderKeywords();
  // education merged into renderExperience
  renderExperience();
  renderResearchAreas();
  renderSkills();
  renderMentors();
  renderPublications();
  renderEvents();
  renderNews();
  renderGallery();
  renderCourses();
  renderJobs();
  renderLinks();
  renderContact();
  setupFilters();
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  if (portfolioData.settings?.footerText) {
    document.getElementById('footerText').textContent = portfolioData.settings.footerText;
  }
  document.title = portfolioData.settings?.siteTitle || ((portfolioData.profile?.name || 'Portfolio') + ' | Portfolio');
}

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
  document.getElementById('heroInstitution').textContent = inst;

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
    <div class="metric-card text-white px-3 py-1.5 rounded-lg text-center min-w-[72px] shadow-sm">
      <div class="text-base font-bold leading-tight">${m.value}</div>
      <div class="text-[10px] opacity-90">${m.label}</div>
    </div>
  `).join('');

  // Mail icon goes with social icons; scholar already in socialLinks
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
    linkedin: { icon: 'fab fa-linkedin' },
    twitter: { icon: 'fab fa-twitter' },
    github: { icon: 'fab fa-github' },
    scholar: { icon: 'fas fa-graduation-cap' },
    orcid: { icon: 'fab fa-orcid' },
    researchgate: { icon: 'fab fa-researchgate' },
    facebook: { icon: 'fab fa-facebook' },
    instagram: { icon: 'fab fa-instagram' },
    youtube: { icon: 'fab fa-youtube' },
    website: { icon: 'fas fa-globe' }
  };
  let parts = Object.entries(social)
    .filter(([k, v]) => v && icons[k])
    .map(([k, url]) => `
      <a href="${url}" target="_blank" rel="noopener" class="text-xl transition hover:opacity-70" style="color: var(--color-primary-600)" title="${k}">
        <i class="${icons[k].icon}"></i>
      </a>
    `);
  if (opts.includeEmail) {
    const email = portfolioData.profile?.email || portfolioData.contact?.email || '';
    if (email) {
      parts.unshift(`
      <a href="mailto:${email}" class="text-xl transition hover:opacity-70" style="color: var(--color-primary-600)" title="Email">
        <i class="fas fa-envelope"></i>
      </a>`);
    }
  }
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = parts.join('');
}

function renderKeywords() {
  const keywords = portfolioData.profile?.keywords || [];
  document.getElementById('keywordsList').innerHTML = keywords.map(k => `
    <span class="skill-tag px-3 py-1.5 rounded-full text-sm font-medium">${k}</span>
  `).join('');
}

function renderResearchAreas() {
  const areas = portfolioData.researchAreas || [];
  document.getElementById('researchAreasList').innerHTML = areas.map((a, i) => {
    const id = 'research-desc-' + i;
    const desc = (a.description || '').trim();
    return `
    <div class="card rounded-2xl p-4 shadow-sm ${desc ? 'cursor-pointer' : ''}" ${desc ? `onclick="toggleEventDesc('${id}')"` : ''}>
      <div class="flex gap-4">
        ${a.image ? `<img src="${a.image}" alt="${a.title}" class="w-16 h-16 rounded-xl object-cover flex-shrink-0" loading="lazy">` : ''}
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="font-semibold" style="color: var(--text-main)">${a.title}</h3>
            ${a.years ? `<span class="text-xs px-2 py-0.5 rounded-full skill-tag">${a.years} years</span>` : ''}
          </div>
          ${desc ? `
            <p class="text-sm mt-1 line-clamp-2" style="color: var(--text-muted)">${desc}</p>
            <div id="${id}" class="event-desc">
              <p class="text-sm mt-2 pt-2" style="color: var(--text-muted); border-top: 1px solid var(--border-color)">${desc}</p>
            </div>
            <p class="text-xs mt-1.5" style="color: var(--color-primary-600)"><i class="fas fa-chevron-down text-[10px]"></i> Click for full description</p>
          ` : ''}
        </div>
      </div>
    </div>`;
  }).join('') || '<p style="color:var(--text-muted)">No research areas listed.</p>';
}

function parsePeriodEndYear(period) {
  if (!period) return 0;
  const s = String(period);
  // "Present" / "present" / "Current" => high year
  if (/present|current/i.test(s)) return 9999;
  const years = s.match(/20\d{2}|19\d{2}/g);
  if (!years || !years.length) return 0;
  return Math.max(...years.map(Number));
}

function renderExperience() {
  const work = (portfolioData.experience || []).map(e => ({
    kind: 'work',
    title: e.title || '',
    org: e.organization || '',
    period: e.period || '',
    description: (e.description || '').trim(),
    sortYear: parsePeriodEndYear(e.period)
  }));
  const edu = (portfolioData.academic || []).map(e => ({
    kind: 'education',
    title: e.degree || '',
    org: e.institution || '',
    period: e.period || '',
    description: '', // education descriptions removed per request
    sortYear: parsePeriodEndYear(e.period)
  }));
  const items = [...work, ...edu].sort((a, b) => b.sortYear - a.sortYear);

  document.getElementById('experiencesList').innerHTML = items.map((e, i) => {
    const id = 'exp-desc-' + i;
    const desc = e.description;
    const badge = e.kind === 'education'
      ? '<span class="cat-badge cat-document">Education</span>'
      : '<span class="cat-badge cat-article">Work</span>';
    return `
    <div class="card rounded-xl p-3 shadow-sm ${desc ? 'cursor-pointer' : ''}" ${desc ? `onclick="toggleEventDesc('${id}')"` : ''}>
      <div class="flex justify-between items-start gap-2">
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2 mb-0.5">
            <h3 class="font-semibold text-base" style="color: var(--text-main)">${e.title}</h3>
            ${badge}
          </div>
          <p class="text-sm font-medium" style="color: var(--color-primary-600)">${e.org}</p>
        </div>
        <span class="text-xs whitespace-nowrap px-2 py-0.5 rounded flex-shrink-0" style="background: var(--color-primary-50); color: var(--text-muted)">${e.period || ''}</span>
      </div>
      ${desc ? `
        <div id="${id}" class="event-desc">
          <p class="text-sm mt-2 pt-2 whitespace-pre-line" style="color: var(--text-muted); border-top: 1px solid var(--border-color)">${desc}</p>
        </div>
        <p class="text-xs mt-1.5" style="color: var(--color-primary-600)"><i class="fas fa-chevron-down text-[10px]"></i> Click for details</p>
      ` : ''}
    </div>`;
  }).join('') || '<p style="color:var(--text-muted)">No experience listed.</p>';
}

function renderPublications() {
  const pubs = portfolioData.publications || [];
  const filtered = currentPubFilter === 'all' ? pubs : pubs.filter(p => p.category === currentPubFilter);
  filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
  document.getElementById('publicationsList').innerHTML = filtered.map(p => `
    <div class="card rounded-xl p-3 shadow-sm h-full">
      <div class="flex flex-wrap items-start justify-between gap-2 mb-1">
        <span class="${categoryBadgeClass(p.category)}">${humanizeCategory(p.category || 'other')}</span>
        ${p.doi ? `<a href="https://doi.org/${String(p.doi).replace('https://doi.org/', '')}" target="_blank" class="text-xs hover:underline" style="color: var(--color-primary-600)">DOI</a>` : ''}
      </div>
      <h3 class="font-semibold text-sm leading-snug" style="color: var(--text-main)">${p.title}</h3>
      <p class="text-xs mt-1 line-clamp-2" style="color: var(--text-muted)">${p.authors || ''}</p>
      <p class="text-xs mt-1 italic" style="color: var(--color-primary-600)">${p.journal || ''} ${p.year ? '(' + p.year + ')' : ''}</p>
    </div>
  `).join('') || '<p style="color:var(--text-muted)">No publications found.</p>';
}

function renderEducation() { /* merged into Experience timeline */ }

function renderMentors() {
  const mentors = portfolioData.mentors || [];
  document.getElementById('mentorsList').innerHTML = mentors.map(m => `
    <div class="card rounded-xl p-3 shadow-sm flex gap-2.5 items-start">
      ${m.photo ? `<img src="${m.photo}" alt="${m.name}" class="w-11 h-11 rounded-full object-cover flex-shrink-0" loading="lazy">` :
        `<div class="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 skill-tag">${getInitials(m.name)}</div>`}
      <div class="min-w-0">
        <h3 class="font-semibold text-sm leading-tight" style="color: var(--text-main)">${m.name}</h3>
        <p class="text-xs mt-0.5" style="color: var(--color-primary-600)">${m.role || ''}</p>
        <p class="text-xs truncate" style="color: var(--text-muted)">${m.institution || ''}</p>
        ${m.profileUrl ? `<a href="${m.profileUrl}" target="_blank" class="text-xs hover:underline mt-0.5 inline-block" style="color: var(--color-primary-600)">Profile →</a>` : ''}
      </div>
    </div>
  `).join('') || '<p style="color:var(--text-muted)">No mentors listed.</p>';
}

function renderEvents() {
  const events = [...(portfolioData.events || [])];
  events.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  const filtered = currentEventFilter === 'all' ? events : events.filter(e => (e.type || '') === currentEventFilter);

  document.getElementById('eventsList').innerHTML = filtered.map((e, i) => {
    const id = 'event-desc-' + i;
    return `
    <div class="card rounded-xl p-3 shadow-sm cursor-pointer" onclick="toggleEventDesc('${id}')">
      <div class="flex items-start justify-between gap-2">
        <h3 class="font-semibold text-sm leading-snug" style="color: var(--text-main)">${e.title}</h3>
        <span class="${categoryBadgeClass(e.type)}">${humanizeCategory(e.type || 'event')}</span>
      </div>
      <p class="text-xs mt-1" style="color: var(--text-muted)">${e.date || ''} ${e.location ? '• ' + e.location : ''}</p>
      <div id="${id}" class="event-desc">
        <p class="text-sm mt-2 pt-2" style="color: var(--text-muted); border-top: 1px solid var(--border-color)">${e.description || ''}</p>
      </div>
      <p class="text-xs mt-1.5" style="color: var(--color-primary-600)"><i class="fas fa-chevron-down text-[10px]"></i> Click for details</p>
    </div>`;
  }).join('') || '<p style="color:var(--text-muted)">No events listed.</p>';
}

function toggleEventDesc(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('open');
}


function renderSkills() {
  const skills = portfolioData.skills || [];
  const section = document.getElementById('skills');
  const list = document.getElementById('skillsList');
  if (!list) return;
  if (!skills.length) {
    if (section) section.style.display = 'none';
    return;
  }
  if (section) section.style.display = 'block';
  list.innerHTML = skills.map((s, i) => {
    const level = Math.min(100, Math.max(0, parseInt(s.level) || 0));
    const link = (s.link || '').trim();
    const desc = (s.description || '').trim();
    const id = 'skill-desc-' + i;
    return `
    <div class="card rounded-xl p-3 shadow-sm ${desc ? 'cursor-pointer' : ''}" ${desc ? `onclick="toggleEventDesc('${id}')"` : ''}>
      <div class="flex items-start justify-between gap-2 mb-1">
        <h3 class="font-semibold text-sm" style="color: var(--text-main)">${s.name || ''}</h3>
        <span class="text-xs font-medium" style="color: var(--color-primary-600)">${level}%</span>
      </div>
      ${s.software ? `<p class="text-[11px] mb-2" style="color: var(--text-muted)"><i class="fas fa-tools mr-1 opacity-70"></i>${s.software}</p>` : ''}
      <div class="h-1.5 rounded-full overflow-hidden" style="background: var(--color-primary-50)">
        <div class="h-full rounded-full transition-all" style="width:${level}%; background: linear-gradient(90deg, var(--gradient-from), var(--gradient-to))"></div>
      </div>
      ${desc ? `
        <div id="${id}" class="event-desc">
          <p class="text-xs mt-2 pt-2 whitespace-pre-line" style="color: var(--text-muted); border-top: 1px solid var(--border-color)">${desc}</p>
        </div>
        <p class="text-[11px] mt-1.5" style="color: var(--color-primary-600)"><i class="fas fa-chevron-down text-[10px]"></i> Click for description</p>
      ` : ''}
      ${link ? `<a href="${link}" target="_blank" onclick="event.stopPropagation()" class="text-[11px] mt-1 inline-block hover:underline" style="color: var(--color-primary-600)">Link →</a>` : ''}
    </div>`;
  }).join('');
}

function renderNews() {
  const news = portfolioData.news || [];
  const section = document.getElementById('news');
  const list = document.getElementById('newsList');
  if (!list) return;
  if (!news.length) {
    if (section) section.style.display = 'none';
    return;
  }
  if (section) section.style.display = 'block';
  // newest first if date present
  const sorted = [...news].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  list.innerHTML = sorted.map((n, i) => `
    <div class="card rounded-xl p-2.5 shadow-sm cursor-pointer hover:opacity-95 h-full" onclick="openNewsModal(${i})">
      ${n.image ? `<img src="${n.image}" alt="" class="w-full h-20 object-cover rounded-lg mb-1.5" loading="lazy">` : ''}
      <h3 class="font-semibold text-xs leading-snug line-clamp-2" style="color: var(--text-main)">${n.title || 'Untitled'}</h3>
      ${n.date ? `<p class="text-[10px] mt-0.5" style="color: var(--text-muted)">${n.date}</p>` : ''}
      <p class="text-[11px] mt-1 line-clamp-2 whitespace-pre-line" style="color: var(--text-muted)">${n.description || ''}</p>
    </div>
  `).join('');
  // store sorted for modal
  window._newsSorted = sorted;
}

function openNewsModal(idx) {
  const n = (window._newsSorted || portfolioData.news || [])[idx];
  if (!n) return;
  document.getElementById('newsModalTitle').textContent = n.title || '';
  document.getElementById('newsModalBody').textContent = n.description || '';
  const img = document.getElementById('newsModalImage');
  if (img) {
    if (n.image) {
      img.src = n.image;
      img.classList.remove('hidden');
    } else {
      img.src = '';
      img.classList.add('hidden');
    }
  }
  const link = document.getElementById('newsModalLink');
  if (n.source || n.url || n.link) {
    link.href = n.source || n.url || n.link;
    link.style.display = 'inline-block';
  } else {
    link.style.display = 'none';
  }
  const modal = document.getElementById('newsModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeNewsModal() {
  const modal = document.getElementById('newsModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function renderGallery() {
  const gallery = portfolioData.gallery || [];
  document.getElementById('galleryImages').innerHTML = gallery.map((g, i) => {
    return `
    <div class="card rounded-xl overflow-hidden shadow-sm cursor-pointer group" data-gallery-idx="${i}" onclick="openGalleryItem(${i})" title="${(g.title || '').replace(/"/g, '&quot;')}">
      <div class="relative">
        <img src="${g.image}" alt="${g.title || ''}" class="gallery-img w-full" loading="lazy" onerror="this.src='https://via.placeholder.com/300x300?text=Image'">
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition flex items-end p-2">
          <p class="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition line-clamp-2">${g.title || ''}</p>
        </div>
      </div>
    </div>`;
  }).join('') || '<p class="col-span-full" style="color:var(--text-muted)">No gallery images.</p>';
}

function openGalleryItem(idx) {
  const g = (portfolioData.gallery || [])[idx];
  if (!g) return;
  openModal(g.image || '', g.title || '', g.description || '');
}

function renderCourses() {
  const courses = portfolioData.courses || [];
  const section = document.getElementById('courses');
  if (!courses.length) { if (section) section.style.display = 'none'; return; }
  if (section) section.style.display = 'block';
  document.getElementById('coursesList').innerHTML = courses.map(c => `
    <div class="card rounded-2xl p-4 shadow-sm flex gap-4">
      ${c.image ? `<img src="${c.image}" alt="${c.name}" class="w-20 h-20 rounded-xl object-cover flex-shrink-0" loading="lazy">` : ''}
      <div>
        <h3 class="font-semibold" style="color: var(--text-main)">${c.name}</h3>
        <p class="text-sm mt-1 line-clamp-3" style="color: var(--text-muted)">${c.description || ''}</p>
        <div class="flex gap-3 mt-2">
          ${c.syllabusUrl ? `<a href="${c.syllabusUrl}" target="_blank" class="text-xs hover:underline" style="color: var(--color-primary-600)">Syllabus</a>` : ''}
          ${c.booksUrl ? `<a href="${c.booksUrl}" target="_blank" class="text-xs hover:underline" style="color: var(--color-primary-600)">Books</a>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function renderJobs() {
  const jobs = portfolioData.jobs || [];
  const section = document.getElementById('jobsSection');
  if (!jobs.length) { if (section) section.style.display = 'none'; return; }
  if (section) section.style.display = 'block';
  document.getElementById('jobsList').innerHTML = jobs.map(j => `
    <div class="card rounded-2xl p-4 shadow-sm">
      <div class="flex justify-between items-start">
        <h3 class="font-semibold" style="color: var(--text-main)">${j.title}</h3>
        <span class="text-xs px-2 py-0.5 rounded-full skill-tag">${j.status || 'open'}</span>
      </div>
      <p class="text-sm mt-1" style="color: var(--color-primary-600)">${j.type || ''} • ${j.location || ''}</p>
      <p class="text-sm mt-2" style="color: var(--text-muted)">${j.description || ''}</p>
    </div>
  `).join('');
}

function renderLinks() {
  const links = portfolioData.links || [];
  const filtered = currentLinkFilter === 'all' ? links : links.filter(l => l.category === currentLinkFilter);
  document.getElementById('linksList').innerHTML = filtered.map(l => {
    const cat = (l.category || '').toLowerCase();
    const isVideo = /video/.test(cat);
    const isWeb = /website|web$/.test(cat) || cat === 'web';
    const isBook = /book/.test(cat);
    const isDoc = /document|doc/.test(cat);
    const isRepo = /repo|github|git/.test(cat);

    let media = '';
    if (isVideo) {
      const thumb = youtubeThumb(l.url);
      if (thumb) {
        media = `<img src="${thumb}" alt="" class="w-14 h-14 rounded-lg object-cover flex-shrink-0" loading="lazy" onerror="this.outerHTML='<div class=\'w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0\' style=\'background:var(--color-primary-50)\'><i class=\'fab fa-youtube text-xl text-red-500\'></i></div>'">`;
      } else {
        media = `<div class="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0" style="background:var(--color-primary-50)"><i class="fab fa-youtube text-xl text-red-500"></i></div>`;
      }
    } else if (isWeb && l.url) {
      const fav = faviconUrl(l.url);
      media = fav
        ? `<img src="${fav}" alt="" class="w-10 h-10 rounded-lg object-contain flex-shrink-0 bg-white p-1" loading="lazy" onerror="this.outerHTML='<div class=\'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0\' style=\'background:var(--color-primary-50)\'><i class=\'fas fa-globe\' style=\'color:var(--color-primary-600)\'></i></div>'">`
        : `<div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style="background:var(--color-primary-50)"><i class="fas fa-globe" style="color:var(--color-primary-600)"></i></div>`;
    } else if (isBook) {
      media = `<div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style="background:var(--color-primary-50)"><i class="fas fa-book" style="color:var(--color-primary-600)"></i></div>`;
    } else if (isDoc) {
      media = `<div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style="background:var(--color-primary-50)"><i class="fas fa-file-alt" style="color:var(--color-primary-600)"></i></div>`;
    } else if (isRepo) {
      media = `<div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style="background:var(--color-primary-50)"><i class="fab fa-github" style="color:var(--color-primary-600)"></i></div>`;
    } else {
      media = `<div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style="background:var(--color-primary-50)"><i class="fas fa-link" style="color:var(--color-primary-600)"></i></div>`;
    }

    return `
    <a href="${l.url}" target="_blank" rel="noopener" class="card rounded-xl p-3 shadow-sm block hover:opacity-90">
      <div class="flex items-start gap-3">
        ${media}
        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-semibold text-sm leading-snug" style="color: var(--text-main)">${l.title}</h3>
            <span class="${categoryBadgeClass(l.category)}">${humanizeCategory(l.category || 'link')}</span>
          </div>
          <p class="text-xs mt-1 line-clamp-2" style="color: var(--text-muted)">${l.description || ''}</p>
        </div>
      </div>
    </a>`;
  }).join('') || '<p class="col-span-full" style="color:var(--text-muted)">No links found.</p>';
}

function renderContact() {
  renderSocialIcons('contactSocial', { includeEmail: true });
}

function humanizeCategory(cat) {
  if (!cat) return 'Other';
  return String(cat).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function buildFilterBar(containerId, items, field, currentFilter, onSelect, btnClass) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const cats = [...new Set(items.map(i => i[field]).filter(Boolean))].sort();
  // Keep current if still valid
  const active = (currentFilter !== 'all' && cats.includes(currentFilter)) ? currentFilter : 'all';
  container.innerHTML = [
    `<button class="filter-btn ${btnClass} ${active === 'all' ? 'active' : ''} px-3 py-1 rounded-full text-sm" data-filter="all">All</button>`,
    ...cats.map(c => `<button class="filter-btn ${btnClass} ${active === c ? 'active' : ''} px-3 py-1 rounded-full text-sm" data-filter="${c}">${humanizeCategory(c)}</button>`)
  ].join('');
  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      onSelect(btn.dataset.filter);
    });
  });
  return active;
}

function setupFilters() {
  // Dynamic category filters rebuilt on each full render
  buildFilterBar('pubFilters', portfolioData.publications || [], 'category', currentPubFilter, (f) => {
    currentPubFilter = f;
    renderPublications();
  }, 'pub-filter');

  buildFilterBar('eventFilters', portfolioData.events || [], 'type', currentEventFilter, (f) => {
    currentEventFilter = f;
    renderEvents();
  }, 'event-filter');

  buildFilterBar('linkFilters', portfolioData.links || [], 'category', currentLinkFilter, (f) => {
    currentLinkFilter = f;
    renderLinks();
  }, 'link-filter');
}

function openModal(src, caption, description) {
  document.getElementById('modalImage').src = src;
  const cap = caption || '';
  const desc = description || '';
  document.getElementById('modalCaption').innerHTML = cap
    ? `<span class="font-medium">${cap}</span>${desc ? `<br><span class="opacity-80 text-xs">${desc}</span>` : ''}`
    : (desc || '');
  const modal = document.getElementById('imageModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

document.addEventListener('DOMContentLoaded', loadData);
