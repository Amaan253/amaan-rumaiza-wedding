/* =========================================================
   Amaan Ali Khan & Rumaiza Khan — Wedding Invitation
   ========================================================= */
(() => {
  'use strict';

  const CONFIG = {
    // Countdown target — Baraat, 12 Nov 2026, 6:00 PM India time
    weddingDate: '2026-11-12T18:00:00+05:30'
  };

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const mq = (q) => window.matchMedia(q).matches;

  const reduceMotion = mq('(prefers-reduced-motion: reduce)');
  const isSmall = mq('(max-width: 600px)');
  const finePointer = mq('(hover: hover) and (pointer: fine)');
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const XLINK_NS = 'http://www.w3.org/1999/xlink';

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ---------- Twinkling gold dust ---------- */
  function makeDust() {
    $$('.dust[data-dust]').forEach((box) => {
      let n = Number(box.dataset.dust) || 12;
      if (isSmall) n = Math.ceil(n * 0.6);
      const frag = document.createDocumentFragment();
      for (let i = 0; i < n; i++) {
        const dot = document.createElement('i');
        const size = Math.random() < 0.2 ? rand(5, 8) : rand(2, 4.5);
        dot.style.cssText =
          `left:${rand(2, 98).toFixed(2)}%;top:${rand(3, 97).toFixed(2)}%;` +
          `width:${size.toFixed(1)}px;height:${size.toFixed(1)}px;` +
          `--t:${rand(3, 7).toFixed(2)}s;--dl:${(-rand(0, 7)).toFixed(2)}s;--o:${rand(0.45, 0.95).toFixed(2)}`;
        if (Math.random() < 0.3) dot.className = 'is-soft';
        frag.appendChild(dot);
      }
      box.appendChild(frag);
    });
  }

  /* ---------- Floating hearts ---------- */
  function makeHearts() {
    $$('.floating-hearts[data-hearts]').forEach((box) => {
      let n = Number(box.dataset.hearts) || 10;
      if (isSmall) n = Math.ceil(n * 0.6);
      for (let i = 0; i < n; i++) {
        const svg = document.createElementNS(SVG_NS, 'svg');
        const use = document.createElementNS(SVG_NS, 'use');
        use.setAttribute('href', '#i-heart');
        use.setAttributeNS(XLINK_NS, 'xlink:href', '#i-heart');
        svg.appendChild(use);
        const size = rand(12, 22).toFixed(0);
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
        svg.style.cssText =
          `left:${rand(2, 96).toFixed(2)}%;bottom:${rand(0, 40).toFixed(2)}%;` +
          `--t:${rand(7, 12).toFixed(2)}s;--dl:${(-rand(0, 12)).toFixed(2)}s;` +
          `--sx:${rand(-24, 24).toFixed(0)}px;--o:${rand(0.55, 0.95).toFixed(2)}`;
        box.appendChild(svg);
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    const els = $$('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Soft golden glow that follows the cursor (desktop) ---------- */
  function initGlow() {
    if (!finePointer || reduceMotion) return;
    const glow = document.createElement('div');
    glow.className = 'glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);

    let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      glow.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.4 ? requestAnimationFrame(loop) : 0;
    };
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX;
      ty = e.clientY;
      glow.classList.add('is-on');
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => glow.classList.remove('is-on'));
  }

  /* ---------- Falling petals + confetti (one canvas) ---------- */
  const fx = (() => {
    const canvas = $('#fx');
    const ctx = canvas.getContext('2d');
    const PETALS = ['#D8B46A', '#E2C68C', '#EBD9B4', '#F1DCDC', '#EAD3D6', '#FFFFFF', '#F6EBDD', '#E9CFA0'];
    const CONFETTI = ['#D4AF6A', '#E8CF94', '#C9A24E', '#F2B8C6', '#E89AAE', '#FFF4E0', '#B98E3B', '#F7D9DF'];
    let W = 0, H = 0, dpr = 1, raf = 0, last = 0;
    let petals = [], confetti = [], petalsOn = false;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = innerWidth;
      H = innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function petal(initial) {
      const r = rand(5, 9);
      return {
        x: rand(-20, W + 20),
        y: initial ? rand(-H * 0.2, H) : rand(-80, -20),
        rx: r, ry: r * rand(0.55, 0.75),
        vy: rand(22, 48), vx: rand(-10, 10),
        sway: rand(14, 36), freq: rand(0.4, 1.1), phase: rand(0, 6.28),
        rot: rand(0, 6.28), vr: rand(-0.9, 0.9),
        flip: rand(0, 6.28), vflip: rand(1, 2.4),
        color: pick(PETALS), alpha: rand(0.55, 0.9), t: 0
      };
    }

    function startPetals() {
      if (reduceMotion || petalsOn) return;
      const count = isSmall ? 14 : 26;
      petals = Array.from({ length: count }, () => petal(true));
      petalsOn = true;
      run();
    }

    function burst(x, y, n, o = {}) {
      const angle = o.angle ?? -Math.PI / 2;
      const spread = o.spread ?? Math.PI * 0.8;
      for (let i = 0; i < n; i++) {
        const a = angle + rand(-spread / 2, spread / 2);
        const v = rand(o.minV ?? 420, o.maxV ?? 980);
        confetti.push({
          x: x + rand(-10, 10), y: y + rand(-10, 10),
          vx: Math.cos(a) * v, vy: Math.sin(a) * v,
          w: rand(5, 9), h: rand(8, 14),
          rot: rand(0, 6.28), vr: rand(-7, 7),
          tilt: rand(0, 6.28), vt: rand(5, 11),
          color: pick(CONFETTI), life: 0, ttl: rand(3.4, 5.4)
        });
      }
      run();
    }

    function rain(n) {
      for (let i = 0; i < n; i++) {
        confetti.push({
          x: rand(0, W), y: rand(-H * 0.5, -10),
          vx: rand(-40, 40), vy: rand(80, 220),
          w: rand(5, 9), h: rand(8, 14),
          rot: rand(0, 6.28), vr: rand(-6, 6),
          tilt: rand(0, 6.28), vt: rand(5, 11),
          color: pick(CONFETTI), life: 0, ttl: rand(4, 6.5)
        });
      }
      run();
    }

    function celebrate() {
      if (reduceMotion) return;
      const n = isSmall ? 70 : 130;
      burst(W * 0.22, H * 0.62, n, { angle: -Math.PI * 0.6, spread: Math.PI * 0.45 });
      burst(W * 0.78, H * 0.62, n, { angle: -Math.PI * 0.4, spread: Math.PI * 0.45 });
      rain(isSmall ? 50 : 110);
    }

    function run() {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, W, H);

      if (petalsOn) {
        for (let i = 0; i < petals.length; i++) {
          const p = petals[i];
          p.t += dt;
          p.y += p.vy * dt;
          p.x += (p.vx + Math.cos(p.t * p.freq + p.phase) * p.sway) * dt;
          p.rot += p.vr * dt;
          p.flip += p.vflip * dt;
          if (p.y > H + 30 || p.x < -60 || p.x > W + 60) { petals[i] = petal(false); continue; }
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.scale(1, 0.35 + 0.65 * Math.abs(Math.cos(p.flip)));
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      for (let i = confetti.length - 1; i >= 0; i--) {
        const c = confetti[i];
        c.life += dt;
        if (c.life > c.ttl || c.y > H + 40) { confetti.splice(i, 1); continue; }
        const drag = Math.pow(0.18, dt);
        c.vx *= drag;
        c.vy = c.vy * drag + 620 * dt;
        if (c.vy > 240) c.vy = 240;
        c.x += (c.vx + Math.sin(c.tilt) * 28) * dt;
        c.y += c.vy * dt;
        c.rot += c.vr * dt;
        c.tilt += c.vt * dt;
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.scale(1, Math.cos(c.tilt));
        ctx.globalAlpha = Math.min(1, (c.ttl - c.life) / 0.9);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      }

      if (petalsOn || confetti.length) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
        ctx.clearRect(0, 0, W, H);
      }
    }

    resize();
    let rt = 0;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 120); });

    return { startPetals, burst, celebrate, size: () => ({ W, H }) };
  })();

  /* ---------- Background music ---------- */
  const music = (() => {
    const box = $('#music');
    const audio = box && $('audio', box);
    const btn = box && $('button', box);
    if (!audio || !btn) return { play() {} };
    let resume = false;

    const set = (on) => {
      box.classList.toggle('is-playing', on);
      btn.setAttribute('aria-label', on ? 'Pause background music' : 'Play background music');
    };
    const play = () => {
      audio.muted = false;
      const p = audio.play();
      if (p) p.catch(() => set(false));
      set(!audio.paused);
    };

    audio.addEventListener('play', () => set(true));
    audio.addEventListener('pause', () => set(false));
    btn.addEventListener('click', () => (audio.paused ? play() : audio.pause()));

    // Pause while the page is in the background, pick up again on return
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        resume = !audio.paused;
        audio.pause();
      } else if (resume) {
        resume = false;
        play();
      }
    });
    addEventListener('pagehide', () => audio.pause());

    return { play };
  })();

  /* ---------- Intro: tap to open ---------- */
  function initIntro() {
    const intro = $('#intro');
    const btn = $('#openInvite');
    let opened = false;

    intro.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    scrollTo(0, 0);

    btn.addEventListener('click', () => {
      if (opened) return;
      opened = true;
      music.play();
      intro.classList.add('is-opening');
      document.body.classList.add('is-open');
      setTimeout(() => document.body.classList.remove('is-locked'), 300);
      setTimeout(() => fx.celebrate(), reduceMotion ? 0 : 520);
      setTimeout(() => fx.startPetals(), reduceMotion ? 0 : 900);
      setTimeout(() => {
        intro.classList.add('is-gone');
        intro.setAttribute('aria-hidden', 'true');
      }, reduceMotion ? 700 : 2200);
    });
  }

  /* ---------- Save the date: scratch card ---------- */
  function initScratch() {
    const card = $('#scratch');
    if (!card) return;
    const canvas = $('.scratch__canvas', card);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const hint = $('#scratchHint');
    let w = 0, h = 0, dpr = 1, revealed = false, dirty = false, drawing = false, lastPt = null, moves = 0;

    function star(x, y, r, filled) {
      const k = r * 0.3;
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.quadraticCurveTo(x + k * 0.4, y - k * 0.4, x + r, y);
      ctx.quadraticCurveTo(x + k * 0.4, y + k * 0.4, x, y + r);
      ctx.quadraticCurveTo(x - k * 0.4, y + k * 0.4, x - r, y);
      ctx.quadraticCurveTo(x - k * 0.4, y - k * 0.4, x, y - r);
      ctx.closePath();
      if (filled) ctx.fill(); else ctx.stroke();
    }

    function paint() {
      const rect = card.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      if (!w || !h) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over';

      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#E3CF9E');
      g.addColorStop(0.2, '#D8C084');
      g.addColorStop(0.42, '#C3A55A');
      g.addColorStop(0.6, '#D6BE86');
      g.addColorStop(0.72, '#EDDFB8');
      g.addColorStop(0.85, '#CFB26E');
      g.addColorStop(1, '#BC9C58');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // fine metallic speckle
      const specks = Math.round((w * h) / 700);
      for (let i = 0; i < specks; i++) {
        ctx.fillStyle = Math.random() < 0.5 ? `rgba(255,248,225,${rand(0.06, 0.22).toFixed(2)})` : `rgba(140,105,40,${rand(0.04, 0.12).toFixed(2)})`;
        ctx.fillRect(rand(0, w), rand(0, h), rand(0.6, 1.5), rand(0.6, 1.5));
      }

      const s = Math.max(0.72, w / 480);
      ctx.fillStyle = '#674033';
      ctx.strokeStyle = '#674033';
      ctx.lineWidth = 1.2;
      const cy = h * 0.377;
      star(w / 2 - 23 * s, cy, 7.5 * s, false);
      star(w / 2, cy, 9.5 * s, true);
      star(w / 2 + 23 * s, cy, 7.5 * s, false);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `600 ${Math.round(15 * s)}px Jost, system-ui, sans-serif`;
      ctx.fillText('Scratch to Reveal Our Wedding Date', w / 2, h * 0.5);
      dirty = false;
    }

    const point = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    function scratch(a, b) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = Math.max(36, w * 0.09);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x + 0.01, b.y + 0.01);
      ctx.stroke();
      dirty = true;
    }

    function progress() {
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let clear = 0, total = 0;
      for (let i = 3; i < data.length; i += 4 * 9) {
        total++;
        if (data[i] < 50) clear++;
      }
      return total ? clear / total : 0;
    }

    function reveal() {
      if (revealed) return;
      revealed = true;
      card.classList.remove('is-scratching');
      card.classList.add('is-revealed');
      hint.style.opacity = '0';
      setTimeout(() => { hint.textContent = '\u2726  See you there  \u2726'; hint.style.opacity = '1'; }, 600);
      const r = card.getBoundingClientRect();
      fx.burst(r.left + r.width / 2, r.top + r.height * 0.55, isSmall ? 80 : 140, { spread: Math.PI * 1.2, minV: 360, maxV: 900 });
    }

    canvas.addEventListener('pointerdown', (e) => {
      if (revealed) return;
      drawing = true;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      lastPt = point(e);
      scratch(lastPt, lastPt);
      card.classList.add('is-scratching');
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!drawing || revealed) return;
      const p = point(e);
      scratch(lastPt, p);
      lastPt = p;
      if (++moves % 8 === 0 && progress() > 0.45) reveal();
    });
    const end = () => {
      if (!drawing) return;
      drawing = false;
      if (!revealed && progress() > 0.45) reveal();
    };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
    canvas.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); } });
    canvas.tabIndex = 0;

    paint();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!revealed && !dirty) paint(); });
    let lastW = innerWidth, rt = 0;
    addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        if (revealed || innerWidth === lastW) return;
        lastW = innerWidth;
        paint();
      }, 150);
    });
  }

  /* ---------- Countdown ---------- */
  function initCountdown() {
    const target = new Date(CONFIG.weddingDate).getTime();
    const units = { d: $('[data-unit="d"]'), h: $('[data-unit="h"]'), m: $('[data-unit="m"]'), s: $('[data-unit="s"]') };
    const pad = (n) => String(n).padStart(2, '0');
    const set = (el, v) => { if (el.textContent !== v) el.textContent = v; };

    function tick() {
      let diff = target - Date.now();
      if (diff <= 0) {
        Object.values(units).forEach((el) => set(el, '00'));
        const grid = $('#countdownGrid');
        if (!$('.countdown__done')) {
          const done = document.createElement('p');
          done.className = 'countdown__done script gold-text';
          done.textContent = 'The celebrations have begun!';
          grid.insertAdjacentElement('afterend', done);
        }
        return;
      }
      const d = Math.floor(diff / 864e5); diff -= d * 864e5;
      const h = Math.floor(diff / 36e5); diff -= h * 36e5;
      const m = Math.floor(diff / 6e4); diff -= m * 6e4;
      const s = Math.floor(diff / 1e3);
      set(units.d, pad(d));
      set(units.h, pad(h));
      set(units.m, pad(m));
      set(units.s, pad(s));
      setTimeout(tick, 1000 - (Date.now() % 1000) + 8);
    }
    tick();
  }

  /* ---------- Boot ---------- */
  makeDust();
  makeHearts();
  initReveal();
  initGlow();
  initIntro();
  initScratch();
  initCountdown();
})();
