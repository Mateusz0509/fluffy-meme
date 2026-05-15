const qty             = document.getElementById('qty');
const product         = document.getElementById('product');

// Wycena
const totalPrice      = document.getElementById('totalPrice');
const calcNote        = document.getElementById('calcNote');

// eFaktura
const depositRange    = document.getElementById('depositRange');
const depositNow      = document.getElementById('depositNow');
const depositStrong   = document.getElementById('depositStrong');
const sumTotal        = document.getElementById('sumTotal');

const pdfQty          = document.getElementById('pdfQty');
const pdfProduct      = document.getElementById('pdfProduct');
const pdfUnit         = document.getElementById('pdfUnit');
const pdfTotal        = document.getElementById('pdfTotal');


function formatPLN(n) {
  return n.toLocaleString('pl-PL') + ' zł';
}

function formatPLNFloat(n) {
  return n.toFixed(2).replace('.', ',') + ' zł';
}

function updatePrice() {
  console.log('updatePrice wywołany');

  const unit  = Number(product.value);
  const count = Number(qty.value);
  const total = unit * count;
  const minD  = total * 0.10;
  const maxD  = total * 0.20;
  const midD  = total * 0.15;

  // Szacunkowa wartość zamówienia (#wycena)
  if (totalPrice)      totalPrice.textContent = formatPLN(total);
  if (calcNote)        calcNote.textContent   = 'Szacunkowa cena dla ' + count + ' palet.';

  // Wartość i zaliczka (#efaktura)
  if (sumTotal)      sumTotal.textContent     = formatPLN(total);
  if (depositRange)  depositRange.textContent = formatPLNFloat(minD) + ' – ' + formatPLNFloat(maxD);
  if (depositNow)    depositNow.textContent   = formatPLNFloat(midD);
  if (depositStrong) depositStrong.textContent = formatPLNFloat(midD);

  // Tabela w eFakturze
  if (pdfQty)      pdfQty.textContent        = count + ' palet';
  if (pdfProduct)  pdfProduct.textContent    = product.options[product.selectedIndex].text;
  if (pdfUnit)     pdfUnit.textContent       = formatPLN(unit);
  if (pdfTotal)    pdfTotal.textContent      = formatPLN(total);

  // numer faktury
  const invNo = document.getElementById('invNo');
  const pdInvNo = document.getElementById('pdInvNo');
  if (invNo && pdInvNo) {
    pdInvNo.textContent = invNo.textContent;
  }
}

// Listener tylko jeśli elementy istnieją
if (qty && product) {
  qty.addEventListener('change', updatePrice);
  product.addEventListener('change', updatePrice);
  updatePrice();
}
function formatPLNFloat(n) {
  return n.toFixed(2).replace('.', ',') + ' zł';
}

function updatePrice() {
  const unit  = Number(product.value);
  const count = Number(qty.value);
  const total = unit * 1 * count;
  const minD  = total * 0.10;
  const maxD  = total * 0.20;
  const midD  = total * 0.15;

  // Szacunkowa wartość w #wycena
  totalPrice.textContent = total.toLocaleString('pl-PL') + ' zł';
  calcNote.textContent   = 'Szacunkowa cena dla ' + count + ' palet.';

  // W #efaktura
  sumTotal.textContent     = total.toLocaleString('pl-PL') + ' zł';
  depositRange.textContent = formatPLNFloat(minD) + ' – ' + formatPLNFloat(maxD);
  depositNow.textContent   = formatPLNFloat(midD);
  depositStrong.textContent = formatPLNFloat(midD);

  pdfQty.textContent        = count + ' palet';
  pdfProduct.textContent    = product.options[product.selectedIndex].text;
  pdfUnit.textContent       = (unit).toLocaleString('pl-PL') + ' zł';
  pdfTotal.textContent      = total.toLocaleString('pl-PL') + ' zł';

  // synchronizacja numeru faktury
  const pdInvNo = document.getElementById('pdInvNo');
  const invNo   = document.getElementById('invNo');
  if (pdInvNo && invNo) pdInvNo.textContent = invNo.textContent;
}

// Nasłuch na zmianę w sekcji #wycena
qty.addEventListener('change', updatePrice);
product.addEventListener('change', updatePrice);
updatePrice(); // pierwsze wywołanie