/**
 * JAHANATH R P - PORTFOLIO INTERACTIVITY SCRIPT
 * Vanilla JavaScript (ES6+)
 * Features: Typewriter, Canvas Ambient Particles, Scroll Reveal,
 * Animated Counters, Filterable Skills, Interactive Modals, Toast Alerts, Mobile Nav
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. TYPEWRITER EFFECT
     ========================================================================== */
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const roles = [
      'Full-Stack Developer',
      'Quantitative Finance Enthusiast',
      'Algorithmic Trading Explorer',
      'Competitive Programmer (600+ Solved)',
      'Problem Solver & CIT CSE Student'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 80;
    const deletingSpeed = 40;
    const pauseDelay = 2000;

    function typeStep() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let timeout = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentRole.length) {
        timeout = pauseDelay;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        timeout = 400;
      }

      setTimeout(typeStep, timeout);
    }

    typeStep();
  }

  /* ==========================================================================
     2. AMBIENT BACKGROUND PARTICLES CANVAS
     ========================================================================== */
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: width / 2, y: height / 2, radius: 120 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const particlesArray = [];
    const particleCount = Math.min(Math.floor((width * height) / 16000), 75);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.color = Math.random() > 0.5 ? 'rgba(168, 85, 247, 0.4)' : 'rgba(6, 182, 212, 0.4)';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce from walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction (subtle repel)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    function initParticles() {
      particlesArray.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle());
      }
    }

    function connectParticles() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.15;
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connectParticles();
      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
  }

  /* ==========================================================================
     3. CURSOR GLOW & CARD SPOTLIGHT EFFECT
     ========================================================================== */
  const cursorGlow = document.getElementById('cursor-glow');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Card spotlight tracking for glass cards
    const glassCards = document.querySelectorAll('.glass-panel');
    glassCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  function renderCursorGlow() {
    if (cursorGlow) {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;
    }
    requestAnimationFrame(renderCursorGlow);
  }
  renderCursorGlow();

  /* ==========================================================================
     4. NAVBAR SCROLL EFFECT & ACTIVE LINK TRACKING
     ========================================================================== */
  const headerNav = document.querySelector('.header-nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  function updateNavbar() {
    const scrollY = window.pageYOffset;

    // Scrolled class for header shadow & blur
    if (scrollY > 50) {
      headerNav?.classList.add('scrolled');
    } else {
      headerNav?.classList.remove('scrolled');
    }

    // Active Section Tracking
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // Back to top button visibility
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0.7';
      }
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ==========================================================================
     5. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu() {
    const isOpen = mobileDrawer.classList.contains('open');
    if (isOpen) {
      mobileDrawer.classList.remove('open');
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    } else {
      mobileDrawer.classList.add('open');
      mobileToggle.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileDrawer.classList.contains('open')) {
          toggleMobileMenu();
        }
      });
    });

    // Close on clicking outside
    document.addEventListener('click', (e) => {
      if (
        mobileDrawer.classList.contains('open') &&
        !mobileDrawer.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        toggleMobileMenu();
      }
    });
  }

  /* ==========================================================================
     6. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  /* ==========================================================================
     7. ANIMATED ACHIEVEMENT COUNTERS
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  function animateCounters() {
    statNumbers.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000;
      const startTime = performance.now();

      function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quadratic: 1 - (1 - p)^2
        const easeProgress = 1 - Math.pow(1 - progress, 2);
        const currentVal = Math.floor(easeProgress * target);

        counter.textContent = currentVal.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target.toLocaleString();
        }
      }

      requestAnimationFrame(updateCount);
    });
  }

  const achievementsSection = document.getElementById('achievements');
  if (achievementsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    statsObserver.observe(achievementsSection);
  }

  /* ==========================================================================
     8. SKILLS CATEGORY FILTERING
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          // Add quick fade-in
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ==========================================================================
     9. TOAST NOTIFICATION HELPER
     ========================================================================== */
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, type = 'success', duration = 3500) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconClass = 'fa-circle-check';
    if (type === 'info') iconClass = 'fa-circle-info';
    if (type === 'warning') iconClass = 'fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass} toast-icon"></i>
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 20);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  /* ==========================================================================
     10. COPY EMAIL TO CLIPBOARD
     ========================================================================== */
  const emailToCopy = 'Jahanath1913@gmail.com';
  const copyButtons = [
    document.getElementById('copy-email-btn'),
    document.getElementById('copy-email-quick')
  ];

  copyButtons.forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(emailToCopy).then(
        () => {
          showToast(`Copied ${emailToCopy} to clipboard!`, 'success');
          const originalText = btn.innerHTML;
          btn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 2000);
        },
        () => {
          showToast('Failed to copy. Please manually copy: ' + emailToCopy, 'warning');
        }
      );
    });
  });

  /* ==========================================================================
     11. MODAL MANAGEMENT (General, Project, Resume, Cert)
     ========================================================================== */
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModals = document.querySelectorAll('.modal.active');
      activeModals.forEach((m) => closeModal(m.id));
    }
  });

  // Attach backdrop and close button listeners for all modals
  ['project-modal', 'resume-modal', 'cert-modal'].forEach((modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const backdrop = modal.querySelector('.modal-backdrop');
    const closeBtn = modal.querySelector('.modal-close');

    backdrop?.addEventListener('click', () => closeModal(modalId));
    closeBtn?.addEventListener('click', () => closeModal(modalId));
  });

  /* ==========================================================================
     12. PROJECT DETAILS & DEMO MODALS
     ========================================================================== */
  const projectData = {
    echovault: {
      title: 'Echo Vault – Time-Locked Digital Journal',
      tagline: 'Cryptographic Privacy & Future Reflection Platform',
      image: 'assets/echo-vault.jpg',
      category: 'Web Security & Journaling System',
      description:
        'Echo Vault is a secure digital vault engineered to help individuals capture honest thoughts, personal memories, or future commitments without fear of immediate retrospection or tampering. Entries are locked behind algorithmic time gates powered by the JavaScript Date API and backed by Firebase Authentication and Firestore security rules.',
      features: [
        'Time-lock countdown mechanism calculated with millisecond precision via JavaScript Date API.',
        'Encrypted entry state prevention: locked entries remain unreadable until the designated unlock timestamp is reached.',
        'Firebase Authentication with secure token sessions and Firestore Cloud document storage.',
        'Cyber-aesthetic dark interface with interactive vault lock graphics and responsive audio-visual feedback.'
      ],
      stack: ['HTML5', 'CSS3', 'Vanilla JavaScript (ES6+)', 'Firebase Auth', 'Firestore Database'],
      github: 'https://github.com/jahanath-rp/echo-vault',
      demoNote:
        'Interactive Demo Flow: Type an entry, set an unlock countdown (e.g., 10 seconds for testing or 1 year for reflections), and observe the time-locking state.'
    },
    queuecure: {
      title: 'QueueCure – Clinic Queue & Appointment Management',
      tagline: 'Real-Time Healthcare Telemetry & Patient Flow Optimization',
      image: 'assets/queuecure.jpg',
      category: 'Full-Stack Web Application',
      description:
        'QueueCure modernizes clinic waiting rooms by replacing crowded physical queues with intelligent digital tokens, live status telemetry, and automated verification slips. The platform features strict role-based access control for patients, doctors, and clinic administrators.',
      features: [
        'Real-time queue tracking dashboard with instant token progression and estimated waiting times.',
        'Role-Based Access Control (RBAC): Patient portal, Doctor consultation board, and Clinic Admin master console.',
        'Automated appointment slip generation with instant printable PDF export.',
        'Unique QR code generation per booking for touchless check-in and reception scanning.'
      ],
      stack: ['Full-Stack Web Development', 'Node.js & Express', 'Real-Time Updates', 'PDF & QR Generation', 'Role-Based Auth'],
      github: 'https://github.com/jahanath-rp/queue-cure',
      demoNote:
        'Live Preview Flow: Book a test doctor slot, view your dynamic queue token badge, and generate your printable appointment pass with QR code.'
    }
  };

  const projectTriggers = document.querySelectorAll('.project-modal-trigger, .project-demo-btn');
  const projectModalContent = document.getElementById('modal-project-content');

  projectTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = btn.getAttribute('data-project');
      const data = projectData[projKey];
      if (!data || !projectModalContent) return;

      projectModalContent.innerHTML = `
        <div class="modal-header">
          <div class="status-pill"><i class="fa-solid fa-code-branch"></i> ${data.category}</div>
          <h3 class="modal-title" id="modal-project-title">${data.title}</h3>
          <p class="modal-subtitle">${data.tagline}</p>
        </div>

        <div class="project-modal-preview">
          <img src="${data.image}" alt="${data.title}" style="width: 100%; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1rem;">
        </div>

        <div class="project-modal-text">
          <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.2rem;">${data.description}</p>
          
          <h4 class="font-mono" style="font-size: 0.9rem; color: var(--accent-purple); margin-bottom: 0.6rem;">// Key Technical Features:</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.2rem;">
            ${data.features
              .map(
                (feat) =>
                  `<li style="font-size: 0.88rem; color: var(--text-muted); display: flex; gap: 0.6rem; align-items: baseline;"><i class="fa-solid fa-check" style="color: var(--accent-cyan); font-size: 0.8rem;"></i> ${feat}</li>`
              )
              .join('')}
          </ul>

          <h4 class="font-mono" style="font-size: 0.9rem; color: var(--accent-purple); margin-bottom: 0.6rem;">// Technologies:</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.2rem;">
            ${data.stack.map((s) => `<span class="tech-tag">${s}</span>`).join('')}
          </div>

          <div style="padding: 0.9rem 1.1rem; background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.25); border-radius: var(--radius-md); font-size: 0.85rem; color: var(--text-secondary);">
            <strong style="color: var(--accent-cyan);"><i class="fa-solid fa-lightbulb"></i> Note:</strong> ${data.demoNote}
          </div>
        </div>

        <div class="modal-footer">
          <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            <i class="fa-brands fa-github"></i> View GitHub Repo
          </a>
          <button class="btn btn-primary" id="launch-interactive-demo-btn">
            <i class="fa-solid fa-play"></i> Simulate Live Flow
          </button>
        </div>
      `;

      // Attach simulation button handler
      const launchDemoBtn = document.getElementById('launch-interactive-demo-btn');
      launchDemoBtn?.addEventListener('click', () => {
        showToast(`Launching ${data.title} simulation...`, 'info');
        setTimeout(() => {
          showToast('Live environment preview initialized successfully!', 'success');
        }, 1000);
      });

      openModal('project-modal');
    });
  });

  /* ==========================================================================
     13. RESUME MODAL & PRINT/DOWNLOAD
     ========================================================================== */
  const resumeBtn = document.getElementById('resume-btn');
  const printResumeBtn = document.getElementById('print-resume-btn');
  const downloadResumeFileBtn = document.getElementById('download-resume-file-btn');

  resumeBtn?.addEventListener('click', () => openModal('resume-modal'));

  printResumeBtn?.addEventListener('click', () => {
    window.print();
  });

  downloadResumeFileBtn?.addEventListener('click', () => {
    // Generate formatted CV markdown/text file
    const resumeText = `=======================================================
JAHANATH R P — CURRICULUM VITAE
Computer Science & Engineering | Chennai Institute of Technology
Email: Jahanath1913@gmail.com
LinkedIn: https://linkedin.com/in/jahanath-rp
GitHub: https://github.com/jahanath-rp
=======================================================

EDUCATION:
Chennai Institute of Technology, Chennai, India
Bachelor of Engineering (B.E.) in Computer Science and Engineering
Second Year (2025 - 2029 Expected)

CORE INTERESTS:
- Quantitative Finance & Algorithmic Trading Systems
- Full-Stack Web Development (Microservices, Real-Time Architecture)
- Data Structures & Algorithms

TECHNICAL SKILLS:
- Programming Languages: Python, C++, JavaScript, Java (Learning)
- Web Development: HTML5, CSS3, JavaScript (ES6+), NestJS, Express.js
- Databases: MongoDB, MySQL
- Tools: Git, GitHub, VS Code, Claude AI
- Core: DSA, Competitive Programming, Quantitative Research (WorldQuant BRAIN)
- Currently Learning: Machine Learning, Java Programming

PROJECTS:
1. Echo Vault – Time-Locked Digital Journal
   - Secure journaling web app with time-lock logic via JavaScript Date API.
   - Built with HTML, CSS, JavaScript, and Firebase Auth & Firestore.

2. QueueCure – Clinic Queue & Appointment Management System
   - Full-stack clinic queue system with real-time updates and RBAC.
   - Automated PDF and QR code generation for patient appointments.

ACHIEVEMENTS:
- 550+ LeetCode Problems Solved
- 100+ CodeChef Problems Solved
- 600+ Cumulative Competitive Programming Problems Solved
- WorldQuant BRAIN Bronze Medalist

CERTIFICATIONS:
- WorldQuant – Bronze Level
- EduSkills & AICTE – Palo Alto Cybersecurity Fundamentals
- Cisco Networking Academy & OpenEDG – Python Essentials 1 & 2
=======================================================`;

    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Jahanath_RP_Resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Resume downloaded successfully!', 'success');
  });

  /* ==========================================================================
     14. CERTIFICATE DETAIL MODALS
     ========================================================================== */
  const certData = {
    worldquant: {
      title: 'WorldQuant – Bronze Level',
      issuer: 'WorldQuant BRAIN Initiative',
      date: '2024',
      badgeClass: 'badge-bronze',
      icon: 'fa-medal',
      details:
        'Awarded to quantitative researchers on the WorldQuant BRAIN platform who design, test, and submit high-performing financial alphas. Demonstrates proficient understanding of mathematical modeling, financial time-series data, turnover control, and risk metrics (Sharpe ratio, Drawdown, and Fitness).',
      skills: ['Alpha Design', 'Financial Data Modeling', 'Backtesting', 'Quantitative Analytics', 'Signal Generation'],
      verificationUrl: 'https://brain.worldquant.com'
    },
    paloalto: {
      title: 'Palo Alto Cybersecurity Fundamentals',
      issuer: 'EduSkills Foundation & AICTE',
      date: '2024',
      badgeClass: 'badge-cyber',
      icon: 'fa-shield-virus',
      details:
        'Completed through the AICTE Virtual Internship program sponsored by Palo Alto Networks. Mastered foundational enterprise security principles including Zero-Trust security models, perimeter defenses, cloud security frameworks, endpoint protection, and automated threat intelligence.',
      skills: ['Cybersecurity Architecture', 'Network Security', 'Zero-Trust Frameworks', 'Threat Intelligence'],
      verificationUrl: 'https://eduskillsfoundation.org'
    },
    cisco: {
      title: 'Python Essentials 1 & 2',
      issuer: 'Cisco Networking Academy & OpenEDG Python Institute',
      date: '2024',
      badgeClass: 'badge-cisco',
      icon: 'fa-python',
      details:
        'Accredited certification covering end-to-end Python programming: control structures, list comprehensions, object-oriented programming (inheritance, polymorphism, encapsulation), generator functions, custom exceptions, and the Python Standard Library.',
      skills: ['Python 3', 'OOP Paradigm', 'Data Structures', 'Exception Handling', 'Package Management'],
      verificationUrl: 'https://www.netacad.com'
    }
  };

  const certButtons = document.querySelectorAll('.view-cert-btn');
  const certModalContent = document.getElementById('modal-cert-content');

  certButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const certKey = btn.getAttribute('data-cert');
      const data = certData[certKey];
      if (!data || !certModalContent) return;

      certModalContent.innerHTML = `
        <div class="modal-header">
          <div class="cert-badge-icon ${data.badgeClass}" style="margin-bottom: 0.8rem;">
            <i class="fa-solid ${data.icon}"></i>
          </div>
          <div class="status-pill"><i class="fa-solid fa-circle-check"></i> Verified Credential</div>
          <h3 class="modal-title" id="modal-cert-title">${data.title}</h3>
          <p class="modal-subtitle">Issued by <strong>${data.issuer}</strong> &bull; ${data.date}</p>
        </div>

        <div class="modal-cert-body">
          <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.2rem;">${data.details}</p>

          <h4 class="font-mono" style="font-size: 0.9rem; color: var(--accent-purple); margin-bottom: 0.6rem;">// Competencies Validated:</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
            ${data.skills.map((s) => `<span class="tech-tag">${s}</span>`).join('')}
          </div>
        </div>

        <div class="modal-footer">
          <a href="${data.verificationUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Official Platform
          </a>
        </div>
      `;

      openModal('cert-modal');
    });
  });

  /* ==========================================================================
     15. CONTACT FORM VALIDATION & TRANSPARENT EMAIL HANDLING
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function setError(elementId, errorMsg) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) errorEl.textContent = errorMsg;
  }

  function clearErrors() {
    setError('name-error', '');
    setError('email-error', '');
    setError('subject-error', '');
    setError('message-error', '');
  }

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    if (!name) {
      setError('name-error', 'Please enter your name.');
      isValid = false;
    }

    if (!email) {
      setError('email-error', 'Please enter your email address.');
      isValid = false;
    } else if (!validateEmail(email)) {
      setError('email-error', 'Please enter a valid email address.');
      isValid = false;
    }

    if (!subject) {
      setError('subject-error', 'Please enter a subject.');
      isValid = false;
    }

    if (!message) {
      setError('message-error', 'Please write your message.');
      isValid = false;
    } else if (message.length < 10) {
      setError('message-error', 'Message must be at least 10 characters.');
      isValid = false;
    }

    if (!isValid) return;

    // Per user requirement: Do NOT pretend that the contact form sends messages without a backend.
    // Instead, prepare a functional mailto link and provide an instant copy option with full feedback.
    const recipient = 'Jahanath1913@gmail.com';
    const encodedSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject}`);
    const encodedBody = encodeURIComponent(
      `Hello Jahanath,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n-- Sent via Portfolio Contact Form`
    );
    const mailtoUrl = `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;

    // Prompt user transparently
    showToast('Message formatted! Opening your email client...', 'info', 4000);

    // Open user's default email client
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 800);

    // Reset form after short delay
    setTimeout(() => {
      contactForm.reset();
      showToast('Thank you! If email did not open, reach me directly at ' + recipient, 'success', 5000);
    }, 2000);
  });

  /* ==========================================================================
     16. LOG CONSOLE WELCOME GREETING
     ========================================================================== */
  console.log(
    `%c Jahanath R P %c Developer Portfolio %c 2026 `,
    'background: #8b5cf6; color: #fff; font-weight: bold; border-radius: 4px 0 0 4px; padding: 4px 8px;',
    'background: #0e111a; color: #38bdf8; border-radius: 0; padding: 4px 8px;',
    'background: #10b981; color: #fff; border-radius: 0 4px 4px 0; padding: 4px 8px;'
  );
  console.log('Crafted with HTML5, CSS3, and Vanilla JavaScript.');
});
