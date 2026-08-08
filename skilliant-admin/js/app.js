/**
 * Skilliant Admin Portal — Master Application Entry Point
 * SPA Hash Router, Auth Guard, Dark Mode, Global Search, Session Management.
 */

const App = {
    // ── Registered page modules (4 analytics pages merged into reports) ──
    pages: {
        'dashboard':      DashboardPage,
        'users':          UsersPage,
        'labour':         LabourPage,
        'contractors':    ContractorsPage,
        'categories':     CategoriesPage,
        'skills':         SkillsPage,
        'bookings':       BookingsPage,
        'payments':       PaymentsPage,
        'wallet':         WalletPage,
        'reports':        ReportsPage,
        'reviews':        ReviewsPage,
        'notifications':  NotificationsPage,
        'support-tickets':SupportTicketsPage,
        'settings':       SettingsPage,
        'security':       SecurityPage,
        'admins':         AdminsPage,
        'roles':          RolesPage,
        'activity-logs':  ActivityLogsPage
    },

    currentPage: 'dashboard',

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
        this.bindGlobalSearch();
        this.initHeader();
        this.startClock();
        this.initDarkModeToggle();
        this.updateSidebarUser();
    },

    // ════════════════════════════════════════════════════════════
    // AUTH GUARD — blocks every route if not authenticated
    // ════════════════════════════════════════════════════════════
    checkAuth() {
        const appContainer = document.getElementById('appContainer');
        const loginContainer = document.getElementById('loginContainer');
        if (DataService.isAuthenticated()) {
            if (appContainer)   appContainer.style.display  = 'flex';
            if (loginContainer) loginContainer.style.display = 'none';
            return true;
        } else {
            if (appContainer)   appContainer.style.display  = 'none';
            if (loginContainer) loginContainer.style.display = 'flex';
            return false;
        }
    },

    // ════════════════════════════════════════════════════════════
    // HEADER INITIALIZATION
    // ════════════════════════════════════════════════════════════
    initHeader() {
        const session = DataService.getSession();
        if (session) {
            this._updateHeaderProfile(session);
            this.updateGreeting(session.adminName.split(' ')[0]);
        }

        // Notification dropdown (class-based toggle)
        const notifBtn      = document.getElementById('headerNotifBtn');
        const notifDropdown = document.getElementById('notifDropdown');
        const markAllReadBtn= document.getElementById('markAllReadBtn');

        if (notifBtn && notifDropdown) {
            notifBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = notifDropdown.classList.contains('show');
                // Close profile dropdown if open
                document.getElementById('profileDropdown')?.classList.remove('show');
                document.getElementById('headerProfileBtn')?.classList.remove('active');
                // Toggle notification dropdown
                notifDropdown.classList.toggle('show', !isOpen);
                notifBtn.setAttribute('aria-expanded', String(!isOpen));
                if (!isOpen) this.renderNotificationDropdown();
            });

            document.addEventListener('click', (e) => {
                if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
                    notifDropdown.classList.remove('show');
                    notifBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }

        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const notifications = DataService.getCollection(DataService.KEYS.NOTIFICATIONS);
                notifications.forEach(n => n.unread = false);
                DataService.setStorage(DataService.KEYS.NOTIFICATIONS, notifications);
                this.renderNotificationDropdown();
                this.updateNotificationBadge();
                if (this.currentPage === 'notifications') App.refreshCurrentPage();
            });
        }

        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            Toast.show('Signing out...', 'info');
            setTimeout(() => {
                DataService.logout();
                this.checkAuth();
                window.location.hash = '#dashboard';
            }, 600);
        });

        // Fullscreen toggle
        const fullscreenBtn = document.getElementById('fullscreenToggleBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                    fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress" aria-hidden="true"></i>';
                    fullscreenBtn.setAttribute('aria-label', 'Exit fullscreen');
                } else {
                    document.exitFullscreen();
                    fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand" aria-hidden="true"></i>';
                    fullscreenBtn.setAttribute('aria-label', 'Toggle fullscreen');
                }
            });
        }

        // Escape key closes modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                ModalManager?.close();
                document.getElementById('notifDropdown')?.classList.remove('show');
                document.getElementById('profileDropdown')?.classList.remove('show');
            }
        });

        this.updateNotificationBadge();
    },

    _updateHeaderProfile(session) {
        const nameEl   = document.getElementById('headerName');
        const avatarEl = document.getElementById('headerAvatar');
        if (nameEl) {
            const parts = session.adminName.split(' ');
            nameEl.textContent = parts[0] + (parts[1] ? ' ' + parts[1][0] + '.' : '');
        }
        if (avatarEl) {
            avatarEl.textContent = session.profilePhoto ||
                session.adminName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
    },

    // ════════════════════════════════════════════════════════════
    // SIDEBAR USER — reads real session data
    // ════════════════════════════════════════════════════════════
    updateSidebarUser() {
        const session = DataService.getSession();
        if (!session) return;
        const nameEl   = document.getElementById('sidebarUserName');
        const roleEl   = document.getElementById('sidebarUserRole');
        const avatarEl = document.getElementById('sidebarAvatar');
        if (nameEl)   nameEl.textContent   = session.adminName;
        if (roleEl)   roleEl.textContent   = session.role;
        if (avatarEl) avatarEl.textContent = (session.profilePhoto ||
            session.adminName.split(' ').map(n => n[0]).join('').toUpperCase()).slice(0, 2);
    },

    // ════════════════════════════════════════════════════════════
    // DARK MODE (Bug Fix: was using wrong ID 'darkModeToggle')
    // ════════════════════════════════════════════════════════════
    initDarkModeToggle() {
        const btn = document.getElementById('themeToggleBtn'); // correct ID
        if (!btn) return;

        const settings = DataService.getSettings();
        this._applyDarkMode(settings.darkMode);

        btn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            DataService.setDarkMode(!isDark);
            this._applyDarkMode(!isDark);
            Toast.show(`${!isDark ? 'Dark' : 'Light'} mode enabled`, 'info');
        });
    },

    _applyDarkMode(enabled) {
        const btn = document.getElementById('themeToggleBtn');
        if (enabled) {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-sun" aria-hidden="true"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', '');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
        }
    },

    // ════════════════════════════════════════════════════════════
    // NOTIFICATIONS
    // ════════════════════════════════════════════════════════════
    updateNotificationBadge() {
        const notifications = DataService.getCollection(DataService.KEYS.NOTIFICATIONS) || [];
        const unreadCount   = notifications.filter(n => n.unread).length;

        const headerBadge  = document.getElementById('notifBadge');
        const sidebarBadge = document.getElementById('sidebarNotifBadge');

        const countText = unreadCount > 99 ? '99+' : String(unreadCount);

        if (headerBadge) {
            headerBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
            headerBadge.textContent   = countText;
        }
        if (sidebarBadge) {
            sidebarBadge.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
            sidebarBadge.textContent   = countText;
        }
    },

    renderNotificationDropdown() {
        const notifList = document.getElementById('notifList');
        if (!notifList) return;
        const notifications = DataService.getCollection(DataService.KEYS.NOTIFICATIONS) || [];
        this.updateNotificationBadge();

        if (notifications.length === 0) {
            notifList.innerHTML = `
                <div style="padding:2.5rem 1rem;text-align:center;color:var(--text-muted);font-size:0.85rem;">
                    <i class="fa-solid fa-bell-slash" style="font-size:2rem;margin-bottom:0.75rem;opacity:0.25;display:block;"></i>
                    No notifications yet
                </div>`;
            return;
        }

        const iconMap = {
            'Booking':      'fa-calendar-check',
            'Payment':      'fa-credit-card',
            'Verification': 'fa-shield-halved',
            'Support':      'fa-headset',
            'Registration': 'fa-user-plus',
            'Broadcast':    'fa-bullhorn'
        };

        const colorMap = {
            'Booking':      'var(--primary-blue)',
            'Payment':      'var(--success)',
            'Verification': 'var(--accent-gold)',
            'Support':      'var(--danger)',
            'Registration': 'var(--primary-purple)',
            'Broadcast':    'var(--accent-orange)'
        };

        notifList.innerHTML = notifications.slice(0, 6).map(n => `
            <div
                style="padding:0.8rem 1rem;border-bottom:1px solid var(--border-color);background:${n.unread ? 'rgba(37,99,235,0.04)' : 'transparent'};cursor:pointer;transition:background 0.1s ease;"
                onclick="App._markNotifRead('${n.id}')"
                role="listitem"
                tabindex="0"
                onkeydown="if(event.key==='Enter')App._markNotifRead('${n.id}')"
            >
                <div style="display:flex;gap:0.7rem;align-items:flex-start;">
                    <div style="width:32px;height:32px;border-radius:50%;background:${colorMap[n.category] || 'var(--primary-blue)'};color:white;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:0.75rem;">
                        <i class="fa-solid ${iconMap[n.category] || 'fa-bell'}" aria-hidden="true"></i>
                    </div>
                    <div style="flex:1;min-width:0;">
                        <div style="font-weight:${n.unread ? '700' : '500'};font-size:0.82rem;color:var(--text-main);margin-bottom:2px;">${n.title}</div>
                        <div style="font-size:0.74rem;color:var(--text-muted);line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${n.message}</div>
                        <div style="font-size:0.7rem;color:var(--text-light);margin-top:3px;"><i class="fa-regular fa-clock" aria-hidden="true"></i> ${n.time}</div>
                    </div>
                    ${n.unread ? '<div style="width:7px;height:7px;border-radius:50%;background:var(--primary-blue);flex-shrink:0;margin-top:5px;" aria-label="Unread"></div>' : ''}
                </div>
            </div>
        `).join('');
    },

    _markNotifRead(id) {
        const notifications = DataService.getCollection(DataService.KEYS.NOTIFICATIONS);
        const n = notifications.find(x => x.id === id);
        if (n) {
            n.unread = false;
            DataService.setStorage(DataService.KEYS.NOTIFICATIONS, notifications);
            this.renderNotificationDropdown();
            if (this.currentPage === 'notifications') App.refreshCurrentPage();
        }
    },

    // ════════════════════════════════════════════════════════════
    // GREETING & CLOCK
    // ════════════════════════════════════════════════════════════
    updateGreeting(firstName) {
        const el = document.getElementById('headerGreeting');
        if (!el) return;
        const h = new Date().getHours();
        const g = h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening';
        el.textContent = `${g}, ${firstName} 👋`;
    },

    startClock() {
        const update = () => {
            const now = new Date();
            const dateEl = document.getElementById('currentDate');
            const timeEl = document.getElementById('currentTime');
            if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            const session = DataService.getSession();
            if (session) this.updateGreeting(session.adminName.split(' ')[0]);
        };
        update();
        setInterval(update, 60000);
    },

    // ════════════════════════════════════════════════════════════
    // ROUTER
    // ════════════════════════════════════════════════════════════
    handleRoute() {
        if (!this.checkAuth()) return;

        const rawHash   = window.location.hash.replace('#', '').trim() || 'dashboard';
        const pageModule = this.pages[rawHash] || null;
        this.currentPage = rawHash;

        if (window.Sidebar) Sidebar.setActiveNavItem(rawHash);

        const container = document.getElementById('mainContent');
        if (!container) return;

        if (!pageModule) {
            // 404 handler
            container.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:50vh;text-align:center;gap:1rem;">
                    <div style="font-size:5rem;opacity:0.15;">🔍</div>
                    <h2 style="font-size:1.5rem;font-weight:800;color:var(--primary-navy);">Page Not Found</h2>
                    <p style="color:var(--text-muted);">The page <strong>${rawHash}</strong> does not exist.</p>
                    <a href="#dashboard" class="btn btn-primary">Go to Dashboard</a>
                </div>
            `;
            return;
        }

        container.innerHTML = pageModule.render();
        if (typeof pageModule.init === 'function') {
            requestAnimationFrame(() => pageModule.init());
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.updateNotificationBadge();
        this.updateSidebarUser();
    },

    refreshCurrentPage() {
        this.handleRoute();
    },

    // ════════════════════════════════════════════════════════════
    // GLOBAL SEARCH — real cross-collection search
    // ════════════════════════════════════════════════════════════
    bindGlobalSearch() {
        const searchInput = document.getElementById('globalSearchInput');
        if (!searchInput) return;

        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const q = searchInput.value.trim().toLowerCase();
                if (!q) return;
                this._runGlobalSearch(q);
                searchInput.value = '';
                searchInput.blur();
            }
        });
    },

    _runGlobalSearch(query) {
        const results = [];

        const collections = [
            { key: DataService.KEYS.USERS,       link: 'users',       type: 'User',       labelField: 'name', subField: 'email' },
            { key: DataService.KEYS.LABOURS,      link: 'labour',      type: 'Labourer',   labelField: 'name', subField: 'skill' },
            { key: DataService.KEYS.CONTRACTORS,  link: 'contractors', type: 'Contractor', labelField: 'name', subField: 'specialization' },
            { key: DataService.KEYS.BOOKINGS,     link: 'bookings',    type: 'Booking',    labelField: 'id',   subField: 'customer' }
        ];

        collections.forEach(({ key, link, type, labelField, subField }) => {
            DataService.getCollection(key)
                .filter(item =>
                    String(item[labelField] || '').toLowerCase().includes(query) ||
                    String(item[subField]   || '').toLowerCase().includes(query)
                )
                .forEach(item => results.push({ type, label: item[labelField], sub: item[subField], link }));
        });

        if (results.length === 0) {
            Toast.show(`No results found for "${query}"`, 'warning');
            return;
        }

        const first = results[0];
        window.location.hash = '#' + first.link;
        Toast.show(`Found ${results.length} result(s) for "${query}"`, 'success');
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
