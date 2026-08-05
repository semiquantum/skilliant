/**
 * Skilliant Admin Portal - Master Application Entry Point
 * SPA Hash Router, Global Search, and Route Dispatcher.
 */

const App = {
    pages: {
        'dashboard': DashboardPage,
        'users': UsersPage,
        'labour': LabourPage,
        'contractors': ContractorsPage,
        'categories': CategoriesPage,
        'skills': SkillsPage,
        'bookings': BookingsPage,
        'payments': PaymentsPage,
        'wallet': WalletPage,
        'reports': ReportsPage,
        'reviews': ReviewsPage,
        'revenue': RevenuePage,
        'booking-analytics': BookingAnalyticsPage,
        'user-growth': UserGrowthPage,
        'export-reports': ExportReportsPage,
        'notifications': NotificationsPage,
        'support-tickets': SupportTicketsPage,
        'settings': SettingsPage,
        'roles': RolesPage,
        'activity-logs': ActivityLogsPage
    },

    currentPage: 'dashboard',

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
        this.bindGlobalSearch();

        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            Toast.show('Logging out of Skilliant Admin Session...', 'info');
            setTimeout(() => {
                window.location.hash = '#dashboard';
            }, 1000);
        });
    },

    handleRoute() {
        const hash = window.location.hash.replace('#', '') || 'dashboard';
        const pageModule = this.pages[hash] || DashboardPage;
        this.currentPage = hash;

        Sidebar.setActiveNavItem(hash);

        const container = document.getElementById('mainContent');
        if (container) {
            container.innerHTML = pageModule.render();
            if (typeof pageModule.init === 'function') {
                requestAnimationFrame(() => pageModule.init());
            }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    refreshCurrentPage() {
        this.handleRoute();
    },

    bindGlobalSearch() {
        const searchInput = document.getElementById('globalSearchInput');
        searchInput?.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim().toLowerCase();
                if (!query) return;

                Toast.show(`Global search executed for: "${query}"`, 'info');
                
                // Route to users if user search, else bookings or dashboard
                if (query.includes('user') || query.includes('customer') || query.includes('@')) {
                    window.location.hash = '#users';
                } else if (query.includes('book') || query.includes('job') || query.includes('bk')) {
                    window.location.hash = '#bookings';
                } else if (query.includes('labour') || query.includes('mason') || query.includes('electric')) {
                    window.location.hash = '#labour';
                }
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
