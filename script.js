// Updated IntersectionObserver logic for TOC visibility and section highlighting
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const footer = document.querySelector('footer');
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.section-index a');
  // sections inside the content area (exclude hero)
  const sections = document.querySelectorAll('.sections-content section');

  // show TOC by default
  root.classList.add('toc--visible');

  // make TOC links clickable with smooth scroll and active state
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      navLinks.forEach((l) => {
        l.classList.remove('active');
        l.removeAttribute('aria-current');
      });
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    });
  });

  // Measure header height for sticky offset and expose via CSS variable
  if (header) {
    const setHeaderHeight = () => root.style.setProperty('--header-h', `${header.offsetHeight}px`);
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
  }

  /*
   * Keep the table of contents visible with the sections and hide it when the
   * footer enters the viewport so it doesn't overlap.
   */
  if (footer) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        root.classList.remove('toc--visible');
      } else {
        root.classList.add('toc--visible');
      }
    }, { threshold: 0 }).observe(footer);
  }

  // Highlight active section in the TOC
  if (sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', isActive);
            if (isActive) {
              link.setAttribute('aria-current', 'page');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

});
