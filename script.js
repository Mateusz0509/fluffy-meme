document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('hb');
  const navList = document.getElementById('nl');

  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) nav.classList.add('sc');
      else nav.classList.remove('sc');
    });
  }

  if (burger && navList) {
    burger.addEventListener('click', function () {
      const isOpen = navList.classList.toggle('op');
      burger.classList.toggle('op', isOpen);
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navList.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navList.classList.remove('op');
        burger.classList.remove('op');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.querySelectorAll('#faq .faq-item').forEach(function (item) {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');
    if (!btn || !ans) return;

    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('#faq .faq-item').forEach(function (it) {
        it.classList.remove('open');
        const p = it.querySelector('.faq-a');
        if (p) p.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  const tabs = document.querySelectorAll('.woj-tab');
  const panels = document.querySelectorAll('.woj-panel');

  if (tabs.length && panels.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const target = tab.getAttribute('data-woj');

        tabs.forEach(function (t) {
          t.classList.remove('active');
        });
        tab.classList.add('active');

        panels.forEach(function (p) {
          p.classList.toggle('active', p.id === 'woj-' + target);
        });
      });
    });
  }

  const typeBtns = document.querySelectorAll('.ftype-btn');
  const firmaFields = document.getElementById('firmaFields');
  const form = document.getElementById('fakturaForm');
  const successBox = document.getElementById('fakturaSuccess');

  if (typeBtns.length && firmaFields) {
    typeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const typ = btn.getAttribute('data-typ') || 'osoba';

        typeBtns.forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        firmaFields.style.display = typ === 'firma' ? 'grid' : 'none';
      });
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let ok = true;

      form.querySelectorAll('.ferror').forEach(function (el) {
        el.style.display = 'none';
      });

      function check(id, errId) {
        const el = document.getElementById(id);
        const err = document.getElementById(errId);
        if (!el || !err) return true;

        if (!el.value.trim()) {
          err.style.display = 'block';
          ok = false;
          return false;
        }
        return true;
      }

      check('imie', 'errImie');
      check('email', 'errEmail');
      check('miejscowosc', 'errMiejscowosc');
      check('iloscTon', 'errIloscTon');

      const aktywnyTyp = document.querySelector('.ftype-btn.active');
      const typ = aktywnyTyp ? aktywnyTyp.getAttribute('data-typ') : 'osoba';

      if (typ === 'firma') {
        check('nazwaFirmy', 'errNazwaFirmy');
        check('nip', 'errNIP');
      }

      if (!ok) return;

      const imie = (document.getElementById('imie') || {}).value || '';
      const email = (document.getElementById('email') || {}).value || '';
      const tel = (document.getElementById('telefon') || {}).value || '';
      const miejscowosc = (document.getElementById('miejscowosc') || {}).value || '';
      const ilosc = (document.getElementById('iloscTon') || {}).value || '';
      const formaPlatnosci = (document.getElementById('formaPlatnosci') || {}).value || '';
      const uwagi = (document.getElementById('uwagi') || {}).value || '';
      const nazwaFirmy = (document.getElementById('nazwaFirmy') || {}).value || '';
      const nip = (document.getElementById('nip') || {}).value || '';

      let msg = 'Nowe zapytanie o fakture na pellet:%0A%0A';
      msg += 'Typ klienta: ' + (typ === 'firma' ? 'Firma' : 'Osoba prywatna') + '%0A';

      if (typ === 'firma') {
        msg += 'Nazwa firmy: ' + nazwaFirmy + '%0A';
        msg += 'NIP: ' + nip + '%0A';
      }

      msg += 'Imie i nazwisko: ' + imie + '%0A';
      msg += 'E-mail: ' + email + '%0A';
      if (tel) msg += 'Telefon: ' + tel + '%0A';
      msg += 'Miejscowosc: ' + miejscowosc + '%0A';
      msg += 'Ilosc ton: ' + ilosc + '%0A';
      if (formaPlatnosci) msg += 'Forma platnosci: ' + formaPlatnosci + '%0A';
      if (uwagi) msg += '%0AUwagi: ' + uwagi + '%0A';

      const url = 'https://wa.me/48793573900?text=' + encodeURIComponent(decodeURIComponent(msg));
      window.open(url, '_blank');

      if (successBox) successBox.style.display = 'block';
    });
  }
});