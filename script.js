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
</body>
<script>
document.querySelectorAll('.woj-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const woj = tab.dataset.woj;

    document.querySelectorAll('.woj-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.woj-panel').forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById('woj-' + woj).classList.add('active');
  });
});
</script>
