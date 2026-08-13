/**
 * Day 4 Deliverable: Revenue Analytics Dashboard
 */

const RevenuePage = {
    render() {
        const kpis = DataService.getDashboardMetrics();

        const kpiCardsData = [
            { title: 'Gross Transaction Volume', value: kpis.totalRevenue, subtext: 'Based on processed payments', trendUp: true, icon: 'payments', colorClass: 'kpi-icon-blue' },
            { title: 'Net Platform Commission (10%)', value: kpis.totalCommission, subtext: 'Platform income', trendUp: true, icon: 'account_balance', colorClass: 'kpi-icon-green' },
            { title: 'Average Order Value (AOV)', value: kpis.aov, subtext: 'Per booking', trendUp: true, icon: 'shopping_bag', colorClass: 'kpi-icon-orange' }
        ];

        return `
            ${UI.renderPageHeader('Revenue Analytics & Income Breakdown', 'Deep-dive into platform financial volume, commissions, and payout flows.')}
            ${UI.renderKpiCards(kpiCardsData)}

            <div class="glass-card animate-slide-up mb-6">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h3 style="font-size:1.2rem; font-weight:700;">Monthly Platform Income & Volume Trajectory</h3>
                        <p style="font-size:0.85rem; color:var(--text-muted);">Comparing gross booking dollar volume vs net 10% commission fee revenue.</p>
                    </div>
                </div>
                <div class="chart-container" style="height: 380px;">
                    <canvas id="revenueFullChart"></canvas>
                </div>
            </div>
        `;
    },

    init() {
        const revData = { months: ['Jan', 'Feb', 'Mar'], grossRevenue: [0,0,0], platformCommission: [0,0,0] };
        ChartsEngine.renderRevenueTrendChart('revenueFullChart', revData.months, revData.grossRevenue, revData.platformCommission);
    }
};
