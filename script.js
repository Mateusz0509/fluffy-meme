document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('order-form');
  const totalPriceEl = document.getElementById('totalPrice');
  const calcNoteEl = document.getElementById('calcNote');
  const formAlert = document.querySelector('.form-alert');

  const quantitySelect = document.getElementById('quantity');
  const productSelect = document.getElementById('product-select');

  // Map cen brutto za 1 paletę
  const productPrices = {
    'standard': 1099,
    'economy': 999,
    'premium-plus': 1249,
    'premium-a1': 1299
  };

  function parseQuantity(value) {
    if (value === '4-5') return 4; // przybliżenie do wyliczeń
    if (value === '6+') return 6; // przybliżenie do wyliczeń
    return Number(value) || 0;
  }

  function formatPrice(value) {
    return value.toLocaleString('pl-PL') + ' zł';
  }

  function updatePrice() {
    const productKey = productSelect.value;
    const quantityRaw = quantitySelect.value;

    if (!productKey || !quantityRaw) {
      totalPriceEl.textContent = '—';
      calcNoteEl.textContent = 'Wybierz ilość palet i rodzaj produktu, aby zobaczyć szacunkową wartość.';
      return;
    }

    const unitPrice = productPrices[productKey];
    const qty = parseQuantity(quantityRaw);

    const total = unitPrice * qty;
    totalPriceEl.textContent = formatPrice(total);

    let productLabel = 'pellet';
    switch (productKey) {
      case 'standard':
        productLabel = 'Standard';
        break;
      case 'economy':
        productLabel = 'Economy';
        break;
      case 'premium-plus':
        productLabel = 'Premium Plus';
        break;
      case 'premium-a1':
        productLabel = 'Premium A1';
        break;
    }

    calcNoteEl.textContent =
      `Szacunkowa cena brutto za ${qty} ${qty === 1 ? 'paletę' : 'palety'} pelletu ${productLabel}. ` +
      'Ostateczną wartość potwierdzimy na eFakturze.';
  }

  quantitySelect.addEventListener('change', updatePrice);
  productSelect.addEventListener('change', updatePrice);

  function showFieldError(fieldName, message) {
    const errorEl = document.querySelector(`.field-error[data-error-for="${fieldName}"]`);
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function hideFieldError(fieldName) {
    const errorEl = document.querySelector(`.field-error[data-error-for="${fieldName}"]`);
    if (!errorEl) return;
    errorEl.hidden = true;
  }

  function validateForm() {
    let isValid = true;
    formAlert.hidden = true;

    const name = document.getElementById('name');
    const nip = document.getElementById('nip');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const address = document.getElementById('address');
    const terms = document.getElementById('terms');

    // Name
    if (!name.value.trim()) {
      isValid = false;
      showFieldError('name', 'To pole jest wymagane – podaj imię i nazwisko lub nazwę firmy.');
    } else {
      hideFieldError('name');
    }

    // NIP – jeśli podany, sprawdź format 10 cyfr
    if (nip.value.trim()) {
      const nipDigits = nip.value.replace(/\D/g, '');
      if (nipDigits.length !== 10) {
        isValid = false;
        showFieldError('nip', 'Sprawdź, czy NIP ma prawidłowy format (10 cyfr).');
      } else {
        hideFieldError('nip');
      }
    } else {
      hideFieldError('nip');
    }

    // Email
    if (!email.value.trim()) {
      isValid = false;
      showFieldError('email', 'Podaj poprawny adres email – wyślemy na niego eFakturę.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      isValid = false;
      showFieldError('email', 'Podaj poprawny adres email – wyślemy na niego eFakturę.');
    } else {
      hideFieldError('email');
    }

    // Phone – minimalna długość
    if (!phone.value.trim()) {
      isValid = false;
      showFieldError('phone', 'Podaj numer telefonu – potrzebny do ustalenia dostawy.');
    } else if (phone.value.replace(/\D/g, '').length < 9) {
      isValid = false;
      showFieldError('phone', 'Podaj poprawny numer telefonu – minimum 9 cyfr.');
    } else {
      hideFieldError('phone');
    }

    // Quantity
    if (!quantitySelect.value) {
      isValid = false;
      showFieldError('quantity', 'Wybierz ilość palet, aby obliczyć szacunkową wartość zamówienia.');
    } else {
      hideFieldError('quantity');
    }

    // Product
    if (!productSelect.value) {
      isValid = false;
      showFieldError('product', 'Wybierz rodzaj pelletu, który chcesz zamówić.');
    } else {
      hideFieldError('product');
    }

    // Address
    if (!address.value.trim()) {
      isValid = false;
      showFieldError('address', 'Podaj pełny adres dostawy, abyśmy mogli wycenić transport.');
    } else {
      hideFieldError('address');
    }

    // Terms
    if (!terms.checked) {
      isValid = false;
      showFieldError('terms', 'Aby kontynuować, zaznacz zgodę na regulamin i politykę prywatności.');
    } else {
      hideFieldError('terms');
    }

    if (!isValid) {
      formAlert.hidden = false;
    }

    return isValid;
  }

  function fillInvoicePreview() {
    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const nip = document.getElementById('nip').value.trim();

    const qtyRaw = quantitySelect.value;
    const qty = parseQuantity(qtyRaw);

    const productKey = productSelect.value;
    const unitPrice = productPrices[productKey] || 0;
    const total = unitPrice * qty;

    const pdfClientName = document.getElementById('pdfClientName');
    const pdfClientAddress = document.getElementById('pdfClientAddress');
    const pdfClientNip = document.getElementById('pdfClientNip');

    const pdfProduct = document.getElementById('pdfProduct');
    const pdfQty = document.getElementById('pdfQty');
    const pdfUnit = document.getElementById('pdfUnit');
    const pdfTotal = document.getElementById('pdfTotal');
    const sumTotal = document.getElementById('sumTotal');
    const sumTotalBrutto = document.getElementById('sumTotalBrutto');

    pdfClientName.textContent = name || '—';
    pdfClientAddress.textContent = address || '—';
    pdfClientNip.textContent = nip ? `NIP: ${nip}` : 'NIP: —';

    let productLabel = 'Standard';
    switch (productKey) {
      case 'standard':
        productLabel = 'Standard';
        break;
      case 'economy':
        productLabel = 'Economy';
        break;
      case 'premium-plus':
        productLabel = 'Premium Plus';
        break;
      case 'premium-a1':
        productLabel = 'Premium A1';
        break;
    }

    pdfProduct.textContent = productLabel;
    pdfQty.textContent = `${qty} ${qty === 1 ? 'paleta' : 'palety'}`;
    pdfUnit.textContent = formatPrice(unitPrice);
    pdfTotal.textContent = formatPrice(total);
    sumTotal.textContent = formatPrice(total);
    sumTotalBrutto.textContent = formatPrice(total);

    const invDate = document.getElementById('invDate');
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    invDate.textContent = `${day}.${month}.${year}`;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const ok = validateForm();
    if (!ok) {
      return;
    }
    updatePrice();
    fillInvoicePreview();

    const efakturaSection = document.getElementById('efaktura');
    if (efakturaSection) {
      efakturaSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // PDF – prosty przykład na bazie jspdf
  const generatePdfBtn = document.getElementById('generatePdf');
  if (generatePdfBtn) {
    generatePdfBtn.addEventListener('click', async () => {
      // Tu możesz dopracować layout PDF.
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      const clientName = document.getElementById('pdfClientName').textContent;
      const clientAddress = document.getElementById('pdfClientAddress').textContent;
      const clientNip = document.getElementById('pdfClientNip').textContent;
      const product = document.getElementById('pdfProduct').textContent;
      const qty = document.getElementById('pdfQty').textContent;
      const unit = document.getElementById('pdfUnit').textContent;
      const total = document.getElementById('pdfTotal').textContent;

      doc.text('Sosnowe Chwile - eFaktura zaliczkowa', 10, 10);
      doc.text(`Nabywca: ${clientName}`, 10, 20);
      doc.text(`Adres: ${clientAddress}`, 10, 30);
      doc.text(`${clientNip}`, 10, 40);
      doc.text(`Produkt: ${product}`, 10, 50);
      doc.text(`Ilość: ${qty}`, 10, 60);
      doc.text(`Cena brutto: ${unit}`, 10, 70);
      doc.text(`Wartość brutto: ${total}`, 10, 80);

      doc.save('efaktura-zaliczkowa.pdf');
    });
  }

  // Mobile menu toggle
  const menuBtn = document.getElementById('menuBtn');
  const navMenu = document.getElementById('navMenu');
  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('nav--open');
    });
  }

  // Galerie – powiększanie zdjęć
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalClose = document.getElementById('modalClose');
  const galleryImages = document.querySelectorAll('.gallery-img');

  galleryImages.forEach(img => {
    img.addEventListener('click', () => {
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('is-open');
    });
  });

  modalClose.addEventListener('click', () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
  });
});