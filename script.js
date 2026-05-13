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
    const typeEl = document.getElementById('pelletType');
    const palletsEl = document.getElementById('pallets');
    const postalEl = document.getElementById('postal');
    const addressEl = document.getElementById('address');

    const type = typeEl?.value || 'premium';
    const pallets = Math.max(1, Number(palletsEl?.value || 1));
    const postalRaw = postalEl?.value || '';
    const postal = postalRaw.replace(/\D/g, ''); // tylko cyfry
    const address = (addressEl?.value || '').trim();

    const base = type === 'premium' ? 2100 : 1890;

    // prosty, orientacyjny model transportu
    let transport = 300 + pallets * 30;

    if (postal.length >= 2) {
      const prefix = Number(postal.slice(0, 2)) || 0;
      const modifier = (prefix % 5) * 10; // 0–40 zł
      transport += modifier;
    }

    const total = base * pallets + transport;

    const rp = document.getElementById('resultPrice');
    const rd = document.getElementById('resultDetails');

    if (rp) {
      rp.textContent = `${total.toLocaleString('pl-PL')} zł`;
    }

    const pelletName = type === 'premium'
      ? 'Pellet Premium A1'
      : 'Pellet Standard Economy';

    if (rd) {
      rd.textContent =
        `${pelletName} • ${pallets} palet(y)` +
        (address ? ` • ${address}` : ' • wycena orientacyjna – dokładną cenę potwierdzimy po adresie');
    }

    // WhatsApp – generowanie linku z podsumowaniem
    const waWrap = document.getElementById('calcWaWrap');
    const waLink = document.getElementById('calcWaLink');

    if (waWrap && waLink) {
      const msgLines = [
        'Dzień dobry, proszę o wycenę pelletu:',
        '',
        `Rodzaj: ${pelletName}`,
        `Ilość: ${pallets} palet(y)`,
        postal ? `Kod pocztowy: ${postalRaw}` : '',
        address ? `Adres dostawy: ${address}` : '',
        '',
        `Szacowana cena z kalkulatora: ${total.toLocaleString('pl-PL')} zł`,
        '(wiem, że to wycena orientacyjna – proszę o dokładną ofertę)'
      ].filter(Boolean);

      const text = encodeURIComponent(msgLines.join('\n'));

      // Twój numer z przycisków na stronie
      const phone = '48793573900';

      waLink.href = `https://wa.me/${phone}?text=${text}`;
      waWrap.style.display = 'block';
    }
  });
}});