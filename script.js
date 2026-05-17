const btn = document.getElementById('menuBtn');
const nav = document.getElementById('navMenu');
if (btn && nav) {
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    })
  );
}

const TONS_PER_PALLET = 1.0;
const qtyTons = document.getElementById('qtyTons');
const product = document.getElementById('product');
const totalPrice = document.getElementById('totalPrice');
const calcNote = document.getElementById('calcNoteTons');
const sumTotal = document.getElementById('sumTotal');
const sumTotalBrutto = document.getElementById('sumTotalBrutto');
const pdfQty = document.getElementById('pdfQty');
const pdfProduct = document.getElementById('pdfProduct');
const pdfUnit = document.getElementById('pdfUnit');
const pdfTotal = document.getElementById('pdfTotal');
const invNoEl = document.getElementById('invNo');
const pdfClientName = document.getElementById('pdfClientName');
const pdfClientAddress = document.getElementById('pdfClientAddress');
const pdfClientNip = document.getElementById('pdfClientNip');
const pdfAdvancePercent = document.getElementById('pdfAdvancePercent');
const pdfAdvanceAmount = document.getElementById('pdfAdvanceAmount');

function formatPLN(n) {
  return n.toLocaleString('pl-PL') + ' zł';
}

function getAdvancePercent(unit) {
  if (unit === 999) return 10;
  if (unit === 1099) return 15;
  if (unit === 1249) return 15;
  if (unit === 1299) return 20;
  return 15;
}

function updatePrice() {
  if (!qtyTons || !product || !totalPrice || !calcNote) return;

  const unit = Number(product.value) || 1099;
  const tons = Number(qtyTons.value) || 1;
  const palets = Math.ceil(tons / TONS_PER_PALLET);
  const total = unit * palets;
  const qtyLabel = `${palets} palet`;
  const qtyLabelTons = `${tons} ton${tons === 1 ? '' : 'y'}`;
  const prodLabel = product.options[product.selectedIndex]?.text || '—';
  const advPerc = getAdvancePercent(unit);
  const advance = (total * advPerc) / 100;

  totalPrice.textContent = formatPLN(total);
  calcNote.textContent = `Szacunkowa cena za ${qtyLabel} (${qtyLabelTons}).`;
  if (sumTotal) sumTotal.textContent = formatPLN(total);
  if (sumTotalBrutto) sumTotalBrutto.textContent = formatPLN(total);
  if (pdfQty) pdfQty.textContent = qtyLabelTons;
  if (pdfProduct) pdfProduct.textContent = prodLabel;
  if (pdfUnit) pdfUnit.textContent = formatPLN(unit);
  if (pdfTotal) pdfTotal.textContent = formatPLN(total);
  if (pdfClientName) pdfClientName.textContent = document.getElementById('clientName')?.value || '—';
  if (pdfClientAddress) pdfClientAddress.textContent = document.getElementById('clientAddress')?.value || '—';
  if (pdfClientNip) pdfClientNip.textContent = 'NIP: ' + (document.getElementById('clientNip')?.value || '—');
  if (pdfAdvancePercent) pdfAdvancePercent.textContent = advPerc;
  if (pdfAdvanceAmount) pdfAdvanceAmount.textContent = formatPLN(advance);
}

if (product) {
  if (qtyTons) qtyTons.addEventListener('change', updatePrice);
  product.addEventListener('change', updatePrice);
  updatePrice();
}

['clientName', 'clientAddress', 'clientNip'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', updatePrice);
});

document.querySelectorAll('.gallery-img').forEach(img =>
  img.addEventListener('click', () => {
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    if (imageModal && modalImage) {
      modalImage.src = img.src;
      imageModal.classList.add('open');
      imageModal.setAttribute('aria-hidden', 'false');
    }
  })
);

const modalClose = document.getElementById('modalClose');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
if (modalClose && imageModal) {
  modalClose.addEventListener('click', () => {
    imageModal.classList.remove('open');
    imageModal.setAttribute('aria-hidden', 'true');
  });
}
if (imageModal) {
  imageModal.addEventListener('click', e => {
    if (e.target === imageModal) {
      imageModal.classList.remove('open');
      imageModal.setAttribute('aria-hidden', 'true');
    }
  });
}

const pdfBtn = document.getElementById('generatePdf');
if (pdfBtn) {
  pdfBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const name = document.getElementById('clientName')?.value || '—';
    const nip = document.getElementById('clientNip')?.value || '—';
    const email = document.getElementById('clientEmail')?.value || '—';
    const phone = document.getElementById('clientPhone')?.value || '—';
    const address = document.getElementById('clientAddress')?.value || '—';
    const notes = document.getElementById('clientNotes')?.value || '—';

    const tons = Number(document.getElementById('qtyTons')?.value) || 1;
    const palets = Math.ceil(tons / TONS_PER_PALLET);
    const unit = Number(product?.value) || 1099;
    const total = unit * palets;
    const productName = product?.options[product.selectedIndex]?.text || 'Standard';
    const advPerc = getAdvancePercent(unit);
    const advance = (total * advPerc) / 100;

    const invNo = invNoEl?.textContent || 'FSZ/2026/05/001';
    const invDate = new Date().toLocaleDateString('pl-PL');
    if (document.getElementById('invDate')) document.getElementById('invDate').textContent = invDate;

    const w = doc.internal.pageSize.getWidth();
    doc.setTextColor(20, 20, 20);
    doc.setDrawColor(60, 60, 60);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Sosnowe Chwile', 14, 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('PELLET Z NATURY, CIEPŁO NA DŁUGO', 14, 22);
    doc.line(58, 10, 58, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('eFaktura zaliczkowa', w / 2, 16, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(invNo, w / 2, 24, { align: 'center' });
    doc.setFontSize(9);
    doc.text('Data wystawienia: ' + invDate, w - 14, 12, { align: 'right' });
    doc.text('Data sprzedaży: ' + invDate, w - 14, 18, { align: 'right' });
    doc.text('Termin płatności: 06.06.2024', w - 14, 24, { align: 'right' });
    doc.text('Forma płatności: Przelew', w - 14, 30, { align: 'right' });
    doc.line(14, 38, w - 14, 38);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('SPRZEDAWCA', 14, 46);
    doc.text('NABYWCA', 100, 46);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(['Sosnowe Chwile Sp. z o.o.','ul. Rynek 17/2, 80-855 Gdańsk','NIP: 592-230-81-05','REGON: 123456789','tel. 600 123 456','biuro@sosnowechwile.pl','www.sosnowechwile.pl'], 14, 52);
    doc.text([name, address, 'NIP: ' + nip, 'Email: ' + email, 'Tel: ' + phone], 100, 52, { maxWidth: 90 });
    const clientSummary = [
      `Adres: ${address}`,
      `NIP: ${nip}`,
      `Email: ${email}`,
      `Tel: ${phone}`
    ].join('\n');
    doc.text(doc.splitTextToSize(clientSummary, 90), 100, 67);

    const y = 80;
    doc.setFillColor(33, 56, 27);
    doc.rect(14, y - 4, w - 28, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    ['Lp.','Nazwa towaru / usługi','Ilość','Jedn.','Cena netto','Wartość netto','VAT','Wartość VAT','Wartość brutto'].forEach((t, i) => {
      const xs = [16, 31, 91, 108, 121, 144, 160, 172, 189];
      doc.text(t, xs[i], y + 1);
    });
    doc.setTextColor(20, 20, 20);
    doc.setDrawColor(220, 220, 220);
    doc.rect(14, y, w - 28, 18);
    [24, 88, 106, 120, 141, 159, 171, 187].forEach(x => doc.line(x, y, x, y + 18));
    doc.text('1', 16, y + 11);
    doc.text(productName, 31, y + 9, { maxWidth: 56 });
    doc.setFontSize(7);
    doc.text('Zakup na zamówienie nr ' + invNo, 31, y + 14, { maxWidth: 56 });
    doc.setFontSize(8);
    doc.text(formatPLN(unit).replace(' zł', ''), 91, y + 11);
    doc.text('szt.', 108, y + 11);
    doc.text(formatPLN(unit).replace(' zł', ''), 121, y + 11);
    doc.text(formatPLN(unit).replace(' zł', ''), 144, y + 11);
    doc.text('0%', 160, y + 11);
    doc.text('0,00 zł', 172, y + 11);
    doc.text(formatPLN(total), 189, y + 11, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Sposób płatności: Przelew', 14, 105);
    doc.text('Numer konta: 3911 6022 0200 0000 7130 9046 1', 14, 112);

    doc.setFont('helvetica', 'bold');
    doc.text('Podsumowanie zamówienia', 14, 121);
    doc.setFont('helvetica', 'normal');
    const summaryText = [
      `Produkt: ${productName}`,
      `Ilość: ${tons} ton (${palets} palet)`,
      `Cena jednostkowa: ${formatPLN(unit)}`,
      `Wartość zamówienia: ${formatPLN(total)}`,
      `Zaliczka: ${advPerc}% (${formatPLN(advance)})`,
      `Do zapłaty przy zaliczce: ${formatPLN(total - advance)}`,
      `Uwagi: ${notes}`
    ].join('\n');
    doc.text(doc.splitTextToSize(summaryText, 95), 14, 127);

    const boxX = 128;
    const boxY = 104;
    doc.setDrawColor(180, 180, 180);
    doc.rect(boxX, boxY, 70, 25);
    doc.text('Wartość netto:', boxX + 4, boxY + 6);
    doc.text(formatPLN(total), boxX + 66, boxY + 6, { align: 'right' });
    doc.text('Wartość VAT (0%):', boxX + 4, boxY + 13);
    doc.text('0,00 zł', boxX + 66, boxY + 13, { align: 'right' });
    doc.setFillColor(33, 56, 27);
    doc.rect(boxX, boxY + 17, 70, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('Wartość brutto:', boxX + 4, boxY + 21);
    doc.text(formatPLN(total), boxX + 66, boxY + 21, { align: 'right' });
    doc.setTextColor(20, 20, 20);
    doc.setFont('helvetica', 'normal');
    doc.text('Dziękujemy za zaufanie i wybór naszych produktów.', 14, 150);
    doc.text('Sosnowe Chwile – pellet z natury, ciepło na długo.', 14, 156);
    doc.text('Zatwierdzono', 170, 184, { align: 'center' });
    doc.save('efaktura-sosnowe-chwile.pdf');
  });
}
