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
  return n.toLocaleString('pl-PL') + ' zĹ';
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
  const prodLabel = product.options[product.selectedIndex]?.text || 'â';
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
  if (pdfClientName) pdfClientName.textContent = document.getElementById('clientName')?.value || 'â';
  if (pdfClientAddress) pdfClientAddress.textContent = document.getElementById('clientAddress')?.value || 'â';
  if (pdfClientNip) pdfClientNip.textContent = 'NIP: ' + (document.getElementById('clientNip')?.value || 'â');
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

    const name = document.getElementById('clientName')?.value || 'â';
    const nip = document.getElementById('clientNip')?.value || 'â';
    const email = document.getElementById('clientEmail')?.value || 'â';
    const phone = document.getElementById('clientPhone')?.value || 'â';
    const address = document.getElementById('clientAddress')?.value || 'â';
    const notes = document.getElementById('clientNotes')?.value || 'â';
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
    const h = doc.internal.pageSize.getHeight();
    const margin = 14;
    const right = w - margin;

    function head() {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Sosnowe Chwile', margin, 16);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('PELLET Z NATURY, CIEPĹO NA DĹUGO', margin, 22);
      doc.line(58, 10, 58, 30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('eFaktura zaliczkowa', w / 2, 16, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(invNo, w / 2, 24, { align: 'center' });
      doc.setFontSize(9);
      doc.text('Data wystawienia: ' + invDate, right, 12, { align: 'right' });
      doc.text('Data sprzedaĹźy: ' + invDate, right, 18, { align: 'right' });
      doc.text('Termin pĹatnoĹci: 06.06.2024', right, 24, { align: 'right' });
      doc.text('Forma pĹatnoĹci: Przelew', right, 30, { align: 'right' });
      doc.line(margin, 38, right, 38);
    }

    function drawPageNum() {
      const pageCount = doc.internal.getNumberOfPages();
      const page = doc.internal.getCurrentPageInfo().pageNumber;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Strona ${page} z ${pageCount}`, w / 2, h - 8, { align: 'center' });
    }

    head();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('WAĹťNE DANE DO PRZELEWU', margin, 48);
    doc.setDrawColor(200, 168, 90);
    doc.setLineWidth(0.8);
    doc.line(margin, 51, right, 51);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('TytuĹ przelewu:', margin, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const tytul = `Zaliczka za zamĂłwienie ${invNo} - ${productName}, ${tons} ton`;
    doc.text(doc.splitTextToSize(tytul, 180), margin, 66);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Numer konta:', margin, 83);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('39 11 6022 0200 0000 7130 9046 1', margin, 90);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Kwota zaliczki:', margin, 104);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(33, 56, 27);
    doc.text(formatPLN(advance), margin, 112);
    doc.setTextColor(20, 20, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Zaliczka wynosi ${advPerc}% wartoĹci zamĂłwienia.`, margin, 122);
    doc.text(`Do zapĹaty po zaliczce: ${formatPLN(total - advance)}`, margin, 129);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Dane nabywcy:', margin, 143);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const buyer = [name, address, 'NIP: ' + nip, 'Email: ' + email, 'Tel: ' + phone].join('
');
    doc.text(doc.splitTextToSize(buyer, 180), margin, 149);

    doc.addPage();
    head();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Podsumowanie zamĂłwienia', margin, 48);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const summaryText = [
      `Produkt: ${productName}`,
      `IloĹÄ: ${tons} ton (${palets} palet)`,
      `Cena jednostkowa: ${formatPLN(unit)}`,
      `WartoĹÄ zamĂłwienia: ${formatPLN(total)}`,
      `Kwota zaliczki: ${formatPLN(advance)}`,
      `PozostaĹo do zapĹaty: ${formatPLN(total - advance)}`,
      `Uwagi: ${notes}`
    ].join('
');
    doc.text(doc.splitTextToSize(summaryText, 180), margin, 56);

    const boxX = margin;
    const boxY = 108;
    const boxW = w - margin * 2;
    const boxH = 44;
    doc.setDrawColor(180, 180, 180);
    doc.rect(boxX, boxY, boxW, boxH);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('WartoĹÄ netto:', boxX + 4, boxY + 10);
    doc.text(formatPLN(total), boxX + boxW - 4, boxY + 10, { align: 'right' });
    doc.text('WartoĹÄ VAT (0%):', boxX + 4, boxY + 20);
    doc.text('0,00 zĹ', boxX + boxW - 4, boxY + 20, { align: 'right' });
    doc.setFillColor(33, 56, 27);
    doc.rect(boxX, boxY + 26, boxW, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('WartoĹÄ brutto:', boxX + 4, boxY + 33);
    doc.text(formatPLN(total), boxX + boxW - 4, boxY + 33, { align: 'right' });
    doc.setTextColor(20, 20, 20);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('SposĂłb pĹatnoĹci: Przelew bankowy', margin, 162);
    doc.text('TytuĹ przelewu oraz numer konta znajdujÄ siÄ na stronie 1.', margin, 169);

    drawPageNum();
    const pages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      drawPageNum();
    }

    doc.save('efaktura-sosnowe-chwile.pdf');
  });
}