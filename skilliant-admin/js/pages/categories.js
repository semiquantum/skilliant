/**
 * Day 2 Deliverable: Job Categories Master Data (SaaS-Ready Audit)
 */

const CategoriesPage = {
    render() {
        const categories = DataService.getCollection(DataService.KEYS.CATEGORIES) || [];

        const categoryCardsHtml = categories.length > 0 ? categories.map(c => `
            <div class="glass-card glass-card-hover animate-slide-up" style="display:flex; flex-direction:column; justify-content:space-between; gap:1rem;">
                <div class="flex items-center justify-between">
                    <div class="kpi-icon-wrapper kpi-icon-blue" style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary-blue-light); color: var(--primary-blue); display:flex; align-items:center; justify-content:center; font-size:1.2rem;">
                        <i class="fa-solid ${c.icon.startsWith('fa-') ? c.icon : 'fa-' + c.icon}"></i>
                    </div>
                    ${UI.renderBadge(c.status)}
                </div>
                <div>
                    <h3 style="font-size:1.15rem; font-weight:700; color:var(--primary-navy);">${c.name}</h3>
                    <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px; line-height:1.4; height:40px; overflow:hidden; text-overflow:ellipsis;">
                        ${c.description || 'No description provided.'}
                    </p>
                    <p style="font-size:0.8rem; color:var(--text-light); margin-top:8px;">
                        <i class="fa-solid fa-users"></i> Registered Labour: <strong>${c.labourCount || 0}</strong>
                    </p>
                </div>
                <div style="border-top:1px solid var(--border-color); padding-top:0.75rem;" class="flex items-center justify-between">
                    <span style="font-size:0.78rem; font-weight:600; color:var(--text-light);">ID: ${c.id}</span>
                    <div style="display:flex; gap:0.25rem;">
                        <button class="btn btn-outline btn-sm" onclick="CategoriesPage.editCategoryModal('${c.id}')">
                            <i class="fa-solid fa-pen"></i> Edit
                        </button>
                        <button class="btn btn-outline btn-sm text-danger" onclick="CategoriesPage.deleteCategory('${c.id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('') : `<div style="grid-column: 1 / -1; text-align:center; padding:3rem; color:var(--text-muted);">
            <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.15;"><i class="fa-solid fa-folder-open"></i></div>
            No categories defined yet.
        </div>`;

        return `
            ${UI.renderPageHeader('Trade Skill Categories', 'Organize and structure trades into standardized platform job categories.', `
                <button class="btn btn-primary" onclick="CategoriesPage.addCategoryModal()">
                    <i class="fa-solid fa-plus"></i> New Category
                </button>
            `)}
            
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem;" class="mb-6">
                ${categoryCardsHtml}
            </div>
        `;
    },

    addCategoryModal() {
        ModalManager.open({
            title: 'Create Trade Category',
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Category Name <span class="text-danger">*</span></label>
                        <input type="text" id="catName" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. Plumbing Services" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Description <span class="text-danger">*</span></label>
                        <input type="text" id="catDesc" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. Pipe installs and leak repairs" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Font Awesome Icon Name</label>
                        <input type="text" id="catIcon" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. fa-faucet-drip or fa-bolt">
                    </div>
                </div>
            `,
            submitText: 'Save Category',
            onSubmit: () => {
                const name = document.getElementById('catName')?.value.trim();
                const description = document.getElementById('catDesc')?.value.trim();
                const icon = document.getElementById('catIcon')?.value.trim() || 'fa-hammer';

                if (!name || !description) {
                    Toast.show('Please enter category name and description.', 'warning');
                    return;
                }

                const newCat = {
                    id: `CAT-${Date.now().toString().slice(-3)}`,
                    name,
                    description,
                    icon: icon.startsWith('fa-') ? icon : 'fa-' + icon,
                    labourCount: 0,
                    status: 'Active',
                    createdAt: new Date().toISOString().split('T')[0]
                };

                DataService.addItem(DataService.KEYS.CATEGORIES, newCat);
                DataService.logActivity(`Added new trade category: ${name}`);
                Toast.show(`Category ${name} created!`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    },

    editCategoryModal(id) {
        const categories = DataService.getCollection(DataService.KEYS.CATEGORIES);
        const cat = categories.find(c => c.id === id);
        if (!cat) return;

        ModalManager.open({
            title: `Edit Category: ${cat.name}`,
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Category Name <span class="text-danger">*</span></label>
                        <input type="text" id="editCatName" class="form-control" style="width:100%; margin-top:4px;" value="${cat.name}" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Description <span class="text-danger">*</span></label>
                        <input type="text" id="editCatDesc" class="form-control" style="width:100%; margin-top:4px;" value="${cat.description || ''}" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Icon Name</label>
                        <input type="text" id="editCatIcon" class="form-control" style="width:100%; margin-top:4px;" value="${cat.icon || 'fa-hammer'}">
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Status</label>
                        <select id="editCatStatus" class="form-control" style="width:100%; margin-top:4px;">
                            <option value="Active" ${cat.status === 'Active' ? 'selected' : ''}>Active</option>
                            <option value="Inactive" ${cat.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                </div>
            `,
            submitText: 'Save Changes',
            onSubmit: () => {
                const name = document.getElementById('editCatName')?.value.trim();
                const description = document.getElementById('editCatDesc')?.value.trim();
                const icon = document.getElementById('editCatIcon')?.value.trim();
                const status = document.getElementById('editCatStatus')?.value;

                if (!name || !description) {
                    Toast.show('Please fill in all required fields.', 'warning');
                    return;
                }

                cat.name = name;
                cat.description = description;
                cat.icon = icon || cat.icon;
                cat.status = status;

                DataService.setStorage(DataService.KEYS.CATEGORIES, categories);
                DataService.logActivity(`Updated category ${cat.name}`);
                Toast.show(`Category ${cat.name} updated!`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    },

    deleteCategory(id) {
        const categories = DataService.getCollection(DataService.KEYS.CATEGORIES);
        const cat = categories.find(c => c.id === id);
        if (!cat) return;

        if (confirm(`Are you sure you want to permanently delete category: ${cat.name}?`)) {
            DataService.deleteItem(DataService.KEYS.CATEGORIES, 'id', id);
            DataService.logActivity(`Deleted category ${cat.name}`);
            Toast.show(`Category ${cat.name} deleted.`, 'info');
            App.refreshCurrentPage();
        }
    }
};
