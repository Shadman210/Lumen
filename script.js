/* =========================================================
   Lumen — site behavior
   ========================================================= */

(function () {
  // ---------- THEME ----------
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  function setTheme(t, persist = true) {
    root.setAttribute('data-theme', t);
    if (persist) {
      try { localStorage.setItem('lumen-theme', t); } catch (e) {}
    }
    // Re-paint canvases that depend on theme
    paintAllCanvases();
  }
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });

  // ---------- HEADER SCROLL ----------
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- LIVE TIME ----------
  const liveTime = document.getElementById('liveTime');
  function updateTime() {
    const d = new Date();
    const h = String(d.getUTCHours()).padStart(2, '0');
    const m = String(d.getUTCMinutes()).padStart(2, '0');
    if (liveTime) liveTime.textContent = `${h}:${m} UTC · LIVE`;
  }
  updateTime();
  setInterval(updateTime, 30000);

  // ---------- REVEAL ----------
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // ---------- WORK DATA ----------
  const works = [
    { id: 1, tag: 'Cloud & Core · Banking · 18mo', title: 'Halcyon Bank: $1.2B core re-platform, on time', cat: ['ai', 'banking'], size: 'lg', art: 'wave' },
    { id: 2, tag: 'Value Architecture · Retail', title: 'Praxis: tech-enabled value plan, +320bps margin', cat: ['brand'], size: 'sm', art: 'grid' },
    { id: 3, tag: 'Cyber & Resilience · Health', title: 'Northwind: zero-trust rollout across 14 markets', cat: ['health', 'cx'], size: 'md', art: 'orbits' },
    { id: 4, tag: 'AI Strategy · Energy', title: 'Atlas Energy: enterprise AI value office stood up', cat: ['ai'], size: 'md', art: 'mesh' },
    { id: 5, tag: 'Operating Model · Aviation', title: 'Meridian Air: product-led IT, 3x deploy frequency', cat: ['cx', 'brand'], size: 'sm', art: 'rings' },
    { id: 6, tag: 'Data & AI · Manufacturing', title: 'Coreform Auto: data foundation for 41 factories', cat: ['ai'], size: 'lg', art: 'flow' },
  ];

  const grid = document.getElementById('workGrid');

  // Drawing utilities — paint each card's canvas
  function drawWave(ctx, w, h, primary, dark) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, primary);
    g.addColorStop(1, dark ? '#2a0e4a' : '#FF6B9D');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 14) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const yy = y + Math.sin((x + y) * 0.012) * 18 + Math.cos(x * 0.01) * 10;
        if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
  }
  function drawGrid(ctx, w, h, primary, dark) {
    ctx.fillStyle = dark ? '#1a1320' : '#F0E5FB';
    ctx.fillRect(0, 0, w, h);
    const cells = 8;
    const cw = w / cells;
    for (let i = 0; i < cells; i++) {
      for (let j = 0; j < cells * (h/w); j++) {
        const seed = Math.sin(i * 12.9 + j * 78.2) * 43758.5;
        const r = seed - Math.floor(seed);
        if (r > 0.7) {
          ctx.fillStyle = primary;
          ctx.globalAlpha = 0.3 + r * 0.7;
          ctx.fillRect(i * cw, j * cw, cw - 2, cw - 2);
          ctx.globalAlpha = 1;
        }
      }
    }
    ctx.fillStyle = primary;
    ctx.fillRect(w * 0.1, h * 0.5, cw * 3, cw * 3);
  }
  function drawOrbits(ctx, w, h, primary, dark) {
    ctx.fillStyle = dark ? '#0f0a18' : '#FAFAFA';
    ctx.fillRect(0, 0, w, h);
    const cx = w * 0.5, cy = h * 0.5;
    ctx.strokeStyle = primary;
    ctx.globalAlpha = 0.6;
    for (let i = 1; i <= 6; i++) {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.ellipse(cx, cy, i * 36, i * 22, i * 0.2, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = primary;
    ctx.beginPath(); ctx.arc(cx, cy, 26, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = dark ? '#FF6B9D' : '#7D2AE8';
    ctx.beginPath(); ctx.arc(cx + 80, cy - 36, 8, 0, Math.PI * 2); ctx.fill();
  }
  function drawMesh(ctx, w, h, primary, dark) {
    const g = ctx.createRadialGradient(w*0.7, h*0.3, 30, w*0.5, h*0.5, w*0.8);
    g.addColorStop(0, primary);
    g.addColorStop(1, dark ? '#0a0612' : '#2E085A');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    const pts = [];
    for (let i = 0; i < 18; i++) pts.push([Math.random() * w, Math.random() * h]);
    pts.forEach((p, i) => {
      pts.forEach((q, j) => {
        if (j > i && Math.hypot(p[0]-q[0], p[1]-q[1]) < 100) {
          ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
        }
      });
    });
    pts.forEach(p => {
      ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(p[0], p[1], 2, 0, Math.PI*2); ctx.fill();
    });
  }
  function drawRings(ctx, w, h, primary, dark) {
    ctx.fillStyle = dark ? '#1a0e2d' : '#EADCFD';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 12; i++) {
      ctx.strokeStyle = primary;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.3 + (i / 24);
      ctx.beginPath();
      ctx.arc(w * 0.3 + i * 8, h * 0.5, 100 - i * 6, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  function drawFlow(ctx, w, h, primary, dark) {
    ctx.fillStyle = dark ? '#10081e' : '#1a0e2d';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 80; i++) {
      const t = i / 80;
      ctx.strokeStyle = i % 3 === 0 ? primary : 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      const x0 = t * w;
      ctx.moveTo(x0, 0);
      for (let y = 0; y < h; y += 6) {
        const xx = x0 + Math.sin((y + i*20) * 0.02) * 30;
        ctx.lineTo(xx, y);
      }
      ctx.stroke();
    }
  }
  const drawers = { wave: drawWave, grid: drawGrid, orbits: drawOrbits, mesh: drawMesh, rings: drawRings, flow: drawFlow };

  function getPrimary() {
    return getComputedStyle(root).getPropertyValue('--primary').trim();
  }
  function isDark() {
    return root.getAttribute('data-theme') === 'dark';
  }

  function paintCanvas(canvas, kind) {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const r = canvas.getBoundingClientRect();
    if (r.width === 0) return;
    canvas.width = r.width * dpr;
    canvas.height = r.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    (drawers[kind] || drawWave)(ctx, r.width, r.height, getPrimary(), isDark());
  }
  function paintAllCanvases() {
    document.querySelectorAll('canvas[data-art]').forEach(c => paintCanvas(c, c.dataset.art));
  }
  window.addEventListener('resize', () => {
    clearTimeout(window.__paintT);
    window.__paintT = setTimeout(paintAllCanvases, 120);
  });

  function renderWorks(filter = 'all') {
    grid.innerHTML = '';
    const filtered = filter === 'all' ? works : works.filter(w => w.cat.includes(filter));
    filtered.forEach((w, i) => {
      const card = document.createElement('a');
      card.href = '#';
      card.className = `work-card ${w.size} reveal`;
      card.style.transitionDelay = `${i * 60}ms`;
      card.innerHTML = `
        <canvas class="work-canvas" data-art="${w.art}"></canvas>
        <div class="corner-arrow" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M7 17L17 7M9 7h8v8"/></svg>
        </div>
        <div class="work-meta">
          <span class="work-tag">${w.tag}</span>
          <span class="work-title">${w.title}</span>
        </div>
      `;
      grid.appendChild(card);
      io.observe(card);
    });
    // paint after a tick
    requestAnimationFrame(() => {
      grid.querySelectorAll('canvas[data-art]').forEach(c => paintCanvas(c, c.dataset.art));
    });
  }
  renderWorks();
  document.getElementById('workFilter').addEventListener('click', (e) => {
    const btn = e.target.closest('.insights-tab');
    if (!btn) return;
    document.querySelectorAll('#workFilter .insights-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderWorks(btn.dataset.filter);
  });

  // ---------- CAPABILITIES ----------
  const caps = [
    { num: '01', title: 'Tech Strategy & Value Architecture', sub: 'Translate strategy into a tech roadmap CFOs underwrite and CEOs defend at the board.', art: 'wave', stats: [{v:'$340M',l:'avg. value-case'},{v:'120',l:'plans built'}] },
    { num: '02', title: 'Cloud & Digital Core Modernization', sub: 'Replatform ERPs, mainframes, and data estates without halting the business.', art: 'flow', stats: [{v:'72%',l:'infra cost saved'},{v:'9/day',l:'avg. deploys'}] },
    { num: '03', title: 'Enterprise AI & Generative Strategy', sub: 'From use-case triage to a value office, governance, and agents in production.', art: 'mesh', stats: [{v:'2.4B',l:'inferences served'},{v:'94%',l:'eval pass-rate'}] },
    { num: '04', title: 'Data Strategy & Foundations', sub: 'A trusted data layer that finally makes AI, finance, and ops agree on the numbers.', art: 'orbits', stats: [{v:'1 source',l:'of truth'},{v:'-58%',l:'reporting time'}] },
    { num: '05', title: 'Cybersecurity & Resilience', sub: 'Zero-trust, identity-first, board-reportable. Built for ransomware reality.', art: 'rings', stats: [{v:'<14d',l:'mean-time-to-recover'},{v:'ISO',l:'27001 + 42001'}] },
    { num: '06', title: 'Operating Model & Tech Function', sub: 'Reshape IT around products, platforms, and outcomes&mdash;not tickets.', art: 'grid', stats: [{v:'3x',l:'deploy frequency'},{v:'-41%',l:'run-cost ratio'}] },
    { num: '07', title: 'Sourcing, M&A & Vendor Strategy', sub: 'Deal advisory, tech due diligence, and post-merger integration that actually integrates.', art: 'wave', stats: [{v:'$2.1B',l:'TSAs advised'},{v:'88',l:'diligences run'}] },
    { num: '08', title: 'Sustainability & Responsible Tech', sub: 'Green cloud, model safety, and CSRD-ready reporting baked into the architecture.', art: 'orbits', stats: [{v:'-44%',l:'scope-3 cut'},{v:'CSRD',l:'audit-ready'}] },
  ];

  const capList = document.getElementById('capList');
  const capPreview = document.getElementById('capPreview');
  caps.forEach((c, i) => {
    const li = document.createElement('li');
    li.className = 'cap-item' + (i === 0 ? ' active' : '');
    li.dataset.idx = i;
    li.innerHTML = `
      <span class="cap-num">${c.num}</span>
      <div>
        <div class="cap-title">${c.title}</div>
      </div>
      <span class="cap-arrow" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </span>
    `;
    capList.appendChild(li);

    const slide = document.createElement('div');
    slide.className = 'cap-slide' + (i === 0 ? ' active' : '');
    slide.dataset.idx = i;
    slide.innerHTML = `
      <canvas class="work-canvas" data-art="${c.art}" style="position:absolute;inset:0;z-index:0"></canvas>
      <div style="position:relative;z-index:1">
        <span class="cap-slide-eyebrow">${c.num} / Practice</span>
        <h3 class="cap-slide-title" style="margin-top:16px">${c.title}</h3>
        <p style="margin-top:16px;max-width:32ch;font-size:1.05rem;opacity:.92">${c.sub}</p>
      </div>
      <div class="cap-slide-stats" style="position:relative;z-index:1">
        <div><span class="v">${c.stats[0].v}</span><span class="l">${c.stats[0].l}</span></div>
        <div><span class="v">${c.stats[1].v}</span><span class="l">${c.stats[1].l}</span></div>
      </div>
    `;
    capPreview.appendChild(slide);
  });

  capList.addEventListener('mouseover', (e) => {
    const item = e.target.closest('.cap-item');
    if (!item) return;
    const idx = item.dataset.idx;
    document.querySelectorAll('.cap-item').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.cap-slide').forEach(x => x.classList.remove('active'));
    item.classList.add('active');
    document.querySelector(`.cap-slide[data-idx="${idx}"]`).classList.add('active');
  });

  // ---------- INSIGHTS ----------
  const articles = [
    { tag: 'Enterprise AI', topic: 'ai', title: 'The AI value office: org design for the post-pilot era', meta: ['12 min read', 'Pelin Doyuran'], art: 'mesh' },
    { tag: 'CFO brief', topic: 'leadership', title: 'How CFOs are re-underwriting the cloud business case', meta: ['8 min read', 'Marcus Adeyemi'], art: 'wave' },
    { tag: 'Architecture', topic: 'design', title: 'Composable cores: replacing the ERP without replacing the ERP', meta: ['10 min read', 'Junichi Sato'], art: 'orbits' },
    { tag: 'Operating model', topic: 'ops', title: 'Six patterns for product-led IT at Fortune-500 scale', meta: ['Field report', 'Lumen Advisory'], art: 'flow' },
    { tag: 'Cyber & risk', topic: 'trust', title: 'The board-ready playbook for AI safety and model risk', meta: ['White paper', 'Aïsha Renteria'], art: 'rings' },
    { tag: 'CIO brief', topic: 'leadership', title: 'Why your next tech roadmap is a capital-allocation document', meta: ['6 min read', 'Tomás Werner'], art: 'grid' },
  ];
  const articlesGrid = document.getElementById('articlesGrid');
  function renderArticles(topic = 'all') {
    articlesGrid.innerHTML = '';
    const list = topic === 'all' ? articles : articles.filter(a => a.topic === topic);
    list.forEach((a, i) => {
      const el = document.createElement('a');
      el.href = '#';
      el.className = 'article-card reveal';
      el.style.transitionDelay = `${i * 60}ms`;
      el.innerHTML = `
        <div class="article-cover"><canvas data-art="${a.art}" style="width:100%;height:100%;display:block"></canvas></div>
        <span class="article-tag">${a.tag}</span>
        <h4 class="article-title">${a.title}</h4>
        <div class="article-meta"><span>${a.meta[0]}</span><span>·</span><span>${a.meta[1]}</span></div>
      `;
      articlesGrid.appendChild(el);
      io.observe(el);
    });
    requestAnimationFrame(() => {
      articlesGrid.querySelectorAll('canvas[data-art]').forEach(c => paintCanvas(c, c.dataset.art));
    });
  }
  renderArticles();
  document.getElementById('insightsFilter').addEventListener('click', (e) => {
    const btn = e.target.closest('.insights-tab');
    if (!btn) return;
    document.querySelectorAll('#insightsFilter .insights-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderArticles(btn.dataset.topic);
  });

  // ---------- STATS COUNT-UP ----------
  function animateCount(el) {
    const target = parseFloat(el.dataset.count || el.parentElement.dataset.count);
    if (isNaN(target)) return;
    const isFloat = String(target).includes('.');
    const start = performance.now();
    const dur = 1400;
    function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = target * eased;
      el.textContent = isFloat ? v.toFixed(1) : Math.floor(v).toLocaleString();
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const statIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('em').forEach(em => animateCount(em));
        statIo.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.stat-cell').forEach(el => statIo.observe(el));

  // ---------- NEWSLETTER ----------
  const form = document.getElementById('newsletterForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value.trim();
    const btn = document.getElementById('newsletterBtn');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      btn.textContent = 'Enter a valid email';
      setTimeout(() => (btn.textContent = 'Get a brief →'), 1800);
      return;
    }
    form.classList.add('success');
    btn.textContent = "✓ We'll be in touch";
    document.getElementById('newsletterEmail').value = '';
    setTimeout(() => {
      form.classList.remove('success');
      btn.textContent = 'Get a brief →';
    }, 2800);
  });

  // ---------- NAV ACTIVE STATE ON SCROLL ----------
  const navLinks = document.querySelectorAll('.nav-links a');
  const sectionIds = ['work', 'capabilities', 'insights', 'about', 'careers'];
  const navIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach(a => a.classList.toggle('active', a.dataset.nav === id));
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) navIo.observe(el);
  });

  // initial paint
  setTimeout(paintAllCanvases, 60);
})();
