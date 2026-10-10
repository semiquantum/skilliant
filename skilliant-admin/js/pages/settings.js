const SettingsPage = {
    render() {
        const s = DataService.getSettings();
        const session = DataService.getSession();
        const admins = DataService.getCollection(DataService.KEYS.ADMINS) || [];
        const me = admins.find(a => a.id === session?.adminId) || {};
        const isSuper = session?.role === 'Super Admin';
        const safe = v => (v === undefined || v === null || String(v).toLowerCase() === 'undefined') ? '' : String(v);
        return `
            ${UI.renderPageHeader('Website Settings', 'Manage your profile, password and essential platform settings.')}
            <div class="settings-layout">
                <div class="glass-card">
                    <h3 style="margin:0 0 .25rem;color:var(--primary-navy);">My Profile</h3>
                    <p style="margin:0 0 1rem;color:var(--text-muted);font-size:.84rem;">Update the account currently signed in.</p>
                    <div style="display:grid;gap:.8rem;">
                        <div><label>Full Name</label><input id="profileName" class="form-control" value="${UI.escapeHtml ? UI.escapeHtml(me.name||'') : (me.name||'')}"></div>
                        <div><label>Registered Email</label><input id="profileEmail" type="email" class="form-control" value="${me.email||''}"></div>
                        <div><label>Mobile Number (exactly 10 digits)</label><input id="profilePhone" type="tel" class="form-control" value="${me.phone||''}" maxlength="10" inputmode="numeric" pattern="\\d{10}" oninput="this.value=this.value.replace(/\\D/g,'').slice(0,10)"></div>
                    </div>
                    <button class="btn btn-primary" style="margin-top:1rem;" onclick="SettingsPage.saveProfile()"><i class="fa-solid fa-user-check"></i> Save Profile</button>
                </div>

                <div class="glass-card">
                    <h3 style="margin:0 0 .25rem;color:var(--primary-navy);">Change Password</h3>
                    <p style="margin:0 0 1rem;color:var(--text-muted);font-size:.84rem;">Use your current password. No demo OTP is shown or generated.</p>
                    <div style="display:grid;gap:.8rem;">
                        <div><label>Current Password</label><input id="cpCurrent" type="password" class="form-control" autocomplete="current-password"></div>
                        <div><label>New Password</label><input id="cpNew" type="password" class="form-control" autocomplete="new-password"></div>
                        <div><label>Confirm New Password</label><input id="cpConfirm" type="password" class="form-control" autocomplete="new-password"></div>
                    </div>
                    <button class="btn btn-primary" style="margin-top:1rem;" onclick="SettingsPage.changePassword()"><i class="fa-solid fa-key"></i> Change Password</button>
                </div>

                <div class="glass-card settings-wide-card">
                    <h3 style="margin:0 0 .25rem;color:var(--primary-navy);">Appearance</h3>
                    <p style="margin:0 0 1rem;color:var(--text-muted);font-size:.84rem;">Choose the portal appearance. The header toggle remains available too.</p>
                    <div class="settings-option-row">
                        <button class="btn ${s.darkMode ? 'btn-outline' : 'btn-primary'}" onclick="SettingsPage.setTheme(false)"><i class="fa-solid fa-sun"></i> Light Mode</button>
                        <button class="btn ${s.darkMode ? 'btn-primary' : 'btn-outline'}" onclick="SettingsPage.setTheme(true)"><i class="fa-solid fa-moon"></i> Dark Mode</button>
                    </div>
                </div>

                ${isSuper ? `
                <div class="glass-card settings-wide-card platform-settings-card">
                    <h3 style="margin:0 0 .25rem;color:var(--primary-navy);">Platform Settings</h3>
                    <p style="margin:0 0 1rem;color:var(--text-muted);font-size:.84rem;">Super Admin only.</p>
                    <div class="platform-settings-fields">
                        <div><label>Platform Name</label><input id="setSiteName" class="form-control" value="${safe(s.siteName)||'Skilliant'}"></div>
                        <div><label>Support Email</label><input id="setSupportEmail" type="email" class="form-control" value="${safe(s.supportEmail || session?.adminEmail || me.email)}"></div>
                        <div><label>Support Phone (exactly 10 digits)</label><input id="setSupportPhone" type="tel" class="form-control" value="${safe(s.supportPhone)}" maxlength="10" inputmode="numeric" pattern="\\d{10}" oninput="this.value=this.value.replace(/\\D/g,'').slice(0,10)"></div>
                        <div><label>Commission %</label><input id="setCommission" type="number" min="0" max="100" step="0.1" class="form-control" value="${Number.isFinite(Number(s.commissionPercentage)) ? Number(s.commissionPercentage) : 10}"></div>
                        <div><label>Company Name</label><input id="setCompanyName" class="form-control" value="${safe(s.companyName)}"></div>
                        <div><label>Business Address</label><input id="setAddress" class="form-control" value="${safe(s.address)}"></div>
                        <div><label>Working Hours</label><input id="setWorkingHours" class="form-control" value="${safe(s.workingHours)}"></div>
                        <div><label>Default Currency</label><input id="setCurrency" class="form-control" maxlength="5" value="${safe(s.defaultCurrency || '$')}"></div>
                        <div><label>Language</label><select id="setLanguage" class="form-control"><option ${s.language==='English'?'selected':''}>English</option><option ${s.language==='Hindi'?'selected':''}>Hindi</option><option ${s.language==='Marathi'?'selected':''}>Marathi</option></select></div>
                        <div><label>Timezone</label><select id="setTimezone" class="form-control"><option ${s.timezone==='UTC+5:30 (IST)'?'selected':''}>UTC+5:30 (IST)</option><option ${s.timezone==='UTC-5 (EST)'?'selected':''}>UTC-5 (EST)</option><option>UTC+0 (GMT)</option><option>UTC+1 (CET)</option></select></div>
                    </div>
                    <div style="margin-top:1rem;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem;">
                        <label style="display:flex;align-items:center;gap:.5rem;"><input id="emailNotifs" type="checkbox" ${s.emailNotifs!==false?'checked':''}> Email notifications</label>
                        <label style="display:flex;align-items:center;gap:.5rem;"><input id="adminNotifications" type="checkbox" ${s.adminNotifications!==false?'checked':''}> Admin notifications</label>
                        <label style="display:flex;align-items:center;gap:.5rem;"><input id="bookingNotifications" type="checkbox" ${s.bookingNotifications!==false?'checked':''}> Booking notifications</label>
                        <label style="display:flex;align-items:center;gap:.5rem;"><input id="paymentNotifications" type="checkbox" ${s.paymentNotifications!==false?'checked':''}> Payment notifications</label>
                        <label style="display:flex;align-items:center;gap:.5rem;"><input id="supportNotifications" type="checkbox" ${s.supportNotifications!==false?'checked':''}> Support notifications</label>
                        <label style="display:flex;align-items:center;gap:.5rem;"><input id="autoApproveLabour" type="checkbox" ${s.autoApproveLabour?'checked':''}> Auto-approve labour</label>
                        <label style="display:flex;align-items:center;gap:.5rem;"><input id="maintenanceMode" type="checkbox" ${s.maintenanceMode?'checked':''}> Maintenance mode</label>
                    </div>
                    <div style="margin-top:.75rem;"><label>Maintenance Message</label><textarea id="maintenanceMessage" class="form-control" rows="2">${safe(s.maintenanceMessage || 'We are performing scheduled maintenance. Please check back shortly.')}</textarea></div>
                    <button class="btn btn-primary" style="margin-top:1rem;" onclick="SettingsPage.savePlatform()"><i class="fa-solid fa-save"></i> Save Platform Settings</button>
                </div>` : ''}
            </div>
            ${!isSuper ? `<div class="glass-card" style="margin-top:1rem;"><strong>Role: ${session?.role||'Admin'}</strong><p style="margin:.35rem 0 0;color:var(--text-muted);font-size:.84rem;">Only Super Admin can manage administrators, roles and platform-wide settings.</p></div>` : ''}
        `;
    },
    init() {},

    saveProfile() {
        const session = DataService.getSession();
        const admins = DataService.getCollection(DataService.KEYS.ADMINS) || [];
        const me = admins.find(a => a.id === session?.adminId);
        if (!me) return Toast.show('Active administrator account not found.', 'error');
        const name = document.getElementById('profileName')?.value.trim();
        const email = document.getElementById('profileEmail')?.value.trim().toLowerCase();
        const phone = document.getElementById('profilePhone')?.value.trim();
        if (!name || !email || !phone) return Toast.show('Name, email and mobile number are required.', 'warning');
        if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return Toast.show('Enter a valid email address.', 'warning');
        if (!DataService.validatePhone(phone)) return Toast.show('Mobile number must contain exactly 10 digits.', 'warning');
        const duplicate = admins.find(a => a.id !== me.id && a.email.toLowerCase() === email);
        if (duplicate) return Toast.show('That email is already used by another administrator.', 'warning');
        me.name = name; me.email = email; me.phone = phone;
        me.profilePhoto = name.split(/\\s+/).map(x => x[0]).join('').toUpperCase().slice(0,2);
        DataService.setStorage(DataService.KEYS.ADMINS, admins);
        session.adminName = name; session.adminEmail = email; session.profilePhoto = me.profilePhoto;
        DataService.setStorage(DataService.KEYS.SESSION, session);
        DataService.logActivity(`Updated own profile for ${name}`);
        App.initHeader(); App.updateSidebarUser();
        Toast.show('Profile updated successfully.', 'success');
        App.refreshCurrentPage();
    },

    changePassword() {
        const session = DataService.getSession();
        const admins = DataService.getCollection(DataService.KEYS.ADMINS) || [];
        const me = admins.find(a => a.id === session?.adminId);
        if (!me) return Toast.show('Active administrator account not found.', 'error');
        const current = document.getElementById('cpCurrent')?.value || '';
        const next = document.getElementById('cpNew')?.value || '';
        const confirmNext = document.getElementById('cpConfirm')?.value || '';
        if (!current || !next || !confirmNext) return Toast.show('Fill all password fields.', 'warning');
        if (!DataService.checkPassword(current, me.password)) return Toast.show('Current password is incorrect.', 'error');
        if (next.length < 6) return Toast.show('New password must be at least 6 characters.', 'warning');
        if (next !== confirmNext) return Toast.show('New passwords do not match.', 'warning');
        me.password = DataService.hashPassword(next);
        DataService.setStorage(DataService.KEYS.ADMINS, admins);
        DataService.logActivity(`Password changed for administrator ${me.email}`);
        Toast.show('Password changed successfully.', 'success');
        document.getElementById('cpCurrent').value=''; document.getElementById('cpNew').value=''; document.getElementById('cpConfirm').value='';
    },

    savePlatform() {
        if (!DataService.requirePermission('manage:settings','Only Super Admin can change platform-wide settings.')) return;
        const s = DataService.getSettings();
        const session = DataService.getSession();
        const admins = DataService.getCollection(DataService.KEYS.ADMINS) || [];
        const me = admins.find(a => a.id === session?.adminId) || {};
        const phone = document.getElementById('setSupportPhone')?.value.trim();
        const supportEmail = document.getElementById('setSupportEmail')?.value.trim().toLowerCase();
        if (supportEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportEmail)) return Toast.show('Enter a valid support email address.', 'warning');
        if (phone && !DataService.validatePhone(phone)) return Toast.show('Support phone must contain exactly 10 digits.', 'warning');
        DataService.updateSettings({
            siteName: document.getElementById('setSiteName')?.value.trim() || 'Skilliant',
            companyName: document.getElementById('setCompanyName')?.value.trim() || s?.companyName || '',
            supportEmail: supportEmail || session?.adminEmail || me.email || '',
            supportPhone: phone,
            address: document.getElementById('setAddress')?.value.trim() || '',
            workingHours: document.getElementById('setWorkingHours')?.value.trim() || '',
            defaultCurrency: document.getElementById('setCurrency')?.value.trim() || '$',
            language: document.getElementById('setLanguage')?.value || 'English',
            timezone: document.getElementById('setTimezone')?.value || 'UTC+5:30 (IST)',
            commissionPercentage: Number(document.getElementById('setCommission')?.value || 0),
            emailNotifs: document.getElementById('emailNotifs')?.checked !== false,
            adminNotifications: document.getElementById('adminNotifications')?.checked !== false,
            bookingNotifications: document.getElementById('bookingNotifications')?.checked !== false,
            paymentNotifications: document.getElementById('paymentNotifications')?.checked !== false,
            supportNotifications: document.getElementById('supportNotifications')?.checked !== false,
            autoApproveLabour: document.getElementById('autoApproveLabour')?.checked === true,
            maintenanceMode: document.getElementById('maintenanceMode')?.checked === true,
            maintenanceMessage: document.getElementById('maintenanceMessage')?.value.trim() || '' 
        });
        DataService.recalculateFinancialState?.();
        Toast.show('Platform settings saved.', 'success');
        App.refreshCurrentPage();
    },

    setTheme(enabled) {
        DataService.setDarkMode(!!enabled);
        App._applyDarkMode(!!enabled);
        Toast.show(`${enabled ? 'Dark' : 'Light'} mode enabled.`, 'success');
        App.refreshCurrentPage();
    }
};
