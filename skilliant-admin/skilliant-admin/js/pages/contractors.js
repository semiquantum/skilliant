/**
 * Day 2 Deliverable: Contractors Directory & Licensing (SaaS-Ready Audit)
 */

const ContractorsPage = {
    state: {
        search: '',
        status: '',
        verification: ''
    },

    render() {
        const contractors = DataService.getCollection(DataService.KEYS.CONTRACTORS) || [];

        // Apply filters
        const filteredContractors = contractors.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(this.state.search.toLowerCase()) ||
                (c.contactPerson || '').toLowerCase().includes(this.state.search.toLowerCase()) ||
                (c.specialization || '').toLowerCase().includes(this.state.search.toLowerCase()) ||
                (c.email || '').toLowerCase().includes(this.state.search.toLowerCase()) ||
                (c.location || '').toLowerCase().includes(this.state.search.toLowerCase()) ||
                (c.id || '').toLowerCase().includes(this.state.search.toLowerCase());
            const matchesStatus = !this.state.status || c.status === this.state.status;
            const matchesVerification = !this.state.verification || c.verificationStatus === this.state.verification;
            return matchesSearch && matchesStatus && matchesVerification;
        });

        // Paginate
        const paginatedContractors = Pagination.getPageItems('contractors', filteredContractors, 10);

        const rowsHtml = paginatedContractors.length > 0 ? paginatedContractors.map(c => `
            <tr>
                <td>
                    <div class="table-user">
                        <div class="table-avatar" style="background: linear-gradient(135deg, var(--primary-navy), var(--primary-blue)); color: var(--text-white);">
                            ${c.name.split(' ').map(n=>n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                            <div class="table-user-name">${c.name}</div>
                            <div class="table-user-sub">Contact: ${c.contactPerson}</div>
                        </div>
                    </div>
                </td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
                <td>${c.location || '—'}</td>
                <td><span class="badge badge-info">${c.specialization}</span></td>
                <td>
                    <div class="flex items-center gap-1">
                        <i class="fa-solid fa-star text-orange" style="font-size:14px; color: var(--accent-orange);"></i>
                        <strong>${c.rating}</strong> (${c.totalJobs} jobs)
                    </div>
                </td>
                <td><strong>${c.walletBalance}</strong></td>
                <td>${UI.renderBadge(c.verificationStatus)}</td>
                <td>${UI.renderBadge(c.status)}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-outline btn-sm" onclick="ContractorsPage.viewDetails('${c.id}')">
                            <i class="fa-solid fa-eye"></i> View
                        </button>
                        <button class="btn btn-outline btn-sm" onclick="ContractorsPage.editContractorModal('${c.id}')">
                            <i class="fa-solid fa-pen"></i> Edit
                        </button>
                        <button class="btn btn-outline btn-sm" onclick="ContractorsPage.toggleVerification('${c.id}')">
                            <i class="fa-solid fa-shield-halved"></i> ${c.verificationStatus === 'Verified' ? 'Revoke' : 'Verify'}
                        </button>
                        <button class="btn btn-outline btn-sm text-danger" onclick="ContractorsPage.deleteContractor('${c.id}')">
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('') : `<tr><td colspan="9" class="text-center text-muted" style="padding: 3rem 1rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.15;"><i class="fa-solid fa-folder-open"></i></div>
            No contracting firms found matching current search/filter.
        </td></tr>`;

        const paginationHtml = Pagination.renderControls('contractors', filteredContractors.length, 10);

        return `
            ${UI.renderPageHeader('Contracting Agencies & Firms', 'Manage registered construction companies and workforce suppliers.')}
            ${UI.renderControlsBar('contractorSearchInput', 'Search contractors by company name, contact or specialization...', [
                { id: 'contractorVerFilter', label: 'License Verification', options: ['Verified', 'Pending'] },
                { id: 'contractorStatusFilter', label: 'Filter Status', options: ['Active', 'Suspended'] }
            ], `<button class="btn btn-primary" onclick="ContractorsPage.addContractorModal()"><i class="fa-solid fa-plus"></i> Add Contractor</button>`, { csvFn: 'ContractorsPage.exportCSV', pdfFn: 'ContractorsPage.exportPDF' })}
            ${UI.renderTable(['Company & Contact', 'Email', 'Phone', 'Location', 'Specialization', 'Rating', 'Wallet Balance', 'License Verification', 'Status', 'Actions'], rowsHtml, paginationHtml)}
        `;
    },

    init() {
        const searchEl = document.getElementById('contractorSearchInput');
        const verFilterEl = document.getElementById('contractorVerFilter');
        const statusFilterEl = document.getElementById('contractorStatusFilter');

        if (searchEl) {
            searchEl.value = this.state.search;
            searchEl.addEventListener('input', (e) => {
                this.state.search = e.target.value;
                Pagination.getState('contractors', 0, 10).page = 1;
                App.refreshCurrentPage();
            });
        }

        if (verFilterEl) {
            verFilterEl.value = this.state.verification;
            verFilterEl.addEventListener('change', (e) => {
                this.state.verification = e.target.value;
                Pagination.getState('contractors', 0, 10).page = 1;
                App.refreshCurrentPage();
            });
        }

        if (statusFilterEl) {
            statusFilterEl.value = this.state.status;
            statusFilterEl.addEventListener('change', (e) => {
                this.state.status = e.target.value;
                Pagination.getState('contractors', 0, 10).page = 1;
                App.refreshCurrentPage();
            });
        }
    },

    toggleVerification(id) {
        const contractors = DataService.getCollection(DataService.KEYS.CONTRACTORS);
        const item = contractors.find(x => x.id === id);
        if (item) {
            item.verificationStatus = item.verificationStatus === 'Verified' ? 'Pending' : 'Verified';
            DataService.setStorage(DataService.KEYS.CONTRACTORS, contractors);
            DataService.logActivity(`Updated license verification for contractor ${item.name} to ${item.verificationStatus}`);
            Toast.show(`License verification for ${item.name} set to ${item.verificationStatus}`, 'success');
            App.refreshCurrentPage();
        }
    },

    viewDetails(id) {
        const contractors = DataService.getCollection(DataService.KEYS.CONTRACTORS);
        const c = contractors.find(x => x.id === id);
        if (!c) return;

        ModalManager.open({
            title: `Contractor Profile: ${c.name}`,
            bodyHtml: `
                <div style="display:flex; gap:1.25rem; align-items:center;" class="mb-4">
                    <div class="table-avatar" style="width:60px; height:60px; font-size:1.4rem; background: linear-gradient(135deg, var(--primary-navy), var(--primary-blue)); color: var(--text-white); display:flex; align-items:center; justify-content:center; border-radius:50%;">
                        ${c.name.split(' ').map(n=>n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                        <h3 style="font-size:1.2rem; font-weight:700; color: var(--primary-navy);">${c.name}</h3>
                        <p style="color:var(--text-muted); font-size:0.85rem;">Contact: ${c.contactPerson} • ${c.phone}</p>
                    </div>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; font-size:0.9rem;">
                    <div style="background:var(--primary-blue-light); padding:1rem; border-radius:8px; border: 1px solid var(--border-color);">
                        <span style="color:var(--text-muted); font-size:0.75rem; display:block;">Specialization / Focus</span>
                        <strong style="color: var(--primary-navy); font-size: 1.1rem;">${c.specialization}</strong>
                    </div>
                    <div style="background:var(--primary-blue-light); padding:1rem; border-radius:8px; border: 1px solid var(--border-color);">
                        <span style="color:var(--text-muted); font-size:0.75rem; display:block;">Office Location</span>
                        <strong style="color: var(--primary-navy); font-size: 1.1rem;">${c.location || '—'}</strong>
                    </div>
                    <div style="background:var(--primary-blue-light); padding:1rem; border-radius:8px; border: 1px solid var(--border-color);">
                        <span style="color:var(--text-muted); font-size:0.75rem; display:block;">Wallet Balance</span>
                        <strong style="color: var(--primary-navy); font-size: 1.1rem;">${c.walletBalance}</strong>
                    </div>
                    <div style="background:var(--primary-blue-light); padding:1rem; border-radius:8px; border: 1px solid var(--border-color);">
                        <span style="color:var(--text-muted); font-size:0.75rem; display:block;">Performance Rating</span>
                        <strong style="color: var(--primary-navy); font-size: 1.1rem;">★ ${c.rating}</strong>
                    </div>
                    <div style="background:var(--primary-blue-light); padding:1rem; border-radius:8px; border: 1px solid var(--border-color); grid-column: span 2;">
                        <span style="color:var(--text-muted); font-size:0.75rem; display:block;">Total Projects Run</span>
                        <strong style="color: var(--primary-navy); font-size: 1.1rem;">${c.totalJobs} Projects</strong>
                    </div>
                </div>
                <div style="margin-top: 1.25rem; font-size: 0.85rem; color: var(--text-muted);">
                    Registered on: <strong>${c.joinedDate || 'N/A'}</strong><br>
                    License Verification: <strong>${c.verificationStatus}</strong><br>
                    Business Status: <strong>${c.status}</strong>
                </div>
            `,
            submitText: 'Close',
            onSubmit: () => ModalManager.close()
        });
    },

    addContractorModal() {
        ModalManager.open({
            title: 'Add New Contracting Firm',
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Company Name <span class="text-danger">*</span></label>
                        <input type="text" id="newContName" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. BuildRight LLC" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Contact Person <span class="text-danger">*</span></label>
                        <input type="text" id="newContPerson" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. Susan Lee" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Email Address <span class="text-danger">*</span></label>
                        <input type="email" id="newContEmail" class="form-control" style="width:100%; margin-top:4px;" placeholder="info@company.com" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Phone Number <span class="text-danger">*</span></label>
                        <input type="text" id="newContPhone" class="form-control" style="width:100%; margin-top:4px;" placeholder="+1 555-3001" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Office Location <span class="text-danger">*</span></label>
                        <input type="text" id="newContLocation" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. San Francisco, CA" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Specialization Trade <span class="text-danger">*</span></label>
                        <input type="text" id="newContSpecial" class="form-control" style="width:100%; margin-top:4px;" placeholder="e.g. General Contracting" required>
                    </div>
                </div>
            `,
            submitText: 'Create Account',
            onSubmit: () => {
                const name = document.getElementById('newContName')?.value.trim();
                const contactPerson = document.getElementById('newContPerson')?.value.trim();
                const email = document.getElementById('newContEmail')?.value.trim();
                const phone = document.getElementById('newContPhone')?.value.trim();
                const location = document.getElementById('newContLocation')?.value.trim();
                const specialization = document.getElementById('newContSpecial')?.value.trim();
 
                if (!name || !contactPerson || !email || !phone || !location || !specialization) {
                    Toast.show('Please fill in all required fields.', 'warning');
                    return;
                }
 
                const newCont = {
                    id: `CON-${Date.now().toString().slice(-4)}`,
                    name,
                    contactPerson,
                    email,
                    phone,
                    location,
                    specialization,
                    rating: 5.0,
                    totalJobs: 0,
                    walletBalance: '$0.00',
                    verificationStatus: 'Pending',
                    status: 'Active',
                    joinedDate: new Date().toISOString().split('T')[0]
                };
 
                DataService.addItem(DataService.KEYS.CONTRACTORS, newCont);
                DataService.logActivity(`Registered new contractor company ${name}`);
                Toast.show(`Contractor company ${name} registered successfully!`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    },

    editContractorModal(id) {
        const contractors = DataService.getCollection(DataService.KEYS.CONTRACTORS);
        const c = contractors.find(x => x.id === id);
        if (!c) return;

        ModalManager.open({
            title: `Edit Contractor: ${c.name}`,
            bodyHtml: `
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Company Name <span class="text-danger">*</span></label>
                        <input type="text" id="editContName" class="form-control" style="width:100%; margin-top:4px;" value="${c.name}" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Contact Person <span class="text-danger">*</span></label>
                        <input type="text" id="editContPerson" class="form-control" style="width:100%; margin-top:4px;" value="${c.contactPerson}" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Email Address <span class="text-danger">*</span></label>
                        <input type="email" id="editContEmail" class="form-control" style="width:100%; margin-top:4px;" value="${c.email}" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Phone Number <span class="text-danger">*</span></label>
                        <input type="text" id="editContPhone" class="form-control" style="width:100%; margin-top:4px;" value="${c.phone}" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Office Location <span class="text-danger">*</span></label>
                        <input type="text" id="editContLocation" class="form-control" style="width:100%; margin-top:4px;" value="${c.location || ''}" placeholder="e.g. San Francisco, CA" required>
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600;">Specialization Trade <span class="text-danger">*</span></label>
                        <input type="text" id="editContSpecial" class="form-control" style="width:100%; margin-top:4px;" value="${c.specialization}" required>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                        <div>
                            <label style="font-size:0.85rem; font-weight:600;">Verification</label>
                            <select id="editContVerification" class="form-control" style="width:100%; margin-top:4px;">
                                <option value="Verified" ${c.verificationStatus === 'Verified' ? 'selected' : ''}>Verified</option>
                                <option value="Pending" ${c.verificationStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                            </select>
                        </div>
                        <div>
                            <label style="font-size:0.85rem; font-weight:600;">Status</label>
                            <select id="editContStatus" class="form-control" style="width:100%; margin-top:4px;">
                                <option value="Active" ${c.status === 'Active' ? 'selected' : ''}>Active</option>
                                <option value="Suspended" ${c.status === 'Suspended' ? 'selected' : ''}>Suspended</option>
                            </select>
                        </div>
                    </div>
                </div>
            `,
            submitText: 'Save Changes',
            onSubmit: () => {
                const name = document.getElementById('editContName')?.value.trim();
                const contactPerson = document.getElementById('editContPerson')?.value.trim();
                const email = document.getElementById('editContEmail')?.value.trim();
                const phone = document.getElementById('editContPhone')?.value.trim();
                const location = document.getElementById('editContLocation')?.value.trim();
                const specialization = document.getElementById('editContSpecial')?.value.trim();
                const verification = document.getElementById('editContVerification')?.value;
                const status = document.getElementById('editContStatus')?.value;
 
                if (!name || !contactPerson || !email || !phone || !location || !specialization) {
                    Toast.show('Please fill in all required fields.', 'warning');
                    return;
                }
 
                c.name = name;
                c.contactPerson = contactPerson;
                c.email = email;
                c.phone = phone;
                c.location = location;
                c.specialization = specialization;
                c.verificationStatus = verification;
                c.status = status;
 
                DataService.setStorage(DataService.KEYS.CONTRACTORS, contractors);
                DataService.logActivity(`Updated details for contractor company ${name}`);
                Toast.show(`Contractor company ${name} updated successfully!`, 'success');
                ModalManager.close();
                App.refreshCurrentPage();
            }
        });
    },

    deleteContractor(id) {
        const contractors = DataService.getCollection(DataService.KEYS.CONTRACTORS);
        const c = contractors.find(x => x.id === id);
        if (!c) return;

        if (confirm(`Are you sure you want to permanently delete contractor company: ${c.name}?`)) {
            DataService.deleteItem(DataService.KEYS.CONTRACTORS, 'id', id);
            DataService.logActivity(`Deleted contractor company ${c.name}`);
            Toast.show(`Contractor ${c.name} record deleted.`, 'info');
            App.refreshCurrentPage();
        }
    },

    exportCSV() {
        const contractors = DataService.getCollection(DataService.KEYS.CONTRACTORS) || [];
        const headers = ['ID', 'Company Name', 'Contact Person', 'Email', 'Phone', 'Specialization', 'Rating', 'Total Jobs', 'Wallet Balance', 'Verification', 'Status', 'Joined Date'];
        const rows = contractors.map(c => [c.id, c.name, c.contactPerson, c.email, c.phone, c.specialization, c.rating, c.totalJobs, c.walletBalance, c.verificationStatus, c.status, c.joinedDate]);
        ExportUtil.toCSV(headers, rows, 'contractors_directory');
    },

    exportPDF() {
        const contractors = DataService.getCollection(DataService.KEYS.CONTRACTORS) || [];
        const tableRows = contractors.map(c => `
            <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.contactPerson}</td>
                <td>${c.email}</td>
                <td>${c.specialization}</td>
                <td>${c.rating}</td>
                <td>${c.totalJobs}</td>
                <td>${c.walletBalance}</td>
                <td>${c.verificationStatus}</td>
                <td>${c.status}</td>
            </tr>
        `).join('');

        const tableHtml = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Company Name</th>
                        <th>Contact</th>
                        <th>Email</th>
                        <th>Specialization</th>
                        <th>Rating</th>
                        <th>Jobs</th>
                        <th>Wallet Balance</th>
                        <th>Verification</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        `;
        ExportUtil.print('Skilliant Contracting Agencies Report', tableHtml);
    }
};
