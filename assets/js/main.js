document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-ready');
  const bar = document.querySelector('.progress-bar');
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.nav');
  const menu = document.querySelector('[data-menu]');
  if (bar) requestAnimationFrame(() => bar.classList.add('is-done'));
  setTimeout(() => bar && bar.classList.remove('is-done'), 420);
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menu.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open'); menu.setAttribute('aria-expanded','false'); document.body.classList.remove('menu-open');
    }));
  }
  const setScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 26);
  setScroll(); window.addEventListener('scroll', setScroll, { passive: true });
  document.querySelectorAll('a[href^="/"]').forEach(link => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || link.target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (bar) { bar.classList.remove('is-done'); bar.classList.add('is-active'); }
      document.body.classList.add('page-leaving');
      setTimeout(() => { window.location.href = href; }, 180);
    });
  });
  const profileDetails = [...document.querySelectorAll('.portfolio-board details')];
  profileDetails.forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;
      profileDetails.forEach(other => {
        if (other !== detail) other.open = false;
      });
    });
  });
  const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); observer.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
