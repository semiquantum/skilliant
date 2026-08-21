# ⚡ Skilliant - Online Labour Finding Platform

> **Tagline:** *"Connecting Skilled Workers with Opportunities."*

Skilliant is a production-ready, modern, responsive, and secure frontend web application built strictly with **HTML5, CSS3, and Vanilla JavaScript (ES6)**.

---

## 🎨 Theme & Design Aesthetics

- **Primary Colors**: Deep Blue (`#1E40AF`, `#2563EB`, `#3B82F6`)
- **Accent Color**: Vivid Orange (`#F97316`, `#EA580C`)
- **Background Palette**: Light Slate (`#F8FAFC`), Pure White (`#FFFFFF`), Dark Mode (`#0F172A`, `#1E293B`)
- **Visual Effects**: Glassmorphism (`backdrop-filter: blur(12px)`), Soft Shadows, 16px+ Rounded Cards, Smooth CSS Animations, Sticky Navbar, Toast Notifications, Loading Skeletons, Modal Popups.

---

## 📁 File Structure

```text
skilliant/
├── index.html                      # Landing Page (Hero, Search, Categories, Featured Labour, How it Works, Stats, CTA, FAQ, Footer)
├── css/
│   ├── variables.css               # Design tokens, color system, glassmorphism, dark mode overrides
│   ├── style.css                   # Global styles, navbar, cards, buttons, modals, toasts, animations, footer
│   └── dashboard.css               # Unified layouts for User, Labour, Contractor, and Admin dashboards
├── js/
│   ├── theme.js                    # Persistent Dark Mode switcher (localStorage)
│   ├── toast.js                    # Interactive Toast Notification engine
│   ├── modal.js                    # Dynamic modal dialog controller
│   ├── main.js                     # Mobile drawer toggle, ripple effects, animated counters, FAQ accordion
│   └── dashboard.js                # Dashboard tab switcher, simulated wallet top-up, availability toggle, job accept/reject
├── pages/
│   ├── about.html                  # Mission, vision, core pillars
│   ├── services.html               # Service category breakdown
│   ├── find-labour.html            # Search & Filter workers (Category, Rating, City, Price, Availability)
│   ├── become-labour.html          # Skilled worker onboarding & benefits
│   ├── become-contractor.html      # Contractor team management onboarding
│   ├── pricing.html                # Transparent pricing plans
│   ├── blog.html                   # Industry insights & safety tips
│   ├── contact.html                # Support inquiry form & company details
│   ├── faq.html                    # Accordion FAQ help center
│   ├── privacy.html                # Privacy policy
│   ├── terms.html                  # Terms & conditions
│   ├── login.html                  # Multi-role login screen (User, Labour, Contractor, Admin)
│   ├── register.html               # Account registration flow
│   ├── forgot-password.html        # Password reset screen
│   ├── 404.html                    # 404 error page
│   ├── dashboard-user.html         # User Dashboard (Active/Upcoming bookings, Wallet, Profile, Invoice download)
│   ├── dashboard-labour.html       # Labour Dashboard (Job requests, Accept/Reject, Availability toggle, Earnings charts)
│   ├── dashboard-contractor.html   # Contractor Dashboard (Team roster, Add worker modal, Site projects, GST billing)
│   └── dashboard-admin.html        # Website Admin Dashboard (Platform health, User CRUD, Categories, Logs)
└── README.md
```

---

## 🚀 How to Run Locally

Since this is a standalone HTML5/CSS3/Vanilla JS application:
1. Open `index.html` directly in any web browser (Chrome, Firefox, Edge, Safari).
2. Alternatively, serve with VS Code Live Server or python:
   ```bash
   npx serve .
   ```
3. Test dark mode by clicking the 🌙 / ☀️ toggle icon in the navbar.
4. Access role dashboards by logging in via `pages/login.html` or navigating directly to `pages/dashboard-user.html`, `pages/dashboard-labour.html`, `pages/dashboard-contractor.html`, or `pages/dashboard-admin.html`.

---

## 🌐 Deployment Ready

The entire codebase is static-ready for instant zero-config deployment on:
- **Vercel** (`vercel`)
- **Netlify** (`netlify deploy`)
- **GitHub Pages**
