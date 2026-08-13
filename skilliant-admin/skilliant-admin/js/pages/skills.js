/**
 * Day 2 Deliverable: Skills Master Data & Demand Tagging (SaaS-Ready Audit)
 */

const SkillsPage = {
    state: {
        search: '',
        status: ''
    },

    render() {
        const skills = DataService.getCollection(DataService.KEYS.SKILLS) || [];

        // Apply filters
        const filteredSkills = skills.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(this.state.search.toLowerCase()) ||
                (s.categoryName || '').toLowerCase().includes(this.state.search.toLowerCase()) ||
                (s.description || '').toLowerCase().includes(this.state.search.toLowerCase()) ||
                s.id.toLowerCase().includes(this.state.search.toLowerCase());
            const matchesStatus = !this.state.status || s.status === this.state.status;
            return matchesSearch && matchesStatus;
        });

        // Paginate
        const paginatedSkills = Pagination.getPageItems('skills', filteredSkills, 10);

        const rowsHtml = paginatedSkills.length > 0 ? paginatedSkills.map(s => `
            <tr>
                <td><strong>${s.name}</strong></td>
                <td><span class="badge badge-info">${s.categoryName || 'General'}</span></td>
                <td>${s.description || '—'}</td>
                <td><strong>${s.labourCount || 0}</strong> tradesmen</td>
                <td>${UI.renderBadge(s.status)}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-outline btn-sm" onclick="SkillsPage.editSkillModal('${s.id}')">
                            <i class="fa-solid fa-pen"></i> Edit
                        </button>
                        <button class="btn btn-outline btn-sm text-danger" onclick="SkillsPage.deleteSkill('${s.id}')">
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('') : `<tr><td colspan="6" class="text-center text-muted" style="padding: 3rem 1rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.15;"><i class="fa-solid fa-folder-open"></i></div>
            No trade skills found matching current search/filter.
        </td></tr>`;

        const paginationHtml = Pagination.renderControls('skills', filteredSkills.length, 10);

        return `
            ${UI.renderPageHeader('Specific Skill Tags & Demands', 'Manage standardized micro-skills and hourly benchmarks.', `
                <button class="btn btn-primary" onclick="SkillsPage.addSkillModal()">
                    <i class="fa-solid fa-plus"></i> Add Skill Tag
                </button>
            `)}
            ${UI.renderControlsBar('skillSearchInput', 'Search skills by name, category or description...', [
                { id: 'skillStatusFilter', label: 'Filter Status', options: ['Active', 'Inactive'] }
            ], '', null)}
            ${UI.renderTable(['Skill Name', 'Parent Category', 'Description', 'Certified Labourers', 'Status', 'Actions'], rowsHtml, paginationHtml)}
        `;
    },

    init() {
        const searchEl = document.getElementById('skillSearchInput');
        const filterEl = document.getElementById('skillStatusFilter');

        if (searchEl) {
            searchEl.value = this.state.search;
            searchEl.addEventListener('input', (e) => {
                this.state.search = e.target.value;
                Pagination.getState('skills', 0, 10).page = 1;
                App.refreshCurrentPage();
            });
        }

        if (filterEl) {
            filterEl.value = this.state.status;
            filterEl.addEventListener('change', (e) => {
                this.state.status = e.target.value;
                Pagination.getState('skills', 0, 10).page = 1;
                App.refreshCurrentPage();
            });
        }
    },

    addSkillModal() {
        const categories = DataService.getCollection(DataService.KEYS.CATEGORIES) || [];
        const catOptions = categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');

        ModalManager.open({
            title: 'Define New Skill Tag',
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Skill Name <span class="text-danger">*</span></label>
                        <input type="text" id="skillName" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. Copper Pipe Welding" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Parent Trade Category <span class="text-danger">*</span></label>
                        <select id="skillCatId" class="form-control" style="width:100%; margin-top:4px;" required>
                            ${catOptions || '<option value="">No categories defined</option>'}
                        </select>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Description <span class="text-danger">*</span></label>
                        <input type="text" id="skillDesc" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. Specialized soldering of home piping" required>
                    </div>
                </div>
            `,
            submitText: 'Create Skill Tag',
            onSubmit: () => {
                const name = document.getElementById('skillName')?.value.trim();
                const catId = document.getElementById('skillCatId')?.value;
                const description = document.getElementById('skillDesc')?.value.trim();

                if (!name || !catId || !description) {
                    Toast.show('Please fill in all required fields.', 'warning');
                    return;
                }

                const cat = categories.find(c => c.id === catId);
                const categoryName = cat ? cat.name : 'General';

                const newSkill = {
                    id: `SKL-${Date.now().toString().slice(-3)}`,
                    name,
                    categoryId: catId,
                    categoryName,
                    description,
                    labourCount: 0,
                    status: 'Active'
                };

                DataService.addItem(DataService.KEYS.SKILLS, newSkill);
                DataService.logActivity(`Added skill tag ${name} to category ${categoryName}`);
                Toast.show(`Skill ${name} created!`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    },

    editSkillModal(id) {
        const skills = DataService.getCollection(DataService.KEYS.SKILLS);
        const s = skills.find(x => x.id === id);
        if (!s) return;

        const categories = DataService.getCollection(DataService.KEYS.CATEGORIES) || [];
        const catOptions = categories.map(cat => `<option value="${cat.id}" ${cat.id === s.categoryId ? 'selected' : ''}>${cat.name}</option>`).join('');

        ModalManager.open({
            title: `Edit Skill Tag: ${s.name}`,
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Skill Name <span class="text-danger">*</span></label>
                        <input type="text" id="editSkillName" class="form-control" style="width:100%; margin-top:4px;" value="${s.name}" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Parent Trade Category <span class="text-danger">*</span></label>
                        <select id="editSkillCatId" class="form-control" style="width:100%; margin-top:4px;" required>
                            ${catOptions}
                        </select>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Description <span class="text-danger">*</span></label>
                        <input type="text" id="editSkillDesc" class="form-control" style="width:100%; margin-top:4px;" value="${s.description || ''}" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Status</label>
                        <select id="editSkillStatus" class="form-control" style="width:100%; margin-top:4px;">
                            <option value="Active" ${s.status === 'Active' ? 'selected' : ''}>Active</option>
                            <option value="Inactive" ${s.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                </div>
            `,
            submitText: 'Update Skill',
            onSubmit: () => {
                const name = document.getElementById('editSkillName')?.value.trim();
                const catId = document.getElementById('editSkillCatId')?.value;
                const description = document.getElementById('editSkillDesc')?.value.trim();
                const status = document.getElementById('editSkillStatus')?.value;

                if (!name || !catId || !description) {
                    Toast.show('Please fill in all required fields.', 'warning');
                    return;
                }

                const cat = categories.find(c => c.id === catId);
                const categoryName = cat ? cat.name : s.categoryName;

                s.name = name;
                s.categoryId = catId;
                s.categoryName = categoryName;
                s.description = description;
                s.status = status;

                DataService.setStorage(DataService.KEYS.SKILLS, skills);
                DataService.logActivity(`Updated skill tag ${s.name}`);
                Toast.show(`Skill ${s.name} updated!`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    },

    deleteSkill(id) {
        const skills = DataService.getCollection(DataService.KEYS.SKILLS);
        const s = skills.find(x => x.id === id);
        if (!s) return;

        if (confirm(`Are you sure you want to permanently delete skill tag: ${s.name}?`)) {
            DataService.deleteItem(DataService.KEYS.SKILLS, 'id', id);
            DataService.logActivity(`Deleted skill tag ${s.name}`);
            Toast.show(`Skill tag ${s.name} deleted.`, 'info');
            App.refreshCurrentPage();
        }
    }
};
