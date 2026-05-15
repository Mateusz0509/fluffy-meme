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
document.getElementById('generatePdf').addEventListener('click', async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const name     = document.getElementById('clientName').value || '—';
  const nip      = document.getElementById('clientNip').value || '—';
  const email    = document.getElementById('clientEmail').value || '—';
  const phone    = document.getElementById('clientPhone').value || '—';
  const address  = document.getElementById('clientAddress').value || '—';
  const notes    = document.getElementById('clientNotes').value || '—';
  const count    = Number(qty.value);
  const unit     = Number(product.value);
  const total    = unit * count;
  const deposit  = total * 0.15;
  const invNo    = document.getElementById('invNo').textContent;

  // Nagłówek
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Sosnowe Chwile – eFaktura zaliczkowa', 14, 16);

  // Nabywca
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Nabywca:', 14, 26);
  doc.text(name, 14, 32);
  doc.text('NIP: ' + nip, 14, 38);
  doc.text('Email: ' + email, 14, 44);
  doc.text('Telefon: ' + phone, 14, 50);

  // Adres dostawy
  const addrLines = doc.splitTextToSize('Adres dostawy: ' + address, 180);
  doc.text(addrLines, 14, 58);

  // Uwagi do zamówienia
  const notesLines = doc.splitTextToSize('Uwagi: ' + notes, 180);
  const nextY = 58 + (addrLines.length * 6) + 8;
  doc.text(notesLines, 14, nextY);

  // Pozycja zamówienia
  const posY = nextY + (notesLines.length * 6) + 12;
  doc.text('Produkt: ' + product.options[product.selectedIndex].text, 14, posY);
  doc.text('Ilość: ' + qty.value + ' palet', 14, posY + 6);
  doc.text('Wartość zamówienia brutto: ' + total.toLocaleString('pl-PL') + ' zł', 14, posY + 12);
  doc.text('Zaliczka 15%: ' + formatPLNFloat(deposit), 14, posY + 18);

  // Dane do przelewu
  const bankY = posY + 18 + 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Dane do przelewu zaliczki', 14, bankY);
  doc.setFont('helvetica', 'normal');
  doc.text('Odbiorca: Sosnowe Chwile Sp. z o.o.', 14, bankY + 6);
  doc.text('Nr konta: 39 1160 2202 0000 0007 1309 0461', 14, bankY + 12);
  doc.text('Tytuł: Zaliczka za pellet / nr faktury ' + invNo, 14, bankY + 18);

  doc.save('efaktura-zaliczkowa-sosnowe-chwile.pdf');
});
</script>