/* =========================================================
   DAY 5 RUNTIME FIXES
   - Repairs legacy profile/portfolio modal collisions
   - Adds a visible "Created Tasks" panel to Jobs
   - Keeps the panel synced with the Day 1/2 LocalStorage task list
   - Adds capture-phase button handlers so Day 5 actions cannot be
     swallowed by older inline/legacy handlers
========================================================= */
(function(){
  'use strict';

  const TASK_KEY = 'skilliant_day1_todos';
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const getTasks = () => {
    try {
      const value = JSON.parse(localStorage.getItem(TASK_KEY) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (_) { return []; }
  };
  const formatDate = v => {
    if (!v) return 'No due date';
    const d = new Date(v + 'T00:00:00');
    return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
  };
  const formatTime = v => {
    if (!v) return 'Any time';
    const [hh,mm] = v.split(':').map(Number);
    if (Number.isNaN(hh)) return v;
    return `${hh % 12 || 12}:${String(mm || 0).padStart(2,'0')} ${hh >= 12 ? 'PM' : 'AM'}`;
  };

  function notify(message, type='success') {
    if (typeof window.showDay5Notification === 'function') { window.showDay5Notification(message); return; }
    let box = document.getElementById('day5Notification');
    if (!box) {
      box = document.createElement('div');
      box.id = 'day5Notification';
      box.className = 'day5-notification';
      document.body.appendChild(box);
    }
    box.innerHTML = `<i class="fa-solid ${type==='error'?'fa-circle-exclamation':'fa-circle-check'}"></i><span>${esc(message)}</span>`;
    box.classList.add('show');
    clearTimeout(box._timer);
    box._timer = setTimeout(() => box.classList.remove('show'), 2800);
  }

  function renderCreatedTasks(){
    const jobs = document.getElementById('jobs');
    if (!jobs) return;
    let section = document.getElementById('createdTasksPanel');
    if (!section) {
      section = document.createElement('section');
      section.id = 'createdTasksPanel';
      section.className = 'created-tasks-panel glass';
      const requestGrid = jobs.querySelector('.request-grid');
      const currentTitle = Array.from(jobs.querySelectorAll('.section-title')).find(el => /current/i.test(el.textContent || ''));
      if (currentTitle) jobs.insertBefore(section, currentTitle);
      else if (requestGrid) requestGrid.insertAdjacentElement('afterend', section);
      else jobs.appendChild(section);
    }

    const tasks = getTasks().slice().sort((a,b) => (a.date||'9999').localeCompare(b.date||'9999') || (a.time||'23:59').localeCompare(b.time||'23:59'));
    section.innerHTML = `
      <div class="created-tasks-head">
        <div>
          <span class="todo-eyebrow">MY TASKS • LOCAL WORKSPACE</span>
          <h3>Created Tasks</h3>
          <p>Tasks you create in <strong>My Tasks</strong> are shown here for quick access. They are not customer incoming requests.</p>
        </div>
        <button type="button" class="day5-btn primary" id="createdTasksOpenBtn"><i class="fa-solid fa-list-check"></i> Open My Tasks</button>
      </div>
      <div class="created-task-list">
        ${tasks.length ? tasks.map(t => `
          <article class="created-task-row ${t.completed ? 'is-completed' : ''}">
            <div class="created-task-icon"><i class="fa-solid ${t.completed ? 'fa-circle-check' : 'fa-clipboard-check'}"></i></div>
            <div class="created-task-main">
              <strong>${esc(t.title)}</strong>
              <span>${esc(t.category || 'General')} • ${formatDate(t.date)} • ${formatTime(t.time)}</span>
            </div>
            <span class="created-task-status ${t.completed ? 'done' : 'pending'}">${t.completed ? 'Completed' : 'Upcoming'}</span>
          </article>`).join('') : `<div class="created-task-empty"><i class="fa-regular fa-clipboard"></i><div><strong>No created tasks yet</strong><span>Create a task from My Tasks and it will appear here automatically.</span></div></div>`}
      </div>`;

    document.getElementById('createdTasksOpenBtn')?.addEventListener('click', () => {
      if (typeof window.showPage === 'function') window.showPage('tasks', document.querySelector('.menu li[onclick*="showPage(\'tasks\'"]'));
      else window.location.hash = '#tasks';
    });
  }

  function bindButtons(){
    document.addEventListener('click', function(e){
      const profile = e.target.closest?.('.profile-edit-btn');
      if (profile && typeof window.openProfileEditModal === 'function') {
        e.preventDefault(); e.stopImmediatePropagation();
        window.openProfileEditModal();
        return;
      }
      const portfolio = e.target.closest?.('#portfolio .page-header > button');
      if (portfolio && typeof window.openPortfolioModal === 'function') {
        e.preventDefault(); e.stopImmediatePropagation();
        window.openPortfolioModal();
        return;
      }
      const openTasks = e.target.closest?.('#createdTasksOpenBtn');
      if (openTasks) {
        e.preventDefault();
        if (typeof window.showPage === 'function') window.showPage('tasks', document.querySelector('.menu li[onclick*="showPage(\'tasks\'"]'));
      }
    }, true);

    const form = document.getElementById('todoForm');
    form?.addEventListener('submit', () => setTimeout(renderCreatedTasks, 80), true);
    window.addEventListener('storage', e => { if (e.key === TASK_KEY) renderCreatedTasks(); });
  }

  function init(){
    bindButtons();
    renderCreatedTasks();
    // The jobs page may be rendered after initial load; refresh whenever the
    // user navigates or the task list DOM changes.
    document.addEventListener('click', e => {
      if (e.target.closest?.('.menu li') || e.target.closest?.('[onclick*="showPage"]')) setTimeout(renderCreatedTasks, 80);
    });
    const list = document.getElementById('todoList');
    if (list) new MutationObserver(renderCreatedTasks).observe(list, {childList:true});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
