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
    try {
      const data = await loadSiteData();
      applyThemeSettings(data.settings || {});
      renderAll(data);
    } catch (err) {
      console.error(err);
    }
  });

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

    const schEl = document.getElementById('scholar');
    if (schEl) {
      const sUrl = p.scholar || (data.socialLinks && data.socialLinks.scholar);
      if (sUrl) schEl.href = sUrl;
      else schEl.hidden = true;
    }

    // Social Media SVG Icons
    const mergedSocial = Object.assign({}, data.socialLinks || {});
    if (!mergedSocial.scholar && p.scholar) mergedSocial.scholar = p.scholar;
    renderSocialIcons(document.getElementById('elsewhere'), mergedSocial);
    renderSocialIcons(document.getElementById('elsewhere2'), mergedSocial);

    // Round Portrait + Metrics Underneath
    const photoEl = document.getElementById('photo');
    const monoEl = document.getElementById('mono');
    if (photoEl && p.photo) {
      photoEl.style.backgroundImage = `url("${esc(p.photo)}")`;
      if (p.photoPosition) photoEl.style.backgroundPosition = p.photoPosition;
      if (monoEl) monoEl.hidden = true;
    }

    const metricsEl = document.getElementById('metrics');
    if (metricsEl) {
      if (s.showMetrics === false) {
        metricsEl.hidden = true;
      } else {
        const m = p.metrics || {};
        const pubCount = m.publications || (data.publications ? data.publications.length : 0);
        metricsEl.innerHTML = `
          <div class="metric-tile">
            <span class="metric-val">${esc(m.citations ?? 0)}</span>
            <span class="metric-lbl">Citations</span>
          </div>
          <div class="metric-tile">
            <span class="metric-val">${esc(pubCount)}</span>
            <span class="metric-lbl">Publications</span>
          </div>
          <div class="metric-tile">
            <span class="metric-val">${esc(m.hIndex ?? 0)}</span>
            <span class="metric-lbl">h-index</span>
          </div>
          <div class="metric-tile">
            <span class="metric-val">${esc(m.i10Index ?? 0)}</span>
            <span class="metric-lbl">i10-index</span>
          </div>
        `;
      }
    }

    // 2. RESEARCH DOMAINS (with JSON images)
    renderResearchDomains(data.researchAreas || []);

    // 3. PUBLICATIONS
    allPubs = (data.publications || []).slice().sort((a, b) => (b.year || 0) - (a.year || 0));
    initPublications();

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

  function renderResearchDomains(areas) {
    const container = document.getElementById('rplot');
    if (!container) return;
    const maxYrs = Math.max(1, ...areas.map(a => Number(a.years) || 1));
    container.innerHTML = areas.map((a, idx) => {
      const pct = Math.min(100, Math.round(((Number(a.years) || 1) / maxYrs) * 100));
      const desc = String(a.description || '');
      const id = `domain-${idx}`;
      return `
        <article class="domain-card is-compact">
          <button type="button" class="domain-toggle" aria-expanded="false" aria-controls="${id}">
            <div class="domain-toggle-left">
              ${a.image ? `<img class="domain-thumb" src="${esc(a.image)}" alt="" loading="lazy">` : `<span class="domain-thumb-ph"></span>`}
              <div>
                <h3>${esc(a.title)}</h3>
                ${a.years ? `<span class="domain-yr-inline">${esc(a.years)} ${Number(a.years) === 1 ? 'yr' : 'yrs'}</span>` : ''}
              </div>
            </div>
            <span class="chev" aria-hidden="true">›</span>
          </button>
          <div class="domain-panel" id="${id}" hidden>
            <p class="domain-desc">${esc(desc)}</p>
            <div class="domain-meter" title="${esc(a.years || '')} years"><span style="width:${pct}%"></span></div>
          </div>
        </article>
      `;
    }).join('');

    container.querySelectorAll('.domain-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const panel = document.getElementById(btn.getAttribute('aria-controls'));
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        if (panel) panel.hidden = open;
        btn.closest('.domain-card')?.classList.toggle('is-open', !open);
      });
    });
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

    // Build Year Chips
    const years = ['all', ...Array.from(new Set(allPubs.map(p => String(p.year || '')))).filter(Boolean).sort((a, b) => Number(b) - Number(a))];
    if (yearsEl) {
      yearsEl.innerHTML = years.map(y => {
        const lbl = y === 'all' ? 'All Years' : y;
        return `<button type="button" class="chip" data-year="${esc(y)}" aria-pressed="${y === pubFilter.year}">${esc(lbl)}</button>`;
      }).join('');
      yearsEl.querySelectorAll('.chip').forEach(btn => {
        btn.addEventListener('click', () => {
          pubFilter.year = btn.dataset.year;
          yearsEl.querySelectorAll('.chip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.year === pubFilter.year)));
          renderPublicationsList();
        });
      });
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
    const visible = (pubFilter.expanded || isFiltering) ? filtered : filtered.slice(0, INITIAL_PUB_LIMIT);

    if (countEl) countEl.textContent = `Showing ${visible.length} of ${filtered.length} publications`;

    if (visible.length === 0) {
      listEl.innerHTML = `<div class="card-surface" style="padding:24px;text-align:center" class="muted">No publications match that filter.</div>`;
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
      if (isFiltering || filtered.length <= INITIAL_PUB_LIMIT) {
        moreBtn.hidden = true;
      } else {
        moreBtn.hidden = false;
        moreBtn.innerHTML = pubFilter.expanded
          ? `<span>Show Selected Publications (${INITIAL_PUB_LIMIT}) ↑</span>`
          : `<span>View Full Publication List (${filtered.length} Papers) ↓</span>`;
      }
    }
  }

  function renderPath(exp, acad) {
    const makeTl = (items, titleKey, orgKey) => items.map((e, i) => {
      const desc = String(e.description || '').replace(/^"|"$/g, '');
      const id = `tl-${titleKey}-${i}`;
      return `
        <article class="tl-card is-compact">
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