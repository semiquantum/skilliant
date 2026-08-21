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
                togglePassword.setAttribute('aria-label', isText ? 'Show password' : 'Hide password');
                togglePassword.setAttribute('aria-pressed', String(!isText));
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
                    // The header is already initialized by App.init(). Re-initializing it
                    // here would attach duplicate listeners. Synchronize the session-driven
                    // UI immediately instead, so role changes take effect without a refresh.
                    window.App._updateHeaderProfile(session);
                    window.App.updateGreeting(session.adminName.split(' ')[0]);
                    window.App.updateSidebarUser();
                    DataService.ensureDay5ModulePermissions();
                    window.App.applyRoleVisibility();
                    window.App.updateNotificationBadge();

                    // Always start a newly authenticated session on the dashboard. This also
                    // prevents a restricted route from remaining visible from the previous account.
                    if (window.location.hash !== '#dashboard') {
                        window.location.hash = '#dashboard';
                    } else {
                        window.App.refreshCurrentPage();
                    }
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
        if (!window.ModalManager) return;
        ModalManager.open({
            title: 'Reset Your Password',
            bodyHtml: `
                <div style="display:flex;flex-direction:column;gap:1rem;">
                    <p style="font-size:.9rem;color:var(--text-muted);line-height:1.6;">
                        Enter the registered administrator email. The email must already exist in the administrator accounts.
                        This frontend build does not display fake/demo OTPs or reset tokens.
                    </p>
                    <div><label>Email Address</label><input type="email" id="forgotEmail" class="form-control" placeholder="Registered admin email" autocomplete="email"></div>
                    <div><label for="resetNewPassword">New Password</label><div class="input-with-icon password-field"><input type="password" id="resetNewPassword" class="form-control" autocomplete="new-password"><button type="button" class="password-toggle" data-password-target="resetNewPassword" aria-label="Show password" aria-pressed="false"><i class="fa-solid fa-eye"></i></button></div></div>
                    <div><label for="resetConfirmPassword">Confirm New Password</label><div class="input-with-icon password-field"><input type="password" id="resetConfirmPassword" class="form-control" autocomplete="new-password"><button type="button" class="password-toggle" data-password-target="resetConfirmPassword" aria-label="Show password" aria-pressed="false"><i class="fa-solid fa-eye"></i></button></div></div>
                </div>
            `,
            submitText: 'Reset Password',
            onOpen: () => {
                document.querySelectorAll('[data-password-target]').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const target = document.getElementById(btn.dataset.passwordTarget);
                        if (!target) return;
                        const visible = target.type === 'text';
                        target.type = visible ? 'password' : 'text';
                        btn.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
                        btn.setAttribute('aria-pressed', String(!visible));
                        btn.innerHTML = visible ? '<i class="fa-solid fa-eye"></i>' : '<i class="fa-solid fa-eye-slash"></i>';
                    });
                });
            },
            onSubmit: () => {
                const email = document.getElementById('forgotEmail')?.value?.trim().toLowerCase();
                const newPass = document.getElementById('resetNewPassword')?.value || '';
                const confirmPass = document.getElementById('resetConfirmPassword')?.value || '';
                if (!email || !this._isValidEmail(email)) return Toast.show('Enter a valid registered email address.', 'warning');
                const admins = DataService.getCollection(DataService.KEYS.ADMINS) || [];
                const found = admins.find(a => (a.email||'').toLowerCase() === email);
                if (!found) return Toast.show('No administrator account exists for that email.', 'error');
                if (newPass.length < 6) return Toast.show('Password must be at least 6 characters.', 'warning');
                if (newPass !== confirmPass) return Toast.show('Passwords do not match.', 'warning');
                found.password = DataService.hashPassword(newPass);
                DataService.setStorage(DataService.KEYS.ADMINS, admins);
                DataService.logActivity(`Password reset for administrator account ${email}`);
                Toast.show('Password reset successfully. You can now sign in.', 'success');
                ModalManager.close();
            }
        });
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
