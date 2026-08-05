/**
 * Skilliant Admin Portal - UI Component Factory
 * Reusable HTML components for consistent design across all 5 days.
 */

const UI = {
    // Render Page Header with optional Action Button
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

    // Render KPI Cards Row
    renderKpiCards(cards) {
        return `
            <div class="kpi-grid mb-6">
                ${cards.map(c => `
                    <div class="glass-card kpi-card glass-card-hover animate-slide-up">
                        <div class="kpi-header">
                            <span class="kpi-title">${c.title}</span>
                            <div class="kpi-icon-wrapper ${c.colorClass || 'kpi-icon-blue'}">
                                <span class="material-icons-round">${c.icon}</span>
                            </div>
                        </div>
                        <div class="kpi-value">${c.value}</div>
                        <div class="kpi-footer">
                            <span class="${c.trendUp ? 'trend-up' : 'trend-down'} flex items-center">
                                <span class="material-icons-round" style="font-size:16px;">${c.trendUp ? 'trending_up' : 'trending_down'}</span>
                                ${c.subtext}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // Render Status Badge
    renderBadge(text, type = 'secondary') {
        const typeMap = {
            'Active': 'success',
            'Verified': 'success',
            'Completed': 'success',
            'Approved': 'success',
            'Available': 'success',
            'Pending': 'warning',
            'In Progress': 'info',
            'Held': 'warning',
            'Held in Escrow': 'warning',
            'Suspended': 'danger',
            'Cancelled': 'danger',
            'Refunded': 'danger',
            'Flagged': 'danger',
            'High': 'danger',
            'Medium': 'warning',
            'Low': 'secondary',
            'Unavailable': 'secondary'
        };
        const badgeClass = typeMap[text] || type;
        return `<span class="badge badge-${badgeClass}">${text}</span>`;
    },

    // Render Controls Bar (Search + Dropdown Filters)
    renderControlsBar(searchId, placeholder, filters = [], actionButtonHtml = '') {
        return `
            <div class="controls-bar glass-card mb-4">
                <div class="header-search flex-1" style="max-width: 360px;">
                    <span class="material-icons-round search-icon">search</span>
                    <input type="text" id="${searchId}" class="form-control" placeholder="${placeholder}" aria-label="${placeholder}">
                </div>
                
                <div class="filter-group">
                    ${filters.map(f => `
                        <select id="${f.id}" class="form-control" aria-label="${f.label}">
                            <option value="">${f.label}</option>
                            ${f.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                    `).join('')}
                    ${actionButtonHtml}
                </div>
            </div>
        `;
    },

    // Render Dynamic Data Table
    renderTable(headers, rowsHtml, emptyMessage = "No records found.") {
        return `
            <div class="glass-card table-responsive animate-slide-up">
                <table class="data-table">
                    <thead>
                        <tr>
                            ${headers.map(h => `<th>${h}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml || `<tr><td colspan="${headers.length}" class="text-center text-muted" style="padding: 2rem;">${emptyMessage}</td></tr>`}
                    </tbody>
                </table>
            </div>
        `;
    }
};
