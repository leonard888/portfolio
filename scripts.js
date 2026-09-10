/* ============================================================
   LEONARD LESMANA — Interactive CV
   Vanilla JS — Apple & Google I/O Keynote Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ——— 1. Keynote Typewriter Effect ———
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const roles = [
      'IT Helpdesk & Systems Administrator',
      'IT Service Desk Engineer',
      'Infrastructure & Cloud Specialist',
      'Process & IT Operations Optimizer'
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typeSpeed = 55;
    const deleteSpeed = 30;
    const pauseEnd = 2400;
    const pauseStart = 400;

    function type() {
      const currentRole = roles[roleIdx];

      if (!isDeleting) {
        typingEl.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === currentRole.length) {
          isDeleting = true;
          setTimeout(type, pauseEnd);
          return;
        }
        setTimeout(type, typeSpeed);
      } else {
        typingEl.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          setTimeout(type, pauseStart);
          return;
        }
        setTimeout(type, deleteSpeed);
      }
    }

    setTimeout(type, 800);
  }


  // ——— 2. Apple Frosted Navbar Scroll & Section Spy ———
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  function handleNavbar() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let activeId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        activeId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + activeId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleNavbar, { passive: true });
  handleNavbar();


  // ——— 3. Mobile Navigation Menu ———
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    function toggleMenu() {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', toggleMenu);

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }


  // ——— 4. Smooth Anchor Scrolling ———
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  // ——— 5. Scroll Reveal (Apple Ease-In) ———
  const revealItems = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealItems.forEach(item => revealObserver.observe(item));


  // ——— 6. Keynote Spec Counter Animation ———
  const specNumbers = document.querySelectorAll('.spec-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSpecNumber(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  specNumbers.forEach(num => counterObserver.observe(num));

  function animateSpecNumber(el) {
    const target = el.getAttribute('data-target');
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const numericVal = parseInt(target, 10);

    if (isNaN(numericVal)) {
      el.textContent = prefix + target + suffix;
      return;
    }

    const duration = 1400;
    const startTime = performance.now();

    function updateCounter(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Apple fluid cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(eased * numericVal);

      el.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = prefix + target + suffix;
      }
    }

    requestAnimationFrame(updateCounter);
  }


  // ——— 7. Milestone Expand / Collapse ———
  document.querySelectorAll('.milestone-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const milestone = btn.closest('.experience-milestone');
      const content = milestone.querySelector('.milestone-expand-content');
      const isOpen = content.classList.toggle('open');
      btn.classList.toggle('open', isOpen);

      const icon = btn.querySelector('i');
      if (isOpen) {
        btn.childNodes[0].nodeValue = 'Hide key achievements ';
      } else {
        btn.childNodes[0].nodeValue = 'View key achievements ';
      }
    });
  });


  // ——— 8. Apple Bento Spotlight Glow Effect (Hover) ———
  const bentoCards = document.querySelectorAll('.bento-card, .spec-callout, .experience-milestone');
  bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

});