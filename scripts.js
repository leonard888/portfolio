/* ============================================================
   LEONARD LESMANA — Interactive CV
   Vanilla JS — Apple & Google I/O Keynote Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ——— 0. Ultra-smooth Momentum Scrolling (Lenis) ———
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 0.95,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }


  // ——— 0.1. Apple Light / Dark Mode System (Inverted Monochrome Scheme) ———
  const themeToggleNavbar = document.getElementById('theme-toggle');
  const themeToggleDock = document.getElementById('doc-tabs-theme-toggle');
  const floatingThemeText = document.getElementById('floating-theme-text');
  const themeToggles = [themeToggleNavbar, themeToggleDock].filter(Boolean);

  let onCanvasThemeChange = null;

  function applyTheme(theme, save = true) {
    const isLight = theme === 'light';
    if (isLight) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    if (save) {
      localStorage.setItem('leonard-portfolio-theme', isLight ? 'light' : 'dark');
    }

    const titleText = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    themeToggles.forEach(btn => {
      btn.setAttribute('title', titleText);
      btn.setAttribute('aria-label', titleText);
      btn.setAttribute('data-tooltip', titleText);
    });

    if (floatingThemeText) {
      floatingThemeText.textContent = isLight ? 'Dark Mode' : 'Light Mode';
    }

    if (typeof onCanvasThemeChange === 'function') {
      onCanvasThemeChange(isLight);
    }
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme, true);
  }

  themeToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleTheme();
    });
  });

  // Sync initial button states
  const initialTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  applyTheme(initialTheme, false);


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


  // ——— 2. Apple Frosted Navbar Scroll & Section Spy + Floating Document Tabs ———
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  const docTabs = document.getElementById('doc-tabs');
  const docTabLinks = document.querySelectorAll('.doc-tab-link');
  const docTabsScrollTop = document.getElementById('doc-tabs-scroll-top');
  const docTabsToggle = document.getElementById('doc-tabs-toggle');
  const docTabsToggleIcon = document.getElementById('doc-tabs-toggle-icon');
  const aboutSection = document.getElementById('about');

  let isScrollTicking = false;

  // Pre-cached section coordinates (prevents layout thrashing reflows on scroll)
  let cachedSections = [];
  let cachedHeroThreshold = 180;

  function measureSections() {
    if (aboutSection) {
      cachedHeroThreshold = Math.max(120, aboutSection.offsetTop - 260);
    }
    cachedSections = Array.from(sections).map(sec => ({
      id: sec.getAttribute('id'),
      top: sec.offsetTop,
      bottom: sec.offsetTop + sec.offsetHeight
    }));
  }
  measureSections();
  window.addEventListener('resize', measureSections, { passive: true });

  function updateNavbar() {
    const scrollY = lenis ? lenis.scroll : (window.scrollY || window.pageYOffset);

    // 1. Subtle frosted background on top navbar
    if (scrollY > 30) {
      if (!navbar.classList.contains('scrolled')) navbar.classList.add('scrolled');
    } else {
      if (navbar.classList.contains('scrolled')) navbar.classList.remove('scrolled');
    }

    // 2. Dynamic transition: Hero shows top navbar; Section 2 (Overview) and down hides navbar & reveals Document Tabs
    const heroThreshold = cachedHeroThreshold;
    if (scrollY >= heroThreshold) {
      if (!navbar.classList.contains('nav-hidden')) navbar.classList.add('nav-hidden');
      if (docTabs && !docTabs.classList.contains('visible')) docTabs.classList.add('visible');
    } else {
      if (navbar.classList.contains('nav-hidden')) navbar.classList.remove('nav-hidden');
      if (docTabs && docTabs.classList.contains('visible')) docTabs.classList.remove('visible');
    }

    // 3. Section Spy using pre-cached coordinates
    let activeId = '';
    const scrollPos = scrollY + 220;

    for (let i = 0; i < cachedSections.length; i++) {
      const sec = cachedSections[i];
      if (scrollPos >= sec.top && scrollPos < sec.bottom) {
        activeId = sec.id;
        break;
      }
    }

    // Synchronize Top Navbar Links without redundant mutations
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === '#' + activeId;
      if (isActive && !link.classList.contains('active')) {
        link.classList.add('active');
      } else if (!isActive && link.classList.contains('active')) {
        link.classList.remove('active');
      }
    });

    // Synchronize Right Floating Document Tabs without redundant mutations
    docTabLinks.forEach(link => {
      const isActive = link.getAttribute('href') === '#' + activeId;
      if (isActive && !link.classList.contains('active')) {
        link.classList.add('active');
      } else if (!isActive && link.classList.contains('active')) {
        link.classList.remove('active');
      }
    });

    isScrollTicking = false;
  }

  // Document Tabs scroll-to-top trigger
  if (docTabsScrollTop) {
    docTabsScrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.0 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Collapse / Expand toggle button for Sections Dock
  if (docTabsToggle && docTabs) {
    docTabsToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isCollapsed = docTabs.classList.toggle('collapsed');
      if (docTabsToggleIcon) {
        docTabsToggleIcon.className = isCollapsed ? 'fa-solid fa-chevron-left' : 'fa-solid fa-chevron-right';
      }
      docTabsToggle.setAttribute('title', isCollapsed ? 'Expand Sections' : 'Hide / Collapse');
      docTabsToggle.setAttribute('aria-label', isCollapsed ? 'Expand Sections' : 'Hide / Collapse');
    });
  }

  // Auto-collapse on viewports < 1360px to ensure generous text breathing space
  if (window.innerWidth < 1360 && docTabs) {
    docTabs.classList.add('collapsed');
    if (docTabsToggleIcon) {
      docTabsToggleIcon.className = 'fa-solid fa-chevron-left';
    }
  }

  function handleNavbar() {
    if (!isScrollTicking) {
      requestAnimationFrame(updateNavbar);
      isScrollTicking = true;
    }
  }

  if (lenis) {
    lenis.on('scroll', handleNavbar);
  } else {
    window.addEventListener('scroll', handleNavbar, { passive: true });
  }
  updateNavbar();


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
      if (!targetId || targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        if (lenis) {
          const isNavHidden = navbar && navbar.classList.contains('nav-hidden');
          lenis.scrollTo(targetElement, { offset: isNavHidden ? -35 : -65 });
        } else {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
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
    threshold: 0.05,
    rootMargin: '0px 0px -25px 0px'
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


  // ——— 7. Central Guide Line Node Activation ———
  const guideNodes = document.querySelectorAll('.guide-node');
  if (guideNodes.length > 0) {
    const nodeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.5 });

    guideNodes.forEach(node => nodeObserver.observe(node));
  }


  // ——— 8. Interactive Cursor Grid / Dot Field Canvas (GPU Optimized & Battery Friendly) ———
  const canvas = document.getElementById('cursor-grid-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;

    const spacing = 32;
    const hoverRadius = 160;
    const targetMouse = { x: -1000, y: -1000 };
    const mouse = { x: -1000, y: -1000 };
    const ripples = [];

    let isLooping = false;
    let idleCounter = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      // Cap DPR to 1.5 to save 44% pixel fillrate while maintaining Retina sharpness
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawStatic();
      wakeLoop();
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    function wakeLoop() {
      idleCounter = 0;
      if (!isLooping) {
        isLooping = true;
        requestAnimationFrame(draw);
      }
    }

    window.addEventListener('pointermove', (e) => {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
      wakeLoop();
    }, { passive: true });

    window.addEventListener('pointerleave', () => {
      targetMouse.x = -1000;
      targetMouse.y = -1000;
      wakeLoop();
    });

    window.addEventListener('pointerdown', (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 260,
        speed: 8
      });
      wakeLoop();
    }, { passive: true });

    onCanvasThemeChange = () => {
      drawStatic();
      wakeLoop();
    };

    function drawStatic() {
      ctx.clearRect(0, 0, width, height);
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const offsetX = (width % spacing) / 2;
      const offsetY = (height % spacing) / 2;
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      ctx.beginPath();
      for (let col = 0; col < cols; col++) {
        const x = offsetX + col * spacing;
        for (let row = 0; row < rows; row++) {
          const y = offsetY + row * spacing;
          ctx.moveTo(x + 0.95, y);
          ctx.arc(x, y, 0.95, 0, Math.PI * 2);
        }
      }
      ctx.fillStyle = isLight ? 'rgba(90, 95, 110, 0.085)' : 'rgba(165, 170, 185, 0.035)';
      ctx.fill();
    }

    function draw() {
      // Smooth mouse interpolation (LERP)
      const dx = targetMouse.x - mouse.x;
      const dy = targetMouse.y - mouse.y;
      mouse.x += dx * 0.16;
      mouse.y += dy * 0.16;

      ctx.clearRect(0, 0, width, height);

      // Update active click ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        if (r.radius > r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const offsetX = (width % spacing) / 2;
      const offsetY = (height % spacing) / 2;

      const hasMouse = mouse.x > -200 && mouse.y > -200;
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      // 1. Grid connecting lines (drawn only within hover bounding box)
      if (hasMouse) {
        ctx.beginPath();
        const minX = Math.max(0, mouse.x - hoverRadius);
        const maxX = Math.min(width, mouse.x + hoverRadius);
        const minY = Math.max(0, mouse.y - hoverRadius);
        const maxY = Math.min(height, mouse.y + hoverRadius);

        const startCol = Math.max(0, Math.floor((minX - offsetX) / spacing));
        const endCol = Math.min(cols - 1, Math.ceil((maxX - offsetX) / spacing));
        for (let c = startCol; c <= endCol; c++) {
          const x = offsetX + c * spacing;
          const dist = Math.abs(x - mouse.x);
          if (dist < hoverRadius) {
            const alpha = (1 - dist / hoverRadius) * (isLight ? 0.055 : 0.035);
            ctx.strokeStyle = isLight ? `rgba(90, 95, 110, ${alpha})` : `rgba(165, 170, 185, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(x, minY);
            ctx.lineTo(x, maxY);
          }
        }

        const startRow = Math.max(0, Math.floor((minY - offsetY) / spacing));
        const endRow = Math.min(rows - 1, Math.ceil((maxY - offsetY) / spacing));
        for (let r = startRow; r <= endRow; r++) {
          const y = offsetY + r * spacing;
          const dist = Math.abs(y - mouse.y);
          if (dist < hoverRadius) {
            const alpha = (1 - dist / hoverRadius) * (isLight ? 0.055 : 0.035);
            ctx.strokeStyle = isLight ? `rgba(90, 95, 110, ${alpha})` : `rgba(165, 170, 185, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(minX, y);
            ctx.lineTo(maxX, y);
          }
        }
        ctx.stroke();
      }

      // 2. Batch ALL resting dots in ONE SINGLE draw call
      ctx.beginPath();
      for (let col = 0; col < cols; col++) {
        const x = offsetX + col * spacing;
        for (let row = 0; row < rows; row++) {
          const y = offsetY + row * spacing;
          // Skip dots near mouse (they will be rendered in active pass)
          if (hasMouse && Math.abs(x - mouse.x) < hoverRadius && Math.abs(y - mouse.y) < hoverRadius) {
            continue;
          }
          ctx.moveTo(x + 0.95, y);
          ctx.arc(x, y, 0.95, 0, Math.PI * 2);
        }
      }
      ctx.fillStyle = isLight ? 'rgba(90, 95, 110, 0.085)' : 'rgba(165, 170, 185, 0.035)';
      ctx.fill();

      // 3. Render ONLY active dots near mouse or ripples (typically < 30 dots!)
      if (hasMouse || ripples.length > 0) {
        const minC = hasMouse ? Math.max(0, Math.floor((mouse.x - hoverRadius - offsetX) / spacing)) : 0;
        const maxC = hasMouse ? Math.min(cols - 1, Math.ceil((mouse.x + hoverRadius - offsetX) / spacing)) : cols - 1;
        const minR = hasMouse ? Math.max(0, Math.floor((mouse.y - hoverRadius - offsetY) / spacing)) : 0;
        const maxR = hasMouse ? Math.min(rows - 1, Math.ceil((mouse.y + hoverRadius - offsetY) / spacing)) : rows - 1;

        for (let col = minC; col <= maxC; col++) {
          const baseDotX = offsetX + col * spacing;
          for (let row = minR; row <= maxR; row++) {
            const baseDotY = offsetY + row * spacing;

            let dotX = baseDotX;
            let dotY = baseDotY;
            let radius = 0.95;
            let alpha = 0.035;

            if (hasMouse) {
              const dX = dotX - mouse.x;
              const dY = dotY - mouse.y;
              const dist = Math.hypot(dX, dY);
              if (dist < hoverRadius) {
                const factor = 1 - dist / hoverRadius;
                const easeFactor = factor * factor;
                const push = easeFactor * 4;
                if (dist > 0.001) {
                  dotX += (dX / dist) * push;
                  dotY += (dY / dist) * push;
                }
                radius += easeFactor * 0.75;
                alpha += easeFactor * 0.18;
              }
            }

            for (let i = 0; i < ripples.length; i++) {
              const rip = ripples[i];
              const rDist = Math.hypot(baseDotX - rip.x, baseDotY - rip.y);
              const waveDist = Math.abs(rDist - rip.radius);
              if (waveDist < 35) {
                const strength = (1 - waveDist / 35) * (1 - rip.radius / rip.maxRadius);
                radius += strength * 0.8;
                alpha += strength * 0.15;
              }
            }

            ctx.beginPath();
            ctx.arc(dotX, dotY, radius, 0, Math.PI * 2);
            ctx.fillStyle = isLight 
              ? `rgba(50, 55, 70, ${Math.min(alpha * 1.5, 0.32)})` 
              : `rgba(165, 170, 185, ${Math.min(alpha, 0.28)})`;
            ctx.fill();
          }
        }
      }

      // Check if animation has settled to sleep the loop (saves 100% CPU/GPU on scroll)
      const isMouseSettled = Math.hypot(dx, dy) < 0.2;
      if (isMouseSettled && ripples.length === 0) {
        idleCounter++;
        if (idleCounter > 6) {
          isLooping = false;
          return; // Sleep until user moves pointer!
        }
      } else {
        idleCounter = 0;
      }

      requestAnimationFrame(draw);
    }
  }

});