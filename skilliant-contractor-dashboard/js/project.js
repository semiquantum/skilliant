/**
 * ==========================================================================
 * SKILLIANT CONTRACTOR PORTAL - PROJECT MANAGEMENT CONTROLLER
 * Module: Day 3 Project Management
 * Features:
 *   - Fetch & Sync Projects with data/projects.json and LocalStorage
 *   - Dynamic Integration with Labour Management (skilliant_labour_records)
 *   - Cards & Table View Switcher for Projects
 *   - Live Multi-Criteria Search, Status Filter, Category Filter & Sorting
 *   - Real-time Portfolio Budget, Workforce & Progress Statistics
 *   - Full Project Details Modal with Overview, Assigned Roster & Attendance Logs
 *   - Assign & De-assign Labour Interface
 *   - Daily Labour Attendance Logger (Present, Absent, Late, Half Day)
 *   - Production-ready CRUD Architecture & Toast Notifications
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Constants & LocalStorage Keys
  const STORAGE_KEY_PROJECTS = 'skilliant_projects_records';
  const STORAGE_KEY_LABOUR = 'skilliant_labour_records';
  const DEFAULT_PROJECTS_JSON = 'data/projects.json';
  const DEFAULT_LABOUR_JSON = 'data/labour.json';
  const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';

  // Application State
  const state = {
    projectsList: [],
    labourList: [],
    filteredProjects: [],
    currentView: 'cards', // 'cards' or 'table'
    activeTab: 'viewProjects', // 'viewProjects', 'viewAttendance', 'viewTeam'
    selectedProjectId: null,
    editingProjectId: null,
    deleteTargetProjectId: null,
    
    // Attendance State
    attendanceProjectId: null,
    attendanceDate: new Date().toISOString().split('T')[0],
    attendanceTemp: {}, // map workerId -> status

    // Assign Labour State
    assignLabourProjectId: null,
    assignSearchQuery: '',
    assignSkillFilter: 'all',

    // Project Filters
    filters: {
      search: '',
      status: 'all',
      category: 'all',
      sort: 'deadline_asc'
    }
  };

  // DOM Elements Reference
  const DOM = {
    // Stats
    statActiveProjects: document.getElementById('statActiveProjects'),
    statSubProjects: document.getElementById('statSubProjects'),
    statTotalBudget: document.getElementById('statTotalBudget'),
    statSubBudget: document.getElementById('statSubBudget'),
    statAssignedCrew: document.getElementById('statAssignedCrew'),
    statSubCrew: document.getElementById('statSubCrew'),
    statAvgProgress: document.getElementById('statAvgProgress'),
    statSubProgress: document.getElementById('statSubProgress'),
    badgeTotalProjects: document.getElementById('badgeTotalProjects'),
    sidebarProjectCount: document.getElementById('sidebarProjectCount'),
    sidebarLabourCount: document.getElementById('sidebarLabourCount'),

    // Main Section Tabs
    tabProjectsBtn: document.getElementById('tabProjectsBtn'),
    tabAttendanceBtn: document.getElementById('tabAttendanceBtn'),
    tabTeamBtn: document.getElementById('tabTeamBtn'),
    viewPanes: document.querySelectorAll('.view-pane'),

    // Toolbar & Controls
    projectSearchInput: document.getElementById('projectSearchInput'),
    filterStatusSelect: document.getElementById('filterStatusSelect'),
    filterCategorySelect: document.getElementById('filterCategorySelect'),
    sortProjectSelect: document.getElementById('sortProjectSelect'),
    viewCardsBtn: document.getElementById('viewCardsBtn'),
    viewTableBtn: document.getElementById('viewTableBtn'),
    resetProjectFiltersBtn: document.getElementById('resetProjectFiltersBtn'),

    // Views
    projectsCardsGrid: document.getElementById('projectsCardsGrid'),
    projectTableContainer: document.getElementById('projectTableContainer'),
    projectTableBody: document.getElementById('projectTableBody'),
    emptyState: document.getElementById('emptyState'),

    // Buttons
    openAddProjectModalBtn: document.getElementById('openAddProjectModalBtn'),
    quickAttendanceBtn: document.getElementById('quickAttendanceBtn'),
    openAssignLabourGlobalBtn: document.getElementById('openAssignLabourGlobalBtn'),

    // Attendance Panel Elements
    attProjectSelect: document.getElementById('attProjectSelect'),
    attDatePicker: document.getElementById('attDatePicker'),
    attMarkAllPresentBtn: document.getElementById('attMarkAllPresentBtn'),
    attCountPresent: document.getElementById('attCountPresent'),
    attCountAbsent: document.getElementById('attCountAbsent'),
    attCountLate: document.getElementById('attCountLate'),
    attCountHalfDay: document.getElementById('attCountHalfDay'),
    attCountTotal: document.getElementById('attCountTotal'),
    attendanceWorkerGrid: document.getElementById('attendanceWorkerGrid'),
    saveAttendanceBtn: document.getElementById('saveAttendanceBtn'),

    // Team Roster View
    teamOverviewRoster: document.getElementById('teamOverviewRoster'),

    // Project Form Modal (Add / Edit)
    projectFormModal: document.getElementById('projectFormModal'),
    projectForm: document.getElementById('projectForm'),
    projectModalTitle: document.getElementById('projectModalTitle'),
    closeProjectModalBtn: document.getElementById('closeProjectModalBtn'),
    cancelProjectFormBtn: document.getElementById('cancelProjectFormBtn'),
    projectIdInput: document.getElementById('projectIdInput'),
    projectNameInput: document.getElementById('projectNameInput'),
    clientInput: document.getElementById('clientInput'),
    locationInput: document.getElementById('locationInput'),
    budgetInput: document.getElementById('budgetInput'),
    spentInput: document.getElementById('spentInput'),
    startDateInput: document.getElementById('startDateInput'),
    deadlineInput: document.getElementById('deadlineInput'),
    statusInput: document.getElementById('statusInput'),
    categoryInput: document.getElementById('categoryInput'),
    progressInput: document.getElementById('progressInput'),
    siteManagerInput: document.getElementById('siteManagerInput'),
    descriptionInput: document.getElementById('descriptionInput'),

    // Assign Labour Modal
    assignLabourModal: document.getElementById('assignLabourModal'),
    assignModalProjectSub: document.getElementById('assignModalProjectSub'),
    closeAssignModalBtn: document.getElementById('closeAssignModalBtn'),
    closeAssignFooterBtn: document.getElementById('closeAssignFooterBtn'),
    assignLabourSearchInput: document.getElementById('assignLabourSearchInput'),
    assignLabourSkillFilter: document.getElementById('assignLabourSkillFilter'),
    labourSelectionList: document.getElementById('labourSelectionList'),

    // Project Details Modal
    projectDetailsModal: document.getElementById('projectDetailsModal'),
    detailsProjectTitle: document.getElementById('detailsProjectTitle'),
    detailsProjectStatus: document.getElementById('detailsProjectStatus'),
    projectDetailsBody: document.getElementById('projectDetailsBody'),
    closeProjectDetailsBtn: document.getElementById('closeProjectDetailsBtn'),
    closeDetailsFooterBtn: document.getElementById('closeDetailsFooterBtn'),
    editProjectFromDetailsBtn: document.getElementById('editProjectFromDetailsBtn'),

    // Delete Modal
    deleteConfirmModal: document.getElementById('deleteConfirmModal'),
    deleteProjectTargetName: document.getElementById('deleteProjectTargetName'),
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
    setupDateWidget();
    await loadLabourData();
    await loadProjectsData();
    registerEventListeners();
    setupDefaultDates();
    renderAll();
  }

  function setupDateWidget() {
    const dateText = document.getElementById('dateText');
    if (dateText) {
      const now = new Date();
      const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
      dateText.textContent = now.toLocaleDateString('en-US', options);
    }
  }

  function setupDefaultDates() {
    if (DOM.attDatePicker) {
      DOM.attDatePicker.value = state.attendanceDate;
    }
  }

  // Load Labour dataset from localStorage or data/labour.json or fallback
  async function loadLabourData() {
    const cachedLabour = localStorage.getItem(STORAGE_KEY_LABOUR);
    if (cachedLabour) {
      try {
        const parsed = JSON.parse(cachedLabour);
        if (Array.isArray(parsed) && parsed.length > 0) {
          state.labourList = parsed;
          updateSidebarLabourBadge();
          return;
        }
      } catch (e) {
        console.error('Error parsing cached labour data:', e);
      }
    }

    try {
      const res = await fetch(DEFAULT_LABOUR_JSON);
      if (res.ok) {
        state.labourList = await res.json();
        saveLabourToStorage();
      } else {
        state.labourList = getFallbackLabourDataset();
        saveLabourToStorage();
      }
    } catch (err) {
      console.warn('Could not fetch labour.json directly (CORS/file protocol), using fallback dataset');
      state.labourList = getFallbackLabourDataset();
      saveLabourToStorage();
    }
    updateSidebarLabourBadge();
  }

  // Load Projects dataset from localStorage or data/projects.json or fallback
  async function loadProjectsData() {
    const cachedProjects = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (cachedProjects) {
      try {
        const parsed = JSON.parse(cachedProjects);
        if (Array.isArray(parsed) && parsed.length > 0) {
          state.projectsList = parsed;
          filterAndSortProjects();
          return;
        }
      } catch (e) {
        console.error('Error parsing cached projects data:', e);
      }
    }

    try {
      const res = await fetch(DEFAULT_PROJECTS_JSON);
      if (res.ok) {
        state.projectsList = await res.json();
        saveProjectsToStorage();
      } else {
        state.projectsList = getFallbackProjectsDataset();
        saveProjectsToStorage();
      }
    } catch (err) {
      console.warn('Could not fetch projects.json directly (CORS/file protocol), using fallback dataset');
      state.projectsList = getFallbackProjectsDataset();
      saveProjectsToStorage();
    }
    filterAndSortProjects();
  }

  function saveProjectsToStorage() {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(state.projectsList));
  }

  function saveLabourToStorage() {
    localStorage.setItem(STORAGE_KEY_LABOUR, JSON.stringify(state.labourList));
    updateSidebarLabourBadge();
  }

  function updateSidebarLabourBadge() {
    if (DOM.sidebarLabourCount) {
      DOM.sidebarLabourCount.textContent = state.labourList.length || '148';
    }
  }

  /* --------------------------------------------------------------------------
     2. FILTER, SORT & RENDER ENGINE
     -------------------------------------------------------------------------- */
  function filterAndSortProjects() {
    const q = state.filters.search.toLowerCase().trim();
    const st = state.filters.status;
    const cat = state.filters.category;
    const sort = state.filters.sort;

    state.filteredProjects = state.projectsList.filter(p => {
      const matchesSearch = !q || 
        p.name.toLowerCase().includes(q) || 
        p.client.toLowerCase().includes(q) || 
        p.location.toLowerCase().includes(q);

      const matchesStatus = (st === 'all') || (p.status === st);
      const matchesCategory = (cat === 'all') || (p.category === cat);

      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sorting
    state.filteredProjects.sort((a, b) => {
      if (sort === 'deadline_asc') {
        return new Date(a.deadline) - new Date(b.deadline);
      } else if (sort === 'progress_desc') {
        return b.progress - a.progress;
      } else if (sort === 'budget_desc') {
        return b.budget - a.budget;
      } else if (sort === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }

  function renderAll() {
    renderOverviewStats();
    if (state.currentView === 'cards') {
      renderProjectsCards();
    } else {
      renderProjectsTable();
    }
    populateAttendanceProjectDropdown();
    renderAttendancePanel();
    renderTeamOverviewRoster();
  }

  /* --------------------------------------------------------------------------
     3. OVERVIEW STATS RENDERER
     -------------------------------------------------------------------------- */
  function renderOverviewStats() {
    const total = state.projectsList.length;
    const active = state.projectsList.filter(p => p.status === 'in_progress').length;
    const planning = state.projectsList.filter(p => p.status === 'planning').length;
    const delayed = state.projectsList.filter(p => p.status === 'delayed').length;
    const onHold = state.projectsList.filter(p => p.status === 'on_hold').length;

    let totalBudget = 0;
    let totalSpent = 0;
    let totalAssignedLabour = 0;
    let totalProgress = 0;

    state.projectsList.forEach(p => {
      totalBudget += Number(p.budget || 0);
      totalSpent += Number(p.spent || 0);
      totalAssignedLabour += (p.assignedLabour ? p.assignedLabour.length : 0);
      totalProgress += Number(p.progress || 0);
    });

    const avgProgress = total > 0 ? (totalProgress / total).toFixed(1) : 0;
    const spendPct = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0;

    if (DOM.statActiveProjects) DOM.statActiveProjects.textContent = total;
    if (DOM.statSubProjects) DOM.statSubProjects.textContent = `${active} In Progress • ${planning} Planning • ${delayed} Delayed`;
    
    if (DOM.statTotalBudget) DOM.statTotalBudget.textContent = formatCurrency(totalBudget);
    if (DOM.statSubBudget) DOM.statSubBudget.textContent = `${formatCurrency(totalSpent)} Spent (${spendPct}%)`;

    if (DOM.statAssignedCrew) DOM.statAssignedCrew.textContent = `${totalAssignedLabour} Workers`;
    if (DOM.statSubCrew) DOM.statSubCrew.textContent = `Assigned across ${total} active sites`;

    if (DOM.statAvgProgress) DOM.statAvgProgress.textContent = `${avgProgress}%`;
    if (DOM.statSubProgress) DOM.statSubProgress.textContent = `Average progress completion`;

    if (DOM.badgeTotalProjects) DOM.badgeTotalProjects.textContent = total;
    if (DOM.sidebarProjectCount) DOM.sidebarProjectCount.textContent = `${active} Active`;
  }

  /* --------------------------------------------------------------------------
     4. PROJECT CARDS GRID RENDERER
     -------------------------------------------------------------------------- */
  function renderProjectsCards() {
    if (!DOM.projectsCardsGrid) return;

    if (state.filteredProjects.length === 0) {
      DOM.projectsCardsGrid.style.display = 'none';
      if (DOM.projectTableContainer) DOM.projectTableContainer.style.display = 'none';
      if (DOM.emptyState) DOM.emptyState.style.display = 'block';
      return;
    }

    if (DOM.emptyState) DOM.emptyState.style.display = 'none';
    DOM.projectsCardsGrid.style.display = 'grid';
    if (DOM.projectTableContainer) DOM.projectTableContainer.style.display = 'none';

    DOM.projectsCardsGrid.innerHTML = state.filteredProjects.map(p => {
      const statusBadge = getStatusBadgeHTML(p.status);
      const progressClass = getProgressFillClass(p.progress, p.status);
      const daysRemaining = getDaysRemaining(p.deadline);
      const assignedWorkers = getAssignedLabourObjects(p.assignedLabour);
      const avatarStack = renderAvatarStack(assignedWorkers);

      return `
        <div class="project-card" data-id="${p.id}">
          <div>
            <div class="project-card-header">
              <div class="project-badges">
                ${statusBadge}
                <span class="category-tag">${escapeHTML(p.category || 'General')}</span>
              </div>
              <button class="card-action-menu-btn delete-proj-btn" data-id="${p.id}" title="Delete Project">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>

            <h3 class="project-title">${escapeHTML(p.name)}</h3>
            <div class="project-client">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>${escapeHTML(p.client)}</span>
            </div>
            <div class="project-location">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${escapeHTML(p.location)}</span>
            </div>

            <div class="project-progress-container">
              <div class="progress-label-row">
                <span class="label">Project Progress</span>
                <span class="percentage">${p.progress}%</span>
              </div>
              <div class="custom-progress-bar">
                <div class="custom-progress-fill ${progressClass}" style="width: ${p.progress}%;"></div>
              </div>
            </div>

            <div class="project-metrics-row">
              <div class="metric-item">
                <div class="metric-label">Budget</div>
                <div class="metric-value">${formatCurrency(p.budget)}</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">Deadline</div>
                <div class="metric-value">${daysRemaining}</div>
              </div>
            </div>

            <div class="assigned-labour-section">
              <span class="assigned-labour-title">Assigned Crew (${assignedWorkers.length})</span>
              ${avatarStack}
            </div>
          </div>

          <div class="project-card-footer">
            <button class="card-btn card-btn-primary view-details-btn" data-id="${p.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Details
            </button>
            <button class="card-btn card-btn-secondary assign-labour-btn" data-id="${p.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              Assign Crew
            </button>
            <button class="card-btn card-btn-attendance log-att-btn" data-id="${p.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 14l2 2 4-4"/></svg>
              Attendance
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  /* --------------------------------------------------------------------------
     5. PROJECT TABLE RENDERER
     -------------------------------------------------------------------------- */
  function renderProjectsTable() {
    if (!DOM.projectTableBody || !DOM.projectTableContainer) return;

    if (state.filteredProjects.length === 0) {
      DOM.projectTableContainer.style.display = 'none';
      if (DOM.projectsCardsGrid) DOM.projectsCardsGrid.style.display = 'none';
      if (DOM.emptyState) DOM.emptyState.style.display = 'block';
      return;
    }

    if (DOM.emptyState) DOM.emptyState.style.display = 'none';
    if (DOM.projectsCardsGrid) DOM.projectsCardsGrid.style.display = 'none';
    DOM.projectTableContainer.style.display = 'block';

    DOM.projectTableBody.innerHTML = state.filteredProjects.map(p => {
      const statusBadge = getStatusBadgeHTML(p.status);
      const progressClass = getProgressFillClass(p.progress, p.status);
      const daysRemaining = getDaysRemaining(p.deadline);
      const assignedWorkers = getAssignedLabourObjects(p.assignedLabour);

      return `
        <tr>
          <td>
            <span class="table-project-name">${escapeHTML(p.name)}</span>
            <span class="table-client-sub">${escapeHTML(p.client)} • ${escapeHTML(p.category || '')}</span>
          </td>
          <td>
            <span class="fs-8 text-white">${escapeHTML(p.location)}</span>
          </td>
          <td>
            <span class="fw-bold text-white">${formatCurrency(p.budget)}</span>
            <span class="table-client-sub">Spent: ${formatCurrency(p.spent || 0)}</span>
          </td>
          <td>
            <span class="fs-8 text-white">${formatDateStr(p.deadline)}</span>
            <span class="table-client-sub">${daysRemaining}</span>
          </td>
          <td>${statusBadge}</td>
          <td style="width: 140px;">
            <div class="d-flex align-items-center justify-content-between fs-8 mb-1 fw-bold">
              <span>${p.progress}%</span>
            </div>
            <div class="custom-progress-bar">
              <div class="custom-progress-fill ${progressClass}" style="width: ${p.progress}%;"></div>
            </div>
          </td>
          <td>
            <span class="badge bg-primary-blue text-white px-2 py-1 rounded-pill">${assignedWorkers.length} Workers</span>
          </td>
          <td>
            <div class="table-actions-cell">
              <button class="table-icon-btn view-details-btn" data-id="${p.id}" title="View Details">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </button>
              <button class="table-icon-btn assign-labour-btn" data-id="${p.id}" title="Assign Labour">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              </button>
              <button class="table-icon-btn log-att-btn" data-id="${p.id}" title="Log Attendance">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 14l2 2 4-4"/></svg>
              </button>
              <button class="table-icon-btn delete-btn delete-proj-btn" data-id="${p.id}" title="Delete Project">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  /* --------------------------------------------------------------------------
     6. ATTENDANCE INTERFACE CONTROLLER
     -------------------------------------------------------------------------- */
  function populateAttendanceProjectDropdown() {
    if (!DOM.attProjectSelect) return;
    DOM.attProjectSelect.innerHTML = state.projectsList.map(p => 
      `<option value="${p.id}">${escapeHTML(p.name)} (${p.assignedLabour ? p.assignedLabour.length : 0} Crew)</option>`
    ).join('');

    if (state.projectsList.length > 0) {
      if (!state.attendanceProjectId || !state.projectsList.find(p => p.id === state.attendanceProjectId)) {
        state.attendanceProjectId = state.projectsList[0].id;
      }
      DOM.attProjectSelect.value = state.attendanceProjectId;
    }
  }

  function renderAttendancePanel() {
    if (!DOM.attendanceWorkerGrid) return;
    const proj = state.projectsList.find(p => p.id === state.attendanceProjectId);

    if (!proj) {
      DOM.attendanceWorkerGrid.innerHTML = `
        <div class="p-4 text-center text-muted">No projects available for attendance logging.</div>
      `;
      return;
    }

    const assignedIds = proj.assignedLabour || [];
    const workers = getAssignedLabourObjects(assignedIds);

    // Initialize state.attendanceTemp from existing attendance log for selected date
    const dateLog = (proj.attendanceLog && proj.attendanceLog[state.attendanceDate]) || {};
    state.attendanceTemp = {};

    workers.forEach(w => {
      state.attendanceTemp[w.id] = dateLog[w.id] || 'present';
    });

    updateAttendanceSummaryCounts(workers.length);

    if (workers.length === 0) {
      DOM.attendanceWorkerGrid.innerHTML = `
        <div class="col-12 p-4 text-center text-muted border border-glass rounded-3">
          <p class="mb-2">No labour crew currently assigned to <strong>${escapeHTML(proj.name)}</strong>.</p>
          <button class="btn btn-sm btn-primary assign-labour-btn" data-id="${proj.id}">+ Assign Crew to Project</button>
        </div>
      `;
      return;
    }

    DOM.attendanceWorkerGrid.innerHTML = workers.map(w => {
      const currentStatus = state.attendanceTemp[w.id] || 'present';
      return `
        <div class="att-worker-card" data-worker-id="${w.id}">
          <div class="att-worker-info">
            <img src="${w.photoUrl || DEFAULT_AVATAR}" alt="${escapeHTML(w.fullName)}" class="att-worker-avatar">
            <div>
              <div class="att-worker-name">${escapeHTML(w.fullName)}</div>
              <div class="att-worker-role">${escapeHTML(w.skill)} • ₹${w.dailyRate}/day</div>
            </div>
          </div>
          <div class="attendance-pill-group">
            <button class="att-radio-btn present ${currentStatus === 'present' ? 'active' : ''}" data-worker-id="${w.id}" data-status="present">Present</button>
            <button class="att-radio-btn absent ${currentStatus === 'absent' ? 'active' : ''}" data-worker-id="${w.id}" data-status="absent">Absent</button>
            <button class="att-radio-btn late ${currentStatus === 'late' ? 'active' : ''}" data-worker-id="${w.id}" data-status="late">Late</button>
            <button class="att-radio-btn half_day ${currentStatus === 'half_day' ? 'active' : ''}" data-worker-id="${w.id}" data-status="half_day">Half Day</button>
          </div>
        </div>
      `;
    }).join('');
  }

  function updateAttendanceSummaryCounts(totalRosterCount) {
    let present = 0, absent = 0, late = 0, halfDay = 0;
    Object.values(state.attendanceTemp).forEach(st => {
      if (st === 'present') present++;
      else if (st === 'absent') absent++;
      else if (st === 'late') late++;
      else if (st === 'half_day') halfDay++;
    });

    if (DOM.attCountPresent) DOM.attCountPresent.textContent = present;
    if (DOM.attCountAbsent) DOM.attCountAbsent.textContent = absent;
    if (DOM.attCountLate) DOM.attCountLate.textContent = late;
    if (DOM.attCountHalfDay) DOM.attCountHalfDay.textContent = halfDay;
    if (DOM.attCountTotal) DOM.attCountTotal.textContent = totalRosterCount;
  }

  function saveAttendanceLog() {
    const proj = state.projectsList.find(p => p.id === state.attendanceProjectId);
    if (!proj) return;

    if (!proj.attendanceLog) proj.attendanceLog = {};
    proj.attendanceLog[state.attendanceDate] = { ...state.attendanceTemp };

    saveProjectsToStorage();
    showToast('Attendance Log Saved Successfully!', `Recorded attendance for ${proj.name} on ${state.attendanceDate}`, 'success');
  }

  /* --------------------------------------------------------------------------
     7. TEAM OVERVIEW ROSTER RENDERER
     -------------------------------------------------------------------------- */
  function renderTeamOverviewRoster() {
    if (!DOM.teamOverviewRoster) return;

    if (state.projectsList.length === 0) {
      DOM.teamOverviewRoster.innerHTML = '<div class="text-muted p-4 text-center">No active projects found.</div>';
      return;
    }

    DOM.teamOverviewRoster.innerHTML = state.projectsList.map(proj => {
      const workers = getAssignedLabourObjects(proj.assignedLabour);
      const workerRows = workers.length > 0 ? workers.map(w => `
        <div class="d-flex align-items-center justify-content-between p-2 mb-2 bg-dark rounded border border-glass">
          <div class="d-flex align-items-center gap-3">
            <img src="${w.photoUrl || DEFAULT_AVATAR}" class="rounded-circle" width="36" height="36" style="object-fit:cover;">
            <div>
              <div class="fw-bold text-white fs-8">${escapeHTML(w.fullName)}</div>
              <div class="text-muted fs-9">${escapeHTML(w.skill)} • ${w.experienceYears} yrs exp</div>
            </div>
          </div>
          <div class="d-flex align-items-center gap-3">
            <span class="badge bg-secondary text-white fs-9">${escapeHTML(w.phone || 'N/A')}</span>
            <button class="btn btn-sm btn-outline-danger py-0 px-2 unassign-worker-btn" data-proj-id="${proj.id}" data-worker-id="${w.id}">Unassign</button>
          </div>
        </div>
      `).join('') : '<div class="text-muted fs-8 py-2">No labour assigned to this site yet.</div>';

      return `
        <div class="glass-card p-3 mb-3">
          <div class="d-flex align-items-center justify-content-between mb-3 border-bottom border-glass pb-2">
            <div>
              <h4 class="fw-bold text-white fs-7 mb-1">${escapeHTML(proj.name)}</h4>
              <span class="text-muted fs-8">${escapeHTML(proj.location)} • ${escapeHTML(proj.client)}</span>
            </div>
            <button class="btn btn-sm btn-primary assign-labour-btn" data-id="${proj.id}">+ Assign Crew</button>
          </div>
          <div>${workerRows}</div>
        </div>
      `;
    }).join('');
  }

  /* --------------------------------------------------------------------------
     8. ASSIGN LABOUR MODAL CONTROLLER
     -------------------------------------------------------------------------- */
  function openAssignLabourModal(projectId) {
    state.assignLabourProjectId = projectId;
    const proj = state.projectsList.find(p => p.id === projectId);
    if (!proj) return;

    if (DOM.assignModalProjectSub) {
      DOM.assignModalProjectSub.textContent = `Project: ${proj.name} (${proj.location})`;
    }

    renderAssignLabourList();
    openModal(DOM.assignLabourModal);
  }

  function renderAssignLabourList() {
    if (!DOM.labourSelectionList) return;
    const proj = state.projectsList.find(p => p.id === state.assignLabourProjectId);
    if (!proj) return;

    const assignedSet = new Set(proj.assignedLabour || []);
    const q = state.assignSearchQuery.toLowerCase().trim();
    const skillFilter = state.assignSkillFilter;

    const filtered = state.labourList.filter(w => {
      const matchesQuery = !q || w.fullName.toLowerCase().includes(q) || w.skill.toLowerCase().includes(q);
      const matchesSkill = (skillFilter === 'all') || (w.skill === skillFilter);
      return matchesQuery && matchesSkill;
    });

    if (filtered.length === 0) {
      DOM.labourSelectionList.innerHTML = '<div class="p-4 text-center text-muted">No matching labour records found.</div>';
      return;
    }

    DOM.labourSelectionList.innerHTML = filtered.map(w => {
      const isAssigned = assignedSet.has(w.id);
      return `
        <div class="labour-select-item ${isAssigned ? 'assigned' : ''}">
          <div class="item-left">
            <img src="${w.photoUrl || DEFAULT_AVATAR}" alt="${escapeHTML(w.fullName)}" class="item-avatar">
            <div>
              <div class="item-name">${escapeHTML(w.fullName)}</div>
              <div class="item-meta">${escapeHTML(w.skill)} • ${w.experienceYears} yrs exp • ₹${w.dailyRate}/day</div>
            </div>
          </div>
          <button class="assign-toggle-btn ${isAssigned ? 'btn-remove' : 'btn-assign'}" data-worker-id="${w.id}">
            ${isAssigned ? 'Remove' : 'Assign'}
          </button>
        </div>
      `;
    }).join('');
  }

  function toggleWorkerAssignment(workerId) {
    const proj = state.projectsList.find(p => p.id === state.assignLabourProjectId);
    if (!proj) return;

    if (!proj.assignedLabour) proj.assignedLabour = [];
    const index = proj.assignedLabour.indexOf(workerId);

    if (index > -1) {
      proj.assignedLabour.splice(index, 1);
      // Update worker's assigned project status in labourList
      updateWorkerProjectStatus(workerId, 'Unassigned');
      showToast('Worker Removed', `Worker removed from ${proj.name}`, 'info');
    } else {
      proj.assignedLabour.push(workerId);
      updateWorkerProjectStatus(workerId, proj.name);
      showToast('Worker Assigned!', `Worker assigned to ${proj.name}`, 'success');
    }

    saveProjectsToStorage();
    saveLabourToStorage();
    renderAssignLabourList();
    renderAll();
  }

  function updateWorkerProjectStatus(workerId, projName) {
    const worker = state.labourList.find(w => w.id === workerId);
    if (worker) {
      worker.assignedProject = projName;
      worker.availability = (projName === 'Unassigned') ? 'available' : 'busy';
    }
  }

  /* --------------------------------------------------------------------------
     9. PROJECT DETAILS MODAL CONTROLLER
     -------------------------------------------------------------------------- */
  function openProjectDetailsModal(projectId) {
    const p = state.projectsList.find(proj => proj.id === projectId);
    if (!p) return;
    state.selectedProjectId = projectId;

    if (DOM.detailsProjectTitle) DOM.detailsProjectTitle.textContent = p.name;
    if (DOM.detailsProjectStatus) {
      DOM.detailsProjectStatus.className = `status-badge ${p.status}`;
      DOM.detailsProjectStatus.innerHTML = `<span class="dot"></span> ${p.status.replace('_', ' ').toUpperCase()}`;
    }

    const assignedWorkers = getAssignedLabourObjects(p.assignedLabour);
    const dateLog = p.attendanceLog || {};
    const attendanceDates = Object.keys(dateLog);

    DOM.projectDetailsBody.innerHTML = `
      <div class="row g-3 mb-4">
        <div class="col-md-6">
          <div class="p-3 bg-dark rounded border border-glass">
            <span class="text-muted fs-8 d-block mb-1">CLIENT NAME</span>
            <strong class="text-white fs-7">${escapeHTML(p.client)}</strong>
          </div>
        </div>
        <div class="col-md-6">
          <div class="p-3 bg-dark rounded border border-glass">
            <span class="text-muted fs-8 d-block mb-1">SITE LOCATION</span>
            <strong class="text-white fs-7">${escapeHTML(p.location)}</strong>
          </div>
        </div>
        <div class="col-md-6">
          <div class="p-3 bg-dark rounded border border-glass">
            <span class="text-muted fs-8 d-block mb-1">TOTAL BUDGET</span>
            <strong class="text-primary-blue fs-6">${formatCurrency(p.budget)}</strong>
            <span class="text-muted fs-9 d-block mt-1">Spent: ${formatCurrency(p.spent || 0)}</span>
          </div>
        </div>
        <div class="col-md-6">
          <div class="p-3 bg-dark rounded border border-glass">
            <span class="text-muted fs-8 d-block mb-1">TARGET DEADLINE</span>
            <strong class="text-white fs-7">${formatDateStr(p.deadline)}</strong>
            <span class="text-muted fs-9 d-block mt-1">${getDaysRemaining(p.deadline)}</span>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <h4 class="fw-bold text-white fs-7 mb-2">Scope & Description</h4>
        <p class="text-muted fs-8 bg-dark p-3 rounded border border-glass">${escapeHTML(p.description || 'No detailed scope provided.')}</p>
      </div>

      <div class="mb-4">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <h4 class="fw-bold text-white fs-7 mb-0">Assigned Labour Crew (${assignedWorkers.length})</h4>
          <button class="btn btn-sm btn-primary assign-labour-btn" data-id="${p.id}">+ Assign Crew</button>
        </div>
        <div class="d-flex flex-wrap gap-2">
          ${assignedWorkers.length > 0 ? assignedWorkers.map(w => `
            <div class="d-flex align-items-center gap-2 p-2 bg-dark rounded border border-glass" style="min-width: 200px;">
              <img src="${w.photoUrl || DEFAULT_AVATAR}" class="rounded-circle" width="32" height="32" style="object-fit:cover;">
              <div>
                <div class="fw-bold text-white fs-8">${escapeHTML(w.fullName)}</div>
                <div class="text-muted fs-9">${escapeHTML(w.skill)}</div>
              </div>
            </div>
          `).join('') : '<div class="text-muted fs-8">No workers currently assigned.</div>'}
        </div>
      </div>

      <div>
        <h4 class="fw-bold text-white fs-7 mb-2">Attendance Summary Logs</h4>
        <p class="text-muted fs-8">Logged attendance dates: ${attendanceDates.length > 0 ? attendanceDates.join(', ') : 'No logs recorded yet.'}</p>
      </div>
    `;

    openModal(DOM.projectDetailsModal);
  }

  /* --------------------------------------------------------------------------
     10. CREATE / EDIT PROJECT FORM CONTROLLER
     -------------------------------------------------------------------------- */
  function openProjectFormModal(projectId = null) {
    state.editingProjectId = projectId;
    DOM.projectForm.reset();

    if (projectId) {
      const p = state.projectsList.find(proj => proj.id === projectId);
      if (!p) return;

      if (DOM.projectModalTitle) DOM.projectModalTitle.textContent = 'Edit Project';
      DOM.projectIdInput.value = p.id;
      DOM.projectNameInput.value = p.name;
      DOM.clientInput.value = p.client;
      DOM.locationInput.value = p.location;
      DOM.budgetInput.value = p.budget;
      DOM.spentInput.value = p.spent || 0;
      DOM.startDateInput.value = p.startDate;
      DOM.deadlineInput.value = p.deadline;
      DOM.statusInput.value = p.status;
      DOM.categoryInput.value = p.category || 'Infrastructure';
      DOM.progressInput.value = p.progress || 0;
      DOM.siteManagerInput.value = p.siteManager || '';
      DOM.descriptionInput.value = p.description || '';
    } else {
      if (DOM.projectModalTitle) DOM.projectModalTitle.textContent = 'Create New Project';
      DOM.projectIdInput.value = '';
      DOM.startDateInput.value = new Date().toISOString().split('T')[0];
    }

    openModal(DOM.projectFormModal);
  }

  function handleProjectFormSubmit(e) {
    e.preventDefault();

    const id = DOM.projectIdInput.value || `PRJ-${Date.now().toString().slice(-3)}`;
    const isEdit = Boolean(DOM.projectIdInput.value);

    const projectData = {
      id,
      name: DOM.projectNameInput.value.trim(),
      client: DOM.clientInput.value.trim(),
      location: DOM.locationInput.value.trim(),
      budget: Number(DOM.budgetInput.value),
      spent: Number(DOM.spentInput.value || 0),
      startDate: DOM.startDateInput.value,
      deadline: DOM.deadlineInput.value,
      status: DOM.statusInput.value,
      category: DOM.categoryInput.value,
      progress: Number(DOM.progressInput.value || 0),
      siteManager: DOM.siteManagerInput.value.trim(),
      description: DOM.descriptionInput.value.trim(),
      assignedLabour: isEdit ? (state.projectsList.find(p => p.id === id)?.assignedLabour || []) : [],
      attendanceLog: isEdit ? (state.projectsList.find(p => p.id === id)?.attendanceLog || {}) : {}
    };

    if (isEdit) {
      const idx = state.projectsList.findIndex(p => p.id === id);
      if (idx > -1) state.projectsList[idx] = projectData;
      showToast('Project Updated', `${projectData.name} has been updated.`, 'success');
    } else {
      state.projectsList.unshift(projectData);
      showToast('Project Created!', `${projectData.name} added to portfolio.`, 'success');
    }

    saveProjectsToStorage();
    closeModal(DOM.projectFormModal);
    filterAndSortProjects();
    renderAll();
  }

  /* --------------------------------------------------------------------------
     11. DELETE PROJECT CONTROLLER
     -------------------------------------------------------------------------- */
  function openDeleteConfirmModal(projectId) {
    const p = state.projectsList.find(proj => proj.id === projectId);
    if (!p) return;

    state.deleteTargetProjectId = projectId;
    if (DOM.deleteProjectTargetName) DOM.deleteProjectTargetName.textContent = p.name;
    openModal(DOM.deleteConfirmModal);
  }

  function confirmDeleteProject() {
    if (!state.deleteTargetProjectId) return;

    const proj = state.projectsList.find(p => p.id === state.deleteTargetProjectId);
    const projName = proj ? proj.name : 'Project';

    // Unassign workers
    if (proj && proj.assignedLabour) {
      proj.assignedLabour.forEach(wId => {
        updateWorkerProjectStatus(wId, 'Unassigned');
      });
      saveLabourToStorage();
    }

    state.projectsList = state.projectsList.filter(p => p.id !== state.deleteTargetProjectId);
    saveProjectsToStorage();
    closeModal(DOM.deleteConfirmModal);
    filterAndSortProjects();
    renderAll();
    showToast('Project Deleted', `${projName} removed from portal.`, 'info');
  }

  /* --------------------------------------------------------------------------
     12. EVENT LISTENERS & DELEGATION
     -------------------------------------------------------------------------- */
  function registerEventListeners() {
    // Section Tab Switching
    DOM.tabProjectsBtn?.addEventListener('click', () => switchMainTab('viewProjects', DOM.tabProjectsBtn));
    DOM.tabAttendanceBtn?.addEventListener('click', () => switchMainTab('viewAttendance', DOM.tabAttendanceBtn));
    DOM.tabTeamBtn?.addEventListener('click', () => switchMainTab('viewTeam', DOM.tabTeamBtn));

    // View Switcher (Cards vs Table)
    DOM.viewCardsBtn?.addEventListener('click', () => setViewMode('cards'));
    DOM.viewTableBtn?.addEventListener('click', () => setViewMode('table'));

    // Search, Filter & Sort
    DOM.projectSearchInput?.addEventListener('input', (e) => {
      state.filters.search = e.target.value;
      filterAndSortProjects();
      renderAll();
    });

    DOM.filterStatusSelect?.addEventListener('change', (e) => {
      state.filters.status = e.target.value;
      filterAndSortProjects();
      renderAll();
    });

    DOM.filterCategorySelect?.addEventListener('change', (e) => {
      state.filters.category = e.target.value;
      filterAndSortProjects();
      renderAll();
    });

    DOM.sortProjectSelect?.addEventListener('change', (e) => {
      state.filters.sort = e.target.value;
      filterAndSortProjects();
      renderAll();
    });

    DOM.resetProjectFiltersBtn?.addEventListener('click', () => {
      state.filters = { search: '', status: 'all', category: 'all', sort: 'deadline_asc' };
      if (DOM.projectSearchInput) DOM.projectSearchInput.value = '';
      if (DOM.filterStatusSelect) DOM.filterStatusSelect.value = 'all';
      if (DOM.filterCategorySelect) DOM.filterCategorySelect.value = 'all';
      if (DOM.sortProjectSelect) DOM.sortProjectSelect.value = 'deadline_asc';
      filterAndSortProjects();
      renderAll();
    });

    // Buttons
    DOM.openAddProjectModalBtn?.addEventListener('click', () => openProjectFormModal());
    DOM.quickAttendanceBtn?.addEventListener('click', () => switchMainTab('viewAttendance', DOM.tabAttendanceBtn));
    DOM.openAssignLabourGlobalBtn?.addEventListener('click', () => {
      if (state.projectsList.length > 0) openAssignLabourModal(state.projectsList[0].id);
    });

    // Attendance Controls
    DOM.attProjectSelect?.addEventListener('change', (e) => {
      state.attendanceProjectId = e.target.value;
      renderAttendancePanel();
    });

    DOM.attDatePicker?.addEventListener('change', (e) => {
      state.attendanceDate = e.target.value;
      renderAttendancePanel();
    });

    DOM.attMarkAllPresentBtn?.addEventListener('click', () => {
      Object.keys(state.attendanceTemp).forEach(wId => {
        state.attendanceTemp[wId] = 'present';
      });
      renderAttendancePanel();
      showToast('Attendance Updated', 'All workers marked Present.', 'info');
    });

    DOM.saveAttendanceBtn?.addEventListener('click', saveAttendanceLog);

    // Attendance Radio Toggle Click Event Delegation
    DOM.attendanceWorkerGrid?.addEventListener('click', (e) => {
      const btn = e.target.closest('.att-radio-btn');
      if (!btn) return;
      const workerId = btn.dataset.workerId;
      const status = btn.dataset.status;

      state.attendanceTemp[workerId] = status;
      renderAttendancePanel();
    });

    // Assign Labour Filters & Actions
    DOM.assignLabourSearchInput?.addEventListener('input', (e) => {
      state.assignSearchQuery = e.target.value;
      renderAssignLabourList();
    });

    DOM.assignLabourSkillFilter?.addEventListener('change', (e) => {
      state.assignSkillFilter = e.target.value;
      renderAssignLabourList();
    });

    DOM.labourSelectionList?.addEventListener('click', (e) => {
      const btn = e.target.closest('.assign-toggle-btn');
      if (!btn) return;
      toggleWorkerAssignment(btn.dataset.workerId);
    });

    // Team Overview Roster Unassign Action Delegation
    DOM.teamOverviewRoster?.addEventListener('click', (e) => {
      const btn = e.target.closest('.unassign-worker-btn');
      if (!btn) return;
      state.assignLabourProjectId = btn.dataset.projId;
      toggleWorkerAssignment(btn.dataset.workerId);
    });

    // Cards Grid & Table Action Event Delegation
    const handleProjectActions = (e) => {
      const detailsBtn = e.target.closest('.view-details-btn');
      const assignBtn = e.target.closest('.assign-labour-btn');
      const attBtn = e.target.closest('.log-att-btn');
      const deleteBtn = e.target.closest('.delete-proj-btn');

      if (detailsBtn) openProjectDetailsModal(detailsBtn.dataset.id);
      else if (assignBtn) openAssignLabourModal(assignBtn.dataset.id);
      else if (attBtn) {
        state.attendanceProjectId = attBtn.dataset.id;
        switchMainTab('viewAttendance', DOM.tabAttendanceBtn);
      } else if (deleteBtn) openDeleteConfirmModal(deleteBtn.dataset.id);
    };

    DOM.projectsCardsGrid?.addEventListener('click', handleProjectActions);
    DOM.projectTableBody?.addEventListener('click', handleProjectActions);

    // Modal Close Listeners
    DOM.closeProjectModalBtn?.addEventListener('click', () => closeModal(DOM.projectFormModal));
    DOM.cancelProjectFormBtn?.addEventListener('click', () => closeModal(DOM.projectFormModal));
    DOM.projectForm?.addEventListener('submit', handleProjectFormSubmit);

    DOM.closeAssignModalBtn?.addEventListener('click', () => closeModal(DOM.assignLabourModal));
    DOM.closeAssignFooterBtn?.addEventListener('click', () => closeModal(DOM.assignLabourModal));

    DOM.closeProjectDetailsBtn?.addEventListener('click', () => closeModal(DOM.projectDetailsModal));
    DOM.closeDetailsFooterBtn?.addEventListener('click', () => closeModal(DOM.projectDetailsModal));
    DOM.editProjectFromDetailsBtn?.addEventListener('click', () => {
      closeModal(DOM.projectDetailsModal);
      openProjectFormModal(state.selectedProjectId);
    });

    DOM.closeDeleteModalBtn?.addEventListener('click', () => closeModal(DOM.deleteConfirmModal));
    DOM.cancelDeleteBtn?.addEventListener('click', () => closeModal(DOM.deleteConfirmModal));
    DOM.confirmDeleteBtn?.addEventListener('click', confirmDeleteProject);
  }

  function switchMainTab(targetId, activeBtn) {
    document.querySelectorAll('.section-tab-btn').forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');

    DOM.viewPanes.forEach(pane => {
      pane.style.display = (pane.id === targetId) ? 'block' : 'none';
    });

    if (targetId === 'viewAttendance') renderAttendancePanel();
    else if (targetId === 'viewTeam') renderTeamOverviewRoster();
  }

  function setViewMode(mode) {
    state.currentView = mode;
    DOM.viewCardsBtn?.classList.toggle('active', mode === 'cards');
    DOM.viewTableBtn?.classList.toggle('active', mode === 'table');
    renderAll();
  }

  /* --------------------------------------------------------------------------
     13. HELPER & UTILITY FUNCTIONS
     -------------------------------------------------------------------------- */
  function getAssignedLabourObjects(assignedIds = []) {
    return assignedIds.map(id => state.labourList.find(w => w.id === id)).filter(Boolean);
  }

  function renderAvatarStack(workers = []) {
    if (workers.length === 0) {
      return '<span class="text-muted fs-8">Unassigned</span>';
    }

    const visible = workers.slice(0, 3);
    const extraCount = workers.length - visible.length;

    const stackHtml = visible.map(w => 
      `<img src="${w.photoUrl || DEFAULT_AVATAR}" alt="${escapeHTML(w.fullName)}" title="${escapeHTML(w.fullName)} (${escapeHTML(w.skill)})" class="stack-avatar">`
    ).join('');

    const moreBadge = extraCount > 0 ? `<div class="stack-more">+${extraCount}</div>` : '';

    return `<div class="avatar-stack">${stackHtml}${moreBadge}</div>`;
  }

  function getStatusBadgeHTML(status) {
    const labels = {
      in_progress: 'In Progress',
      planning: 'Planning',
      on_hold: 'On Hold',
      completed: 'Completed',
      delayed: 'Delayed'
    };
    const label = labels[status] || status;
    return `<span class="status-badge ${status}"><span class="dot"></span>${label}</span>`;
  }

  function getProgressFillClass(progress, status) {
    if (status === 'completed') return 'fill-green';
    if (status === 'delayed') return 'fill-red';
    if (progress >= 75) return 'fill-green';
    if (progress >= 30) return '';
    return 'fill-orange';
  }

  function getDaysRemaining(deadlineStr) {
    if (!deadlineStr) return 'N/A';
    const target = new Date(deadlineStr);
    const now = new Date();
    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `<span class="text-danger fw-bold">${Math.abs(diffDays)}d overdue</span>`;
    if (diffDays === 0) return `<span class="text-warning fw-bold">Due today</span>`;
    return `<span class="text-muted">${diffDays} days left</span>`;
  }

  function formatCurrency(val) {
    const num = Number(val || 0);
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} L`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
  }

  function formatDateStr(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function openModal(modalEl) {
    if (modalEl) modalEl.classList.add('active');
  }

  function closeModal(modalEl) {
    if (modalEl) modalEl.classList.remove('active');
  }

  function showToast(title, message, type = 'info') {
    if (!DOM.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-title">${escapeHTML(title)}</div>
        <div class="toast-message">${escapeHTML(message)}</div>
      </div>
      <button class="toast-close">&times;</button>
    `;

    DOM.toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn?.addEventListener('click', () => removeToast(toast));

    setTimeout(() => removeToast(toast), 4000);
  }

  function removeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }

  function getFallbackProjectsDataset() {
    return [
      {
        "id": "PRJ-201",
        "name": "Metro Line 4 - Station 12 Construction",
        "client": "Mumbai Metro Rail Corporation (MMRC)",
        "location": "Ghatkopar East, Mumbai, MH",
        "budget": 14500000,
        "spent": 9425000,
        "startDate": "2026-01-15",
        "deadline": "2026-11-30",
        "status": "in_progress",
        "category": "Infrastructure",
        "progress": 65,
        "siteManager": "Er. Alok Sharma (+91 98200 11223)",
        "description": "Construction of elevated metro platform, structural steel framework, concourse level tiling, and utility integration.",
        "assignedLabour": ["LAB-101", "LAB-104", "LAB-108", "LAB-110", "LAB-112"],
        "attendanceLog": {
          "2026-08-06": {
            "LAB-101": "present",
            "LAB-104": "present",
            "LAB-108": "late",
            "LAB-110": "present",
            "LAB-112": "half_day"
          }
        }
      },
      {
        "id": "PRJ-202",
        "name": "Verdana Luxury Towers - Phase 2",
        "client": "Verdana Infrastructure Ltd",
        "location": "Powai, Mumbai, MH",
        "budget": 28000000,
        "spent": 21500000,
        "startDate": "2025-08-01",
        "deadline": "2026-10-15",
        "status": "in_progress",
        "category": "Residential",
        "progress": 82,
        "siteManager": "Ar. Rajesh Mehta (+91 97110 44332)",
        "description": "High-rise 32-story residential tower interior finishing, plumbing network installation, electrical wiring, and exterior glazing.",
        "assignedLabour": ["LAB-102", "LAB-106", "LAB-109", "LAB-111"],
        "attendanceLog": {
          "2026-08-06": {
            "LAB-102": "present",
            "LAB-106": "present",
            "LAB-109": "absent",
            "LAB-111": "present"
          }
        }
      },
      {
        "id": "PRJ-203",
        "name": "Highway Flyover Extension & Widening",
        "client": "NHAI Maharashtra Circle",
        "location": "Bhiwandi Bypass, Thane, MH",
        "budget": 19200000,
        "spent": 8600000,
        "startDate": "2026-03-01",
        "deadline": "2027-02-28",
        "status": "delayed",
        "category": "Infrastructure",
        "progress": 42,
        "siteManager": "Er. Manoj Patil (+91 99300 88776)",
        "description": "Four-lane flyover expansion, pillar pier reinforcement, asphalt paving, and drainage culvert installation.",
        "assignedLabour": ["LAB-104", "LAB-108", "LAB-112"],
        "attendanceLog": {
          "2026-08-06": {
            "LAB-104": "present",
            "LAB-108": "late",
            "LAB-112": "present"
          }
        }
      },
      {
        "id": "PRJ-204",
        "name": "Apex Tech Park Block C Commercial Hub",
        "client": "Apex Infraworks Pvt Ltd",
        "location": "BKC, Mumbai, MH",
        "budget": 35000000,
        "spent": 33200000,
        "startDate": "2025-05-10",
        "deadline": "2026-08-31",
        "status": "completed",
        "category": "Commercial",
        "progress": 100,
        "siteManager": "Er. Vikramaditya Roy (+91 98190 22110)",
        "description": "Commercial IT park building handover, HVAC ducting, fire safety systems setup, and smart facade installation.",
        "assignedLabour": ["LAB-102", "LAB-106"],
        "attendanceLog": {
          "2026-08-06": {
            "LAB-102": "present",
            "LAB-106": "present"
          }
        }
      },
      {
        "id": "PRJ-205",
        "name": "Seaside Residential Complex",
        "client": "Coastline Housing Co",
        "location": "Worli Sea Face, Mumbai, MH",
        "budget": 22500000,
        "spent": 3375000,
        "startDate": "2026-06-15",
        "deadline": "2027-08-30",
        "status": "planning",
        "category": "Residential",
        "progress": 15,
        "siteManager": "Er. Sneha Kulkarni (+91 97680 55443)",
        "description": "Luxury sea-facing apartment complex foundation piling, basement excavation, and soil stabilization.",
        "assignedLabour": ["LAB-106", "LAB-110"],
        "attendanceLog": {
          "2026-08-06": {
            "LAB-106": "present",
            "LAB-110": "present"
          }
        }
      },
      {
        "id": "PRJ-206",
        "name": "Greenfield Eco Housing Phase 2",
        "client": "Greenfield Developers",
        "location": "Kalyan Shilphata, Thane, MH",
        "budget": 16000000,
        "spent": 7200000,
        "startDate": "2026-02-01",
        "deadline": "2026-12-15",
        "status": "on_hold",
        "category": "Residential",
        "progress": 45,
        "siteManager": "Er. Pankaj Tripathi (+91 98211 66778)",
        "description": "Suburban eco-housing project featuring solar grid integration, rainwater harvesting units, and brickwork masonry.",
        "assignedLabour": ["LAB-101", "LAB-109"],
        "attendanceLog": {
          "2026-08-06": {
            "LAB-101": "absent",
            "LAB-109": "half_day"
          }
        }
      }
    ];
  }

  function getFallbackLabourDataset() {
    return [
      { id: 'LAB-101', fullName: 'Ramesh Maurya', skill: 'Mason', experienceYears: 8, phone: '+91 98201 44512', address: 'Andheri East, Mumbai', availability: 'busy', rating: 4.9, dailyRate: 950, photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', assignedProject: 'Metro Line 4 - Station 12' },
      { id: 'LAB-102', fullName: 'Suresh Kumar', skill: 'Electrician', experienceYears: 6, phone: '+91 97112 33490', address: 'Thane West, Mumbai', availability: 'busy', rating: 4.8, dailyRate: 1100, photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', assignedProject: 'Verdana Luxury Towers' },
      { id: 'LAB-103', fullName: 'Anil Deshmukh', skill: 'Carpenter', experienceYears: 10, phone: '+91 98334 11200', address: 'Panvel, Navi Mumbai', availability: 'available', rating: 4.7, dailyRate: 1000, photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80', assignedProject: 'Unassigned' },
      { id: 'LAB-104', fullName: 'Vikram Singh', skill: 'Welder', experienceYears: 7, phone: '+91 99670 88231', address: 'Kurla West, Mumbai', availability: 'busy', rating: 4.9, dailyRate: 1200, photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80', assignedProject: 'Metro Line 4 - Station 12' },
      { id: 'LAB-105', fullName: 'Pradeep Shinde', skill: 'Helper', experienceYears: 3, phone: '+91 98920 44102', address: 'Dombivli East, Thane', availability: 'available', rating: 4.5, dailyRate: 650, photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80', assignedProject: 'Unassigned' },
      { id: 'LAB-106', fullName: 'Rajesh Vishwakarma', skill: 'Plumber', experienceYears: 9, phone: '+91 97690 12345', address: 'Borivali West, Mumbai', availability: 'busy', rating: 4.8, dailyRate: 1050, photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80', assignedProject: 'Seaside Residential Complex' },
      { id: 'LAB-107', fullName: 'Dinesh Solanki', skill: 'Painter', experienceYears: 5, phone: '+91 98199 55678', address: 'Vashi, Navi Mumbai', availability: 'on_leave', rating: 4.6, dailyRate: 800, photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', assignedProject: 'Unassigned' },
      { id: 'LAB-108', fullName: 'Mohan Lal', skill: 'Mason', experienceYears: 12, phone: '+91 98200 99881', address: 'Mulund West, Mumbai', availability: 'busy', rating: 4.9, dailyRate: 980, photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80', assignedProject: 'Metro Line 4 - Station 12' },
      { id: 'LAB-109', fullName: 'Ganesh Shrestha', skill: 'Helper', experienceYears: 4, phone: '+91 97691 22334', address: 'Ghatkopar, Mumbai', availability: 'busy', rating: 4.4, dailyRate: 700, photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', assignedProject: 'Verdana Luxury Towers' },
      { id: 'LAB-110', fullName: 'Sunil Yadav', skill: 'Welder', experienceYears: 6, phone: '+91 98921 55667', address: 'Airoli, Navi Mumbai', availability: 'busy', rating: 4.7, dailyRate: 1150, photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', assignedProject: 'Metro Line 4 - Station 12' },
      { id: 'LAB-111', fullName: 'Vinod Thorat', skill: 'Electrician', experienceYears: 8, phone: '+91 98205 33445', address: 'Kalyan, Thane', availability: 'busy', rating: 4.8, dailyRate: 1100, photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', assignedProject: 'Verdana Luxury Towers' },
      { id: 'LAB-112', fullName: 'Prakash Rao', skill: 'Carpenter', experienceYears: 9, phone: '+91 99671 44556', address: 'Thane East, Thane', availability: 'busy', rating: 4.6, dailyRate: 1050, photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80', assignedProject: 'Highway Flyover Extension' }
    ];
  }

  // Initialize App
  init();
});
