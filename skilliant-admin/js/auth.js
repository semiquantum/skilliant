/**
 * Skilliant Admin Portal - Authentication Module
 * Handles login UI, session checking, remember me, forgot password.
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
            if (appContainer) appContainer.style.display = 'flex';
            if (loginContainer) loginContainer.style.display = 'none';
        } else {
            if (appContainer) appContainer.style.display = 'none';
            if (loginContainer) loginContainer.style.display = 'flex';
        }
    },

    bindEvents() {
        // Show/Hide password
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('loginPassword');
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', () => {
                const isText = passwordInput.type === 'text';
                passwordInput.type = isText ? 'password' : 'text';
                togglePassword.innerHTML = isText
                    ? '<i class="fa-solid fa-eye"></i>'
                    : '<i class="fa-solid fa-eye-slash"></i>';
            });
        }

        // Forgot Password
        const forgotLink = document.getElementById('forgotPasswordLink');
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                this._showForgotModal();
            });
        }

        // Login Form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this._handleLogin();
            });
        }

        // Note: Logout is handled by App.initHeader() to avoid duplicate listeners
        // Do NOT add another logoutBtn event listener here.
    },

    _handleLogin() {
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        const rememberMe = document.getElementById('rememberMe')?.checked || false;
        const submitBtn = document.getElementById('loginSubmitBtn');

        const email = emailInput?.value?.trim();
        const password = passwordInput?.value;

        // Validate inputs
        if (!email) {
            this._showFieldError(emailInput, 'Please enter your email address.');
            return;
        }
        if (!this._isValidEmail(email)) {
            this._showFieldError(emailInput, 'Please enter a valid email address.');
            return;
        }
        if (!password) {
            this._showFieldError(passwordInput, 'Please enter your password.');
            return;
        }

        // Show loading state
        if (submitBtn) {
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');
            submitBtn.disabled = true;
            if (btnText) btnText.textContent = 'Authenticating...';
            if (btnLoader) btnLoader.style.display = 'inline-block';
        }

        // Clear errors
        this._clearErrors();

        setTimeout(() => {
            const result = DataService.login(email, password, rememberMe);

            if (result.success) {
                // Update header with real session data
                const session = result.session;
                const nameEl = document.getElementById('headerName');
                const avatarEl = document.getElementById('headerAvatar');
                const parts = session.adminName.split(' ');
                if (nameEl) nameEl.textContent = parts[0] + (parts[1] ? ' ' + parts[1][0] + '.' : '');
                if (avatarEl) avatarEl.textContent = session.profilePhoto || parts.map(p => p[0]).join('');

                Toast.show(`Welcome back, ${session.adminName.split(' ')[0]}!`, 'success');
                this.checkAuth();
                if (window.App) {
                    window.App.initHeader();
                    window.App.updateSidebarUser();
                    window.App.refreshCurrentPage();
                }
            } else {
                Toast.show(result.message, 'error');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    const btnText = submitBtn.querySelector('.btn-text');
                    const btnLoader = submitBtn.querySelector('.btn-loader');
                    if (btnText) btnText.textContent = 'Sign In';
                    if (btnLoader) btnLoader.style.display = 'none';
                }
                // Shake animation on form
                const loginCard = document.querySelector('.login-card');
                if (loginCard) {
                    loginCard.style.animation = 'shake 0.4s ease';
                    setTimeout(() => loginCard.style.animation = '', 400);
                }
            }
        }, 700);
    },

    _showForgotModal() {
        // Use ModalManager if available, otherwise create inline
        if (window.ModalManager) {
            ModalManager.open({
                title: 'Reset Your Password',
                bodyHtml: `
                    <div style="display:flex;flex-direction:column;gap:1rem;">
                        <p style="font-size:0.9rem;color:var(--text-muted);line-height:1.6;">
                            Enter your administrator email address and we will send you a password reset link.
                        </p>
                        <div>
                            <label style="font-size:0.85rem;font-weight:600;">Email Address</label>
                            <input type="email" id="forgotEmail" class="form-control" style="width:100%;margin-top:4px;" placeholder="Enter your email address">
                        </div>
                        <div id="forgotMsg" style="display:none;"></div>
                    </div>
                `,
                submitText: 'Send Reset Link',
                onSubmit: () => {
                    const email = document.getElementById('forgotEmail')?.value?.trim();
                    if (!email) { Toast.show('Please enter your email address.', 'warning'); return; }
                    const admins = DataService.getCollection(DataService.KEYS.ADMINS);
                    const found = admins.find(a => a.email.toLowerCase() === email.toLowerCase());
                    if (found) {
                        // Note: No email service is connected in this frontend build.
                        // Password reset requires backend integration.
                        DataService.logActivity(`Password reset requested for ${email}`);
                        Toast.show('Password reset request logged. Backend email service pending integration.', 'info');
                    } else {
                        Toast.show('No account found with that email.', 'error');
                    }
                    ModalManager.close();
                }
            });
        }
    },

    _isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    _showFieldError(input, message) {
        if (!input) return;
        input.style.borderColor = 'var(--danger)';
        let errEl = input.parentNode.querySelector('.field-error');
        if (!errEl) {
            errEl = document.createElement('div');
            errEl.className = 'field-error';
            errEl.style.cssText = 'color:var(--danger);font-size:0.75rem;margin-top:4px;';
            input.parentNode.appendChild(errEl);
        }
        errEl.textContent = message;
    },

    _clearErrors() {
        document.querySelectorAll('.field-error').forEach(el => el.remove());
        document.querySelectorAll('#loginEmail, #loginPassword').forEach(el => {
            el.style.borderColor = '';
        });
    }
};

document.addEventListener('DOMContentLoaded', () => Auth.init());
