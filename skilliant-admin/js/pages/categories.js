/**
 * Day 2 Deliverable: Job Categories Master Data
 */

const CategoriesPage = {
    render() {
        const categories = DataService.getCollection(DataService.KEYS.CATEGORIES) || [];

        const categoryCardsHtml = categories.map(c => `
            <div class="glass-card glass-card-hover animate-slide-up" style="display:flex; flex-direction:column; justify-content:space-between; gap:1rem;">
                <div class="flex items-center justify-between">
                    <div class="kpi-icon-wrapper kpi-icon-blue">
                        <span class="material-icons-round">${c.icon}</span>
                    </div>
                    ${UI.renderBadge(c.status)}
                </div>
                <div>
                    <h3 style="font-size:1.15rem; font-weight:700;">${c.name}</h3>
                    <p style="font-size:0.82rem; color:var(--text-muted); margin-top:4px;">
                        ${c.subcategoriesCount} Subcategories • ${c.activeWorkers} Registered Workers
                    </p>
                </div>
                <div style="border-top:1px solid var(--border-color); padding-top:0.75rem;" class="flex items-center justify-between">
                    <span style="font-size:0.78rem; font-weight:600; color:var(--primary-blue);">ID: ${c.id}</span>
                    <button class="btn btn-outline btn-sm" onclick="CategoriesPage.editCategoryModal('${c.id}')">Edit Category</button>
                </div>
            </div>
        `).join('');

        return `
            ${UI.renderPageHeader('Trade Skill Categories', 'Organize and structure trades into standardized platform job categories.', `
                <button class="btn btn-primary" onclick="CategoriesPage.addCategoryModal()">
                    <span class="material-icons-round">add</span> New Category
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
                        <label style="font-size:0.85rem; font-weight:600;">Category Name</label>
                        <input type="text" id="catName" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. Roofing & Waterproofing">
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Material Icon Name</label>
                        <input type="text" id="catIcon" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. house or build">
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Subcategories Count</label>
                        <input type="number" id="catSubCount" class="form-control" style="width:100%; margin-top:4px;" value="4">
                    </div>
                </div>
            `,
            submitText: 'Save Category',
            onSubmit: () => {
                const name = document.getElementById('catName')?.value;
                const icon = document.getElementById('catIcon')?.value || 'build';
                const subCount = parseInt(document.getElementById('catSubCount')?.value || '4', 10);

                if (!name) {
                    Toast.show('Please enter a category name', 'warning');
                    return;
                }

                const newCat = {
                    id: `CAT-${Date.now().toString().slice(-3)}`,
                    name,
                    icon,
                    subcategoriesCount: subCount,
                    activeWorkers: 0,
                    status: 'Active'
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
                        <label style="font-size:0.85rem; font-weight:600;">Category Name</label>
                        <input type="text" id="editCatName" class="form-control" style="width:100%; margin-top:4px;" value="${cat.name}">
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Icon Name</label>
                        <input type="text" id="editCatIcon" class="form-control" style="width:100%; margin-top:4px;" value="${cat.icon}">
                    </div>
                </div>
            `,
            submitText: 'Save Changes',
            onSubmit: () => {
                cat.name = document.getElementById('editCatName')?.value || cat.name;
                cat.icon = document.getElementById('editCatIcon')?.value || cat.icon;
                DataService.setStorage(DataService.KEYS.CATEGORIES, categories);
                DataService.logActivity(`Updated category ${cat.name}`);
                Toast.show(`Category ${cat.name} updated!`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    }
};
