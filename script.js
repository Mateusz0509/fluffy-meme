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
<script>
const pricing={economy:{name:'Pellet Economy',base:1240},premium:{name:'Pellet Premium',base:1490}};
function deliveryCost(postal,address,pallets){const text=`${postal} ${address}`.toLowerCase();let zone=3;if(/^0|1|2/.test(postal)) zone=1;else if(/^3|4|5/.test(postal)) zone=2;if(text.includes('warszawa')) zone=1; if(text.includes('krakow')||text.includes('kraków')||text.includes('wroclaw')||text.includes('wrocław')) zone=Math.max(zone,2); return [190,260,340][zone-1]+Math.max(0,pallets-1)*55;}
function calc(){const type=document.getElementById('pelletType').value;const pallets=Math.max(1,parseInt(document.getElementById('pallets').value||'1',10));const postal=document.getElementById('postal').value.trim();const address=document.getElementById('address').value.trim();const product=pricing[type];const total=product.base*pallets+deliveryCost(postal,address,pallets);document.getElementById('resultPrice').textContent=total.toLocaleString('pl-PL')+' zł';document.getElementById('resultDetails').textContent=`${product.name}, ${pallets} paleta/y. Wycena orientacyjna z dostawą.`;}
const calcBtn=document.getElementById('calcBtn'); if(calcBtn){calcBtn.addEventListener('click',calc);['pelletType','pallets','postal','address'].forEach(id=>document.getElementById(id)?.addEventListener('input',calc)); calc();}
const quoteForm=document.getElementById('quoteForm');
if(quoteForm){quoteForm.addEventListener('submit',function(e){e.preventDefault();const data={name:qName.value.trim(),phone:qPhone.value.trim(),email:qEmail.value.trim(),postal:qPostal.value.trim(),address:qAddress.value.trim(),pallets:qPallets.value.trim(),type:qType.value,method:qMethod.value,notes:qNotes.value.trim()};const text=`Nowe zapytanie o pellet:%0A%0AImię i nazwisko: ${data.name}%0ATelefon: ${data.phone}%0AE-mail: ${data.email}%0AKod pocztowy: ${data.postal}%0AAdres dostawy: ${data.address}%0AIlość palet: ${data.pallets}%0ARodzaj pelletu: ${data.type}%0AUwagi: ${data.notes || '-'}%0A%0AProszę o automatyczną wycenę z dostawą.`;if(data.method==='whatsapp'){window.open(`https://wa.me/48793573900?text=${encodeURIComponent(decodeURIComponent(text))}`,'_blank','noopener');}else{window.location.href=`mailto:biuro@sosnowechwile.pl?subject=${encodeURIComponent('Zapytanie o pellet')}&body=${encodeURIComponent(decodeURIComponent(text))}`;}});}
</script>