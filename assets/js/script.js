
document.addEventListener('DOMContentLoaded', () => {
  const langButtons = document.querySelectorAll('.lang-toggle button');
  const langBlocks = document.querySelectorAll('.lang');

  function setLang(lang) {
    langBlocks.forEach(el => {
      if (el.classList.contains('lang-' + lang)) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });
    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  setLang('en');
});
