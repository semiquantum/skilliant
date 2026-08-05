/**
 * Day 5 Deliverable: Security Audit Trail & Activity Logs
 */

const ActivityLogsPage = {
    render() {
        const logs = DataService.getCollection(DataService.KEYS.ACTIVITY_LOGS) || [];

        const rowsHtml = logs.length > 0 ? logs.map(l => `
            <tr>
                <td><strong>${l.id}</strong></td>
                <td>
                    <div class="flex items-center gap-2">
                        <span class="material-icons-round text-primary" style="font-size:18px;">account_circle</span>
                        <strong>${l.admin}</strong>
                    </div>
                </td>
                <td style="font-weight:600;">${l.action}</td>
                <td><code>${l.ip}</code></td>
                <td>${l.timestamp}</td>
            </tr>
        `).join('') : '<tr><td colspan="10" class="text-center text-muted" style="padding: 2rem;">No records found.</td></tr>';

        return `
            ${UI.renderPageHeader('Security Audit Trail & Activity Logs', 'Immutable record of administrator actions, system changes, and access attempts.')}
            ${UI.renderControlsBar('logSearchInput', 'Filter audit logs by action or admin user...', [])}
            ${UI.renderTable(['Log ID', 'Administrator', 'Action Description', 'IP Address', 'Timestamp (UTC)'], rowsHtml)}
        `;
    },

    init() {
        document.getElementById('logSearchInput')?.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.data-table tbody tr');
            rows.forEach(r => {
                r.style.display = r.textContent.toLowerCase().includes(val) ? '' : 'none';
            });
        });
    }
};
