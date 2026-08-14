/**
 * Day 2 Deliverable: Labour Directory & Verification Module (SaaS-Ready Audit)
 */

const LabourPage = {
    state: {
        search: '',
        verification: '',
        availability: ''
    },

    render() {
        const labourers = DataService.getCollection(DataService.KEYS.LABOURS) || [];

        // Apply filters
        const filteredLabourers = labourers.filter(l => {
            const matchesSearch = l.name.toLowerCase().includes(this.state.search.toLowerCase()) ||
                (l.skill || '').toLowerCase().includes(this.state.search.toLowerCase()) ||
                (l.category || '').toLowerCase().includes(this.state.search.toLowerCase()) ||
                (l.email || '').toLowerCase().includes(this.state.search.toLowerCase()) ||
                (l.id || '').toLowerCase().includes(this.state.search.toLowerCase());
            const matchesVerification = !this.state.verification || l.verification === this.state.verification;
            const matchesAvailability = !this.state.availability || l.status === this.state.availability;
            return matchesSearch && matchesVerification && matchesAvailability;
        });

        // Paginate
        const paginatedLabour = Pagination.getPageItems('labour', filteredLabourers, 10);

        const rowsHtml = paginatedLabour.length > 0 ? paginatedLabour.map(l => `
            <tr>
                <td>
                    <div class="table-user">
                        <div class="table-avatar" style="background: linear-gradient(135deg, var(--accent-orange), var(--primary-navy)); color: var(--text-white);">
                            ${l.name.split(' ').map(n=>n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                            <div class="table-user-name">${l.name}</div>
                            <div class="table-user-sub">${l.phone} • ${l.email}</div>
                        </div>
                    </div>
                </td>
                <td><span class="badge badge-info">${l.skill}</span></td>
                <td><strong>${l.hourlyRate}</strong></td>
                <td>
                    <div class="flex items-center gap-1">
                        <i class="fa-solid fa-star text-orange" style="font-size:14px; color: var(--accent-orange);"></i>
                        <strong>${l.rating}</strong> (${l.jobsCompleted} jobs)
                    </div>
                </td>
                <td>${UI.renderBadge(l.verification)}</td>
                <td>${UI.renderBadge(l.status)}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-outline btn-sm" onclick="LabourPage.viewDetails('${l.id}')">
                            <i class="fa-solid fa-eye"></i> View
                        </button>
                        <button class="btn btn-outline btn-sm" onclick="LabourPage.editLabourModal('${l.id}')">
                            <i class="fa-solid fa-pen"></i> Edit
                        </button>
                        <button class="btn btn-outline btn-sm" onclick="LabourPage.toggleVerification('${l.id}')">
                            <i class="fa-solid fa-shield-halved"></i> ${l.verification === 'Verified' ? 'Revoke' : 'Verify'}
                        </button>
                        <button class="btn btn-outline btn-sm" onclick="LabourPage.toggleStatus('${l.id}')">
                            <i class="fa-solid fa-ban"></i> ${l.status === 'Suspended' ? 'Activate' : 'Suspend'}
                        </button>
                        <button class="btn btn-outline btn-sm text-danger" onclick="LabourPage.deleteLabour('${l.id}')">
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('') : `<tr><td colspan="7" class="text-center text-muted" style="padding: 3rem 1rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.15;"><i class="fa-solid fa-folder-open"></i></div>
            No skilled tradesmen found matching current search/filter.
        </td></tr>`;

        const paginationHtml = Pagination.renderControls('labour', filteredLabourers.length, 10);

        return `
            ${UI.renderPageHeader('Skilled Labour Directory', 'Manage individual skilled tradesmen, background checks, and verification.')}
            ${UI.renderControlsBar('labourSearchInput', 'Search labour by name, trade or category...', [
                { id: 'verificationFilter', label: 'Verification Status', options: ['Verified', 'Pending'] },
                { id: 'availabilityFilter', label: 'Availability / Status', options: ['Available', 'On Job', 'Unavailable', 'Suspended'] }
            ], `<button class="btn btn-primary" onclick="LabourPage.addLabourModal()"><i class="fa-solid fa-plus"></i> Add Labourer</button>`, { csvFn: 'LabourPage.exportCSV', pdfFn: 'LabourPage.exportPDF' })}
            ${UI.renderTable(['Labourer', 'Primary Trade Skill', 'Hourly Rate', 'Rating & Jobs', 'Verification', 'Availability', 'Actions'], rowsHtml, paginationHtml)}
        `;
    },

    init() {
        const searchEl = document.getElementById('labourSearchInput');
        const verFilterEl = document.getElementById('verificationFilter');
        const availFilterEl = document.getElementById('availabilityFilter');

        if (searchEl) {
            searchEl.value = this.state.search;
            searchEl.addEventListener('input', (e) => {
                this.state.search = e.target.value;
                Pagination.getState('labour', 0, 10).page = 1; // reset page
                App.refreshCurrentPage();
            });
        }

        if (verFilterEl) {
            verFilterEl.value = this.state.verification;
            verFilterEl.addEventListener('change', (e) => {
                this.state.verification = e.target.value;
                Pagination.getState('labour', 0, 10).page = 1;
                App.refreshCurrentPage();
            });
        }

        if (availFilterEl) {
            availFilterEl.value = this.state.availability;
            availFilterEl.addEventListener('change', (e) => {
                this.state.availability = e.target.value;
                Pagination.getState('labour', 0, 10).page = 1;
                App.refreshCurrentPage();
            });
        }
    },

    toggleVerification(id) {
        const labourers = DataService.getCollection(DataService.KEYS.LABOURS);
        const item = labourers.find(x => x.id === id);
        if (item) {
            item.verification = item.verification === 'Verified' ? 'Pending' : 'Verified';
            DataService.setStorage(DataService.KEYS.LABOURS, labourers);
            DataService.logActivity(`Updated verification status for labourer ${item.name} to ${item.verification}`);
            Toast.show(`Verification status for ${item.name} set to ${item.verification}`, 'success');
            App.refreshCurrentPage();
        }
    },

    toggleStatus(id) {
        const labourers = DataService.getCollection(DataService.KEYS.LABOURS);
        const item = labourers.find(x => x.id === id);
        if (item) {
            item.status = item.status === 'Suspended' ? 'Available' : 'Suspended';
            DataService.setStorage(DataService.KEYS.LABOURS, labourers);
            DataService.logActivity(`Toggled status of labourer ${item.name} to ${item.status}`);
            Toast.show(`Labourer ${item.name} status is now ${item.status}`, 'success');
            App.refreshCurrentPage();
        }
    },

    viewDetails(id) {
        const labourers = DataService.getCollection(DataService.KEYS.LABOURS);
        const l = labourers.find(x => x.id === id);
        if (!l) return;

        ModalManager.open({
            title: `Labour Profile: ${l.name}`,
            bodyHtml: `
                <div style="display:flex; gap:1.25rem; align-items:center;" class="mb-4">
                    <div class="table-avatar" style="width:60px; height:60px; font-size:1.4rem; background: linear-gradient(135deg, var(--accent-orange), var(--primary-navy)); color: var(--text-white); display:flex; align-items:center; justify-content:center; border-radius:50%;">
                        ${l.name.split(' ').map(n=>n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                        <h3 style="font-size:1.2rem; font-weight:700; color: var(--primary-navy);">${l.name}</h3>
                        <p style="color:var(--text-muted); font-size:0.85rem;">${l.phone} • ${l.email}</p>
                    </div>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; font-size:0.9rem;">
                    <div style="background:var(--primary-blue-light); padding:1rem; border-radius:8px; border: 1px solid var(--border-color);">
                        <span style="color:var(--text-muted); font-size:0.75rem; display:block;">Primary Trade Skill / Category</span>
                        <strong style="color: var(--primary-navy); font-size: 1.1rem;">${l.skill} / ${l.category}</strong>
                    </div>
                    <div style="background:var(--primary-blue-light); padding:1rem; border-radius:8px; border: 1px solid var(--border-color);">
                        <span style="color:var(--text-muted); font-size:0.75rem; display:block;">Hourly Service Rate</span>
                        <strong style="color: var(--primary-navy); font-size: 1.1rem;">${l.hourlyRate}</strong>
                    </div>
                    <div style="background:var(--primary-blue-light); padding:1rem; border-radius:8px; border: 1px solid var(--border-color);">
                        <span style="color:var(--text-muted); font-size:0.75rem; display:block;">Performance Rating</span>
                        <strong style="color: var(--primary-navy); font-size: 1.1rem;">★ ${l.rating}</strong>
                    </div>
                    <div style="background:var(--primary-blue-light); padding:1rem; border-radius:8px; border: 1px solid var(--border-color);">
                        <span style="color:var(--text-muted); font-size:0.75rem; display:block;">Jobs Completed</span>
                        <strong style="color: var(--primary-navy); font-size: 1.1rem;">${l.jobsCompleted} Jobs</strong>
                    </div>
                </div>
                <div style="margin-top: 1.25rem; font-size: 0.85rem; color: var(--text-muted);">
                    Registered on: <strong>${l.joinedDate || 'N/A'}</strong><br>
                    Verification Status: <strong>${l.verification}</strong><br>
                    Availability / Status: <strong>${l.status}</strong>
                </div>
            `,
            submitText: 'Close',
            onSubmit: () => ModalManager.close()
        });
    },

    addLabourModal() {
        const skillsList = DataService.getCollection(DataService.KEYS.SKILLS) || [];
        const optionsHtml = skillsList.map(s => `<option value="${s.id}">${s.name} (${s.categoryName})</option>`).join('');

        ModalManager.open({
            title: 'Add New Skilled Labourer',
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Full Name <span class="text-danger">*</span></label>
                        <input type="text" id="newLabourName" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. Carlos Rivera" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Email Address <span class="text-danger">*</span></label>
                        <input type="email" id="newLabourEmail" class="form-control" style="width:100%; margin-top:4px;" placeholder="carlos.r@labour.com" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Phone Number <span class="text-danger">*</span></label>
                        <input type="tel" id="newLabourPhone" class="form-control" style="width:100%; margin-top:4px;" placeholder="9876543220" required inputmode="numeric" maxlength="10" pattern="\d{10}" oninput="this.value=this.value.replace(/\D/g,'').slice(0,10)" required>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                        <div>
                            <label style="font-size:0.85rem; font-weight:600;">Primary Trade Skill <span class="text-danger">*</span></label>
                            <select id="newLabourSkill" class="form-control" style="width:100%; margin-top:4px;" required>
                                ${optionsHtml}
                            </select>
                        </div>
                        <div>
                            <label style="font-size:0.85rem; font-weight:600;">Hourly Rate ($/hr) <span class="text-danger">*</span></label>
                            <input type="text" id="newLabourRate" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. $45/hr" required>
                        </div>
                    </div>
                </div>
            `,
            submitText: 'Create Account',
            onSubmit: () => {
                const name = document.getElementById('newLabourName')?.value.trim();
                const email = document.getElementById('newLabourEmail')?.value.trim();
                const phone = document.getElementById('newLabourPhone')?.value.trim();
                const skillId = document.getElementById('newLabourSkill')?.value;
                const rate = document.getElementById('newLabourRate')?.value.trim();

                const selectedSkill = skillsList.find(s => s.id === skillId);
                const skill = selectedSkill ? selectedSkill.name : 'Unknown';
                const category = selectedSkill ? selectedSkill.categoryName : 'General';

                if (!name || !email || !phone || !skillId || !rate) {
                    Toast.show('Please fill in all required fields.', 'warning');
                    return;
                }
                if (!DataService.validatePhone(phone)) { Toast.show('Phone number must contain exactly 10 digits.', 'warning'); return; }

                const newLabour = {
                    id: `LAB-${Date.now().toString().slice(-4)}`,
                    name,
                    email,
                    phone,
                    skill,
                    category,
                    hourlyRate: rate.startsWith('$') ? rate : `$${rate}/hr`,
                    rating: 5.0,
                    jobsCompleted: 0,
                    verification: 'Pending',
                    status: 'Available',
                    joinedDate: new Date().toISOString().split('T')[0]
                };

                DataService.addItem(DataService.KEYS.LABOURS, newLabour);
                DataService.logActivity(`Registered new skilled labourer ${name} (${skill})`);
                Toast.show(`Labourer ${name} registered successfully!`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    },

    editLabourModal(id) {
        const labourers = DataService.getCollection(DataService.KEYS.LABOURS);
        const l = labourers.find(x => x.id === id);
        if (!l) return;

        const skillsList = DataService.getCollection(DataService.KEYS.SKILLS) || [];
        const optionsHtml = skillsList.map(s => `<option value="${s.id}" ${s.name === l.skill ? 'selected' : ''}>${s.name} (${s.categoryName})</option>`).join('');

        ModalManager.open({
            title: `Edit Labourer Details: ${l.name}`,
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Full Name <span class="text-danger">*</span></label>
                        <input type="text" id="editLabourName" class="form-control" style="width:100%; margin-top:4px;" value="${l.name}" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Email Address <span class="text-danger">*</span></label>
                        <input type="email" id="editLabourEmail" class="form-control" style="width:100%; margin-top:4px;" value="${l.email}" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Phone Number <span class="text-danger">*</span></label>
                        <input type="tel" id="editLabourPhone" class="form-control" style="width:100%; margin-top:4px;" value="${l.phone}" required inputmode="numeric" maxlength="10" pattern="\d{10}" oninput="this.value=this.value.replace(/\D/g,'').slice(0,10)" required>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                        <div>
                            <label style="font-size:0.85rem; font-weight:600;">Primary Trade Skill <span class="text-danger">*</span></label>
                            <select id="editLabourSkill" class="form-control" style="width:100%; margin-top:4px;" required>
                                ${optionsHtml}
                            </select>
                        </div>
                        <div>
                            <label style="font-size:0.85rem; font-weight:600;">Hourly Rate <span class="text-danger">*</span></label>
                            <input type="text" id="editLabourRate" class="form-control" style="width:100%; margin-top:4px;" value="${l.hourlyRate}" required>
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                        <div>
                            <label style="font-size:0.85rem; font-weight:600;">Verification</label>
                            <select id="editLabourVerification" class="form-control" style="width:100%; margin-top:4px;">
                                <option value="Verified" ${l.verification === 'Verified' ? 'selected' : ''}>Verified</option>
                                <option value="Pending" ${l.verification === 'Pending' ? 'selected' : ''}>Pending</option>
                            </select>
                        </div>
                        <div>
                            <label style="font-size:0.85rem; font-weight:600;">Availability / Status</label>
                            <select id="editLabourStatus" class="form-control" style="width:100%; margin-top:4px;">
                                <option value="Available" ${l.status === 'Available' ? 'selected' : ''}>Available</option>
                                <option value="On Job" ${l.status === 'On Job' ? 'selected' : ''}>On Job</option>
                                <option value="Unavailable" ${l.status === 'Unavailable' ? 'selected' : ''}>Unavailable</option>
                                <option value="Suspended" ${l.status === 'Suspended' ? 'selected' : ''}>Suspended</option>
                            </select>
                        </div>
                    </div>
                </div>
            `,
            submitText: 'Save Changes',
            onSubmit: () => {
                const name = document.getElementById('editLabourName')?.value.trim();
                const email = document.getElementById('editLabourEmail')?.value.trim();
                const phone = document.getElementById('editLabourPhone')?.value.trim();
                const skillId = document.getElementById('editLabourSkill')?.value;
                const rate = document.getElementById('editLabourRate')?.value.trim();
                const verification = document.getElementById('editLabourVerification')?.value;
                const status = document.getElementById('editLabourStatus')?.value;

                const selectedSkill = skillsList.find(s => s.id === skillId);
                const skill = selectedSkill ? selectedSkill.name : l.skill;
                const category = selectedSkill ? selectedSkill.categoryName : l.category;

                if (!name || !email || !phone || !skillId || !rate) {
                    Toast.show('Please fill in all required fields.', 'warning');
                    return;
                }
                if (!DataService.validatePhone(phone)) { Toast.show('Phone number must contain exactly 10 digits.', 'warning'); return; }

                l.name = name;
                l.email = email;
                l.phone = phone;
                l.skill = skill;
                l.category = category;
                l.hourlyRate = rate.startsWith('$') ? rate : `$${rate}/hr`;
                l.verification = verification;
                l.status = status;

                DataService.setStorage(DataService.KEYS.LABOURS, labourers);
                DataService.logActivity(`Updated details for labourer ${name}`);
                Toast.show(`Labourer ${name} updated successfully!`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    },

    deleteLabour(id) {
        const labourers = DataService.getCollection(DataService.KEYS.LABOURS);
        const l = labourers.find(x => x.id === id);
        if (!l) return;

        if (confirm(`Are you sure you want to permanently delete skilled labourer: ${l.name}?`)) {
            DataService.deleteItem(DataService.KEYS.LABOURS, 'id', id);
            DataService.logActivity(`Deleted skilled labourer ${l.name}`);
            Toast.show(`Labourer ${l.name} record deleted.`, 'info');
            App.refreshCurrentPage();
        }
    },

    exportCSV() {
        const labourers = DataService.getCollection(DataService.KEYS.LABOURS) || [];
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Skill', 'Hourly Rate', 'Rating', 'Jobs Completed', 'Verification', 'Status', 'Joined Date'];
        const rows = labourers.map(l => [l.id, l.name, l.email, l.phone, l.skill, l.hourlyRate, l.rating, l.jobsCompleted, l.verification, l.status, l.joinedDate]);
        ExportUtil.toCSV(headers, rows, 'labour_directory');
    },

    exportPDF() {
        const labourers = DataService.getCollection(DataService.KEYS.LABOURS) || [];
        const tableRows = labourers.map(l => `
            <tr>
                <td>${l.id}</td>
                <td>${l.name}</td>
                <td>${l.email}</td>
                <td>${l.skill}</td>
                <td>${l.hourlyRate}</td>
                <td>${l.rating}</td>
                <td>${l.jobsCompleted}</td>
                <td>${l.verification}</td>
                <td>${l.status}</td>
            </tr>
        `).join('');

        const tableHtml = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Trade Skill</th>
                        <th>Hourly Rate</th>
                        <th>Rating</th>
                        <th>Jobs</th>
                        <th>Verification</th>
                        <th>Availability</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        `;
        ExportUtil.print('Skilliant Skilled Labour Registry Report', tableHtml);
    }
};
