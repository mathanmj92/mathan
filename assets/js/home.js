/* ==========================================================================
   home.js — Renders index.html from data.json
   ========================================================================== */
(function () {
  'use strict';
  const { esc, loadSiteData, applyThemeSettings, renderSocialIcons, initChrome } = window.PortfolioCommon;

  let allPubs = [];
  let pubFilter = { q: '', type: 'all', year: 'all', expanded: false };
  const INITIAL_PUB_LIMIT = 6;

  let allEvents = [];
  let evFilter = { type: 'all', expanded: false };
  const INITIAL_EV_LIMIT = 6;

  let allGallery = [];
  let galExpanded = false;
  const INITIAL_GAL_LIMIT = 8;
  let activeLbIndex = 0;

  document.addEventListener('DOMContentLoaded', async () => {
    initChrome();
    initSiteSearchUI();
    try {
      const data = await loadSiteData();
      applyThemeSettings(data.settings || {});
      renderAll(data);
      hideSkeleton();
      initScrollReveal();
      initDeepLinks();
      setVersioning(data);
    } catch (err) {
      console.error(err);
      hideSkeleton();
    }
  });

  function hideSkeleton() {
    const sk = document.getElementById('page-skeleton');
    if (sk) {
      sk.classList.add('is-done');
      setTimeout(() => sk.remove(), 400);
    }
    document.body.classList.add('content-ready');
  }

  function setVersioning(data) {
    const updated = (data.settings && data.settings.lastUpdated) || new Date().toISOString().slice(0, 7);
    const label = formatMonthYear(updated);
    const lu = document.getElementById('last-updated');
    if (lu) lu.textContent = label ? `Last updated: ${label}` : '';
    const foot = document.getElementById('foot-meta');
    if (foot) {
      const year = new Date().getFullYear();
      foot.textContent = `© ${year}` + (label ? ` · Updated ${label}` : '');
    }
  }

  function formatMonthYear(ym) {
    const s = String(ym || '');
    const m = s.match(/^(\d{4})-(\d{2})/);
    if (m) {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return `${months[parseInt(m[2],10)-1]} ${m[1]}`;
    }
    if (/^\d{4}$/.test(s)) return s;
    return s;
  }

  function initScrollReveal() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mark section containers + stagger grids
    const sections = document.querySelectorAll('.block, .selected-sec');
    sections.forEach(sec => {
      sec.classList.add('reveal', 'reveal-stagger');
      const kids = sec.querySelectorAll('.domain-card, .pub-card, .tl-card, .course-card, .ev-card, .skill-card, .selected-card, .person-card, .res-card');
      kids.forEach((kid, i) => {
        kid.classList.add('reveal-child');
        kid.style.setProperty('--stagger', `${Math.min(i, 12) * 55}ms`);
      });
    });
    const hero = document.querySelector('.hero-stage');
    if (hero) hero.classList.add('reveal');

    if (reduce) {
      document.querySelectorAll('.reveal, .reveal-child').forEach(el => el.classList.add('is-inview'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('is-inview');
          // once revealed, keep it
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    initSectionRail();
    initAmbientVideo();
    initActiveNav();
  }

  function initSectionRail() {
    const rail = document.getElementById('section-rail');
    if (!rail) return;
    const sections = [...document.querySelectorAll('main .block[id], #contact')];
    rail.innerHTML = sections.map(sec => {
      const id = sec.id;
      const label = id.replace(/-/g, ' ');
      return `<button type="button" data-target="${id}" title="${label}" aria-label="Go to ${label}"></button>`;
    }).join('');
    rail.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById(btn.dataset.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const id = en.target.id;
        rail.querySelectorAll('button').forEach(b => {
          b.setAttribute('aria-current', b.dataset.target === id ? 'true' : 'false');
        });
      });
    }, { rootMargin: '-40% 0px -45% 0px', threshold: 0 });
    sections.forEach(s => io.observe(s));
  }

  function initActiveNav() {
    const links = [...document.querySelectorAll('.nav a[href^="#"]')];
    if (!links.length) return;
    const map = links.map(a => {
      const id = a.getAttribute('href').slice(1);
      return { a, el: document.getElementById(id) };
    }).filter(x => x.el);
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const id = en.target.id;
        links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`));
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    map.forEach(m => io.observe(m.el));
  }

  function initAmbientVideo() {
    const wrap = document.getElementById('hero-video-wrap');
    const vid = document.getElementById('hero-video');
    if (!wrap || !vid) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Optional: set data-video on <body> or settings — default path
    const src = document.body.dataset.ambientVideo || 'assets/video/ambient.mp4';
    // Probe if file exists via fetch HEAD-ish
    const tryPlay = async () => {
      try {
        const res = await fetch(src, { method: 'HEAD', cache: 'no-store' });
        if (!res.ok) return;
        vid.src = src;
        wrap.hidden = false;
        const p = vid.play();
        if (p && p.catch) p.catch(() => {});
        // Pause when hero off-screen (perf)
        const hero = document.querySelector('.hero');
        if (!hero) return;
        const io = new IntersectionObserver(([en]) => {
          if (en.isIntersecting) vid.play().catch(() => {});
          else vid.pause();
        }, { threshold: 0.15 });
        io.observe(hero);
      } catch (_) { /* no video file — silent fallback to art layer */ }
    };
    tryPlay();
  }

  function initDeepLinks() {
    const applyHash = () => {
      const hash = (location.hash || '').replace(/^#/, '');
      if (!hash) return;
      // domain-0 (research icon → popup), tl-title-0, etc.
      const panel = document.getElementById(hash);
      if (panel && panel.classList.contains('domain-icon-btn')) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => panel.click(), 350);
        return;
      }
      if (panel) {
        const btn = document.querySelector(`[aria-controls="${hash}"]`);
        if (btn && btn.getAttribute('aria-expanded') === 'false') btn.click();
        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      const section = document.getElementById(hash);
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    window.addEventListener('hashchange', applyHash);
    setTimeout(applyHash, 120);
  }

  function initSiteSearchUI() {
    const btn = document.getElementById('site-search-btn');
    const panel = document.getElementById('site-search-panel');
    const input = document.getElementById('site-q');
    const results = document.getElementById('site-search-results');
    if (!btn || !panel || !input) return;

    let index = [];
    window.__portfolioSearchIndex = index;

    const open = () => {
      panel.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      setTimeout(() => input.focus(), 30);
    };
    const close = () => {
      panel.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      input.value = '';
      if (results) results.innerHTML = '';
    };
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (panel.hidden) open(); else close();
    });
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (panel.hidden) open(); else close();
      }
      if (e.key === 'Escape' && !panel.hidden) close();
    });
    document.addEventListener('click', (e) => {
      if (panel.hidden) return;
      if (panel.contains(e.target) || btn.contains(e.target)) return;
      close();
    });

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!results) return;
      if (q.length < 2) { results.innerHTML = ''; return; }
      const hits = (window.__portfolioSearchIndex || []).filter(item => item.hay.includes(q)).slice(0, 12);
      if (!hits.length) {
        results.innerHTML = `<div class="search-empty">No matches for “${esc(input.value)}”.</div>`;
        return;
      }
      results.innerHTML = hits.map(h => `
        <a class="search-hit" role="option" href="${esc(h.href)}">
          <span class="search-hit-type">${esc(h.type)}</span>
          <span class="search-hit-title">${esc(h.title)}</span>
        </a>`).join('');
      results.querySelectorAll('.search-hit').forEach(a => a.addEventListener('click', () => close()));
    });
  }

  function buildSearchIndex(data) {
    const items = [];
    (data.publications || []).forEach(p => {
      items.push({ type: 'Publication', title: p.title || '', href: '#publications', hay: `${p.title} ${p.authors} ${p.journal} ${p.doi}`.toLowerCase() });
    });
    (data.courses || []).forEach(c => {
      items.push({ type: 'Teaching', title: c.title || c.name || '', href: '#teaching', hay: `${c.title||''} ${c.name||''} ${c.code||''}`.toLowerCase() });
    });
    (data.events || []).forEach(e => {
      items.push({ type: 'Event', title: e.title || '', href: '#events', hay: `${e.title} ${e.place||''} ${e.type||''}`.toLowerCase() });
    });
    (data.researchAreas || []).forEach((a, i) => {
      items.push({ type: 'Research', title: a.title || '', href: `#domain-${i}`, hay: `${a.title} ${a.description||''}`.toLowerCase() });
    });
    (data.skills || []).forEach(s => {
      const name = typeof s === 'string' ? s : (s.name || s.title || '');
      items.push({ type: 'Skill', title: name, href: '#skills', hay: name.toLowerCase() });
    });
    window.__portfolioSearchIndex = items;
  }

  function renderAll(data) {
    const p = data.profile || {};
    const s = data.settings || {};

    if (s.siteTitle) document.title = s.siteTitle;
    const brand = document.getElementById('brand');
    if (brand && p.name) brand.textContent = p.name;

    // 1. HERO
    const nameEl = document.getElementById('name');
    if (nameEl) nameEl.textContent = p.name || 'Mathan Kumar P';
    const roleEl = document.getElementById('role');
    if (roleEl) roleEl.textContent = p.title || '';
    const bioEl = document.getElementById('bio');
    if (bioEl) bioEl.textContent = p.bio || '';
    const locEl = document.getElementById('hero-location');
    if (locEl) locEl.textContent = p.location || 'Coimbatore, Tamil Nadu';

    const kwEl = document.getElementById('keywords');
    if (kwEl) {
      kwEl.innerHTML = (p.keywords || []).map(k => `<li>#${esc(k)}</li>`).join('');
    }

    const cvEl = document.getElementById('cv');
    if (cvEl) {
      if (p.cvUrl) cvEl.href = p.cvUrl;
      else cvEl.hidden = true;
    }

    // Social Media SVG Icons
    const mergedSocial = Object.assign({}, data.socialLinks || {});
    if (!mergedSocial.scholar && p.scholar) mergedSocial.scholar = p.scholar;
    renderSocialIcons(document.getElementById('elsewhere'), mergedSocial);
    renderSocialIcons(document.getElementById('elsewhere2'), mergedSocial);

    // Round Portrait
    const photoEl = document.getElementById('photo');
    const monoEl = document.getElementById('mono');
    if (photoEl && p.photo) {
      photoEl.style.backgroundImage = `url("${esc(p.photo)}")`;
      if (p.photoPosition) photoEl.style.backgroundPosition = p.photoPosition;
      if (monoEl) monoEl.hidden = true;
    }

    // Instrument-style metrics panel
    const metricsEl = document.getElementById('metrics');
    if (metricsEl) {
      if (s.showMetrics === false) {
        metricsEl.hidden = true;
      } else {
        const m = p.metrics || {};
        const pubCount = m.publications || (data.publications ? data.publications.length : 0);
        const items = [
          { val: m.citations ?? 0, lbl: 'Citations', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
          { val: pubCount, lbl: 'Publications', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 15v4"/><path d="M12 11v8"/><path d="M16 7v12"/></svg>' },
          { val: m.hIndex ?? 0, lbl: 'H-index', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-6"/><path d="M20 20v-3"/></svg>' },
          { val: m.i10Index ?? 0, lbl: 'i10', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' }
        ];
        metricsEl.innerHTML = items.map((it, i) => `
          <div class="metric-tile${i === 1 ? ' is-accent' : ''}">
            <span class="metric-ic" aria-hidden="true">${it.icon}</span>
            <span class="metric-val">${esc(it.val)}</span>
            <span class="metric-lbl">${esc(it.lbl)}</span>
          </div>
        `).join('') + '<div class="metric-tickbar" aria-hidden="true"></div>';
      }
    }

    // 2. RESEARCH DOMAINS
    renderResearchDomains(data.researchAreas || []);

    // 3. PUBLICATIONS
    allPubs = (data.publications || []).slice().sort((a, b) => (b.year || 0) - (a.year || 0));
    initPublications();
    buildSearchIndex(data);

    // 4. EXPERIENCE & EDUCATION PATH
    renderPath(data.experience || [], data.academic || []);

    // 5. TEACHING & GOOGLE DRIVE NOTES
    renderTeaching(data.courses || []);

    // 6. SKILLS (Standalone)
    renderSkills(data.skills || []);

    // 7. LAB OPENINGS / JOBS (Standalone)
    renderJobs(data.jobs || [], p.email || (data.contact && data.contact.email));

    // 8. EVENTS & WORKSHOPS (Standalone)
    allEvents = (data.events || []).slice().sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    initEvents();

    // 9. PHOTO GALLERY (Standalone)
    allGallery = data.gallery || [];
    initGallery();

    // 10. MENTORS
    renderMentors(data.mentors || []);

    // 11. FUTURE CUSTOM SECTIONS
    renderCustomSections(data.customSections || []);

    // 12. CONTACT & FOOTER
    renderContact(p, data.contact || {}, s);
  }

  function domainIcon(title) {
    const t = String(title || '').toLowerCase();
    // Monoline research icons
    if (/solar|photovolta|dssc|dye/.test(t))
      return '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="14" r="6"/><path d="M24 4v2M24 22v2M14 14h-2M36 14h-2M16.5 6.5l1.5 1.5M30 20l1.5 1.5M16.5 21.5 18 20M30 8l1.5-1.5"/><rect x="12" y="28" width="24" height="12" rx="2"/><path d="M12 32h24M18 28v12M24 28v12M30 28v12"/></svg>';
    if (/impedance|eis|spectroscop/.test(t))
      return '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 36V12"/><path d="M8 36h32"/><path d="M12 30c6-14 10 2 16-10 4 8 6 4 12 0"/></svg>';
    if (/thin\s*film|deposit|coating|layer/.test(t))
      return '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 30h28l-4 8H14l-4-8z"/><path d="M12 22h24l-2 6H14l-2-6z"/><path d="M14 14h20l-2 6H16l-2-6z"/></svg>';
    if (/battery|storage|supercapac|zinc|ion/.test(t))
      return '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="10" width="20" height="30" rx="3"/><path d="M20 10V7h8v3"/><path d="M22 20l4 4-4 4"/></svg>';
    if (/ion\s*beam|irradiat|character|microscop/.test(t))
      return '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="22" cy="22" r="8"/><path d="M28 28l10 10"/><path d="M14 22h16M22 14v16"/></svg>';
    if (/photo.?electro|electrochem|techniq/.test(t))
      return '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="14" width="32" height="20" rx="3"/><path d="M16 14v-4h16v4"/><circle cx="18" cy="24" r="3"/><circle cx="30" cy="24" r="3"/><path d="M21 24h6"/></svg>';
    // default atom / materials
    return '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="4"/><ellipse cx="24" cy="24" rx="16" ry="7"/><ellipse cx="24" cy="24" rx="16" ry="7" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="16" ry="7" transform="rotate(120 24 24)"/></svg>';
  }

  function renderResearchDomains(areas) {
    const container = document.getElementById('rplot');
    const modal = document.getElementById('rmodal');
    if (!container) return;
    container.classList.add('domain-icon-grid');
    container.innerHTML = areas.map((a, idx) => `
      <button type="button" class="domain-icon-btn" id="domain-${idx}" data-idx="${idx}"
              aria-haspopup="dialog" aria-label="${esc(a.title)}" data-label="${esc(a.title)}">
        <span class="domain-icon" aria-hidden="true">${domainIcon(a.title)}</span>
      </button>
    `).join('');
    if (!modal) return;

    const $ = id => document.getElementById(id);
    const img = $('rm-img');
    const media = $('rm-media');
    let current = 0;
    let lastFocus = null;

    function fill(idx) {
      current = (idx + areas.length) % areas.length;
      const a = areas[current];
      $('rm-title').textContent = a.title || '';
      $('rm-desc').textContent = a.description || '';
      $('rm-yrs').textContent = a.years ? `${a.years} ${Number(a.years) === 1 ? 'year' : 'years'} of experience` : '';
      $('rm-yrs').hidden = !a.years;
      $('rm-ic').innerHTML = domainIcon(a.title);
      $('rm-count').textContent = `${current + 1} / ${areas.length}`;
      media.classList.remove('no-img');
      if (a.image) {
        img.hidden = false;
        img.onerror = () => { img.hidden = true; media.classList.add('no-img'); };
        img.src = a.image;
        img.alt = a.title || '';
      } else {
        img.hidden = true;
        media.classList.add('no-img');
      }
      modal.querySelector('.rmodal-body').scrollTop = 0;
    }
    function open(idx) {
      lastFocus = document.activeElement;
      fill(idx);
      modal.hidden = false;
      document.body.classList.add('modal-open');
      requestAnimationFrame(() => modal.classList.add('is-open'));
      $('rm-close').focus();
    }
    function close() {
      modal.classList.remove('is-open');
      document.body.classList.remove('modal-open');
      setTimeout(() => { modal.hidden = true; }, 200);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    container.querySelectorAll('.domain-icon-btn').forEach(btn =>
      btn.addEventListener('click', () => open(Number(btn.dataset.idx))));
    $('rm-close').addEventListener('click', close);
    $('rm-prev').addEventListener('click', () => fill(current - 1));
    $('rm-next').addEventListener('click', () => fill(current + 1));
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    document.addEventListener('keydown', e => {
      if (modal.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') fill(current - 1);
      if (e.key === 'ArrowRight') fill(current + 1);
    });
  }

  function selectedPubs() {
    const flagged = allPubs.filter(p => p.selected || p.featured);
    return flagged.length ? flagged : allPubs.slice(0, INITIAL_PUB_LIMIT);
  }

  function highlightAuthor(authorsStr) {
    const safe = esc(authorsStr || '');
    return safe.replace(/(Mathan\s*Kumar\s*Pandiyan|Mathan\s*Kumar\s*Pandian|P\.?\s*Mathan\s*Kumar|Mathan\s*Kumar\s*P\.?|Kumar,?\s*P\.?\s*Mathan)/gi, '<mark>$1</mark>');
  }

  function normalizeDoi(doi) {
    if (!doi) return '';
    const d = String(doi).trim();
    if (d.startsWith('http://') || d.startsWith('https://')) return d;
    return `https://doi.org/${d.replace(/^doi:\s*/i, '')}`;
  }

  function formatCatLabel(cat) {
    const c = String(cat || 'article').toLowerCase();
    if (c === 'book_chapter') return 'Book Chapter';
    if (c === 'conference') return 'Conference';
    if (c === 'article') return 'Journal Article';
    return c.replace(/_/g, ' ');
  }

  function initPublications() {
    const sumEl = document.getElementById('pubsum');
    const typesEl = document.getElementById('types');
    const yearsEl = document.getElementById('years');
    const searchEl = document.getElementById('q');
    const moreBtn = document.getElementById('morepubs');

    if (sumEl) {
      const artCount = allPubs.filter(p => p.category === 'article').length;
      const chapCount = allPubs.filter(p => p.category === 'book_chapter').length;
      sumEl.textContent = `${allPubs.length} indexed publications (${artCount} journal articles, ${chapCount} book chapters) across international journals.`;
    }

    // Build Type Chips
    const categories = ['all', ...Array.from(new Set(allPubs.map(p => p.category || 'article')))];
    if (typesEl) {
      typesEl.innerHTML = categories.map(c => {
        const count = c === 'all' ? allPubs.length : allPubs.filter(p => (p.category || 'article') === c).length;
        const lbl = c === 'all' ? `All (${count})` : `${formatCatLabel(c)} (${count})`;
        return `<button type="button" class="chip" data-type="${esc(c)}" aria-pressed="${c === pubFilter.type}">${esc(lbl)}</button>`;
      }).join('');
      typesEl.querySelectorAll('.chip').forEach(btn => {
        btn.addEventListener('click', () => {
          pubFilter.type = btn.dataset.type;
          typesEl.querySelectorAll('.chip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.type === pubFilter.type)));
          renderPublicationsList();
        });
      });
    }

    // Year dropdown
    const years = ['all', ...Array.from(new Set(allPubs.map(p => String(p.year || '')))).filter(Boolean).sort((a, b) => Number(b) - Number(a))];
    if (yearsEl) {
      yearsEl.innerHTML = years.map(y => {
        const lbl = y === 'all' ? 'All years' : `${y} (${allPubs.filter(p => String(p.year) === y).length})`;
        return `<option value="${esc(y)}"${y === pubFilter.year ? ' selected' : ''}>${esc(lbl)}</option>`;
      }).join('');
      yearsEl.onchange = () => {
        pubFilter.year = yearsEl.value;
        renderPublicationsList();
      };
    }

    if (searchEl) {
      searchEl.addEventListener('input', () => {
        pubFilter.q = searchEl.value.trim().toLowerCase();
        renderPublicationsList();
      });
    }

    if (moreBtn) {
      moreBtn.addEventListener('click', () => {
        pubFilter.expanded = !pubFilter.expanded;
        renderPublicationsList();
      });
    }

    renderPublicationsList();
  }

  function renderPublicationsList() {
    const listEl = document.getElementById('plist');
    const moreBtn = document.getElementById('morepubs');
    const countEl = document.getElementById('pubcount');
    if (!listEl) return;

    const filtered = allPubs.filter(p => {
      if (pubFilter.type !== 'all' && (p.category || 'article') !== pubFilter.type) return false;
      if (pubFilter.year !== 'all' && String(p.year) !== pubFilter.year) return false;
      if (pubFilter.q) {
        const hay = `${p.title} ${p.authors} ${p.journal} ${p.year} ${p.doi}`.toLowerCase();
        if (!hay.includes(pubFilter.q)) return false;
      }
      return true;
    });

    const isFiltering = pubFilter.q !== '' || pubFilter.type !== 'all' || pubFilter.year !== 'all';
    const picks = selectedPubs();
    const visible = (pubFilter.expanded || isFiltering) ? filtered : picks;

    if (countEl) countEl.textContent = `Showing ${visible.length} of ${filtered.length} publications`;

    if (visible.length === 0) {
      listEl.innerHTML = `<div class="empty-state card-surface"><p class="empty-title">No publications match</p><p class="muted">Try clearing filters or another keyword.</p><button type="button" class="btn" id="clear-pub-filters">Clear filters</button></div>`;
      const clr = document.getElementById('clear-pub-filters');
      if (clr) clr.addEventListener('click', () => {
        pubFilter = { q: '', type: 'all', year: 'all', expanded: false };
        const q = document.getElementById('q');
        if (q) q.value = '';
        initPublications();
      });
    } else {
      listEl.innerHTML = visible.map(p => {
        const doiUrl = normalizeDoi(p.doi);
        return `
          <article class="pub-card">
            <div>
              <div class="pub-meta-top">
                ${p.year ? `<span class="pub-yr">${esc(p.year)}</span>` : ''}
                <span class="pub-cat">${esc(formatCatLabel(p.category))}</span>
                <span class="pub-journal">${esc(p.journal)}</span>
              </div>
              <h3 class="pub-title">${esc(p.title)}</h3>
              <p class="pub-authors">${highlightAuthor(p.authors)}</p>
            </div>
            <div class="pub-actions">
              ${doiUrl ? `<a class="btn accent-outline" href="${esc(doiUrl)}" target="_blank" rel="noopener" title="Open DOI">
                <span>DOI</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
              </a>` : ''}
            </div>
          </article>
        `;
      }).join('');
    }

    if (moreBtn) {
      if (isFiltering || filtered.length <= picks.length) {
        moreBtn.hidden = true;
      } else {
        moreBtn.hidden = false;
        moreBtn.innerHTML = pubFilter.expanded
          ? `<span>Show selected papers (${picks.length}) ↑</span>`
          : `<span>View all ${filtered.length} publications ↓</span>`;
      }
    }
  }

  function renderPath(exp, acad) {
    const makeTl = (items, titleKey, orgKey) => items.map((e, i) => {
      const desc = String(e.description || '').replace(/^"|"$/g, '');
      const id = `tl-${titleKey}-${i}`;
      return `
        <article class="tl-card is-compact" id="path-${titleKey}-${i}">
          <span class="tl-node" aria-hidden="true"></span>
          <button type="button" class="tl-toggle" aria-expanded="false" aria-controls="${id}">
            <div class="tl-toggle-main">
              <span class="tl-period">${esc(e.period)}</span>
              <h4 class="tl-title">${esc(e[titleKey])}</h4>
              <div class="tl-org">${esc(e[orgKey])}</div>
            </div>
            ${desc ? `<span class="chev" aria-hidden="true">›</span>` : ''}
          </button>
          ${desc ? `<div class="tl-panel" id="${id}" hidden><p class="tl-desc">${esc(desc)}</p></div>` : ''}
        </article>
      `;
    }).join('');

    const expEl = document.getElementById('exp-list');
    const acadEl = document.getElementById('acad-list');
    if (expEl) {
      expEl.innerHTML = makeTl(exp, 'title', 'organization');
      expEl.querySelectorAll('.tl-toggle').forEach(bindToggle);
    }
    if (acadEl) {
      acadEl.innerHTML = makeTl(acad, 'degree', 'institution');
      acadEl.querySelectorAll('.tl-toggle').forEach(bindToggle);
    }

    function bindToggle(btn) {
      btn.addEventListener('click', () => {
        const panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (!panel) return;
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        panel.hidden = open;
        btn.closest('.tl-card')?.classList.toggle('is-open', !open);
      });
    }
  }

  function renderTeaching(courses) {
    const container = document.getElementById('teach');
    if (!container) return;
    if (!courses.length) {
      container.innerHTML = `<p class="muted">Course details coming soon.</p>`;
      return;
    }
    container.innerHTML = courses.map(c => {
      const notes = Array.isArray(c.notes) ? c.notes : (c.notesUrl ? [{ title: 'Lecture Notes (Google Drive)', url: c.notesUrl }] : []);
      const resources = Array.isArray(c.resources) ? c.resources : [];
      const notesHtml = notes
        .filter(n => n && n.url)
        .map(n => `
          <a class="res-link" href="${esc(n.url)}" target="_blank" rel="noopener">
            <span class="res-link-ic">📝</span>
            <span>${esc(n.title || 'Lecture Notes')}</span>
          </a>
        `).join('');
      const resourcesHtml = resources
        .filter(r => r && r.url)
        .map(r => `
          <a class="res-link" href="${esc(r.url)}" target="_blank" rel="noopener">
            <span class="res-link-ic">🔗</span>
            <span>${esc(r.title || 'Resource')}</span>
          </a>
        `).join('');

      return `
        <article class="course-card is-compact">
          ${c.image ? `<img class="course-cover" src="${esc(c.image)}" alt="${esc(c.name)}" loading="lazy">` : ''}
          <div class="course-body">
            <h3>${esc(c.name)}</h3>
            <p class="course-desc">${esc(c.description)}</p>
            <div class="course-meta-grid">
              <div class="course-meta-block">
                <span class="filter-lbl">Syllabus &amp; Books</span>
                <div class="course-links-row">
                  ${c.syllabusUrl ? `<a class="btn primary" href="${esc(c.syllabusUrl)}" target="_blank" rel="noopener">Syllabus PDF</a>` : ''}
                  ${c.booksUrl ? `<a class="btn" href="${esc(c.booksUrl)}" target="_blank" rel="noopener">Reference Books</a>` : ''}
                </div>
              </div>
              ${(notesHtml || resourcesHtml) ? `
              <div class="course-meta-block">
                <span class="filter-lbl">Resources &amp; Notes</span>
                <div class="course-res-list">
                  ${notesHtml}
                  ${resourcesHtml}
                </div>
              </div>` : ''}
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderSkills(skills) {
    const el = document.getElementById('skills-list');
    if (!el) return;
    el.innerHTML = skills.map((s, i) => {
      const lvl = Math.min(100, Math.max(0, Number(s.level) || 70));
      const id = `skill-${i}`;
      return `
        <article class="skill-card is-compact">
          <button type="button" class="skill-toggle" aria-expanded="false" aria-controls="${id}">
            <div class="skill-top">
              <h3>${esc(s.name)}</h3>
              <span class="skill-pct">${lvl}%</span>
            </div>
            ${s.software ? `<span class="skill-soft">${esc(s.software)}</span>` : ''}
            <div class="domain-meter"><span style="width:${lvl}%"></span></div>
            <span class="chev" aria-hidden="true">›</span>
          </button>
          <div class="skill-panel" id="${id}" hidden>
            <p class="skill-desc">${esc(s.description)}</p>
            ${s.link ? `<a class="btn" href="${esc(s.link)}" target="_blank" rel="noopener">View Work ↗</a>` : ''}
          </div>
        </article>
      `;
    }).join('');
    el.querySelectorAll('.skill-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const panel = document.getElementById(btn.getAttribute('aria-controls'));
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        if (panel) panel.hidden = open;
        btn.closest('.skill-card')?.classList.toggle('is-open', !open);
      });
    });
  }

  function renderJobs(jobs, email) {
    const el = document.getElementById('jobs-list');
    if (!el) return;
    if (!jobs.length) {
      el.innerHTML = `<p class="muted">No open student project positions listed at the moment.</p>`;
      return;
    }
    el.innerHTML = jobs.map(j => {
      const isOpen = String(j.status || 'open').toLowerCase() === 'open';
      const mailHref = email ? `mailto:${email}?subject=${encodeURIComponent('Application: ' + (j.title || 'Project Student'))}` : '#contact';
      return `
        <article class="job-card">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px">
              <span class="job-badge ${isOpen ? '' : 'closed'}">${isOpen ? '● Open Position' : 'Closed'}</span>
              <span class="mono" style="font-size:.8rem;font-weight:600">${esc(j.type || 'UG / PG')}</span>
            </div>
            <h3 style="margin:0 0 6px;font-size:1.25rem">${esc(j.title)}</h3>
            <div class="tl-org" style="margin-bottom:10px">${esc(j.location)}</div>
            <p style="margin:0;color:var(--muted);font-size:.95rem">${esc(j.description)}</p>
          </div>
          ${isOpen ? `<div><a class="btn primary" href="${esc(mailHref)}">Apply / Inquire via Email →</a></div>` : ''}
        </article>
      `;
    }).join('');
  }

  function initEvents() {
    const filterEl = document.getElementById('ev-filters');
    const moreBtn = document.getElementById('moreev');
    const types = ['all', ...Array.from(new Set(allEvents.map(e => e.type || 'conference')))];

    if (filterEl) {
      filterEl.innerHTML = types.map(t => {
        const count = t === 'all' ? allEvents.length : allEvents.filter(e => (e.type || 'conference') === t).length;
        const label = t === 'all' ? `All Events (${count})` : `${t.charAt(0).toUpperCase() + t.slice(1)}s (${count})`;
        return `<button type="button" class="chip" data-evtype="${esc(t)}" aria-pressed="${t === evFilter.type}">${esc(label)}</button>`;
      }).join('');
      filterEl.querySelectorAll('.chip').forEach(btn => {
        btn.addEventListener('click', () => {
          evFilter.type = btn.dataset.evtype;
          filterEl.querySelectorAll('.chip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.evtype === evFilter.type)));
          renderEventsList();
        });
      });
    }

    if (moreBtn) {
      moreBtn.addEventListener('click', () => {
        evFilter.expanded = !evFilter.expanded;
        renderEventsList();
      });
    }
    renderEventsList();
  }

  function renderEventsList() {
    const listEl = document.getElementById('events-list');
    const moreBtn = document.getElementById('moreev');
    if (!listEl) return;

    const filtered = allEvents.filter(e => evFilter.type === 'all' || (e.type || 'conference') === evFilter.type);
    const visible = evFilter.expanded ? filtered : filtered.slice(0, INITIAL_EV_LIMIT);

    listEl.innerHTML = visible.map((e, i) => {
      const desc = (e.description && e.description !== 'Event description...') ? e.description : '';
      const id = `ev-${i}`;
      return `
        <article class="ev-card is-compact">
          <button type="button" class="ev-toggle" aria-expanded="false" ${desc ? `aria-controls="${id}"` : ''}>
            <div class="ev-top">
              <span class="pub-cat">${esc(e.type || 'event')}</span>
              <span class="ev-date">${esc(e.date)}</span>
            </div>
            <h3 class="ev-title">${esc(e.title)}</h3>
            <div class="ev-loc">${esc(e.location)}</div>
            ${desc ? `<span class="chev" aria-hidden="true">›</span>` : ''}
          </button>
          ${desc ? `<div class="ev-panel" id="${id}" hidden><p class="ev-desc">${esc(desc)}</p></div>` : ''}
        </article>
      `;
    }).join('');
    listEl.querySelectorAll('.ev-toggle').forEach(btn => {
      const panelId = btn.getAttribute('aria-controls');
      if (!panelId) return;
      btn.addEventListener('click', () => {
        const panel = document.getElementById(panelId);
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        if (panel) panel.hidden = open;
        btn.closest('.ev-card')?.classList.toggle('is-open', !open);
      });
    });

    if (moreBtn) {
      if (filtered.length <= INITIAL_EV_LIMIT) {
        moreBtn.hidden = true;
      } else {
        moreBtn.hidden = false;
        moreBtn.textContent = evFilter.expanded ? `Show Fewer Events ↑` : `View All ${filtered.length} Workshops & Conferences ↓`;
      }
    }
  }

  function initGallery() {
    const moreBtn = document.getElementById('moregal');
    if (moreBtn) {
      moreBtn.addEventListener('click', () => {
        galExpanded = !galExpanded;
        renderGallery();
      });
    }
    initLightbox();
    renderGallery();
  }

  function renderGallery() {
    const mosaic = document.getElementById('mosaic');
    const moreBtn = document.getElementById('moregal');
    if (!mosaic) return;

    const visible = galExpanded ? allGallery : allGallery.slice(0, INITIAL_GAL_LIMIT);
    mosaic.innerHTML = visible.map((g, idx) => `
      <button type="button" class="gal-item" data-idx="${idx}" aria-label="View photo: ${esc(g.title)}">
        <img src="${esc(g.image)}" alt="${esc(g.title)}" loading="lazy">
        <div class="gal-cap">${esc(g.title)}</div>
      </button>
    `).join('');

    mosaic.querySelectorAll('.gal-item').forEach(btn => {
      btn.addEventListener('click', () => openLightbox(Number(btn.dataset.idx)));
    });

    if (moreBtn) {
      if (allGallery.length <= INITIAL_GAL_LIMIT) {
        moreBtn.hidden = true;
      } else {
        moreBtn.hidden = false;
        moreBtn.textContent = galExpanded ? `Show Fewer Photos ↑` : `Explore All ${allGallery.length} Lab & Event Photos ↓`;
      }
    }
  }

  function initLightbox() {
    const lb = document.getElementById('lightbox');
    const closeBtn = document.getElementById('lb-close');
    const prevBtn = document.getElementById('lb-prev');
    const nextBtn = document.getElementById('lb-next');
    if (!lb) return;

    closeBtn.addEventListener('click', () => { lb.hidden = true; });
    prevBtn.addEventListener('click', () => stepLightbox(-1));
    nextBtn.addEventListener('click', () => stepLightbox(1));
    lb.addEventListener('click', e => { if (e.target === lb) lb.hidden = true; });
    document.addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') lb.hidden = true;
      if (e.key === 'ArrowLeft') stepLightbox(-1);
      if (e.key === 'ArrowRight') stepLightbox(1);
    });
  }

  function openLightbox(idx) {
    const lb = document.getElementById('lightbox');
    if (!lb || !allGallery[idx]) return;
    activeLbIndex = idx;
    updateLightboxSlide();
    lb.hidden = false;
  }

  function stepLightbox(delta) {
    if (!allGallery.length) return;
    activeLbIndex = (activeLbIndex + delta + allGallery.length) % allGallery.length;
    updateLightboxSlide();
  }

  function updateLightboxSlide() {
    const item = allGallery[activeLbIndex];
    if (!item) return;
    document.getElementById('lb-img').src = item.image;
    document.getElementById('lb-img').alt = item.title || '';
    document.getElementById('lb-title').textContent = item.title || '';
    const desc = (item.description && item.description !== 'Description') ? item.description : '';
    document.getElementById('lb-desc').textContent = desc;
    document.getElementById('lb-count').textContent = `${activeLbIndex + 1} / ${allGallery.length}`;
  }

  function renderMentors(mentors) {
    const el = document.getElementById('people');
    if (!el) return;
    el.innerHTML = mentors.map(m => `
      <a class="person-card" href="${esc(m.profileUrl || '#')}" target="_blank" rel="noopener">
        <img class="person-avatar" src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy">
        <span class="person-role">${esc(m.role)}</span>
        <strong style="font-family:'Archivo',sans-serif;font-size:1.05rem">${esc(m.name)}</strong>
        <span class="muted" style="font-size:.86rem">${esc(m.institution)}</span>
      </a>
    `).join('');
  }

  function renderCustomSections(customSections) {
    const root = document.getElementById('custom-sections-root');
    if (!root || !Array.isArray(customSections) || !customSections.length) return;
    root.innerHTML = customSections.filter(sec => sec.visible !== false).map(sec => `
      <section class="block" id="custom-${esc(sec.id)}">
        <div class="wrap">
          <div class="sec-head">
            <div>
              <span class="sec-eyebrow">✦ Custom Section</span>
              <h2 class="display">${esc(sec.title)}</h2>
            </div>
            ${sec.subtitle ? `<p class="sec-sub">${esc(sec.subtitle)}</p>` : ''}
          </div>
          <div class="research-grid">
            ${(sec.items || []).map(it => `
              <article class="domain-card">
                <div class="domain-body">
                  ${it.badge ? `<span class="pub-cat" style="align-self:flex-start;margin-bottom:8px">${esc(it.badge)}</span>` : ''}
                  <h3>${esc(it.heading)}</h3>
                  <p>${esc(it.text)}</p>
                  ${it.url ? `<a class="btn accent-outline" href="${esc(it.url)}" target="_blank" rel="noopener">Explore Link ↗</a>` : ''}
                </div>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    `).join('');
  }

  function renderContact(profile, contact, settings) {
    const email = contact.email || profile.email || '';
    const scholar = contact.scholar || profile.scholar || '';
    const mailEl = document.getElementById('mail');
    const mailBtn = document.getElementById('mail-btn');
    const mailBtnTxt = document.getElementById('mail-btn-txt');
    const schBtn = document.getElementById('contact-scholar-btn');
    const schBtnTxt = document.getElementById('scholar-btn-txt');
    const msgEl = document.getElementById('contact-msg');
    const officeEl = document.getElementById('office');
    const footEl = document.getElementById('foot-l');

    if (mailEl && email) {
      mailEl.href = `mailto:${email}`;
      mailEl.textContent = email;
    }
    if (mailBtn && email) mailBtn.href = `mailto:${email}`;
    if (mailBtnTxt && contact.buttonTextEmail) mailBtnTxt.textContent = contact.buttonTextEmail;
    if (schBtn && scholar) schBtn.href = scholar;
    if (schBtnTxt && contact.buttonTextScholar) schBtnTxt.textContent = contact.buttonTextScholar;
    if (msgEl && contact.message) msgEl.textContent = contact.message;

    if (officeEl) {
      officeEl.innerHTML = `
        <strong style="font-family:'Archivo',sans-serif;font-size:1.08rem;display:block;margin-bottom:6px">${esc(profile.name || 'Mathan Kumar P')}</strong>
        <div class="muted" style="margin-bottom:10px">${esc(profile.title || '')}</div>
        <div>📍 ${esc(profile.location || 'Coimbatore, Tamil Nadu')}</div>
        ${email ? `<div style="margin-top:8px" class="mono"><a href="mailto:${esc(email)}">${esc(email)}</a></div>` : ''}
      `;
    }
    if (footEl && settings.footerText) footEl.textContent = settings.footerText;
  }
})();