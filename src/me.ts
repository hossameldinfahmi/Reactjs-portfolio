const root = document.documentElement;

const TITLES = {
  ar: 'حسام فهمي — مهندس بالنهار، فاوندر بالليل',
  en: 'Hossam Fahmy — Engineer by day, founder by night',
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
