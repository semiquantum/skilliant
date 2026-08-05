/**
 * Day 3 Deliverable: System Operations Reports Overview
 */

const ReportsPage = {
    render() {
        const reports = DataService.getCollection(DataService.KEYS.REPORTS) || {};

        const kpiCardsData = [
            { title: 'Platform Dispute Rate', value: reports.disputeRate, subtext: 'Low dispute threshold', trendUp: true, icon: 'gavel', colorClass: 'kpi-icon-green' },
            { title: 'Job Fulfillment Rate', value: reports.fulfillmentRate, subtext: 'Completed vs Created', trendUp: true, icon: 'task_alt', colorClass: 'kpi-icon-blue' },
            { title: 'Avg Talent Response', value: reports.avgResponseTime, subtext: 'Match to dispatch time', trendUp: true, icon: 'speed', colorClass: 'kpi-icon-purple' },
            { title: 'Customer CSAT Score', value: reports.customerSatisfaction, subtext: 'Based on 1.4k reviews', trendUp: true, icon: 'star', colorClass: 'kpi-icon-orange' }
        ];

        return `
            ${UI.renderPageHeader('Operational Health & System Reports', 'Aggregate system metrics on disputes, satisfaction, and matching speeds.')}
            ${UI.renderKpiCards(kpiCardsData)}

            <div class="glass-card animate-slide-up">
                <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:0.75rem;">Quality & Compliance Summary</h3>
                <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6;">
                    The Skilliant platform is operating with an overall job fulfillment efficiency of <strong>${reports.fulfillmentRate}</strong>. 
                    Dispute claims remain well below the 2.0% SLA threshold, with an average resolution turnaround of 24 hours.
                </p>
                <div style="margin-top:1.25rem; display:flex; gap:1rem; flex-wrap:wrap;">
                    <a href="#export-reports" class="btn btn-primary">Generate Custom Export</a>
                    <a href="#activity-logs" class="btn btn-outline">Review Audit Log</a>
                </div>
            </div>
        `;
    }
};
