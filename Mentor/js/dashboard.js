/* ==================================================================
   SKILLIANT - UNIFIED DASHBOARD INTERACTION CONTROLLER
   Handles Tab Switching, Simulated Actions, Modal Triggers for 4 Roles
   ================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Sidebar Tab Switcher
  const sidebarItems = document.querySelectorAll('.sidebar-item[data-tab]');
  const tabPanes = document.querySelectorAll('.tab-pane');

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');

      // Update sidebar active class
      sidebarItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Update tab pane active class
      tabPanes.forEach(pane => {
        if (pane.id === targetTab) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  // Availability Toggle Button (Labour & Contractor Dashboards)
  const availToggleBtn = document.getElementById('availability-toggle');
  if (availToggleBtn) {
    availToggleBtn.addEventListener('click', () => {
      const isAvailable = availToggleBtn.classList.contains('btn-primary');
      if (isAvailable) {
        availToggleBtn.classList.remove('btn-primary');
        availToggleBtn.classList.add('btn-outline');
        availToggleBtn.innerHTML = '🔴 Set as Busy';
        if (window.showToast) window.showToast('Status set to BUSY. You will not receive new instant requests.', 'warning');
      } else {
        availToggleBtn.classList.remove('btn-outline');
        availToggleBtn.classList.add('btn-primary');
        availToggleBtn.innerHTML = '🟢 Available Now';
        if (window.showToast) window.showToast('Status set to AVAILABLE NOW! Ready for job requests.', 'success');
      }
    });
  }

  // Wallet Deposit Simulation
  const walletDepositBtns = document.querySelectorAll('.btn-deposit');
  walletDepositBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const amount = prompt('Enter amount to add to wallet (₹):', '1000');
      if (amount && !isNaN(amount)) {
        const valElement = document.getElementById('wallet-balance');
        if (valElement) {
          const current = parseFloat(valElement.innerText.replace(/[^0-9.]/g, '')) || 0;
          const updated = current + parseFloat(amount);
          valElement.innerText = `₹${updated.toLocaleString()}`;
        }
        if (window.showToast) window.showToast(`₹${amount} deposited successfully to wallet!`, 'success');
      }
    });
  });

  // Action Button Listeners (Accept / Reject / Complete / Cancel)
  document.addEventListener('click', (e) => {
    const target = e.target;

    if (target.classList.contains('btn-accept-job')) {
      if (window.showToast) window.showToast('Job Request Accepted! Added to active schedule.', 'success');
      if (window.closeModal) window.closeModal('accept-job-modal');
      const row = target.closest('tr');
      if (row) {
        const statusCell = row.querySelector('.status-chip');
        if (statusCell) {
          statusCell.className = 'status-chip status-accepted';
          statusCell.innerText = 'ACCEPTED';
        }
      }
    } else if (target.classList.contains('btn-reject-job')) {
      if (window.showToast) window.showToast('Job Request Declined.', 'error');
      if (window.closeModal) window.closeModal('accept-job-modal');
      const row = target.closest('tr');
      if (row) {
        const statusCell = row.querySelector('.status-chip');
        if (statusCell) {
          statusCell.className = 'status-chip status-rejected';
          statusCell.innerText = 'REJECTED';
        }
      }
    } else if (target.classList.contains('btn-complete-job')) {
      if (window.showToast) window.showToast('Job marked as COMPLETED! Payout released to wallet.', 'success');
      const row = target.closest('tr');
      if (row) {
        const statusCell = row.querySelector('.status-chip');
        if (statusCell) {
          statusCell.className = 'status-chip status-completed';
          statusCell.innerText = 'COMPLETED';
        }
      }
    }
  });
});
