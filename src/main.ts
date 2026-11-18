import './style.css';
import { initWipe } from './wipe';
import { LAND } from './land';

initWipe();

const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Cairo clock ---------- */
const clock = document.getElementById('clock');
const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
const tickClock = () => { if (clock) clock.textContent = fmt.format(new Date()); };
tickClock();
setInterval(tickClock, 1000);

/* ---------- Fit giant type to its box ---------- */
const fitAll = () => {
  const groups = new Map<string, HTMLElement[]>();
  document.querySelectorAll<HTMLElement>('[data-fit]').forEach((el, i) => {
    const k = el.dataset.fit || `solo${i}`;
    groups.set(k, [...(groups.get(k) || []), el]);
  });
  groups.forEach((els) => {
    els.forEach((el) => (el.style.fontSize = ''));
    const el = els[0];
    const size = parseFloat(getComputedStyle(el).fontSize);
    const widest = Math.max(...[...el.querySelectorAll<HTMLElement>('.word')].map((w) => w.getBoundingClientRect().width));
    const avail = el.clientWidth;
    if (widest > avail) els.forEach((e) => (e.style.fontSize = `${Math.floor(size * (avail / widest) * 0.99)}px`));
  });
};
fitAll();
let fitT = 0;
window.addEventListener('resize', () => { clearTimeout(fitT); fitT = window.setTimeout(fitAll, 100); });
document.fonts.ready.then(fitAll);

/* ---------- Split hero letters ---------- */
document.querySelectorAll<HTMLElement>('.hero .word').forEach((w) => {
  const text = w.textContent || '';
  w.textContent = '';
  [...text].forEach((ch, i) => {
    const c = document.createElement('span');
    c.className = 'c';
    c.style.setProperty('--i', String(i));
    c.textContent = ch;
    w.append(c);
  });
  w.classList.add('split');
});

/* ---------- Intro ---------- */
const start = () => requestAnimationFrame(() => root.classList.add('ready'));
Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]).then(start);

/* ---------- X-ray lens ---------- */
const hero = document.querySelector<HTMLElement>('.hero');
const xray = document.querySelector<HTMLElement>('.hero__xray');
const ring = document.querySelector<HTMLElement>('.ring');

if (hero && xray && ring) {
  let W = hero.clientWidth, H = hero.clientHeight;
  let tx = W * 0.62, ty = H * 0.45, lx = tx, ly = ty, r = 0;
  let active = false, open = false, visible = true, raf = 0, idleT = 0;

  const measure = () => { W = hero.clientWidth; H = hero.clientHeight; };
  new ResizeObserver(measure).observe(hero);

  const point = (x: number, y: number) => {
    const b = hero.getBoundingClientRect();
    tx = x - b.left; ty = y - b.top; active = true;
    clearTimeout(idleT);
    idleT = window.setTimeout(() => { active = false; }, 2600);
  };
  hero.addEventListener('pointermove', (e) => point(e.clientX, e.clientY));
  hero.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') active = false; });
  hero.addEventListener('touchmove', (e) => { const t = e.touches[0]; if (t) point(t.clientX, t.clientY); }, { passive: true });
  hero.addEventListener('click', (e) => { open = !open; point(e.clientX, e.clientY); });

  const loop = (t: number) => {
    if (!active && !reduce) {
      tx = W * (0.5 + 0.34 * Math.sin(t * 0.00035));
      ty = H * (0.48 + 0.26 * Math.sin(t * 0.00052 + 1.2));
    }
    const base = Math.min(170, Math.max(90, W * 0.3));
    const target = open ? Math.hypot(W, H) : base;
    const k = active ? 0.16 : 0.05;
    lx += (tx - lx) * k; ly += (ty - ly) * k;
    r += (target - r) * (open ? 0.07 : 0.12);
    xray.style.clipPath = `circle(${r.toFixed(1)}px at ${lx.toFixed(1)}px ${ly.toFixed(1)}px)`;
    const d = r * 2 + 28;
    ring.style.width = ring.style.height = `${d}px`;
    ring.style.transform = `translate3d(${lx - d / 2}px, ${ly - d / 2}px, 0)`;
    ring.style.opacity = open ? '0' : '1';
    raf = visible ? requestAnimationFrame(loop) : 0;
  };

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(loop);
  }).observe(hero);
  raf = requestAnimationFrame(loop);
}

/* ---------- Scroll reveals ---------- */
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => {
  (el as HTMLElement).style.transitionDelay = `${(i % 5) * 60}ms`;
  io.observe(el);
});

/* ---------- Scroll-linked values ---------- */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const layers = document.querySelector<HTMLElement>('.layers');
const layerEls = layers ? [...layers.querySelectorAll<HTMLElement>('.ly')] : [];
const layerItems = layers ? [...layers.querySelectorAll<HTMLElement>('.layers__list li')] : [];
const commits = document.querySelector<HTMLElement>('.commits');
let lastOn = -2;

const onScroll = () => {
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  root.style.setProperty('--sp', max > 0 ? (window.scrollY / max).toFixed(4) : '0');

  if (layers && !reduce) {
    const b = layers.getBoundingClientRect();
    const p = clamp(-b.top / (b.height - vh));
    const e = clamp(p / 0.16);
    const eased = e * e * (3 - 2 * e);
    layers.style.setProperty('--e', eased.toFixed(4));
    const on = p < 0.16 ? -1 : Math.min(4, Math.floor(((p - 0.16) / 0.84) * 5));
    if (on !== lastOn) {
      lastOn = on;
      layers.classList.toggle('x', on >= 0);
      layerEls.forEach((el, i) => el.classList.toggle('is-on', i === on));
      layerItems.forEach((el, i) => el.classList.toggle('is-on', i === on));
    }
  }
  if (commits) {
    const b = commits.getBoundingClientRect();
    commits.style.setProperty('--lp', clamp((vh * 0.6 - b.top) / b.height).toFixed(4));
  }
};
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { ticking = false; onScroll(); });
}, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

/* ---------- Count-up stats ---------- */
const countEls = document.querySelectorAll<HTMLElement>('[data-count]');
const show = (el: HTMLElement, v: number) => {
  const dec = Number(el.dataset.dec || 0);
  el.textContent = `${el.dataset.pre || ''}${v.toFixed(dec)}${el.dataset.suf || ''}`;
};
if (!reduce) {
  const cio = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const el = en.target as HTMLElement;
      cio.unobserve(el);
      const end = Number(el.dataset.count);
      const t0 = performance.now();
      const step = (t: number) => {
        const p = clamp((t - t0) / 1300);
        show(el, end * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(step); else show(el, end);
      };
      requestAnimationFrame(step);
    }
  }, { threshold: 0.5 });
  countEls.forEach((el) => { show(el, 0); cio.observe(el); });
}

/* ---------- Awards stars ---------- */
const awards = document.querySelector<HTMLElement>('.awards');
if (awards) {
  awards.querySelectorAll<HTMLElement>('.awards__stars span').forEach((s, i) => s.style.setProperty('--i', String(i)));
  new IntersectionObserver(([en], o) => { if (en.isIntersecting) { awards.classList.add('in'); o.disconnect(); } }, { threshold: 0.4 }).observe(awards);
}

/* ---------- Live measurements of this page ---------- */
const setText = (id: string, v: string) => { const el = document.getElementById(id); if (el) el.textContent = v; };
try {
  new PerformanceObserver((list) => {
    const last = list.getEntries().pop();
    if (last) setText('hud-lcp', `${(last.startTime / 1000).toFixed(2)} s`);
  }).observe({ type: 'largest-contentful-paint', buffered: true });
} catch { setText('hud-lcp', 'n/a'); }
const measureNet = () => {
  const res = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const js = res.filter((r) => r.initiatorType === 'script' || /\.js(\?|$)/.test(r.name));
  const bytes = js.reduce((n, r) => n + (r.transferSize || r.encodedBodySize || 0), 0);
  setText('hud-js', bytes ? `${(bytes / 1024).toFixed(1)} KB` : 'cached');
  setText('hud-req', String(res.length + 1));
};
window.addEventListener('load', () => window.setTimeout(measureNet, 300));
{
  let frames = 0, t0 = performance.now();
  const tick = (t: number) => {
    frames++;
    if (t - t0 >= 1000) { setText('hud-fps', `${Math.round((frames * 1000) / (t - t0))} fps`); frames = 0; t0 = t; }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- Globe: Cairo to Düsseldorf ---------- */
const cv = document.getElementById('globe') as HTMLCanvasElement | null;
if (cv) {
  const ctx = cv.getContext('2d')!;
  const D = Math.PI / 180;
  const xyz = (lon: number, lat: number): [number, number, number] => [Math.cos(lat * D) * Math.sin(lon * D), Math.sin(lat * D), Math.cos(lat * D) * Math.cos(lon * D)];
  const bits = atob(LAND);
  const pts: [number, number, number][] = [];
  let k = 0;
  for (let lat = -57; lat <= 81; lat += 2) {
    const n = Math.round(180 * Math.cos(lat * D));
    for (let j = 0; j < n; j++, k++) if ((bits.charCodeAt(k >> 3) >> (k & 7)) & 1) pts.push(xyz(-180 + (360 * j) / n, lat));
  }
  const CAI = xyz(31.24, 30.04), DUS = xyz(6.77, 51.23);
  const dot = CAI[0] * DUS[0] + CAI[1] * DUS[1] + CAI[2] * DUS[2];
  const ang = Math.acos(dot);
  setText('km', `${Math.round((ang * 6371) / 10) * 10} km`);
  const arc: [number, number, number][] = [];
  for (let i = 0; i <= 48; i++) {
    const t = i / 48, a = Math.sin((1 - t) * ang) / Math.sin(ang), b = Math.sin(t * ang) / Math.sin(ang), h = 1 + 0.16 * Math.sin(Math.PI * t);
    arc.push([(a * CAI[0] + b * DUS[0]) * h, (a * CAI[1] + b * DUS[1]) * h, (a * CAI[2] + b * DUS[2]) * h]);
  }

  let W = 0, H = 0, R = 0, cx = 0, cy = 0, dpr = 1;
  let lon0 = 14, lat0 = 34, vx = 0, dragging = false, px = 0, py = 0, seen = false, run = 0;
  const size = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    const wide = W > 860;
    R = wide ? Math.min(H * 0.62, W * 0.34) : W * 0.56;
    cx = wide ? W * 0.72 : W * 0.5;
    cy = wide ? H * 0.52 : W * 0.44;
  };
  new ResizeObserver(size).observe(cv);
  size();

  const proj = (p: [number, number, number]) => {
    const l = -lon0 * D, f = lat0 * D;
    const x = p[0] * Math.cos(l) + p[2] * Math.sin(l);
    const z1 = -p[0] * Math.sin(l) + p[2] * Math.cos(l);
    const y = p[1] * Math.cos(f) - z1 * Math.sin(f);
    const z = p[1] * Math.sin(f) + z1 * Math.cos(f);
    return [cx + R * x, cy - R * y, z] as const;
  };
  const label = (p: readonly [number, number, number], text: string, dx: number, dy: number) => {
    ctx.font = '500 11px "JetBrains Mono", monospace';
    const w = ctx.measureText(text).width + 12;
    ctx.fillStyle = '#fff';
    const x = Math.min(p[0] + dx, W - w - 10);
    ctx.fillRect(x, p[1] + dy - 10, w, 20);
    ctx.fillStyle = '#1B2BFF';
    ctx.fillText(text, x + 6, p[1] + dy + 4);
  };

  const draw = (t: number) => {
    run = 0;
    if (!dragging) {
      if (Math.abs(vx) > 0.01) { lon0 += vx; vx *= 0.94; }
      else if (!reduce) lon0 += (14 + 16 * Math.sin(t * 0.00022) - lon0) * 0.02;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(255,255,255,.35)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    for (const p of pts) {
      const q = proj(p);
      if (q[2] <= 0) continue;
      ctx.fillStyle = `rgba(255,255,255,${(0.25 + 0.75 * q[2]).toFixed(2)})`;
      const s = 0.9 + 1.5 * q[2];
      ctx.fillRect(q[0] - s / 2, q[1] - s / 2, s, s);
    }
    const a = arc.map(proj);
    if (a[0][2] > 0 && a[48][2] > 0) {
      ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 5]);
      ctx.beginPath(); a.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke();
      ctx.setLineDash([]);
      const head = reduce ? 48 : Math.floor(((t * 0.00045) % 1.25) * 48);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = Math.max(0, head - 12); i <= Math.min(48, head); i++) { const q = a[i]; if (i === Math.max(0, head - 12)) ctx.moveTo(q[0], q[1]); else ctx.lineTo(q[0], q[1]); }
      ctx.stroke();
      const c = proj(CAI), d = proj(DUS), pulse = reduce ? 0.5 : (t * 0.001) % 1;
      for (const q of [c, d]) {
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(q[0], q[1], 5, 0, 7); ctx.fill();
        ctx.strokeStyle = `rgba(255,255,255,${(1 - pulse).toFixed(2)})`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(q[0], q[1], 5 + pulse * 18, 0, 7); ctx.stroke();
      }
      label(c, 'Cairo: where I write it', 12, 16);
      label(d, 'Düsseldorf: vodafone.de', 12, -16);
    }
    if (seen) run = requestAnimationFrame(draw);
  };
  new IntersectionObserver(([en]) => { seen = en.isIntersecting; if (seen && !run) run = requestAnimationFrame(draw); }).observe(cv);

  cv.addEventListener('pointerdown', (e) => { dragging = true; px = e.clientX; py = e.clientY; vx = 0; if (e.pointerType === 'mouse') cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - px, dy = e.clientY - py;
    px = e.clientX; py = e.clientY;
    vx = (-dx / R) * 60;
    lon0 += vx;
    lat0 = Math.min(70, Math.max(-20, lat0 + (dy / R) * 40));
  });
  const end = () => { dragging = false; };
  cv.addEventListener('pointerup', end);
  cv.addEventListener('pointercancel', end);
  cv.addEventListener('pointerleave', end);
}
