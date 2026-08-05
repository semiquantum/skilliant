/**
 * Skilliant Admin Portal - Authentication Module
 * Handles Login UI, session checking, and logout.
 */

const Auth = {
    init() {
        this.checkAuth();
        this.bindEvents();
    },

    checkAuth() {
        const appContainer = document.querySelector('.app-container');
        const loginContainer = document.getElementById('loginContainer');
        
        if (DataService.isAuthenticated()) {
            if(appContainer) appContainer.style.display = 'flex';
            if(loginContainer) loginContainer.style.display = 'none';
        } else {
            if(appContainer) appContainer.style.display = 'none';
            if(loginContainer) loginContainer.style.display = 'flex';
        }
    },

    bindEvents() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                
                const result = DataService.login(email, password);
                if (result.success) {
                    Toast.show('Login successful!', 'success');
                    this.checkAuth();
                    // Re-initialize app to ensure dashboard is loaded
                    if(window.App && typeof window.App.refreshCurrentPage === 'function'){
                        window.App.refreshCurrentPage();
                    }
                } else {
                    Toast.show(result.message, 'error');
                }
            });
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            // Remove previous event listener if any (app.js was doing this)
            const newLogoutBtn = logoutBtn.cloneNode(true);
            logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
            
            newLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                Toast.show('Logging out of Skilliant Admin Session...', 'info');
                DataService.logout();
                setTimeout(() => {
                    this.checkAuth();
                    window.location.hash = '#dashboard';
                }, 1000);
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => Auth.init());
