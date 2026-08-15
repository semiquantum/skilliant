/**
 * SKILLIANT CONTRACTOR PORTAL - CORE JAVASCRIPT ENGINE
 * Handles LocalStorage persistence, CRUD operations, dynamic views, search, filter, and UI state.
 */

// LocalStorage Storage Key
const STORAGE_KEY = 'skilliantLabourData';

// Initial Demo Seed Data (10 Realistic Labour Records)
const INITIAL_DEMO_LABOUR = [
  {
    id: "LAB001",
    name: "Rahul Patil",
    phone: "9876543210",
    email: "rahul.patil@example.com",
    gender: "Male",
    dob: "1995-04-12",
    skill: "Mason",
    experience: 7,
    address: "102 Shivaji Nagar, Gokhale Road",
    city: "Pune",
    state: "Maharashtra",
    joiningDate: "2024-01-15",
    status: "Active",
    emergencyContact: "Suresh Patil",
    emergencyPhone: "9876501234"
  },
  {
    id: "LAB002",
    name: "Ramesh Maurya",
    phone: "9820144512",
    email: "ramesh.maurya@example.com",
    gender: "Male",
    dob: "1992-08-20",
    skill: "Electrician",
    experience: 8,
    address: "Flat 4, Andheri East",
    city: "Mumbai",
    state: "Maharashtra",
    joiningDate: "2023-11-10",
    status: "Active",
    emergencyContact: "Sunita Maurya",
    emergencyPhone: "9820199001"
  },
  {
    id: "LAB003",
    name: "Suresh Kumar",
    phone: "9711233490",
    email: "suresh.k@example.com",
    gender: "Male",
    dob: "1994-02-14",
    skill: "Plumber",
    experience: 6,
    address: "22 Thane West, Station Area",
    city: "Thane",
    state: "Maharashtra",
    joiningDate: "2024-03-01",
    status: "Active",
    emergencyContact: "Mahesh Kumar",
    emergencyPhone: "9711288210"
  },
  {
    id: "LAB004",
    name: "Anil Deshmukh",
    phone: "9833411200",
    email: "anil.d@example.com",
    gender: "Male",
    dob: "1988-11-05",
    skill: "Carpenter",
    experience: 10,
    address: "Sector 12, Panvel",
    city: "Navi Mumbai",
    state: "Maharashtra",
    joiningDate: "2022-09-18",
    status: "On Leave",
    emergencyContact: "Pooja Deshmukh",
    emergencyPhone: "9833455432"
  },
  {
    id: "LAB005",
    name: "Vikram Singh",
    phone: "9967088231",
    email: "vikram.singh@example.com",
    gender: "Male",
    dob: "1996-06-30",
    skill: "Welder",
    experience: 5,
    address: "Plot 18, MIDC Area",
    city: "Nashik",
    state: "Maharashtra",
    joiningDate: "2024-02-20",
    status: "Active",
    emergencyContact: "Karan Singh",
    emergencyPhone: "9967077123"
  },
  {
    id: "LAB006",
    name: "Priya Sharma",
    phone: "9819022341",
    email: "priya.sharma@example.com",
    gender: "Female",
    dob: "1997-09-15",
    skill: "Painter",
    experience: 4,
    address: "45 Kothrud, Karve Road",
    city: "Pune",
    state: "Maharashtra",
    joiningDate: "2024-05-12",
    status: "Active",
    emergencyContact: "Rajesh Sharma",
    emergencyPhone: "9819099887"
  },
  {
    id: "LAB007",
    name: "Ganesh Jadhav",
    phone: "9765433211",
    email: "ganesh.j@example.com",
    gender: "Male",
    dob: "1999-01-22",
    skill: "Helper",
    experience: 2,
    address: "Ward 5, Civil Lines",
    city: "Nagpur",
    state: "Maharashtra",
    joiningDate: "2024-06-01",
    status: "Inactive",
    emergencyContact: "Santosh Jadhav",
    emergencyPhone: "9765411009"
  },
  {
    id: "LAB008",
    name: "Santosh Pawar",
    phone: "9822345678",
    email: "santosh.p@example.com",
    gender: "Male",
    dob: "1991-07-19",
    skill: "Mason",
    experience: 9,
    address: "Shahupuri 3rd Lane",
    city: "Kolhapur",
    state: "Maharashtra",
    joiningDate: "2023-08-14",
    status: "Active",
    emergencyContact: "Anita Pawar",
    emergencyPhone: "9822399887"
  },
  {
    id: "LAB009",
    name: "Amit Verma",
    phone: "9921144556",
    email: "amit.verma@example.com",
    gender: "Male",
    dob: "1993-12-08",
    skill: "Electrician",
    experience: 6,
    address: "Chinchwad Station Road",
    city: "Pimpri-Chinchwad",
    state: "Maharashtra",
    joiningDate: "2024-04-10",
    status: "On Leave",
    emergencyContact: "Sunil Verma",
    emergencyPhone: "9921100998"
  },
  {
    id: "LAB010",
    name: "Deepak Kadam",
    phone: "9890123456",
    email: "deepak.k@example.com",
    gender: "Male",
    dob: "1990-03-25",
    skill: "Carpenter",
    experience: 11,
    address: "Bhosari Industrial Zone",
    city: "Pune",
    state: "Maharashtra",
    joiningDate: "2023-01-10",
    status: "Active",
    emergencyContact: "Vijay Kadam",
    emergencyPhone: "9890199887"
  }
];

// --- 1. LOCAL STORAGE UTILITIES ---

/**
 * Retrieves the full list of labour records from LocalStorage.
 * Initializes default demo data if key is missing or empty.
 */
function getLabourData() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    saveLabourData(INITIAL_DEMO_LABOUR);
    return INITIAL_DEMO_LABOUR;
  }
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      saveLabourData(INITIAL_DEMO_LABOUR);
      return INITIAL_DEMO_LABOUR;
    }
    // An empty array is valid: it means all labour records were intentionally deleted.
    return parsed;
  } catch (e) {
    console.error("Error reading LocalStorage data, reinitializing:", e);
    saveLabourData(INITIAL_DEMO_LABOUR);
    return INITIAL_DEMO_LABOUR;
  }
}

/**
 * Saves the labour array to LocalStorage.
 */
function saveLabourData(dataArray) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataArray));
}

/**
 * Retrieves a single labour object by ID.
 */
function getLabourById(id) {
  const list = getLabourData();
  return list.find(item => item.id === id) || null;
}

/**
 * Adds a new labour record to LocalStorage.
 */
function addLabour(newRecord) {
  const list = getLabourData();
  list.unshift(newRecord); // Add to start of array
  saveLabourData(list);
}

/**
 * Updates an existing labour record in LocalStorage.
 */
function updateLabour(updatedRecord) {
  const list = getLabourData();
  const index = list.findIndex(item => item.id === updatedRecord.id);
  if (index !== -1) {
    list[index] = updatedRecord;
    saveLabourData(list);
    return true;
  }
  return false;
}

/**
 * Deletes a labour record by ID from LocalStorage.
 */
function deleteLabour(id) {
  let list = getLabourData();
  list = list.filter(item => item.id !== id);
  saveLabourData(list);
}

/**
 * Calculates summary statistics dynamically from LocalStorage.
 */
function calculateStats() {
  const list = getLabourData();
  const total = list.length;
  const active = list.filter(l => l.status === 'Active').length;
  const inactive = list.filter(l => l.status === 'Inactive').length;
  const onLeave = list.filter(l => l.status === 'On Leave').length;
  return { total, active, inactive, onLeave };
}


// --- 2. UI HELPERS & NOTIFICATIONS ---

/**
 * Displays a toast notification that automatically auto-dismisses.
 */
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${type === 'danger' ? '#EF4444' : '#6B7138'}" stroke-width="2.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('toast-show'), 10);

  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Displays Delete Confirmation Modal.
 */
function showDeleteModal(id, labourName, onConfirmCallback) {
  let backdrop = document.getElementById('deleteModalBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'deleteModalBackdrop';
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal-card">
        <div class="modal-icon-warning">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h3 class="modal-title">Delete Labour?</h3>
        <p class="modal-desc" id="modalLabourNameText">Are you sure you want to delete this record? This action cannot be undone.</p>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
          <button type="button" class="btn btn-danger" id="modalConfirmBtn">Delete</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
  }

  const nameTextEl = document.getElementById('modalLabourNameText');
  if (nameTextEl) {
    nameTextEl.textContent = `Are you sure you want to delete labour record for "${labourName}" (${id})? This action cannot be undone.`;
  }

  backdrop.classList.add('active');

  const cancelBtn = document.getElementById('modalCancelBtn');
  const confirmBtn = document.getElementById('modalConfirmBtn');

  // Remove previous listeners by cloning
  const newConfirm = confirmBtn.cloneNode(true);
  const newCancel = cancelBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
  cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);

  newCancel.addEventListener('click', () => {
    backdrop.classList.remove('active');
  });

  newConfirm.addEventListener('click', () => {
    backdrop.classList.remove('active');
    onConfirmCallback();
  });
}

/**
 * Returns HTML badge string for a given status.
 */
function getStatusBadgeHtml(status) {
  let statusClass = 'status-active';
  if (status === 'Inactive') statusClass = 'status-inactive';
  if (status === 'On Leave') statusClass = 'status-on-leave';
  return `<span class="status-badge ${statusClass}">${status}</span>`;
}

/**
 * Generates initial letters for profile avatar.
 */
function getInitials(name) {
  if (!name) return 'L';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
}


// --- 3. FORM VALIDATION ENGINE ---

/**
 * Validates a form against constraints.
 * Shows inline error messages.
 */
function validateLabourForm(formEl) {
  let isValid = true;
  formEl.querySelectorAll('.form-control').forEach(input => input.classList.remove('is-invalid'));

  const valueOf = id => {
    const el = formEl.querySelector('#' + id);
    return el ? el.value.trim() : '';
  };
  const mark = (id, message) => {
    const el = formEl.querySelector('#' + id);
    if (el) { setError(el, message); isValid = false; }
  };

  const name=valueOf('name'), labourId=valueOf('labourId');
  const phone=valueOf('phone').replace(/\D/g,'');
  const email=valueOf('email'), experience=valueOf('experience');
  const dob=valueOf('dob'), joiningDate=valueOf('joiningDate');
  const emergencyContact=valueOf('emergencyContact');
  const emergencyPhone=valueOf('emergencyPhone').replace(/\D/g,'');

  if (!name) mark('name','Please enter the labour name.');
  if (!labourId) mark('labourId','Please enter a valid Labour ID.');
  if (!/^\d{10}$/.test(phone)) mark('phone','Please enter a valid 10-digit phone number.');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) mark('email','Please enter a valid email address.');
  if (experience === '' || !/^\d+(?:\.\d+)?$/.test(experience) || Number(experience)<0 || Number(experience)>40) {
    mark('experience','Please enter valid years of experience (0–40).');
  }
  if (!dob) mark('dob','Please select the date of birth.');
  else if (new Date(dob+'T00:00:00') > new Date()) mark('dob','Date of birth cannot be in the future.');
  if (!joiningDate) mark('joiningDate','Please select the joining date.');

  // Emergency contact is optional. If one field is supplied, validate both supplied values.
  if (emergencyContact || emergencyPhone) {
    if (!emergencyContact) mark('emergencyContact','Please enter the emergency contact name or leave both fields blank.');
    if (!/^\d{10}$/.test(emergencyPhone)) mark('emergencyPhone','Please enter a valid 10-digit emergency phone number.');
  }
  return isValid;
}

function setError(inputEl, msg) {
  inputEl.classList.add('is-invalid');
  const parent = inputEl.closest('.form-group');
  if (parent) {
    let errEl = parent.querySelector('.error-message');
    if (!errEl) {
      errEl = document.createElement('div');
      errEl.className = 'error-message';
      parent.appendChild(errEl);
    }
    errEl.textContent = msg;
    errEl.style.display = 'block';
  }
}


// --- 4. THEME & DATA MANAGEMENT HELPERS ---

const THEME_STORAGE_KEY = 'skilliantTheme';
const SETTINGS_STORAGE_KEY = 'skilliantPortalSettings';
const PROFILE_STORAGE_KEY = 'skilliantProfile';

const DEFAULT_PORTAL_SETTINGS = {
  language: 'English',
  dateFormat: 'DD MMM YYYY',
  notifications: {
    payments: true,
    labour: true,
    projects: true
  }
};

function getPortalSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || 'null');
    return {
      ...DEFAULT_PORTAL_SETTINGS,
      ...(saved || {}),
      notifications: {
        ...DEFAULT_PORTAL_SETTINGS.notifications,
        ...((saved && saved.notifications) || {})
      }
    };
  } catch (e) {
    return JSON.parse(JSON.stringify(DEFAULT_PORTAL_SETTINGS));
  }
}

function savePortalSettings(settings) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

function formatPortalDate(date = new Date(), format = getPortalSettings().dateFormat) {
  const d = new Date(date);
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
  const day = String(d.getDate()).padStart(2, '0');
  const monthShort = d.toLocaleDateString('en-US', { month: 'short' });
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  if (format === 'MM/DD/YYYY') return `${weekday}, ${month}/${day}/${year}`;
  if (format === 'YYYY-MM-DD') return `${weekday}, ${year}-${month}-${day}`;
  return `${weekday}, ${day} ${monthShort} ${year}`;
}

function applyPortalDateFormat() {
  const date = document.getElementById('currentDateText');
  if (date) date.textContent = formatPortalDate();
}

function applyTheme(theme) {
  const selectedTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', selectedTheme);
  localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);

  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.setAttribute('aria-label', selectedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.setAttribute('title', selectedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.innerHTML = selectedTheme === 'dark'
      ? '<span class="theme-toggle-icon" aria-hidden="true">☀</span>'
      : '<span class="theme-toggle-icon" aria-hidden="true">☾</span>';
  }

  document.querySelectorAll('[data-theme-choice]').forEach(btn => {
    btn.classList.toggle('selected', btn.getAttribute('data-theme-choice') === selectedTheme);
  });
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  applyTheme(savedTheme);

  const toggle = document.getElementById('themeToggle');
  if (toggle && !toggle.dataset.bound) {
    toggle.dataset.bound = '1';
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      if (window.skilliantLogActivity) window.skilliantLogActivity('Appearance changed', `Portal theme changed to ${nextTheme === 'dark' ? 'Dark' : 'Light'} mode.`);
    });
  }

  document.querySelectorAll('[data-theme-choice]').forEach(btn => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme-choice');
      applyTheme(theme);
      const settings = getPortalSettings();
      settings.theme = theme;
      savePortalSettings(settings);
    });
  });
}

function getProfileData() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || 'null') || {
      name: 'SHRUTI SHRIVASTAVA',
      username: 'shruti123',
      email: 'shrutishrivastava234'
    };
  } catch (e) {
    return {
      name: 'SHRUTI SHRIVASTAVA',
      username: 'shruti123',
      email: 'shrutishrivastava234'
    };
  }
}

function applyProfileToHeader() {
  const profile = getProfileData();
  const name = profile.name || 'SHRUTI SHRIVASTAVA';
  const headerName = document.querySelector('.user-name');
  const headerAvatar = document.querySelector('.user-avatar');
  const profileName = document.querySelector('.profile-summary h3');

  if (headerName) headerName.textContent = name;
  if (headerAvatar) headerAvatar.textContent = getInitials(name);
  if (profileName) profileName.textContent = name;
}

function initNotificationPanel() {
  const button = document.getElementById('headerNotificationBtn');
  if (!button || button.dataset.bound) return;

  button.dataset.bound = '1';
  let panel = document.getElementById('notificationPanel');

  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'notificationPanel';
    panel.className = 'notification-panel';
    panel.hidden = true;
    button.parentElement.appendChild(panel);
  }

  const renderPanel = () => {
    const settings = getPortalSettings();
    const items = [
      settings.notifications.payments ? ['Payment notifications', 'Payment updates are enabled.'] : null,
      settings.notifications.labour ? ['Labour updates', 'Labour record updates are enabled.'] : null,
      settings.notifications.projects ? ['Project updates', 'Project and attendance updates are enabled.'] : null
    ].filter(Boolean);

    panel.innerHTML = `
      <div class="notification-panel-title">Notifications</div>
      ${items.length
        ? items.map(item => `<div class="notification-panel-item"><span class="notification-panel-dot"></span><div><strong>${item[0]}</strong><span>${item[1]}</span></div></div>`).join('')
        : '<div class="notification-panel-item"><div><strong>No notifications enabled</strong><span>Notification preferences are currently off.</span></div></div>'}
    `;
  };

  renderPanel();

  button.addEventListener('click', event => {
    event.stopPropagation();
    renderPanel();
    panel.hidden = !panel.hidden;
    button.setAttribute('aria-expanded', String(!panel.hidden));
  });

  document.addEventListener('click', event => {
    if (!panel.hidden && !panel.contains(event.target) && event.target !== button) {
      panel.hidden = true;
      button.setAttribute('aria-expanded', 'false');
    }
  });
}

function deleteAllLabourRecords() {
  const list = getLabourData();
  if (!list.length) {
    showToast('There are no labour records to delete.', 'danger');
    return;
  }

  const confirmed = window.confirm(`Delete all ${list.length} labour records? This action cannot be undone.`);
  if (!confirmed) return;

  saveLabourData([]);
  if (window.skilliantLogActivity) window.skilliantLogActivity('All labour deleted', `All ${list.length} labour records were deleted.`);
  showToast('All labour records deleted successfully.');
  setTimeout(() => { if (typeof navigate === 'function') navigate('labour'); }, 450);
}



// ===== SINGLE INDEX PAGE ROUTER =====
const PAGE_TITLES={
  dashboard:'Contractor Dashboard', labour:'Labour Management', 'add-labour':'Add New Labour',
  'edit-labour':'Edit Labour', 'labour-details':'Labour Details', projects:'Projects', wallet:'Wallet',
  reports:'Reports', company:'Company', documents:'Documents', notifications:'Notifications', settings:'Settings', help:'Help Center'
};

function routeParts(){
  const raw=(location.hash||'#dashboard').slice(1);
  const [page,...rest]=raw.split('?');
  return {page:page||'dashboard', params:new URLSearchParams(rest.join('?'))};
}

function navigate(page,id){
  let hash='#'+page;
  if(id) hash+='?id='+encodeURIComponent(id);
  if(location.hash===hash) renderRoute(); else location.hash=hash;
}

function updateHeader(page){
  const title=document.querySelector('.header-title-box h1');
  if(title) title.textContent=PAGE_TITLES[page]||'Contractor Portal';
  const profile=document.querySelector('.user-profile[data-route="settings"]');
  if(profile){profile.onclick=()=>navigate('settings');}
}

function activatePage(page){
  document.querySelectorAll('.spa-page').forEach(s=>s.classList.toggle('active',s.dataset.page===page));
  document.querySelectorAll('.nav-link').forEach(a=>{
    const href=(a.getAttribute('href')||'').replace('#','');
    a.classList.toggle('active',href===page);
  });
  updateHeader(page);
  const sidebar=document.getElementById('sidebar'),overlay=document.getElementById('sidebarOverlay');
  if(sidebar) sidebar.classList.remove('mobile-open'); if(overlay) overlay.classList.remove('mobile-open');
}

function initDashboard(){
  const stats=calculateStats();
  const total=document.getElementById('statTotalLabour'); if(total) total.textContent=stats.total;
  const active=document.getElementById('statActiveLabour'); if(active) active.textContent=stats.active;
  const pct=document.getElementById('statActivePercentage'); if(pct) pct.textContent=(stats.total?Math.round(stats.active/stats.total*100):0)+'%';

  // Keep the dashboard project count synchronized with the actual project data.
  const activeProjectCount=PROJECTS.filter(p=>p.status==='Active').length;
  const activeProjects=document.getElementById('statActiveProjects');
  if(activeProjects) activeProjects.textContent=activeProjectCount;

  const labour=getLabourData();
  const tbody=document.getElementById('recentLabourTbody');
  if(tbody){
    const list=labour.slice(0,5);
    tbody.innerHTML=list.length?list.map(item=>`<tr><td><div class="labour-cell"><div class="avatar-sm">${getInitials(item.name)}</div><div class="labour-name-box"><span class="labour-name">${esc(item.name)}</span><span class="labour-id-sub">${esc(item.id)}</span></div></div></td><td><span style="font-weight:600;color:var(--text-main);">${esc(item.skill)}</span></td><td>${getStatusBadgeHtml(item.status)}</td><td>${esc(item.joiningDate||'N/A')}</td><td><a href="#labour-details?id=${encodeURIComponent(item.id)}" class="btn btn-secondary btn-sm">View Details</a></td></tr>`).join(''):`<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:20px;">No recent labour records found.</td></tr>`;
  }

  const inactiveProjectsTbody=document.getElementById('inactiveProjectsTbody');
  if(inactiveProjectsTbody){
    const inactiveProjects=PROJECTS.filter(p=>p.status==='Inactive');
    inactiveProjectsTbody.innerHTML=inactiveProjects.length
      ? inactiveProjects.map(p=>`<tr><td><strong>${esc(p.name)}</strong></td><td>${esc(p.location)}</td><td>${getStatusBadgeHtml(p.status)}</td></tr>`).join('')
      : `<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:20px;">No inactive projects found.</td></tr>`;
  }

  const inactiveLabourTbody=document.getElementById('inactiveLabourTbody');
  if(inactiveLabourTbody){
    const inactiveLabour=labour.filter(l=>l.status==='Inactive');
    inactiveLabourTbody.innerHTML=inactiveLabour.length
      ? inactiveLabour.map(l=>`<tr><td><div class="labour-cell"><div class="avatar-sm">${getInitials(l.name)}</div><div class="labour-name-box"><span class="labour-name">${esc(l.name)}</span><span class="labour-id-sub">${esc(l.id)}</span></div></div></td><td>${esc(l.skill)}</td><td>${getStatusBadgeHtml(l.status)}</td></tr>`).join('')
      : `<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:20px;">No inactive labour found.</td></tr>`;
  }
}

function initLabour(){
  const search=document.getElementById('searchInput'),status=document.getElementById('statusFilter'),skill=document.getElementById('skillFilter'),body=document.getElementById('labourTableBody'),empty=document.getElementById('emptyStateContainer');
  if(!search||!status||!skill||!body||!empty)return;
  const params=routeParts().params; if(params.get('search')) search.value=params.get('search');
  const render=()=>{
    const all=getLabourData(),q=search.value.trim().toLowerCase(),sv=status.value,kv=skill.value;
    const list=all.filter(x=>(!q||[x.name,x.id,x.skill,x.phone].some(v=>(v||'').toLowerCase().includes(q)))&&(sv==='All'||x.status===sv)&&(kv==='All'||x.skill===kv));
    if(!list.length){body.innerHTML='';empty.style.display='block';document.getElementById('emptyTitle').textContent=all.length?'No Labour Found':'No Labour Records';document.getElementById('emptyDesc').textContent=all.length?'Try changing your search keywords or filter criteria.':"You haven't added any labour records yet. Click below to add your first worker.";return;}
    empty.style.display='none';
    body.innerHTML=list.map(x=>`<tr><td><div class="labour-cell"><div class="avatar-sm">${getInitials(x.name)}</div><div class="labour-name-box"><span class="labour-name">${x.name}</span><span class="labour-id-sub">${x.id}</span></div></div></td><td><span style="font-weight:600;">${x.skill}</span></td><td>${x.phone||'N/A'}</td><td>${x.city?`${x.city}, ${x.state||''}`:(x.address||'N/A')}</td><td>${getStatusBadgeHtml(x.status)}</td><td>${x.joiningDate||'N/A'}</td><td style="text-align:right"><div class="action-buttons" style="justify-content:flex-end"><a href="#labour-details?id=${encodeURIComponent(x.id)}" class="icon-action-btn" title="View Details">◉</a><a href="#edit-labour?id=${encodeURIComponent(x.id)}" class="icon-action-btn" title="Edit Labour">✎</a><button type="button" class="icon-action-btn delete-btn" onclick="handleDeleteClick('${x.id}','${x.name.replace(/'/g,"\\'")}')">🗑</button></div></td></tr>`).join('');
  };
  search.oninput=render; status.onchange=render; skill.onchange=render; window.handleDeleteClick=(id,name)=>showDeleteModal(id,name,()=>{deleteLabour(id);if(window.skilliantLogActivity) window.skilliantLogActivity('Labour deleted', `${name} (${id}) was deleted.`);showToast('✓ Labour deleted successfully','success');render();}); render();
}

function initAddLabour(){
  const form=document.getElementById('addLabourForm');
  if(!form)return;

  // Always start a NEW labour registration with a clean form.
  // This prevents values from a previous add/edit session from leaking
  // into the next registration while preserving the existing UI.
  form.reset();
  form.querySelectorAll('.is-invalid').forEach(el=>el.classList.remove('is-invalid'));
  form.querySelectorAll('.error-message').forEach(el=>el.style.display='none');
  form.querySelectorAll('.form-control').forEach(input=>{
    if(!input.dataset.validationBound){
      input.dataset.validationBound='1';
      input.addEventListener('input',()=>input.classList.remove('is-invalid'));
      input.addEventListener('change',()=>input.classList.remove('is-invalid'));
    }
  });

  const data=getLabourData();
  const existingIds=new Set(data.map(item=>String(item.id).toUpperCase()));
  let nextNumber=data.length+1;
  let nextId=`LAB${String(nextNumber).padStart(3,'0')}`;
  while(existingIds.has(nextId.toUpperCase())){
    nextNumber++;
    nextId=`LAB${String(nextNumber).padStart(3,'0')}`;
  }

  const id=form.querySelector('#labourId');
  if(id) id.value=nextId;

  const join=form.querySelector('#joiningDate');
  const dob=form.querySelector('#dob');
  const experience=form.querySelector('#experience');
  const city=form.querySelector('#city');
  const state=form.querySelector('#state');

  if(join) join.value=new Date().toISOString().split('T')[0];
  if(dob) dob.value='1996-05-15';
  if(experience && !experience.value) experience.value='3';
  if(city && !city.value) city.value='Pune';
  if(state && !state.value) state.value='Maharashtra';

  // Rebind every time the SPA enters this route.
  form.onsubmit=e=>{
    e.preventDefault();
    if(form.dataset.saving==='1') return;
    if(!validateLabourForm(form)){
      const firstInvalid=form.querySelector('.form-control.is-invalid');
      if(firstInvalid) firstInvalid.focus();
      showToast('Please fix the highlighted fields before submitting.','danger');
      return;
    }
    form.dataset.saving='1';

    const v=s=>{
      const el=form.querySelector('#'+s);
      return el ? el.value.trim() : '';
    };

    const newLabour={
      id:v('labourId'),
      name:v('name'),
      phone:v('phone'),
      email:v('email')||`${v('name').toLowerCase().replace(/\s+/g,'.')}@example.com`,
      gender:form.querySelector('#gender')?.value||'Male',
      dob:form.querySelector('#dob')?.value||'',
      skill:form.querySelector('#skill')?.value||'Mason',
      experience:Number(form.querySelector('#experience')?.value||0),
      address:v('address')||'Shivaji Nagar',
      city:v('city')||'Pune',
      state:v('state')||'Maharashtra',
      joiningDate:form.querySelector('#joiningDate')?.value||new Date().toISOString().split('T')[0],
      status:form.querySelector('#status')?.value||'Active',
      emergencyContact:v('emergencyContact'),
      emergencyPhone:v('emergencyPhone')
    };

    // Guard against duplicate IDs.
    if(getLabourById(newLabour.id)){
      form.dataset.saving='0';
      showToast(`Labour ID ${newLabour.id} already exists. Please use another ID.`,'danger');
      return;
    }

    addLabour(newLabour);
    if(window.skilliantLogActivity) window.skilliantLogActivity('Labour added', `${newLabour.name} (${newLabour.id}) was added.`);
    showToast(`✓ ${newLabour.name} added successfully`,'success');
    setTimeout(()=>navigate('labour'),500);
  };
}

function initEditLabour(id){
  const form=document.getElementById('editLabourForm');
  if(!form)return;

  // Always resolve the CURRENT route ID from LocalStorage.
  // Do not reuse a previous submit handler/record when moving
  // directly from one edit route to another in the SPA.
  const currentId=String(id||'').trim();
  const record=getLabourById(currentId);

  if(!record){
    showToast('Labour record not found.','danger');
    navigate('labour');
    return;
  }

  // Clear any stale values first, then populate from the selected record.
  form.reset();
  form.querySelectorAll('.is-invalid').forEach(el=>el.classList.remove('is-invalid'));
  form.querySelectorAll('.error-message').forEach(el=>el.style.display='none');

  const set=(k,v)=>{
    const el=form.querySelector('#'+k);
    if(el) el.value=(v===null||v===undefined)?'':String(v);
  };

  set('labourId',record.id);
  set('name',record.name);
  set('phone',record.phone);
  set('email',record.email);
  set('gender',record.gender||'Male');
  set('dob',record.dob||'1995-01-01');
  set('skill',record.skill||'Mason');
  set('experience',record.experience??3);
  set('address',record.address||'');
  set('city',record.city||'Pune');
  set('state',record.state||'Maharashtra');
  set('joiningDate',record.joiningDate||'2024-01-01');
  set('status',record.status||'Active');
  set('emergencyContact',record.emergencyContact||'');
  set('emergencyPhone',record.emergencyPhone||'');

  // IMPORTANT: always replace the handler so each selected labour
  // is saved to its own ID rather than the previously edited labour.
  form.onsubmit=e=>{
    e.preventDefault();

    if(form.dataset.saving==='1') return;
    if(!validateLabourForm(form)){
      const firstInvalid=form.querySelector('.form-control.is-invalid');
      if(firstInvalid) firstInvalid.focus();
      showToast('Please fix the highlighted fields before saving.','danger');
      return;
    }
    form.dataset.saving='1';

    const v=s=>{
      const el=form.querySelector('#'+s);
      return el ? el.value.trim() : '';
    };

    const updated={
      id:record.id,
      name:v('name'),
      phone:v('phone'),
      email:v('email'),
      gender:form.querySelector('#gender')?.value||record.gender||'Male',
      dob:form.querySelector('#dob')?.value||record.dob||'',
      skill:form.querySelector('#skill')?.value||record.skill||'Mason',
      experience:Number(form.querySelector('#experience')?.value||0),
      address:v('address'),
      city:v('city'),
      state:v('state'),
      joiningDate:form.querySelector('#joiningDate')?.value||record.joiningDate||'',
      status:form.querySelector('#status')?.value||record.status||'Active',
      emergencyContact:v('emergencyContact'),
      emergencyPhone:v('emergencyPhone')
    };

    const saved=updateLabour(updated);

    if(!saved){
      form.dataset.saving='0';
      showToast('Unable to save labour details. Please try again.','danger');
      return;
    }

    if(window.skilliantLogActivity) window.skilliantLogActivity('Labour updated', `${updated.name} (${updated.id}) was updated.`);
    showToast(`✓ ${updated.name} updated successfully`,'success');
    setTimeout(()=>navigate('labour'),500);
  };
}

function initDetails(id){
  const record=getLabourById(id); if(!record){showToast('Labour record not found. Returning to Labour List.','danger');navigate('labour');return;}
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
  const html=(id,v)=>{const el=document.getElementById(id);if(el)el.innerHTML=v};
  const link=document.getElementById('editBtnLink');if(link)link.href='#edit-labour?id='+encodeURIComponent(record.id);
  set('avatarBox',getInitials(record.name));set('displayName',record.name);set('displayId',record.id);html('displayStatusBadge',getStatusBadgeHtml(record.status));set('displaySkill',record.skill);
  set('valName',record.name);set('valId',record.id);set('valGender',record.gender||'N/A');set('valDob',record.dob||'N/A');set('valPhone',record.phone||'N/A');set('valEmail',record.email||'N/A');set('valAddress',record.address||'N/A');set('valCityState',`${record.city||''}, ${record.state||''}`);set('valSkill',record.skill||'N/A');set('valExperience',`${record.experience||0} Years`);set('valJoiningDate',record.joiningDate||'N/A');set('valStatus',record.status||'N/A');set('valEmgContact',record.emergencyContact||'N/A');set('valEmgPhone',record.emergencyPhone||'N/A');
}


const PROJECTS = [
  { id:'PRJ001', name:'Metro Line 4 - Station 12', location:'Kothrud, Pune', status:'Active' },
  { id:'PRJ002', name:'Verdana Luxury Towers', location:'Baner, Pune', status:'Active' },
  { id:'PRJ004', name:'Shivajinagar Commercial Complex', location:'Shivajinagar, Pune', status:'Active' },
  { id:'PRJ005', name:'Hinjewadi IT Park Phase 3', location:'Hinjewadi, Pune', status:'Active' },
  { id:'PRJ006', name:'Kharadi Business District', location:'Kharadi, Pune', status:'Active' },
  { id:'PRJ007', name:'Wakad Residential Development', location:'Wakad, Pune', status:'Active' },
  { id:'PRJ008', name:'Hadapsar Logistics Hub', location:'Hadapsar, Pune', status:'Active' },
  { id:'PRJ009', name:'Aundh Road Improvement', location:'Aundh, Pune', status:'Active' },
  { id:'PRJ010', name:'Pune Airport Expansion Support', location:'Viman Nagar, Pune', status:'Active' },
  { id:'PRJ011', name:'Magarpatta Infrastructure Works', location:'Magarpatta, Pune', status:'Active' },
  { id:'PRJ012', name:'Baner Road Commercial Plaza', location:'Baner, Pune', status:'Active' },
  { id:'PRJ013', name:'Katraj Residential Towers', location:'Katraj, Pune', status:'Active' },
  { id:'PRJ003', name:'Pimpri Flyover Extension', location:'Pimpri, Pune', status:'Planning' },
  { id:'PRJ014', name:'Swargate Commercial Renovation', location:'Swargate, Pune', status:'Inactive' },
  { id:'PRJ015', name:'Balewadi Residential Phase 1', location:'Balewadi, Pune', status:'Inactive' }
];

const ATTENDANCE_STORAGE_KEY = 'skilliantAttendance';

function getAttendanceState() {
  try {
    const saved = JSON.parse(localStorage.getItem(ATTENDANCE_STORAGE_KEY) || '{}');
    return saved && typeof saved === 'object' ? saved : {};
  } catch (e) {
    return {};
  }
}

function saveAttendanceState(state) {
  localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(state));
}

function attendanceKey(labourId) {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}:${labourId}`;
}

function isPresentToday(labour) {
  const state = getAttendanceState();
  const key = attendanceKey(labour.id);
  return Object.prototype.hasOwnProperty.call(state, key)
    ? state[key] === true
    : labour.status === 'Active';
}

function setAttendanceToday(labourId, present) {
  const state = getAttendanceState();
  state[attendanceKey(labourId)] = !!present;
  saveAttendanceState(state);
}

function renderProjectList() {
  const list = document.querySelector('#page-projects .project-list');
  if (!list) return;
  list.innerHTML = PROJECTS.map(p => `
    <div class="project-row">
      <div>
        <strong>${p.name}</strong>
        <span>${p.location} · ${p.status}</span>
      </div>
      <span class="status-badge ${p.status === 'Active' ? 'status-active' : (p.status === 'Planning' ? 'status-on-leave' : 'status-inactive')}">${p.status}</span>
    </div>
  `).join('');

  const select = document.getElementById('projectSelect');
  if (select) {
    select.innerHTML = PROJECTS.map(p =>
      `<option value="${p.id}">${p.name}</option>`
    ).join('');
  }

  const statValues = document.querySelectorAll('#page-projects .stats-grid .stat-value');
  const activeCount = PROJECTS.filter(p => p.status === 'Active').length;
  const plannedCount = PROJECTS.filter(p => p.status === 'Planning').length;
  if (statValues[0]) statValues[0].textContent = activeCount;
  if (statValues[1]) statValues[1].textContent = plannedCount;
}

function initProjects(){
  const data=getLabourData();
  const ls=document.getElementById('labourSelect');
  const team=document.getElementById('teamBody');
  const att=document.getElementById('attendanceBody');
  if(!ls||!team||!att)return;

  renderProjectList();

  ls.innerHTML=data.map(l=>`<option value="${l.id}">${l.name} (${l.skill})</option>`).join('');

  team.innerHTML=data.length
    ? data.map((l,i)=>`<tr><td>${esc(l.name)}</td><td>${esc(l.skill)}</td><td>${i%2?'Verdana Luxury Towers':'Metro Line 4 - Station 12'}</td><td>${getStatusBadgeHtml(l.status)}</td></tr>`).join('')
    : `<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:20px;">No labour records found.</td></tr>`;

  // Each checkbox has its own persisted state. Updating one worker never rebuilds the table.
  att.innerHTML=data.length
    ? data.map(l=>`<tr>
        <td>${esc(l.name)}</td>
        <td>${esc(l.skill)}</td>
        <td>
          <label style="display:inline-flex;align-items:center;gap:8px">
            <input type="checkbox" class="attendance-toggle" data-labour-id="${esc(l.id)}" ${isPresentToday(l)?'checked':''}>
            Present
          </label>
        </td>
      </tr>`).join('')
    : `<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:20px;">No labour records found.</td></tr>`;

  att.querySelectorAll('.attendance-toggle').forEach(input=>{
    input.addEventListener('change',()=>{
      setAttendanceToday(input.dataset.labourId,input.checked);
      showToast(`${input.checked?'Present':'Absent'} attendance saved`);
    });
  });

  const form=document.getElementById('assignForm');
  if(form&&!form.dataset.bound){
    form.dataset.bound='1';
    form.onsubmit=e=>{
      e.preventDefault();
      const projectId=document.getElementById('projectSelect')?.value;
      const labourId=document.getElementById('labourSelect')?.value;
      const project=PROJECTS.find(p=>p.id===projectId);
      const labour=data.find(l=>l.id===labourId);
      if(project&&labour){
        showToast(`${labour.name} assigned to ${project.name}`);
      }
    };
  }
}


const DOCUMENTS_STORAGE_KEY = 'skilliantCompanyDocuments';

function getDocuments(){
  try{
    const value = JSON.parse(localStorage.getItem(DOCUMENTS_STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  }catch(e){ return []; }
}
function saveDocuments(items){
  try{
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(items));
    return true;
  }catch(e){
    console.error('Unable to save documents:',e);
    return false;
  }
}
function formatBytes(bytes){
  if(!bytes) return '—';
  if(bytes < 1024) return `${bytes} B`;
  if(bytes < 1024*1024) return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/1024/1024).toFixed(1)} MB`;
}
function renderDocuments(){
  const body=document.getElementById('documentsTableBody');
  const empty=document.getElementById('documentsEmpty');
  if(!body)return;
  const docs=getDocuments();
  if(!docs.length){
    body.innerHTML='';
    if(empty)empty.style.display='block';
    return;
  }
  if(empty)empty.style.display='none';
  body.innerHTML=docs.map(d=>`
    <tr>
      <td><strong>${esc(d.name)}</strong></td>
      <td>${esc(d.category||'Company')}</td>
      <td>${esc(d.uploaded||'')}</td>
      <td>${esc(formatBytes(d.size))}</td>
      <td><span class="status-badge status-active">${esc(d.status||'Stored')}</span></td>
      <td>
        <div class="document-action-group">
          ${d.dataUrl ? `<button type="button" class="btn btn-secondary btn-sm" data-doc-view="${esc(d.id)}">View</button>` : ''}
          <button type="button" class="btn btn-danger-outline btn-sm" data-doc-delete="${esc(d.id)}">Delete</button>
        </div>
      </td>
    </tr>`).join('');
}
function initDocuments(){
  renderDocuments();
  const add=document.getElementById('addDocumentBtn');
  if(add && !add.dataset.bound){
    add.dataset.bound='1';
    add.onclick=()=>{
      const modal=document.createElement('div');
      modal.className='modal-backdrop';
      modal.innerHTML=`<div class="modal-card" style="max-width:620px">
        <h3 class="modal-title">Add Company Document</h3>
        <form id="documentForm">
          <div class="form-group"><label for="documentName">Document Name</label><input id="documentName" class="form-control" required placeholder="e.g. GST Certificate"></div>
          <div class="form-group"><label for="documentCategory">Category</label>
            <select id="documentCategory" class="form-control">
              <option>Registration</option><option>Tax</option><option>Compliance</option><option>Contract</option><option>Insurance</option><option>Other</option>
            </select>
          </div>
          <div class="form-group"><label for="documentFile">File</label><input id="documentFile" class="form-control" type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx" required></div>
          <div class="modal-actions"><button type="button" class="btn btn-secondary" id="documentCancel">Cancel</button><button type="submit" class="btn btn-primary">Save Document</button></div>
        </form>
      </div>`;
      document.body.appendChild(modal);
      modal.querySelector('#documentCancel').onclick=()=>modal.remove();
      modal.querySelector('#documentForm').onsubmit=e=>{
        e.preventDefault();
        const name=modal.querySelector('#documentName').value.trim();
        const category=modal.querySelector('#documentCategory').value;
        const file=modal.querySelector('#documentFile').files[0];
        if(!name || !file){showToast('Please provide a document name and file.','danger');return;}
        if(file.size > 2*1024*1024){
          showToast('Maximum document size is 2 MB for browser storage.','danger');
          return;
        }
        const reader=new FileReader();
        reader.onerror=()=>showToast('Unable to read the selected document.','danger');
        reader.onload=()=>{
          const docs=getDocuments();
          const item={
            id:'DOC'+Date.now()+Math.random().toString(36).slice(2,7),
            name,
            category,
            size:file.size,
            type:file.type || 'application/octet-stream',
            dataUrl:reader.result,
            uploaded:new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}),
            status:'Stored'
          };
          const next=[item,...docs];
          if(!saveDocuments(next)){
            showToast('Document could not be saved. The browser storage limit has been reached. Remove an older document and try again.','danger');
            return;
          }
          if(window.skilliantLogActivity)window.skilliantLogActivity('Document added',`${name} was added to company documents.`);
          modal.remove();
          renderDocuments();
          showToast('Document added successfully.');
        };
        reader.readAsDataURL(file);
      };
    };
  }
  const body=document.getElementById('documentsTableBody');
  if(body && !body.dataset.bound){
    body.dataset.bound='1';
    body.addEventListener('click',e=>{
      const view=e.target.closest('[data-doc-view]');
      const del=e.target.closest('[data-doc-delete]');
      const docs=getDocuments();
      if(view){
        const d=docs.find(x=>x.id===view.dataset.docView);
        if(d && d.dataUrl){
          const a=document.createElement('a');a.href=d.dataUrl;a.target='_blank';a.rel='noopener';a.click();
          if(window.skilliantLogActivity)window.skilliantLogActivity('Document viewed',`${d.name} was opened.`);
        }
      }
      if(del){
        const d=docs.find(x=>x.id===del.dataset.docDelete);
        if(!d)return;
        if(confirm(`Delete ${d.name}?`)){
          saveDocuments(docs.filter(x=>x.id!==d.id));
          if(window.skilliantLogActivity)window.skilliantLogActivity('Document deleted',`${d.name} was removed.`);
          renderDocuments();showToast('Document deleted.');
        }
      }
    });
  }
}
function initNotificationsPage(){
  const list=document.getElementById('notificationsList');
  const count=document.getElementById('notificationCountLabel');
  if(!list)return;

  // The portal's newer activity layer stores notifications in
  // skilliant_activity_log_v2. Keep the legacy key as a fallback so
  // existing demo data is not lost.
  let items=[];
  try{
    if(typeof activities==='function'){
      items=activities();
    }else{
      items=JSON.parse(localStorage.getItem('skilliant_activity_log_v2')||'[]');
      if(!Array.isArray(items)||!items.length){
        const legacy=JSON.parse(localStorage.getItem('skilliantActivityLog')||'[]');
        if(Array.isArray(legacy))items=legacy;
      }
    }
  }catch(e){items=[];}
  if(!Array.isArray(items))items=[];

  if(count)count.textContent=`${items.length} notification${items.length===1?'':'s'}`;
  list.innerHTML=items.length
    ? items.map(a=>`
      <div class="notification-page-item">
        <span class="notification-page-dot"></span>
        <div><strong>${esc(a.title||'Portal activity')}</strong><span>${esc(a.detail||'')}<br>${dateLabel(a.time)}</span></div>
      </div>`).join('')
    : '<div class="notification-page-empty">No notifications yet. Portal changes will appear here.</div>';

  const clear=document.getElementById('clearNotificationsPageBtn');
  if(clear && !clear.dataset.bound){
    clear.dataset.bound='1';
    clear.onclick=()=>{
      if(!confirm('Clear all notifications?'))return;
      try{
        if(typeof write==='function' && typeof K!=='undefined' && K.activities){
          write(K.activities,[]);
        }
        localStorage.setItem('skilliant_activity_log_v2','[]');
        localStorage.setItem('skilliantActivityLog','[]');
      }catch(e){}
      if(typeof window.refreshNotificationPanel==='function')window.refreshNotificationPanel();
      initNotificationsPage();
      showToast('Notifications cleared.');
    };
  }
}

function initReports(){const s=calculateStats();const a=document.getElementById('totalLabour');if(a)a.textContent=s.total;const b=document.getElementById('activeLabour');if(b)b.textContent=s.active;const c=document.getElementById('leaveLabour');if(c)c.textContent=s.onLeave;const r=document.getElementById('skillReport');if(r){const counts={};getLabourData().forEach(l=>counts[l.skill]=(counts[l.skill]||0)+1);r.innerHTML=Object.entries(counts).map(([k,v])=>`<div><span>${k}</span><b>${v} workers</b></div>`).join('');}}

function initSettings(){
  const settings = getPortalSettings();
  const save = document.getElementById('saveSettings');
  const language = document.getElementById('language');
  const dateFormat = document.getElementById('dateFormat');
  const paymentNotifications = document.getElementById('paymentNotifications');
  const labourNotifications = document.getElementById('labourNotifications');
  const projectNotifications = document.getElementById('projectNotifications');

  if (language) language.value = settings.language || 'English';
  if (dateFormat) dateFormat.value = settings.dateFormat || 'DD MMM YYYY';
  if (paymentNotifications) paymentNotifications.checked = settings.notifications.payments !== false;
  if (labourNotifications) labourNotifications.checked = settings.notifications.labour !== false;
  if (projectNotifications) projectNotifications.checked = settings.notifications.projects !== false;

  if (save && !save.dataset.bound) {
    save.dataset.bound = '1';
    save.onclick = () => {
      const next = getPortalSettings();
      next.language = language ? language.value : next.language;
      next.dateFormat = dateFormat ? dateFormat.value : next.dateFormat;
      next.notifications = {
        payments: paymentNotifications ? paymentNotifications.checked : next.notifications.payments,
        labour: labourNotifications ? labourNotifications.checked : next.notifications.labour,
        projects: projectNotifications ? projectNotifications.checked : next.notifications.projects
      };
      savePortalSettings(next);
      applyPortalDateFormat();
          showToast('Settings saved successfully');
    };
  }

  [paymentNotifications, labourNotifications, projectNotifications].forEach(input => {
    if (!input || input.dataset.bound) return;
    input.dataset.bound = '1';
    input.addEventListener('change', () => {
      const next = getPortalSettings();
      next.notifications = {
        payments: paymentNotifications ? paymentNotifications.checked : next.notifications.payments,
        labour: labourNotifications ? labourNotifications.checked : next.notifications.labour,
        projects: projectNotifications ? projectNotifications.checked : next.notifications.projects
      };
      savePortalSettings(next);
    });
  });

  const del = document.getElementById('deleteAllLabourBtn');
  if(del && !del.dataset.bound){
    del.dataset.bound='1';
    del.onclick=deleteAllLabourRecords;
  }

  const pn=document.getElementById('profileName');
  const pu=document.getElementById('profileUsername');
  const pe=document.getElementById('profileEmail');
  const p=getProfileData();

  if(pn) pn.value=p.name || 'SHRUTI SHRIVASTAVA';
  if(pu) pu.value=p.username || 'shruti123';
  if(pe) pe.value=p.email || 'shrutishrivastava234';

  const saveP=document.getElementById('saveProfile');
  const reset=document.getElementById('resetProfile');

  if(saveP && !saveP.dataset.bound){
    saveP.dataset.bound='1';
    saveP.onclick=()=>{
      const name=(pn?.value || '').trim().toUpperCase();
      const username=(pu?.value || '').trim();
      const email=(pe?.value || '').trim();

      if(!name){
        showToast('Please enter your full name.','danger');
        pn?.focus();
        return;
      }
      if(!username){
        showToast('Please enter your username.','danger');
        pu?.focus();
        return;
      }
      if(!email){
        showToast('Please enter your email ID.','danger');
        pe?.focus();
        return;
      }

      localStorage.setItem(PROFILE_STORAGE_KEY,JSON.stringify({name,username,email}));
      if(pn) pn.value=name;
      applyProfileToHeader();
      if (window.skilliantLogActivity) window.skilliantLogActivity('Profile updated', 'Contractor profile information was saved.');
      showToast('Profile saved successfully');
    };
  }

  if(reset && !reset.dataset.bound){
    reset.dataset.bound='1';
    reset.onclick=()=>{
      const defaults={name:'SHRUTI SHRIVASTAVA',username:'shruti123',email:'shrutishrivastava234'};
      if(pn) pn.value=defaults.name;
      if(pu) pu.value=defaults.username;
      if(pe) pe.value=defaults.email;
      if (window.skilliantLogActivity) window.skilliantLogActivity('Profile reset', 'Profile form was reset to the default values.');
    };
  }

  applyProfileToHeader();
}

function renderRoute(){
  const {page,params}=routeParts();const valid=PAGE_TITLES[page]?page:'dashboard';activatePage(valid);
  if(valid==='dashboard')initDashboard();
  if(valid==='labour')initLabour();
  if(valid==='add-labour')initAddLabour();
  if(valid==='edit-labour')initEditLabour(params.get('id'));
  if(valid==='labour-details')initDetails(params.get('id'));
  if(valid==='projects')initProjects();
  if(valid==='reports')initReports();
  if(valid==='documents')initDocuments();
  if(valid==='notifications')initNotificationsPage();
  if(valid==='settings')initSettings();
}

document.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  const menu=document.getElementById('mobileMenuBtn'),close=document.getElementById('sidebarCloseBtn'),side=document.getElementById('sidebar'),overlay=document.getElementById('sidebarOverlay');
  if(menu)menu.onclick=()=>{side.classList.add('mobile-open');overlay.classList.add('mobile-open')};
  if(close)close.onclick=()=>{side.classList.remove('mobile-open');overlay.classList.remove('mobile-open')};
  if(overlay)overlay.onclick=()=>{side.classList.remove('mobile-open');overlay.classList.remove('mobile-open')};
  applyPortalDateFormat();
  applyProfileToHeader();
  const search=document.getElementById('headerSearchInput');if(search)search.onkeydown=e=>{if(e.key==='Enter'&&search.value.trim())navigate('labour',null),setTimeout(()=>{const s=document.getElementById('searchInput');if(s){s.value=search.value.trim();s.dispatchEvent(new Event('input'));}},0)};
  document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click',()=>{if(side)side.classList.remove('mobile-open');if(overlay)overlay.classList.remove('mobile-open')}));
  document.querySelectorAll('[data-route="settings"]').forEach(x=>x.onclick=()=>navigate('settings'));
  getLabourData();renderRoute();
});
window.addEventListener('hashchange',renderRoute);
