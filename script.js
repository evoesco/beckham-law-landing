// Updated IntersectionObserver logic for TOC visibility and section highlighting
// and inertial scroll effect
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const tocSentinel = document.getElementById('toc-sentinel');
  const footer = document.querySelector('footer');
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.section-index a');
  // sections inside the content area (exclude hero)
  const sections = document.querySelectorAll('.sections-content section');

  // Measure header height for sticky offset and expose via CSS variable
  if (header) {
    root.style.setProperty('--header-h', `${header.offsetHeight}px`);
  }

  // Show TOC after sentinel leaves viewport
  if (tocSentinel) {
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        root.classList.add('toc--visible');
      } else {
        root.classList.remove('toc--visible');
      }
    }, { threshold: 0 }).observe(tocSentinel);
  }

  // Hide TOC when footer enters viewport (but otherwise keep visible)
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
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    }, { threshold: 0.6 });

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // Smooth scroll behavior for nav links
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = link.getAttribute('href').replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Inertial scroll for pointer devices (disable on touch devices)
  (function () {
    if (!matchMedia('(pointer: fine)').matches) return;
    let current = window.pageYOffset;
    let target = current;
    let rafId = null;
    const ease = 0.12;
    const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

    function onWheel(ev) {
      ev.preventDefault();
      target += ev.deltaY;
      target = clamp(
        target,
        0,
        document.body.scrollHeight - window.innerHeight
      );
      if (!rafId) rafId = requestAnimationFrame(update);
    }
    function update() {
      current += (target - current) * ease;
      window.scrollTo(0, current);
      if (Math.abs(target - current) > 0.5) {
        rafId = requestAnimationFrame(update);
      } else {
        rafId = null;
      }
    }
    window.addEventListener('wheel', onWheel, { passive: false });
  })();
});