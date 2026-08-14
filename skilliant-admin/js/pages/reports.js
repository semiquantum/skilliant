/**
 * Analytics & Reports — Consolidated from Day 4 (Revenue, Booking Analytics, User Growth, Export)
 * All data sourced from DataService. No hardcoded chart values.
 */

const ReportsPage = {
    activeTab: 'revenue',

    render() {
        DataService.recalculateFinancialState?.();
        const payments     = DataService.getCollection(DataService.KEYS.PAYMENTS) || [];
        const bookings     = DataService.getCollection(DataService.KEYS.BOOKINGS) || [];
        const users        = DataService.getCollection(DataService.KEYS.USERS)    || [];
        const labours      = DataService.getCollection(DataService.KEYS.LABOURS)  || [];
        const contractors  = DataService.getCollection(DataService.KEYS.CONTRACTORS) || [];

        const totalRevenue     = payments.filter(p => p.status === 'Completed').reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
        const totalCommission  = payments.filter(p => p.status === 'Completed').reduce((s, p) => s + (parseFloat(p.commissionFee) || 0), 0);
        const netRevenue       = totalRevenue - totalCommission;
        const completedBookings = bookings.filter(b => b.status === 'Completed').length;
        const pendingBookings   = bookings.filter(b => b.status === 'Pending').length;
        const cancelledBookings = bookings.filter(b => b.status === 'Cancelled').length;

        const fmt = n => `$${parseFloat(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        const kpiCardsData = [
            { title: 'Gross Revenue', value: fmt(totalRevenue), subtext: `${payments.filter(p => p.status === 'Completed').length} completed payments`, trendUp: true, icon: 'fa-solid fa-dollar-sign', colorClass: 'kpi-icon-green' },
            { title: 'Platform Commission', value: fmt(totalCommission), subtext: 'Net platform income', trendUp: true, icon: 'fa-solid fa-wallet', colorClass: 'kpi-icon-blue' },
            { title: 'Completed Bookings', value: completedBookings, subtext: `${pendingBookings} pending, ${cancelledBookings} cancelled`, trendUp: true, icon: 'fa-solid fa-calendar-check', colorClass: 'kpi-icon-orange' },
            { title: 'Net Revenue', value: fmt(netRevenue), subtext: 'Gross revenue less commission', trendUp: true, icon: 'fa-solid fa-chart-line', colorClass: 'kpi-icon-gold' }
        ];

        // Recent payments table (last 8)
        const paymentRowsHtml = payments.length > 0
            ? payments.slice(-8).reverse().map(p => `
                <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.userName || '—'}</td>
                    <td><code style="background:var(--primary-blue-light);padding:2px 6px;border-radius:4px;font-size:0.8rem;">${p.bookingId || '—'}</code></td>
                    <td><strong>${fmt(p.amount)}</strong></td>
                    <td style="color:var(--text-muted);">${fmt(p.commissionFee)}</td>
                    <td>${p.method || '—'}</td>
                    <td>${UI.renderBadge(p.status)}</td>
                    <td>${p.date || '—'}</td>
                </tr>`).join('')
            : `<tr><td colspan="8" class="text-center text-muted" style="padding:3rem;">No payment records found.</td></tr>`;

        return `
            ${UI.renderPageHeader('Analytics & Reports',
                'Comprehensive platform analytics — revenue, bookings, user growth, and data export.',
                `<div style="display:flex;gap:0.65rem;">
                    <button class="btn btn-outline btn-sm" onclick="ReportsPage.exportCSV()">
                        <i class="fa-solid fa-file-csv"></i> Export CSV
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="ReportsPage.printReport()">
                        <i class="fa-solid fa-print"></i> Print
                    </button>
                </div>`
            )}

            ${UI.renderKpiCards(kpiCardsData)}

            <!-- Tab Navigation -->
            <div class="glass-card animate-slide-up" style="padding:0;overflow:hidden;">
                <div class="tab-nav" style="padding:0 1.5rem;" role="tablist">
                    <button class="tab-btn ${ReportsPage.activeTab === 'revenue' ? 'active' : ''}"
                        onclick="ReportsPage._switchTab('revenue')" role="tab"
                        aria-selected="${ReportsPage.activeTab === 'revenue'}">
                        <i class="fa-solid fa-dollar-sign"></i> Revenue
                    </button>
                    <button class="tab-btn ${ReportsPage.activeTab === 'bookings' ? 'active' : ''}"
                        onclick="ReportsPage._switchTab('bookings')" role="tab"
                        aria-selected="${ReportsPage.activeTab === 'bookings'}">
                        <i class="fa-solid fa-calendar-check"></i> Booking Analytics
                    </button>
                    <button class="tab-btn ${ReportsPage.activeTab === 'growth' ? 'active' : ''}"
                        onclick="ReportsPage._switchTab('growth')" role="tab"
                        aria-selected="${ReportsPage.activeTab === 'growth'}">
                        <i class="fa-solid fa-users"></i> User Growth
                    </button>
                    <button class="tab-btn ${ReportsPage.activeTab === 'export' ? 'active' : ''}"
                        onclick="ReportsPage._switchTab('export')" role="tab"
                        aria-selected="${ReportsPage.activeTab === 'export'}">
                        <i class="fa-solid fa-file-export"></i> Export
                    </button>
                </div>

                <!-- Revenue Tab -->
                <div class="tab-pane ${ReportsPage.activeTab === 'revenue' ? 'active' : ''}" id="tabRevenue" style="padding:1.5rem;" role="tabpanel">
                    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.5rem;">
                        ${ReportsPage.statBox('Gross Revenue', fmt(totalRevenue), 'var(--success)', 'rgba(16,185,129,0.08)', 'rgba(16,185,129,0.2)')}
                        ${ReportsPage.statBox('Platform Commission', fmt(totalCommission), 'var(--primary-blue)', 'rgba(37,99,235,0.08)', 'rgba(37,99,235,0.2)')}
                        ${ReportsPage.statBox('Net (After Commission)', fmt(netRevenue), 'var(--accent-gold)', 'rgba(217,119,6,0.08)', 'rgba(217,119,6,0.2)')}
                    </div>
                    <div style="margin-bottom:0.75rem;font-weight:700;font-size:0.9rem;color:var(--primary-navy);">Monthly Revenue Trend</div>
                    <div class="chart-container"><canvas id="revenueChart" aria-label="Monthly Revenue Chart"></canvas></div>
                    <div style="margin-top:1.5rem;">
                        <div style="font-weight:700;font-size:0.9rem;color:var(--primary-navy);margin-bottom:0.75rem;">Financial Report Snapshot</div>
                        <div class="table-responsive" style="padding:0;">
                            <table class="data-table">
                                <thead><tr><th>Metric</th><th>Current Value</th><th>Source</th></tr></thead>
                                <tbody>
                                    <tr><td>Gross Revenue</td><td><strong>${fmt(totalRevenue)}</strong></td><td>Completed payments</td></tr>
                                    <tr><td>Platform Commission</td><td><strong>${fmt(totalCommission)}</strong></td><td>Payment commission</td></tr>
                                    <tr><td>Net Revenue</td><td><strong>${fmt(netRevenue)}</strong></td><td>Gross minus commission</td></tr>
                                    <tr><td>Completed Bookings</td><td><strong>${completedBookings}</strong></td><td>Booking records</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Booking Analytics Tab -->
                <div class="tab-pane ${ReportsPage.activeTab === 'bookings' ? 'active' : ''}" id="tabBookings" style="padding:1.5rem;" role="tabpanel">
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;">
                        <div>
                            <div style="font-weight:700;font-size:0.9rem;color:var(--primary-navy);margin-bottom:0.75rem;">Status Distribution</div>
                            <div style="display:flex;flex-direction:column;gap:0.6rem;">
                                ${ReportsPage.statRow('Total Bookings', bookings.length, 'var(--primary-navy)')}
                                ${ReportsPage.statRow('Completed', completedBookings, 'var(--success)')}
                                ${ReportsPage.statRow('In Progress', bookings.filter(b => b.status === 'In Progress').length, 'var(--info)')}
                                ${ReportsPage.statRow('Confirmed', bookings.filter(b => b.status === 'Confirmed').length, 'var(--info)')}
                                ${ReportsPage.statRow('Pending', pendingBookings, 'var(--warning)')}
                                ${ReportsPage.statRow('Cancelled', cancelledBookings, 'var(--danger)')}
                                ${ReportsPage.statRow('Fulfillment Rate', bookings.length > 0 ? `${((completedBookings / bookings.length) * 100).toFixed(1)}%` : '—', 'var(--primary-blue)')}
                            </div>
                        </div>
                        <div>
                            <div style="font-weight:700;font-size:0.9rem;color:var(--primary-navy);margin-bottom:0.75rem;">Category Bookings</div>
                            <div class="chart-container chart-container-sm"><canvas id="categoryChart" aria-label="Category Bookings Chart"></canvas></div>
                        </div>
                    </div>
                </div>

                <!-- User Growth Tab -->
                <div class="tab-pane ${ReportsPage.activeTab === 'growth' ? 'active' : ''}" id="tabGrowth" style="padding:1.5rem;" role="tabpanel">
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1rem;margin-bottom:1.5rem;">
                        ${ReportsPage.statBox('Total Users', users.length, 'var(--primary-navy)', 'rgba(30,58,138,0.06)', 'rgba(30,58,138,0.15)')}
                        ${ReportsPage.statBox('Total Labourers', labours.length, 'var(--success)', 'rgba(16,185,129,0.06)', 'rgba(16,185,129,0.15)')}
                        ${ReportsPage.statBox('Total Contractors', contractors.length, 'var(--accent-orange)', 'rgba(249,115,22,0.06)', 'rgba(249,115,22,0.15)')}
                        ${ReportsPage.statBox('Active Users', users.filter(u => u.status === 'Active').length, 'var(--primary-blue)', 'rgba(37,99,235,0.06)', 'rgba(37,99,235,0.15)')}
                    </div>
                    <div style="font-weight:700;font-size:0.9rem;color:var(--primary-navy);margin-bottom:0.75rem;">Registration Growth Trend</div>
                    <div class="chart-container"><canvas id="growthChart" aria-label="User Growth Chart"></canvas></div>
                </div>

                <!-- Export Tab -->
                <div class="tab-pane ${ReportsPage.activeTab === 'export' ? 'active' : ''}" id="tabExport" style="padding:1.5rem;" role="tabpanel">
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.25rem;">
                        ${ReportsPage._exportCard('Payments Report', 'All transaction records', 'fa-money-bill-wave', 'ReportsPage.exportPayments()')}
                        ${ReportsPage._exportCard('Bookings Report', 'All booking records', 'fa-calendar-check', 'ReportsPage.exportBookings()')}
                        ${ReportsPage._exportCard('Users Report', 'All registered users', 'fa-users', 'ReportsPage.exportUsers()')}
                        ${ReportsPage._exportCard('Labour Report', 'All labourer records', 'fa-helmet-safety', 'ReportsPage.exportLabour()')}
                        ${ReportsPage._exportCard('Full Platform Report', 'All collections combined', 'fa-file-zipper', 'ReportsPage.exportCSV()')}
                        ${ReportsPage._exportCard('Print Summary', 'Print-ready report', 'fa-print', 'ReportsPage.printReport()')}
                    </div>
                </div>
            </div>
        `;
    },

    statBox(label, value, color, bg, border) {
        return `<div style="background:${bg};border:1px solid ${border};border-radius:12px;padding:1rem;text-align:center;">
            <div style="font-size:1.4rem;font-weight:800;color:${color};">${value}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">${label}</div>
        </div>`;
    },

    statRow(label, value, color) {
        return `<div class="info-row">
            <span class="info-row-label">${label}</span>
            <strong class="info-row-value" style="color:${color};">${value}</strong>
        </div>`;
    },

    _exportCard(title, desc, icon, onclick) {
        return `<div class="glass-card glass-card-hover" style="cursor:pointer;text-align:center;padding:2rem 1.5rem;" onclick="${onclick}">
            <div style="width:54px;height:54px;border-radius:50%;background:var(--primary-blue-light);display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;color:var(--primary-blue);font-size:1.3rem;">
                <i class="fa-solid ${icon}" aria-hidden="true"></i>
            </div>
            <div style="font-weight:700;color:var(--primary-navy);margin-bottom:4px;">${title}</div>
            <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem;">${desc}</div>
            <button class="btn btn-primary btn-sm w-full" onclick="${onclick}">
                <i class="fa-solid fa-download"></i> Download CSV
            </button>
        </div>`;
    },

    _switchTab(tab) {
        this.activeTab = tab;
        App.refreshCurrentPage();
    },

    init() {
        if (this.activeTab === 'revenue' || this.activeTab === 'bookings' || this.activeTab === 'growth') {
            this._renderCharts();
        }
    },

    _renderCharts() {
        const payments    = DataService.getCollection(DataService.KEYS.PAYMENTS) || [];
        const bookings    = DataService.getCollection(DataService.KEYS.BOOKINGS) || [];
        const users       = DataService.getCollection(DataService.KEYS.USERS)    || [];
        const labours     = DataService.getCollection(DataService.KEYS.LABOURS)  || [];
        const contractors = DataService.getCollection(DataService.KEYS.CONTRACTORS) || [];

        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const now = new Date();

        if (this.activeTab === 'revenue') {
            const labels = [], grossData = [], commData = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                labels.push(monthNames[d.getMonth()] + "'" + String(d.getFullYear()).slice(2));
                const mPays = payments.filter(p => {
                    if (!p.date) return false;
                    const pd = new Date(p.date);
                    return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth() && p.status === 'Completed';
                });
                grossData.push(parseFloat(mPays.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0).toFixed(2)));
                commData.push(parseFloat(mPays.reduce((s, p) => s + (parseFloat(p.commissionFee) || 0), 0).toFixed(2)));
            }
            ChartsEngine.renderRevenueTrendChart('revenueChart', labels, grossData, commData);
        }

        if (this.activeTab === 'bookings') {
            // Category distribution from actual bookings
            const catMap = {};
            bookings.forEach(b => { catMap[b.category] = (catMap[b.category] || 0) + 1; });
            const catLabels = Object.keys(catMap);
            const catData   = Object.values(catMap);

            ChartsEngine.destroyChart('categoryChart');
            const ctx = document.getElementById('categoryChart')?.getContext('2d');
            if (ctx && catLabels.length > 0) {
                const gold = getComputedStyle(document.documentElement).getPropertyValue('--primary-blue').trim() || '#C5A059';
                const brass = getComputedStyle(document.documentElement).getPropertyValue('--accent-orange').trim() || '#AA7C11';
                ChartsEngine.instances['categoryChart'] = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: catLabels,
                        datasets: [{
                            label: 'Bookings',
                            data: catData,
                            backgroundColor: [gold, brass, '#8E6F3E', '#10B981', '#725B38', '#C5A059'],
                            borderRadius: 8
                        }]
                    },
                    options: {
                        responsive: true, maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            x: { grid: { display: false } },
                            y: { grid: { color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() || '#E8DED1' }, ticks: { stepSize: 1 } }
                        }
                    }
                });
            }
        }

        if (this.activeTab === 'growth') {
            // User growth — by join date month
            const labels = [];
            const usersGrowth = [], labourGrowth = [], contractorGrowth = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                labels.push(monthNames[d.getMonth()] + "'" + String(d.getFullYear()).slice(2));
                const inMonth = (list, field) => list.filter(x => {
                    if (!x[field]) return false;
                    const fd = new Date(x[field]);
                    return fd.getFullYear() === d.getFullYear() && fd.getMonth() === d.getMonth();
                }).length;
                usersGrowth.push(inMonth(users, 'joinedDate'));
                labourGrowth.push(inMonth(labours, 'joinedDate'));
                contractorGrowth.push(inMonth(contractors, 'joinedDate'));
            }
            ChartsEngine.destroyChart('growthChart');
            const ctx = document.getElementById('growthChart')?.getContext('2d');
            if (ctx) {
                ChartsEngine.instances['growthChart'] = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels,
                        datasets: [
                            { label: 'Users', data: usersGrowth, borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-blue').trim() || '#C5A059', backgroundColor: 'rgba(197,160,89,0.1)', fill: true, tension: 0.4, borderWidth: 2.5 },
                            { label: 'Labourers', data: labourGrowth, borderColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-orange').trim() || '#AA7C11', backgroundColor: 'rgba(170,124,17,0.1)', fill: true, tension: 0.4, borderWidth: 2.5 },
                            { label: 'Contractors', data: contractorGrowth, borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4, borderWidth: 2.5 }
                        ]
                    },
                    options: {
                        responsive: true, maintainAspectRatio: false,
                        plugins: { legend: { position: 'top', labels: { usePointStyle: true } } },
                        scales: {
                            x: { grid: { display: false } },
                            y: { grid: { color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() || '#E8DED1' }, ticks: { stepSize: 1 } }
                        }
                    }
                });
            }
        }
    },

    // ── EXPORTS — each generates a real downloadable CSV ──

    exportPayments() {
        const payments = DataService.getCollection(DataService.KEYS.PAYMENTS) || [];
        if (payments.length === 0) { Toast.show('No payment records to export.', 'warning'); return; }
        const headers = ['Transaction ID','User','Booking ID','Amount','Commission Fee','Method','Status','Date'];
        const rows = payments.map(p => [p.id, p.userName || '—', p.bookingId || '—',
            `$${(parseFloat(p.amount)||0).toFixed(2)}`, `$${(parseFloat(p.commissionFee)||0).toFixed(2)}`,
            p.method || '—', p.status, p.date || '—']);
        ExportUtil.toCSV(headers, rows, 'skilliant_payments');
    },

    exportBookings() {
        const bookings = DataService.getCollection(DataService.KEYS.BOOKINGS) || [];
        if (bookings.length === 0) { Toast.show('No booking records to export.', 'warning'); return; }
        const headers = ['Booking ID','Customer','Assigned To','Category','Amount','Date','Status','Escrow Status'];
        const rows = bookings.map(b => [b.id, b.customer||'—', b.assignedTo||'—', b.category||'—',
            b.amount||'—', b.date||'—', b.status, b.escrowStatus||'—']);
        ExportUtil.toCSV(headers, rows, 'skilliant_bookings');
    },

    exportUsers() {
        const users = DataService.getCollection(DataService.KEYS.USERS) || [];
        if (users.length === 0) { Toast.show('No user records to export.', 'warning'); return; }
        const headers = ['User ID','Name','Email','Phone','Role','Status','Joined Date'];
        const rows = users.map(u => [u.id, u.name||'—', u.email||'—', u.phone||'—', u.role||'—', u.status, u.joinedDate||'—']);
        ExportUtil.toCSV(headers, rows, 'skilliant_users');
    },

    exportLabour() {
        const labours = DataService.getCollection(DataService.KEYS.LABOURS) || [];
        if (labours.length === 0) { Toast.show('No labour records to export.', 'warning'); return; }
        const headers = ['Labour ID','Name','Email','Phone','Skill','Category','Hourly Rate','Rating','Jobs Completed','Verification','Status'];
        const rows = labours.map(l => [l.id, l.name||'—', l.email||'—', l.phone||'—',
            l.skill||'—', l.category||'—', l.hourlyRate||'—', l.rating||'—', l.jobsCompleted||0, l.verification, l.status]);
        ExportUtil.toCSV(headers, rows, 'skilliant_labourers');
    },

    exportCSV() {
        const payments  = DataService.getCollection(DataService.KEYS.PAYMENTS)  || [];
        const bookings  = DataService.getCollection(DataService.KEYS.BOOKINGS)  || [];

        if (payments.length === 0 && bookings.length === 0) {
            Toast.show('No data available to export.', 'warning');
            return;
        }

        const headers = ['Report Type','ID','Associated Name','Amount / Info','Date','Status'];
        const rows = [];
        payments.forEach(p => rows.push(['Payment', p.id, p.userName||'—', `$${(parseFloat(p.amount)||0).toFixed(2)}`, p.date||'—', p.status]));
        bookings.forEach(b => rows.push(['Booking', b.id, b.customer||'—', b.amount||'—', b.date||'—', b.status]));
        ExportUtil.toCSV(headers, rows, 'skilliant_full_report');
    },

    printReport() {
        const bookings = DataService.getCollection(DataService.KEYS.BOOKINGS) || [];
        const payments = DataService.getCollection(DataService.KEYS.PAYMENTS) || [];

        const rows = [
            ...payments.slice(0, 10).map(p => `<tr><td>Payment</td><td>${p.id}</td><td>${p.userName||'—'}</td><td>$${(parseFloat(p.amount)||0).toFixed(2)}</td><td>${p.date||'—'}</td><td>${p.status}</td></tr>`),
            ...bookings.slice(0, 10).map(b => `<tr><td>Booking</td><td>${b.id}</td><td>${b.customer||'—'}</td><td>${b.amount||'—'}</td><td>${b.date||'—'}</td><td>${b.status}</td></tr>`)
        ].join('');

        ExportUtil.print('Skilliant Platform Analytics Report',
            `<table><thead><tr><th>Type</th><th>ID</th><th>Name</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>`);
    }
};
