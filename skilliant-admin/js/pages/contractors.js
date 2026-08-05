/**
 * Day 2 Deliverable: Contractors Directory & Licensing
 */

const ContractorsPage = {
    render() {
        const contractors = DataService.getCollection(DataService.KEYS.CONTRACTORS) || [];

        const rowsHtml = contractors.length > 0 ? contractors.map(c => `
            <tr>
                <td>
                    <div class="table-user">
                        <div class="table-avatar" style="background: linear-gradient(135deg, #1E3A8A, #3B82F6);"><span class="material-icons-round" style="font-size:18px;">business</span></div>
                        <div>
                            <div class="table-user-name">${c.companyName}</div>
                            <div class="table-user-sub">Contact: ${c.contactPerson}</div>
                        </div>
                    </div>
                </td>
                <td><code>${c.licenseNo}</code></td>
                <td><strong>${c.workforceSize}</strong> workers</td>
                <td><strong>${c.activeProjects}</strong> active</td>
                <td>
                    <div class="flex items-center gap-1">
                        <span class="material-icons-round text-orange" style="font-size:18px;">star</span>
                        <strong>${c.rating}</strong>
                    </div>
                </td>
                <td>${UI.renderBadge(c.status)}</td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="ContractorsPage.toggleVerification('${c.id}')">
                        ${c.status === 'Verified' ? 'Revoke' : 'Approve'}
                    </button>
                </td>
            </tr>
        `).join('') : '<tr><td colspan="10" class="text-center text-muted" style="padding: 2rem;">No records found.</td></tr>';

        return `
            ${UI.renderPageHeader('Contracting Agencies & Firms', 'Manage registered construction companies and workforce suppliers.')}
            ${UI.renderControlsBar('contractorSearchInput', 'Search contractors by company name or license ID...', [])}
            ${UI.renderTable(['Company & Contact', 'License Number', 'Workforce Size', 'Active Projects', 'Rating', 'License Verification', 'Actions'], rowsHtml)}
        `;
    },

    init() {
        document.getElementById('contractorSearchInput')?.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.data-table tbody tr');
            rows.forEach(r => {
                r.style.display = r.textContent.toLowerCase().includes(val) ? '' : 'none';
            });
        });
    },

    toggleVerification(id) {
        const list = DataService.getCollection(DataService.KEYS.CONTRACTORS);
        const item = list.find(x => x.id === id);
        if (item) {
            item.status = item.status === 'Verified' ? 'Pending' : 'Verified';
            DataService.setStorage(DataService.KEYS.CONTRACTORS, list);
            DataService.logActivity(`Updated verification for contractor ${item.companyName} to ${item.status}`);
            Toast.show(`Contractor ${item.companyName} set to ${item.status}`, 'success');
            App.refreshCurrentPage();
        }
    }
};
