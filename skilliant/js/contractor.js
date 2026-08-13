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

  // Clear previous errors
  formEl.querySelectorAll('.form-control').forEach(input => {
    input.classList.remove('is-invalid');
  });

  const nameInput = formEl.querySelector('#name');
  const idInput = formEl.querySelector('#labourId');
  const phoneInput = formEl.querySelector('#phone');
  const emailInput = formEl.querySelector('#email');
  const expInput = formEl.querySelector('#experience');
  const emgContactInput = formEl.querySelector('#emergencyContact');
  const emgPhoneInput = formEl.querySelector('#emergencyPhone');

  // Name Validation
  if (nameInput && !nameInput.value.trim()) {
    setError(nameInput, 'Please enter the labour name.');
    isValid = false;
  }

  // Labour ID Validation
  if (idInput && !idInput.value.trim()) {
    setError(idInput, 'Please enter a valid Labour ID.');
    isValid = false;
  }

  // Phone Validation
  const phoneRegex = /^[0-9]{10}$/;
  if (phoneInput) {
    const pVal = phoneInput.value.replace(/[^0-9]/g, '');
    if (!pVal || pVal.length < 10) {
      setError(phoneInput, 'Please enter a valid 10-digit phone number.');
      isValid = false;
    }
  }

  // Email Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailInput && emailInput.value.trim()) {
    if (!emailRegex.test(emailInput.value.trim())) {
      setError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    }
  }

  // Experience Validation
  if (expInput && (expInput.value === '' || isNaN(expInput.value) || Number(expInput.value) < 0)) {
    setError(expInput, 'Please enter valid years of experience.');
    isValid = false;
  }

  // Emergency Contact Validation
  if (emgContactInput && !emgContactInput.value.trim()) {
    setError(emgContactInput, 'Please enter emergency contact name.');
    isValid = false;
  }
  if (emgPhoneInput) {
    const epVal = emgPhoneInput.value.replace(/[^0-9]/g, '');
    if (!epVal || epVal.length < 10) {
      setError(emgPhoneInput, 'Please enter a valid 10-digit emergency phone number.');
      isValid = false;
    }
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
  }
}


// --- 4. THEME & DATA MANAGEMENT HELPERS ---

const THEME_STORAGE_KEY = 'skilliantTheme';

function applyTheme(theme) {
  const selectedTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', selectedTheme);
  localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);

  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.setAttribute('aria-label', selectedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.setAttribute('title', selectedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.innerHTML = selectedTheme === 'dark'
      ? '<span class="theme-toggle-icon">☀</span><span class="theme-toggle-label">Light</span>'
      : '<span class="theme-toggle-icon">☾</span><span class="theme-toggle-label">Dark</span>';
  }

  document.querySelectorAll('[data-theme-choice]').forEach(btn => {
    btn.classList.toggle('selected', btn.getAttribute('data-theme-choice') === selectedTheme);
  });
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  applyTheme(savedTheme);

  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  document.querySelectorAll('[data-theme-choice]').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.getAttribute('data-theme-choice')));
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
  showToast('All labour records deleted successfully.');
  setTimeout(() => { if (typeof navigate === 'function') navigate('labour'); }, 450);
}



// ===== SINGLE INDEX PAGE ROUTER =====
const PAGE_TITLES={
  dashboard:'Contractor Dashboard', labour:'Labour Management', 'add-labour':'Add New Labour',
  'edit-labour':'Edit Labour', 'labour-details':'Labour Details', projects:'Projects', wallet:'Wallet',
  reports:'Reports', company:'Company', settings:'Settings', help:'Help Center'
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
  const tbody=document.getElementById('recentLabourTbody');
  if(tbody){
    const list=getLabourData().slice(0,5);
    tbody.innerHTML=list.length?list.map(item=>`<tr><td><div class="labour-cell"><div class="avatar-sm">${getInitials(item.name)}</div><div class="labour-name-box"><span class="labour-name">${item.name}</span><span class="labour-id-sub">${item.id}</span></div></div></td><td><span style="font-weight:600;color:var(--text-main);">${item.skill}</span></td><td>${getStatusBadgeHtml(item.status)}</td><td>${item.joiningDate||'N/A'}</td><td><a href="#labour-details?id=${encodeURIComponent(item.id)}" class="btn btn-secondary btn-sm">View Details</a></td></tr>`).join(''):`<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:20px;">No recent labour records found.</td></tr>`;
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
  search.oninput=render; status.onchange=render; skill.onchange=render; window.handleDeleteClick=(id,name)=>showDeleteModal(id,name,()=>{deleteLabour(id);showToast('✓ Labour deleted successfully','success');render();}); render();
}

function initAddLabour(){
  const form=document.getElementById('addLabourForm'); if(!form)return;
  const data=getLabourData(), id=form.querySelector('#labourId');
  if(id&&!id.value) id.value=`LAB${String(data.length+1).padStart(3,'0')}`;
  const join=form.querySelector('#joiningDate'),dob=form.querySelector('#dob');
  if(join&&!join.value)join.value=new Date().toISOString().split('T')[0]; if(dob&&!dob.value)dob.value='1996-05-15';
  if(form.dataset.bound)return; form.dataset.bound='1';
  form.onsubmit=e=>{e.preventDefault();if(!validateLabourForm(form)){showToast('Please fix validation errors before submitting.','danger');return;}
    const v=s=>form.querySelector('#'+s).value.trim();
    addLabour({id:v('labourId'),name:v('name'),phone:v('phone'),email:v('email')||`${v('name').toLowerCase().replace(/\s+/g,'.')}@example.com`,gender:form.querySelector('#gender').value,dob:form.querySelector('#dob').value,skill:form.querySelector('#skill').value,experience:Number(form.querySelector('#experience').value),address:v('address')||'Shivaji Nagar',city:v('city')||'Pune',state:v('state')||'Maharashtra',joiningDate:form.querySelector('#joiningDate').value,status:form.querySelector('#status').value,emergencyContact:v('emergencyContact'),emergencyPhone:v('emergencyPhone')});
    showToast('✓ Labour added successfully','success');setTimeout(()=>navigate('labour'),500);
  };
}

function initEditLabour(id){
  const form=document.getElementById('editLabourForm'); if(!form)return;
  const record=getLabourById(id); if(!record){showToast('Labour record not found.','danger');navigate('labour');return;}
  const set=(k,v)=>{const el=form.querySelector('#'+k);if(el)el.value=v||''};
  set('labourId',record.id);set('name',record.name);set('phone',record.phone);set('email',record.email);set('gender',record.gender||'Male');set('dob',record.dob||'1995-01-01');set('skill',record.skill||'Mason');set('experience',record.experience??3);set('address',record.address);set('city',record.city||'Pune');set('state',record.state||'Maharashtra');set('joiningDate',record.joiningDate||'2024-01-01');set('status',record.status||'Active');set('emergencyContact',record.emergencyContact);set('emergencyPhone',record.emergencyPhone);
  if(form.dataset.bound)return; form.dataset.bound='1';
  form.onsubmit=e=>{e.preventDefault();if(!validateLabourForm(form)){showToast('Please fix validation errors before saving.','danger');return;}const v=s=>form.querySelector('#'+s).value.trim();updateLabour({id:record.id,name:v('name'),phone:v('phone'),email:v('email'),gender:form.querySelector('#gender').value,dob:form.querySelector('#dob').value,skill:form.querySelector('#skill').value,experience:Number(form.querySelector('#experience').value),address:v('address'),city:v('city'),state:v('state'),joiningDate:form.querySelector('#joiningDate').value,status:form.querySelector('#status').value,emergencyContact:v('emergencyContact'),emergencyPhone:v('emergencyPhone')});showToast('✓ Labour updated successfully','success');setTimeout(()=>navigate('labour'),500);};
}

function initDetails(id){
  const record=getLabourById(id); if(!record){showToast('Labour record not found.','danger');navigate('labour');return;}
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
  const html=(id,v)=>{const el=document.getElementById(id);if(el)el.innerHTML=v};
  const link=document.getElementById('editBtnLink');if(link)link.href='#edit-labour?id='+encodeURIComponent(record.id);
  set('avatarBox',getInitials(record.name));set('displayName',record.name);set('displayId',record.id);html('displayStatusBadge',getStatusBadgeHtml(record.status));set('displaySkill',record.skill);
  set('valName',record.name);set('valId',record.id);set('valGender',record.gender||'N/A');set('valDob',record.dob||'N/A');set('valPhone',record.phone||'N/A');set('valEmail',record.email||'N/A');set('valAddress',record.address||'N/A');set('valCityState',`${record.city||''}, ${record.state||''}`);set('valSkill',record.skill||'N/A');set('valExperience',`${record.experience||0} Years`);set('valJoiningDate',record.joiningDate||'N/A');set('valStatus',record.status||'N/A');set('valEmgContact',record.emergencyContact||'N/A');set('valEmgPhone',record.emergencyPhone||'N/A');
}

function initProjects(){
  const data=getLabourData(),ls=document.getElementById('labourSelect'),team=document.getElementById('teamBody'),att=document.getElementById('attendanceBody');if(!ls||!team||!att)return;
  ls.innerHTML=data.map(l=>`<option value="${l.id}">${l.name} (${l.skill})</option>`).join('');team.innerHTML=data.slice(0,6).map((l,i)=>`<tr><td>${l.name}</td><td>${l.skill}</td><td>${i%2?'Verdana Luxury Towers':'Metro Line 4 - Station 12'}</td><td>${getStatusBadgeHtml(l.status)}</td></tr>`).join('');att.innerHTML=data.slice(0,6).map(l=>`<tr><td>${l.name}</td><td>${l.skill}</td><td><label style="display:inline-flex;align-items:center;gap:8px"><input type="checkbox" ${l.status==='Active'?'checked':''}> Present</label></td></tr>`).join('');
  const form=document.getElementById('assignForm');if(form&&!form.dataset.bound){form.dataset.bound='1';form.onsubmit=e=>{e.preventDefault();showToast('Labour assigned successfully');};}
}

function initReports(){const s=calculateStats();const a=document.getElementById('totalLabour');if(a)a.textContent=s.total;const b=document.getElementById('activeLabour');if(b)b.textContent=s.active;const c=document.getElementById('leaveLabour');if(c)c.textContent=s.onLeave;const r=document.getElementById('skillReport');if(r){const counts={};getLabourData().forEach(l=>counts[l.skill]=(counts[l.skill]||0)+1);r.innerHTML=Object.entries(counts).map(([k,v])=>`<div><span>${k}</span><b>${v} workers</b></div>`).join('');}}

function initSettings(){
  const save=document.getElementById('saveSettings');if(save&&!save.dataset.bound){save.dataset.bound='1';save.onclick=()=>showToast('Settings saved successfully');}
  const del=document.getElementById('deleteAllLabourBtn');if(del&&!del.dataset.bound){del.dataset.bound='1';del.onclick=deleteAllLabourRecords;}
  const pn=document.getElementById('profileName'),pu=document.getElementById('profileUsername'),pe=document.getElementById('profileEmail');
  try{const p=JSON.parse(localStorage.getItem('skilliantProfile')||'null');if(p){if(p.name)pn.value=p.name.toUpperCase();if(p.username)pu.value=p.username;if(p.email)pe.value=p.email;}}catch(e){}
  const saveP=document.getElementById('saveProfile'),reset=document.getElementById('resetProfile');
  if(saveP&&!saveP.dataset.bound){saveP.dataset.bound='1';saveP.onclick=()=>{const name=(pn.value||'SHRUTI SHRIVASTAVA').trim().toUpperCase();localStorage.setItem('skilliantProfile',JSON.stringify({name,username:(pu.value||'shruti123').trim(),email:(pe.value||'shrutishrivastava234').trim()}));pn.value=name;showToast('Profile saved successfully');};}
  if(reset&&!reset.dataset.bound){reset.dataset.bound='1';reset.onclick=()=>{pn.value='SHRUTI SHRIVASTAVA';pu.value='shruti123';pe.value='shrutishrivastava234';};}
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
  if(valid==='settings')initSettings();
}

document.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  const menu=document.getElementById('mobileMenuBtn'),close=document.getElementById('sidebarCloseBtn'),side=document.getElementById('sidebar'),overlay=document.getElementById('sidebarOverlay');
  if(menu)menu.onclick=()=>{side.classList.add('mobile-open');overlay.classList.add('mobile-open')};
  if(close)close.onclick=()=>{side.classList.remove('mobile-open');overlay.classList.remove('mobile-open')};
  if(overlay)overlay.onclick=()=>{side.classList.remove('mobile-open');overlay.classList.remove('mobile-open')};
  const date=document.getElementById('currentDateText');if(date)date.textContent=new Date().toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'});
  const search=document.getElementById('headerSearchInput');if(search)search.onkeydown=e=>{if(e.key==='Enter'&&search.value.trim())navigate('labour',null),setTimeout(()=>{const s=document.getElementById('searchInput');if(s){s.value=search.value.trim();s.dispatchEvent(new Event('input'));}},0)};
  document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click',()=>{if(side)side.classList.remove('mobile-open');if(overlay)overlay.classList.remove('mobile-open')}));
  document.querySelectorAll('[data-route="settings"]').forEach(x=>x.onclick=()=>navigate('settings'));
  getLabourData();renderRoute();
});
window.addEventListener('hashchange',renderRoute);
