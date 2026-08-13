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
        if (window.ModalManager) {
            ModalManager.open({
                title: 'Reset Your Password',
                bodyHtml: `
                    <div style="display:flex;flex-direction:column;gap:1rem;">
                        <p style="font-size:0.9rem;color:var(--text-muted);line-height:1.6;">
                            Enter your administrator email address to verify your account and initiate the reset process.
                        </p>
                        <div>
                            <label style="font-size:0.85rem;font-weight:600;">Email Address</label>
                            <input type="email" id="forgotEmail" class="form-control" style="width:100%;margin-top:4px;" placeholder="e.g. meetmhatre2006@gmail.com">
                        </div>
                    </div>
                `,
                submitText: 'Verify Account',
                onSubmit: () => {
                    const email = document.getElementById('forgotEmail')?.value?.trim();
                    if (!email) { Toast.show('Please enter your email address.', 'warning'); return; }
                    const admins = DataService.getCollection(DataService.KEYS.ADMINS);
                    const found = admins.find(a => a.email.toLowerCase() === email.toLowerCase());
                    if (!found) {
                        Toast.show('No account found with that email.', 'error');
                        return;
                    }

                    const token = 'SKILLIANT-DEMO-RESET-' + Math.random().toString(36).substring(2, 8).toUpperCase();
                    DataService.logActivity(`Password reset request verified for ${email}`);

                    const modalTitle = document.getElementById('modalTitle');
                    const modalBody = document.getElementById('modalBody');
                    const modalSubmitBtn = document.getElementById('modalSubmitBtn');

                    if (modalTitle) modalTitle.textContent = 'Account Verified (Demo Environment)';
                    if (modalBody) {
                        modalBody.innerHTML = `
                            <div style="display:flex;flex-direction:column;gap:1rem;font-size:0.9rem;">
                                <div style="background:var(--success-bg);border:1px solid var(--success);color:var(--success);padding:0.75rem 1rem;border-radius:8px;line-height:1.5;">
                                    <strong>Verification Successful!</strong><br>
                                    Account matches administrator database records.
                                </div>
                                <p style="color:var(--text-muted);line-height:1.5;margin:0;">
                                    Since this is a client-side demo environment with no email backend, a secure reset token has been generated:
                                </p>
                                <div style="background:var(--bg-main);border:1px solid var(--border-color);padding:0.6rem 1rem;border-radius:6px;font-family:monospace;text-align:center;font-size:1.1rem;font-weight:700;color:var(--primary-navy);">
                                    ${token}
                                </div>
                                <hr style="border:0;border-top:1px solid var(--border-color);margin:0.25rem 0;">
                                <div style="display:flex;flex-direction:column;gap:0.75rem;">
                                    <h4 style="font-weight:700;color:var(--primary-navy);margin:0;">Reset Your Password</h4>
                                    <div>
                                        <label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:4px;">New Password</label>
                                        <input type="password" id="resetNewPassword" class="form-control" style="width:100%;" placeholder="Enter new password">
                                    </div>
                                    <div>
                                        <label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:4px;">Confirm New Password</label>
                                        <input type="password" id="resetConfirmPassword" class="form-control" style="width:100%;" placeholder="Confirm new password">
                                    </div>
                                </div>
                            </div>
                        `;
                    }

                    if (modalSubmitBtn) {
                        modalSubmitBtn.textContent = 'Save New Password';
                        ModalManager.onSubmitCallback = () => {
                            const newPass = document.getElementById('resetNewPassword')?.value;
                            const confirmPass = document.getElementById('resetConfirmPassword')?.value;

                            if (!newPass) {
                                Toast.show('Please enter your new password.', 'warning');
                                return;
                            }
                            if (newPass.length < 4) {
                                Toast.show('Password must be at least 4 characters long.', 'warning');
                                return;
                            }
                            if (newPass !== confirmPass) {
                                Toast.show('Passwords do not match.', 'warning');
                                return;
                            }

                            // Update password (using hash simulation or direct update since dataService handles comparison)
                            const hashedPassword = DataService.hashPassword(newPass);
                            found.password = hashedPassword;
                            DataService.setStorage(DataService.KEYS.ADMINS, admins);

                            DataService.logActivity(`Reset password for administrator account: ${email}`);
                            Toast.show('Password updated successfully! You can now log in.', 'success');
                            ModalManager.close();
                        };
                    }
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
