/**
 * Skilliant Admin Portal - Charts Engine
 * Manages Chart.js rendering for Revenue, Bookings, User Growth, and Category distribution.
 */

const ChartsEngine = {
    instances: {},

    destroyChart(canvasId) {
        if (this.instances[canvasId]) {
            this.instances[canvasId].destroy();
            delete this.instances[canvasId];
        }
    },

    // Day 1 & Day 4: Revenue & Commission Trend Chart (Line/Area)
    renderRevenueTrendChart(canvasId, labels, grossData, commissionData) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;

        const blueGradient = ctx.createLinearGradient(0, 0, 0, 300);
        blueGradient.addColorStop(0, 'rgba(37, 99, 235, 0.35)');
        blueGradient.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

        const orangeGradient = ctx.createLinearGradient(0, 0, 0, 300);
        orangeGradient.addColorStop(0, 'rgba(249, 115, 22, 0.35)');
        orangeGradient.addColorStop(1, 'rgba(249, 115, 22, 0.0)');

        this.instances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Gross Platform Volume ($)',
                        data: grossData,
                        borderColor: '#2563EB',
                        backgroundColor: blueGradient,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Platform Net Commission ($)',
                        data: commissionData,
                        borderColor: '#F97316',
                        backgroundColor: orangeGradient,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { font: { family: 'Plus Jakarta Sans', weight: '600' } } }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: 'rgba(226, 232, 240, 0.6)' }, ticks: { callback: v => '$' + v } }
                }
            }
        });
    },

    // Day 4: Booking Analytics Bar Chart by Category
    renderCategoryBookingsChart(canvasId) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;

        this.instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Masonry', 'Electrical', 'Plumbing', 'Carpentry', 'Painting', 'Cleaning'],
                datasets: [{
                    label: 'Bookings Volume',
                    data: [840, 1120, 750, 490, 380, 210],
                    backgroundColor: [
                        '#1E3A8A', '#2563EB', '#F97316', '#3B82F6', '#10B981', '#F59E0B'
                    ],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: 'rgba(226, 232, 240, 0.6)' } }
                }
            }
        });
    },

    // Day 4: User Growth Stacked Curve
    renderUserGrowthChart(canvasId) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;

        this.instances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                datasets: [
                    {
                        label: 'Customers',
                        data: [400, 650, 920, 1300, 1800, 2400, 3100, 3800],
                        borderColor: '#2563EB',
                        borderWidth: 3,
                        tension: 0.3
                    },
                    {
                        label: 'Skilled Labourers',
                        data: [150, 280, 420, 600, 800, 980, 1120, 1240],
                        borderColor: '#F97316',
                        borderWidth: 3,
                        tension: 0.3
                    },
                    {
                        label: 'Contractors',
                        data: [30, 55, 90, 140, 190, 240, 290, 318],
                        borderColor: '#10B981',
                        borderWidth: 3,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: 'rgba(226, 232, 240, 0.6)' } }
                }
            }
        });
    }
};
