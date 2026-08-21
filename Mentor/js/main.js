/* ==================================================================
   SKILLIANT - GLOBAL MAIN JAVASCRIPT
   ================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Drawer Toggle
  const menuBtn = document.querySelector('.menu-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');

  if (menuBtn && mobileDrawer && drawerOverlay) {
    const toggleMenu = () => {
      mobileDrawer.classList.toggle('active');
      drawerOverlay.classList.toggle('active');
    };

    menuBtn.addEventListener('click', toggleMenu);
    drawerOverlay.addEventListener('click', toggleMenu);
  }

  // Button Ripple Effect
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const radius = diameter / 2;

      const rect = this.getBoundingClientRect();
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');

      const existingRipple = this.querySelector('.ripple');
      if (existingRipple) existingRipple.remove();

      this.appendChild(circle);
    });
  });

  // Animated Counter Effect
  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = +counter.getAttribute('data-target');
          let count = 0;
          const increment = target / 50;

          const updateCount = () => {
            count += increment;
            if (count < target) {
              counter.innerText = Math.ceil(count).toLocaleString();
              setTimeout(updateCount, 30);
            } else {
              counter.innerText = target.toLocaleString();
            }
          };

          updateCount();
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  // Accordion Logic for FAQ Page & Sections
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
});
