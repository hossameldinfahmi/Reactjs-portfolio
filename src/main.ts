import './style.css';

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
