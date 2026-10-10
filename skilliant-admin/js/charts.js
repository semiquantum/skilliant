/**
 * Skilliant Admin Portal - Charts Engine
 * Manages Chart.js rendering for Revenue, Bookings, User Growth, and Category distribution.
 */

const ChartsEngine = {
    instances: {},

    _color(name, fallback) {
        const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        return value || fallback;
    },

    _rgba(hex, alpha) {
        const h = hex.replace('#','');
        if (h.length !== 6) return hex;
        const r=parseInt(h.slice(0,2),16), g=parseInt(h.slice(2,4),16), b=parseInt(h.slice(4,6),16);
        return `rgba(${r},${g},${b},${alpha})`;
    },

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

        const gold = this._color('--primary-blue', '#C5A059');
        const brass = this._color('--accent-orange', '#AA7C11');
        const blueGradient = ctx.createLinearGradient(0, 0, 0, 300);
        blueGradient.addColorStop(0, this._rgba(gold, 0.35));
        blueGradient.addColorStop(1, this._rgba(gold, 0.0));

        const orangeGradient = ctx.createLinearGradient(0, 0, 0, 300);
        orangeGradient.addColorStop(0, this._rgba(brass, 0.35));
        orangeGradient.addColorStop(1, this._rgba(brass, 0.0));

        this.instances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Gross Platform Volume ($)',
                        data: grossData,
                        borderColor: gold,
                        backgroundColor: blueGradient,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Platform Net Commission ($)',
                        data: commissionData,
                        borderColor: brass,
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
                    y: {
                        beginAtZero: true,
                        suggestedMax: Math.max(1, ...(grossData || []), ...(commissionData || [])),
                        grid: { color: this._color('--border-color', '#E8DED1') },
                        ticks: { callback: v => '$' + v.toLocaleString() }
                    }
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
        const gold = this._color('--primary-blue', '#C5A059');
        const brass = this._color('--accent-orange', '#AA7C11');

        this.instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Bookings',
                    data,
                    backgroundColor: [gold, brass, '#8E6F3E', '#DBC193', '#10B981', '#C5A059', '#725B38'],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, suggestedMax: Math.max(1, ...(usersData || []), ...(labourData || []), ...(contractorData || [])), grid: { color: this._color('--border-color', '#E8DED1') }, ticks: { stepSize: 1, precision: 0 } }
                }
            }
        });
    },

    // User growth line chart — data passed in from calling page
    renderUserGrowthChart(canvasId, labels, usersData, labourData, contractorData) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;
        const gold = this._color('--primary-blue', '#C5A059');
        const brass = this._color('--accent-orange', '#AA7C11');

        this.instances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels || [],
                datasets: [
                    { label: 'Customers', data: usersData || [], borderColor: gold, backgroundColor: this._rgba(gold,0.10), fill: true, borderWidth: 2.5, tension: 0.4 },
                    { label: 'Labourers', data: labourData || [], borderColor: brass, backgroundColor: this._rgba(brass,0.10), fill: true, borderWidth: 2.5, tension: 0.4 },
                    { label: 'Contractors', data: contractorData || [], borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, borderWidth: 2.5, tension: 0.4 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top', labels: { usePointStyle: true } } },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: this._color('--border-color', '#E8DED1') }, ticks: { stepSize: 1 } }
                }
            }
        });
    }
};
