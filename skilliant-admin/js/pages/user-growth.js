/**
 * Day 4 Deliverable: User Growth Analytics
 */

const UserGrowthPage = {
    render() {
        return `
            ${UI.renderPageHeader('User Growth & Acquisition Metrics', 'Track signup rates across Customers, Skilled Labourers, and Contracting Agencies.')}

            <div class="glass-card animate-slide-up mb-6">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h3 style="font-size:1.2rem; font-weight:700;">Registration Trajectory (2026 YTD)</h3>
                        <p style="font-size:0.85rem; color:var(--text-muted);">Comparing customer adoption vs labourer onboarding vs contractor registration.</p>
                    </div>
                </div>
                <div class="chart-container" style="height: 380px;">
                    <canvas id="userGrowthChart"></canvas>
                </div>
            </div>
        `;
    },

    init() {
        ChartsEngine.renderUserGrowthChart('userGrowthChart');
    }
};
