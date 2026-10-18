/* ==========================================================================
   admin.js — Visual Browser Editor for data.json
   Default Password: mathan2026
   ========================================================================== */
(function () {
  'use strict';

  const ADMIN_PASSWORD = 'mathan2026';
  const SESSION_KEY = 'mathan_admin_unlocked';
  const { DRAFT_KEY, PALETTES, esc, loadSiteData, applyThemeSettings } = window.PortfolioCommon;

  let siteData = null;
  let activeTab = 'profile';
  let editIndex = -1;

  const TABS = [
    { group: 'Portfolio Home', id: 'profile', label: '👤 Profile & Metrics' },
    { group: 'Portfolio Home', id: 'socialLinks', label: '🔗 Social Media Icons' },
    { group: 'Portfolio Home', id: 'researchAreas', label: '🔬 Research Domains', list: true },
    { group: 'Portfolio Home', id: 'publications', label: '📄 Publications', list: true },
    { group: 'Portfolio Home', id: 'experience', label: '💼 Experience', list: true },
    { group: 'Portfolio Home', id: 'academic', label: '🎓 Education', list: true },
    { group: 'Portfolio Home', id: 'courses', label: '👨‍🏫 Teaching & Drive Notes', list: true },
    { group: 'Portfolio Home', id: 'skills', label: '⚡ Skills Arsenal', list: true },
    { group: 'Portfolio Home', id: 'jobs', label: '📌 Job / Lab Openings', list: true },
    { group: 'Portfolio Home', id: 'events', label: '🗓️ Events & Workshops', list: true },
    { group: 'Portfolio Home', id: 'gallery', label: '🖼️ Photo Gallery', list: true },
    { group: 'Portfolio Home', id: 'mentors', label: '🤝 Mentors', list: true },
    { group: 'Collections Page', id: 'links', label: '🗂️ Collections Vault', list: true },
    { group: 'Collections Page', id: 'news', label: '📰 News (in Collections)', list: true },
    { group: 'Future & Theme', id: 'customSections', label: '➕ Future Custom Sections', list: true },
    { group: 'Future & Theme', id: 'settings', label: '🎨 Themes & Light/Dark' }
  ];

document.addEventListener('DOMContentLoaded', async () => {
    const loginEl = document.getElementById('login');
    const appEl = document.getElementById('app');
    if (loginEl) loginEl.hidden = true;
    if (appEl) appEl.hidden = false;

    document.getElementById('discard').addEventListener('click', async () => {
      if (!confirm('Discard unsaved browser draft and reload from data.json?')) return;
      localStorage.removeItem(DRAFT_KEY);
      await bootData(true);
      toast('Reverted to clean data.json');
    });

    document.getElementById('download').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(siteData, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'data.json';
      a.click();
      URL.revokeObjectURL(a.href);
      toast('Downloaded data.json!');
    });

    await bootData(false);
  });

  async function bootData(forceClean) {
    const rawDraft = !forceClean && localStorage.getItem(DRAFT_KEY);
    if (rawDraft) {
      try {
        siteData = JSON.parse(rawDraft);
        markDirty(true);
      } catch (e) { siteData = null; }
    }
    if (!siteData) {
      const res = await fetch('data.json', { cache: 'no-store' });
      siteData = await res.json();
      markDirty(false);
    }
    if (!Array.isArray(siteData.customSections)) siteData.customSections = [];
    applyThemeSettings(siteData.settings || {});
    renderNav();
    renderMain();
    renderSide();
  }

  function saveDraft() {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(siteData));
    applyThemeSettings(siteData.settings || {});
    markDirty(true);
    renderNav();
    renderSide();
  }

  function markDirty(dirty) {
    const st = document.getElementById('status');
    if (!st) return;
    st.textContent = dirty ? 'Draft Modified' : 'Saved';
    st.className = 'status-pill ' + (dirty ? 'dirty' : 'clean');
  }

  function toast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.hidden = true; }, 2600);
  }

  function renderNav() {
    const nav = document.getElementById('nav');
    let lastGroup = '';
    nav.innerHTML = TABS.map(t => {
      const groupHead = t.group !== lastGroup ? `<div class="adm-nav-group">${esc(t.group)}</div>` : '';
      lastGroup = t.group;
      const count = t.list && Array.isArray(siteData[t.id]) ? `<span class="mono" style="font-size:.74rem;opacity:.75">${siteData[t.id].length}</span>` : '';
      return `
        ${groupHead}
        <button type="button" class="adm-tab" data-tab="${t.id}" aria-current="${t.id === activeTab}">
          <span>${esc(t.label)}</span>
          ${count}
        </button>
      `;
    }).join('');

    nav.querySelectorAll('.adm-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        editIndex = -1;
        renderNav();
        renderMain();
      });
    });
  }

  function renderMain() {
    const main = document.getElementById('main');
    if (activeTab === 'profile') return renderProfileEditor(main);
    if (activeTab === 'socialLinks') return renderSocialEditor(main);
    if (activeTab === 'settings') return renderSettingsEditor(main);
    return renderListEditor(main, activeTab);
  }

  // --- 1. PROFILE & METRICS EDITOR ---
  function renderProfileEditor(main) {
    const p = siteData.profile || (siteData.profile = {});
    const m = p.metrics || (p.metrics = {});
    const c = siteData.contact || (siteData.contact = {});
    main.innerHTML = `
      <div class="card-surface" style="padding:24px">
        <h2 class="display" style="margin:0 0 18px">Profile, Portrait &amp; Scholar Metrics</h2>
        <div class="field-grid-2">
          <div class="field"><label>Full Name</label><input id="p-name" value="${esc(p.name)}"></div>
          <div class="field"><label>Title / Role</label><input id="p-title" value="${esc(p.title)}"></div>
          <div class="field"><label>Location</label><input id="p-loc" value="${esc(p.location)}"></div>
          <div class="field"><label>Email</label><input id="p-email" value="${esc(p.email)}"></div>
          <div class="field"><label>Portrait Image URL (or assets/img/profile.jpg)</label><input id="p-photo" value="${esc(p.photo)}"></div>
          <div class="field"><label>CV Link (Google Drive / PDF)</label><input id="p-cv" value="${esc(p.cvUrl)}"></div>
        </div>
        <div class="field"><label>Short Bio</label><textarea id="p-bio">${esc(p.bio)}</textarea></div>
        <div class="field"><label>Keywords (comma-separated)</label><input id="p-kw" value="${esc((p.keywords || []).join(', '))}"></div>

        <h3 style="margin:22px 0 10px">Google Scholar Metrics (Shown Beneath Round Portrait)</h3>
        <div class="field-grid-2">
          <div class="field"><label>Total Citations</label><input type="number" id="m-cit" value="${esc(m.citations ?? 0)}"></div>
          <div class="field"><label>Total Publications</label><input type="number" id="m-pub" value="${esc(m.publications ?? 0)}"></div>
          <div class="field"><label>h-index</label><input type="number" id="m-h" value="${esc(m.hIndex ?? 0)}"></div>
          <div class="field"><label>i10-index</label><input type="number" id="m-i10" value="${esc(m.i10Index ?? 0)}"></div>
        </div>

        <h3 style="margin:22px 0 10px">Contact Section Message</h3>
        <div class="field"><label>Invitation Message</label><textarea id="c-msg">${esc(c.message)}</textarea></div>

        <button class="btn primary" type="button" id="save-profile">Save Profile Changes</button>
      </div>
    `;

    document.getElementById('save-profile').addEventListener('click', () => {
      p.name = document.getElementById('p-name').value.trim();
      p.title = document.getElementById('p-title').value.trim();
      p.location = document.getElementById('p-loc').value.trim();
      p.email = document.getElementById('p-email').value.trim();
      c.email = p.email;
      p.photo = document.getElementById('p-photo').value.trim();
      p.cvUrl = document.getElementById('p-cv').value.trim();
      p.bio = document.getElementById('p-bio').value.trim();
      p.keywords = document.getElementById('p-kw').value.split(',').map(s => s.trim()).filter(Boolean);
      m.citations = Number(document.getElementById('m-cit').value) || 0;
      m.publications = Number(document.getElementById('m-pub').value) || 0;
      m.hIndex = Number(document.getElementById('m-h').value) || 0;
      m.i10Index = Number(document.getElementById('m-i10').value) || 0;
      c.message = document.getElementById('c-msg').value.trim();
      saveDraft();
      toast('Profile & metrics saved!');
    });
  }

  // --- 2. SOCIAL MEDIA LINKS EDITOR ---
  function renderSocialEditor(main) {
    const s = siteData.socialLinks || (siteData.socialLinks = {});
    const keys = ['scholar', 'orcid', 'researchgate', 'linkedin', 'youtube', 'github', 'twitter', 'facebook', 'instagram', 'website'];
    main.innerHTML = `
      <div class="card-surface" style="padding:24px">
        <h2 class="display" style="margin:0 0 8px">Social &amp; Academic Icon Links</h2>
        <p class="muted" style="margin:0 0 18px">Any link filled below automatically displays its SVG icon button in the Hero and Contact sections.</p>
        <div class="field-grid-2">
          ${keys.map(k => `
            <div class="field">
              <label style="text-transform:capitalize">${esc(k)} URL</label>
              <input data-soc="${esc(k)}" value="${esc(s[k] || '')}" placeholder="https://...">
            </div>
          `).join('')}
        </div>
        <button class="btn primary" type="button" id="save-soc">Save Social Links</button>
      </div>
    `;
    document.getElementById('save-soc').addEventListener('click', () => {
      main.querySelectorAll('[data-soc]').forEach(inp => {
        s[inp.dataset.soc] = inp.value.trim();
      });
      if (s.scholar) siteData.profile.scholar = s.scholar;
      saveDraft();
      toast('Social icon links updated!');
    });
  }

  // --- 3. THEME, LIGHT/DARK MODE & PALETTE EDITOR ---
  function renderSettingsEditor(main) {
    const st = siteData.settings || (siteData.settings = {});
    const tc = st.themeColors || (st.themeColors = {});
    const po = st.paletteOverrides || (st.paletteOverrides = {});

    main.innerHTML = `
      <div class="card-surface" style="padding:24px">
        <h2 class="display" style="margin:0 0 8px">Theme, Light/Dark Mode &amp; Palettes</h2>
        <p class="muted" style="margin:0 0 20px">Control default Light/Dark mode, choose your default scientific colour palette, or customize colours.</p>

        <div class="field-grid-2">
          <div class="field">
            <label>Site Title</label>
            <input id="st-title" value="${esc(st.siteTitle || '')}">
          </div>
          <div class="field">
            <label>Footer Text</label>
            <input id="st-foot" value="${esc(st.footerText || '')}">
          </div>
          <div class="field">
            <label>Default Palette Preset</label>
            <select id="st-pal">
              ${PALETTES.map(p => `<option value="${p.id}" ${st.palette === p.id ? 'selected' : ''}>${esc(p.label)}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>Visitor Theme Switcher</label>
            <select id="st-switch">
              <option value="true" ${st.allowPaletteSwitch !== false ? 'selected' : ''}>Visible in Header</option>
              <option value="false" ${st.allowPaletteSwitch === false ? 'selected' : ''}>Hidden</option>
            </select>
          </div>
        </div>

        <div class="field-grid-2" style="margin-top:8px">
          <label style="display:flex;align-items:center;gap:10px;cursor:pointer">
            <input type="checkbox" id="st-darkdef" ${st.darkModeDefault ? 'checked' : ''}>
            <span>Open in Dark Mode (Oscilloscope) by default</span>
          </label>
          <label style="display:flex;align-items:center;gap:10px;cursor:pointer">
            <input type="checkbox" id="st-follow" ${st.followDarkMode !== false ? 'checked' : ''}>
            <span>Follow visitor device Dark Mode preference</span>
          </label>
        </div>

        <hr style="border:none;border-top:1px solid var(--line);margin:22px 0">

        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:14px">
          <input type="checkbox" id="st-custom-on" ${po.customEnabled ? 'checked' : ''}>
          <strong>Enable Custom Light &amp; Dark Mode Hex Color Overrides</strong>
        </label>

        <div class="field-grid-2">
          <div class="field"><label>Light Background</label><input type="color" id="tc-lbg" value="${esc(tc.lightBackground || '#f8fafc')}"></div>
          <div class="field"><label>Light Card Surface</label><input type="color" id="tc-lsurf" value="${esc(tc.lightSurface || '#ffffff')}"></div>
          <div class="field"><label>Light Text</label><input type="color" id="tc-ltxt" value="${esc(tc.lightText || '#1f2937')}"></div>
          <div class="field"><label>Light Accent</label><input type="color" id="tc-lacc" value="${esc(tc.lightGradientFrom || '#D9520B')}"></div>
          <div class="field"><label>Dark Background</label><input type="color" id="tc-dbg" value="${esc(tc.darkBackground || '#141414')}"></div>
          <div class="field"><label>Dark Card Surface</label><input type="color" id="tc-dsurf" value="${esc(tc.darkSurface || '#212121')}"></div>
          <div class="field"><label>Dark Text</label><input type="color" id="tc-dtxt" value="${esc(tc.darkText || '#f8fafc')}"></div>
          <div class="field"><label>Dark Accent</label><input type="color" id="tc-dacc" value="${esc(tc.darkGradientFrom || '#45a9d3')}"></div>
        </div>

        <button class="btn primary" type="button" id="save-settings">Save Theme Settings</button>
      </div>
    `;

    document.getElementById('save-settings').addEventListener('click', () => {
      st.siteTitle = document.getElementById('st-title').value.trim();
      st.footerText = document.getElementById('st-foot').value.trim();
      st.palette = document.getElementById('st-pal').value;
      st.allowPaletteSwitch = document.getElementById('st-switch').value === 'true';
      st.darkModeDefault = document.getElementById('st-darkdef').checked;
      st.followDarkMode = document.getElementById('st-follow').checked;
      po.customEnabled = document.getElementById('st-custom-on').checked;

      tc.lightBackground = document.getElementById('tc-lbg').value;
      tc.lightSurface = document.getElementById('tc-lsurf').value;
      tc.lightText = document.getElementById('tc-ltxt').value;
      tc.lightGradientFrom = document.getElementById('tc-lacc').value;
      tc.darkBackground = document.getElementById('tc-dbg').value;
      tc.darkSurface = document.getElementById('tc-dsurf').value;
      tc.darkText = document.getElementById('tc-dtxt').value;
      tc.darkGradientFrom = document.getElementById('tc-dacc').value;

      localStorage.removeItem('mathan_palette_choice');
      saveDraft();
      toast('Theme & palette settings saved!');
    });
  }

  // --- 4. GENERIC & SPECIALIZED LIST EDITORS ---
  function renderListEditor(main, key) {
    const arr = Array.isArray(siteData[key]) ? siteData[key] : (siteData[key] = []);
    const tabMeta = TABS.find(t => t.id === key);

    if (editIndex >= 0 && editIndex < arr.length) {
      return renderItemForm(main, key, arr[editIndex], editIndex);
    }

    main.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;flex-wrap:wrap;gap:10px">
        <div>
          <h2 class="display" style="margin:0">${esc(tabMeta ? tabMeta.label : key)}</h2>
          <p class="muted" style="margin:2px 0 0;font-size:.9rem">${arr.length} entries • Reorder with ↑↓ or click Edit</p>
        </div>
        <button class="btn primary" type="button" id="add-item">+ Add New Entry</button>
      </div>
      <div id="item-list">
        ${arr.map((item, idx) => {
          const title = item.title || item.name || item.degree || `Entry #${idx + 1}`;
          const sub = item.journal || item.organization || item.institution || item.category || item.role || item.date || '';
          return `
            <div class="adm-item-row">
              <div>
                <strong style="font-family:'Archivo',sans-serif">${esc(title)}</strong>${sub ? `<div class="muted" style="font-size:.82rem">${esc(sub)}</div>` : ''}
              </div>
              <div style="display:flex;gap:6px">
                <button class="icon-btn" type="button" data-move="-1" data-idx="${idx}" title="Move Up">↑</button>
                <button class="icon-btn" type="button" data-move="1" data-idx="${idx}" title="Move Down">↓</button>
                <button class="btn" type="button" data-edit="${idx}">Edit</button>
                <button class="icon-btn" type="button" data-del="${idx}" title="Delete" style="color:#dc2626">×</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    document.getElementById('add-item').addEventListener('click', () => {
      const blank = createBlankItem(key);
      arr.unshift(blank);
      editIndex = 0;
      saveDraft();
      renderMain();
    });

    main.querySelectorAll('[data-edit]').forEach(b => {
      b.addEventListener('click', () => {
        editIndex = Number(b.dataset.edit);
        renderMain();
      });
    });

    main.querySelectorAll('[data-del]').forEach(b => {
      b.addEventListener('click', () => {
        const i = Number(b.dataset.del);
        if (!confirm('Delete this entry?')) return;
        arr.splice(i, 1);
        saveDraft();
        renderMain();
      });
    });

    main.querySelectorAll('[data-move]').forEach(b => {
      b.addEventListener('click', () => {
        const i = Number(b.dataset.idx);
        const dir = Number(b.dataset.move);
        const target = i + dir;
        if (target < 0 || target >= arr.length) return;
        const tmp = arr[i];
        arr[i] = arr[target];
        arr[target] = tmp;
        saveDraft();
        renderMain();
      });
    });
  }

  function createBlankItem(key) {
    const id = Date.now();
    switch (key) {
      case 'researchAreas': return { id, title: 'New Research Area', years: 1, image: '', description: '' };
      case 'publications': return { id, title: 'New Publication', authors: 'Mathan Kumar P', journal: '', year: new Date().getFullYear(), category: 'article', doi: '' };
      case 'experience': return { id, title: 'Role Title', organization: '', period: '2026 - Present', description: '' };
      case 'academic': return { id, degree: 'Degree Title', institution: '', period: '', description: '' };
      case 'courses': return { id, name: 'New Course', description: '', image: '', syllabusUrl: '', booksUrl: '', notes: [{ title: 'Unit 1 Notes (Google Drive)', url: '' }], resources: [{ title: 'Extra resource', url: '' }] };
      case 'skills': return { id, name: 'New Skill', software: '', level: 75, description: '', link: '' };
      case 'jobs': return { id, title: 'Internship / Project Student', type: 'UG / PG', location: 'PSG Institute of Technology and Applied Research', status: 'open', description: '' };
      case 'events': return { id, title: 'New Workshop or Conference', type: 'workshop', date: '2026-08-01', location: '', description: '' };
      case 'gallery': return { id, title: 'New Photo', image: '', description: '' };
      case 'mentors': return { id, name: 'Collaborator Name', role: 'Collaborator', institution: '', photo: '', profileUrl: '' };
      case 'links': return { id, title: 'New Resource', category: 'website', subcategory: 'Physics', url: 'https://', description: '' };
      case 'news': return { id, title: 'New News Item', date: '2026', source: 'https://', image: '', description: '' };
      case 'customSections': return { id, title: 'Patents & Sponsored Grants', subtitle: 'Custom future section', visible: true, items: [{ heading: 'Sample Entry', badge: '2026', text: 'Details here...', url: '' }] };
      default: return { id, title: 'New Entry' };
    }
  }

  function renderItemForm(main, key, item) {
    // Special Editor for Courses (with Google Drive Notes Repeater)
    if (key === 'courses') {
      if (!Array.isArray(item.notes)) item.notes = [];
      main.innerHTML = `
        <div class="card-surface" style="padding:24px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
            <h2 class="display" style="margin:0">Edit Course &amp; Google Drive Notes</h2>
            <button class="btn" type="button" id="back-list">← Back to Courses</button>
          </div>
          <div class="field"><label>Course Title</label><input id="c-name" value="${esc(item.name)}"></div>
          <div class="field"><label>Course Description &amp; Topics Covered</label><textarea id="c-desc">${esc(item.description)}</textarea></div>
          <div class="field-grid-2">
            <div class="field"><label>Cover Image URL</label><input id="c-img" value="${esc(item.image)}"></div>
            <div class="field"><label>Syllabus PDF Link</label><input id="c-syl" value="${esc(item.syllabusUrl)}"></div>
            <div class="field"><label>Reference Book Link</label><input id="c-book" value="${esc(item.booksUrl)}"></div>
          </div>

          <div class="notes-repeater">
            <strong style="font-family:'Archivo',sans-serif;display:block;margin-bottom:10px">☁️ Google Drive Lecture Notes</strong>
            <div id="notes-rows">
              ${item.notes.map((n, ni) => `
                <div class="note-row">
                  <input data-ntitle="${ni}" placeholder="Label (e.g., Unit 1: Dielectrics Notes)" value="${esc(n.title)}">
                  <input data-nurl="${ni}" placeholder="Google Drive URL" value="${esc(n.url)}">
                  <button class="icon-btn" type="button" data-ndel="${ni}" style="color:#dc2626">×</button>
                </div>
              `).join('')}
            </div>
            <button class="btn" type="button" id="add-note">+ Add Note Link</button>
          </div>

          <div class="notes-repeater" style="margin-top:18px">
            <strong style="font-family:'Archivo',sans-serif;display:block;margin-bottom:10px">🔗 Extra Resources (labs, demos, datasets…)</strong>
            <div id="res-rows">
              ${(item.resources || []).map((r, ri) => `
                <div class="note-row">
                  <input data-rtitle="${ri}" placeholder="Resource title" value="${esc(r.title || '')}">
                  <input data-rurl="${ri}" placeholder="https://…" value="${esc(r.url || '')}">
                  <button class="icon-btn" type="button" data-rdel="${ri}" style="color:#dc2626">×</button>
                </div>
              `).join('')}
            </div>
            <button class="btn" type="button" id="add-res">+ Add Resource</button>
          </div>

          <button class="btn primary" type="button" id="save-course">Save Course &amp; Resources</button>
        </div>
      `;

      if (!Array.isArray(item.resources)) item.resources = [];
      const syncCourseInputs = () => {
        item.name = document.getElementById('c-name').value.trim();
        item.description = document.getElementById('c-desc').value.trim();
        item.image = document.getElementById('c-img').value.trim();
        item.syllabusUrl = document.getElementById('c-syl').value.trim();
        item.booksUrl = document.getElementById('c-book').value.trim();
        main.querySelectorAll('[data-ntitle]').forEach(inp => {
          const idx = Number(inp.dataset.ntitle);
          if (item.notes[idx]) item.notes[idx].title = inp.value.trim();
        });
        main.querySelectorAll('[data-nurl]').forEach(inp => {
          const idx = Number(inp.dataset.nurl);
          if (item.notes[idx]) item.notes[idx].url = inp.value.trim();
        });
        main.querySelectorAll('[data-rtitle]').forEach(inp => {
          const idx = Number(inp.dataset.rtitle);
          if (item.resources[idx]) item.resources[idx].title = inp.value.trim();
        });
        main.querySelectorAll('[data-rurl]').forEach(inp => {
          const idx = Number(inp.dataset.rurl);
          if (item.resources[idx]) item.resources[idx].url = inp.value.trim();
        });
      };

      document.getElementById('back-list').addEventListener('click', () => { editIndex = -1; renderMain(); });
      document.getElementById('add-note').addEventListener('click', () => {
        syncCourseInputs();
        item.notes.push({ title: `Unit ${item.notes.length + 1} Notes (Drive)`, url: '' });
        saveDraft();
        renderMain();
      });
      main.querySelectorAll('[data-ndel]').forEach(b => {
        b.addEventListener('click', () => {
          syncCourseInputs();
          item.notes.splice(Number(b.dataset.ndel), 1);
          saveDraft();
          renderMain();
        });
      });
      const addRes = document.getElementById('add-res');
      if (addRes) {
        addRes.addEventListener('click', () => {
          syncCourseInputs();
          item.resources.push({ title: '', url: '' });
          saveDraft();
          renderMain();
        });
      }
      main.querySelectorAll('[data-rdel]').forEach(b => {
        b.addEventListener('click', () => {
          syncCourseInputs();
          item.resources.splice(Number(b.dataset.rdel), 1);
          saveDraft();
          renderMain();
        });
      });
      document.getElementById('save-course').addEventListener('click', () => {
        syncCourseInputs();
        saveDraft();
        toast('Course, notes & resources saved!');
        editIndex = -1;
        renderMain();
      });
      return;
    }

    // Generic dynamic field editor for all other lists
    const fields = Object.keys(item).filter(k => k !== 'id');
    main.innerHTML = `
      <div class="card-surface" style="padding:24px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <h2 class="display" style="margin:0">Edit Entry</h2>
          <button class="btn" type="button" id="back-list">← Back to List</button>
        </div>
        ${fields.map(f => {
          const val = item[f];
          if (typeof val === 'object' && val !== null) {
            return `<div class="field"><label>${esc(f)} (JSON)</label><textarea data-jsonfield="${esc(f)}">${esc(JSON.stringify(val, null, 2))}</textarea></div>`;
          }
          if (f === 'description' || f === 'authors') {
            return `<div class="field"><label style="text-transform:capitalize">${esc(f)}</label><textarea data-field="${esc(f)}">${esc(val)}</textarea></div>`;
          }
          if (f === 'category' && key === 'publications') {
            return `<div class="field"><label>Category</label>
              <select data-field="category">
                <option value="article" ${val === 'article' ? 'selected' : ''}>Journal Article (article)</option>
                <option value="book_chapter" ${val === 'book_chapter' ? 'selected' : ''}>Book Chapter (book_chapter)</option>
                <option value="conference" ${val === 'conference' ? 'selected' : ''}>Conference Paper (conference)</option>
                <option value="patent" ${val === 'patent' ? 'selected' : ''}>Patent</option>
              </select>
            </div>`;
          }
          if (f === 'category' && key === 'links') {
            return `<div class="field"><label>Collection Category</label>
              <select data-field="category">
                <option value="Tools" ${String(val).toLowerCase() === 'tools' ? 'selected' : ''}>Tools</option>
                <option value="Repositories" ${String(val).toLowerCase() === 'repositories' ? 'selected' : ''}>Repositories</option>
                <option value="website" ${String(val).toLowerCase() === 'website' ? 'selected' : ''}>Website / Simulation</option>
                <option value="Videos" ${String(val).toLowerCase() === 'videos' ? 'selected' : ''}>Videos</option>
                <option value="books" ${String(val).toLowerCase() === 'books' ? 'selected' : ''}>Books</option>
                <option value="document" ${String(val).toLowerCase() === 'document' ? 'selected' : ''}>Document</option>
              </select>
            </div>`;
          }
          return `<div class="field"><label style="text-transform:capitalize">${esc(f)}</label><input data-field="${esc(f)}" value="${esc(val)}"></div>`;
        }).join('')}
        <button class="btn primary" type="button" id="save-item">Save Entry</button>
      </div>
    `;

    document.getElementById('back-list').addEventListener('click', () => { editIndex = -1; renderMain(); });
    document.getElementById('save-item').addEventListener('click', () => {
      main.querySelectorAll('[data-field]').forEach(el => {
        const f = el.dataset.field;
        const orig = item[f];
        item[f] = typeof orig === 'number' ? (Number(el.value) || 0) : el.value.trim();
      });
      main.querySelectorAll('[data-jsonfield]').forEach(el => {
        try { item[el.dataset.jsonfield] = JSON.parse(el.value); } catch (e) { /* keep existing */ }
      });
      saveDraft();
      toast('Entry saved!');
      editIndex = -1;
      renderMain();
    });
  }

  function renderSide() {
    const side = document.getElementById('side');
    if (!side || !siteData) return;
    side.innerHTML = `
      <h3 class="display" style="margin:0 0 10px;font-size:1.15rem">Portfolio Summary</h3>
      <p class="muted" style="font-size:.86rem;margin:0 0 16px">All changes are stored in your browser draft until you click <strong>Download data.json</strong> and commit to GitHub.</p>
      <div style="display:flex;flex-direction:column;gap:8px;font-size:.88rem">
        <div class="adm-item-row" style="margin:0"><span>Publications</span><strong class="mono">${(siteData.publications || []).length}</strong></div>
        <div class="adm-item-row" style="margin:0"><span>Research Domains</span><strong class="mono">${(siteData.researchAreas || []).length}</strong></div>
        <div class="adm-item-row" style="margin:0"><span>Courses</span><strong class="mono">${(siteData.courses || []).length}</strong></div>
        <div class="adm-item-row" style="margin:0"><span>Skills</span><strong class="mono">${(siteData.skills || []).length}</strong></div>
        <div class="adm-item-row" style="margin:0"><span>Events &amp; Workshops</span><strong class="mono">${(siteData.events || []).length}</strong></div>
        <div class="adm-item-row" style="margin:0"><span>Gallery Photos</span><strong class="mono">${(siteData.gallery || []).length}</strong></div>
        <div class="adm-item-row" style="margin:0"><span>Collections Links</span><strong class="mono">${(siteData.links || []).length}</strong></div>
        <div class="adm-item-row" style="margin:0"><span>News Items</span><strong class="mono">${(siteData.news || []).length}</strong></div>
      </div>
    `;
  }
})();