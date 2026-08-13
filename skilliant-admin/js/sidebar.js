/**
 * Skilliant Admin Portal — Sidebar Module
 * Handles mobile open/close and active nav item highlighting.
 * All desktop toggle is handled by app.js only.
 */

const Sidebar = {
    sidebar:  null,
    overlay:  null,
    closeBtn: null,

    init() {
        this.sidebar  = document.getElementById('sidebar');
        this.overlay  = document.getElementById('sidebarOverlay');
        this.closeBtn = document.getElementById('sidebarClose');
        const menuBtn = document.getElementById('menuToggle');

        // Mobile: toggle sidebar via menu button
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                const isOpen = this.sidebar?.classList.contains('mobile-open');
                if (isOpen) {
                    this.close();
                } else {
                    this.open();
                }
            });
        }

        // Close via overlay tap
        this.overlay?.addEventListener('click', () => this.close());

        // Close via X button (mobile)
        this.closeBtn?.addEventListener('click', () => this.close());

        // Sidebar user click → go to settings
        document.getElementById('sidebarUser')?.addEventListener('click', () => {
            window.location.hash = '#settings';
            this.close();
        });

        // Nav item click: mobile close + active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                this.setActiveNavItem(item.dataset.page);
                this.close(); // always close on mobile
            });
        });
    },

    open() {
        this.sidebar?.classList.add('mobile-open');
        this.overlay?.classList.add('active');
        this.sidebar?.setAttribute('aria-expanded', 'true');
        document.getElementById('menuToggle')?.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    },

    close() {
        this.sidebar?.classList.remove('mobile-open');
        this.overlay?.classList.remove('active');
        this.sidebar?.setAttribute('aria-expanded', 'false');
        document.getElementById('menuToggle')?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    },

    /**
     * Updates the active state for nav items and breadcrumb.
     * Called by App.handleRoute() on every navigation.
     */
    setActiveNavItem(pageName) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeItem = document.querySelector(`.nav-item[data-page="${pageName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
            // Update header breadcrumb
            const navText = activeItem.querySelector('.nav-text')?.textContent || pageName;
            const breadcrumb = document.getElementById('breadcrumb');
            if (breadcrumb) {
                breadcrumb.innerHTML = `
                    <i class="fa-solid fa-house" aria-hidden="true"></i>
                    <span class="active-crumb">/ ${navText}</span>
                `;
            }
        }

        // Profile dropdown: close on navigate
        document.getElementById('profileDropdown')?.classList.remove('show');
        document.getElementById('headerProfileBtn')?.classList.remove('active');

        // Profile dropdown toggle
        this._initProfileDropdown();
    },

    _initProfileDropdown() {
        const btn      = document.getElementById('headerProfileBtn');
        const dropdown = document.getElementById('profileDropdown');
        if (!btn || !dropdown) return;

        // Prevent double-binding
        if (btn._profileDropdownBound) return;
        btn._profileDropdownBound = true;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.classList.contains('show');
            // Close notifications if open
            document.getElementById('notifDropdown')?.classList.remove('show');
            // Toggle this dropdown
            dropdown.classList.toggle('show', !isOpen);
            btn.classList.toggle('active', !isOpen);
            btn.setAttribute('aria-expanded', String(!isOpen));
        });

        document.addEventListener('click', (e) => {
            if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
                btn.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            }
        });

        // Keyboard: Enter/Space to toggle
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => Sidebar.init());
