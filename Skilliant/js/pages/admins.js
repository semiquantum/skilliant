/**
 * Admin & Role Management Module (SaaS-Ready Audit)
 */

const AdminsPage = {
    state: {
        search: '',
        status: ''
    },

    render() {
        const admins = DataService.getCollection(DataService.KEYS.ADMINS) || [];

        // Apply filters
        const filteredAdmins = admins.filter(a => {
            const name = String(a.name || '');
            const email = String(a.email || '');
            const q = this.state.search.toLowerCase();
            const matchesSearch = name.toLowerCase().includes(q) || email.toLowerCase().includes(q);
            const matchesStatus = !this.state.status || a.status === this.state.status;
            return matchesSearch && matchesStatus;
        });

        // Paginate
        const paginatedAdmins = Pagination.getPageItems('admins', filteredAdmins, 10);

        const rowsHtml = paginatedAdmins.length > 0 ? paginatedAdmins.map(a => `
            <tr>
                <td>
                    <div class="table-user">
                        <div class="table-avatar" style="background: var(--primary-navy); color: var(--text-white); font-weight:700;">
                            ${a.profilePhoto || a.name.split(' ').map(n=>n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                            <div class="table-user-name">${UI.escapeHtml(a.name || 'Administrator')}</div>
                            <div class="table-user-sub">${UI.escapeHtml(a.email || '')}</div>
                        </div>
                    </div>
                </td>
                <td><span class="badge ${a.role === 'Super Admin' ? 'badge-danger' : 'badge-info'}">${a.role}</span></td>
                <td>${a.lastLogin ? new Date(a.lastLogin).toLocaleString() : 'Never'}</td>
                <td>${UI.renderBadge(a.status)}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-outline btn-sm" onclick="AdminsPage.editAdminModal('${a.id}')">
                            <i class="fa-solid fa-pen"></i> Edit
                        </button>
                        ${a.id !== DataService.getSession()?.adminId ? `
                        <button class="btn btn-outline btn-sm text-danger" onclick="AdminsPage.deleteAdmin('${a.id}')">
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('') : `<tr><td colspan="5" class="text-center text-muted" style="padding: 3rem 1rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.15;"><i class="fa-solid fa-folder-open"></i></div>
            No administrators found matching current search/filter.
        </td></tr>`;

        const paginationHtml = Pagination.renderControls('admins', filteredAdmins.length, 10);

        const superCount = admins.filter(a => a.role === 'Super Admin').length;
        const adminCount = admins.filter(a => a.role === 'Admin').length;
        const financeCount = admins.filter(a => a.role === 'Financial Admin').length;

        return `
            ${UI.renderPageHeader('Administrator Management', `Manage platform administrators and their access roles. Current: ${superCount} Super Admin, ${adminCount} Admin, ${financeCount} Financial Admin.`, `
                <button class="btn btn-primary" onclick="AdminsPage.addAdminModal()">
                    <i class="fa-solid fa-user-plus"></i> Add Admin
                </button>
            `)}
            ${UI.renderControlsBar('adminSearchInput', 'Search admins by name or email...', [
                { id: 'adminStatusFilter', label: 'Filter Status', options: ['Active', 'Inactive'] }
            ], '', null)}
            ${UI.renderTable(['Administrator Profile', 'Role', 'Last Login', 'Status', 'Actions'], rowsHtml, paginationHtml)}
        `;
    },

    async init() {
        if (window.Auth?.supabase && DataService.getSession()?.role === 'Super Admin') {
            await Auth.syncAdminDirectory();
            App.refreshCurrentPage = App.refreshCurrentPage.bind(App);
        }
        const searchEl = document.getElementById('adminSearchInput');
        const filterEl = document.getElementById('adminStatusFilter');

        if (searchEl) {
            searchEl.value = this.state.search;
            searchEl.addEventListener('input', (e) => {
                this.state.search = e.target.value;
                Pagination.getState('admins', 0, 10).page = 1;
                App.refreshCurrentPage();
            });
        }

        if (filterEl) {
            filterEl.value = this.state.status;
            filterEl.addEventListener('change', (e) => {
                this.state.status = e.target.value;
                Pagination.getState('admins', 0, 10).page = 1;
                App.refreshCurrentPage();
            });
        }
    },

    addAdminModal() {
        if (DataService.getSession()?.role !== 'Super Admin') return Toast.show('Only Super Admin can add administrators.', 'warning');
        ModalManager.open({
            title: 'Add New Administrator',
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Full Name <span class="text-danger">*</span></label>
                        <input type="text" id="newAdminName" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. John Doe" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Email Address <span class="text-danger">*</span></label>
                        <input type="email" id="newAdminEmail" class="form-control" style="width:100%; margin-top:4px;" placeholder="admin@skilliant.com" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Role <span class="text-danger">*</span></label>
                        <select id="newAdminRole" class="form-control" style="width:100%; margin-top:4px;" required>
                            <option value="Admin">Admin</option>
                            <option value="Financial Admin">Financial Admin</option>
                            <option value="Super Admin">Super Admin</option>
                        </select>
                    </div>
                    <div style="padding:.75rem 1rem;border-radius:10px;background:var(--bg-subtle,#f8fafc);color:var(--text-muted);font-size:.82rem;line-height:1.5;">
                        The administrator will authenticate through Supabase. Do not store or create administrator passwords in browser localStorage. Email verification must be completed before portal access.
                    </div>
                </div>
            `,
            submitText: 'Create Admin',
            onSubmit: async () => {
                const name = document.getElementById('newAdminName')?.value.trim();
                const email = document.getElementById('newAdminEmail')?.value.trim();
                const role = document.getElementById('newAdminRole')?.value;
                if (!name || !email) {
                    Toast.show('Please fill in all required fields.', 'warning');
                    return;
                }
                if (!email.includes('@')) {
                    Toast.show('Please enter a valid email address.', 'warning');
                    return;
                }

                if (!window.Auth?.supabase) {
                    Toast.show('Supabase is not configured.', 'error');
                    return;
                }
                const result = await Auth._edge('create-admin', { full_name: name, email, role });
                if (!result.ok) {
                    Toast.show(result.message || 'Unable to create administrator.', 'error');
                    return;
                }
                DataService.logActivity(`Created administrator ${name} (${role})`);
                Toast.show(`Administrator ${name} created. Complete email verification before access.`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    },

    editAdminModal(id) {
        if (DataService.getSession()?.role !== 'Super Admin') return Toast.show('Only Super Admin can manage administrators.', 'warning');
        const admins = DataService.getCollection(DataService.KEYS.ADMINS);
        const a = admins.find(x => x.id === id);
        if (!a) return;

        const currentSession = DataService.getSession();

        ModalManager.open({
            title: `Edit Administrator: ${a.name}`,
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Full Name <span class="text-danger">*</span></label>
                        <input type="text" id="editAdminName" class="form-control" style="width:100%; margin-top:4px;" value="${UI.escapeHtml(a.name || '')}" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Email Address <span class="text-danger">*</span></label>
                        <input type="email" id="editAdminEmail" class="form-control" style="width:100%; margin-top:4px;" value="${UI.escapeHtml(a.email || '')}" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Role</label>
                        <select id="editAdminRole" class="form-control" style="width:100%; margin-top:4px;" ${a.id === DataService.getSession()?.adminId ? 'disabled' : ''}>
                            <option value="Admin" ${a.role === 'Admin' ? 'selected' : ''}>Admin</option>
                            <option value="Financial Admin" ${a.role === 'Financial Admin' ? 'selected' : ''}>Financial Admin</option>
                            <option value="Super Admin" ${a.role === 'Super Admin' ? 'selected' : ''}>Super Admin</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Status</label>
                        <select id="editAdminStatus" class="form-control" style="width:100%; margin-top:4px;" ${a.id === currentSession.adminId ? 'disabled' : ''}>
                            <option value="Active" ${a.status === 'Active' ? 'selected' : ''}>Active</option>
                            <option value="Inactive" ${a.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                    <hr style="border:0; border-top:1px solid var(--border-color); margin:0.5rem 0;">
                    <div>
                        <button type="button" class="btn btn-outline btn-sm text-danger" onclick="AdminsPage.resetPasswordModal('${a.id}')">
                            <i class="fa-solid fa-key"></i> Reset Password
                        </button>
                    </div>
                </div>
            `,
            submitText: 'Save Changes',
            onSubmit: async () => {
                const name = document.getElementById('editAdminName')?.value.trim();
                const email = document.getElementById('editAdminEmail')?.value.trim().toLowerCase();
                const role = document.getElementById('editAdminRole')?.value;
                const status = document.getElementById('editAdminStatus')?.value;

                if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    Toast.show('Enter a valid name and email address.', 'warning');
                    return;
                }
                const duplicate = admins.find(x => x.id !== a.id && String(x.email||'').toLowerCase() === email);
                if (duplicate) { Toast.show('That email is already used by another administrator.', 'warning'); return; }

                const oldName=a.name, oldEmail=a.email, oldRole=a.role;
                const result = await Auth._edge('update-admin', { id: a.id, full_name: name, email, role, status });
                if (!result.ok) {
                    Toast.show(result.message || 'Unable to update administrator.', 'error');
                    return;
                }
                await Auth.syncAdminDirectory();
                if (oldEmail !== email) DataService.logActivity(`Changed administrator email for ${name} from ${oldEmail} to ${email}`, {entityType:'administrator',entityId:a.id});
                if (oldRole !== role) DataService.logActivity(`Changed administrator role for ${name} from ${oldRole} to ${role}`, {entityType:'administrator',entityId:a.id});
                if (oldName !== name) DataService.logActivity(`Changed administrator name from ${oldName} to ${name}`, {entityType:'administrator',entityId:a.id});
                Toast.show(`Admin ${name} updated!`, 'success');
                ModalManager.close();
                App.applyRoleVisibility();
                App.updateSidebarUser();
                App.refreshCurrentPage();
            }
        });
    },

    resetPasswordModal(id) {
        if (DataService.getSession()?.role !== 'Super Admin') return Toast.show('Only Super Admin can reset another administrator password.', 'warning');
        const admins = DataService.getCollection(DataService.KEYS.ADMINS);
        const a = admins.find(x => x.id === id);
        if (!a) return;
        if (!window.Auth?.supabase) return Toast.show('Supabase is not configured.', 'error');
        if (!confirm(`Send a password-reset OTP to ${a.email}?`)) return;
        Auth._edge('request-password-otp', { email: a.email }).then(result => {
            if (!result.ok) return Toast.show(result.message || 'Unable to send password-reset OTP.', 'error');
            Toast.show(`Password-reset OTP requested for ${a.email}.`, 'success');
        });
    },

    async deleteAdmin(id) {
        if (DataService.getSession()?.role !== 'Super Admin') return Toast.show('Only Super Admin can delete administrators.', 'warning');
        const admins = DataService.getCollection(DataService.KEYS.ADMINS);
        const a = admins.find(x => x.id === id);
        if (!a) return;
        const currentSession = DataService.getSession();
        if (a.id === currentSession.adminId) return Toast.show('You cannot delete your own active admin account.', 'warning');
        if (!confirm(`Are you sure you want to permanently delete administrator account: ${a.name}?`)) return;
        const result = await Auth._edge('delete-admin', { id });
        if (!result.ok) return Toast.show(result.message || 'Unable to delete administrator.', 'error');
        await Auth.syncAdminDirectory();
        DataService.logActivity(`Deleted administrator account ${a.name}`);
        Toast.show(`Administrator account ${a.name} deleted.`, 'success');
        App.refreshCurrentPage();
    }

};
