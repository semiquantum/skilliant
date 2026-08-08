/**
 * ==========================================================================
 * SKILLIANT CONTRACTOR PORTAL - LABOUR MANAGEMENT CONTROLLER
 * Module: Day 2 Labour Management
 * Features:
 *   - Fetch initial data from data/labour.json & sync with localStorage
 *   - Grid & Table View Switcher
 *   - Dynamic Multi-Criteria Search, Skill Filter, Availability Filter & Sort
 *   - Dynamic Statistics Counters (Total, Available, Busy, On Leave)
 *   - Reusable Modal Management (Add, Edit, Details, Delete Confirmation)
 *   - Production-ready CRUD logic
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Constants & Storage Keys
  const STORAGE_KEY = 'skilliant_labour_records';
  const DEFAULT_JSON_PATH = 'data/labour.json';
  const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';

  // Application State
  const state = {
    labourList: [],
    filteredList: [],
    currentView: 'cards', // 'cards' or 'table'
    selectedLabourId: null,
    filters: {
      search: '',
      skill: 'all',
      availability: 'all',
      sort: 'rating_desc'
    }
  };

  // DOM Elements Reference
  const DOM = {
    // Stats
    statTotalLabour: document.getElementById('statTotalLabour'),
    statAvailableLabour: document.getElementById('statAvailableLabour'),
    statBusyLabour: document.getElementById('statBusyLabour'),
    statOnLeaveLabour: document.getElementById('statOnLeaveLabour'),
    progressAvailable: document.getElementById('progressAvailable'),
    progressBusy: document.getElementById('progressBusy'),
    progressLeave: document.getElementById('progressLeave'),
    sidebarLabourCount: document.getElementById('sidebarLabourCount'),

    // Toolbar & Controls
    searchInput: document.getElementById('labourSearchInput'),
    filterSkillSelect: document.getElementById('filterSkillSelect'),
    filterAvailabilitySelect: document.getElementById('filterAvailabilitySelect'),
    sortSelect: document.getElementById('sortSelect'),
    viewCardsBtn: document.getElementById('viewCardsBtn'),
    viewTableBtn: document.getElementById('viewTableBtn'),
    clearFiltersBtn: document.getElementById('clearFiltersBtn'),
    openAddModalBtn: document.getElementById('openAddLabourModalBtn'),

    // Views
    cardsGrid: document.getElementById('labourCardsGrid'),
    tableContainer: document.getElementById('labourTableContainer'),
    tableBody: document.getElementById('labourTableBody'),
    emptyState: document.getElementById('emptyState'),

    // Form Modal (Add / Edit)
    labourFormModal: document.getElementById('labourFormModal'),
    labourForm: document.getElementById('labourForm'),
    formModalTitle: document.getElementById('formModalTitle'),
    closeFormModalBtn: document.getElementById('closeFormModalBtn'),
    cancelFormBtn: document.getElementById('cancelFormBtn'),
    labourIdInput: document.getElementById('labourIdInput'),
    fullNameInput: document.getElementById('fullNameInput'),
    skillSelectInput: document.getElementById('skillSelectInput'),
    expYearsInput: document.getElementById('expYearsInput'),
    dailyRateInput: document.getElementById('dailyRateInput'),
    phoneInput: document.getElementById('phoneInput'),
    availabilityInput: document.getElementById('availabilityInput'),
    addressInput: document.getElementById('addressInput'),
    projectInput: document.getElementById('projectInput'),
    ratingInput: document.getElementById('ratingInput'),
    photoUrlInput: document.getElementById('photoUrlInput'),
    emergencyInput: document.getElementById('emergencyInput'),

    // Details Modal
    labourDetailsModal: document.getElementById('labourDetailsModal'),
    detailsModalBody: document.getElementById('detailsModalBody'),
    closeDetailsModalBtn: document.getElementById('closeDetailsModalBtn'),
    closeDetailsFooterBtn: document.getElementById('closeDetailsFooterBtn'),
    editFromDetailsBtn: document.getElementById('editFromDetailsBtn'),

    // Delete Modal
    deleteConfirmModal: document.getElementById('deleteConfirmModal'),
    deleteTargetName: document.getElementById('deleteTargetName'),
    closeDeleteModalBtn: document.getElementById('closeDeleteModalBtn'),
    cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
    confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),

    // Toast Container
    toastContainer: document.getElementById('toastContainer')
  };

  /* --------------------------------------------------------------------------
     1. INITIALIZATION & DATA LOADING
     -------------------------------------------------------------------------- */
  async function init() {
    await loadLabourData();
    registerEvents();
    applyFiltersAndRender();
  }

  async function loadLabourData() {
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      try {
        state.labourList = JSON.parse(localData);
        return;
      } catch (err) {
        console.error('Failed to parse localStorage data, falling back to JSON file:', err);
      }
    }

    // Fetch initial fallback dataset from JSON
    try {
      const res = await fetch(DEFAULT_JSON_PATH);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      state.labourList = await res.json();
      saveToStorage();
    } catch (err) {
      console.warn('Could not fetch data/labour.json directly, using fallback dataset:', err);
      state.labourList = getFallbackLabourDataset();
      saveToStorage();
    }
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.labourList));
  }

  /* --------------------------------------------------------------------------
     2. FILTER, SEARCH, SORT & RENDER ENGINE
     -------------------------------------------------------------------------- */
  function applyFiltersAndRender() {
    let result = [...state.labourList];

    // 1. Search Query
    if (state.filters.search) {
      const q = state.filters.search.toLowerCase();
      result = result.filter(item =>
        item.fullName.toLowerCase().includes(q) ||
        item.skill.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q) ||
        (item.assignedProject && item.assignedProject.toLowerCase().includes(q))
      );
    }

    // 2. Skill Filter
    if (state.filters.skill !== 'all') {
      result = result.filter(item => item.skill === state.filters.skill);
    }

    // 3. Availability Filter
    if (state.filters.availability !== 'all') {
      result = result.filter(item => item.availability === state.filters.availability);
    }

    // 4. Sorting
    switch (state.filters.sort) {
      case 'rating_desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'exp_desc':
        result.sort((a, b) => b.experienceYears - a.experienceYears);
        break;
      case 'name_asc':
        result.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      case 'rate_asc':
        result.sort((a, b) => a.dailyRate - b.dailyRate);
        break;
    }

    state.filteredList = result;

    updateStatistics();
    renderCurrentView();
  }

  function updateStatistics() {
    const total = state.labourList.length;
    const available = state.labourList.filter(l => l.availability === 'available').length;
    const busy = state.labourList.filter(l => l.availability === 'busy').length;
    const onLeave = state.labourList.filter(l => l.availability === 'on_leave').length;

    DOM.statTotalLabour.textContent = total;
    DOM.statAvailableLabour.textContent = available;
    DOM.statBusyLabour.textContent = busy;
    DOM.statOnLeaveLabour.textContent = onLeave;

    if (DOM.sidebarLabourCount) {
      DOM.sidebarLabourCount.textContent = total;
    }

    // Update mini progress bar fills safely
    if (total > 0) {
      DOM.progressAvailable.style.width = `${Math.round((available / total) * 100)}%`;
      DOM.progressBusy.style.width = `${Math.round((busy / total) * 100)}%`;
      DOM.progressLeave.style.width = `${Math.round((onLeave / total) * 100)}%`;
    }
  }

  function renderCurrentView() {
    const hasData = state.filteredList.length > 0;
    DOM.emptyState.style.display = hasData ? 'none' : 'flex';

    if (state.currentView === 'cards') {
      DOM.cardsGrid.style.display = hasData ? 'grid' : 'none';
      DOM.tableContainer.style.display = 'none';
      if (hasData) renderCardsGrid();
    } else {
      DOM.cardsGrid.style.display = 'none';
      DOM.tableContainer.style.display = hasData ? 'block' : 'none';
      if (hasData) renderTableView();
    }
  }

  /* --------------------------------------------------------------------------
     3. CARDS GRID & TABLE VIEW RENDERING
     -------------------------------------------------------------------------- */
  function renderCardsGrid() {
    DOM.cardsGrid.innerHTML = state.filteredList.map(labour => `
      <div class="labour-card glass-card" data-id="${labour.id}">
        <div class="card-top-bar">
          <div class="worker-profile-meta">
            <img src="${escapeHTML(labour.photoUrl || DEFAULT_AVATAR)}" alt="${escapeHTML(labour.fullName)}" class="worker-photo">
            <div class="worker-info">
              <h3 class="worker-name">${escapeHTML(labour.fullName)}</h3>
              <span class="worker-skill-badge">${escapeHTML(labour.skill)}</span>
            </div>
          </div>
          ${getAvailabilityPillHTML(labour.availability)}
        </div>

        <div class="card-details-body">
          <div class="detail-row">
            <span class="detail-label">Experience</span>
            <span class="detail-value">${labour.experienceYears} Years</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Daily Wage</span>
            <span class="detail-value rate-tag">₹${labour.dailyRate}/day</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Location</span>
            <span class="detail-value">${escapeHTML(labour.address)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Rating</span>
            <span class="star-rating">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ${labour.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <div class="card-footer-actions">
          <button class="btn btn-xs btn-outline btn-full view-details-btn" data-id="${labour.id}">View Profile</button>
          <button class="btn btn-xs btn-blue edit-labour-btn" data-id="${labour.id}">Edit</button>
          <button class="btn btn-xs btn-danger delete-labour-btn" data-id="${labour.id}">Delete</button>
        </div>
      </div>
    `).join('');
  }

  function renderTableView() {
    DOM.tableBody.innerHTML = state.filteredList.map(labour => `
      <tr data-id="${labour.id}">
        <td>
          <div class="table-worker-cell">
            <img src="${escapeHTML(labour.photoUrl || DEFAULT_AVATAR)}" class="table-worker-photo" alt="${escapeHTML(labour.fullName)}">
            <div>
              <div class="user-cell-name">${escapeHTML(labour.fullName)}</div>
              <div class="user-cell-sub">${escapeHTML(labour.phone)}</div>
            </div>
          </div>
        </td>
        <td>
          <strong>${escapeHTML(labour.skill)}</strong>
          <div class="user-cell-sub">${labour.experienceYears} Yrs Exp</div>
        </td>
        <td><strong class="text-green">₹${labour.dailyRate}</strong> / day</td>
        <td><span class="site-badge">${escapeHTML(labour.assignedProject || 'Unassigned')}</span></td>
        <td>${getAvailabilityPillHTML(labour.availability)}</td>
        <td>
          <span class="star-rating">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ${labour.rating.toFixed(1)}
          </span>
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-xs btn-outline view-details-btn" data-id="${labour.id}">View</button>
            <button class="btn btn-xs btn-blue edit-labour-btn" data-id="${labour.id}">Edit</button>
            <button class="btn btn-xs btn-danger delete-labour-btn" data-id="${labour.id}">Del</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function getAvailabilityPillHTML(status) {
    switch (status) {
      case 'available':
        return '<span class="status-pill green-pill"><span class="status-dot"></span> Available</span>';
      case 'busy':
        return '<span class="status-pill yellow-pill"><span class="status-dot"></span> Busy (On Site)</span>';
      case 'on_leave':
        return '<span class="status-pill" style="background: rgba(168, 85, 247, 0.12); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.3);"><span class="status-dot" style="background:#a855f7;"></span> On Leave</span>';
      default:
        return '<span class="status-pill">Unknown</span>';
    }
  }

  /* --------------------------------------------------------------------------
     4. MODAL MANAGERS & CRUD LOGIC
     -------------------------------------------------------------------------- */
  // Open Add Modal
  function openAddModal() {
    DOM.formModalTitle.textContent = 'Add New Labour Profile';
    DOM.labourForm.reset();
    DOM.labourIdInput.value = '';
    DOM.labourFormModal.classList.add('active');
  }

  // Open Edit Modal
  function openEditModal(id) {
    const item = state.labourList.find(l => l.id === id);
    if (!item) return;

    DOM.formModalTitle.textContent = 'Edit Labour Profile';
    DOM.labourIdInput.value = item.id;
    DOM.fullNameInput.value = item.fullName;
    DOM.skillSelectInput.value = item.skill;
    DOM.expYearsInput.value = item.experienceYears;
    DOM.dailyRateInput.value = item.dailyRate;
    DOM.phoneInput.value = item.phone;
    DOM.availabilityInput.value = item.availability;
    DOM.addressInput.value = item.address;
    DOM.projectInput.value = item.assignedProject || '';
    DOM.ratingInput.value = item.rating;
    DOM.photoUrlInput.value = item.photoUrl || '';
    DOM.emergencyInput.value = item.emergencyContact || '';

    DOM.labourFormModal.classList.add('active');
  }

  // Handle Form Submit (Add or Edit)
  function handleFormSubmit(e) {
    e.preventDefault();

    const id = DOM.labourIdInput.value.trim();
    const payload = {
      id: id || `LAB-${Date.now().toString().slice(-4)}`,
      fullName: DOM.fullNameInput.value.trim(),
      skill: DOM.skillSelectInput.value,
      experienceYears: parseInt(DOM.expYearsInput.value, 10) || 0,
      dailyRate: parseInt(DOM.dailyRateInput.value, 10) || 500,
      phone: DOM.phoneInput.value.trim(),
      availability: DOM.availabilityInput.value,
      address: DOM.addressInput.value.trim(),
      assignedProject: DOM.projectInput.value.trim() || 'Unassigned',
      rating: parseFloat(DOM.ratingInput.value) || 4.5,
      photoUrl: DOM.photoUrlInput.value.trim() || DEFAULT_AVATAR,
      emergencyContact: DOM.emergencyInput.value.trim() || 'N/A'
    };

    if (id) {
      // Edit existing
      const idx = state.labourList.findIndex(l => l.id === id);
      if (idx !== -1) {
        state.labourList[idx] = payload;
        showToast(`Updated profile for ${payload.fullName}`, 'success');
      }
    } else {
      // Create new
      state.labourList.unshift(payload);
      showToast(`Added new labour profile: ${payload.fullName}`, 'success');
    }

    saveToStorage();
    DOM.labourFormModal.classList.remove('active');
    applyFiltersAndRender();
  }

  // Open Details Modal
  function openDetailsModal(id) {
    const item = state.labourList.find(l => l.id === id);
    if (!item) return;

    state.selectedLabourId = id;
    DOM.detailsModalBody.innerHTML = `
      <div class="profile-modal-grid">
        <div class="profile-modal-left">
          <img src="${escapeHTML(item.photoUrl || DEFAULT_AVATAR)}" class="details-photo" alt="${escapeHTML(item.fullName)}">
          <h3 class="worker-name">${escapeHTML(item.fullName)}</h3>
          <span class="worker-skill-badge">${escapeHTML(item.skill)}</span>
          <div style="margin-top: 8px;">${getAvailabilityPillHTML(item.availability)}</div>
        </div>
        <div class="profile-modal-right">
          <div class="details-info-group">
            <div class="info-item">
              <span class="info-label">Worker ID</span>
              <span class="info-val">#${item.id}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Experience</span>
              <span class="info-val">${item.experienceYears} Years</span>
            </div>
            <div class="info-item">
              <span class="info-label">Phone Number</span>
              <span class="info-val">${escapeHTML(item.phone)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Daily Wage Rate</span>
              <span class="info-val text-green">₹${item.dailyRate} / day</span>
            </div>
            <div class="info-item">
              <span class="info-label">Location / Address</span>
              <span class="info-val">${escapeHTML(item.address)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Assigned Site</span>
              <span class="info-val">${escapeHTML(item.assignedProject || 'Unassigned')}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Rating</span>
              <span class="info-val star-rating">★ ${item.rating.toFixed(1)} / 5.0</span>
            </div>
            <div class="info-item">
              <span class="info-label">Emergency Contact</span>
              <span class="info-val">${escapeHTML(item.emergencyContact || 'N/A')}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    DOM.labourDetailsModal.classList.add('active');
  }

  // Open Delete Modal
  function openDeleteModal(id) {
    const item = state.labourList.find(l => l.id === id);
    if (!item) return;

    state.selectedLabourId = id;
    DOM.deleteTargetName.textContent = item.fullName;
    DOM.deleteConfirmModal.classList.add('active');
  }

  function confirmDelete() {
    if (!state.selectedLabourId) return;

    const item = state.labourList.find(l => l.id === state.selectedLabourId);
    state.labourList = state.labourList.filter(l => l.id !== state.selectedLabourId);

    saveToStorage();
    DOM.deleteConfirmModal.classList.remove('active');
    showToast(`Removed ${item ? item.fullName : 'worker'} from directory`, 'info');
    applyFiltersAndRender();
  }

  /* --------------------------------------------------------------------------
     5. TOAST NOTIFICATION UTILITY
     -------------------------------------------------------------------------- */
  function showToast(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    const color = type === 'success' ? 'var(--status-green)' : 'var(--primary-blue)';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span>${escapeHTML(msg)}</span>
    `;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  /* --------------------------------------------------------------------------
     6. EVENT LISTENERS BINDING
     -------------------------------------------------------------------------- */
  function registerEvents() {
    // Toolbar search & filter inputs
    DOM.searchInput.addEventListener('input', (e) => {
      state.filters.search = e.target.value.trim();
      applyFiltersAndRender();
    });

    DOM.filterSkillSelect.addEventListener('change', (e) => {
      state.filters.skill = e.target.value;
      applyFiltersAndRender();
    });

    DOM.filterAvailabilitySelect.addEventListener('change', (e) => {
      state.filters.availability = e.target.value;
      applyFiltersAndRender();
    });

    DOM.sortSelect.addEventListener('change', (e) => {
      state.filters.sort = e.target.value;
      applyFiltersAndRender();
    });

    DOM.clearFiltersBtn.addEventListener('click', () => {
      state.filters = { search: '', skill: 'all', availability: 'all', sort: 'rating_desc' };
      DOM.searchInput.value = '';
      DOM.filterSkillSelect.value = 'all';
      DOM.filterAvailabilitySelect.value = 'all';
      DOM.sortSelect.value = 'rating_desc';
      applyFiltersAndRender();
    });

    // View Switcher Buttons
    DOM.viewCardsBtn.addEventListener('click', () => {
      state.currentView = 'cards';
      DOM.viewCardsBtn.classList.add('active');
      DOM.viewTableBtn.classList.remove('active');
      renderCurrentView();
    });

    DOM.viewTableBtn.addEventListener('click', () => {
      state.currentView = 'table';
      DOM.viewTableBtn.classList.add('active');
      DOM.viewCardsBtn.classList.remove('active');
      renderCurrentView();
    });

    // Add Labour Modal triggers
    DOM.openAddModalBtn.addEventListener('click', openAddModal);
    DOM.closeFormModalBtn.addEventListener('click', () => DOM.labourFormModal.classList.remove('active'));
    DOM.cancelFormBtn.addEventListener('click', () => DOM.labourFormModal.classList.remove('active'));
    DOM.labourForm.addEventListener('submit', handleFormSubmit);

    // Details Modal triggers
    DOM.closeDetailsModalBtn.addEventListener('click', () => DOM.labourDetailsModal.classList.remove('active'));
    DOM.closeDetailsFooterBtn.addEventListener('click', () => DOM.labourDetailsModal.classList.remove('active'));
    DOM.editFromDetailsBtn.addEventListener('click', () => {
      DOM.labourDetailsModal.classList.remove('active');
      if (state.selectedLabourId) openEditModal(state.selectedLabourId);
    });

    // Delete Modal triggers
    DOM.closeDeleteModalBtn.addEventListener('click', () => DOM.deleteConfirmModal.classList.remove('active'));
    DOM.cancelDeleteBtn.addEventListener('click', () => DOM.deleteConfirmModal.classList.remove('active'));
    DOM.confirmDeleteBtn.addEventListener('click', confirmDelete);

    // Delegation for Cards & Table action buttons
    document.addEventListener('click', (e) => {
      const detailsBtn = e.target.closest('.view-details-btn');
      if (detailsBtn) {
        openDetailsModal(detailsBtn.dataset.id);
        return;
      }

      const editBtn = e.target.closest('.edit-labour-btn');
      if (editBtn) {
        openEditModal(editBtn.dataset.id);
        return;
      }

      const deleteBtn = e.target.closest('.delete-labour-btn');
      if (deleteBtn) {
        openDeleteModal(deleteBtn.dataset.id);
        return;
      }
    });

    // Close modals on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    });
  }

  /* Fallback Dataset in case fetch is blocked on file:// protocol */
  function getFallbackLabourDataset() {
    return [
      { id: 'LAB-101', fullName: 'Ramesh Maurya', skill: 'Mason', experienceYears: 8, phone: '+91 98201 44512', address: 'Andheri East, Mumbai, MH', availability: 'busy', rating: 4.9, dailyRate: 950, photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', assignedProject: 'Metro Line 4 - Station 12', emergencyContact: '+91 98201 99001 (Wife)' },
      { id: 'LAB-102', fullName: 'Suresh Kumar', skill: 'Electrician', experienceYears: 6, phone: '+91 97112 33490', address: 'Thane West, Mumbai, MH', availability: 'busy', rating: 4.8, dailyRate: 1100, photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', assignedProject: 'Verdana Luxury Towers', emergencyContact: '+91 97112 88210 (Brother)' },
      { id: 'LAB-103', fullName: 'Anil Deshmukh', skill: 'Carpenter', experienceYears: 10, phone: '+91 98334 11200', address: 'Panvel, Navi Mumbai, MH', availability: 'available', rating: 4.7, dailyRate: 1000, photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80', assignedProject: 'Unassigned', emergencyContact: '+91 98334 55432 (Son)' },
      { id: 'LAB-104', fullName: 'Vikram Singh', skill: 'Welder', experienceYears: 7, phone: '+91 99670 88231', address: 'Kurla West, Mumbai, MH', availability: 'busy', rating: 4.9, dailyRate: 1200, photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80', assignedProject: 'Apex Tech Park Block C', emergencyContact: '+91 99670 11987 (Father)' },
      { id: 'LAB-105', fullName: 'Pradeep Shinde', skill: 'Helper', experienceYears: 3, phone: '+91 98920 44102', address: 'Dombivli East, Thane, MH', availability: 'available', rating: 4.5, dailyRate: 650, photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80', assignedProject: 'Unassigned', emergencyContact: '+91 98920 77123 (Mother)' },
      { id: 'LAB-106', fullName: 'Rajesh Vishwakarma', skill: 'Plumber', experienceYears: 9, phone: '+91 97690 12345', address: 'Borivali West, Mumbai, MH', availability: 'busy', rating: 4.8, dailyRate: 1050, photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80', assignedProject: 'Seaside Residential Complex', emergencyContact: '+91 97690 99887 (Brother)' },
      { id: 'LAB-107', fullName: 'Dinesh Solanki', skill: 'Painter', experienceYears: 5, phone: '+91 98199 55678', address: 'Vashi, Navi Mumbai, MH', availability: 'on_leave', rating: 4.6, dailyRate: 800, photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', assignedProject: 'Unassigned', emergencyContact: '+91 98199 33211 (Wife)' },
      { id: 'LAB-108', fullName: 'Manoj Yadav', skill: 'Mason', experienceYears: 12, phone: '+91 99201 66789', address: 'Ghatkopar East, Mumbai, MH', availability: 'busy', rating: 5.0, dailyRate: 1150, photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', assignedProject: 'Highway Flyover Extension', emergencyContact: '+91 99201 44321 (Brother)' },
      { id: 'LAB-109', fullName: 'Ganesh Patil', skill: 'Electrician', experienceYears: 4, phone: '+91 98210 77890', address: 'Kalyan West, MH', availability: 'available', rating: 4.4, dailyRate: 900, photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', assignedProject: 'Unassigned', emergencyContact: '+91 98210 11223 (Father)' },
      { id: 'LAB-110', fullName: 'Santosh Pawar', skill: 'Carpenter', experienceYears: 6, phone: '+91 97022 88901', address: 'Bhayandar West, MH', availability: 'busy', rating: 4.7, dailyRate: 950, photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80', assignedProject: 'Verdana Luxury Towers', emergencyContact: '+91 97022 66543 (Wife)' }
    ];
  }

  // Run initialization
  init();
});
