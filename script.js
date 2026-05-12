const hb = document.getElementById('hb');
const nl = document.getElementById('nl');
const nav = document.getElementById('nav');

if (hb && nl) {
  hb.addEventListener('click', () => {
    const op = nl.classList.toggle('op');
    hb.classList.toggle('op', op);
    hb.setAttribute('aria-expanded', op);
  });

  nl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nl.classList.remove('op');
    hb.classList.remove('op');
    hb.setAttribute('aria-expanded', false);
  }));
}

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('sc', window.scrollY > 12);
  });
}

document.querySelectorAll('.woj-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.woj-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.woj-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById(`woj-${tab.dataset.woj}`);
    if (panel) panel.classList.add('active');
  });
});

document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  if (!q) return;
  q.addEventListener('click', () => {
    const open = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!open) item.classList.add('active');
  });
});

const typeBtns = document.querySelectorAll('.ftype-btn');
const firmaFields = document.getElementById('firmaFields');

if (typeBtns.length && firmaFields) {
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      firmaFields.style.display = btn.dataset.typ === 'firma' ? 'block' : 'none';
    });
  });
}

const calcBtn = document.getElementById('calcBtn');
if (calcBtn) {
  calcBtn.addEventListener('click', () => {
    const type = document.getElementById('pelletType')?.value || 'premium';
    const pallets = Math.max(1, Number(document.getElementById('pallets')?.value || 1));
    const postal = (document.getElementById('postal')?.value || '').replace(/D/g, '');
    const address = document.getElementById('address')?.value || '';

    const base = type === 'premium' ? 2100 : 1890;
    const transport = 350 + Math.min(250, pallets * 35) + (postal ? ((Number(postal.slice(0, 2)) || 0) % 9) * 10 : 0);
    const total = base * pallets + transport;

    const rp = document.getElementById('resultPrice');
    const rd = document.getElementById('resultDetails');
    if (rp) rp.textContent = `${total.toLocaleString('pl-PL')} zł`;
    if (rd) rd.textContent = `${type === 'premium' ? 'Pellet Premium A1' : 'Pellet Standard Economy'} • ${pallets} palet(y) • ${address || 'wycena orientacyjna'}`;
  });
}

document.querySelectorAll('.galeria-link').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    if (lb && img) {
      img.src = a.href;
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
    }
  });
});

const lb = document.getElementById('lightbox');
const lbClose = document.getElementById('lightboxClose');

if (lb) {
  lb.addEventListener('click', e => {
    if (e.target === lb) lb.classList.remove('open');
  });
}

if (lbClose) {
  lbClose.addEventListener('click', () => {
    lb.classList.remove('open');
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lb) lb.classList.remove('open');
});