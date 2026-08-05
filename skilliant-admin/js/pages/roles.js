/**
 * Day 5 Deliverable: Role Management & Permissions Matrix
 */

const RolesPage = {
    render() {
        const roles = DataService.getCollection(DataService.KEYS.ROLES) || [];

        const rolesCardsHtml = roles.map(r => `
            <div class="glass-card animate-slide-up" style="display:flex; flex-direction:column; justify-content:space-between; gap:1.25rem;">
                <div class="flex items-center justify-between">
                    <div class="kpi-icon-wrapper kpi-icon-purple">
                        <span class="material-icons-round">admin_panel_settings</span>
                    </div>
                    <span class="badge badge-info">${r.usersAssigned} Admins Assigned</span>
                </div>
                <div>
                    <h3 style="font-size:1.2rem; font-weight:700;">${r.title}</h3>
                    <p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">ID: ${r.id}</p>
                </div>
                <div>
                    <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); display:block; margin-bottom:6px;">Granted Scope</span>
                    <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
                        ${r.permissions.map(p => `<span class="badge badge-secondary">${p}</span>`).join('')}
                    </div>
                </div>
                <div style="border-top:1px solid var(--border-color); padding-top:0.75rem;" class="flex justify-end">
                    <button class="btn btn-outline btn-sm" onclick="RolesPage.editPermissionsModal('${r.id}')">Configure Matrix</button>
                </div>
            </div>
        `).join('');

        return `
            ${UI.renderPageHeader('Role Management & RBAC Matrix', 'Configure administrative roles and granular resource permission scopes.', `
                <button class="btn btn-primary" onclick="RolesPage.addRoleModal()">
                    <span class="material-icons-round">add_moderator</span> Create New Role
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
                                <input type="checkbox" value="${p}" class="perm-checkbox" ${role.permissions.includes(p) ? 'checked' : ''}>
                                <span style="text-transform:capitalize;">${p} Permission</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `,
            submitText: 'Save Role Scope',
            onSubmit: () => {
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
                    <label style="font-size:0.85rem; font-weight:600;">Role Title</label>
                    <input type="text" id="newRoleTitle" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. Audit Manager">
                </div>
            `,
            submitText: 'Create Role',
            onSubmit: () => {
                const title = document.getElementById('newRoleTitle')?.value;
                if (!title) {
                    Toast.show('Please specify a role title', 'warning');
                    return;
                }

                const newRole = {
                    id: `ROLE-${Date.now().toString().slice(-3)}`,
                    title,
                    usersAssigned: 1,
                    permissions: ['read', 'support']
                };

                DataService.addItem(DataService.KEYS.ROLES, newRole);
                DataService.logActivity(`Created new admin role ${title}`);
                Toast.show(`Role ${title} created!`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    }
};
