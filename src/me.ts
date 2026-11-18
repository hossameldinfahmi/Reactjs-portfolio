import { initWipe } from "./wipe";
const root = document.documentElement;

const TITLES = {
  ar: 'حسام فهمي — فاوندر MoneyLoop',
  en: 'Hossam Fahmy — Founder of MoneyLoop',
};

function setLang(lang: 'ar' | 'en') {
  root.lang = lang;
  root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = TITLES[lang];
  try { localStorage.setItem('me-lang', lang); } catch { /* storage unavailable */ }
}

function initialLang(): 'ar' | 'en' {
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'ar' || q === 'en') return q;
  try {
    const s = localStorage.getItem('me-lang');
    if (s === 'ar' || s === 'en') return s;
  } catch { /* storage unavailable */ }
  return 'ar';
}

setLang(initialLang());
document.getElementById('lang')?.addEventListener('click', () => {
  setLang(root.lang === 'ar' ? 'en' : 'ar');
});

// Count-up numbers
function fmt(n: number, el: HTMLElement) {
  const pre = el.dataset.pre ?? '';
  const suf = el.dataset.suf ?? '';
  if (el.dataset.fmt === 'm') return pre + (n >= 100000 ? `${(n / 1e6).toFixed(1)}M` : n >= 1000 ? `${Math.round(n / 1000)}K` : String(n)) + suf;
  if (el.dataset.fmt === 'k') return pre + (n >= 1000 ? `${Math.round(n / 1000)}K` : String(n)) + suf;
  return pre + n.toLocaleString('en-US') + suf;
}
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const counters = document.querySelectorAll<HTMLElement>('[data-count]');
counters.forEach((el) => { el.textContent = fmt(reduce ? Number(el.dataset.count) : 0, el); });

const countIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const el = e.target as HTMLElement;
    countIO.unobserve(el);
    const end = Number(el.dataset.count);
    const t0 = performance.now();
    const dur = 1400;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(Math.round(end * eased), el);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}, { threshold: 0.4 });
if (!reduce) counters.forEach((el) => countIO.observe(el));

// Reveal on scroll
const revealables = document.querySelectorAll<HTMLElement>('.intro .big, .num, .show, .goals li, .next__h, .foot__big');
revealables.forEach((el) => el.classList.add('rv'));
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { threshold: 0.15 });
revealables.forEach((el) => io.observe(el));

// Draw hand-made marks when they come into view
const marks = document.querySelectorAll<HTMLElement>('.scr, .ul, .ci');
const mio = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('drawn'); mio.unobserve(e.target); }
}, { threshold: 0.6 });
marks.forEach((m) => mio.observe(m));

// ---- v9: page wipe, 3D and scroll motion ----

initWipe();

// Hero photo tilt (desktop pointers only)
const heroEl = document.querySelector<HTMLElement>('.hero');
const photo = document.querySelector<HTMLElement>('.hero__photo');
if (heroEl && photo && !reduce && matchMedia('(min-width:900px) and (hover:hover)').matches) {
  heroEl.addEventListener('pointermove', (e) => {
    const b = heroEl.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5;
    const y = (e.clientY - b.top) / b.height - 0.5;
    photo.style.setProperty('--ty', `${(x * 14).toFixed(2)}deg`);
    photo.style.setProperty('--tx', `${(-y * 10).toFixed(2)}deg`);
  });
  heroEl.addEventListener('pointerleave', () => { photo.style.setProperty('--ty', '0deg'); photo.style.setProperty('--tx', '0deg'); });
}

// One dot per 1,000 users: 45 lit out of 1,000
const field = document.querySelector<HTMLElement>('.field');
if (field) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 1000; i++) {
    const d = document.createElement('i');
    if (i < 45) { d.className = 'on'; d.style.setProperty('--i', String(i)); }
    frag.append(d);
  }
  field.append(frag);
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { field.classList.add('in'); o.disconnect(); } }, { threshold: 0.25 }).observe(field);
}

// Product demo: play only while visible, and turn the phone with the scroll
const demo = document.querySelector<HTMLElement>('.demo');
const phone = document.querySelector<HTMLElement>('.phone');
const chapters = [...document.querySelectorAll<HTMLElement>('.ch')];
if (demo) new IntersectionObserver(([e]) => demo.classList.toggle('play', e.isIntersecting), { threshold: 0.2 }).observe(demo);

const onScrollMe = () => {
  const vh = innerHeight;
  if (phone && demo && !reduce) {
    const b = demo.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (vh - b.top) / (vh + b.height)));
    const dir = root.dir === 'rtl' ? -1 : 1;
    phone.style.setProperty('--ry', `${(dir * (-34 + p * 44)).toFixed(2)}deg`);
    phone.style.setProperty('--rx', `${(16 - p * 14).toFixed(2)}deg`);
    phone.style.setProperty('--rz', `${(dir * (5 - p * 6)).toFixed(2)}deg`);
  }
  if (!reduce) {
    for (let i = 0; i < chapters.length - 1; i++) {
      const r = chapters[i].getBoundingClientRect();
      const n = chapters[i + 1].getBoundingClientRect();
      const o = Math.min(1, Math.max(0, (r.bottom - n.top) / r.height));
      chapters[i].style.setProperty('--s', (1 - 0.07 * o).toFixed(4));
      chapters[i].style.setProperty('--b', (1 - 0.45 * o).toFixed(3));
    }
  }
};
let tickMe = false;
addEventListener('scroll', () => { if (tickMe) return; tickMe = true; requestAnimationFrame(() => { tickMe = false; onScrollMe(); }); }, { passive: true });
onScrollMe();
