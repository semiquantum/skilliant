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

    // Booking analytics bar chart — data passed in from calling page
    renderCategoryBookingsChart(canvasId, labels, data) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;
        if (!labels || labels.length === 0) return;

        this.instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Bookings',
                    data,
                    backgroundColor: ['#1E3A8A','#2563EB','#F97316','#3B82F6','#10B981','#F59E0B','#7C3AED'],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: 'rgba(226, 232, 240, 0.6)' }, ticks: { stepSize: 1 } }
                }
            }
        });
    },

    // User growth line chart — data passed in from calling page
    renderUserGrowthChart(canvasId, labels, usersData, labourData, contractorData) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;

        this.instances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels || [],
                datasets: [
                    { label: 'Customers', data: usersData || [], borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.1)', fill: true, borderWidth: 2.5, tension: 0.4 },
                    { label: 'Labourers', data: labourData || [], borderColor: '#F97316', backgroundColor: 'rgba(249,115,22,0.1)', fill: true, borderWidth: 2.5, tension: 0.4 },
                    { label: 'Contractors', data: contractorData || [], borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, borderWidth: 2.5, tension: 0.4 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top', labels: { usePointStyle: true } } },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: 'rgba(226, 232, 240, 0.6)' }, ticks: { stepSize: 1 } }
                }
            }
        });
    }
};
