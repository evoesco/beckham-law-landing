// Updated IntersectionObserver logic for TOC visibility and section highlighting
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const tocSentinel = document.getElementById('toc-sentinel');
  const footer = document.querySelector('footer');
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.section-index a');
  // sections inside the content area (exclude hero)
  const sections = document.querySelectorAll('.sections-content section');

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
   * Toggle TOC visibility based on a sentinel element. The table of contents
   * appears when the horizontal rule (#toc-sentinel) scrolls out of view and
   * disappears again when it re-enters. Additionally, hide the TOC when the
   * footer enters the viewport. This ensures the TOC becomes visible as soon as
   * the main content starts and stays sticky until the footer.
   */
  // Show/hide TOC based on sentinel intersection
  if (tocSentinel) {
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        root.classList.add('toc--visible');
      } else {
        root.classList.remove('toc--visible');
      }
    }, { threshold: 0 }).observe(tocSentinel);
  }
  // Hide TOC when footer enters the viewport
  if (footer) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        root.classList.remove('toc--visible');
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
