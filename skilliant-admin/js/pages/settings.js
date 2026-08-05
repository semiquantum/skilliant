/**
 * Day 5 Deliverable: Website & Platform Settings
 */

const SettingsPage = {
    render() {
        const settings = DataService.getStorage(DataService.KEYS.SETTINGS) || {};

        return `
            ${UI.renderPageHeader('Platform Configuration & Website Settings', 'Configure global application parameters, commission rates, and maintenance switches.')}

            <div class="glass-card animate-slide-up" style="max-width:800px;">
                <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:1.25rem;">General Platform Configuration</h3>

                <div style="display:flex; flex-direction:column; gap:1.25rem;" class="mb-6">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Platform Brand Title</label>
                        <input type="text" id="settingSiteName" class="form-control" style="width:100%; margin-top:4px;" value="${settings.siteName}">
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                        <div>
                            <label style="font-size:0.85rem; font-weight:600;">Platform Escrow Commission Rate (%)</label>
                            <input type="number" id="settingCommission" class="form-control" style="width:100%; margin-top:4px;" value="${settings.commissionPercentage}">
                        </div>

                        <div>
                            <label style="font-size:0.85rem; font-weight:600;">Default Currency Symbol</label>
                            <input type="text" id="settingCurrency" class="form-control" style="width:100%; margin-top:4px;" value="${settings.defaultCurrency}">
                        </div>
                    </div>

                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Official Support Email</label>
                        <input type="email" id="settingSupportEmail" class="form-control" style="width:100%; margin-top:4px;" value="${settings.supportEmail}">
                    </div>

                    <div style="background:#F8FAFC; padding:1.25rem; border-radius:12px; border:1px solid var(--border-color);" class="flex items-center justify-between">
                        <div>
                            <h4 style="font-size:0.95rem; font-weight:700;">Maintenance Mode</h4>
                            <p style="font-size:0.8rem; color:var(--text-muted);">Temporarily disable client access for system upgrades.</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="settingMaintenance" ${settings.maintenanceMode ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div style="background:#F8FAFC; padding:1.25rem; border-radius:12px; border:1px solid var(--border-color);" class="flex items-center justify-between">
                        <div>
                            <h4 style="font-size:0.95rem; font-weight:700;">Auto-Approve Skilled Labour Registrations</h4>
                            <p style="font-size:0.8rem; color:var(--text-muted);">Automatically grant verified badge upon signup without document audit.</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="settingAutoApprove" ${settings.autoApproveLabour ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div style="border-top:1px solid var(--border-color); padding-top:1.25rem;" class="flex justify-end">
                    <button class="btn btn-primary" onclick="SettingsPage.saveSettings()">Save Platform Settings</button>
                </div>
            </div>
        `;
    },

    saveSettings() {
        const settings = DataService.getStorage(DataService.KEYS.SETTINGS);
        settings.siteName = document.getElementById('settingSiteName')?.value || settings.siteName;
        settings.commissionPercentage = parseFloat(document.getElementById('settingCommission')?.value || '10');
        settings.defaultCurrency = document.getElementById('settingCurrency')?.value || settings.defaultCurrency;
        settings.supportEmail = document.getElementById('settingSupportEmail')?.value || settings.supportEmail;
        settings.maintenanceMode = document.getElementById('settingMaintenance')?.checked || false;
        settings.autoApproveLabour = document.getElementById('settingAutoApprove')?.checked || false;

        DataService.setStorage(DataService.KEYS.SETTINGS, settings);
        DataService.logActivity(`Saved platform settings: Commission set to ${settings.commissionPercentage}%`);
        Toast.show('Platform settings saved & applied globally!', 'success');
    }
};
