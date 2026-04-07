/* ============================================================
   Evantix Demo Site — Shared JavaScript
   All pages load this file. Hub pages use renderHeader +
   renderBreadcrumb. Demo pages (L3) call initDemo().
   ============================================================ */

;(function () {

  /* ── Utilities ─────────────────────────────────────────── */

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  window.esc = esc;

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  window.hexToRgba = hexToRgba;

  const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230F295E'/%3E%3Cpath d='M16 7L5 13l11 6 11-6z' fill='%232FA6A4'/%3E%3Cpath d='M9 16.5v5.5c0 1.66 3.13 3 7 3s7-1.34 7-3V16.5' stroke='%232FA6A4' stroke-width='1.8' stroke-linecap='round' fill='none'/%3E%3Cpath d='M27 13v5' stroke='white' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E";

  /* ── Header ────────────────────────────────────────────── */

  window.renderHeader = function ({ backHref, backLabel } = {}) {
    let favicon = document.querySelector("link[rel='icon']");
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/svg+xml';
      document.head.appendChild(favicon);
    }
    favicon.href = FAVICON;

    const backBtn = backHref
      ? `<a class="header-back" href="${esc(backHref)}">
           <svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
           ${esc(backLabel || 'Back')}
         </a>`
      : `<div class="header-spacer"></div>`;

    const html = `
<header class="site-header">
  <div class="header-inner">
    ${backBtn}
    <div class="header-brand">
      <h1>Evantix</h1>
      <p>Unified Student Intelligence</p>
    </div>
    <div class="header-spacer"></div>
  </div>
</header>`;

    const el = document.getElementById('site-header');
    if (el) el.outerHTML = html;
    else document.body.insertAdjacentHTML('afterbegin', html);
  };

  /* ── Breadcrumb ─────────────────────────────────────────── */

  window.renderBreadcrumb = function (items) {
    const parts = items.map((item, i) => {
      const isLast = i === items.length - 1;
      const sep = i > 0 ? `<span class="breadcrumb-sep" aria-hidden="true">›</span>` : '';
      if (isLast) return `${sep}<span class="breadcrumb-current" aria-current="page">${esc(item.label)}</span>`;
      return `${sep}<a href="${esc(item.href)}">${esc(item.label)}</a>`;
    }).join('');

    const html = `
<div class="breadcrumb-bar">
  <nav class="breadcrumb" aria-label="Breadcrumb">${parts}</nav>
</div>`;

    const el = document.getElementById('breadcrumb');
    if (el) el.outerHTML = html;
    else {
      const header = document.querySelector('.site-header');
      if (header) header.insertAdjacentHTML('afterend', html);
    }
  };

  /* ── Demo Page ──────────────────────────────────────────── */

  window.initDemo = function () {
    const demo = window.DEMO;
    if (!demo) {
      console.error('[Evantix] No DEMO data found. Ensure content.js is loaded before shared.js.');
      return;
    }

    const color = demo.color || '#2FA6A4';
    document.documentElement.style.setProperty('--hub-color', color);

    if (demo.persona && demo.hub) {
      document.title = `${demo.persona} — ${demo.hub} — Evantix`;
    }

    const steps = demo.steps || [];
    let current = 0;

    const m = window.location.hash.match(/#step-(\d+)/);
    if (m) {
      const n = parseInt(m[1], 10) - 1;
      if (n >= 0 && n < steps.length) current = n;
    }

    renderHeader({ backHref: '../', backLabel: demo.hub });
    renderBreadcrumb([
      { label: 'App Hub', href: '../../../index.html' },
      { label: demo.hub, href: '../' },
      { label: demo.persona }
    ]);

    const main = document.getElementById('demo-main');
    if (!main) return;

    main.innerHTML = `
      <div class="demo-wrapper">
        <div class="demo-header">
          <div class="demo-header-inner">
            <div class="demo-persona-info">
              <div class="hub-tag">${esc(demo.hub)}</div>
              <h2>${esc(demo.persona)} Walkthrough</h2>
            </div>
            <div class="demo-progress-wrap">
              <div class="demo-progress-label" id="progressLabel"></div>
              <div class="step-dots" id="stepDots"></div>
              <div class="demo-progress-bar">
                <div class="demo-progress-fill" id="progressFill"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="demo-content" id="stepContent"></div>

        <div class="demo-nav">
          <div class="demo-nav-inner">
            <button class="btn btn-ghost" id="btnPrev">
              <svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Previous
            </button>
            <span class="nav-step-label" id="navStepLabel"></span>
            <button class="btn btn-primary" id="btnNext">
              Next
              <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="lightbox-overlay" id="lightbox" onclick="closeLightbox()">
        <button class="lightbox-close" onclick="event.stopPropagation();closeLightbox()" aria-label="Close">✕</button>
        <img id="lightboxImg" src="" alt="">
      </div>`;

    document.getElementById('btnPrev').addEventListener('click', () => goStep(-1));
    document.getElementById('btnNext').addEventListener('click', () => goStep(1));

    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goStep(1); }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); goStep(-1); }
      if (e.key === 'Escape') closeLightbox();
    });

    window.openLightbox = function (src) {
      document.getElementById('lightboxImg').src = src;
      document.getElementById('lightbox').classList.add('open');
    };
    window.closeLightbox = function () {
      document.getElementById('lightbox').classList.remove('open');
    };

    function goStep(dir) {
      current = Math.max(0, Math.min(steps.length - 1, current + dir));
      renderStep();
    }
    window.goStep = goStep;
    window.jumpStep = function (i) { current = i; renderStep(); };

    function renderStep() {
      const step = steps[current];
      const total = steps.length;
      const pct = Math.round(((current + 1) / total) * 100);

      document.getElementById('progressLabel').textContent = `Step ${current + 1} of ${total}`;
      document.getElementById('progressFill').style.cssText = `width:${pct}%;background:${color}`;
      document.getElementById('navStepLabel').textContent = `${current + 1} / ${total}`;

      document.getElementById('stepDots').innerHTML = steps.map((s, i) => {
        let cls = 'step-dot';
        if (i < current) cls += ' step-dot--done';
        else if (i === current) cls += ' step-dot--active';
        return `<button class="${cls}" onclick="jumpStep(${i})" title="Step ${i + 1}: ${esc(s.title)}" aria-label="Go to step ${i + 1}"></button>`;
      }).join('');

      const shots = step.screenshots || [];
      const shotsHTML = shots.length > 0
        ? shots.map(s => buildScreenshot(s, demo.hubSlug, demo.personaSlug)).join('')
        : buildPlaceholder('Screenshot coming soon');

      document.getElementById('stepContent').innerHTML = `
        <div class="step-number-label" style="color:${color}">Step ${current + 1} of ${total}</div>
        <h3 class="step-title">${esc(step.title)}</h3>
        <p class="step-description">${esc(step.description || '')}</p>
        <div class="screenshots-row">${shotsHTML}</div>`;

      document.querySelectorAll('.screenshot-frame[data-src]').forEach(function (frame) {
        frame.addEventListener('click', function () { openLightbox(frame.dataset.src); });
      });

      const btnPrev = document.getElementById('btnPrev');
      const btnNext = document.getElementById('btnNext');
      btnPrev.disabled = current === 0;
      btnNext.disabled = false;
      btnNext.style.display = '';

      if (current === total - 1) {
        btnNext.innerHTML = 'Finish &nbsp;✓';
        btnNext.onclick = showComplete;
      } else {
        btnNext.innerHTML = `Next <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
        btnNext.onclick = function () { goStep(1); };
      }

      history.replaceState(null, '', `#step-${current + 1}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showComplete() {
      document.getElementById('stepContent').innerHTML = `
        <div class="demo-complete">
          <div class="demo-complete-icon">
            <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <h2>Demo Complete!</h2>
          <p>You've finished the <strong>${esc(demo.persona)}</strong> walkthrough for <strong>${esc(demo.hub)}</strong>.</p>
          <a class="btn btn-primary" href="../" style="background:${color};display:inline-flex;margin:0 auto">
            ← Back to ${esc(demo.hub)}
          </a>
        </div>`;
      document.getElementById('btnPrev').disabled = false;
      document.getElementById('btnNext').style.display = 'none';
      document.getElementById('navStepLabel').textContent = 'Complete ✓';
      history.replaceState(null, '', '#complete');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderStep();
  };

  /* ── Screenshot helpers ─────────────────────────────────── */

  function buildScreenshot(s, hubSlug, personaSlug) {
    if (!s.file && !s.src) {
      return buildPlaceholder(s.caption || 'Screenshot coming soon');
    }
    const src = s.file
      ? `../../../assets/screenshots/${encodeURIComponent(hubSlug)}/${encodeURIComponent(personaSlug)}/${encodeURIComponent(s.file)}`
      : (s.src || '');
    return `
      <div class="screenshot-item">
        <div class="screenshot-frame" data-src="${esc(src)}" style="cursor:zoom-in">
          <img src="${esc(src)}" alt="${esc(s.caption || '')}" loading="lazy">
        </div>
        ${s.caption ? `<div class="screenshot-caption">${esc(s.caption)}</div>` : ''}
      </div>`;
  }

  function buildPlaceholder(caption) {
    return `
      <div class="screenshot-item">
        <div class="screenshot-frame" style="cursor:default">
          <div class="screenshot-placeholder">
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
            <span class="screenshot-placeholder-label">Screenshot coming soon</span>
          </div>
        </div>
        <div class="screenshot-caption">${esc(caption)}</div>
      </div>`;
  }

})();
