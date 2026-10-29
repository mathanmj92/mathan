/* ==========================================================================
   common.js — Shared Data Loader, Palette Engine & SVG Icon Library
   ========================================================================== */
(function () {
  'use strict';

  const DRAFT_KEY = 'mathan_portfolio_draft_v2';
  const PALETTE_KEY = 'mathan_palette_choice';

  const PALETTES = [
    { id: 'potentiostat', label: 'Potentiostat (Light)', color: '#11241C', accent: '#D9520B' },
    { id: 'blueprint', label: 'Blueprint (Light)', color: '#1E3A8A', accent: '#0284C7' },
    { id: 'oscilloscope', label: 'Oscilloscope (Dark)', color: '#0B1116', accent: '#10B981' },
    { id: 'copper', label: 'Copper (Warm)', color: '#431407', accent: '#EA580C' }
  ];

  // Crisp SVG Icons for Social Media & Categories
  const SOCIAL_ICONS = {
    linkedin: {
      label: 'LinkedIn',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>'
    },
    orcid: {
      label: 'ORCID',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="10" x2="8" y2="16"/><circle cx="8" cy="7" r="0.6" fill="currentColor"/><path d="M11 16v-6h2.5a2.5 2.5 0 0 1 0 5H11"/></svg>'
    },
    scholar: {
      label: 'Google Scholar',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>'
    },
    researchgate: {
      label: 'ResearchGate',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M7 16V8h3.5a2.5 2.5 0 0 1 0 5H7"/><path d="m11 13 2.5 3"/><path d="M17 10a2 2 0 1 0 0 4h1v-2h-1"/></svg>'
    },
    youtube: {
      label: 'YouTube',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>'
    },
    github: {
      label: 'GitHub',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>'
    },
    twitter: {
      label: 'X / Twitter',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>'
    },
    facebook: {
      label: 'Facebook',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>'
    },
    instagram: {
      label: 'Instagram',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>'
    },
    website: {
      label: 'Website',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
    }
  };

  function esc(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  async function loadSiteData() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('preview') === '1') {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        try { return JSON.parse(raw); } catch (e) { /* fallback */ }
      }
    }
    const res = await fetch('data.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Could not load data.json');
    return await res.json();
  }

  function applyThemeSettings(settings = {}) {
    const root = document.documentElement;
    const saved = localStorage.getItem(PALETTE_KEY);
    let active = saved || settings.palette || 'potentiostat';

    if (!saved && settings.darkModeDefault) {
      active = 'oscilloscope';
    } else if (!saved && settings.followDarkMode && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      active = 'oscilloscope';
    }

    setPalette(active, false);

    // Apply custom color overrides if configured in settings.paletteOverrides
    if (settings.paletteOverrides && settings.paletteOverrides.customEnabled) {
      const isDark = root.getAttribute('data-palette') === 'oscilloscope';
      const tc = settings.themeColors || {};
      if (!isDark) {
        if (tc.lightBackground) root.style.setProperty('--bg', tc.lightBackground);
        if (tc.lightSurface) root.style.setProperty('--surface', tc.lightSurface);
        if (tc.lightText) root.style.setProperty('--ink', tc.lightText);
        if (tc.lightGradientFrom) root.style.setProperty('--accent', tc.lightGradientFrom);
      } else {
        if (tc.darkBackground) root.style.setProperty('--bg', tc.darkBackground);
        if (tc.darkSurface) root.style.setProperty('--surface', tc.darkSurface);
        if (tc.darkText) root.style.setProperty('--ink', tc.darkText);
        if (tc.darkGradientFrom) root.style.setProperty('--accent', tc.darkGradientFrom);
      }
    }

    const switchers = document.querySelectorAll('[data-palette-switch]');
    if (settings.allowPaletteSwitch === false) {
      switchers.forEach(el => { el.hidden = true; });
      return;
    }

    switchers.forEach(container => {
      container.hidden = false;
      container.classList.add('palette-dd');
      const current = PALETTES.find(p => p.id === active) || PALETTES[0];
      container.innerHTML = `
        <button type="button" class="palette-trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="Colour theme">
          <span class="pal-swatch" style="background:linear-gradient(135deg, ${current.color} 55%, ${current.accent} 55%)"></span>
          <svg class="palette-chev" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div class="palette-menu" role="listbox" hidden>
          ${PALETTES.map(p => `
            <button type="button" class="palette-option" role="option" data-pal="${p.id}" aria-selected="${p.id === active}">
              <span class="pal-swatch" style="background:linear-gradient(135deg, ${p.color} 55%, ${p.accent} 55%)"></span>
              <span class="palette-option-label">${esc(p.label)}</span>
            </button>
          `).join('')}
        </div>
      `;
      const trigger = container.querySelector('.palette-trigger');
      const menu = container.querySelector('.palette-menu');
      const close = () => {
        menu.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
        container.classList.remove('is-open');
      };
      const open = () => {
        // close other palette menus
        document.querySelectorAll('.palette-dd.is-open').forEach(el => {
          if (el !== container) {
            el.classList.remove('is-open');
            const m = el.querySelector('.palette-menu');
            const tr = el.querySelector('.palette-trigger');
            if (m) m.hidden = true;
            if (tr) tr.setAttribute('aria-expanded', 'false');
          }
        });
        menu.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        container.classList.add('is-open');
      };
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (menu.hidden) open(); else close();
      });
      menu.querySelectorAll('.palette-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          setPalette(btn.dataset.pal, true);
          close();
        });
      });
      document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) close();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      });
    });
  }

  function setPalette(id, persist) {
    document.documentElement.setAttribute('data-palette', id);
    if (persist) localStorage.setItem(PALETTE_KEY, id);
    const meta = PALETTES.find(p => p.id === id);
    document.querySelectorAll('.palette-option').forEach(b => {
      b.setAttribute('aria-selected', String(b.dataset.pal === id));
    });
    if (meta) {
      document.querySelectorAll('.palette-trigger .pal-swatch').forEach(sw => {
        sw.style.background = `linear-gradient(135deg, ${meta.color} 55%, ${meta.accent} 55%)`;
      });
    }
    // Mobile browser chrome color
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      const chrome = {
        potentiostat: '#F3F5F1',
        blueprint: '#F0F4F8',
        oscilloscope: '#0A0F14',
        copper: '#FAF6F2'
      };
      themeMeta.setAttribute('content', chrome[id] || chrome.potentiostat);
    }
  }

  function renderSocialIcons(container, socialLinks = {}) {
    if (!container) return;
    const order = ['scholar', 'orcid', 'researchgate', 'linkedin', 'youtube', 'github', 'twitter', 'facebook', 'instagram', 'website'];
    const items = order
      .filter(k => socialLinks[k] && String(socialLinks[k]).trim() !== '')
      .map(k => {
        const meta = SOCIAL_ICONS[k] || SOCIAL_ICONS.website;
        return `<a class="soc-icon-link" href="${esc(socialLinks[k])}" target="_blank" rel="noopener" title="${esc(meta.label)}" aria-label="${esc(meta.label)}">${meta.svg}</a>`;
      });
    container.innerHTML = items.join('');
  }

  function initChrome() {
    // App-style vertical drawer
    const menuBtn = document.querySelector('.menu-btn');
    const drawer = document.getElementById('drawer');
    const closeBtn = document.getElementById('drawer-close');
    let open = false;

    const closeDrawer = () => {
      if (!drawer) return;
      open = false;
      drawer.setAttribute('hidden', '');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.body.classList.remove('drawer-open');
    };
    const openDrawer = () => {
      if (!drawer) return;
      open = true;
      drawer.removeAttribute('hidden');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('drawer-open');
      // Focus trap: focus first link
      const focusable = drawer.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      if (focusable.length) focusable[0].focus();
    };

    if (menuBtn && drawer) {
      menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (open) closeDrawer();
        else openDrawer();
      });
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeDrawer();
        });
      }
      drawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => closeDrawer());
      });
      // Backdrop / outside click — delay bind so open click doesn't immediately close
      document.addEventListener('click', (e) => {
        if (!open) return;
        if (drawer.contains(e.target)) return;
        if (menuBtn.contains(e.target)) return;
        closeDrawer();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && open) {
          closeDrawer();
          if (menuBtn) menuBtn.focus();
          return;
        }
        if (e.key === 'Tab' && open) {
          const focusable = [...drawer.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')].filter(el => !el.disabled && el.offsetParent !== null);
          if (!focusable.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      });
    }

    // Scroll progress + to-top + subtle parallax
    const toTop = document.getElementById('to-top');
    const prog = document.getElementById('scroll-progress');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Tag art elements for parallax depths
    const artLayer = document.querySelector('.art-layer');
    if (artLayer && !reduceMotion) {
      artLayer.querySelectorAll('.art-blob-a, .art-ring-a, .art-dots-a').forEach(el => el.setAttribute('data-parallax', '0.12'));
      artLayer.querySelectorAll('.art-blob-b, .art-blob-c, .art-ring-b, .art-dots-b').forEach(el => el.setAttribute('data-parallax', '0.06'));
      artLayer.querySelectorAll('.art-grid').forEach(el => el.setAttribute('data-parallax', '0.03'));
    }
    const profileArt = document.querySelector('.profile-art');
    if (profileArt && !reduceMotion) profileArt.setAttribute('data-parallax', '0.08');

    const parallaxEls = () => document.querySelectorAll('[data-parallax]');
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;
      if (toTop) toTop.classList.toggle('show', y > 420);
      if (prog) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        prog.style.width = h > 0 ? `${Math.min(100, (y / h) * 100)}%` : '0%';
      }
      if (!reduceMotion && !ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          parallaxEls().forEach(el => {
            const depth = parseFloat(el.getAttribute('data-parallax') || '0.05');
            // Keep CSS keyframe transforms by using translate3d on a wrapper sense:
            // apply only an extra offset via translate on top of animation where possible
            el.style.translate = `0 ${Math.round(y * depth * -1)}px`;
          });
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toTop) {
      toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  }

  window.PortfolioCommon = {
    DRAFT_KEY,
    PALETTES,
    SOCIAL_ICONS,
    esc,
    loadSiteData,
    applyThemeSettings,
    setPalette,
    renderSocialIcons,
    initChrome
  };
})();