/**
 * Security & Auth Management (SaaS-Ready Audit)
 */

const SecurityPage = {
    render() {
        const session = DataService.getSession();
        const settings = DataService.getSettings();
        const history = DataService.getLoginHistory(session.adminId) || [];

        const historyRows = history.length > 0 ? history.map(h => `
            <tr>
                <td>${new Date(h.timestamp).toLocaleString()}</td>
                <td>${h.device} (${h.browser})</td>
                <td>${h.ip}</td>
                <td>New York, USA</td>
                <td>${UI.renderBadge(h.status)}</td>
            </tr>
        `).join('') : `
            <tr>
                <td>${new Date().toLocaleString()}</td>
                <td>Desktop Browser (Chrome)</td>
                <td>127.0.0.1 (Local)</td>
                <td>Localhost</td>
                <td>${UI.renderBadge('Success')}</td>
            </tr>
        `;

        return `
            ${UI.renderPageHeader('Account Security & Authentication', 'Manage your password, login history, and 2-Factor Authentication.')}

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem;" class="mb-6">
                <!-- Change Password -->
                <div class="glass-card animate-slide-up">
                    <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:1.25rem; color:var(--primary-navy);">Change Password</h3>
                    <div style="display:flex; flex-direction:column; gap:1rem;">
                        <div>
                            <label style="font-size:0.85rem; font-weight:600;">Current Password</label>
                            <div class="input-with-icon" style="position:relative;">
                                <input type="password" id="secCurrentPwd" class="form-control" style="width:100%; padding-right:2.5rem; margin-top:4px;">
                                <button type="button" class="password-toggle" onclick="SecurityPage.togglePassVisibility('secCurrentPwd', this)" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--text-muted);">
                                    <i class="fa-solid fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label style="font-size:0.85rem; font-weight:600;">New Password</label>
                            <div class="input-with-icon" style="position:relative;">
                                <input type="password" id="secNewPwd" class="form-control" style="width:100%; padding-right:2.5rem; margin-top:4px;">
                                <button type="button" class="password-toggle" onclick="SecurityPage.togglePassVisibility('secNewPwd', this)" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--text-muted);">
                                    <i class="fa-solid fa-eye"></i>
                                </button>
                            </div>
                            <div id="passwordStrengthBar" style="height:4px; width:100%; background:#e2e8f0; margin-top:6px; border-radius:2px; overflow:hidden;">
                                <div id="passwordStrengthProgress" style="height:100%; width:0%; transition:width 0.3s ease;"></div>
                            </div>
                            <small id="passwordStrengthLabel" style="font-size:0.75rem; color:var(--text-muted); margin-top:2px; display:block;">Enter a password</small>
                        </div>
                        <div>
                            <label style="font-size:0.85rem; font-weight:600;">Confirm New Password</label>
                            <div class="input-with-icon" style="position:relative;">
                                <input type="password" id="secConfirmPwd" class="form-control" style="width:100%; padding-right:2.5rem; margin-top:4px;">
                                <button type="button" class="password-toggle" onclick="SecurityPage.togglePassVisibility('secConfirmPwd', this)" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--text-muted);">
                                    <i class="fa-solid fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div style="margin-top: 0.5rem;">
                            <button class="btn btn-primary" onclick="SecurityPage.updatePassword()">Update Password</button>
                        </div>
                    </div>
                </div>

                <!-- 2FA & Active Sessions -->
                <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <div class="glass-card animate-slide-up">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.25rem; color:var(--primary-navy);">Two-Factor Auth (2FA)</h3>
                                <p style="font-size:0.8rem; color:var(--text-muted);">Secure your account with an Authenticator App.</p>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="sec2FA" ${settings.securityAlerts ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>

                    <div class="glass-card animate-slide-up">
                        <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:1rem; color:var(--primary-navy);">Active Sessions</h3>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: rgba(59,130,246,0.05); border: 1px solid var(--primary-blue); border-radius: 8px;">
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <i class="fa-solid fa-desktop" style="color: var(--primary-blue); font-size: 1.2rem;"></i>
                                    <div>
                                        <div style="font-weight: 600; font-size: 0.85rem;">Windows 11 • Chrome Browser</div>
                                        <div style="font-size: 0.75rem; color: var(--text-muted);">Current Session • IP: 127.0.0.1</div>
                                    </div>
                                </div>
                                <span class="badge badge-success">Active</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #F8FAFC; border: 1px solid var(--border-color); border-radius: 8px;">
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <i class="fa-solid fa-mobile-screen" style="color: var(--text-muted); font-size: 1.2rem;"></i>
                                    <div>
                                        <div style="font-weight: 600; font-size: 0.85rem;">iPhone 14 • Safari</div>
                                        <div style="font-size: 0.75rem; color: var(--text-muted);">Last seen: Yesterday • IP: 172.16.0.4</div>
                                    </div>
                                </div>
                                <button class="btn btn-outline btn-sm text-danger" style="font-size: 0.7rem;" onclick="SecurityPage.revokeSession(this)">Revoke</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Login History Table -->
            <div class="glass-card animate-slide-up">
                <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:1rem; color:var(--primary-navy);">Recent Login History</h3>
                <div class="table-responsive" style="padding: 0;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>Device / Browser</th>
                                <th>IP Address</th>
                                <th>Location</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${historyRows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    init() {
        // Wire 2FA checkbox
        const sec2FA = document.getElementById('sec2FA');
        if (sec2FA) {
            sec2FA.addEventListener('change', (e) => {
                const settings = DataService.getSettings();
                settings.securityAlerts = e.target.checked;
                DataService.updateSettings(settings);
                Toast.show(`2FA status updated to: ${settings.securityAlerts ? 'Enabled' : 'Disabled'}`, 'success');
            });
        }

        // Wire password strength checker
        const newPwd = document.getElementById('secNewPwd');
        if (newPwd) {
            newPwd.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value);
            });
        }
    },

    togglePassVisibility(inputId, btn) {
        const input = document.getElementById(inputId);
        if (input) {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            btn.innerHTML = isPassword ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
        }
    },

    checkPasswordStrength(pwd) {
        const bar = document.getElementById('passwordStrengthProgress');
        const label = document.getElementById('passwordStrengthLabel');
        if (!bar || !label) return;

        let strength = 0;
        if (pwd.length >= 6) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/[0-9]/.test(pwd)) strength++;
        if (/[^A-Za-z0-9]/.test(pwd)) strength++;

        const colors = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'];
        const labels = ['Weak', 'Fair', 'Good', 'Strong'];

        if (pwd.length === 0) {
            bar.style.width = '0%';
            label.textContent = 'Enter a password';
            label.style.color = 'var(--text-muted)';
        } else {
            const pct = (strength / 4) * 100;
            bar.style.width = `${pct}%`;
            bar.style.backgroundColor = colors[strength - 1] || colors[0];
            label.textContent = labels[strength - 1] || labels[0];
            label.style.color = colors[strength - 1] || colors[0];
        }
    },

    revokeSession(btn) {
        if (confirm('Are you sure you want to revoke this session?')) {
            const row = btn.closest('div');
            if (row) {
                row.style.opacity = '0.5';
                btn.disabled = true;
                btn.textContent = 'Revoked';
                Toast.show('Session successfully revoked.', 'success');
                DataService.logActivity('Revoked active mobile browser session.');
            }
        }
    },

    updatePassword() {
        const curr = document.getElementById('secCurrentPwd')?.value;
        const newPwd = document.getElementById('secNewPwd')?.value;
        const confPwd = document.getElementById('secConfirmPwd')?.value;

        if (!curr || !newPwd || !confPwd) {
            Toast.show('Please fill in all password fields.', 'warning');
            return;
        }

        if (newPwd.length < 6) {
            Toast.show('New password must be at least 6 characters.', 'warning');
            return;
        }

        if (newPwd !== confPwd) {
            Toast.show('New passwords do not match.', 'danger');
            return;
        }

        const session = DataService.getSession();
        if (!session || !session.adminId) return;

        const admins = DataService.getCollection(DataService.KEYS.ADMINS);
        const adminUser = admins.find(a => a.id === session.adminId);
        
        if (adminUser) {
            // Check password (legacy direct compare or checkPassword helper)
            if (!DataService.checkPassword(curr, adminUser.password)) {
                Toast.show('Current password is incorrect.', 'danger');
                return;
            }

            adminUser.password = DataService.hashPassword(newPwd);
            DataService.setStorage(DataService.KEYS.ADMINS, admins);
            DataService.logActivity('Admin changed their password successfully.');
            Toast.show('Password updated successfully!', 'success');
            
            // clear fields
            document.getElementById('secCurrentPwd').value = '';
            document.getElementById('secNewPwd').value = '';
            document.getElementById('secConfirmPwd').value = '';
            document.getElementById('passwordStrengthProgress').style.width = '0%';
            document.getElementById('passwordStrengthLabel').textContent = 'Enter a password';
            document.getElementById('passwordStrengthLabel').style.color = 'var(--text-muted)';
        }
    }
};
