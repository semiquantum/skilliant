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
            const matchesSearch = a.name.toLowerCase().includes(this.state.search.toLowerCase()) ||
                a.email.toLowerCase().includes(this.state.search.toLowerCase());
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
                            <div class="table-user-name">${a.name}</div>
                            <div class="table-user-sub">${a.email}</div>
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
                        ${a.id !== 'ADM-001' ? `
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
        const financeCount = admins.filter(a => a.role === 'Finance Admin').length;

        return `
            ${UI.renderPageHeader('Administrator Management', `Manage platform administrators and their access roles. Current: ${superCount} Super Admin, ${adminCount} Admin, ${financeCount} Finance Admin.`, `
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

    init() {
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
                            <option value="Finance Admin">Finance Admin</option>
                            <option value="Super Admin">Super Admin</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Temporary Password <span class="text-danger">*</span></label>
                        <input type="password" id="newAdminPassword" class="form-control" style="width:100%; margin-top:4px;" placeholder="Enter temporary password" required>
                    </div>
                </div>
            `,
            submitText: 'Create Admin',
            onSubmit: () => {
                const name = document.getElementById('newAdminName')?.value.trim();
                const email = document.getElementById('newAdminEmail')?.value.trim();
                const role = document.getElementById('newAdminRole')?.value;
                const password = document.getElementById('newAdminPassword')?.value;

                if (!name || !email || !password) {
                    Toast.show('Please fill in all required fields.', 'warning');
                    return;
                }
                if (!email.includes('@')) {
                    Toast.show('Please enter a valid email address.', 'warning');
                    return;
                }

                // Hash password
                const hashedPassword = DataService.hashPassword(password);

                const newAdmin = {
                    id: `ADM-${Date.now().toString().slice(-3)}`,
                    name,
                    email,
                    role,
                    password: hashedPassword,
                    profilePhoto: name.split(' ').map(n=>n[0]).join('').toUpperCase(),
                    status: 'Active',
                    lastLogin: ''
                };

                DataService.addItem(DataService.KEYS.ADMINS, newAdmin);
                DataService.logActivity(`Added new administrator ${name} (${role})`);
                Toast.show(`Admin account ${name} created!`, 'success');
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
                        <input type="text" id="editAdminName" class="form-control" style="width:100%; margin-top:4px;" value="${a.name}" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Role</label>
                        <select id="editAdminRole" class="form-control" style="width:100%; margin-top:4px;" ${a.id === 'ADM-001' ? 'disabled' : ''}>
                            <option value="Admin" ${a.role === 'Admin' ? 'selected' : ''}>Admin</option>
                            <option value="Finance Admin" ${a.role === 'Finance Admin' ? 'selected' : ''}>Finance Admin</option>
                            <option value="Super Admin" ${a.role === 'Super Admin' ? 'selected' : ''}>Super Admin</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Status</label>
                        <select id="editAdminStatus" class="form-control" style="width:100%; margin-top:4px;" ${a.id === 'ADM-001' || a.id === currentSession.adminId ? 'disabled' : ''}>
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
            onSubmit: () => {
                const name = document.getElementById('editAdminName')?.value.trim();
                const role = document.getElementById('editAdminRole')?.value;
                const status = document.getElementById('editAdminStatus')?.value;

                if (!name) {
                    Toast.show('Please fill in the full name.', 'warning');
                    return;
                }

                a.name = name;
                if (a.id !== 'ADM-001') {
                    a.role = role;
                }
                if (a.id !== 'ADM-001' && a.id !== currentSession.adminId) {
                    a.status = status;
                }
                
                DataService.setStorage(DataService.KEYS.ADMINS, admins);
                DataService.logActivity(`Updated administrator details for ${a.name}`);
                Toast.show(`Admin ${a.name} updated!`, 'success');
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

        ModalManager.open({
            title: `Reset Password: ${a.name}`,
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <p style="font-size:0.85rem; color:var(--text-muted);">
                        Enter a new temporary password for this administrator.
                    </p>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">New Password <span class="text-danger">*</span></label>
                        <input type="text" id="resetAdminPassword" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. tempPass123" required>
                    </div>
                </div>
            `,
            submitText: 'Reset Password',
            onSubmit: () => {
                const pass = document.getElementById('resetAdminPassword')?.value;
                if (!pass || pass.length < 6) {
                    Toast.show('Please enter a password with at least 6 characters.', 'warning');
                    return;
                }

                a.password = DataService.hashPassword(pass);
                DataService.setStorage(DataService.KEYS.ADMINS, admins);
                DataService.logActivity(`Reset password for administrator ${a.name}`);
                Toast.show(`Password reset successfully for ${a.name}!`, 'success');
                ModalManager.close();
            }
        });
    },

    deleteAdmin(id) {
        if (DataService.getSession()?.role !== 'Super Admin') return Toast.show('Only Super Admin can delete administrators.', 'warning');
        const admins = DataService.getCollection(DataService.KEYS.ADMINS);
        const a = admins.find(x => x.id === id);
        if (!a) return;

        if (a.id === 'ADM-001') {
            Toast.show('Cannot delete the primary Super Admin account.', 'danger');
            return;
        }

        const currentSession = DataService.getSession();
        if (a.id === currentSession.adminId) {
            Toast.show('You cannot delete your own active admin account.', 'danger');
            return;
        }

        if (confirm(`Are you sure you want to permanently delete administrator account: ${a.name}?`)) {
            DataService.deleteItem(DataService.KEYS.ADMINS, 'id', id);
            DataService.logActivity(`Deleted administrator account ${a.name}`);
            Toast.show(`Administrator account ${a.name} deleted.`, 'info');
            App.refreshCurrentPage();
        }
    }
};
