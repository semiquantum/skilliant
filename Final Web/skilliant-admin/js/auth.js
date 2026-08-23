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
        if (forgotLink && !forgotLink._skilliantBound) {
            forgotLink._skilliantBound = true;
            forgotLink.type = 'button';
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openForgotPassword();
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

    openForgotPassword() {
        // Always use the in-app recovery dialog. Never fall back to the browser's
        // native prompt(), because password recovery must remain inside the
        // professional Admin Portal UI.
        if (window.ModalManager && typeof window.ModalManager.open === 'function') {
            this._showForgotModal();
            return;
        }

        // ModalManager should be available after DOMContentLoaded. If it is not,
        // show a visible in-page error instead of exposing a browser prompt.
        Toast?.show?.('Password recovery interface is still loading. Please try again.', 'warning');
    },

    _showForgotModal() {
        if (!window.ModalManager) return;
        this._clearOtpState();
        ModalManager.open({
            title: '',
            hideChrome: true,
            variant: 'forgot',
            bodyHtml: `
                <section class="recovery-screen" aria-labelledby="recoveryTitle">
                    <button type="button" class="recovery-close" id="recoveryCloseBtn" aria-label="Close password recovery"><i class="fa-solid fa-xmark"></i></button>
                    <div class="recovery-brand">
                        <div class="recovery-brand-mark"><i class="fa-solid fa-shield-halved"></i></div>
                        <span>Skilliant <small>ADMIN</small></span>
                    </div>
                    <div class="recovery-hero-icon"><i class="fa-solid fa-lock"></i></div>
                    <h1 id="recoveryTitle">Reset Your Password</h1>
                    <p class="recovery-subtitle">Enter your registered email address and we will send a secure verification code to regain access.</p>
                    <div class="recovery-progress" aria-label="Password reset progress">
                        <span class="active"><b>1</b> Account</span><i></i><span><b>2</b> Verify</span><i></i><span><b>3</b> Reset</span>
                    </div>
                    <div class="recovery-form-block">
                        <label for="forgotEmail">Email Address <em>*</em></label>
                        <div class="recovery-input-wrap"><i class="fa-regular fa-envelope"></i><input type="email" id="forgotEmail" class="recovery-input" placeholder="name@example.com" autocomplete="email" spellcheck="false"></div>
                        <div class="recovery-hint"><i class="fa-solid fa-circle-info"></i><span>Only an existing authorized Admin account can request a verification code.</span></div>
                    </div>
                    <div id="forgotStatus" class="recovery-live-status" aria-live="polite"></div>
                    <button type="button" id="recoveryActionBtn" class="recovery-primary-btn"><span>Send Verification Code</span><i class="fa-solid fa-arrow-right"></i></button>
                    <button type="button" id="recoveryBackBtn" class="recovery-back-btn"><i class="fa-solid fa-arrow-left"></i> Back to Login</button>
                    <p class="recovery-security"><i class="fa-solid fa-shield-halved"></i> Protected by Skilliant Platform Authentication</p>
                </section>`,
            onSubmit: () => this._beginOtpReset()
        });
        setTimeout(() => {
            document.getElementById('recoveryCloseBtn')?.addEventListener('click', () => ModalManager.close());
            document.getElementById('recoveryBackBtn')?.addEventListener('click', () => ModalManager.close());
            document.getElementById('recoveryActionBtn')?.addEventListener('click', () => this._beginOtpReset());
            document.getElementById('forgotEmail')?.addEventListener('keydown', e => { if (e.key === 'Enter') this._beginOtpReset(); });
            document.getElementById('forgotEmail')?.focus();
        }, 50);
    },

    async _beginOtpReset(emailOverride) {
        const email = String(emailOverride ?? document.getElementById('forgotEmail')?.value ?? '').trim().toLowerCase();
        const status = document.getElementById('forgotStatus');
        const submit = document.getElementById('recoveryActionBtn') || document.getElementById('modalSubmitBtn');

        if (!email || !this._isValidEmail(email)) {
            return this._setRecoveryStatus('error', 'Enter a valid registered Admin email address.', 'fa-circle-exclamation');
        }

        // Always resolve the recipient from the CURRENT Admin Management data.
        // Never hardcode one email: newly-created/edited Admin and Financial Admin
        // accounts become eligible automatically while their record is Active.
        const found = typeof DataService.getAuthorizedAdminByEmail === 'function'
            ? DataService.getAuthorizedAdminByEmail(email)
            : (DataService.getCollection(DataService.KEYS.ADMINS) || []).find(a =>
                String(a.email || '').trim().toLowerCase() === email && String(a.status || 'Active').toLowerCase() === 'active'
              );
        if (!found) {
            this._clearOtpState();
            if (submit) submit.disabled = false;
            return this._accountPopup('Account Not Found', 'This email is not associated with an authorized Admin account. No verification code has been sent.', 'error');
        }

        if (!window.SkilliantEmail || !window.SkilliantEmail.isConfigured()) {
            return this._accountPopup('Email Service Not Ready', 'The Admin account was verified, but the EmailJS service is not configured. Check js/email-config.js.', 'error');
        }

        // Lock the action while delivery is in progress. This prevents duplicate OTPs.
        if (submit) {
            submit.disabled = true;
            submit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending verification code…';
        }
        if (status) status.innerHTML = `<div class="recovery-status-card sending"><span class="status-spinner"><i class="fa-solid fa-circle-notch fa-spin"></i></span><div><strong>Sending verification code</strong><span>Verifying your account and delivering a secure code to ${this._escape(this._maskEmail(email))}…</span></div></div>`;

        // Generate exactly one fresh OTP only after the email is confirmed to
        // belong to an active Admin record. A new request invalidates the previous OTP.
        const otp = this._generateOtp();
        const expiresAt = Date.now() + 60000;
        this._clearOtpState();
        const state = {
            adminId: found.id,
            email: String(found.email || email).trim().toLowerCase(),
            adminName: found.name || 'Admin',
            adminRole: found.role || 'Admin',
            otp,
            expiresAt,
            verified: false,
            sent: false,
            createdAt: Date.now()
        };
        sessionStorage.setItem('skilliant_admin_reset_otp', JSON.stringify(state));

        try {
            // Delivery is automatic: no mail client/compose window and no manual
            // send action is used. EmailJS sends from the configured Gmail service
            // to the already-authorized Admin email address.
            await window.SkilliantEmail.sendOtp({
                toEmail: found.email,
                otp,
                expiresInSeconds: 60,
                adminName: found.name || found.adminName || 'Admin'
            });
            state.sent = true;
            sessionStorage.setItem('skilliant_admin_reset_otp', JSON.stringify(state));
            this._showOtpModal(email);
        } catch (err) {
            console.error('OTP delivery failed:', err);
            this._clearOtpState();
            if (submit) {
                submit.disabled = false;
                submit.textContent = 'Verify Admin Account';
            }
            const detail = err?.text || err?.message || 'Email delivery failed. Check EmailJS Email History for the exact reason.';
            if (status) status.innerHTML = `<div class="recovery-status-card error"><i class="fa-solid fa-triangle-exclamation"></i><div><strong>Verification email could not be sent</strong><span>${this._escape(detail)}</span></div></div>`;
            return;
        }
    },

    _showOtpModal(email) {
        ModalManager.open({
            title: '', hideChrome: true, variant: 'otp',
            bodyHtml: `
                <section class="recovery-screen otp-screen" aria-labelledby="otpTitle">
                    <button type="button" class="recovery-close" id="recoveryCloseBtn" aria-label="Close password recovery"><i class="fa-solid fa-xmark"></i></button>
                    <div class="recovery-brand"><div class="recovery-brand-mark"><i class="fa-solid fa-shield-halved"></i></div><span>Skilliant <small>ADMIN</small></span></div>
                    <div class="recovery-hero-icon success"><i class="fa-regular fa-envelope"></i></div>
                    <div class="verified-badge"><i class="fa-solid fa-circle-check"></i> Verification email sent</div>
                    <h1 id="otpTitle">Verify Your Email</h1>
                    <p class="recovery-subtitle">We've sent a 6-digit confirmation code to <strong>${this._escape(this._maskEmail(email))}</strong>. Enter it below to continue.</p>
                    <div class="otp-delivery-card"><i class="fa-solid fa-paper-plane"></i><div><strong>Check your inbox</strong><span>Also check Spam or Promotions if you don't see it.</span></div></div>
                    <div class="otp-boxes" id="otpBoxes" aria-label="6 digit verification code">${Array.from({length:6},(_,i)=>`<input class="otp-box" maxlength="1" inputmode="numeric" autocomplete="one-time-code" aria-label="Digit ${i+1}" data-index="${i}">`).join('')}</div>
                    <div class="otp-meta-row"><span>Code expires in <strong id="otpTimer">01:00</strong></span><button type="button" id="resendOtpBtn" class="recovery-link-btn" disabled>Resend Code</button></div>
                    <div id="otpInlineStatus" class="recovery-live-status" aria-live="polite"></div>
                    <button type="button" id="recoveryActionBtn" class="recovery-primary-btn"><span>Verify &amp; Continue</span><i class="fa-solid fa-arrow-right"></i></button>
                    <button type="button" id="recoveryBackBtn" class="recovery-back-btn"><i class="fa-solid fa-arrow-left"></i> Back to Email</button>
                </section>`,
            onSubmit: () => this._verifyOtp()
        });
        this._startOtpTimer();
        setTimeout(() => {
            document.getElementById('recoveryCloseBtn')?.addEventListener('click', () => { this._clearOtpState(); ModalManager.close(); });
            document.getElementById('recoveryBackBtn')?.addEventListener('click', () => this._showForgotModal());
            document.getElementById('recoveryActionBtn')?.addEventListener('click', () => this._verifyOtp());
            document.getElementById('resendOtpBtn')?.addEventListener('click', () => this._beginOtpResetFromSession());
            const boxes=[...document.querySelectorAll('.otp-box')];
            boxes.forEach((input,i)=>{
                input.addEventListener('input',()=>{ input.value=input.value.replace(/\D/g,'').slice(0,1); if(input.value && boxes[i+1]) boxes[i+1].focus(); document.getElementById('otpInlineStatus').textContent=''; });
                input.addEventListener('keydown',e=>{ if(e.key==='Backspace'&&!input.value&&boxes[i-1]) boxes[i-1].focus(); });
                input.addEventListener('paste',e=>{ const text=(e.clipboardData||window.clipboardData).getData('text').replace(/\D/g,'').slice(0,6); if(text){e.preventDefault(); text.split('').forEach((d,j)=>{if(boxes[j])boxes[j].value=d;}); boxes[Math.min(text.length,6)-1]?.focus();} });
            });
            boxes[0]?.focus();
        }, 50);
    },

    async _beginOtpResetFromSession() {
        const state = this._getOtpState();
        if (!state?.email) return this._showForgotModal();
        const admins = DataService.getCollection(DataService.KEYS.ADMINS) || [];
        const found = admins.find(a => a.id === state.adminId && String(a.email || '').trim().toLowerCase() === state.email && a.status !== 'Inactive');
        if (!found) return this._showForgotModal();
        return this._beginOtpReset(state.email);
    },

    _verifyOtp() {
        const state = this._getOtpState();
        const entered = [...document.querySelectorAll('.otp-box')].map(el => el.value).join('').trim();
        const inline = document.getElementById('otpInlineStatus');
        if (!state || !state.sent) return this._accountPopup('Verification Unavailable', 'No active verification code is available. Start the recovery process again.', 'error');
        if (Date.now() >= state.expiresAt) {
            if (inline) inline.innerHTML = '<span class="status-error"><i class="fa-solid fa-clock"></i> This code has expired. Request a new code.</span>';
            return this._accountPopup('OTP Expired', 'This verification code has expired. Generate a new OTP to continue.', 'error');
        }
        if (!/^\d{6}$/.test(entered || '') || entered !== state.otp) {
            if (inline) inline.innerHTML = '<span class="status-error"><i class="fa-solid fa-circle-exclamation"></i> Incorrect verification code.</span>';
            return this._accountPopup('Invalid Verification Code', 'The code you entered is incorrect. Please check the email and try again.', 'error');
        }
        state.verified = true; state.verifiedAt = Date.now();
        sessionStorage.setItem('skilliant_admin_reset_otp', JSON.stringify(state));
        if (this._otpTimer) clearInterval(this._otpTimer);
        this._showNewPasswordModal();
    },

    _showNewPasswordModal() {
        const state = this._getOtpState();
        if (!state?.verified || !state.sent || Date.now() >= state.expiresAt) return this._showForgotModal();
        ModalManager.open({
            title: '', hideChrome: true, variant: 'reset',
            bodyHtml: `
                <section class="recovery-screen reset-screen" aria-labelledby="resetTitle">
                    <button type="button" class="recovery-close" id="recoveryCloseBtn" aria-label="Close password recovery"><i class="fa-solid fa-xmark"></i></button>
                    <div class="recovery-brand"><div class="recovery-brand-mark"><i class="fa-solid fa-shield-halved"></i></div><span>Skilliant <small>ADMIN</small></span></div>
                    <div class="recovery-hero-icon success"><i class="fa-solid fa-lock"></i></div>
                    <div class="verified-badge"><i class="fa-solid fa-circle-check"></i> Identity verified</div>
                    <h1 id="resetTitle">Create New Password</h1>
                    <p class="recovery-subtitle">Your identity has been verified. Create a strong new password for your Admin account.</p>
                    <div class="recovery-form-block"><label for="resetNewPassword">New Password <em>*</em></label><div class="recovery-input-wrap"><i class="fa-solid fa-lock"></i><input type="password" id="resetNewPassword" class="recovery-input" minlength="8" autocomplete="new-password" placeholder="Enter a new password"><button type="button" class="recovery-eye" data-target="resetNewPassword"><i class="fa-solid fa-eye"></i></button></div></div>
                    <div class="recovery-form-block"><label for="resetConfirmPassword">Confirm New Password <em>*</em></label><div class="recovery-input-wrap"><i class="fa-solid fa-lock"></i><input type="password" id="resetConfirmPassword" class="recovery-input" minlength="8" autocomplete="new-password" placeholder="Re-enter your new password"><button type="button" class="recovery-eye" data-target="resetConfirmPassword"><i class="fa-solid fa-eye"></i></button></div></div>
                    <div class="password-strength-list"><span><i class="fa-solid fa-check"></i> Minimum 8 characters</span><span><i class="fa-solid fa-check"></i> Passwords must match</span></div>
                    <div id="resetInlineStatus" class="recovery-live-status" aria-live="polite"></div>
                    <button type="button" id="recoveryActionBtn" class="recovery-primary-btn"><span>Reset Password</span><i class="fa-solid fa-check"></i></button>
                    <button type="button" id="recoveryBackBtn" class="recovery-back-btn"><i class="fa-solid fa-arrow-left"></i> Back to Verification</button>
                    <p class="recovery-security"><i class="fa-solid fa-shield-halved"></i> Your new password is stored securely.</p>
                </section>`,
            onSubmit: () => this._completePasswordReset()
        });
        setTimeout(() => {
            document.getElementById('recoveryCloseBtn')?.addEventListener('click', () => { this._clearOtpState(); ModalManager.close(); });
            document.getElementById('recoveryBackBtn')?.addEventListener('click', () => this._showOtpModal(state.email));
            document.getElementById('recoveryActionBtn')?.addEventListener('click', () => this._completePasswordReset());
            document.querySelectorAll('.recovery-eye').forEach(btn => btn.addEventListener('click', () => { const input=document.getElementById(btn.dataset.target); if(!input)return; const show=input.type==='password'; input.type=show?'text':'password'; btn.innerHTML=`<i class="fa-solid ${show?'fa-eye-slash':'fa-eye'}"></i>`; }));
            document.getElementById('resetNewPassword')?.focus();
        },50);
    },

    _completePasswordReset() {
        const state = this._getOtpState();
        if (!state?.verified || !state.sent || Date.now() >= state.expiresAt) return this._accountPopup('Session Expired', 'OTP verification expired. Start the recovery process again.', 'error');
        const pass = document.getElementById('resetNewPassword')?.value || '';
        const confirm = document.getElementById('resetConfirmPassword')?.value || '';
        if (pass.length < 8) return this._accountPopup('Password Too Short', 'Use at least 8 characters for the new password.', 'warning');
        if (pass !== confirm) return this._accountPopup('Passwords Do Not Match', 'Enter the same password in both fields.', 'warning');
        const admins = DataService.getCollection(DataService.KEYS.ADMINS) || [];
        const found = admins.find(a => a.id === state.adminId && String(a.email||'').trim().toLowerCase() === state.email && a.status !== 'Inactive');
        if (!found) { this._clearOtpState(); return this._accountPopup('Account Not Found', 'The authorized Admin account no longer exists.', 'error'); }
        found.password = DataService.hashPassword(pass);
        DataService.setStorage(DataService.KEYS.ADMINS, admins);
        DataService.logActivity(`Password reset for administrator account ${state.email}`);
        this._clearOtpState();
        ModalManager.close();
        Toast.show('Password reset successfully. Sign in with your new password.', 'success');
    },

    _startOtpTimer() {
        if (this._otpTimer) clearInterval(this._otpTimer);
        const tick = () => {
            const state = this._getOtpState();
            const left = state ? Math.max(0, Math.ceil((state.expiresAt - Date.now()) / 1000)) : 0;
            const timer = document.getElementById('otpTimer');
            if (timer) {
                timer.textContent = `00:${String(left).padStart(2,'0')}`;
                timer.classList.toggle('expired', left <= 0);
            }
            const resend = document.getElementById('resendOtpBtn');
            if (resend) resend.disabled = left > 0;
            const expiryText = document.getElementById('otpExpiryText');
            if (expiryText) expiryText.textContent = left > 0 ? 'Code remains valid' : 'Code expired — request a new one';
            if (left <= 0 && this._otpTimer) { clearInterval(this._otpTimer); this._otpTimer = null; }
        };
        tick(); this._otpTimer = setInterval(tick, 250);
    },

    _generateOtp() {
        // Use the browser crypto API when available rather than Math.random().
        // This remains frontend-only while producing a stronger one-time code.
        if (window.crypto?.getRandomValues) {
            const bytes = new Uint32Array(1);
            window.crypto.getRandomValues(bytes);
            return String(100000 + (bytes[0] % 900000));
        }
        return String(Math.floor(100000 + Math.random() * 900000));
    },

    _maskEmail(email) {
        const [local, domain] = String(email).split('@');
        if (!local || !domain) return email;
        const visible = local.length <= 2 ? local[0] : local.slice(0, 2);
        return `${visible}${'•'.repeat(Math.max(1, local.length - visible.length))}@${domain}`;
    },

    _getOtpState() { try { return JSON.parse(sessionStorage.getItem('skilliant_admin_reset_otp') || 'null'); } catch { return null; } },
    _clearOtpState() { if (this._otpTimer) clearInterval(this._otpTimer); this._otpTimer=null; sessionStorage.removeItem('skilliant_admin_reset_otp'); },
    _escape(v) { const d=document.createElement('div'); d.textContent=String(v??''); return d.innerHTML; },
    _accountPopup(title, message, type='info') {
        // Keep recovery feedback inside the professional recovery screen.
        // Never use the browser's native alert/prompt UI.
        if (document.getElementById('modalOverlay')?.classList.contains('recovery-overlay')) {
            const target = document.getElementById('recovery-live-status') || document.getElementById('forgotStatus') || document.getElementById('otpInlineStatus') || document.getElementById('resetInlineStatus');
            if (target) {
                const icon = type === 'error' ? 'fa-circle-exclamation' : type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-info';
                target.innerHTML = `<div class="recovery-status-card ${type === 'error' ? 'error' : ''}"><i class="fa-solid ${icon}"></i><div><strong>${this._escape(title)}</strong><span>${this._escape(message)}</span></div></div>`;
                // Keep feedback inside the recovery layout; never auto-scroll the modal.
                target.closest('.recovery-screen')?.classList.add('has-status');
            }
            return;
        }
        ModalManager.open({ title, bodyHtml:`<div style="padding:.25rem 0;line-height:1.6;">${this._escape(message)}</div>`, submitText:'OK', onSubmit:()=>ModalManager.close() });
        if (window.Toast) Toast.show(message, type);
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

window.Auth = Auth;
document.addEventListener('DOMContentLoaded', () => Auth.init());
