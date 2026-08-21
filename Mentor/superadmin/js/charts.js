/* Superadmin Chart.js Visualizations */

document.addEventListener('DOMContentLoaded', () => {
  initAnalyticsChart();
  initDonutChart();
});

function initAnalyticsChart() {
  const ctx = document.getElementById('overviewAnalyticsChart')?.getContext('2d');
  if (!ctx) return;

  // Gradients for line fill
  const purpleGradient = ctx.createLinearGradient(0, 0, 0, 250);
  purpleGradient.addColorStop(0, 'rgba(139, 92, 246, 0.25)');
  purpleGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

  const blueGradient = ctx.createLinearGradient(0, 0, 0, 250);
  blueGradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
  blueGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

  const greenGradient = ctx.createLinearGradient(0, 0, 0, 250);
  greenGradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
  greenGradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['May 12', 'May 13', 'May 14', 'May 15', 'May 16', 'May 17', 'May 18', 'May 19'],
      datasets: [
        {
          label: 'Users',
          data: [13000, 15000, 14000, 18000, 14500, 16000, 12000, 14500],
          borderColor: '#8b5cf6',
          backgroundColor: purpleGradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#8b5cf6',
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Bookings',
          data: [9500, 9800, 8500, 10200, 9200, 10500, 8000, 9800],
          borderColor: '#3b82f6',
          backgroundColor: blueGradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Revenue',
          data: [4000, 4200, 3900, 5200, 4800, 4500, 3800, 4300],
          borderColor: '#10b981',
          backgroundColor: greenGradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#10b981',
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            color: '#94a3b8',
            font: { family: 'Plus Jakarta Sans', size: 12 },
            usePointStyle: true,
            boxWidth: 8
          }
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#fff',
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#64748b', font: { family: 'Plus Jakarta Sans', size: 11 } }
        },
        y: {
          min: 0,
          max: 20000,
          ticks: {
            stepSize: 5000,
            color: '#64748b',
            font: { family: 'Plus Jakarta Sans', size: 11 },
            callback: (val) => val === 0 ? '0' : val / 1000 + 'K'
          },
          grid: { color: 'rgba(255, 255, 255, 0.04)' }
        }
      }
    }
  });
}

function initDonutChart() {
  const ctx = document.getElementById('bookingsStatusChart')?.getContext('2d');
  if (!ctx) return;

  // Plugin for center text inside Donut
  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart) {
      const { width, height, ctx } = chart;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Value text
      ctx.font = '800 1.5rem Plus Jakarta Sans';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('12,843', width / 2, height / 2 - 8);
      
      // Subtitle text
      ctx.font = '600 0.8rem Plus Jakarta Sans';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Total', width / 2, height / 2 + 14);
      ctx.restore();
    }
  };

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Completed (33.1%)', 'Confirmed (28.1%)', 'Pending (23.2%)', 'Cancelled (15.5%)'],
      datasets: [{
        data: [4257, 3612, 2985, 1989],
        backgroundColor: ['#3b82f6', '#10b981', '#f97316', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          display: true,
          position: 'right',
          labels: {
            color: '#94a3b8',
            font: { family: 'Plus Jakarta Sans', size: 11 },
            usePointStyle: true,
            boxWidth: 8,
            padding: 12
          }
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#fff',
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1
        }
      }
    },
    plugins: [centerTextPlugin]
  });
}
