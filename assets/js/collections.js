/* ==========================================================================
   collections.js — Renders collections.html including "News" as a category
   ========================================================================== */
(function () {
  'use strict';
  const { esc, loadSiteData, applyThemeSettings, initChrome } = window.PortfolioCommon;

  let allItems = [];
  let state = { q: '', cat: 'all', subcat: 'all' };

  const CAT_META = {
    all: {
      label: 'All Collections',
      icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'
    },
    news: {
      label: 'News',
      icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>'
    },
    tools: {
      label: 'Tools',
      icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'
    },
    repositories: {
      label: 'Repositories',
      icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
    },
    website: {
      label: 'Websites & Simulations',
      icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
    },
    videos: {
      label: 'Videos',
      icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>'
    },
    books: {
      label: 'Books',
      icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
    },
    document: {
      label: 'Documents',
      icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
    }
  };

  document.addEventListener('DOMContentLoaded', async () => {
    initChrome();
    try {
      const data = await loadSiteData();
      applyThemeSettings(data.settings || {});
      if (data.profile && data.profile.name) {
        const b = document.getElementById('brand');
        if (b) b.textContent = data.profile.name;
      }

      // Normalize links + news into unified collection items
      const linkItems = (data.links || []).map(l => ({
        id: l.id,
        title: l.title || 'Untitled',
        description: l.description || '',
        url: l.url || '#',
        category: String(l.category || 'website').toLowerCase(),
        subcategory: l.subcategory || '',
        image: l.image || '',
        date: ''
      }));

      const newsItems = (data.news || []).map(n => ({
        id: n.id,
        title: n.title || 'Untitled News',
        description: n.description || '',
        url: n.source || '#',
        category: 'news',
        subcategory: n.subcategory || '',
        image: n.image || '',
        date: n.date || ''
      }));

      allItems = [...linkItems, ...newsItems];
      initControls();
      renderCollections();
    } catch (err) {
      console.error(err);
    }
  });

  function getMeta(catKey) {
    return CAT_META[catKey] || {
      label: catKey.charAt(0).toUpperCase() + catKey.slice(1),
      icon: CAT_META.website.icon
    };
  }

  function initControls() {
    const searchEl = document.getElementById('cq');
    if (searchEl) {
      searchEl.addEventListener('input', () => {
        state.q = searchEl.value.trim().toLowerCase();
        renderCollections();
      });
    }
    renderCategoryRail();
  }

  function renderCategoryRail() {
    const catsEl = document.getElementById('cats');
    const subWrap = document.getElementById('subcats-wrap');
    const subEl = document.getElementById('subcats');

    const presentCats = ['all', ...Array.from(new Set(allItems.map(i => i.category)))];
    if (catsEl) {
      catsEl.innerHTML = presentCats.map(c => {
        const meta = getMeta(c);
        const count = c === 'all' ? allItems.length : allItems.filter(i => i.category === c).length;
        return `
          <button type="button" class="cat-btn" data-cat="${esc(c)}" aria-pressed="${state.cat === c}">
            <span class="cat-btn-left">${meta.icon}<span>${esc(meta.label)}</span></span>
            <span class="mono" style="font-size:.76rem;opacity:.8">${count}</span>
          </button>
        `;
      }).join('');

      catsEl.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.cat = btn.dataset.cat;
          state.subcat = 'all';
          renderCategoryRail();
          renderCollections();
        });
      });
    }

    // Subcategories
    const subcats = Array.from(new Set(
      allItems
        .filter(i => state.cat === 'all' || i.category === state.cat)
        .map(i => i.subcategory)
        .filter(Boolean)
    ));

    if (subWrap && subEl) {
      if (subcats.length === 0) {
        subWrap.hidden = true;
      } else {
        subWrap.hidden = false;
        const allSubs = ['all', ...subcats];
        subEl.innerHTML = allSubs.map(sc => `
          <button type="button" class="chip" data-sub="${esc(sc)}" aria-pressed="${state.subcat === sc}">
            ${sc === 'all' ? 'All Topics' : '#' + esc(sc)}
          </button>
        `).join('');
        subEl.querySelectorAll('.chip').forEach(btn => {
          btn.addEventListener('click', () => {
            state.subcat = btn.dataset.sub;
            renderCategoryRail();
            renderCollections();
          });
        });
      }
    }
  }

  function extractHost(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch (e) {
      return 'Open link';
    }
  }

  function renderCollections() {
    const groupsEl = document.getElementById('groups');
    const countEl = document.getElementById('count');
    const suggestEl = document.getElementById('suggest');
    if (!groupsEl) return;

    const filtered = allItems.filter(item => {
      if (state.cat !== 'all' && item.category !== state.cat) return false;
      if (state.subcat !== 'all' && item.subcategory !== state.subcat) return false;
      if (state.q) {
        const hay = `${item.title} ${item.description} ${item.category} ${item.subcategory} ${item.url}`.toLowerCase();
        if (!hay.includes(state.q)) return false;
      }
      return true;
    });

    if (countEl) countEl.textContent = `${filtered.length} items shown`;
    if (suggestEl) suggestEl.textContent = `Showing ${filtered.length} of ${allItems.length} total items in Collections & News.`;

    if (!filtered.length) {
      groupsEl.innerHTML = `<div class="card-surface" style="padding:32px;text-align:center"><p class="muted">No items match your search.</p></div>`;
      return;
    }

    // Group by category in clean order
    const order = ['tools', 'repositories', 'website', 'videos', 'books', 'news', 'document'];
    const groupKeys = Array.from(new Set(filtered.map(i => i.category))).sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

    groupsEl.innerHTML = groupKeys.map(catKey => {
      const meta = getMeta(catKey);
      const items = filtered.filter(i => i.category === catKey);
      return `
        <section class="col-group" id="cat-${esc(catKey)}">
          <div class="col-group-head">
            <h2>${meta.icon} <span>${esc(meta.label)}</span></h2>
            <span class="mono muted" style="font-size:.82rem">${items.length} ${items.length === 1 ? 'item' : 'items'}</span>
          </div>
          <div class="col-cards">
            ${items.map(item => `
              <a class="res-card" href="${esc(item.url)}" target="_blank" rel="noopener">
                ${item.image ? `<img class="res-thumb" src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy">` : ''}
                <div class="res-body">
                  <div class="res-tags">
                    <span class="pub-cat">${esc(meta.label)}</span>${item.subcategory ? `<span class="chip" style="padding:1px 8px;font-size:.72rem">#${esc(item.subcategory)}</span>` : ''}
                    ${item.date ? `<span class="mono muted" style="font-size:.72rem">${esc(item.date)}</span>` : ''}
                  </div>
                  <h3 class="res-title">${esc(item.title)}</h3>
                  <p class="res-desc">${esc(String(item.description || '').replace(/\*\*/g, ''))}</p>
                  <div class="res-foot">
                    <span>${esc(extractHost(item.url))}</span>
                    <span>Open ↗</span>
                  </div>
                </div>
              </a>
            `).join('')}
          </div>
        </section>
      `;
    }).join('');
  }
})();