/**
 * Day 5 Deliverable: Role Management & Permissions Matrix (SaaS-Ready Audit)
 */

const RolesPage = {
    render() {
        let roles = DataService.getCollection(DataService.KEYS.ROLES) || [];
        const admins = DataService.getCollection(DataService.KEYS.ADMINS) || [];

        // Self-heal/seed the three supported administrative roles. Counts are always derived from real admin records.
        if (roles.length === 0) {
            roles = [
                { id: 'ROLE-001', title: 'Super Admin', permissions: ['dashboard','users','labour','contractors','categories','skills','bookings','payments','reports','notifications','settings','admins','roles'] },
                { id: 'ROLE-002', title: 'Admin', permissions: ['dashboard','users','labour','contractors','categories','skills','bookings','notifications'] },
                { id: 'ROLE-003', title: 'Finance Admin', permissions: ['dashboard','payments','reports'] },
            ];
            DataService.setStorage(DataService.KEYS.ROLES, roles);
        }

        // Recalculate assignment counts from the administrator directory; never show fabricated counts.
        roles.forEach(r => { r.usersAssigned = admins.filter(a => a.role === r.title).length; });
        DataService.setStorage(DataService.KEYS.ROLES, roles);

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

                    </div>
                </div>
            </div>
        `).join('');

        return `
            ${UI.renderPageHeader('Role Management', 'Super Admin controls administrator roles and access. Admin assignment counts are calculated from the actual administrator records.', '')}

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem;">
                ${rolesCardsHtml}
            </div>
        `;
    },

    editPermissionsModal(roleId) {
        const roles = DataService.getCollection(DataService.KEYS.ROLES);
        const role = roles.find(x => x.id === roleId);
        if (!role) return;

        const allPermissions = ['dashboard','users','labour','contractors','categories','skills','bookings','payments','reports','notifications','settings','admins','roles'];

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
        Toast.show('Use Admin Management to assign the supported roles: Admin or Finance Admin.', 'info');
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
