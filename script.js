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
}