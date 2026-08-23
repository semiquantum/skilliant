/**
 * Day 1 Deliverable: Dashboard Overview
 * KPI Cards, Revenue Chart, User Growth Chart, Activity Feed.
 * All data sourced from DataService. No hardcoded values.
 */

const DashboardPage = {
    render() {
        DataService.recalculateFinancialState?.();
        const kpis = DataService.getDashboardMetrics();
        const bookings = DataService.getCollection(DataService.KEYS.BOOKINGS);
        const activityLogs = DataService.getCollection(DataService.KEYS.ACTIVITY_LOGS);
        const session = DataService.getSession();
        const firstName = session ? session.adminName.split(' ')[0] : 'Admin';

        const modulePermissions = { dashboard:'view:dashboard', users:'view:users', labour:'view:labour', contractors:'view:contractors', categories:'view:categories', skills:'view:skills', bookings:'view:bookings', payments:'view:payments', reports:'view:reports', notifications:'view:notifications', support:'view:support', activity:'view:activity', settings:'view:settings', admins:'manage:admins', roles:'manage:roles', reviews:'view:reviews' };

        const kpiCardsData = [
            { title: 'Total Customers', value: kpis.totalUsers, subtext: 'Registered clients', trendUp: true, icon: 'fa-solid fa-users', colorClass: 'kpi-icon-blue' },
            { title: 'Skilled Labourers', value: kpis.totalLabour, subtext: 'On platform', trendUp: true, icon: 'fa-solid fa-helmet-safety', colorClass: 'kpi-icon-green' },
            { title: 'Active Contractors', value: kpis.totalContractors, subtext: 'Active businesses', trendUp: true, icon: 'fa-solid fa-building', colorClass: 'kpi-icon-purple' },
            { title: 'Categories & Skills', value: `${kpis.totalCategories} / ${kpis.totalSkills}`, subtext: 'Trade classifications', trendUp: true, icon: 'fa-solid fa-layer-group', colorClass: 'kpi-icon-orange' }
        ];

        const recentBookingsRows = bookings.length > 0 ? bookings.slice(0, 5).map(b => `
            <tr>
                <td><strong>${b.id}</strong></td>
                <td>${b.customer}</td>
                <td>${b.assignedTo || '—'}</td>
                <td>${b.category}</td>
                <td><strong>${b.amount}</strong></td>
                <td>${UI.renderBadge(b.status)}</td>
            </tr>
        `).join('') : '<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;"><i class="fa-solid fa-calendar-xmark" style="font-size:2rem;opacity:0.15;display:block;margin-bottom:0.5rem;"></i>No bookings yet.</td></tr>';

        const activityFeedHtml = activityLogs.length > 0 ? activityLogs.slice(0, 5).map(log => {
            let icon = 'fa-bolt';
            let colorClass = 'kpi-icon-blue';
            const actionLower = (log.action || '').toLowerCase();
            if (actionLower.includes('logged in') || actionLower.includes('logged out')) { icon = 'fa-right-to-bracket'; colorClass = 'kpi-icon-green'; }
            else if (actionLower.includes('added') || actionLower.includes('created') || actionLower.includes('registered')) { icon = 'fa-plus'; colorClass = 'kpi-icon-purple'; }
            else if (actionLower.includes('deleted') || actionLower.includes('removed')) { icon = 'fa-trash'; colorClass = 'kpi-icon-red'; }
            else if (actionLower.includes('updated') || actionLower.includes('edited') || actionLower.includes('saved') || actionLower.includes('settings')) { icon = 'fa-pen'; colorClass = 'kpi-icon-orange'; }
            else if (actionLower.includes('verif')) { icon = 'fa-shield-halved'; colorClass = 'kpi-icon-gold'; }
            else if (actionLower.includes('payment') || actionLower.includes('payout')) { icon = 'fa-dollar-sign'; colorClass = 'kpi-icon-green'; }

            return `
            <div class="timeline-item">
                <div class="timeline-icon ${colorClass}" style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.78rem;color:#fff;flex-shrink:0;">
                    <i class="fa-solid ${icon}" aria-hidden="true"></i>
                </div>
                <div class="timeline-content">
                    <div style="font-weight:600;font-size:0.875rem;color:var(--text-main);">${log.action}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">
                        <i class="fa-solid fa-user" style="opacity:0.5;"></i> ${log.admin || 'System'}
                        &nbsp;·&nbsp;
                        <i class="fa-regular fa-clock" style="opacity:0.5;"></i> ${log.timestamp || ''}
                    </div>
                </div>
            </div>
            `;
        }).join('') : `<div class="empty-state" style="padding:1.5rem;"><div class="empty-state-icon"><i class="fa-solid fa-clock-rotate-left"></i></div><div class="empty-state-desc">No activity recorded yet.</div></div>`;

        return `
            ${UI.renderPageHeader('Dashboard Overview', 'Welcome back, ${firstName}. Here is a summary of platform activity.')}
            ${UI.renderKpiCards(kpiCardsData)}

            <!-- Module Center: every Admin module is directly reachable from the dashboard. -->
            

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:1.5rem;" class="mb-6">
                <!-- Revenue & Booking Chart -->
                <div class="glass-card animate-slide-up">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h3 class="section-title" style="margin-bottom:2px;">Financial Performance</h3>
                            <p style="font-size:0.8rem;color:var(--text-muted);">Monthly gross revenue vs. platform commission</p>
                        </div>
                        <span class="badge badge-navy">Data-Driven</span>
                    </div>
                    <div class="chart-container">
                        <canvas id="dashboardRevenueChart" aria-label="Revenue and Commission Chart"></canvas>
                    </div>
                </div>

                <!-- Live Activity Feed -->
                <div class="glass-card animate-slide-up">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h3 class="section-title" style="margin-bottom:2px;">Activity Feed</h3>
                            <p style="font-size:0.8rem;color:var(--text-muted);">Latest administrative actions</p>
                        </div>
                        <a href="#notifications" class="btn btn-outline btn-sm">View All</a>
                    </div>
                    <div class="timeline">
                        ${activityFeedHtml}
                    </div>
                </div>
            </div>

            <!-- New Charts Row: User Growth and Labourer Distribution -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:1.5rem;" class="mb-6">
                <!-- User Growth Trajectory Chart -->
                <div class="glass-card animate-slide-up">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h3 class="section-title" style="margin-bottom:2px;">User Growth Trajectory</h3>
                            <p style="font-size:0.8rem;color:var(--text-muted);">Monthly registrations (last 6 months)</p>
                        </div>
                        <span class="badge badge-success">Growth</span>
                    </div>
                    <div class="chart-container">
                        <canvas id="dashboardUserGrowthChart" aria-label="User Growth Chart"></canvas>
                    </div>
                </div>

                <!-- Labour Trade Distribution Chart -->
                <div class="glass-card animate-slide-up">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h3 class="section-title" style="margin-bottom:2px;">Labourer Distribution</h3>
                            <p style="font-size:0.8rem;color:var(--text-muted);">Skilled labour per trade category</p>
                        </div>
                        <span class="badge badge-info">Distribution</span>
                    </div>
                    <div class="chart-container">
                        <canvas id="dashboardLabourDistributionChart" aria-label="Labourer Distribution Chart"></canvas>
                    </div>
                </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;" class="mb-6">
                <!-- Quick Actions -->
                <div class="glass-card animate-slide-up">
                    <h3 class="section-title mb-4">Quick Actions</h3>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.85rem;">
                        <a href="#users" class="btn btn-primary" style="flex-direction:column;padding:1.25rem 1rem;gap:0.5rem;border-radius:12px;text-align:center;">
                            <i class="fa-solid fa-user-plus" style="font-size:1.3rem;"></i><span>Add User</span>
                        </a>
                        <a href="#bookings" class="btn btn-outline" style="flex-direction:column;padding:1.25rem 1rem;gap:0.5rem;border-radius:12px;text-align:center;">
                            <i class="fa-solid fa-calendar-plus" style="font-size:1.3rem;color:var(--primary-blue);"></i><span style="color:var(--primary-navy);">New Booking</span>
                        </a>
                        <a href="#reports" class="btn btn-outline" style="flex-direction:column;padding:1.25rem 1rem;gap:0.5rem;border-radius:12px;text-align:center;">
                            <i class="fa-solid fa-chart-line" style="font-size:1.3rem;color:var(--primary-blue);"></i><span style="color:var(--primary-navy);">Analytics</span>
                        </a>
                        <a href="#notifications" class="btn btn-outline" style="flex-direction:column;padding:1.25rem 1rem;gap:0.5rem;border-radius:12px;text-align:center;">
                            <i class="fa-solid fa-bell" style="font-size:1.3rem;color:var(--primary-blue);"></i><span style="color:var(--primary-navy);">Activity</span>
                        </a>
                    </div>
                </div>

                <!-- Platform Status — honest, no fake integrations -->
                <div class="glass-card animate-slide-up">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="section-title" style="margin-bottom:0;">Platform Status</h3>
                        <span class="badge badge-success">Development Mode</span>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:0.65rem;" id="platformStatusCards">
                        ${DashboardPage._renderStatusRow('fa-database', 'var(--primary-blue)', 'Data Storage', 'Browser LocalStorage', 'Active', 'success')}
                        ${DashboardPage._renderStatusRow('fa-shield-halved', 'var(--success)', 'Authentication', 'Session-based login', 'Active', 'success')}
                        ${DashboardPage._renderStatusRow('fa-credit-card', 'var(--text-muted)', 'Payment Gateway', 'Backend integration pending', 'Pending', 'warning')}
                        ${DashboardPage._renderStatusRow('fa-envelope', 'var(--text-muted)', 'Email Service', 'Backend integration pending', 'Pending', 'warning')}
                    </div>
                </div>

                <!-- Platform Summary Stats -->
                <div class="glass-card animate-slide-up">
                    <h3 class="section-title mb-4">Platform Summary</h3>
                    <div style="display:flex;flex-direction:column;gap:0.6rem;">
                        ${DashboardPage._infoRow('Registered Users', kpis.totalUsers, 'var(--primary-navy)')}
                        ${DashboardPage._infoRow('Unread Notifications', DataService.getCollection(DataService.KEYS.NOTIFICATIONS).filter(n=>n.unread).length, 'var(--accent-orange)')}
                        ${DashboardPage._infoRow('Escrow Vault Balance', kpis.walletEscrowBalance, 'var(--primary-blue)')}
                        ${DashboardPage._infoRow('Platform Commission Earned', kpis.totalCommission, 'var(--success)')}
                    </div>
                </div>
            </div>

            <!-- Recent Bookings Table -->
            <div>
                <div class="flex items-center justify-between mb-4">
                    <h3 style="font-size:1.1rem;font-weight:700;color:var(--primary-navy);">Recent Job Bookings</h3>
                    <a href="#bookings" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-arrow-right"></i> Manage All
                    </a>
                </div>
                ${UI.renderTable(['Booking ID', 'Customer', 'Assigned Talent', 'Category', 'Amount', 'Status'], recentBookingsRows)}
            </div>
        `.replace('Welcome back, ${firstName}', `Welcome back, ${firstName}`);
    },

    _renderStatusRow(icon, iconColor, title, sub, statusText, statusType) {
        return `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem 1rem;background:rgba(241,245,249,0.5);border-radius:10px;border:1px solid var(--border-color);">
                <div style="display:flex;align-items:center;gap:0.75rem;">
                    <i class="fa-solid ${icon}" style="color:${iconColor};font-size:1rem;width:18px;text-align:center;" aria-hidden="true"></i>
                    <div>
                        <div style="font-weight:600;font-size:0.85rem;color:var(--text-main);">${title}</div>
                        <div style="font-size:0.72rem;color:var(--text-muted);">${sub}</div>
                    </div>
                </div>
                <span class="badge badge-${statusType}">${statusText}</span>
            </div>`;
    },

    _infoRow(label, value, color) {
        return `
            <div class="info-row">
                <span class="info-row-label">${label}</span>
                <strong class="info-row-value" style="color:${color};">${value}</strong>
            </div>`;
    },

    init() {
        // Build real monthly revenue data from payments
        const payments = DataService.getCollection(DataService.KEYS.PAYMENTS);
        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const now = new Date();

        // Last 6 months
        const monthLabels = [];
        const grossData   = [];
        const commData    = [];

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = monthNames[d.getMonth()] + ' ' + String(d.getFullYear()).slice(2);
            monthLabels.push(label);

            const monthPayments = payments.filter(p => {
                if (!p.date) return false;
                const pd = new Date(p.date);
                return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth() && p.status === 'Completed';
            });

            const gross = monthPayments.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
            const comm  = monthPayments.reduce((s, p) => s + (parseFloat(p.commissionFee) || 0), 0);
            grossData.push(parseFloat(gross.toFixed(2)));
            commData.push(parseFloat(comm.toFixed(2)));
        }

        ChartsEngine.renderRevenueTrendChart('dashboardRevenueChart', monthLabels, grossData, commData);

        // Show actual monthly registrations rather than a misleading cumulative flat line.
        const users = DataService.getCollection(DataService.KEYS.USERS);
        const labourers = DataService.getCollection(DataService.KEYS.LABOURS);
        const contractors = DataService.getCollection(DataService.KEYS.CONTRACTORS);
        const countJoinedInMonth = (rows, year, month) => rows.filter(row => {
            const value = row?.joinedDate || row?.createdAt || row?.date;
            if (!value) return false;
            const date = new Date(value);
            return !Number.isNaN(date.getTime()) && date.getFullYear() === year && date.getMonth() === month;
        }).length;

        const usersGrowth = [];
        const labourersGrowth = [];
        const contractorsGrowth = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            usersGrowth.push(countJoinedInMonth(users, d.getFullYear(), d.getMonth()));
            labourersGrowth.push(countJoinedInMonth(labourers, d.getFullYear(), d.getMonth()));
            contractorsGrowth.push(countJoinedInMonth(contractors, d.getFullYear(), d.getMonth()));
        }

        ChartsEngine.renderUserGrowthChart('dashboardUserGrowthChart', monthLabels, usersGrowth, labourersGrowth, contractorsGrowth);

        // Calculate Labour Distribution by Category
        const categories = DataService.getCollection(DataService.KEYS.CATEGORIES);
        const categoryNames = categories.map(c => c.name);
        const categoryLabourCounts = categories.map(c => {
            return labourers.filter(l => l.category === c.name || l.skill === c.name).length;
        });

        ChartsEngine.renderCategoryBookingsChart('dashboardLabourDistributionChart', categoryNames, categoryLabourCounts);
    }
};
