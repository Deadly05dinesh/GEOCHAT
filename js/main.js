/* ============================================
   GEOCHAT SOLUTIONS — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ── Mobile menu ──
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu .nav-link');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Smooth scroll with offset for fixed navbar ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 126;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });

        // Close mobile menu if open
        hamburger?.classList.remove('active');
        mobileMenu?.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // ── Navbar scroll effect ──
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ── Active nav highlighting ──
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(l => l.classList.remove('active'));
        document.querySelectorAll(`.nav-link[href="#${id}"]`).forEach(l => l.classList.add('active'));
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav);

  // ── Scroll reveal ──
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  // ── Stats counter animation ──
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        statNumbers.forEach(num => animateCounter(num));
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats');
  if (statsSection) statsObserver.observe(statsSection);

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(update);
  }

  // ── Training Modules Accordion ──
  const moduleHeaders = document.querySelectorAll('.module-header');
  moduleHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.module-body');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.module-item.active').forEach(active => {
        active.classList.remove('active');
        active.querySelector('.module-body').style.maxHeight = '0';
      });

      // Open clicked (if was closed)
      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // ── Contact form validation ──
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.querySelector('.form-success');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Clear errors
    contactForm.querySelectorAll('.form-error').forEach(err => err.style.display = 'none');
    contactForm.querySelectorAll('input, textarea').forEach(inp => inp.classList.remove('error'));

    // Validate name
    const name = contactForm.querySelector('#name');
    if (!name.value.trim()) {
      showError(name, 'Please enter your name');
      valid = false;
    }

    // Validate email
    const email = contactForm.querySelector('#email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      showError(email, 'Please enter your email');
      valid = false;
    } else if (!emailRegex.test(email.value)) {
      showError(email, 'Please enter a valid email');
      valid = false;
    }

    // Validate message
    const message = contactForm.querySelector('#message');
    if (!message.value.trim()) {
      showError(message, 'Please enter your message');
      valid = false;
    }

    if (valid) {
      contactForm.style.display = 'none';
      formSuccess.style.display = 'flex';
      formSuccess.style.flexDirection = 'column';
      formSuccess.style.alignItems = 'center';
    }
  });

  function showError(input, msg) {
    input.classList.add('error');
    const error = input.parentElement.querySelector('.form-error');
    if (error) {
      error.textContent = msg;
      error.style.display = 'block';
    }
  }

  // ── Scroll to top button ──
  const scrollTopBtn = document.querySelector('.scroll-top');
  window.addEventListener('scroll', () => {
    scrollTopBtn?.classList.toggle('show', window.scrollY > 500);
  });
  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Industry Detail Modal ──
  const industryData = {
    telecom: {
      title: 'Telecom',
      icon: 'radio-tower',
      color: '#60a5fa',
      bg: 'rgba(96, 165, 250, 0.1)',
      description: 'GEOCHAT provides advanced geospatial services for the telecom sector, supporting tower installation planning, coverage analysis, and network optimization through drone surveys and GIS mapping. We ensure efficient infrastructure deployment across both urban and rural networks.',
      capabilities: ['Tower site surveys & selection', 'Coverage & gap analysis', 'Fiber route planning', 'RF propagation modeling', 'Network infrastructure mapping', 'As-built documentation']
    },
    power: {
      title: 'Power & Utilities',
      icon: 'zap',
      color: '#fbbf24',
      bg: 'rgba(251, 191, 36, 0.1)',
      description: 'We provide comprehensive drone-based and GIS solutions for power generation and distribution networks, including transmission line surveys, substation mapping, and vegetation encroachment monitoring to prevent outages and ensure grid reliability.',
      capabilities: ['Transmission line inspection', 'Substation mapping', 'Vegetation management', 'Right-of-way surveys', 'Thermal anomaly detection', 'Asset condition assessment']
    },
    mining: {
      title: 'Mining',
      icon: 'pickaxe',
      color: '#a78bfa',
      bg: 'rgba(167, 139, 250, 0.1)',
      description: 'Our mining solutions include volumetric calculations, pit progress monitoring, haul road analysis, and stockpile management using advanced drone photogrammetry and LiDAR scanning for accurate 3D terrain models and cut-fill computations.',
      capabilities: ['Volumetric surveys', 'Pit progress monitoring', 'Stockpile management', 'Haul road optimization', 'LiDAR 3D terrain modeling', 'Cut-fill analysis']
    },
    urban: {
      title: 'Urban Planning',
      icon: 'building-2',
      color: '#00d9ff',
      bg: 'rgba(0, 217, 255, 0.1)',
      description: 'GEOCHAT supports smart city initiatives and urban development projects with high-resolution aerial mapping, land use analysis, building footprint extraction, and 3D urban modeling for master planning, zoning, and infrastructure development.',
      capabilities: ['High-resolution aerial mapping', 'Land use classification', 'Building footprint extraction', '3D city modeling', 'Master plan support', 'Infrastructure analysis']
    },
    oil: {
      title: 'Oil & Gas',
      icon: 'flame',
      color: '#f97316',
      bg: 'rgba(249, 115, 22, 0.1)',
      description: 'We offer pipeline route surveys, facility mapping, environmental impact assessments, and remote monitoring dashboards for oil and gas operations. Our drone surveys help ensure regulatory compliance and reduce field inspection risks.',
      capabilities: ['Pipeline route surveys', 'Facility mapping', 'Environmental impact assessment', 'Leak detection support', 'Regulatory compliance', 'Remote monitoring dashboards']
    },
    logistics: {
      title: 'Logistics & Transportation',
      icon: 'truck',
      color: '#00ff88',
      bg: 'rgba(0, 255, 136, 0.1)',
      description: 'Our geospatial expertise supports logistics networks through route optimization, fleet tracking integration, warehouse site selection, and transportation corridor analysis using real-time GIS data and spatial analytics.',
      capabilities: ['Route optimization', 'Fleet tracking integration', 'Warehouse site selection', 'Corridor analysis', 'Traffic pattern analysis', 'Last-mile delivery mapping']
    },
    agriculture: {
      title: 'Agriculture',
      icon: 'sprout',
      color: '#22c55e',
      bg: 'rgba(34, 197, 94, 0.1)',
      description: 'We empower precision agriculture with drone-based crop health monitoring (NDVI), soil analysis, irrigation planning, and yield estimation. Our GIS platforms help farmers and agri-businesses make data-driven decisions for sustainable farming.',
      capabilities: ['NDVI crop health monitoring', 'Soil analysis mapping', 'Irrigation planning', 'Yield estimation', 'Farm boundary mapping', 'Precision agriculture analytics']
    },
    disaster: {
      title: 'Disaster Management',
      icon: 'alert-triangle',
      color: '#f87171',
      bg: 'rgba(248, 113, 113, 0.1)',
      description: 'We provide advanced geospatial intelligence to support disaster preparedness, response, and recovery. Our expertise includes flood modeling, hazard mapping, damage assessment, and emergency response coordination using real-time spatial data.',
      capabilities: ['Flood modeling & simulation', 'Hazard zone mapping', 'Damage assessment surveys', 'Emergency response mapping', 'Evacuation route planning', 'Post-disaster reconstruction']
    }
  };

  const modal = document.getElementById('industryModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalCapabilities = document.getElementById('modalCapabilities');
  const modalIcon = document.getElementById('modalIcon');
  const modalClose = modal?.querySelector('.modal-close');
  const modalCta = modal?.querySelector('.modal-cta');

  function openModal(industry) {
    const data = industryData[industry];
    if (!data || !modal) return;

    modalTitle.textContent = data.title;
    modalDescription.textContent = data.description;
    modalIcon.style.background = data.bg;
    modalIcon.innerHTML = `<i data-lucide="${data.icon}" style="color:${data.color}"></i>`;
    modalCapabilities.innerHTML = data.capabilities.map(c => `<li>${c}</li>`).join('');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Re-render Lucide icons inside modal
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Make the full industry card clickable (including "Learn more")
  document.querySelectorAll('.industry-card').forEach(card => {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');

    const triggerCardPulse = () => {
      card.classList.remove('modal-open-pulse');
      void card.offsetWidth;
      card.classList.add('modal-open-pulse');
    };

    const openCardModal = () => {
      const industry = card.getAttribute('data-industry');
      if (!industry) return;
      triggerCardPulse();
      openModal(industry);
    };

    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-link')) e.preventDefault();
      openCardModal();
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCardModal();
      }
    });

    card.addEventListener('animationend', () => {
      card.classList.remove('modal-open-pulse');
    });
  });

  // Close modal
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Close modal when CTA is clicked (it scrolls to contact)
  modalCta?.addEventListener('click', () => {
    closeModal();
  });
});
