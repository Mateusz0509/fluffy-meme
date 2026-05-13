// Po załadowaniu DOM
document.addEventListener('DOMContentLoaded', function () {
  // --- ELEMENTY WSPÓLNE ---
  const nav = document.getElementById('nav');
  const hb = document.getElementById('hb');
  const navList = document.getElementById('nl');

  // --- HAMBURGER + MENU MOBILE ---
  if (hb && navList) {
    hb.addEventListener('click', function () {
      const isOpen = hb.classList.toggle('op');
      navList.classList.toggle('op', isOpen);
      hb.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Zamknij menu po kliknięciu w link
    navList.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hb.classList.remove('op');
        navList.classList.remove('op');
        hb.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- HEADER: klasa po scrollu ---
  if (nav) {
    window.addEventListener('scroll', function () {
      const scrolled = window.scrollY || window.pageYOffset;
      if (scrolled > 20) {
        nav.classList.add('sc');
      } else {
        nav.classList.remove('sc');
      }
    });
  }

  // --- KALKULATOR WYCENY + WHATSAPP ---
  const pelletType = document.getElementById('pelletType');
  const palletsInput = document.getElementById('pallets');
  const postalInput = document.getElementById('postal');
  const addressInput = document.getElementById('address');
  const calcBtn = document.getElementById('calcBtn');
  const resultPrice = document.getElementById('resultPrice');
  const resultDetails = document.getElementById('resultDetails');
  const calcWaWrap = document.getElementById('calcWaWrap');
  const calcWaLink = document.getElementById('calcWaLink');

  const basePrices = {
    economy: 800,
    standard: 1000,
    premium: 1250
  };

  function formatNumber(n) {
    return n.toLocaleString('pl-PL');
  }

  function obliczWycene() {
    if (!pelletType || !palletsInput || !resultPrice || !resultDetails) return;

    const type = pelletType.value;
    const pallets = parseInt(palletsInput.value, 10) || 0;

    if (!type || pallets <= 0) {
      resultPrice.textContent = '—';
      resultDetails.textContent = 'Podaj rodzaj pelletu i ilość palet.';
      if (calcWaWrap) calcWaWrap.style.display = 'none';
      return;
    }

    const base = basePrices[type] || 0;
    const perTonne = base;
    const total = perTonne * pallets;

    resultPrice.textContent = formatNumber(total) + ' zł';
    resultDetails.textContent =
      `Szacunkowa wartość zamówienia: ${pallets} palet (${perTonne} zł / tona). Cena orientacyjna, dokładna wycena po potwierdzeniu adresu dostawy.`;

    // Przygotowanie linku do WhatsApp
    if (calcWaWrap && calcWaLink) {
      const postal = postalInput ? postalInput.value.trim() : '';
      const addr = addressInput ? addressInput.value.trim() : '';

      const typLabel =
        type === 'economy'
          ? 'Pellet Economy'
          : type === 'standard'
          ? 'Pellet Standard'
          : 'Pellet Premium A1';

      const msgLines = [
        'Dzień dobry, proszę o wycenę pelletu:',
        '',
        `Rodzaj: ${typLabel}`,
        `Ilość palet: ${pallets}`,
        `Szacunkowa wartość: ${formatNumber(total)} zł`,
        '',
        postal ? `Kod pocztowy: ${postal}` : '',
        addr ? `Adres dostawy: ${addr}` : '',
        '',
        'Wiadomość z kalkulatora na stronie Sosnowe Chwile.'
      ].filter(Boolean);

      const msg = encodeURIComponent(msgLines.join('\n'));

      // Twój numer WhatsApp (bez + i bez spacji)
      const phone = '48793573900';
      const url = `https://wa.me/${phone}?text=${msg}`;

      calcWaLink.href = url;
      calcWaWrap.style.display = 'block';
    }
  }

  if (calcBtn) {
    calcBtn.addEventListener('click', function () {
      obliczWycene();
    });
  }

  // --- FORMULARZ FAKTURA → WhatsApp ---
  const fakturaForm = document.getElementById('fakturaForm');
  const ftypeBtns = document.querySelectorAll('.ftype-btn');
  const firmaFields = document.getElementById('firmaFields');

  const errNazwaFirmy = document.getElementById('errNazwaFirmy');
  const errNIP = document.getElementById('errNIP');
  const errImie = document.getElementById('errImie');
  const errEmail = document.getElementById('errEmail');
  const errMiejscowosc = document.getElementById('errMiejscowosc');
  const errIloscTon = document.getElementById('errIloscTon');
  const fsuccess = document.getElementById('fakturaSuccess');

  let typFaktury = 'firma';

  // przełączanie Firma / Osoba
  if (ftypeBtns.length) {
    ftypeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        ftypeBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        typFaktury = btn.dataset.typ || 'firma';

        if (typFaktury === 'firma') {
          if (firmaFields) firmaFields.style.display = '';
        } else if (firmaFields) {
          firmaFields.style.display = 'none';
        }
      });
    });
  }

  function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function validateNIP(nip) {
    const clean = (nip || '').replace(/[^0-9]/g, '');
    return clean.length === 10;
  }

  if (fakturaForm) {
    fakturaForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nazwaFirmy = document.getElementById('nazwaFirmy');
      const nip = document.getElementById('nip');
      const imie = document.getElementById('imie');
      const email = document.getElementById('email');
      const telefon = document.getElementById('telefon');
      const miejscowosc = document.getElementById('miejscowosc');
      const iloscTon = document.getElementById('iloscTon');
      const formaPlatnosci = document.getElementById('formaPlatnosci');
      const uwagi = document.getElementById('uwagi');
      const zaliczkaAkcept = document.getElementById('zaliczkaAkcept');

      // reset błędów
      [errNazwaFirmy, errNIP, errImie, errEmail, errMiejscowosc, errIloscTon].forEach(
        (el) => el && (el.style.display = 'none')
      );
      if (fsuccess) fsuccess.style.display = 'none';

      let valid = true;

      if (typFaktury === 'firma') {
        if (nazwaFirmy && !nazwaFirmy.value.trim()) {
          if (errNazwaFirmy) errNazwaFirmy.style.display = 'block';
          valid = false;
        }
        if (nip && !validateNIP(nip.value)) {
          if (errNIP) errNIP.style.display = 'block';
          valid = false;
        }
      }

      if (!imie || !imie.value.trim()) {
        if (errImie) errImie.style.display = 'block';
        valid = false;
      }

      if (!email || !validateEmail(email.value)) {
        if (errEmail) errEmail.style.display = 'block';
        valid = false;
      }

      if (!miejscowosc || !miejscowosc.value.trim()) {
        if (errMiejscowosc) errMiejscowosc.style.display = 'block';
        valid = false;
      }

      const tons = iloscTon ? parseFloat(iloscTon.value) : 0;
      if (!(tons > 0)) {
        if (errIloscTon) errIloscTon.style.display = 'block';
        valid = false;
      }

      if (!valid) return;

      const typOpis =
        typFaktury === 'firma' ? 'Faktura dla firmy' : 'Faktura dla osoby prywatnej';

      const firmaLine =
        typFaktury === 'firma' && nazwaFirmy && nazwaFirmy.value.trim()
          ? `Nazwa firmy: ${nazwaFirmy.value.trim()}`
          : '';

      const nipLine =
        typFaktury === 'firma' && nip && nip.value.trim()
          ? `NIP: ${nip.value.trim()}`
          : '';

      const msgLines = [
        'Dzień dobry, proszę o przygotowanie oferty / faktury za pellet:',
        '',
        typOpis,
        firmaLine,
        nipLine,
        '',
        `Imię i nazwisko: ${imie.value.trim()}`,
        `E-mail: ${email.value.trim()}`,
        telefon && telefon.value.trim() ? `Telefon: ${telefon.value.trim()}` : '',
        `Miejscowość: ${miejscowosc.value.trim()}`,
        '',
        `Ilość ton: ${tons}`,
        `Forma płatności: ${
          formaPlatnosci && formaPlatnosci.value === 'przelew'
            ? 'Przelew przed dostawą'
            : 'Gotówka przy dostawie'
        }`,
        uwagi && uwagi.value.trim() ? `Uwagi: ${uwagi.value.trim()}` : '',
        zaliczkaAkcept && zaliczkaAkcept.checked
          ? 'Klient akceptuje zaliczkę przed realizacją zamówienia.'
          : '',
        '',
        'Wiadomość z formularza zamówienia na stronie Sosnowe Chwile.'
      ].filter(Boolean);

      const msg = encodeURIComponent(msgLines.join('\n'));

      // ten sam numer co w kalkulatorze
      const phone = '48793573900';
      const url = `https://wa.me/${phone}?text=${msg}`;

      window.open(url, '_blank');

      if (fsuccess) {
        fsuccess.style.display = 'block';
      }
    });
  }

  // --- GALERIA: LIGHTBOX ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryLinks = document.querySelectorAll('.galeria-link');

  if (lightbox && lightboxImg && galleryLinks.length) {
    galleryLinks.forEach((link) => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (!href) return;
        lightboxImg.src = href;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }
});