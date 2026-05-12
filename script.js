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

if (nav) window.addEventListener('scroll', () => nav.classList.toggle('sc', window.scrollY > 12));

const tabs = document.querySelectorAll('.woj-tab');
const panels = document.querySelectorAll('.woj-panel');

tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => t.classList.remove('active'));
  panels.forEach(p => p.classList.remove('active'));
  tab.classList.add('active');
  const panel = document.getElementById(`woj-${tab.dataset.woj}`);
  if (panel) panel.classList.add('active');
}));

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
const form = document.getElementById('fakturaForm');
const successBox = document.getElementById('fakturaSuccess');

if (typeBtns.length && firmaFields) {
  typeBtns.forEach(btn => btn.addEventListener('click', () => {
    typeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    firmaFields.style.display = btn.dataset.typ === 'firma' ? 'block' : 'none';
  }));
}

const setError = (id, show) => {
  const el = document.getElementById(id);
  if (el) el.style.display = show ? 'block' : 'none';
};

const validNip = v => (v || '').replace(/D/g, '').length === 10;

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const typ = document.querySelector('.ftype-btn.active')?.dataset.typ || 'osoba';
    const vals = {
      imie: document.getElementById('imie')?.value.trim() || '',
      email: document.getElementById('email')?.value.trim() || '',
      miejscowosc: document.getElementById('miejscowosc')?.value.trim() || '',
      iloscTon: document.getElementById('iloscTon')?.value.trim() || '',
      nazwaFirmy: document.getElementById('nazwaFirmy')?.value.trim() || '',
      nip: document.getElementById('nip')?.value.trim() || '',
      telefon: document.getElementById('telefon')?.value.trim() || '',
      formaPlatnosci: document.getElementById('formaPlatnosci')?.value.trim() || '',
      uwagi: document.getElementById('uwagi')?.value.trim() || ''
    };

    let ok = true;
    setError('errImie', !vals.imie); ok = ok && !!vals.imie;
    setError('errEmail', !vals.email || !vals.email.includes('@')); ok = ok && !!vals.email && vals.email.includes('@');
    setError('errMiejscowosc', !vals.miejscowosc); ok = ok && !!vals.miejscowosc;
    setError('errIloscTon', !vals.iloscTon || Number(vals.iloscTon) <= 0); ok = ok && !!vals.iloscTon && Number(vals.iloscTon) > 0;

    if (typ === 'firma') {
      setError('errNazwaFirmy', !vals.nazwaFirmy); ok = ok && !!vals.nazwaFirmy;
      setError('errNIP', !validNip(vals.nip)); ok = ok && validNip(vals.nip);
    } else {
      setError('errNazwaFirmy', false);
      setError('errNIP', false);
    }

    if (!ok) return;

    const msg = [
      'Nowe zapytanie o fakturę / pellet',
      '',
      `Typ klienta: ${typ === 'firma' ? 'Firma' : 'Osoba prywatna'}`,
      typ === 'firma' ? `Nazwa firmy: ${vals.nazwaFirmy}` : null,
      typ === 'firma' ? `NIP: ${vals.nip}` : null,
      `Imię i nazwisko: ${vals.imie}`,
      `E-mail: ${vals.email}`,
      vals.telefon ? `Telefon: ${vals.telefon}` : null,
      `Miejscowość: ${vals.miejscowosc}`,
      `Ilość ton: ${vals.iloscTon}`,
      vals.formaPlatnosci ? `Forma płatności: ${vals.formaPlatnosci}` : null,
      vals.uwagi ? `Uwagi: ${vals.uwagi}` : null,
      '',
      'Proszę o wycenę i potwierdzenie zamówienia.'
    ].filter(Boolean).join('
');

    window.open(`https://wa.me/48793573900?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    if (successBox) successBox.style.display = 'block';
  });
}