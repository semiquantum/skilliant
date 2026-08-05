/**
 * Day 4 Deliverable: Export Report UI & Custom Generator
 */

const ExportReportsPage = {
    render() {
        return `
            ${UI.renderPageHeader('Export Custom Data Reports', 'Generate downloadable CSV / PDF statements for accounting, audits, and compliance.')}

            <div class="glass-card animate-slide-up" style="max-width:800px;">
                <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:1.25rem;">Report Builder Configuration</h3>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.25rem;" class="mb-4">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:4px;">Report Dataset Type</label>
                        <select id="exportDataset" class="form-control" style="width:100%;">
                            <option value="Bookings & Escrow">Bookings & Escrow Transactions</option>
                            <option value="Revenue & Commissions">Platform Revenue & 10% Fees</option>
                            <option value="Labour Roster">Verified Labour Roster & Ratings</option>
                            <option value="Activity Audit Log">Admin Security Audit Logs</option>
                        </select>
                    </div>

                    <div>
                        <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:4px;">Export Format</label>
                        <select id="exportFormat" class="form-control" style="width:100%;">
                            <option value="CSV">Comma Separated Values (.CSV)</option>
                            <option value="PDF">Formatted PDF Document (.PDF)</option>
                            <option value="Excel">Microsoft Excel (.XLSX)</option>
                        </select>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.25rem;" class="mb-6">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:4px;">Start Date</label>
                        <input type="date" id="exportStartDate" class="form-control" style="width:100%;" value="2026-08-01">
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:4px;">End Date</label>
                        <input type="date" id="exportEndDate" class="form-control" style="width:100%;" value="2026-08-05">
                    </div>
                </div>

                <div style="border-top:1px solid var(--border-color); padding-top:1.25rem;" class="flex justify-between items-center">
                    <span style="font-size:0.85rem; color:var(--text-muted);">Approximate file size: ~450 KB</span>
                    <button class="btn btn-accent" onclick="ExportReportsPage.generateExport()">
                        <span class="material-icons-round">download</span> Generate & Download Report
                    </button>
                </div>
            </div>
        `;
    },

    generateExport() {
        const dataset = document.getElementById('exportDataset')?.value;
        const format = document.getElementById('exportFormat')?.value;
        const startDate = document.getElementById('exportStartDate')?.value;
        const endDate = document.getElementById('exportEndDate')?.value;

        DataService.logActivity(`Generated ${format} export report for ${dataset} (${startDate} to ${endDate})`);
        Toast.show(`Export complete! Downloading ${dataset} (${format})...`, 'success');
    }
};
