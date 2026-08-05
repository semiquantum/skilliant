/**
 * Day 2 Deliverable: Skills Master Data & Demand Tagging
 */

const SkillsPage = {
    render() {
        const skills = DataService.getCollection(DataService.KEYS.SKILLS) || [];

        const rowsHtml = skills.length > 0 ? skills.map(s => `
            <tr>
                <td><strong>${s.name}</strong></td>
                <td><span class="badge badge-info">${s.category}</span></td>
                <td>${UI.renderBadge(s.demand, s.demand === 'High' ? 'danger' : 'warning')}</td>
                <td><strong>${s.totalCertified}</strong> workers</td>
                <td><strong>${s.avgHourlyRate}/hr</strong></td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="SkillsPage.editSkillModal('${s.id}')">Edit</button>
                </td>
            </tr>
        `).join('') : '<tr><td colspan="10" class="text-center text-muted" style="padding: 2rem;">No records found.</td></tr>';

        return `
            ${UI.renderPageHeader('Specific Skill Tags & Demands', 'Manage standardized micro-skills and hourly benchmarks.', `
                <button class="btn btn-primary" onclick="SkillsPage.addSkillModal()">
                    <span class="material-icons-round">add</span> Add Skill Tag
                </button>
            `)}
            ${UI.renderControlsBar('skillSearchInput', 'Search skills by name or category...', [])}
            ${UI.renderTable(['Skill Name', 'Parent Category', 'Market Demand', 'Certified Labourers', 'Avg Benchmark Rate', 'Actions'], rowsHtml)}
        `;
    },

    init() {
        document.getElementById('skillSearchInput')?.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.data-table tbody tr');
            rows.forEach(r => {
                r.style.display = r.textContent.toLowerCase().includes(val) ? '' : 'none';
            });
        });
    },

    addSkillModal() {
        ModalManager.open({
            title: 'Define New Skill Tag',
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Skill Name</label>
                        <input type="text" id="skillName" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. Solar Panel Mounting">
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Category</label>
                        <input type="text" id="skillCat" class="form-control" style="width:100%; margin-top:4px;" placeholder="Electrical Works">
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Hourly Rate Benchmark</label>
                        <input type="text" id="skillRate" class="form-control" style="width:100%; margin-top:4px;" placeholder="$45">
                    </div>
                </div>
            `,
            submitText: 'Create Skill Tag',
            onSubmit: () => {
                const name = document.getElementById('skillName')?.value;
                const category = document.getElementById('skillCat')?.value || 'General';
                const avgHourlyRate = document.getElementById('skillRate')?.value || '$35';

                if (!name) {
                    Toast.show('Please specify skill name', 'warning');
                    return;
                }

                const newSkill = {
                    id: `SKL-${Date.now().toString().slice(-3)}`,
                    name,
                    category,
                    demand: 'High',
                    totalCertified: 1,
                    avgHourlyRate
                };

                DataService.addItem(DataService.KEYS.SKILLS, newSkill);
                DataService.logActivity(`Added skill tag ${name}`);
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

        ModalManager.open({
            title: `Edit Skill: ${s.name}`,
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Skill Name</label>
                        <input type="text" id="editSkillName" class="form-control" style="width:100%; margin-top:4px;" value="${s.name}">
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Market Demand</label>
                        <select id="editSkillDemand" class="form-control" style="width:100%; margin-top:4px;">
                            <option value="High" ${s.demand === 'High' ? 'selected' : ''}>High</option>
                            <option value="Medium" ${s.demand === 'Medium' ? 'selected' : ''}>Medium</option>
                            <option value="Low" ${s.demand === 'Low' ? 'selected' : ''}>Low</option>
                        </select>
                    </div>
                </div>
            `,
            submitText: 'Update Skill',
            onSubmit: () => {
                s.name = document.getElementById('editSkillName')?.value || s.name;
                s.demand = document.getElementById('editSkillDemand')?.value || s.demand;
                DataService.setStorage(DataService.KEYS.SKILLS, skills);
                DataService.logActivity(`Updated skill tag ${s.name}`);
                Toast.show(`Skill ${s.name} updated!`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    }
};
