/**
 * Day 2 Deliverable: Labour Directory & Verification Module
 */

const LabourPage = {
    render() {
        const labourers = DataService.getCollection(DataService.KEYS.LABOURS) || [];

        const rowsHtml = labourers.length > 0 ? labourers.map(l => `
            <tr>
                <td>
                    <div class="table-user">
                        <div class="table-avatar" style="background: linear-gradient(135deg, var(--accent-orange), var(--primary-navy));">${l.name.split(' ').map(n=>n[0]).join('')}</div>
                        <div>
                            <div class="table-user-name">${l.name}</div>
                            <div class="table-user-sub">${l.phone}</div>
                        </div>
                    </div>
                </td>
                <td><span class="badge badge-info">${l.skill}</span></td>
                <td><strong>${l.hourlyRate}</strong></td>
                <td>
                    <div class="flex items-center gap-1">
                        <span class="material-icons-round text-orange" style="font-size:18px;">star</span>
                        <strong>${l.rating}</strong> (${l.jobsCompleted} jobs)
                    </div>
                </td>
                <td>${UI.renderBadge(l.verification)}</td>
                <td>${UI.renderBadge(l.status)}</td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="LabourPage.toggleVerification('${l.id}')">
                        ${l.verification === 'Verified' ? 'Revoke' : 'Approve'}
                    </button>
                </td>
            </tr>
        `).join('') : '<tr><td colspan="10" class="text-center text-muted" style="padding: 2rem;">No records found.</td></tr>';

        return `
            ${UI.renderPageHeader('Skilled Labour Directory', 'Manage individual skilled tradesmen, background checks, and verification.')}
            ${UI.renderControlsBar('labourSearchInput', 'Search labour by name or trade skill...', [
                { id: 'verificationFilter', label: 'Verification Status', options: ['Verified', 'Pending'] },
                { id: 'availabilityFilter', label: 'Availability', options: ['Available', 'On Job', 'Unavailable'] }
            ])}
            ${UI.renderTable(['Labourer', 'Primary Trade Skill', 'Hourly Rate', 'Rating & Jobs', 'Verification', 'Availability', 'Actions'], rowsHtml)}
        `;
    },

    init() {
        document.getElementById('labourSearchInput')?.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.data-table tbody tr');
            rows.forEach(r => {
                r.style.display = r.textContent.toLowerCase().includes(val) ? '' : 'none';
            });
        });
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
    }
};
