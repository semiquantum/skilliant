/**
 * Day 5 Deliverable: Role Management & Permissions Matrix (SaaS-Ready Audit)
 */

const RolesPage = {
    render() {
        let roles = DataService.getCollection(DataService.KEYS.ROLES) || [];

        // Self-heal/seed default roles if empty
        if (roles.length === 0) {
            roles = [
                { id: 'ROLE-001', title: 'Super Admin', usersAssigned: 1, permissions: ['read', 'write', 'delete', 'finance', 'bookings', 'support', 'reviews', 'settings'] },
                { id: 'ROLE-002', title: 'Admin', usersAssigned: 1, permissions: ['read', 'write', 'bookings', 'support', 'reviews'] },
                { id: 'ROLE-003', title: 'Finance Admin', usersAssigned: 1, permissions: ['read', 'finance', 'payments', 'wallet', 'reports', 'export'] },
                { id: 'ROLE-004', title: 'Moderator', usersAssigned: 0, permissions: ['read', 'support', 'reviews'] }
            ];
            DataService.setStorage(DataService.KEYS.ROLES, roles);
        }

        const rolesCardsHtml = roles.map(r => `
            <div class="glass-card animate-slide-up" style="display:flex; flex-direction:column; justify-content:space-between; gap:1.25rem;">
                <div class="flex items-center justify-between">
                    <div class="kpi-icon-wrapper kpi-icon-purple" style="width: 40px; height: 40px; border-radius: 50%; background: rgba(147, 51, 234, 0.08); color: rgb(147, 51, 234); display:flex; align-items:center; justify-content:center; font-size:1.2rem;">
                        <i class="fa-solid fa-user-shield"></i>
                    </div>
                    <span class="badge badge-info">${r.usersAssigned} Admins Assigned</span>
                </div>
                <div>
                    <h3 style="font-size:1.2rem; font-weight:700; color:var(--primary-navy);">${r.title}</h3>
                    <p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">ID: ${r.id}</p>
                </div>
                <div>
                    <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); display:block; margin-bottom:6px;">Granted Scope</span>
                    <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
                        ${r.permissions.map(p => `<span class="badge badge-secondary">${p}</span>`).join('')}
                    </div>
                </div>
                <div style="border-top:1px solid var(--border-color); padding-top:0.75rem;" class="flex items-center justify-between">
                    <span style="font-size:0.78rem; font-weight:600; color:var(--text-light);">Role Authorization</span>
                    <div style="display:flex; gap:0.25rem;">
                        <button class="btn btn-outline btn-sm" onclick="RolesPage.editPermissionsModal('${r.id}')">
                            <i class="fa-solid fa-sliders"></i> Scope
                        </button>
                        ${r.id !== 'ROLE-001' && r.id !== 'ROLE-002' ? `
                        <button class="btn btn-outline btn-sm text-danger" onclick="RolesPage.deleteRole('${r.id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        return `
            ${UI.renderPageHeader('Role Management & RBAC Matrix', 'Configure administrative roles and granular resource permission scopes.', `
                <button class="btn btn-primary" onclick="RolesPage.addRoleModal()">
                    <i class="fa-solid fa-plus"></i> Create New Role
                </button>
            `)}

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem;">
                ${rolesCardsHtml}
            </div>
        `;
    },

    editPermissionsModal(roleId) {
        const roles = DataService.getCollection(DataService.KEYS.ROLES);
        const role = roles.find(x => x.id === roleId);
        if (!role) return;

        const allPermissions = ['read', 'write', 'delete', 'finance', 'bookings', 'support', 'reviews', 'settings'];

        ModalManager.open({
            title: `Configure Scope: ${role.title}`,
            bodyHtml: `
                <div>
                    <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">Toggle permissions accessible by members assigned to this role:</p>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
                        ${allPermissions.map(p => `
                            <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.88rem; cursor:pointer;">
                                <input type="checkbox" value="${p}" class="perm-checkbox" ${role.permissions.includes(p) ? 'checked' : ''} ${role.id === 'ROLE-001' ? 'disabled' : ''}>
                                <span style="text-transform:capitalize;">${p} Permission</span>
                            </label>
                        `).join('')}
                    </div>
                    ${role.id === 'ROLE-001' ? '<p style="font-size:0.75rem; color:var(--danger); margin-top:10px;">Note: Super Admin permissions cannot be modified.</p>' : ''}
                </div>
            `,
            submitText: role.id === 'ROLE-001' ? 'Close' : 'Save Role Scope',
            onSubmit: () => {
                if (role.id === 'ROLE-001') {
                    ModalManager.close();
                    return;
                }
                const checkboxes = document.querySelectorAll('.perm-checkbox');
                const selected = [];
                checkboxes.forEach(cb => {
                    if (cb.checked) selected.push(cb.value);
                });
                role.permissions = selected;
                DataService.setStorage(DataService.KEYS.ROLES, roles);
                DataService.logActivity(`Updated permission scope for role ${role.title}`);
                Toast.show(`Role ${role.title} permissions updated!`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    },

    addRoleModal() {
        ModalManager.open({
            title: 'Define New Admin Role',
            bodyHtml: `
                <div>
                    <label style="font-size:0.85rem; font-weight:600;">Role Title <span class="text-danger">*</span></label>
                    <input type="text" id="newRoleTitle" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. Audit Manager" required>
                </div>
            `,
            submitText: 'Create Role',
            onSubmit: () => {
                const title = document.getElementById('newRoleTitle')?.value.trim();
                if (!title) {
                    Toast.show('Please specify a role title', 'warning');
                    return;
                }

                const newRole = {
                    id: `ROLE-${Date.now().toString().slice(-3)}`,
                    title,
                    usersAssigned: 0,
                    permissions: ['read', 'support']
                };

                DataService.addItem(DataService.KEYS.ROLES, newRole);
                DataService.logActivity(`Created new admin role ${title}`);
                Toast.show(`Role ${title} created!`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    },

    deleteRole(id) {
        const roles = DataService.getCollection(DataService.KEYS.ROLES);
        const role = roles.find(r => r.id === id);
        if (!role) return;

        if (confirm(`Are you sure you want to permanently delete the role: ${role.title}?`)) {
            DataService.deleteItem(DataService.KEYS.ROLES, 'id', id);
            DataService.logActivity(`Deleted admin role ${role.title}`);
            Toast.show(`Role ${role.title} deleted successfully.`, 'info');
            App.refreshCurrentPage();
        }
    }
};
