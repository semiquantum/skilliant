/**
 * Day 5 Deliverable: Security Audit Trail & Activity Logs (SaaS-Ready Audit)
 */

const ActivityLogsPage = {
    state: {
        search: ''
    },

    render() {
        const logs = DataService.getCollection(DataService.KEYS.ACTIVITY_LOGS) || [];

        // Apply filters
        const filteredLogs = logs.filter(l => {
            return l.id.toLowerCase().includes(this.state.search.toLowerCase()) ||
                l.admin.toLowerCase().includes(this.state.search.toLowerCase()) ||
                l.action.toLowerCase().includes(this.state.search.toLowerCase()) ||
                l.ip.toLowerCase().includes(this.state.search.toLowerCase());
        });

        // Paginate
        const paginatedLogs = Pagination.getPageItems('activity-logs', filteredLogs, 15);

        const rowsHtml = paginatedLogs.length > 0 ? paginatedLogs.map(l => `
            <tr>
                <td><strong>${l.id}</strong></td>
                <td>
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-circle-user text-primary" style="font-size:18px; color: var(--primary-blue);"></i>
                        <strong>${l.admin}</strong>
                    </div>
                </td>
                <td style="font-weight:600; color: var(--text-main);">${l.action}</td>
                <td><code>${l.ip}</code></td>
                <td>${l.timestamp}</td>
            </tr>
        `).join('') : `<tr><td colspan="5" class="text-center text-muted" style="padding: 3rem 1rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.15;"><i class="fa-solid fa-folder-open"></i></div>
            No activity logs found matching current search.
        </td></tr>`;

        const paginationHtml = Pagination.renderControls('activity-logs', filteredLogs.length, 15);

        return `
            ${UI.renderPageHeader('Security Audit Trail & Activity Logs', 'Immutable record of administrator actions, system changes, and access attempts.')}
            ${UI.renderControlsBar('logSearchInput', 'Filter audit logs by log ID, action, admin user or IP...', [], '', { csvFn: 'ActivityLogsPage.exportCSV', pdfFn: 'ActivityLogsPage.exportPDF' })}
            ${UI.renderTable(['Log ID', 'Administrator', 'Action Description', 'IP Address', 'Timestamp'], rowsHtml, paginationHtml)}
        `;
    },

    init() {
        const searchEl = document.getElementById('logSearchInput');

        if (searchEl) {
            searchEl.value = this.state.search;
            searchEl.addEventListener('input', (e) => {
                this.state.search = e.target.value;
                Pagination.getState('activity-logs', 0, 15).page = 1;
                App.refreshCurrentPage();
            });
        }
    },

    exportCSV() {
        const logs = DataService.getCollection(DataService.KEYS.ACTIVITY_LOGS) || [];
        const headers = ['Log ID', 'Administrator', 'Action Description', 'IP Address', 'Timestamp'];
        const rows = logs.map(l => [l.id, l.admin, l.action, l.ip, l.timestamp]);
        ExportUtil.toCSV(headers, rows, 'security_audit_logs');
    },

    exportPDF() {
        const logs = DataService.getCollection(DataService.KEYS.ACTIVITY_LOGS) || [];
        const tableRows = logs.map(l => `
            <tr>
                <td>${l.id}</td>
                <td>${l.admin}</td>
                <td>${l.action}</td>
                <td>${l.ip}</td>
                <td>${l.timestamp}</td>
            </tr>
        `).join('');

        const tableHtml = `
            <table>
                <thead>
                    <tr>
                        <th>Log ID</th>
                        <th>Administrator</th>
                        <th>Action Description</th>
                        <th>IP Address</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        `;
        ExportUtil.print('Skilliant Security Audit Trail Report', tableHtml);
    }
};
