/* Circle wipe between the two sides of the site (/ and /me). */
export function initWipe(): void {
  const root = document.documentElement;
  const el = document.createElement('div');
  el.className = 'wipe';
  el.setAttribute('aria-hidden', 'true');
  document.body.append(el);

  let incoming: string | null = null;
  try { incoming = sessionStorage.getItem('wipe'); sessionStorage.removeItem('wipe'); } catch { /* storage unavailable */ }
  if (incoming) {
    el.style.background = incoming;
    el.classList.add('wipe--full');
    root.classList.remove('wiping');
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('wipe--out')));
  } else {
    root.classList.remove('wiping');
  }

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.('a[data-wipe]') as HTMLAnchorElement | null;
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const color = a.dataset.wipe || '#1B2BFF';
    el.className = 'wipe';
    el.style.background = color;
    el.style.setProperty('--x', `${e.clientX}px`);
    el.style.setProperty('--y', `${e.clientY}px`);
    void el.offsetWidth;
    el.classList.add('wipe--in');
    try { sessionStorage.setItem('wipe', color); } catch { /* storage unavailable */ }
    window.setTimeout(() => { location.href = a.href; }, 560);
  });

  window.addEventListener('pageshow', (e) => {
    if (e.persisted) { el.className = 'wipe'; root.classList.remove('wiping'); }
  });
}
