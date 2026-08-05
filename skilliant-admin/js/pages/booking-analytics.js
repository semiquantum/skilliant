/**
 * Day 4 Deliverable: Booking Analytics & Category Demand
 */

const BookingAnalyticsPage = {
    render() {
        return `
            ${UI.renderPageHeader('Booking Analytics & Category Demand', 'Analyze trade skill demand patterns, peak hours, and fulfillment statistics.')}

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap:1.5rem;" class="mb-6">
                <div class="glass-card animate-slide-up">
                    <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.5rem;">Bookings Volume by Trade Category</h3>
                    <p style="font-size:0.85rem; color:var(--text-muted);" class="mb-4">Most requested categories on Skilliant in the last 30 days.</p>
                    <div class="chart-container">
                        <canvas id="categoryBookingsChart"></canvas>
                    </div>
                </div>

                <div class="glass-card animate-slide-up">
                    <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.5rem;">Fulfillment Efficiency Matrix</h3>
                    <div style="display:flex; flex-direction:column; gap:1.25rem; margin-top:1.5rem;">
                        <div>
                            <div class="flex justify-between font-bold" style="font-size:0.88rem; margin-bottom:4px;">
                                <span>Electrical & Wiring</span>
                                <span class="text-primary">99.2% Fulfilled</span>
                            </div>
                            <div style="width:100%; height:8px; background:#E2E8F0; border-radius:4px; overflow:hidden;">
                                <div style="width:99.2%; height:100%; background:var(--primary-blue);"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between font-bold" style="font-size:0.88rem; margin-bottom:4px;">
                                <span>Masonry & Foundation</span>
                                <span class="text-orange">94.8% Fulfilled</span>
                            </div>
                            <div style="width:100%; height:8px; background:#E2E8F0; border-radius:4px; overflow:hidden;">
                                <div style="width:94.8%; height:100%; background:var(--accent-orange);"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between font-bold" style="font-size:0.88rem; margin-bottom:4px;">
                                <span>Plumbing & Fitting</span>
                                <span style="color:var(--success);">97.5% Fulfilled</span>
                            </div>
                            <div style="width:100%; height:8px; background:#E2E8F0; border-radius:4px; overflow:hidden;">
                                <div style="width:97.5%; height:100%; background:var(--success);"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        ChartsEngine.renderCategoryBookingsChart('categoryBookingsChart');
    }
};
