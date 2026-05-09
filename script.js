const hb = document.getElementById('hb');
const nl = document.getElementById('nl');
const nav = document.getElementById('nav');

hb.addEventListener('click', () => {
  const op = nl.classList.toggle('op');
  hb.classList.toggle('op', op);
  hb.setAttribute('aria-expanded', op);
});

nl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    nl.classList.remove('op');
    hb.classList.remove('op');
    hb.setAttribute('aria-expanded', false);
  });
});

window.addEventListener('scroll', () => {
  nav.classList.toggle('sc', window.scrollY > 12);
});
<script>
/* ---- FAKTURA: przełącznik osoba/firma ---- */
var ftypeBtns = document.querySelectorAll('.ftype-btn');
var firmaFields = document.getElementById('firmaFields');
var currentType = 'osoba';

ftypeBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    ftypeBtns.forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    currentType = btn.getAttribute('data-type');
    if (currentType === 'firma') {
      firmaFields.classList.add('show');
    } else {
      firmaFields.classList.remove('show');
    }
  });
});

/* ---- FAKTURA: formatowanie pól ---- */
document.getElementById('f-kod').addEventListener('input', function() {
  var v = this.value.replace(/\D/g, '');
  if (v.length > 2) v = v.slice(0,2) + '-' + v.slice(2,5);
  this.value = v;
});

document.getElementById('f-nip').addEventListener('input', function() {
  var v = this.value.replace(/\D/g, '').slice(0,10);
  this.value = v;
});

/* ---- FAKTURA: walidacja ---- */
function validateField(id, condition) {
  var group = document.getElementById('g-' + id);
  var input = document.getElementById('f-' + id);
  if (!group || !input) return true;
  if (!condition) {
    group.classList.add('has-error');
    input.classList.add('error');
    return false;
  }
  group.classList.remove('has-error');
  input.classList.remove('error');
  return true;
}

document.getElementById('fakturaFormEl').addEventListener('submit', function(e) {
  e.preventDefault();

  var imie    = document.getElementById('f-imie').value.trim();
  var nazwisko= document.getElementById('f-nazwisko').value.trim();
  var ulica   = document.getElementById('f-ulica').value.trim();
  var kod     = document.getElementById('f-kod').value.trim();
  var miasto  = document.getElementById('f-miasto').value.trim();
  var email   = document.getElementById('f-email').value.trim();
  var tel     = document.getElementById('f-tel').value.trim();
  var produkt = document.getElementById('f-produkt').value;
  var ilosc   = document.getElementById('f-ilosc').value;
  var nazwa   = document.getElementById('f-nazwa') ? document.getElementById('f-nazwa').value.trim() : '';
  var nip     = document.getElementById('f-nip') ? document.getElementById('f-nip').value.trim() : '';
  var woj     = document.getElementById('f-woj').value;
  var uwagi   = document.getElementById('f-uwagi').value.trim();

  var ok = true;
  ok = validateField('imie',    imie.length > 1)     && ok;
  ok = validateField('nazwisko',nazwisko.length > 1)  && ok;
  ok = validateField('ulica',   ulica.length > 2)     && ok;
  ok = validateField('kod',     /^\d{2}-\d{3}$/.test(kod)) && ok;
  ok = validateField('miasto',  miasto.length > 1)    && ok;
  ok = validateField('email',   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) && ok;
  ok = validateField('tel',     tel.length > 6)       && ok;
  ok = validateField('produkt', produkt !== '')        && ok;
  ok = validateField('ilosc',   ilosc >= 1)            && ok;

  if (currentType === 'firma') {
    ok = validateField('nazwa', nazwa.length > 2)     && ok;
    ok = validateField('nip',   /^\d{10}$/.test(nip)) && ok;
  }

  if (!ok) return;

  /* ---- buduj wiadomość WhatsApp ---- */
  var msg = 'Dzień dobry, przesyłam dane do faktury:%0A%0A';

  if (currentType === 'firma') {
    msg += '🏢 Firma: ' + encodeURIComponent(nazwa) + '%0A';
    msg += '📋 NIP: ' + encodeURIComponent(nip) + '%0A';
  }

  msg += '👤 Imię i nazwisko: ' + encodeURIComponent(imie + ' ' + nazwisko) + '%0A';
  msg += '📍 Adres: ' + encodeURIComponent(ulica + ', ' + kod + ' ' + miasto) + '%0A';
  if (woj) msg += '🗺 Województwo: ' + encodeURIComponent(woj) + '%0A';
  msg += '📧 E-mail: ' + encodeURIComponent(email) + '%0A';
  msg += '📞 Telefon: ' + encodeURIComponent(tel) + '%0A%0A';
  msg += '📦 Produkt: ' + encodeURIComponent(produkt) + '%0A';
  msg += '⚖️ Ilość: ' + encodeURIComponent(ilosc) + ' t%0A';
  if (uwagi) msg += '💬 Uwagi: ' + encodeURIComponent(uwagi) + '%0A';

  /* ---- otwórz WhatsApp ---- */
  window.open('https://wa.me/48793573900?text=' + msg, '_blank');

  /* ---- pokaż komunikat sukcesu ---- */
  document.getElementById('fakturaFormEl').style.display = 'none';
  document.getElementById('fakturaSuccess').classList.add('show');
});
</script>