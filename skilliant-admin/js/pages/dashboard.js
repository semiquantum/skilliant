/**
 * Day 1 Deliverable: Dashboard Overview
 * KPI Cards, Revenue Chart, Booking Trends, Activity Feed.
 */

const DashboardPage = {
    render() {
        const kpis = DataService.getDashboardMetrics();
        const bookings = DataService.getCollection(DataService.KEYS.BOOKINGS);
        const activityLogs = DataService.getCollection(DataService.KEYS.ACTIVITY_LOGS);

        const kpiCardsData = [
            { title: 'Total Platform Revenue', value: kpis.totalRevenue, subtext: 'Based on processed payments', trendUp: true, icon: 'attach_money', colorClass: 'kpi-icon-blue' },
            { title: 'Total Labour Bookings', value: kpis.totalBookings, subtext: 'Lifetime bookings', trendUp: true, icon: 'book_online', colorClass: 'kpi-icon-orange' },
            { title: 'Registered Labourers', value: kpis.totalLabour, subtext: 'Active on platform', trendUp: true, icon: 'engineering', colorClass: 'kpi-icon-green' },
            { title: 'Verified Contractors', value: kpis.totalContractors, subtext: 'Active businesses', trendUp: true, icon: 'business', colorClass: 'kpi-icon-purple' }
        ];

        const recentBookingsRows = bookings.length > 0 ? bookings.slice(0, 5).map(b => `
            <tr>
                <td><strong>${b.id}</strong></td>
                <td>${b.customer}</td>
                <td>${b.assignedTo}</td>
                <td>${b.category}</td>
                <td><strong>${b.amount}</strong></td>
                <td>${UI.renderBadge(b.status)}</td>
            </tr>
        `).join('') : '<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">No recent bookings found.</td></tr>';

        const activityFeedHtml = activityLogs.length > 0 ? activityLogs.slice(0, 4).map(log => `
            <div class="timeline-item">
                <div class="timeline-icon">
                    <span class="material-icons-round">bolt</span>
                </div>
                <div class="timeline-content">
                    <div style="font-weight: 600; font-size: 0.88rem;">${log.action}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
                        By ${log.admin} • ${log.timestamp}
                    </div>
                </div>
            </div>
        `).join('') : '<div class="text-center text-muted" style="padding: 2rem;">No recent activity logs.</div>';

        return `
            ${UI.renderPageHeader('Admin Overview Dashboard', 'Welcome back, Alex. Here is what is happening across Skilliant today.')}
            ${UI.renderKpiCards(kpiCardsData)}

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem;" class="mb-6">
                <!-- Revenue & Growth Chart -->
                <div class="glass-card animate-slide-up">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h3 style="font-size: 1.1rem; font-weight: 700;">Financial Performance & Escrow Volume</h3>
                            <p style="font-size: 0.8rem; color: var(--text-muted);">Monthly platform revenue trajectory ($ USD)</p>
                        </div>
                        <span class="badge badge-info">Live Stream</span>
                    </div>
                    <div class="chart-container">
                        <canvas id="dashboardRevenueChart"></canvas>
                    </div>
                </div>

                <!-- Live Activity Feed (Day 1) -->
                <div class="glass-card animate-slide-up">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h3 style="font-size: 1.1rem; font-weight: 700;">Real-time Activity Feed</h3>
                            <p style="font-size: 0.8rem; color: var(--text-muted);">Latest administrative actions and logs</p>
                        </div>
                        <a href="#activity-logs" class="btn btn-outline btn-sm">View All</a>
                    </div>
                    <div class="timeline">
                        ${activityFeedHtml}
                    </div>
                </div>
            </div>

            <!-- Recent Bookings Table -->
            <div>
                <div class="flex items-center justify-between mb-4">
                    <h3 style="font-size: 1.2rem; font-weight: 700;">Recent Job Bookings</h3>
                    <a href="#bookings" class="btn btn-primary btn-sm">Manage All Bookings</a>
                </div>
                ${UI.renderTable(['Booking ID', 'Customer', 'Assigned Talent', 'Category', 'Amount', 'Status'], recentBookingsRows)}
            </div>
        `;
    },

    init() {
        const revData = { months: ['Jan', 'Feb', 'Mar'], grossRevenue: [0,0,0], platformCommission: [0,0,0] };
        ChartsEngine.renderRevenueTrendChart('dashboardRevenueChart', revData.months, revData.grossRevenue, revData.platformCommission);
    }
};
