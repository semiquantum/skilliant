/* Superadmin Application Logic & Interactive Event Listeners */

document.addEventListener('DOMContentLoaded', () => {
  setupSidebarToggle();
  setupSidebarDropdowns();
  setupKeyboardShortcuts();
  setupSearchFilter();
  setupQuickActions();
  setupThemeToggle();
  setupUserDropdown();
});

// Mobile Sidebar Drawer Toggle & Backdrop
function setupSidebarToggle() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const closeBtn = document.getElementById('sidebarCloseBtn');
  
  let backdrop = document.getElementById('sidebarBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'sidebarBackdrop';
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);
  }

  function openSidebar() {
    if (sidebar) sidebar.classList.add('mobile-open');
    if (backdrop) backdrop.classList.add('active');
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);
}

// Sidebar Dropdowns Toggle
function setupSidebarDropdowns() {
  const menuItems = document.querySelectorAll('.menu-item-parent');
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const dropdown = item.nextElementSibling;
      const arrow = item.querySelector('.arrow-icon');
      
      if (dropdown && dropdown.classList.contains('menu-dropdown')) {
        dropdown.classList.toggle('open');
        if (arrow) {
          arrow.style.transform = dropdown.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      }
    });
  });
}

// Keyboard Shortcuts (Ctrl + K for Search Focus)
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('globalSearchInput');
      if (searchInput) searchInput.focus();
    }
  });
}

// Global Search Filter
function setupSearchFilter() {
  const searchInput = document.getElementById('globalSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    // Filter table rows or card elements
    const filterableItems = document.querySelectorAll('.data-table tbody tr, .kpi-card, .action-btn');
    filterableItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!term || text.includes(term)) {
        item.style.display = '';
        item.style.opacity = '1';
      } else {
        item.style.opacity = '0.2';
      }
    });
  });
}

// Quick Actions & Modals
function setupQuickActions() {
  const modal = document.getElementById('actionModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  window.openActionModal = function(actionType) {
    if (!modal) return;
    
    let title = 'Quick Action';
    let bodyHtml = '';

    switch (actionType) {
      case 'category':
        title = 'Add New Category';
        bodyHtml = `
          <div class="form-group">
            <label>Category Name</label>
            <input type="text" placeholder="e.g. Home Cleaning, Plumbing">
          </div>
          <div class="form-group">
            <label>Category Icon (FontAwesome)</label>
            <input type="text" placeholder="e.g. fa-broom">
          </div>
          <button class="btn-submit" onclick="submitModalSuccess('Category added successfully!')">Create Category</button>
        `;
        break;
      case 'service':
        title = 'Add New Service';
        bodyHtml = `
          <div class="form-group">
            <label>Service Title</label>
            <input type="text" placeholder="e.g. Deep Home Cleaning">
          </div>
          <div class="form-group">
            <label>Base Price (₹)</label>
            <input type="number" placeholder="499">
          </div>
          <button class="btn-submit" onclick="submitModalSuccess('Service created successfully!')">Create Service</button>
        `;
        break;
      case 'provider':
        title = 'Add New Provider';
        bodyHtml = `
          <div class="form-group">
            <label>Provider Name</label>
            <input type="text" placeholder="Ravi Kumar">
          </div>
          <div class="form-group">
            <label>Phone / Email</label>
            <input type="text" placeholder="ravi@example.com">
          </div>
          <button class="btn-submit" onclick="submitModalSuccess('Provider onboarded successfully!')">Add Provider</button>
        `;
        break;
      case 'announcement':
        title = 'Create Announcement';
        bodyHtml = `
          <div class="form-group">
            <label>Announcement Headline</label>
            <input type="text" placeholder="System Maintenance Scheduled">
          </div>
          <div class="form-group">
            <label>Details</label>
            <textarea rows="3" placeholder="Enter message details..."></textarea>
          </div>
          <button class="btn-submit" onclick="submitModalSuccess('Announcement broadcasted!')">Publish Announcement</button>
        `;
        break;
      case 'coupon':
        title = 'Create Offer / Coupon';
        bodyHtml = `
          <div class="form-group">
            <label>Coupon Code</label>
            <input type="text" placeholder="FESTIVE50">
          </div>
          <div class="form-group">
            <label>Discount Percentage (%)</label>
            <input type="number" placeholder="20">
          </div>
          <button class="btn-submit" onclick="submitModalSuccess('Coupon activated!')">Generate Coupon</button>
        `;
        break;
      default:
        title = 'Action Form';
        bodyHtml = `<p>Complete quick action form.</p><button class="btn-submit" onclick="closeActionModal()">Confirm</button>`;
    }

    if (modalTitle) modalTitle.textContent = title;
    if (modalBody) modalBody.innerHTML = bodyHtml;
    modal.classList.add('active');
  };

  window.closeActionModal = function() {
    if (modal) modal.classList.remove('active');
  };

  window.submitModalSuccess = function(msg) {
    showToast(msg);
    closeActionModal();
  };
}

// Toast Alert Engine
function showToast(message) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.style.cssText = `
      position: fixed; bottom: 20px; right: 20px; z-index: 300;
      background: #10b981; color: #fff; padding: 0.85rem 1.25rem;
      border-radius: 12px; font-weight: 700; font-size: 0.9rem;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
      transition: all 0.3s ease; transform: translateY(100px); opacity: 0;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
  }, 3000);
}

// Theme Switcher (Dark / Light)
function setupThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    toggleBtn.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    showToast(isLight ? 'Light theme activated' : 'Dark theme activated');
  });
}

// User Profile Footer Actions
function setupUserDropdown() {
  const profileWidget = document.getElementById('userProfileWidget');
  if (!profileWidget) return;

  profileWidget.addEventListener('click', () => {
    if (confirm('Log out from Skilliant Superadmin Portal?')) {
      handleLogout();
    }
  });
}
