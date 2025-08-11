// IntersectionObserver logic for sticky index and active section highlighting
document.addEventListener('DOMContentLoaded', () => {
  const indexNav = document.querySelector('.side-index');
  const footer = document.querySelector('footer');
  const eligibilitySection = document.getElementById('eligibility');
  const sections = document.querySelectorAll('main section');
  const navLinks = document.querySelectorAll('.side-index a');

  // Observer to toggle the visibility of the side index when the eligibility section enters/exits the viewport
  const showObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          indexNav.classList.add('show');
        } else {
          indexNav.classList.remove('show');
        }
      });
    },
    {
      threshold: 0,
    },
  );

  if (eligibilitySection) {
    showObserver.observe(eligibilitySection);
  }

  // Observer to hide the side index when the footer becomes visible
  const hideObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          indexNav.classList.remove('show');
        }
      });
    },
    {
      threshold: 0,
    },
  );
  hideObserver.observe(footer);

  // Observer to highlight the active section in the side index
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    {
      threshold: 0.6,
    },
  );
  sections.forEach((section) => {
    if (section.id && section.id !== 'hero') {
      sectionObserver.observe(section);
    }
  });

  // Smooth scrolling for index links
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
});
