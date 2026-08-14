/**
 * Skilliant Admin Portal - UI Component Factory
 * Reusable HTML components — search, tables with real pagination, KPI cards, badge, export.
 */

// ============================================================
// EXPORT UTILITIES — shared across all pages
// ============================================================
const ExportUtil = {
    toCSV(headers, rows, filename = 'export') {
        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',') + '\n';
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        Toast.show(`${filename}.csv exported successfully!`, 'success');
    },

    print(title, bodyHtml) {
        const win = window.open('', '_blank');
        win.document.write(`
            <html><head><title>${title}</title>
            <style>
                body{font-family:Arial,sans-serif;padding:20px;color:#0F172A;}
                h1{font-size:1.4rem;margin-bottom:1rem;color:var(--primary-navy);}
                table{border-collapse:collapse;width:100%;}
                th{background:var(--primary-navy);color:#fff;padding:8px 12px;text-align:left;font-size:0.8rem;}
                td{padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:0.8rem;}
                tr:nth-child(even){background:#f8fafc;}
                .badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:0.7rem;font-weight:600;}
                @media print{body{padding:0;}}
            </style></head>
            <body>
            <h1>${title}</h1>
            <p style="color:#64748b;font-size:0.8rem;margin-bottom:1rem;">Generated: ${new Date().toLocaleString()} | Skilliant Admin Portal</p>
            ${bodyHtml}
            <script>window.onload=()=>window.print();<\/script>
            </body></html>
        `);
        win.document.close();
    }
};

// ============================================================
// PAGINATION HELPER
// ============================================================
const Pagination = {
    state: {},

    getState(pageId, total, perPage = 10) {
        if (!this.state[pageId]) {
            this.state[pageId] = { page: 1, perPage };
        }
        this.state[pageId].total = total;
        return this.state[pageId];
    },

    getPageItems(pageId, items, perPage = 10) {
        const s = this.getState(pageId, items.length, perPage);
        const start = (s.page - 1) * s.perPage;
        return items.slice(start, start + s.perPage);
    },

    setPage(pageId, page) {
        if (this.state[pageId]) {
            this.state[pageId].page = page;
            if (window.App) App.refreshCurrentPage();
        }
    },

    renderControls(pageId, total, perPage = 10) {
        const s = this.getState(pageId, total, perPage);
        const totalPages = Math.max(1, Math.ceil(total / perPage));
        const start = total === 0 ? 0 : (s.page - 1) * perPage + 1;
        const end = Math.min(s.page * perPage, total);

        let pages = '';
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= s.page - 1 && i <= s.page + 1)) {
                pages += `<button class="btn btn-sm ${i === s.page ? 'btn-primary' : 'btn-outline'}" onclick="Pagination.setPage('${pageId}', ${i})">${i}</button>`;
            } else if (i === s.page - 2 || i === s.page + 2) {
                pages += `<span style="padding:0 4px;color:var(--text-muted);">…</span>`;
            }
        }

        return `
            <div class="table-pagination" style="display:flex;justify-content:space-between;align-items:center;padding:0.85rem 1.5rem;border-top:1px solid var(--border-color);background:rgba(241,245,249,0.4);">
                <div style="font-size:0.82rem;color:var(--text-muted);">
                    Showing <strong>${start}</strong> – <strong>${end}</strong> of <strong>${total}</strong> records
                </div>
                <div style="display:flex;gap:0.25rem;align-items:center;">
                    <button class="btn btn-outline btn-sm" ${s.page <= 1 ? 'disabled' : ''} onclick="Pagination.setPage('${pageId}', ${s.page - 1})">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    ${pages}
                    <button class="btn btn-outline btn-sm" ${s.page >= totalPages ? 'disabled' : ''} onclick="Pagination.setPage('${pageId}', ${s.page + 1})">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;
    }
};

// ============================================================
// UI COMPONENT FACTORY
// ============================================================
const UI = {
    renderPageHeader(title, subtitle, actionBtnHtml = '') {
        return `
            <div class="page-header animate-fade-in">
                <div>
                    <h1 class="page-title">${title}</h1>
                    <p class="page-subtitle">${subtitle}</p>
                </div>
                ${actionBtnHtml ? `<div class="page-actions">${actionBtnHtml}</div>` : ''}
            </div>
        `;
    },

    renderKpiCards(cards) {
        return `
            <div class="kpi-grid mb-6">
                ${cards.map(c => `
                    <div class="glass-card kpi-card glass-card-hover animate-slide-up">
                        <div class="kpi-header">
                            <span class="kpi-title">${c.title}</span>
                            <div class="kpi-icon-wrapper ${c.colorClass || 'kpi-icon-blue'}">
                                <i class="${c.icon || 'fa-solid fa-chart-line'}"></i>
                            </div>
                        </div>
                        <div class="kpi-value">${c.value !== undefined && c.value !== null ? c.value : '—'}</div>
                        <div class="kpi-footer">
                            <span class="${c.trendUp !== false ? 'trend-up' : 'trend-down'} flex items-center gap-1">
                                <i class="fa-solid fa-${c.trendUp !== false ? 'arrow-trend-up' : 'arrow-trend-down'}"></i>
                                ${c.subtext || ''}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderBadge(text) {
        if (!text) return '<span class="badge badge-secondary">—</span>';
        const map = {
            'Active': 'success', 'Verified': 'success', 'Completed': 'success',
            'Approved': 'success', 'Available': 'success', 'Released': 'success',
            'Pending': 'warning', 'In Progress': 'info', 'Held': 'warning',
            'Held in Escrow': 'warning', 'Confirmed': 'info', 'On Job': 'info',
            'Suspended': 'danger', 'Cancelled': 'danger', 'Refunded': 'danger',
            'Flagged': 'danger', 'Inactive': 'secondary', 'Banned': 'danger',
            'Unavailable': 'secondary', 'Open': 'warning', 'Closed': 'success',
            'High': 'danger', 'Medium': 'warning', 'Low': 'secondary'
        };
        return `<span class="badge badge-${map[text] || 'secondary'}">${text}</span>`;
    },

    renderControlsBar(searchId, placeholder, filters = [], actionButtonHtml = '', exportConfig = null) {
        const csvBtn = exportConfig
            ? `<button class="btn btn-outline btn-sm" onclick="${exportConfig.csvFn}()" title="Export CSV"><i class="fa-solid fa-file-csv"></i> CSV</button>`
            : `<button class="btn btn-outline btn-sm" title="Export CSV (configure exportConfig)"><i class="fa-solid fa-file-csv"></i> CSV</button>`;
        const pdfBtn = exportConfig
            ? `<button class="btn btn-outline btn-sm" onclick="${exportConfig.pdfFn}()" title="Print / Export PDF"><i class="fa-solid fa-print"></i> Print</button>`
            : `<button class="btn btn-outline btn-sm" onclick="window.print()" title="Print"><i class="fa-solid fa-print"></i> Print</button>`;

        return `
            <div class="controls-bar glass-card mb-4" style="padding:1rem 1.5rem;">
                <div class="header-search flex-1" style="max-width:320px;">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="${searchId}" class="form-control" placeholder="${placeholder}" aria-label="${placeholder}">
                </div>
                <div class="filter-group">
                    ${filters.map(f => `
                        <select id="${f.id}" class="form-control" aria-label="${f.label}">
                            <option value="">${f.label}</option>
                            ${f.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                    `).join('')}
                    <div style="display:flex;gap:0.5rem;border-left:1px solid var(--border-color);padding-left:0.75rem;">
                        ${csvBtn}
                        ${pdfBtn}
                    </div>
                    ${actionButtonHtml}
                </div>
            </div>
        `;
    },

    renderTable(headers, rowsHtml, paginationHtml = '') {
        return `
            <div class="glass-card table-responsive animate-slide-up" style="padding:0;overflow-x:auto;overflow-y:hidden;">
                <table class="data-table">
                    <thead>
                        <tr>
                            ${headers.map(h => `<th>${h}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml || `<tr><td colspan="${headers.length}" style="text-align:center;padding:3rem 1rem;color:var(--text-muted);">
                            <div style="font-size:2.5rem;margin-bottom:0.75rem;opacity:0.15;"><i class="fa-solid fa-folder-open"></i></div>
                            No records found.
                        </td></tr>`}
                    </tbody>
                </table>
                ${paginationHtml}
            </div>
        `;
    }
};
