document.addEventListener('DOMContentLoaded', () => {
  const hb = document.getElementById('hb');
  const nl = document.getElementById('nl');
  const nav = document.getElementById('nav');
  if (hb && nl) {
    hb.addEventListener('click', () => {
      const open = nl.classList.toggle('op');
      hb.classList.toggle('op', open);
      hb.setAttribute('aria-expanded', String(open));
    });
    nl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nl.classList.remove('op');
      hb.classList.remove('op');
      hb.setAttribute('aria-expanded', 'false');
    }));
  }
  if (nav) window.addEventListener('scroll', () => nav.classList.toggle('sc', window.scrollY > 12));
  document.querySelectorAll('.woj-tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.woj-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.woj-panel').forEach(p => p.classList.remove('active'));
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
  const fakturaForm = document.getElementById('fakturaForm');
  const fakturaSuccess = document.getElementById('fakturaSuccess');
  const showError = (id, show) => { const el = document.getElementById(id); if (el) el.style.display = show ? 'block' : 'none'; };
  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidNIP = nip => ((nip || '').replace(/\D/g, '').length === 10);
  if (typeBtns.length && firmaFields) typeBtns.forEach(btn => btn.addEventListener('click', () => { typeBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); firmaFields.style.display = btn.dataset.typ === 'firma' ? 'block' : 'none'; }));
  if (fakturaForm) fakturaForm.addEventListener('submit', e => {
    e.preventDefault();
    const typ = document.querySelector('.ftype-btn.active')?.dataset.typ || 'osoba';
    const nazwaFirmy = document.getElementById('nazwaFirmy')?.value || '';
    const nip = document.getElementById('nip')?.value || '';
    const imie = document.getElementById('imie')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const telefon = document.getElementById('telefon')?.value || '';
    const miejscowosc = document.getElementById('miejscowosc')?.value || '';
    const iloscTon = document.getElementById('iloscTon')?.value || '';
    const formaPlatnosci = document.getElementById('formaPlatnosci')?.value || '';
    const uwagi = document.getElementById('uwagi')?.value || '';
    let ok = true;
    if (typ === 'firma') { const nipOk = isValidNIP(nip); const nazwaOk = nazwaFirmy.trim().length > 1; showError('errNIP', !nipOk); showError('errNazwaFirmy', !nazwaOk); if (!nipOk || !nazwaOk) ok = false; } else { showError('errNIP', false); showError('errNazwaFirmy', false); }
    const imieOk = imie.trim().length > 1; const emailOk = isValidEmail(email); const miejscowoscOk = miejscowosc.trim().length > 1; const iloscOk = Number(iloscTon) > 0;
    showError('errImie', !imieOk); showError('errEmail', !emailOk); showError('errMiejscowosc', !miejscowoscOk); showError('errIloscTon', !iloscOk);
    if (!ok || !imieOk || !emailOk || !miejscowoscOk || !iloscOk) return;
    const lines = ['Dzień dobry, wysyłam dane do przygotowania oferty / faktury:', '', `Typ klienta: ${typ === 'firma' ? 'Firma' : 'Osoba prywatna'}`];
    if (typ === 'firma') { lines.push(`Nazwa firmy: ${nazwaFirmy}`); lines.push(`NIP: ${nip}`); }
    lines.push('', `Imię i nazwisko: ${imie}`, `E-mail: ${email}`, telefon ? `Telefon: ${telefon}` : '', `Miejscowość: ${miejscowosc}`, `Ilość ton: ${iloscTon}`, formaPlatnosci ? `Forma płatności: ${formaPlatnosci === 'przelew' ? 'Przelew przed dostawą' : 'Gotówka przy dostawie'}` : '', uwagi ? `Uwagi: ${uwagi}` : '', '', 'Proszę o przygotowanie wyceny i terminu dostawy.');
    const text = encodeURIComponent(lines.filter(Boolean).join('
')); const phone = '48793573900'; if (fakturaSuccess) fakturaSuccess.style.display = 'block'; window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  });
  const calcBtn = document.getElementById('calcBtn');
  if (calcBtn) calcBtn.addEventListener('click', () => {
    const type = document.getElementById('pelletType')?.value || 'premium';
    const pallets = Math.max(1, Number(document.getElementById('pallets')?.value || 1));
    const postalRaw = document.getElementById('postal')?.value || '';
    const postal = postalRaw.replace(/\D/g, '');
    const address = (document.getElementById('address')?.value || '').trim();
    const base = type === 'premium' ? 2100 : 1890;
    let transport = 300 + pallets * 30;
    if (postal.length >= 2) transport += ((Number(postal.slice(0, 2)) || 0) % 5) * 10;
    const total = base * pallets + transport;
    const rp = document.getElementById('resultPrice');
    const rd = document.getElementById('resultDetails');
    const pelletName = type === 'premium' ? 'Pellet Premium A1' : 'Pellet Standard Economy';
    if (rp) rp.textContent = `${total.toLocaleString('pl-PL')} zł`;
    if (rd) rd.textContent = `${pelletName} • ${pallets} palet(y)` + (address ? ` • ${address}` : ' • wycena orientacyjna – dokładną cenę potwierdzimy po adresie');
    const waWrap = document.getElementById('calcWaWrap');
    const waLink = document.getElementById('calcWaLink');
    if (waWrap && waLink) {
      const msgLines = ['Dzień dobry, proszę o wycenę pelletu:', '', `Rodzaj: ${pelletName}`, `Ilość: ${pallets} palet(y)`, postal ? `Kod pocztowy: ${postalRaw}` : '', address ? `Adres dostawy: ${address}` : '', '', `Szacowana cena z kalkulatora: ${total.toLocaleString('pl-PL')} zł`, '(wiem, że to wycena orientacyjna – proszę o dokładną ofertę)'].filter(Boolean);
      waLink.href = `https://wa.me/48793573900?text=${encodeURIComponent(msgLines.join('
'))}`;
      waWrap.style.display = 'block';
    }
  });
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  document.querySelectorAll('.galeria-link').forEach(a => a.addEventListener('click', e => { e.preventDefault(); if (!lightbox || !lightboxImg) return; lightboxImg.src = a.href; lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden', 'false'); }));
  const closeLightbox = () => { if (!lightbox) return; lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden', 'true'); if (lightboxImg) lightboxImg.src = ''; };
  if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
});
