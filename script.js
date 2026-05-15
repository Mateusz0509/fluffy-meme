<script>
  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('navMenu');

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  const qty = document.getElementById('qty');
  const product = document.getElementById('product');
  const totalPrice = document.getElementById('totalPrice');
  const calcNote = document.getElementById('calcNote');

  function updatePrice() {
    const unit = Number(product.value);
    const count = Number(qty.value);
    const total = unit * count;
    totalPrice.textContent = total.toLocaleString('pl-PL') + ' zł';
    calcNote.textContent = 'Szacunkowa cena dla ' + count + ' palet.';
  }

  qty.addEventListener('change', updatePrice);
  product.addEventListener('change', updatePrice);
  updatePrice();

  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalClose = document.getElementById('modalClose');

  document.querySelectorAll('.gallery-img').forEach(img => {
    img.addEventListener('click', () => {
      modal.classList.add('open');
      modalImage.src = img.src;
      modalImage.alt = img.alt;
    });
  });

  modalClose.addEventListener('click', () => {
    modal.classList.remove('open');
    modalImage.src = '';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      modalImage.src = '';
    }
  });
</script>
