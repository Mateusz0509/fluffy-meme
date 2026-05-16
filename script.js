// 1. Menu przewijane
const btn = document.getElementById('menuBtn');
const nav = document.getElementById('navMenu');
if (btn && nav) {
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

const qty = document.getElementById('qty');
const product = document.getElementById('product');
const totalPrice = document.getElementById('totalPrice');
const calcNote = document.getElementById('calcNote');
const sumTotal = document.getElementById('sumTotal');
const pdfQty = document.getElementById('pdfQty');
const pdfProduct = document.getElementById('pdfProduct');
const pdfUnit = document.getElementById('pdfUnit');
const pdfTotal = document.getElementById('pdfTotal');
const invNoEl = document.getElementById('invNo');
const pdInvNo = document.getElementById('pdInvNo');

function formatPLN(n) {
  return n.toLocaleString('pl-PL') + ' zĹ';
}

function formatPLNFloat(n) {
  return n.toFixed(2).replace('.', ',') + ' zĹ';
}

function updatePrice() {
  if (!qty || !product || !totalPrice || !calcNote) return;
  const unit = Number(product.value) || 1099;
  const count = Number(qty.value) || 1;
  const total = unit * count;

  totalPrice.textContent = formatPLN(total);
  calcNote.textContent = `Szacunkowa cena dla ${count} palet.`;

  if (sumTotal) sumTotal.textContent = formatPLN(total);
  if (pdfQty) pdfQty.textContent = `${count} palet`;
  if (pdfProduct) pdfProduct.textContent = product.options[product.selectedIndex]?.text || 'â';
  if (pdfUnit) pdfUnit.textContent = formatPLN(unit);
  if (pdfTotal) pdfTotal.textContent = formatPLN(total);
  if (pdInvNo && invNoEl) pdInvNo.textContent = invNoEl.textContent;
}

if (qty && product) {
  qty.addEventListener('change', updatePrice);
  product.addEventListener('change', updatePrice);
  updatePrice();
}

const pdfBtn = document.getElementById('generatePdf');
if (pdfBtn) {
  pdfBtn.addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const name = document.getElementById('clientName')?.value || 'â';
    const nip = document.getElementById('clientNip')?.value || 'â';
    const email = document.getElementById('clientEmail')?.value || 'â';
    const phone = document.getElementById('clientPhone')?.value || 'â';
    const address = document.getElementById('clientAddress')?.value || 'â';
    const count = Number(qty?.value) || 1;
    const unit = Number(product?.value) || 1099;
    const total = unit * count;
    const productName = product?.options[product.selectedIndex]?.text || 'Standard';
    const invNo = invNoEl?.textContent || 'FSZ/2026/05/001';
    const invDate = document.getElementById('invDate')?.textContent || '15.05.2026';

    const logo = new Image();
    const logoLoaded = new Promise((resolve) => {
      logo.onload = () => resolve(true);
      logo.onerror = () => resolve(false);
    });
    logo.src = 'logo.jpg';
    const okLogo = await logoLoaded;

    doc.setDrawColor(230, 223, 207);
    doc.setFillColor(248, 245, 238);
    doc.rect(10, 10, 190, 277, 'F');

    if (okLogo) {
      try { doc.addImage(logo, 'JPEG', 14, 14, 26, 26); } catch(e) {}
    }

    doc.setTextColor(34, 49, 23);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Sosnowe Chwile', 44, 22);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Pellet drzewny â˘ Dostawa na terenie Polski', 44, 28);

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(138, 14, 48, 28, 4, 4, 'F');
    doc.setFontSize(10);
    doc.text('Dokument: eFaktura zaliczkowa', 141, 22, { maxWidth: 42 });
    doc.text('Nr: ' + invNo, 141, 28);
    doc.text('Data: ' + invDate, 141, 34);

    doc.setDrawColor(225, 217, 201);
    doc.line(14, 44, 196, 44);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Sprzedawca', 14, 54);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Nordiva trade Sp. z o.o.', 14, 60);
    doc.text('ul. Rynek 17/2, 82-400 GdaĹsk', 14, 65);
    doc.text('NIP: 592-230-81-05', 14, 70);

    doc.setFillColor(252, 250, 246);
    doc.roundedRect(108, 50, 88, 26, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Nabywca', 112, 56);
    doc.setFont('helvetica', 'normal');
    doc.text(name, 112, 61, { maxWidth: 78 });
    doc.text('NIP: ' + nip, 112, 66, { maxWidth: 78 });
    doc.text('Email: ' + email, 112, 71, { maxWidth: 78 });

    const addrLines = doc.splitTextToSize(address, 170);
    doc.setFont('helvetica', 'bold');
    doc.text('Adres dostawy', 14, 82);
    doc.setFont('helvetica', 'normal');
    doc.text(addrLines, 14, 88);
    doc.text('Telefon: ' + phone, 14, 88 + addrLines.length * 5 + 4);

    const itemY = 108 + addrLines.length * 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Pozycja zamĂłwienia', 14, itemY);
    doc.setFont('helvetica', 'normal');
    doc.text('Produkt: ' + productName, 14, itemY + 7);
    doc.text('IloĹÄ: ' + count + ' palet', 14, itemY + 13);
    doc.text('Cena jednostkowa: ' + formatPLN(unit), 14, itemY + 19);
    doc.text('WartoĹÄ brutto: ' + formatPLN(total), 14, itemY + 25);

    doc.setDrawColor(225, 217, 201);
    doc.line(14, itemY + 31, 196, itemY + 31);

    const sumY = itemY + 40;
    doc.setFont('helvetica', 'bold');
    doc.text('Podsumowanie', 14, sumY);
    doc.setFont('helvetica', 'normal');
    doc.text('VAT: 0%', 14, sumY + 6);
    doc.text('WartoĹÄ brutto: ' + formatPLN(total), 14, sumY + 12);
    doc.text('Do zapĹaty: ' + formatPLN(total), 14, sumY + 18);

    const noteY = sumY + 28;
    doc.setFillColor(255, 248, 239);
    doc.roundedRect(14, noteY, 182, 18, 4, 4, 'F');
    doc.setFontSize(9);
    doc.text('Dokument ma charakter zaliczkowy i zostaĹ wygenerowany automatycznie na podstawie danych z formularza.', 18, noteY + 7, { maxWidth: 174 });
    doc.text('W razie potrzeby dane do potwierdzenia zamĂłwienia naleĹźy zweryfikowaÄ przed realizacjÄ.', 18, noteY + 13, { maxWidth: 174 });

    doc.save('efaktura-zaliczkowa-sosnowe-chwile.pdf');
  });
}