/**
 * SKILLIANT - Core JavaScript Application & Authentication Engine
 * Production SaaS Frontend - Vanilla ES6+
 * Version: 2.0.0
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAuthSession();
  initNavigation();
  initAuthNavigation();
  initAccountModal();
  initCounters();
  initAccordions();
  initPasswordToggles();
  initPasswordStrength();
  initOtpInputs();
  initPricingToggle();
  initModals();
  initForms();
  initLabourSearch();
  initBlogFilter();
  initRoleSelectors();
  initSuccessPage();
});

/* ==========================================================================
   1. REALISTIC DATASETS
   ========================================================================== */

const WORKERS_DATA = [
  {
    id: 1,
    name: "Marcus Vance",
    profession: "Master Electrician",
    category: "electrician",
    rating: 4.9,
    reviews: 142,
    location: "Downtown / Metro",
    experience: "8+ years",
    rate: "$45",
    rateUnit: "/hr",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Licensed master electrician specializing in residential wiring, EV charger installation, circuit breaker upgrades, and smart home automation.",
    verified: true,
    available: true,
    badges: ["Top Rated", "EV Certified"]
  },
  {
    id: 2,
    name: "David Rodriguez",
    profession: "Certified Plumber",
    category: "plumber",
    rating: 4.8,
    reviews: 98,
    location: "North Suburbs",
    experience: "10+ years",
    rate: "$50",
    rateUnit: "/hr",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "Emergency plumbing, pipe repair, tankless water heater installation, and complete bathroom fixture renovations.",
    verified: true,
    available: true,
    badges: ["24/7 Emergency", "Licensed"]
  },
  {
    id: 3,
    name: "Elena Rostova",
    profession: "Custom Carpenter",
    category: "carpenter",
    rating: 5.0,
    reviews: 84,
    location: "West Valley",
    experience: "7+ years",
    rate: "$42",
    rateUnit: "/hr",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    bio: "Expert bespoke cabinetry, custom wooden shelving, furniture restoration, and structural framing. Detail-oriented craftsman.",
    verified: true,
    available: true,
    badges: ["Master Craftsman"]
  },
  {
    id: 4,
    name: "James Wilson",
    profession: "HVAC & AC Technician",
    category: "ac-technician",
    rating: 4.9,
    reviews: 116,
    location: "Downtown / Metro",
    experience: "9+ years",
    rate: "$55",
    rateUnit: "/hr",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bio: "Certified HVAC specialist for AC repairs, central heating systems, duct cleaning, and smart thermostat calibration.",
    verified: true,
    available: true,
    badges: ["EPA Certified", "Fast Response"]
  },
  {
    id: 5,
    name: "Carlos Mendez",
    profession: "Interior & Exterior Painter",
    category: "painter",
    rating: 4.7,
    reviews: 73,
    location: "East Heights",
    experience: "6+ years",
    rate: "$38",
    rateUnit: "/hr",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    bio: "High quality interior painting, drywall patching, exterior weather-resistant coatings, and stain finishing.",
    verified: true,
    available: true,
    badges: ["Eco-Friendly Paints"]
  },
  {
    id: 6,
    name: "Sarah Jenkins",
    profession: "Deep Cleaning Specialist",
    category: "cleaner",
    rating: 4.9,
    reviews: 210,
    location: "Downtown / Metro",
    experience: "5+ years",
    rate: "$30",
    rateUnit: "/hr",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    bio: "Residential deep cleaning, post-construction cleanup, move-in/move-out sanitize services with eco-certified supplies.",
    verified: true,
    available: true,
    badges: ["Background Checked", "Top Rated"]
  },
  {
    id: 7,
    name: "Michael Chang",
    profession: "Mobile Auto Mechanic",
    category: "mechanic",
    rating: 4.8,
    reviews: 65,
    location: "South Bay",
    experience: "11+ years",
    rate: "$60",
    rateUnit: "/hr",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    bio: "ASE certified mechanic. Diagnostic scanning, brake replacements, alternator repairs, and on-site vehicle inspections.",
    verified: true,
    available: true,
    badges: ["ASE Certified", "Mobile Shop"]
  },
  {
    id: 8,
    name: "Liam O'Connor",
    profession: "Mason & Bricklayer",
    category: "mason",
    rating: 4.9,
    reviews: 47,
    location: "North Suburbs",
    experience: "12+ years",
    rate: "$48",
    rateUnit: "/hr",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    bio: "Stone masonry, retaining wall construction, patio paving, chimney tuckpointing, and structural concrete repair.",
    verified: true,
    available: true,
    badges: ["Licensed Mason"]
  },
  {
    id: 9,
    name: "Amina Al-Mansoor",
    profession: "Landscape & Garden Pro",
    category: "gardener",
    rating: 4.9,
    reviews: 89,
    location: "West Valley",
    experience: "6+ years",
    rate: "$35",
    rateUnit: "/hr",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80",
    bio: "Lawn care, drip irrigation design, seasonal pruning, garden bed planting, and sustainable yard design.",
    verified: true,
    available: true,
    badges: ["Horticulture Certified"]
  },
  {
    id: 10,
    name: "Priya Sharma",
    profession: "Beautician & Grooming Pro",
    category: "beautician",
    rating: 4.9,
    reviews: 132,
    location: "Downtown / Metro",
    experience: "7+ years",
    rate: "$40",
    rateUnit: "/hr",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    bio: "On-demand salon stylist, bridal makeup artist, grooming, skincare treatments, and certified cosmetology specialist.",
    verified: true,
    available: true,
    badges: ["Certified Stylist", "Top Rated"]
  }
];

const BLOG_DATA = [
  {
    id: 1,
    title: "10 Essential Safety Checks Before Hiring a Home Electrician",
    category: "safety",
    date: "Aug 18, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80",
    snippet: "Ensure your contractor carries active liability insurance, state licenses, and follows NEC codes to protect your family and investment.",
    author: "Skilliant Safety Council"
  },
  {
    id: 2,
    title: "Preventing Costly Plumbing Emergencies: A Seasonal Guide",
    category: "home-maintenance",
    date: "Aug 12, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80",
    snippet: "From pipe insulation to water pressure regulators, learn the key steps to safeguard your home against burst pipes and leaks.",
    author: "David Rodriguez, Plumber Pro"
  },
  {
    id: 3,
    title: "How to Accurately Estimate Custom Carpentry Projects in 2026",
    category: "hiring-tips",
    date: "Aug 05, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=80",
    snippet: "Understanding material grades, labor hours, and milestone payments when planning bespoke cabinets and renovations.",
    author: "Elena Rostova"
  },
  {
    id: 4,
    title: "The Ultimate Guide to HVAC Efficiency: Lowering Your Utility Bills",
    category: "home-maintenance",
    date: "Jul 29, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80",
    snippet: "Simple filter replacements and annual compressor tune-ups can save up to 25% on summer cooling bills.",
    author: "James Wilson, HVAC Tech"
  },
  {
    id: 5,
    title: "Freelancing as a Skilled Tradesperson: Building Reputation & Trust",
    category: "career",
    date: "Jul 20, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80",
    snippet: "How independent contractors can leverage direct verified reviews, transparent quotes, and quick replies to build a 6-figure trade business.",
    author: "Skilliant Pro Network"
  },
  {
    id: 6,
    title: "Eco-Friendly Paint Choices: Low-VOC Benefits for Indoor Air Quality",
    category: "safety",
    date: "Jul 15, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=80",
    snippet: "Discover why modern zero-VOC formulations match the durability of traditional paints while protecting indoor breathability.",
    author: "Carlos Mendez"
  }
];

/* ==========================================================================
   2. AUTHENTICATION & SESSION ENGINE
   ========================================================================== */

const DEFAULT_USERS = [
  {
    name: "Alex Morgan",
    email: "alex@example.com",
    password: "Password123!",
    phone: "+1 (555) 019-2834",
    role: "customer",
    joinedDate: "August 2026",
    bookingsCount: 2
  },
  {
    name: "Marcus Vance",
    email: "marcus@skilliant.com",
    password: "Password123!",
    phone: "+1 (555) 014-9988",
    role: "worker",
    profession: "Master Electrician",
    joinedDate: "June 2025",
    bookingsCount: 142
  }
];

function initAuthSession() {
  if (!localStorage.getItem('skilliant_users')) {
    localStorage.setItem('skilliant_users', JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem('skilliant_bookings')) {
    const defaultBookings = [
      {
        id: "BK-84920",
        workerName: "Marcus Vance",
        workerProfession: "Master Electrician",
        date: "2026-08-28",
        hours: "4",
        status: "Escrow Protected",
        rate: "$45/hr",
        total: "$180.00"
      }
    ];
    localStorage.setItem('skilliant_bookings', JSON.stringify(defaultBookings));
  }
}

function getAuthSession() {
  try {
    const data = localStorage.getItem('skilliant_auth');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

function setAuthSession(user) {
  const session = {
    isLoggedIn: true,
    user: user,
    token: 'sk_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36),
    loginTime: new Date().toISOString()
  };
  localStorage.setItem('skilliant_auth', JSON.stringify(session));
  return session;
}

function clearAuthSession() {
  localStorage.removeItem('skilliant_auth');
}

function initAuthNavigation() {
  const navActions = document.querySelector('.nav-actions');
  if (!navActions) return;

  const session = getAuthSession();
  const themeBtn = navActions.querySelector('.theme-toggle');
  const mobileBtn = navActions.querySelector('.mobile-toggle');

  if (session && session.isLoggedIn && session.user) {
    const u = session.user;
    const initials = u.name ? u.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'SK';

    let profileHtml = `
      <div class="user-nav-profile" id="userNavProfile" role="button" tabindex="0" aria-label="Open User Account">
        <div class="user-avatar-badge">${initials}</div>
        <span style="max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${u.name.split(' ')[0]}</span>
        <span class="user-role-pill">${u.role}</span>
      </div>
      <button type="button" class="btn btn-outline btn-sm" id="logoutNavBtn">Log Out</button>
    `;

    // Retain theme button & mobile toggle
    navActions.querySelectorAll('.btn, .user-nav-profile').forEach(el => el.remove());
    if (themeBtn) {
      themeBtn.insertAdjacentHTML('afterend', profileHtml);
    } else {
      navActions.insertAdjacentHTML('afterbegin', profileHtml);
    }

    const profileEl = document.getElementById('userNavProfile');
    if (profileEl) {
      profileEl.addEventListener('click', openAccountModal);
      profileEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openAccountModal();
        }
      });
    }

    const logoutBtn = document.getElementById('logoutNavBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        clearAuthSession();
        showToast('You have been logged out successfully', 'info');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      });
    }
  }
}

/* ==========================================================================
   3. USER ACCOUNT DASHBOARD MODAL
   ========================================================================== */

function initAccountModal() {
  if (document.getElementById('accountModal')) return;

  const modalHtml = `
    <div class="modal-backdrop" id="accountModal" aria-hidden="true" role="dialog">
      <div class="modal-content" style="max-width: 580px;">
        <button class="modal-close-btn" aria-label="Close Account Modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div class="account-card-header">
          <div class="account-avatar-large" id="accAvatarLarge">AM</div>
          <div>
            <h3 id="accName" style="margin-bottom: 0.15rem;">User Name</h3>
            <p id="accEmail" style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0.35rem;">user@example.com</p>
            <span class="badge badge-primary" id="accRoleBadge">Customer</span>
          </div>
        </div>

        <div class="account-stat-grid">
          <div class="account-stat-box">
            <span class="number" id="accBookingsCount">1</span>
            <span class="label">Active Trade Bookings</span>
          </div>
          <div class="account-stat-box">
            <span class="number" style="color: var(--accent-green);" id="accEscrowStatus">$10,000</span>
            <span class="label">Escrow Guarantee Protected</span>
          </div>
        </div>

        <h4 style="font-size: 1.05rem; margin-bottom: 0.75rem;">Your Scheduled Services</h4>
        <div id="accBookingsList" style="margin-bottom: 1.75rem; max-height: 180px; overflow-y: auto;">
          <!-- Bookings injected here -->
        </div>

        <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
          <button type="button" class="btn btn-outline" onclick="closeModal('accountModal')">Close</button>
          <button type="button" class="btn btn-primary" onclick="window.location.href='services.html'">Find More Workers</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function openAccountModal() {
  const session = getAuthSession();
  if (!session || !session.user) {
    window.location.href = 'login.html';
    return;
  }

  const u = session.user;
  const modal = document.getElementById('accountModal');
  if (!modal) return;

  const initials = u.name ? u.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'SK';
  const avatarLarge = modal.querySelector('#accAvatarLarge');
  const nameEl = modal.querySelector('#accName');
  const emailEl = modal.querySelector('#accEmail');
  const roleBadge = modal.querySelector('#accRoleBadge');
  const bookingsList = modal.querySelector('#accBookingsList');

  if (avatarLarge) avatarLarge.textContent = initials;
  if (nameEl) nameEl.textContent = u.name;
  if (emailEl) emailEl.textContent = `${u.email} â€¢ ${u.phone || 'Phone verified'}`;
  if (roleBadge) {
    roleBadge.textContent = u.role === 'worker' ? 'Verified Worker Pro' : 'Verified Homeowner / Client';
  }

  // Load bookings
  let bookings = [];
  try {
    bookings = JSON.parse(localStorage.getItem('skilliant_bookings') || '[]');
  } catch (e) {
    bookings = [];
  }

  if (bookingsList) {
    if (bookings.length === 0) {
      bookingsList.innerHTML = `<p style="font-size: 0.88rem; color: var(--text-muted); padding: 1rem 0;">No active bookings. Browse services to hire verified tradespeople.</p>`;
    } else {
      bookingsList.innerHTML = bookings.map(b => `
        <div class="booking-item">
          <div>
            <strong style="display: block; color: var(--text-dark);">${b.workerProfession || 'Service'} with ${b.workerName}</strong>
            <span style="font-size: 0.78rem; color: var(--text-muted);">Date: ${b.date} â€¢ ${b.hours} hrs (${b.rate})</span>
          </div>
          <span class="badge badge-success" style="font-size: 0.75rem;">${b.status || 'Escrow Protected'}</span>
        </div>
      `).join('');
    }
  }

  openModal('accountModal');
}
window.openAccountModal = openAccountModal;

/* ==========================================================================
   4. THEME ENGINE (DARK / LIGHT MODE)
   ========================================================================== */

function initTheme() {
  const savedTheme = localStorage.getItem('skilliant_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  setTheme(savedTheme);

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
      showToast(`Theme switched to ${next} mode`, 'info');
    });
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('skilliant_theme', theme);

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    btn.innerHTML = theme === 'dark' 
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  });
}

/* ==========================================================================
   5. NAVIGATION & MOBILE DRAWER
   ========================================================================== */

function initNavigation() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Highlight Active Link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Sticky Header elevation
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
      } else {
        header.style.boxShadow = 'none';
      }
    });
  }
}

/* ==========================================================================
   6. ROLE SELECTOR HELPER (REGISTER PAGE)
   ========================================================================== */

function initRoleSelectors() {
  const roleInputs = document.querySelectorAll('input[name="accountRole"]');
  if (roleInputs.length === 0) return;

  roleInputs.forEach(input => {
    input.addEventListener('change', () => {
      document.querySelectorAll('.role-pill').forEach(p => p.classList.remove('active'));
      const parentLabel = input.closest('label');
      if (parentLabel) {
        const pill = parentLabel.querySelector('.role-pill') || parentLabel.querySelector('.filter-pill');
        if (pill) pill.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. TOAST NOTIFICATION SYSTEM
   ========================================================================== */

function showToast(message, type = 'info', duration = 4000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
  };

  const titles = {
    success: 'Success',
    error: 'Notice',
    warning: 'Attention',
    info: 'Information'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.info}</div>
    <div class="toast-content">
      <div class="toast-title">${titles[type] || 'Notice'}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" aria-label="Close Notification">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  `;

  const closeBtn = toast.querySelector('.toast-close');
  const dismiss = () => {
    toast.classList.add('toast-hide');
    setTimeout(() => toast.remove(), 250);
  };

  closeBtn.addEventListener('click', dismiss);
  container.appendChild(toast);

  setTimeout(dismiss, duration);
}
window.showToast = showToast;

/* ==========================================================================
   8. MODAL SYSTEM
   ========================================================================== */

function initModals() {
  document.querySelectorAll('[data-modal-target]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal-target');
      openModal(modalId);
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });

    const closeBtn = backdrop.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(backdrop.id));
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(m => closeModal(m.id));
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.setAttribute('aria-hidden', 'false');
  }
}
window.openModal = openModal;

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    modal.setAttribute('aria-hidden', 'true');
  }
}
window.closeModal = closeModal;

let currentSelectedWorker = null;

function openHireModal(workerId) {
  const worker = WORKERS_DATA.find(w => w.id === Number(workerId)) || WORKERS_DATA[0];
  currentSelectedWorker = worker;

  const modal = document.getElementById('hireModal');
  if (!modal) return;

  const targetName = modal.querySelector('.modal-worker-name');
  const targetProf = modal.querySelector('.modal-worker-profession');
  const targetRate = modal.querySelector('.modal-worker-rate');
  const targetImg = modal.querySelector('.modal-worker-avatar');

  if (targetName) targetName.textContent = worker.name;
  if (targetProf) targetProf.textContent = worker.profession;
  if (targetRate) targetRate.textContent = `${worker.rate}${worker.rateUnit}`;
  if (targetImg) targetImg.src = worker.avatar;

  // Set minimum date to today
  const dateInput = modal.querySelector('#hireDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    if (!dateInput.value) dateInput.value = today;
  }

  openModal('hireModal');
}
window.openHireModal = openHireModal;

/* ==========================================================================
   9. LABOUR SEARCH & FILTER ENGINE
   ========================================================================== */

function initLabourSearch() {
  const searchInput = document.getElementById('searchQuery');
  const categorySelect = document.getElementById('searchCategory');
  const locationSelect = document.getElementById('searchLocation');
  const urlCategory = new URLSearchParams(window.location.search).get('category');
  if (urlCategory && categorySelect) {
    categorySelect.value = urlCategory;
  }
  const searchBtn = document.getElementById('searchSubmitBtn');
  const resultsContainer = document.getElementById('labourResultsContainer');

  if (!resultsContainer) return;

  function renderWorkers(workers) {
    if (workers.length === 0) {
      resultsContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <h4>No Skilled Workers Found</h4>
          <p>No professionals matched your search criteria. Try choosing "All Categories" or searching a different term.</p>
          <button class="btn btn-outline-primary btn-sm" id="resetSearchBtn">Reset Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetSearchBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          if (categorySelect) categorySelect.value = 'all';
          if (locationSelect) locationSelect.value = 'all';
          renderWorkers(WORKERS_DATA);
        });
      }
      return;
    }

    resultsContainer.innerHTML = workers.map(w => `
      <article class="worker-card" data-category="${w.category}">
        <div class="worker-header">
          <img src="${w.avatar}" alt="${w.name}" class="worker-avatar" loading="lazy">
          <div class="worker-info">
            <h4>${w.name} ${w.verified ? '<span class="badge badge-verified"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Verified</span>' : ''}</h4>
            <div class="worker-profession">${w.profession}</div>
            <div class="worker-meta">
              <span class="rating-badge">â˜… ${w.rating}</span>
              <span>(${w.reviews} reviews)</span>
            </div>
          </div>
        </div>
        <div class="worker-details">
          <span class="worker-detail-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${w.location}
          </span>
          <span class="worker-detail-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            ${w.experience}
          </span>
          <span class="worker-detail-pill text-success">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Available Now
          </span>
        </div>
        <p class="worker-bio">${w.bio}</p>
        <div class="worker-footer">
          <div class="worker-rate">${w.rate}<span>${w.rateUnit}</span></div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-primary btn-sm" onclick="openHireModal(${w.id})">Hire Now</button>
          </div>
        </div>
      </article>
    `).join('');
  }

  function filterWorkers() {
    const query = (searchInput ? searchInput.value.trim().toLowerCase() : '');
    const category = (categorySelect ? categorySelect.value : 'all');
    const location = (locationSelect ? locationSelect.value : 'all');

    const filtered = WORKERS_DATA.filter(w => {
      const matchQuery = !query || 
        w.name.toLowerCase().includes(query) || 
        w.profession.toLowerCase().includes(query) || 
        w.bio.toLowerCase().includes(query);
      const matchCat = category === 'all' || w.category === category;
      const matchLoc = location === 'all' || w.location.toLowerCase().includes(location.toLowerCase());

      return matchQuery && matchCat && matchLoc;
    });

    resultsContainer.style.opacity = '0.5';
    setTimeout(() => {
      renderWorkers(filtered);
      resultsContainer.style.opacity = '1';
    }, 150);
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      filterWorkers();
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterWorkers);
  if (categorySelect) categorySelect.addEventListener('change', filterWorkers);
  if (locationSelect) locationSelect.addEventListener('change', filterWorkers);

  renderWorkers(WORKERS_DATA);

  document.querySelectorAll('.category-card[data-category]').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-category');
      if (categorySelect) {
        categorySelect.value = cat;
        filterWorkers();
        const target = document.getElementById('featured-labour') || resultsContainer;
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   10. BLOG SEARCH & FILTER ENGINE
   ========================================================================== */

function initBlogFilter() {
  const blogContainer = document.getElementById('blogResultsContainer');
  const searchInput = document.getElementById('blogSearchInput');
  const pills = document.querySelectorAll('.filter-pill[data-category]');

  if (!blogContainer) return;

  let activeCategory = 'all';

  function renderBlogPosts() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

    const filtered = BLOG_DATA.filter(post => {
      const matchCat = activeCategory === 'all' || post.category === activeCategory;
      const matchQuery = !query || 
        post.title.toLowerCase().includes(query) || 
        post.snippet.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    if (filtered.length === 0) {
      blogContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          </div>
          <h4>No Articles Found</h4>
          <p>No blog posts matched your search or selected filter. Try searching for a different keyword.</p>
        </div>
      `;
      return;
    }

    blogContainer.innerHTML = filtered.map(post => `
      <article class="blog-card">
        <img src="${post.image}" alt="${post.title}" class="blog-thumb" loading="lazy">
        <div class="blog-content">
          <div class="blog-meta">
            <span class="badge badge-primary">${post.category.replace('-', ' ')}</span>
            <span>${post.date}</span>
            <span>â€¢ ${post.readTime}</span>
          </div>
          <h4>${post.title}</h4>
          <p>${post.snippet}</p>
          <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-dark);">${post.author}</span>
            <a href="#" class="btn btn-ghost btn-sm" onclick="event.preventDefault(); showToast('Full article reader view: ' + '${post.title.replace(/'/g, "\\'")}', 'info')">Read Article â†’</a>
          </div>
        </div>
      </article>
    `).join('');
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category');
      renderBlogPosts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', renderBlogPosts);
  }

  renderBlogPosts();
}

/* ==========================================================================
   11. ANIMATED COUNTERS (STATISTICS)
   ========================================================================== */

function initCounters() {
  const statElements = document.querySelectorAll('[data-counter-target]');
  if (statElements.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-counter-target'), 10);
        const suffix = el.getAttribute('data-counter-suffix') || '';
        const duration = 1500;
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target.toLocaleString() + suffix;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current).toLocaleString() + suffix;
          }
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   12. FAQ ACCORDION ENGINE
   ========================================================================== */

function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const body = item.querySelector('.accordion-body');
      const isActive = item.classList.contains('active');

      const parentAccordion = item.closest('.accordion');
      if (parentAccordion) {
        parentAccordion.querySelectorAll('.accordion-item').forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherHeader = other.querySelector('.accordion-header');
            if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
            const otherBody = other.querySelector('.accordion-body');
            if (otherBody) otherBody.style.maxHeight = null;
          }
        });
      }

      if (isActive) {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   13. PASSWORD TOOLS & VISIBILITY
   ========================================================================== */

function initPasswordToggles() {
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const input = btn.closest('.input-group').querySelector('input');
      if (!input) return;

      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      
      btn.innerHTML = isPassword 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="23" x2="23" y2="23"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    });
  });
}

function initPasswordStrength() {
  const inputs = document.querySelectorAll('#registerPassword, #resetPassword');
  inputs.forEach(input => {
    const parentForm = input.closest('form');
    if (!parentForm) return;
    const strengthBar = parentForm.querySelector('.strength-meter-bar');
    const strengthText = parentForm.querySelector('.strength-text');

    if (!strengthBar) return;

    input.addEventListener('input', () => {
      const val = input.value;
      let score = 0;

      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      const levels = [
        { width: '0%', color: 'transparent', text: 'Enter at least 8 characters' },
        { width: '25%', color: '#EF4444', text: 'Weak password' },
        { width: '50%', color: '#F59E0B', text: 'Fair password' },
        { width: '75%', color: '#0284C7', text: 'Good password' },
        { width: '100%', color: '#10B981', text: 'Strong & secure password' }
      ];

      const currentLevel = val.length === 0 ? levels[0] : levels[score] || levels[1];
      strengthBar.style.width = currentLevel.width;
      strengthBar.style.backgroundColor = currentLevel.color;
      if (strengthText) strengthText.textContent = currentLevel.text;
    });
  });
}

/* ==========================================================================
   14. OTP INPUT HANDLER (EMAIL VERIFICATION)
   ========================================================================== */

function initOtpInputs() {
  const otpBoxes = document.querySelectorAll('.otp-box');
  if (otpBoxes.length === 0) return;

  // Display user pending email if available
  const pendingReg = sessionStorage.getItem('skilliant_pending_reg');
  if (pendingReg) {
    try {
      const regObj = JSON.parse(pendingReg);
      const emailNotice = document.querySelector('.auth-header p');
      if (emailNotice && regObj.email) {
        emailNotice.innerHTML = `Weâ€™ve sent a 6-digit confirmation code to <strong>${regObj.email}</strong>. Please enter it below to activate your account.`;
      }
    } catch (e) {}
  }

  otpBoxes.forEach((box, index) => {
    box.addEventListener('input', (e) => {
      const val = e.target.value;
      if (!/^\d*$/.test(val)) {
        e.target.value = '';
        return;
      }
      if (val.length === 1 && index < otpBoxes.length - 1) {
        otpBoxes[index + 1].focus();
      }
    });

    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !box.value && index > 0) {
        otpBoxes[index - 1].focus();
      } else if (e.key === 'ArrowLeft' && index > 0) {
        otpBoxes[index - 1].focus();
      } else if (e.key === 'ArrowRight' && index < otpBoxes.length - 1) {
        otpBoxes[index + 1].focus();
      }
    });

    box.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
      if (/^\d+$/.test(pasteData)) {
        const digits = pasteData.slice(0, otpBoxes.length).split('');
        digits.forEach((d, i) => {
          if (otpBoxes[i]) otpBoxes[i].value = d;
        });
        if (digits.length < otpBoxes.length) {
          otpBoxes[digits.length].focus();
        } else {
          otpBoxes[otpBoxes.length - 1].focus();
        }
      }
    });
  });

  const timerEl = document.getElementById('otpTimer');
  const resendBtn = document.getElementById('resendOtpBtn');
  if (timerEl && resendBtn) {
    let timeLeft = 59;
    const interval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(interval);
        timerEl.textContent = '00:00';
        resendBtn.removeAttribute('disabled');
        resendBtn.style.opacity = '1';
        resendBtn.style.pointerEvents = 'auto';
      } else {
        const sec = timeLeft < 10 ? '0' + timeLeft : timeLeft;
        timerEl.textContent = `00:${sec}`;
        timeLeft--;
      }
    }, 1000);

    resendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('A new 6-digit verification code has been dispatched to your email.', 'success');
      resendBtn.setAttribute('disabled', 'true');
      resendBtn.style.opacity = '0.5';
      resendBtn.style.pointerEvents = 'none';
      timeLeft = 59;
    });
  }
}

/* ==========================================================================
   15. PRICING TOGGLE ENGINE
   ========================================================================== */

function initPricingToggle() {
  const switchToggle = document.getElementById('pricingSwitch');
  if (!switchToggle) return;

  const amounts = document.querySelectorAll('[data-monthly-price]');

  const handleToggle = () => {
    const isYearly = switchToggle.classList.toggle('active');
    switchToggle.setAttribute('aria-checked', isYearly);
    amounts.forEach(el => {
      const monthly = el.getAttribute('data-monthly-price');
      const yearly = el.getAttribute('data-yearly-price');
      el.textContent = isYearly ? yearly : monthly;
    });
    showToast(isYearly ? 'Switched to Annual Billing (20% Savings applied!)' : 'Switched to Monthly Billing', 'info');
  };

  switchToggle.addEventListener('click', handleToggle);
  switchToggle.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  });
}

/* ==========================================================================
   16. FORM VALIDATION & SIMULATION ENGINE
   ========================================================================== */

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone.replace(/\s+/g, ''));
}

function setFieldValidation(input, isValid, errorMsg = '') {
  const group = input.closest('.form-group') || input.parentElement;
  let feedback = group.querySelector('.invalid-feedback');

  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'invalid-feedback';
    group.appendChild(feedback);
  }

  if (isValid) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    feedback.textContent = '';
  } else {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    feedback.textContent = errorMsg;
  }
}

function initForms() {
  // Contact & Concierge Form
  document.querySelectorAll('form#contactForm').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#contactName');
      const email = form.querySelector('#contactEmail');
      const phone = form.querySelector('#contactPhone');
      const message = form.querySelector('#contactMessage');
      const submitBtn = form.querySelector('button[type="submit"]');

      let valid = true;

      if (!name || !name.value.trim()) {
        if (name) setFieldValidation(name, false, 'Please enter your full name');
        valid = false;
      } else {
        setFieldValidation(name, true);
      }

      if (!email || !validateEmail(email.value.trim())) {
        if (email) setFieldValidation(email, false, 'Please enter a valid email address');
        valid = false;
      } else {
        setFieldValidation(email, true);
      }

      if (phone && phone.value.trim() && !validatePhone(phone.value.trim())) {
        setFieldValidation(phone, false, 'Please enter a valid phone number');
        valid = false;
      } else if (phone) {
        setFieldValidation(phone, true);
      }

      if (!message || !message.value.trim() || message.value.trim().length < 10) {
        if (message) setFieldValidation(message, false, 'Message must be at least 10 characters');
        valid = false;
      } else {
        setFieldValidation(message, true);
      }

      if (valid) {
        submitBtn.classList.add('loading');
        setTimeout(() => {
          submitBtn.classList.remove('loading');
          form.reset();
          form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
          showToast('Thank you! Your inquiry has been routed to our concierge team.', 'success', 5000);
        }, 1100);
      }
    });
  });

  // Login Form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const session = getAuthSession();
    if (session && session.isLoggedIn) {
      showToast('You are already logged in as ' + session.user.name, 'info');
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('#loginEmail');
      const password = loginForm.querySelector('#loginPassword');
      const rememberMe = loginForm.querySelector('#rememberMe');
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      let valid = true;
      if (!validateEmail(email.value.trim())) {
        setFieldValidation(email, false, 'Please enter a valid email address');
        valid = false;
      } else {
        setFieldValidation(email, true);
      }

      if (!password.value || password.value.length < 6) {
        setFieldValidation(password, false, 'Password must be at least 6 characters');
        valid = false;
      } else {
        setFieldValidation(password, true);
      }

      if (valid) {
        submitBtn.classList.add('loading');

        setTimeout(() => {
          submitBtn.classList.remove('loading');
          const users = JSON.parse(localStorage.getItem('skilliant_users') || '[]');
          const inputEmail = email.value.trim().toLowerCase();
          const foundUser = users.find(u => u.email.toLowerCase() === inputEmail);

          let activeUser;
          if (foundUser) {
            activeUser = foundUser;
          } else {
            // Create user object based on login details
            activeUser = {
              name: inputEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
              email: email.value.trim(),
              role: 'customer',
              phone: '+1 (555) 019-2834',
              joinedDate: 'August 2026'
            };
          }

          setAuthSession(activeUser);
          showToast(`Welcome back, ${activeUser.name}!`, 'success');

          setTimeout(() => {
            window.location.href = 'index.html';
          }, 800);
        }, 900);
      }
    });
  }

  // Registration Form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = registerForm.querySelector('#registerName');
      const email = registerForm.querySelector('#registerEmail');
      const phone = registerForm.querySelector('#registerPhone');
      const password = registerForm.querySelector('#registerPassword');
      const confirmPassword = registerForm.querySelector('#registerConfirmPassword');
      const termsCheck = registerForm.querySelector('#registerTerms');
      const roleInput = registerForm.querySelector('input[name="accountRole"]:checked');
      const submitBtn = registerForm.querySelector('button[type="submit"]');

      let valid = true;

      if (!name.value.trim()) {
        setFieldValidation(name, false, 'Name is required');
        valid = false;
      } else {
        setFieldValidation(name, true);
      }

      if (!validateEmail(email.value.trim())) {
        setFieldValidation(email, false, 'Please enter a valid email address');
        valid = false;
      } else {
        setFieldValidation(email, true);
      }

      if (!validatePhone(phone.value.trim())) {
        setFieldValidation(phone, false, 'Please enter a valid phone number (e.g. +1 555-0199)');
        valid = false;
      } else {
        setFieldValidation(phone, true);
      }

      if (!password.value || password.value.length < 8) {
        setFieldValidation(password, false, 'Password must be at least 8 characters');
        valid = false;
      } else {
        setFieldValidation(password, true);
      }

      if (confirmPassword.value !== password.value) {
        setFieldValidation(confirmPassword, false, 'Passwords do not match');
        valid = false;
      } else {
        setFieldValidation(confirmPassword, true);
      }

      if (!termsCheck.checked) {
        showToast('You must agree to the Terms & Privacy Policy to continue', 'warning');
        valid = false;
      }

      if (valid) {
        submitBtn.classList.add('loading');

        const pendingUser = {
          name: name.value.trim(),
          email: email.value.trim(),
          phone: phone.value.trim(),
          password: password.value,
          role: roleInput ? roleInput.value : 'customer',
          joinedDate: 'August 2026'
        };

        sessionStorage.setItem('skilliant_pending_reg', JSON.stringify(pendingUser));

        setTimeout(() => {
          submitBtn.classList.remove('loading');
          window.location.href = 'email-verification.html';
        }, 1000);
      }
    });
  }

  // Forgot Password Form
  const forgotForm = document.getElementById('forgotPasswordForm');
  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = forgotForm.querySelector('#forgotEmail');
      const submitBtn = forgotForm.querySelector('button[type="submit"]');

      if (!validateEmail(email.value.trim())) {
        setFieldValidation(email, false, 'Please enter a valid email address');
        return;
      }

      setFieldValidation(email, true);
      submitBtn.classList.add('loading');
      sessionStorage.setItem('skilliant_reset_email', email.value.trim());

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        showToast('Password reset verification link sent to ' + email.value.trim(), 'success');
        setTimeout(() => {
          window.location.href = 'reset-password.html';
        }, 900);
      }, 900);
    });
  }

  // Reset Password Form
  const resetForm = document.getElementById('resetPasswordForm');
  if (resetForm) {
    resetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const password = resetForm.querySelector('#resetPassword');
      const confirmPassword = resetForm.querySelector('#resetConfirmPassword');
      const submitBtn = resetForm.querySelector('button[type="submit"]');

      let valid = true;
      if (!password.value || password.value.length < 8) {
        setFieldValidation(password, false, 'Password must be at least 8 characters');
        valid = false;
      } else {
        setFieldValidation(password, true);
      }

      if (confirmPassword.value !== password.value) {
        setFieldValidation(confirmPassword, false, 'Passwords do not match');
        valid = false;
      } else {
        setFieldValidation(confirmPassword, true);
      }

      if (valid) {
        submitBtn.classList.add('loading');
        setTimeout(() => {
          submitBtn.classList.remove('loading');
          showToast('Password updated successfully!', 'success');
          setTimeout(() => {
            window.location.href = 'success.html?action=password-reset';
          }, 800);
        }, 900);
      }
    });
  }

  // OTP Form (Email Verification)
  const otpForm = document.getElementById('otpForm');
  if (otpForm) {
    otpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const boxes = document.querySelectorAll('.otp-box');
      const otpCode = Array.from(boxes).map(b => b.value).join('');
      const submitBtn = otpForm.querySelector('button[type="submit"]');

      if (otpCode.length < 6) {
        showToast('Please enter the complete 6-digit verification code', 'error');
        return;
      }

      submitBtn.classList.add('loading');

      // Promote pending user to active registered user
      const pendingReg = sessionStorage.getItem('skilliant_pending_reg');
      if (pendingReg) {
        try {
          const userObj = JSON.parse(pendingReg);
          const users = JSON.parse(localStorage.getItem('skilliant_users') || '[]');
          users.push(userObj);
          localStorage.setItem('skilliant_users', JSON.stringify(users));
          setAuthSession(userObj);
          sessionStorage.removeItem('skilliant_pending_reg');
        } catch (e) {}
      }

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        window.location.href = 'success.html?action=registered';
      }, 1000);
    });
  }

  // Hire Booking Modal Form
  const hireForm = document.getElementById('hireBookingForm');
  if (hireForm) {
    hireForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const serviceDate = hireForm.querySelector('#hireDate');
      const hoursSelect = hireForm.querySelector('#hireHours');
      const notes = hireForm.querySelector('#hireNotes');
      const submitBtn = hireForm.querySelector('button[type="submit"]');

      if (!serviceDate.value) {
        showToast('Please choose a preferred booking date', 'warning');
        return;
      }

      submitBtn.classList.add('loading');

      const worker = currentSelectedWorker || WORKERS_DATA[0];
      const newBooking = {
        id: "BK-" + Math.floor(10000 + Math.random() * 90000),
        workerName: worker.name,
        workerProfession: worker.profession,
        date: serviceDate.value,
        hours: hoursSelect ? hoursSelect.value : '4',
        rate: `${worker.rate}${worker.rateUnit}`,
        notes: notes ? notes.value.trim() : '',
        status: "Escrow Confirmed",
        timestamp: new Date().toISOString()
      };

      try {
        const bookings = JSON.parse(localStorage.getItem('skilliant_bookings') || '[]');
        bookings.unshift(newBooking);
        localStorage.setItem('skilliant_bookings', JSON.stringify(bookings));
      } catch (e) {}

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        closeModal('hireModal');
        showToast(`Booking request confirmed with ${worker.name}! Escrow guarantee active.`, 'success', 5000);
        hireForm.reset();
      }, 1000);
    });
  }
}

/* ==========================================================================
   17. SUCCESS PAGE DYNAMIC HANDLER
   ========================================================================== */

function initSuccessPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const action = urlParams.get('action');
  const mainHeading = document.querySelector('.auth-card h2');
  const subtitle = document.querySelector('.auth-card p');
  const badge = document.querySelector('.auth-card .badge');

  if (!mainHeading) return;

  if (action === 'password-reset') {
    if (badge) badge.textContent = 'Security Updated';
    if (mainHeading) mainHeading.textContent = 'Password Reset Successfully!';
    if (subtitle) subtitle.textContent = 'Your account password has been updated. You can now log in securely with your new credentials.';
  } else if (action === 'registered') {
    const session = getAuthSession();
    if (badge) badge.textContent = 'Account Activated';
    if (mainHeading) mainHeading.textContent = session ? `Welcome, ${session.user.name}!` : 'Registration Complete!';
    if (subtitle) subtitle.textContent = 'Your email has been verified and your profile is now active on the Skilliant labour marketplace.';
  }
}