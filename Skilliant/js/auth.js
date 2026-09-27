/**
 * Skilliant Admin Portal - Supabase Authentication
 *
 * Authentication: Supabase Auth (email/password + Google OAuth)
 * Authorization: public.admin_users (server-enforced by RLS)
 * Password reset OTP: Supabase Edge Functions + email provider
 *
 * IMPORTANT: never put a Supabase service_role/secret key in this frontend.
 */
const Auth = {
    supabase: null,
    initialized: false,
    _authCheckInFlight: false,
    _handledSessionUserId: null,

    async init() {
        this._initSupabase();
        // Supabase is the source of truth. Never trust a stale browser session.
        if (this.supabase) DataService.logout();
        this._showLogin();
        this.bindEvents();
        if (!this.supabase) return;

        this.supabase.auth.onAuthStateChange((event, session) => {
            // Defer network/database work outside the auth callback to avoid deadlocks.
            setTimeout(() => this._handleAuthEvent(event, session), 0);
        });

        const { data, error } = await this.supabase.auth.getSession();
        if (error) {
            console.error('Supabase session error:', error);
            this._showLogin();
            return;
        }

        if (data.session?.user) {
            await this._completeSupabaseLogin(data.session.user, 'INITIAL_SESSION');
        } else {
            this._showLogin();
        }
        this.initialized = true;
    },

    _initSupabase() {
        const cfg = window.SKILLIANT_SUPABASE;
        if (!window.supabase || !cfg?.url || !cfg?.publishableKey || cfg.url.includes('YOUR_SUPABASE')) {
            console.error('Supabase is not configured. Update js/supabase-config.js or environment placeholders.');
            return;
        }
        this.supabase = window.supabase.createClient(cfg.url, cfg.publishableKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
                flowType: 'pkce'
            }
        });
    },

    async _handleAuthEvent(event, session) {
        if (event === 'SIGNED_OUT') {
            DataService.logout();
            this._showLogin();
            return;
        }
        if (session?.user && ['SIGNED_IN', 'INITIAL_SESSION', 'TOKEN_REFRESHED', 'USER_UPDATED'].includes(event)) {
            await this._completeSupabaseLogin(session.user, event);
        }
    },

    _showLogin() {
        const appContainer = document.querySelector('.app-container');
        const loginContainer = document.getElementById('loginContainer');
        if (appContainer) appContainer.style.display = 'none';
        if (loginContainer) loginContainer.style.display = 'flex';
    },

    _showApp() {
        const appContainer = document.querySelector('.app-container');
        const loginContainer = document.getElementById('loginContainer');
        if (appContainer) appContainer.style.display = 'flex';
        if (loginContainer) loginContainer.style.display = 'none';
    },

    checkAuth() {
        if (this.supabase) {
            // Supabase session is the source of truth. UI is switched after authorization.
            if (DataService.isAuthenticated()) this._showApp();
            else this._showLogin();
            return;
        }
        this._showLogin();
    },

    bindEvents() {
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

        document.getElementById('forgotPasswordLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this._showForgotModal();
        });
        document.getElementById('verifyEmailLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this._showEmailVerificationModal();
        });
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this._handleLogin();
        });
        document.getElementById('googleLoginBtn')?.addEventListener('click', () => this._handleGoogleLogin());
    },

    async _handleGoogleLogin() {
        if (!this.supabase) return Toast.show('Supabase is not configured.', 'error');
        const btn = document.getElementById('googleLoginBtn');
        if (btn) btn.disabled = true;
        this._clearErrors();
        const redirectTo = window.location.origin + window.location.pathname;
        const { error } = await this.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo, queryParams: { access_type: 'offline', prompt: 'select_account' } }
        });
        if (error) {
            Toast.show(error.message || 'Google sign-in could not be started.', 'error');
            if (btn) btn.disabled = false;
        }
    },

    async _handleLogin() {
        if (!this.supabase) return Toast.show('Supabase is not configured.', 'error');
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        const email = emailInput?.value?.trim().toLowerCase();
        const password = passwordInput?.value || '';
        const rememberMe = document.getElementById('rememberMe')?.checked || false;
        const submitBtn = document.getElementById('loginSubmitBtn');

        this._clearErrors();
        if (!email) return this._showFieldError(emailInput, 'Please enter your email address.');
        if (!this._isValidEmail(email)) return this._showFieldError(emailInput, 'Please enter a valid email address.');
        if (!password) return this._showFieldError(passwordInput, 'Please enter your password.');

        this._setLoginLoading(true, submitBtn);
        const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
        if (error) {
            const notConfirmed = /email not confirmed/i.test(error.message || '');
            Toast.show(notConfirmed ? 'Please verify your email before signing in.' : 'Invalid email or password, or this account is not ready for access.', notConfirmed ? 'warning' : 'error');
            if (notConfirmed) this._showEmailVerificationModal(email);
            this._setLoginLoading(false, submitBtn);
            return;
        }
        const ok = await this._completeSupabaseLogin(data.user, 'PASSWORD_LOGIN', rememberMe);
        if (!ok) await this.supabase.auth.signOut();
        this._setLoginLoading(false, submitBtn);
    },

    async _completeSupabaseLogin(user, event = 'LOGIN', rememberMe = false) {
        if (!user || !this.supabase) return false;
        if (this._authCheckInFlight && this._handledSessionUserId === user.id) return false;
        this._authCheckInFlight = true;
        this._handledSessionUserId = user.id;

        try {
            // Supabase Auth must confirm the email. Google users normally arrive verified by Google.
            if (!user.email_confirmed_at) {
                Toast.show('Please verify your email address before accessing the admin portal.', 'warning');
                await this.supabase.auth.signOut();
                return false;
            }

            const { data: admin, error } = await this.supabase
                .from('admin_users')
                .select('id,email,full_name,role,status,profile_photo,email_verified')
                .eq('id', user.id)
                .maybeSingle();

            if (error) {
                console.error('Admin authorization query failed:', error);
                Toast.show('Unable to verify administrator authorization.', 'error');
                await this.supabase.auth.signOut();
                return false;
            }

            if (!admin || admin.status !== 'Active') {
                Toast.show('This account is not authorized to access the Skilliant Admin Portal.', 'error');
                await this.supabase.auth.signOut();
                return false;
            }

            const now = new Date().toISOString();
            const session = {
                authenticated: true,
                adminId: admin.id,
                adminName: admin.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Administrator',
                adminEmail: admin.email || user.email,
                role: admin.role || 'Admin',
                profilePhoto: admin.profile_photo || (admin.full_name || 'A').split(' ').map(p => p[0]).join('').toUpperCase(),
                loginTime: now,
                supabaseUserId: user.id,
                provider: user.app_metadata?.provider || 'email'
            };

            DataService.setStorage(DataService.KEYS.SESSION, session);
            if (admin.role === 'Super Admin') await this.syncAdminDirectory();
            await DataService.syncAllFromSupabase();
            if (rememberMe) localStorage.setItem('skilliant_remember_me', 'true');
            else localStorage.removeItem('skilliant_remember_me');

            const nameEl = document.getElementById('headerName');
            const avatarEl = document.getElementById('headerAvatar');
            const parts = session.adminName.split(' ');
            if (nameEl) nameEl.textContent = parts[0] + (parts[1] ? ' ' + parts[1][0] + '.' : '');
            if (avatarEl) avatarEl.textContent = session.profilePhoto;

            this._showApp();
            if (window.App) {
                window.App._updateHeaderProfile(session);
                window.App.updateGreeting(parts[0]);
                window.App.updateSidebarUser();
                DataService.ensureDay5ModulePermissions();
                window.App.applyRoleVisibility();
                window.App.updateNotificationBadge();
                window.location.hash = '#dashboard';
            }
            if (event !== 'INITIAL_SESSION' && event !== 'TOKEN_REFRESHED') Toast.show(`Welcome back, ${parts[0]}!`, 'success');
            return true;
        } finally {
            this._authCheckInFlight = false;
        }
    },

    async syncAdminDirectory() {
        if (!this.supabase || DataService.getSession()?.role !== 'Super Admin') return false;
        const result = await this._edge('list-admins', {});
        if (!result.ok || !Array.isArray(result.admins)) {
            console.warn('Admin directory sync failed:', result.message);
            return false;
        }
        const mapped = result.admins.map(a => ({
            id: a.id,
            name: a.full_name || 'Administrator',
            email: a.email,
            role: a.role,
            status: a.status,
            profilePhoto: a.profile_photo || (a.full_name || 'A').split(' ').map(p => p[0]).join('').toUpperCase().slice(0,2),
            emailVerified: !!a.email_verified,
            lastLogin: a.lastLogin || '',
            createdAt: a.created_at || ''
        }));
        DataService.setStorage(DataService.KEYS.ADMINS, mapped);
        return true;
    },

    async signOut() {
        if (this.supabase) await this.supabase.auth.signOut();
        DataService.logout();
        this._showLogin();
        window.location.hash = '';
    },

    async _showEmailVerificationModal(prefillEmail = '') {
        if (!window.ModalManager) return;
        let step = 1;
        let email = prefillEmail || '';
        ModalManager.open({
            title: 'Verify Administrator Email',
            bodyHtml: `<div class="auth-modal-stack">
                <p class="auth-help">Enter the authorized administrator email. If eligible, a 6-digit verification code will be sent to that mailbox.</p>
                <label for="verifyEmail">Email Address</label>
                <input type="email" id="verifyEmail" class="form-control" value="${email.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;')}" placeholder="Registered admin email" autocomplete="email">
                <div id="verifyOtpStep" style="display:none">
                    <label for="verifyOtp">Verification Code</label>
                    <input inputmode="numeric" maxlength="6" id="verifyOtp" class="form-control" placeholder="6-digit OTP" autocomplete="one-time-code">
                </div>
                <p id="verifyStatus" class="auth-help" aria-live="polite"></p>
            </div>`,
            submitText: 'Send OTP',
            onSubmit: async () => {
                if (step === 1) {
                    email = document.getElementById('verifyEmail')?.value?.trim().toLowerCase();
                    if (!email || !this._isValidEmail(email)) return Toast.show('Enter a valid administrator email address.', 'warning');
                    const result = await this._edge('request-email-otp', { email });
                    if (!result.ok) return Toast.show(result.message || 'Unable to request verification code.', 'error');
                    step = 2;
                    document.getElementById('verifyOtpStep').style.display = 'block';
                    document.getElementById('verifyEmail').disabled = true;
                    document.getElementById('verifyStatus').textContent = 'If the account is eligible, a verification code has been sent.';
                    ModalManager.submitBtn.textContent = 'Verify Email';
                    return;
                }
                const otp = document.getElementById('verifyOtp')?.value?.trim();
                if (!/^\d{6}$/.test(otp || '')) return Toast.show('Enter the 6-digit OTP.', 'warning');
                ModalManager.submitBtn.disabled = true;
                const result = await this._edge('verify-email-otp', { email, otp });
                ModalManager.submitBtn.disabled = false;
                if (!result.ok) return Toast.show(result.message || 'Verification failed.', 'error');
                Toast.show('Email verified. You can now sign in.', 'success');
                ModalManager.close();
            }
        });
    },

    async _showForgotModal() {
        if (!window.ModalManager) return;
        let step = 1;
        let email = '';
        let resetToken = '';
        ModalManager.open({
            title: 'Reset Your Password',
            bodyHtml: `<div class="auth-modal-stack">
                <div id="forgotEmailStep">
                    <p class="auth-help">Enter the email address already authorized for the Skilliant Admin Portal. A 6-digit OTP will be sent to that mailbox.</p>
                    <label for="forgotEmail">Email Address</label>
                    <input type="email" id="forgotEmail" class="form-control" placeholder="Registered admin email" autocomplete="email">
                </div>
                <div id="forgotOtpStep" style="display:none">
                    <p class="auth-help">Check your email and enter the 6-digit verification code.</p>
                    <label for="forgotOtp">Verification Code</label>
                    <input inputmode="numeric" maxlength="6" id="forgotOtp" class="form-control" placeholder="6-digit OTP" autocomplete="one-time-code">
                    <button type="button" id="forgotResendOtp" class="forgot-resend" style="margin-top:.65rem">Resend OTP</button>
                </div>
                <div id="forgotPasswordStep" style="display:none">
                    <p class="auth-help">OTP verified. Create a new password for your administrator account.</p>
                    <label for="forgotNewPassword">New Password</label>
                    <input type="password" id="forgotNewPassword" class="form-control" placeholder="New password" autocomplete="new-password">
                    <label for="forgotConfirmPassword" style="margin-top:.75rem">Confirm Password</label>
                    <input type="password" id="forgotConfirmPassword" class="form-control" placeholder="Confirm password" autocomplete="new-password">
                </div>
                <p id="forgotStatus" class="auth-help" aria-live="polite"></p>
            </div>`,
            submitText: 'Send OTP',
            onSubmit: async () => {
                if (step === 1) {
                    email = document.getElementById('forgotEmail')?.value?.trim().toLowerCase();
                    if (!email || !this._isValidEmail(email)) return Toast.show('Enter a valid administrator email address.', 'warning');
                    ModalManager.submitBtn.disabled = true;
                    const result = await this._edge('request-password-otp', { email });
                    ModalManager.submitBtn.disabled = false;
                    if (!result.ok) return Toast.show(result.message || 'Unable to request OTP.', 'error');
                    step = 2;
                    document.getElementById('forgotEmailStep').style.display = 'none';
                    document.getElementById('forgotOtpStep').style.display = 'block';
                    document.getElementById('forgotStatus').textContent = 'If the account is eligible, a 6-digit OTP has been sent to your email. It expires in 10 minutes.';
                    ModalManager.submitBtn.textContent = 'Verify OTP';
                    document.getElementById('forgotOtp')?.focus();
                    return;
                }

                if (step === 2) {
                    const otp = document.getElementById('forgotOtp')?.value?.trim();
                    if (!/^\d{6}$/.test(otp || '')) return Toast.show('Enter the 6-digit OTP.', 'warning');
                    ModalManager.submitBtn.disabled = true;
                    const result = await this._edge('verify-password-otp', { email, otp });
                    ModalManager.submitBtn.disabled = false;
                    if (!result.ok) return Toast.show(result.message || 'OTP verification failed.', 'error');
                    resetToken = result.resetToken || '';
                    if (!resetToken) return Toast.show('OTP verification completed but no reset authorization was returned.', 'error');
                    step = 3;
                    document.getElementById('forgotOtpStep').style.display = 'none';
                    document.getElementById('forgotPasswordStep').style.display = 'block';
                    document.getElementById('forgotStatus').textContent = 'OTP verified successfully. You may now set a new password.';
                    ModalManager.submitBtn.textContent = 'Reset Password';
                    document.getElementById('forgotNewPassword')?.focus();
                    return;
                }

                const password = document.getElementById('forgotNewPassword')?.value || '';
                const confirm = document.getElementById('forgotConfirmPassword')?.value || '';
                if (!this._isStrongPassword(password)) return Toast.show('Password must be at least 8 characters and include uppercase, lowercase, and a number.', 'warning');
                if (password !== confirm) return Toast.show('Passwords do not match.', 'warning');
                if (!resetToken) return Toast.show('Reset authorization is missing. Request a new OTP.', 'error');

                ModalManager.submitBtn.disabled = true;
                const result = await this._edge('reset-password', { email, resetToken, newPassword: password });
                ModalManager.submitBtn.disabled = false;
                if (!result.ok) return Toast.show(result.message || 'Password reset failed.', 'error');
                Toast.show('Password updated successfully. You can now sign in.', 'success');
                ModalManager.close();
            }
        });

        document.getElementById('forgotResendOtp')?.addEventListener('click', async () => {
            if (!email || step !== 2) return;
            const btn = document.getElementById('forgotResendOtp');
            if (btn) btn.disabled = true;
            const result = await this._edge('request-password-otp', { email });
            if (btn) btn.disabled = false;
            if (!result.ok) return Toast.show(result.message || 'Unable to resend OTP.', 'error');
            Toast.show('A new OTP has been sent.', 'success');
        });
    },

    async _edge(functionName, payload) {
        const cfg = window.SKILLIANT_SUPABASE;
        if (!this.supabase || !cfg?.url) return { ok: false, message: 'Supabase is not configured.' };
        try {
            const { data: { session } } = await this.supabase.auth.getSession();
            const headers = { 'Content-Type': 'application/json', apikey: cfg.publishableKey };
            if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
            const res = await fetch(`${cfg.url}/functions/v1/${functionName}`, { method: 'POST', headers, body: JSON.stringify(payload) });
            const body = await res.json().catch(() => ({}));
            return { ok: res.ok && body.ok !== false, ...body };
        } catch (error) {
            console.error(error);
            return { ok: false, message: 'Network error. Please try again.' };
        }
    },

    _setLoginLoading(loading, btn) {
        if (!btn) return;
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');
        btn.disabled = loading;
        if (btnText) btnText.textContent = loading ? 'Authenticating...' : 'Sign In';
        if (btnLoader) btnLoader.style.display = loading ? 'inline-block' : 'none';
    },
    _isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); },
    _isStrongPassword(password) { return typeof password === 'string' && password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password); },
    _showFieldError(input, message) {
        if (!input) return;
        input.style.borderColor = 'var(--danger)';
        let errEl = input.parentNode.querySelector('.field-error');
        if (!errEl) { errEl = document.createElement('div'); errEl.className = 'field-error'; errEl.style.cssText = 'color:var(--danger);font-size:.75rem;margin-top:4px;'; input.parentNode.appendChild(errEl); }
        errEl.textContent = message;
    },
    _clearErrors() {
        document.querySelectorAll('.field-error').forEach(el => el.remove());
        document.querySelectorAll('#loginEmail,#loginPassword').forEach(el => el.style.borderColor = '');
    }
};

document.addEventListener('DOMContentLoaded', () => Auth.init());
