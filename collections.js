
let portfolioData = null;
let activeCategory = 'all'; // default: show everything
let activeSub = 'all';
let menuCategories = [];

const CAT_ICONS = {
  all: 'fas fa-border-all',
  news: 'fas fa-newspaper', videos: 'fas fa-video', video: 'fas fa-video',
  website: 'fas fa-globe', websites: 'fas fa-globe', tools: 'fas fa-wrench', tool: 'fas fa-wrench',
  books: 'fas fa-book', book: 'fas fa-book', document: 'fas fa-file-alt', documents: 'fas fa-file-alt',
  repository: 'fab fa-github', repositories: 'fab fa-github', github: 'fab fa-github'
};

function humanize(cat) {
  if (!cat) return 'Other';
  return String(cat).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
function getInitials(name) {
  if (!name) return '?';
  return name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}
function youtubeThumb(url) {
  if (!url) return null;
  const m = String(url).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{6,})/i);
  return m ? 'https://img.youtube.com/vi/' + m[1] + '/mqdefault.jpg' : null;
}
function faviconUrl(pageUrl) {
  try { return 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(new URL(pageUrl).hostname) + '&sz=64'; }
  catch (e) { return null; }
}
// Darken a hex colour toward black so small link text reaches 4.5:1 on light backgrounds (same hue)
function shadeHex(hex, amount) {
  let h = String(hex || "").trim().replace("#", "");
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) return hex;
  const n = parseInt(h, 16);
  return "#" + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => Math.round(v * (1 - amount)).toString(16).padStart(2, "0")).join("");
}
// Inline placeholder for broken images (no network request, cannot loop)
const IMG_FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="#e2e8f0"/><path d="M30 84l18-22 14 16 11-12 17 18z" fill="#94a3b8"/><circle cx="46" cy="44" r="8" fill="#94a3b8"/></svg>');
document.addEventListener("error", function (e) {
  const el = e.target;
  if (el && el.tagName === "IMG" && el.closest && el.closest("#contentGrid") && !el.dataset.fb) {
    el.dataset.fb = "1";
    el.src = IMG_FALLBACK;
  }
}, true);

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
  let el = document.getElementById('dynTheme');
  if (!el) { el = document.createElement('style'); el.id = 'dynTheme'; document.head.appendChild(el); }
  el.textContent = `:root{--gradient-from:${L.from};--gradient-to:${L.to};--accent:${L.accent};--on-primary:#FFFFFF;--bg-page:${L.bg};--bg-card:${L.surface};--bg-sidebar:${L.surface};--text-main:${L.text};--text-muted:${L.muted};--border-color:${L.border};--color-primary-50:color-mix(in srgb,${L.from} 9%,transparent);--color-primary-600:${tc.lightPrimary || shadeHex(L.from, 0.14)};--color-primary-800:${shadeHex(L.from, 0.3)}}.dark{--gradient-from:${D.from};--gradient-to:${D.to};--accent:${D.accent};--on-primary:#0A0F14;--bg-page:${D.bg};--bg-card:${D.surface};--bg-sidebar:${D.bg};--text-main:${D.text};--text-muted:${D.muted};--border-color:${D.border};--color-primary-50:color-mix(in srgb,${D.primary} 13%,transparent);--color-primary-600:${D.primary};--color-primary-800:${D.text}}`;
}function iconFor(key) {
  const k = String(key || '').toLowerCase();
  for (const id of Object.keys(CAT_ICONS)) { if (k === id || k.includes(id)) return CAT_ICONS[id]; }
  return 'fas fa-folder';
}
function isVideoCat(cat) { return /video/i.test(cat || ''); }
function getSubcategory(item) {
  if (item.subcategory) return String(item.subcategory);
  if (item.tag) return String(item.tag);
  if (Array.isArray(item.tags) && item.tags.length) return String(item.tags[0]);
  return 'General';
}

function totalCount() {
  return (portfolioData.links || []).length + (portfolioData.news || []).length;
}

function buildMenu() {
  const links = portfolioData.links || [];
  const counts = {};
  links.forEach(l => {
    const c = (l.category || 'other').trim() || 'other';
    counts[c] = (counts[c] || 0) + 1;
  });
  menuCategories = [
    { key: 'all', type: 'all', category: 'all', label: 'All', count: totalCount(), icon: iconFor('all') }
  ];
  const news = portfolioData.news || [];
  if (news.length) {
    menuCategories.push({ key: 'news', type: 'news', category: 'news', label: 'News', count: news.length, icon: iconFor('news') });
  }
  Object.keys(counts).sort((a, b) => a.localeCompare(b)).forEach(k => {
    menuCategories.push({
      key: 'link:' + k, type: 'link', category: k, label: humanize(k), count: counts[k], icon: iconFor(k)
    });
  });
  if (!activeCategory) activeCategory = 'all';
}

function setProfileBits() {
  const p = portfolioData.profile || {};
  document.title = (p.name || 'Portfolio') + ' · Collections';
  // desktop
  const photo = document.getElementById('miniPhoto');
  const init = document.getElementById('miniInitials');
  document.getElementById('miniName').textContent = p.name || '';
  document.getElementById('miniTitle').textContent = p.title || '';
  if (p.photo) { photo.src = p.photo; photo.classList.remove('hidden'); init.classList.add('hidden'); }
  else { photo.classList.add('hidden'); init.classList.remove('hidden'); init.textContent = getInitials(p.name); }
  // mobile topbar
  const mPhoto = document.getElementById('mPhoto');
  const mInit = document.getElementById('mInitials');
  document.getElementById('mName').textContent = p.name || '';
  if (mPhoto && mInit) {
    if (p.photo) { mPhoto.src = p.photo; mPhoto.classList.remove('hidden'); mInit.classList.add('hidden'); }
    else { mPhoto.classList.add('hidden'); mInit.classList.remove('hidden'); mInit.textContent = getInitials(p.name); }
  }
}

function navButtonsHtml() {
  return menuCategories.map(m => `
    <button type="button" class="side-link w-full text-left px-3 py-2.5 text-sm font-medium flex items-center gap-2 ${activeCategory === m.key ? 'active' : ''}" data-key="${m.key}" ${activeCategory === m.key ? 'aria-current="true"' : ''}>
      <i class="${m.icon} w-5 text-center opacity-90" aria-hidden="true"></i>
      <span class="flex-1 truncate">${m.label}</span>
      <span class="text-[11px] opacity-90">${m.count}</span>
    </button>
  `).join('');
}

function bindNav(container) {
  if (!container) return;
  container.querySelectorAll('.side-link').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.key;
      activeSub = 'all';
      renderNav();
      renderContent();
      closeCatDrawer();
    });
  });
}

function renderNav() {
  const side = document.getElementById('sideNav');
  const drawer = document.getElementById('drawerNav');
  const html = navButtonsHtml();
  if (side) { side.innerHTML = html; bindNav(side); }
  if (drawer) { drawer.innerHTML = html; bindNav(drawer); }
}

function openCatDrawer() {
  const d = document.getElementById('catDrawer');
  if (!d) return;
  d.classList.add('open');
  d.removeAttribute('inert');
  d.setAttribute('aria-hidden', 'false');
  document.getElementById('catDrawerOverlay')?.classList.add('open');
  document.getElementById('catBtn')?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  const first = d.querySelector('button');
  if (first) first.focus();
}
function closeCatDrawer() {
  const d = document.getElementById('catDrawer');
  if (!d) return;
  d.classList.remove('open');
  d.setAttribute('inert', '');
  d.setAttribute('aria-hidden', 'true');
  document.getElementById('catDrawerOverlay')?.classList.remove('open');
  document.getElementById('catBtn')?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function currentItems() {
  const newsItems = (portfolioData.news || []).map(n => ({
    kind: 'news', title: n.title || 'Untitled', description: n.description || '', image: n.image || '',
    url: n.source || n.url || n.link || '', date: n.date || '', subcategory: getSubcategory(n), category: 'news'
  }));
  const linkItems = (portfolioData.links || []).map(l => ({
    kind: 'link', title: l.title || 'Untitled', description: l.description || '', image: l.image || '',
    url: l.url || '', date: '', category: l.category || 'other', subcategory: getSubcategory(l)
  }));

  if (activeCategory === 'all') {
    // news first (newest-ish), then links
    return [...newsItems, ...linkItems];
  }
  if (activeCategory === 'news') return newsItems;
  if (activeCategory.startsWith('link:')) {
    const cat = activeCategory.slice(5);
    return linkItems.filter(l => (l.category || 'other') === cat);
  }
  return [];
}

function renderContent() {
  let items = currentItems();
  const menu = menuCategories.find(m => m.key === activeCategory);
  const title = menu ? (menu.key === 'all' ? 'All collections' : menu.label) : 'Collections';
  document.getElementById('pageTitle').textContent = title;
  document.getElementById('pageSubtitle').textContent = menu
    ? (menu.key === 'all' ? 'Browse everything in one place' : menu.type === 'news' ? 'Latest updates and announcements' : 'Browse ' + menu.label.toLowerCase())
    : '';
  const mLabel = document.getElementById('mCatLabel');
  if (mLabel) mLabel.textContent = title;

  const subEl = document.getElementById('subFilters');
  // Subcategory filters only for specific sections (not "All")
  if (activeCategory === 'all') {
    subEl.innerHTML = '';
    activeSub = 'all';
  } else {
    const subs = [...new Set(items.map(i => i.subcategory || 'General'))].sort();
    if (subs.length > 1 || (subs.length === 1 && subs[0] !== 'General')) {
      const chips = ['all', ...subs];
      subEl.innerHTML = chips.map(s => `<button type="button" class="filter-chip px-3 py-1 ${activeSub === s ? 'active' : ''}" data-sub="${s}">${s === 'all' ? 'All' : humanize(s)}</button>`).join('');
      subEl.querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', () => { activeSub = btn.dataset.sub; renderContent(); });
      });
    } else {
      subEl.innerHTML = '';
    }
    if (activeSub !== 'all') items = items.filter(i => (i.subcategory || 'General') === activeSub);
  }
  document.getElementById('itemCount').textContent = items.length + ' item' + (items.length !== 1 ? 's' : '');

  const grid = document.getElementById('contentGrid');
  const empty = document.getElementById('emptyState');
  if (!items.length) { grid.innerHTML = ''; empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');

  const videoMode = menu && isVideoCat(menu.category);
  const isAll = activeCategory === 'all';
  // All view: uniform compact cards (no huge video blocks next to books)
  if (isAll) {
    grid.className = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3';
  } else if (videoMode) {
    grid.className = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3';
  } else {
    grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
  }
  window._visibleItems = items;

  function cardHtml(item, i) {
    // ALL view: uniform compact cards so mixed types share the same row height
    if (isAll) {
      let mediaAll = '';
      if (item.kind === 'news' && item.image) {
        mediaAll = `<img src="${item.image}" class="w-11 h-11 rounded-lg object-cover flex-shrink-0" width="44" height="44" alt="" loading="lazy">`;
      } else if (isVideoCat(item.category)) {
        const t = youtubeThumb(item.url) || item.image;
        mediaAll = t
          ? `<img src="${t}" class="w-14 h-11 rounded-lg object-cover flex-shrink-0" alt="" loading="lazy">`
          : `<div class="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" style="background:var(--color-primary-50)"><i class="fab fa-youtube text-red-500"></i></div>`;
      } else if (item.image) {
        mediaAll = `<img src="${item.image}" class="w-11 h-11 rounded-lg object-cover flex-shrink-0" width="44" height="44" alt="" loading="lazy">`;
      } else {
        const cat = (item.category || '').toLowerCase();
        let ic = 'fa-link';
        if (/book/.test(cat)) ic = 'fa-book';
        else if (/doc/.test(cat)) ic = 'fa-file-alt';
        else if (/web|tool|site/.test(cat)) ic = 'fa-globe';
        else if (/repo|git/.test(cat)) ic = 'fa-github';
        else if (item.kind === 'news') ic = 'fa-newspaper';
        const fab = ic === 'fa-github';
        if (/web|tool|site/.test(cat) && item.url) {
          const fav = faviconUrl(item.url);
          mediaAll = fav
            ? `<img src="${fav}" class="w-11 h-11 rounded-lg bg-white p-1 flex-shrink-0" alt="">`
            : `<div class="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" style="background:var(--color-primary-50)"><i class="fas fa-globe" style="color:var(--color-primary-600)"></i></div>`;
        } else {
          mediaAll = `<div class="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" style="background:var(--color-primary-50)"><i class="${fab ? 'fab' : 'fas'} ${ic}" style="color:var(--color-primary-600)"></i></div>`;
        }
      }
      const label = humanize(item.kind === 'news' ? 'news' : (item.category || 'item'));
      if (item.kind === 'news') {
        return `<button type="button" onclick="openItem(${i})" class="card thumb-card rounded-xl p-2.5 text-left w-full h-full" style="min-height:4.5rem">
          <div class="flex items-center gap-2.5">${mediaAll}<div class="min-w-0 flex-1">
            <h3 class="font-semibold text-xs leading-snug line-clamp-2" style="color:var(--text-main)">${item.title}</h3>
            <span class="cat-badge inline-block mt-1">${label}</span>
          </div></div></button>`;
      }
      return `<a href="${item.url || 'collections.html'}" target="_blank" rel="noopener noreferrer" class="card thumb-card rounded-xl p-2.5 block h-full" style="min-height:4.5rem">
        <div class="flex items-center gap-2.5">${mediaAll}<div class="min-w-0 flex-1">
          <h3 class="font-semibold text-xs leading-snug line-clamp-2" style="color:var(--text-main)">${item.title}</h3>
          <span class="cat-badge inline-block mt-1">${label}</span>
        </div></div></a>`;
    }

    if (item.kind === 'news') {
      return `<article class="card thumb-card rounded-xl overflow-hidden cursor-pointer" tabindex="0" role="button" onclick="openItem(${i})" onkeydown="if(event.key==='Enter'||event.key====' '){event.preventDefault();openItem(${i})}">
        ${item.image ? `<img src="${item.image}" class="w-full h-36 object-cover" width="400" height="144" loading="lazy" alt="">` : `<div class="w-full h-24 flex items-center justify-center" style="background:var(--color-primary-50)"><i class="fas fa-newspaper text-2xl" style="color:var(--color-primary-600)"></i></div>`}
        <div class="p-3">
          <p class="text-[11px] mb-1" style="color:var(--text-muted)">${item.date || 'News'}</p>
          <h3 class="font-semibold text-sm leading-snug line-clamp-2" style="color:var(--text-main)">${item.title}</h3>
          <p class="text-xs mt-1 line-clamp-2" style="color:var(--text-muted)">${item.description}</p>
        </div></article>`;
    }
    if (videoMode || isVideoCat(item.category)) {
      const thumb = youtubeThumb(item.url) || item.image;
      return `<a href="${item.url || 'collections.html'}" target="_blank" rel="noopener noreferrer" class="card thumb-card rounded-xl overflow-hidden block">
        <div class="relative bg-black/10" style="height:7.5rem">
          ${thumb ? `<img src="${thumb}" class="w-full h-full object-cover" loading="lazy" alt="">` : `<div class="w-full h-full flex items-center justify-center"><i class="fab fa-youtube text-3xl text-red-500"></i></div>`}
          <span class="absolute bottom-1.5 right-1.5 text-[11px] px-1.5 py-0.5 rounded bg-black/70 text-white"><i class="fas fa-play mr-1"></i>Video</span>
        </div>
        <div class="p-3">
          <h3 class="font-semibold text-sm leading-snug line-clamp-2" style="color:var(--text-main)">${item.title}</h3>
          ${item.description ? `<p class="text-xs mt-1 line-clamp-2" style="color:var(--text-muted)">${item.description}</p>` : ''}
        </div></a>`;
    }
    const cat = (item.category || '').toLowerCase();
    const isWeb = /web|tool|site/.test(cat);
    const isBook = /book/.test(cat);
    const isDoc = /doc/.test(cat);
    const isRepo = /repo|git/.test(cat);
    let media = '';
    if (item.image) media = `<img src="${item.image}" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" alt="">`;
    else if (isWeb && item.url) {
      const fav = faviconUrl(item.url);
      media = fav ? `<img src="${fav}" class="w-10 h-10 rounded-lg bg-white p-1 flex-shrink-0" alt="">` : `<div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style="background:var(--color-primary-50)"><i class="fas fa-globe" style="color:var(--color-primary-600)"></i></div>`;
    } else {
      let ic = 'fa-link';
      if (isBook) ic = 'fa-book'; else if (isDoc) ic = 'fa-file-alt'; else if (isRepo) ic = 'fa-github';
      const fab = ic === 'fa-github';
      media = `<div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style="background:var(--color-primary-50)"><i class="${fab ? 'fab' : 'fas'} ${ic}" style="color:var(--color-primary-600)"></i></div>`;
    }
    return `<a href="${item.url || 'collections.html'}" target="_blank" rel="noopener noreferrer" class="card thumb-card rounded-xl p-3 block">
      <div class="flex items-start gap-3">${media}<div class="min-w-0 flex-1">
        <h3 class="font-semibold text-sm leading-snug line-clamp-2" style="color:var(--text-main)">${item.title}</h3>
        ${item.subcategory && item.subcategory !== 'General' ? `<span class="cat-badge inline-block mt-1">${humanize(item.subcategory)}</span>` : ''}
        ${item.description ? `<p class="text-xs mt-1 line-clamp-2" style="color:var(--text-muted)">${item.description}</p>` : ''}
      </div></div></a>`;
  }

  grid.innerHTML = items.map((item, i) => cardHtml(item, i)).join('');
}

function openItem(i) {
  const item = (window._visibleItems || [])[i];
  if (!item) return;
  document.getElementById('detailTitle').textContent = item.title || '';
  document.getElementById('detailBody').textContent = item.description || '';
  const img = document.getElementById('detailImage');
  if (item.image) { img.src = item.image; img.classList.remove('hidden'); }
  else { img.src = ''; img.classList.add('hidden'); }
  const link = document.getElementById('detailLink');
  if (item.url) { link.href = item.url; link.rel = 'noopener noreferrer'; link.style.display = 'inline-block'; }
  else link.style.display = 'none';
  const modal = document.getElementById('detailModal');
  modal.classList.remove('hidden'); modal.classList.add('flex');
}
function closeDetail() {
  const modal = document.getElementById('detailModal');
  modal.classList.add('hidden'); modal.classList.remove('flex');
}

async function load() {
  try {
    const res = await fetch('./data.json?t=' + Date.now());
    if (!res.ok) throw new Error('HTTP ' + res.status);
    portfolioData = await res.json();
    applyThemeColors();
    activeCategory = 'all';
    activeSub = 'all';
    buildMenu();
    setProfileBits();
    const email = portfolioData.profile?.email || portfolioData.contact?.email || 'mathankumar.sh@psgitech.ac.in';
    const mail = 'mailto:' + email + '?subject=' + encodeURIComponent('Collection suggestion for portfolio');
    ['suggestBtn', 'suggestBtnMobile'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.href = mail;
    });
    renderNav();
    renderContent();
    const loader = document.getElementById('loader');
    if (loader) { loader.style.opacity = '0'; setTimeout(() => loader.style.display = 'none', 300); }
  } catch (e) {
    console.error(e);
    const loader = document.getElementById('loader');
    if (loader) loader.innerHTML = '<div class="text-center px-4"><p class="text-red-600 text-sm">Failed to load data.json</p><button type="button" onclick="location.reload()" class="mt-3 px-4 py-2 rounded-lg text-sm text-white" style="background:var(--color-primary-600)">Retry</button></div>';
  }
}
document.addEventListener('DOMContentLoaded', load);
