(() => {
  const key = 'aurevia-cookie-choice';
  const banner = document.querySelector('[data-cookie-banner]');
  if (!banner) return;
  if (!localStorage.getItem(key)) banner.classList.add('is-visible');
  banner.querySelectorAll('[data-cookie-choice]').forEach(button => button.addEventListener('click', () => {
    localStorage.setItem(key, button.dataset.cookieChoice);
    banner.classList.remove('is-visible');
  }));
})();
