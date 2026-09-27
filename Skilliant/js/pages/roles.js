/**
 * Skilliant Admin Portal — Role Management & Permissions
 * Keeps the existing role-card UI while making the permission scope functional.
 */
const RolesPage = {
    permissionGroups() {
        return {
            Dashboard: ['view:dashboard'],
            Users: ['view:users','create:users','edit:users','suspend:users','delete:users'],
            Labour: ['view:labour','create:labour','edit:labour','verify:labour','suspend:labour','delete:labour'],
            Contractors: ['view:contractors','create:contractors','edit:contractors','verify:contractors','delete:contractors'],
            Categories: ['view:categories','create:categories','edit:categories','delete:categories'],
            Skills: ['view:skills','create:skills','edit:skills','delete:skills'],
            Bookings: ['view:bookings','create:bookings','edit:bookings','cancel:bookings','delete:bookings'],
            Payments: ['view:payments','refund:payments','payout:payments','view:wallet'],
            Reports: ['view:reports','export:reports'],
            Notifications: ['view:notifications','manage:notifications'],
            Support: ['view:support','create:support','reply:support','assign:support','resolve:support'],
            'Activity Logs': ['view:activity','export:activity','clear:activity'],
            Administration: ['manage:admins','manage:roles','manage:permissions','view:settings','manage:settings']
        };
    },

    ensureRoles() {
        return DataService.ensureDay5ModulePermissions();
    },

    render() {
        if (DataService.getSession()?.role !== 'Super Admin') {
            return `${UI.renderPageHeader('Role Management','Role and permission administration is restricted to Super Admin.','')}<div class="glass-card" style="padding:2rem;text-align:center;"><i class="fa-solid fa-lock" style="font-size:2rem;color:var(--accent-gold);"></i><h3 style="margin:.8rem 0 .3rem;">Super Admin Access Required</h3><p class="text-muted">Only Super Admin can view or change role definitions and permissions.</p></div>`;
        }
        const roles = this.ensureRoles();
        const admins = DataService.getCollection(DataService.KEYS.ADMINS) || [];
        roles.forEach(r => { r.usersAssigned = admins.filter(a => a.role === r.title).length; });
        DataService.setStorage(DataService.KEYS.ROLES, roles);

        const rolesCardsHtml = roles.map(r => `
            <div class="glass-card animate-slide-up role-card">
                <div class="flex items-center justify-between">
                    <div class="kpi-icon-wrapper kpi-icon-purple role-icon"><i class="fa-solid fa-user-shield" aria-hidden="true"></i></div>
                    <span class="badge badge-info">${r.usersAssigned} Admin${r.usersAssigned===1?'':'s'} Assigned</span>
                </div>
                <div>
                    <h3 class="role-card-title">${UI.escapeHtml(r.title)}</h3>
                    <p class="role-card-id">ID: ${UI.escapeHtml(r.id)}</p>
                </div>
                <div>
                    <span class="role-scope-label">Granted Scope</span>
                    <div class="role-scope-list">
                        ${r.permissions.slice(0,12).map(p => `<span class="badge badge-secondary">${UI.escapeHtml(p)}</span>`).join('')}
                        ${r.permissions.length>12 ? `<span class="badge badge-secondary">+${r.permissions.length-12} more</span>` : ''}
                    </div>
                </div>
                <div class="role-card-footer">
                    <span>Role Authorization</span>
                    <button class="btn btn-outline btn-sm" onclick="RolesPage.editPermissionsModal('${UI.escapeHtml(r.id)}')" aria-label="Configure permissions for ${UI.escapeHtml(r.title)}"><i class="fa-solid fa-sliders"></i> Permissions</button>
                </div>
            </div>
        `).join('');

        return `${UI.renderPageHeader('Role Management','Super Admin controls administrator roles and access. Changes in the permission matrix are used by route authorization.', '')}
            <div class="role-grid">${rolesCardsHtml}</div>`;
    },

    editPermissionsModal(roleId) {
        if (!DataService.requirePermission('manage:permissions','Only Super Admin can manage roles and permissions.')) return;
        const roles = this.ensureRoles();
        const role = roles.find(x => x.id === roleId);
        if (!role) return;
        const groups = this.permissionGroups();
        const all = Object.values(groups).flat();
        const isSuper = role.id === 'ROLE-001' || role.title === 'Super Admin';
        const has = p => role.permissions.includes(p) || (p.startsWith('view:') && role.permissions.includes(p.split(':')[1]));

        const body = `<div class="permission-editor">
            <p class="text-muted">Choose exactly what members assigned to <strong>${UI.escapeHtml(role.title)}</strong> can access. View permissions control page access; action permissions control operations inside a module.</p>
            <div class="permission-matrix">
                ${Object.entries(groups).map(([group, perms]) => `<section class="permission-group">
                    <h4>${UI.escapeHtml(group)}</h4>
                    <div class="permission-options">${perms.map(p => `<label class="permission-option"><input type="checkbox" class="perm-checkbox" value="${p}" ${has(p)?'checked':''} ${isSuper?'disabled':''}><span>${UI.escapeHtml(p.replace(':',' — '))}</span></label>`).join('')}</div>
                </section>`).join('')}
            </div>
            ${isSuper ? '<p class="permission-warning"><i class="fa-solid fa-lock"></i> Super Admin always has full access and cannot be restricted.</p>' : ''}
        </div>`;

        ModalManager.open({
            title:`Permissions: ${role.title}`,
            bodyHtml:body,
            submitText:isSuper ? 'Close' : 'Save Permissions',
            onSubmit:()=>{
                if (isSuper) return ModalManager.close();
                const selected = [...document.querySelectorAll('.perm-checkbox:checked')].map(cb => cb.value);
                role.permissions = selected;
                DataService.setStorage(DataService.KEYS.ROLES, roles);
                DataService.logActivity(`Updated permissions for role ${role.title}`);
                Toast.show(`Permissions for ${role.title} saved.`, 'success');
                ModalManager.close();
                App.applyRoleVisibility();
                App.refreshCurrentPage();
            }
        });
    }
};
