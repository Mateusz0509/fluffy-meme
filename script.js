const qty        = document.getElementById('qty');
const product    = document.getElementById('product');
const totalPrice = document.getElementById('totalPrice');       // w #wycena
const calcNote   = document.getElementById('calcNote');         // w #wycena

const depositRange  = document.getElementById('depositRange');  // w #efaktura
const depositNow    = document.getElementById('depositNow');    // w #efaktura
const depositStrong = document.getElementById('depositStrong'); // w #efaktura
const sumTotal      = document.getElementById('sumTotal');      // w #efaktura

const pdfQty    = document.getElementById('pdfQty');            // w #efaktura
const pdfProduct= document.getElementById('pdfProduct');        // w #efaktura
const pdfUnit   = document.getElementById('pdfUnit');           // w #efaktura
const pdfTotal  = document.getElementById('pdfTotal');          // w #efaktura


function formatPLN(n) {
  return n.toLocaleString('pl-PL') + ' zł';
}

function formatPLNFloat(n) {
  return n.toFixed(2).replace('.', ',') + ' zł';
}

function updatePrice() {
  const unit = Number(product.value);
  const count = Number(qty.value);
  const total = unit * count;
  const minD = total * 0.10;
  const maxD = total * 0.20;
  const midD = total * 0.15;

  // Szacunkowa wartość zamówienia (sekcja #wycena)
  totalPrice.textContent = formatPLN(total);
  calcNote.textContent   = 'Szacunkowa cena dla ' + count + ' palet.';

  // Wartość i zaliczka (sekcja #efaktura)
  sumTotal.textContent     = formatPLN(total);
  depositRange.textContent = formatPLNFloat(minD) + ' – ' + formatPLNFloat(maxD);
  depositNow.textContent   = formatPLNFloat(midD);
  depositStrong.textContent = formatPLNFloat(midD);

  pdfQty.textContent    = count + ' palet';
  pdfProduct.textContent = product.options[product.selectedIndex].text;
  pdfUnit.textContent   = formatPLN(unit);
  pdfTotal.textContent  = formatPLN(total);

  // synchronizacja numeru faktury (jeśli chcesz)
  document.getElementById('pdInvNo').textContent = document.getElementById('invNo').textContent;
}

// Nasłuchiwanie na zmiany w formularzu #wycena
qty.addEventListener('change', updatePrice);
product.addEventListener('change', updatePrice);
updatePrice();  // pierwsze wywołanie