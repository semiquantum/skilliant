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
        'reports':        ReportsPage,
        'notifications':  NotificationsPage,
        'support':        SupportPage,
        'activity':       ActivityLogsPage,
        'settings':       SettingsPage,
        'admins':         AdminsPage,
        'roles':          RolesPage,
        'reviews':        ReviewsPage,
        'projects':       ProjectsPage,
        'attendance':     AttendancePage,
        'documents':      DocumentsPage,
        'availability':   AvailabilityPage,
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
        DataService.ensureDay5ModulePermissions();
        this.applyRoleVisibility();

        // Global notification refresh: every module can publish a real notification.
        window.addEventListener('skilliant:notification-created', () => {
            this.updateNotificationBadge();
            if (document.getElementById('notifDropdown')?.classList.contains('show')) this.renderNotificationDropdown();
            if (this.currentPage === 'notifications') this.refreshCurrentPage();
        });
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
                // Frontend-only cross-portal navigation: Admin logout returns to the
                // existing Marketing portal without copying/merging its files.
                const marketingUrl = window.SKILLIANT_MARKETING_URL || '../Marketing/index.html';
                window.location.href = marketingUrl;
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

        // Desktop menu button: collapse sidebar instead of activating a blur overlay.
        const desktopMenuBtn = document.getElementById('menuToggle');
        const appContainer = document.getElementById('appContainer');
        if (desktopMenuBtn && appContainer && !desktopMenuBtn._desktopBound) {
            desktopMenuBtn._desktopBound = true;
            desktopMenuBtn.addEventListener('click', (e) => {
                if (window.innerWidth > 1024) {
                    e.stopImmediatePropagation();
                    appContainer.classList.toggle('sidebar-collapsed');
                }
            }, true);
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
        const roleBadge = document.getElementById('sidebarRoleBadge');
        if (roleBadge) roleBadge.textContent = session.role || 'Admin';
    },

    hasPermission(permission) {
        return typeof DataService.hasPermission === 'function' && DataService.hasPermission(permission);
    },

    applyRoleVisibility() {
        const pagePermissions = {
            dashboard:'view:dashboard', users:'view:users', labour:'view:labour', contractors:'view:contractors',
            categories:'view:categories', skills:'view:skills', bookings:'view:bookings', payments:'view:payments',
            reports:'view:reports', notifications:'view:notifications', support:'view:support', activity:'view:activity',
            settings:'view:settings', admins:'manage:admins', roles:'manage:roles', reviews:'view:reviews', projects:'view:projects', attendance:'view:attendance', documents:'view:documents', availability:'view:availability'
        };
        document.querySelectorAll('.nav-item[data-page]').forEach(item => {
            const page = item.dataset.page;
            const permission = pagePermissions[page];
            item.style.display = !permission || this.hasPermission(permission) ? '' : 'none';
        });
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
        const logs = DataService.getStorage(DataService.KEYS.ACTIVITY_LOGS) || [];
        const safeTs = value => { const d = new Date(value); return Number.isNaN(d.getTime()) ? 0 : d.getTime(); };
        const items = [
            ...notifications.map(n => ({...n, source:'Notification'})),
            ...logs.map(l => ({id:l.id,title:l.action||'Activity',message:`${l.admin||'System'} performed this action`,category:'Activity',timestamp:l.timestamp,unread:false,source:'Activity'}))
        ].filter((x,i,a)=>a.findIndex(y=>y.id===x.id)===i).sort((a,b)=>safeTs(b.timestamp)-safeTs(a.timestamp)).slice(0,8);
        this.updateNotificationBadge();
        if (!items.length) { notifList.innerHTML=`<div style="padding:2.5rem 1rem;text-align:center;color:var(--text-muted);font-size:.85rem;"><i class="fa-solid fa-bell-slash" style="font-size:2rem;margin-bottom:.75rem;opacity:.25;display:block"></i>No activity or notifications yet</div>`; return; }
        const iconMap={Booking:'fa-calendar-check',Payment:'fa-credit-card',User:'fa-user',Report:'fa-file-lines',Security:'fa-shield-halved',Activity:'fa-list-check'};
        const colorMap={Booking:'var(--primary-blue)',Payment:'var(--success)',User:'var(--primary-purple)',Report:'var(--accent-orange)',Security:'var(--accent-gold)',Activity:'var(--accent-gold)'};
        notifList.innerHTML=items.map(n=>`<div style="padding:.8rem 1rem;border-bottom:1px solid var(--border-color);background:${n.unread?'rgba(37,99,235,.04)':'transparent'};cursor:pointer" onclick="App._openNotification('${n.id}', '${n.source}')" role="listitem"><div style="display:flex;gap:.7rem;align-items:flex-start"><div style="width:32px;height:32px;border-radius:50%;background:${colorMap[n.category]||'var(--primary-blue)'};color:white;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.75rem"><i class="fa-solid ${iconMap[n.category]||'fa-bell'}"></i></div><div style="flex:1;min-width:0"><div style="font-weight:${n.unread?'700':'500'};font-size:.82rem;color:var(--text-main)">${n.title}</div><div style="font-size:.74rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${n.message}</div><div style="font-size:.7rem;color:var(--text-light);margin-top:3px">${this.formatNotificationTime(n)}</div></div>${n.unread?'<span style="width:7px;height:7px;border-radius:50%;background:var(--primary-blue);margin-top:5px"></span>':''}</div></div>`).join('');
    },

    formatNotificationTime(n) {
        const ts=n.timestamp ? new Date(n.timestamp) : null;
        if(!ts || Number.isNaN(ts.getTime())) return n.time || 'Unknown time';
        const diff=Math.max(0,Date.now()-ts.getTime());
        const mins=Math.floor(diff/60000);
        if(mins<1) return 'Just now';
        if(mins<60) return `${mins} min${mins===1?'':'s'} ago`;
        const hrs=Math.floor(mins/60);
        if(hrs<24) return `${hrs} hour${hrs===1?'':'s'} ago`;
        const days=Math.floor(hrs/24);
        if(days<7) return `${days} day${days===1?'':'s'} ago`;
        return ts.toLocaleString();
    },

    _openNotification(id, source='Notification') {
        if (source === 'Activity') { window.location.hash='#activity'; return; }
        const notifications=DataService.getCollection(DataService.KEYS.NOTIFICATIONS)||[];
        const n=notifications.find(x=>x.id===id); if(!n) return;
        n.unread=false; DataService.setStorage(DataService.KEYS.NOTIFICATIONS,notifications); this.renderNotificationDropdown(); this.updateNotificationBadge();
        const routes={user:'users',labourer:'labour',contractor:'contractors',booking:'bookings',payment:'payments',payout:'payments',report:'reports','support-ticket':'support'};
        const route=routes[n.entityType]; window.location.hash='#'+(route||'notifications');
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
    handleRoute(isUpdate = false) {
        if (!this.checkAuth()) return;

        const rawHash = window.location.hash.replace('#', '').trim() || 'dashboard';
        const session = DataService.getSession();
        const pageModule = this.pages[rawHash] || null;
        const role = session?.role || 'Admin';
        const routePermissions = {
            dashboard:'view:dashboard', users:'view:users', labour:'view:labour', contractors:'view:contractors',
            categories:'view:categories', skills:'view:skills', bookings:'view:bookings', payments:'view:payments',
            reports:'view:reports', notifications:'view:notifications', support:'view:support', activity:'view:activity',
            settings:'view:settings', admins:'manage:admins', roles:'manage:roles', reviews:'view:reviews', projects:'view:projects', attendance:'view:attendance', documents:'view:documents', availability:'view:availability'
        };
        const requiredPermission = routePermissions[rawHash];
        if (requiredPermission && !this.hasPermission(requiredPermission)) {
            Toast.show(`Access restricted for ${role}.`, 'warning');
            window.location.hash = '#dashboard';
            return;
        }
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

        // Focus preservation
        const activeId = document.activeElement ? document.activeElement.id : null;
        const selectionStart = document.activeElement ? document.activeElement.selectionStart : null;
        const selectionEnd = document.activeElement ? document.activeElement.selectionEnd : null;

        container.innerHTML = pageModule.render();
        if (typeof pageModule.init === 'function') {
            requestAnimationFrame(() => {
                pageModule.init();
                if (activeId) {
                    const el = document.getElementById(activeId);
                    if (el && (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA')) {
                        el.focus();
                        if (selectionStart !== null && selectionEnd !== null) {
                            try {
                                el.setSelectionRange(selectionStart, selectionEnd);
                            } catch (e) {}
                        }
                    }
                }
            });
        }

        if (!isUpdate) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        this.updateNotificationBadge();
        this.updateSidebarUser();
    },

    refreshCurrentPage() {
        this.handleRoute(true);
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
