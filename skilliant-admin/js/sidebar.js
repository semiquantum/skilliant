/**
 * Skilliant Admin Portal - Sidebar & Header Interactions
 */

const Sidebar = {
    init() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarClose = document.getElementById('sidebarClose');
        const overlay = document.getElementById('sidebarOverlay');

        menuToggle?.addEventListener('click', () => {
            sidebar?.classList.add('mobile-open');
            overlay?.classList.add('active');
        });

        const closeSidebar = () => {
            sidebar?.classList.remove('mobile-open');
            overlay?.classList.remove('active');
        };

        sidebarClose?.addEventListener('click', closeSidebar);
        overlay?.addEventListener('click', closeSidebar);

        // Profile Dropdown Toggle
        const profileBtn = document.getElementById('headerProfileBtn');
        const dropdown = document.getElementById('profileDropdown');

        profileBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown?.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            dropdown?.classList.remove('show');
        });

        // Theme Toggle
        const themeBtn = document.getElementById('themeToggleBtn');
        themeBtn?.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            themeBtn.querySelector('.material-icons-round').textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
            Toast.show(`Switched to ${newTheme} theme mode`, 'info');
        });
    },

    setActiveNavItem(pageId) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('data-page') === pageId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update Breadcrumb
        const breadcrumb = document.getElementById('breadcrumb');
        if (breadcrumb) {
            const pageTitleFormatted = pageId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            breadcrumb.innerHTML = `
                <span class="material-icons-round">home</span>
                <span class="active-crumb">/ ${pageTitleFormatted}</span>
            `;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => Sidebar.init());
