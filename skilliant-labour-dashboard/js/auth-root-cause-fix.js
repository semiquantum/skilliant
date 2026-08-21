/* =========================================================
   SKILLIANT AUTH ROOT-CAUSE PATCH v1
   Single owner for login/logout. Removes the legacy modal/event
   chain from the critical path and handles pointer + click events.
========================================================= */
(function () {
  'use strict';

  const AUTH_KEY = 'skilliant_auth_session_v2';
  const USER_KEY = 'skilliant_demo_user_v2';
  const DEFAULT_USER = {
    email: 'rahul.sharma@skilliant.com',
    password: 'Skilliant@123',
    name: 'Rahul Sharma'
  };

  function getUser() {
    try { return Object.assign({}, DEFAULT_USER, JSON.parse(localStorage.getItem(USER_KEY) || '{}')); }
    catch (_) { return DEFAULT_USER; }
  }

  function clearAuth() {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('skilliant_logged_out');
  }

  function showLogin() {
    const gate = document.getElementById('authGate');
    const shell = document.getElementById('portalAppShell');
    if (gate) {
      gate.classList.remove('hidden');
      gate.setAttribute('aria-hidden', 'false');
      gate.style.display = 'grid';
      gate.style.visibility = 'visible';
      gate.style.opacity = '1';
      gate.style.pointerEvents = 'auto';
      gate.style.zIndex = '1000000';
    }
    if (shell) {
      shell.classList.add('portal-hidden');
      shell.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('authenticated');
    document.body.style.overflow = '';
    document.getElementById('loginPassword')?.focus();
  }

  function showPortal() {
    const gate = document.getElementById('authGate');
    const shell = document.getElementById('portalAppShell');
    if (gate) {
      gate.classList.add('hidden');
      gate.setAttribute('aria-hidden', 'true');
      gate.style.display = 'none';
      gate.style.pointerEvents = 'none';
    }
    if (shell) {
      shell.classList.remove('portal-hidden');
      shell.setAttribute('aria-hidden', 'false');
    }
    document.body.classList.add('authenticated');
  }

  function closeEverything() {
    document.querySelectorAll('#logoutModal, .modal, .day5-modal, .d4-modal, .profile-dropdown, .notification-panel')
      .forEach(function (el) {
        if (el.id === 'authGate') return;
        el.classList.remove('active', 'open', 'show');
        if (el.classList.contains('modal') || el.id === 'logoutModal') el.style.display = 'none';
        if (el.classList.contains('profile-dropdown')) el.style.display = 'none';
        el.setAttribute('aria-hidden', 'true');
      });
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  function notify(message) {
    try {
      if (typeof window.showDay5Notification === 'function') {
        window.showDay5Notification(message);
        return;
      }
    } catch (_) {}
    console.log(message);
  }

  function logoutNow() {
    clearAuth();
    closeEverything();
    showLogin();
    const form = document.getElementById('loginForm');
    if (form) form.reset();
    document.querySelectorAll('.auth-error').forEach(function (e) { e.textContent = ''; });
    notify('You have been logged out successfully.');
    return false;
  }

  function openLogout() {
    const modal = document.getElementById('logoutModal');
    if (!modal) return logoutNow();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    modal.style.zIndex = '1000001';
    const content = modal.querySelector('.modal-content');
    if (content) {
      content.style.pointerEvents = 'auto';
      content.style.position = 'relative';
      content.style.zIndex = '2';
    }
    const confirm = document.getElementById('confirmLogoutBtn');
    if (confirm) {
      confirm.disabled = false;
      confirm.removeAttribute('disabled');
      confirm.type = 'button';
      confirm.style.pointerEvents = 'auto';
      confirm.style.cursor = 'pointer';
      confirm.style.position = 'relative';
      confirm.style.zIndex = '3';
    }
    return false;
  }

  function loginNow(e) {
    if (e) { e.preventDefault(); e.stopImmediatePropagation(); }
    const emailEl = document.getElementById('loginEmail');
    const passEl = document.getElementById('loginPassword');
    const remember = document.getElementById('rememberMe');
    const emailErr = document.getElementById('loginEmailError');
    const passErr = document.getElementById('loginPasswordError');
    const email = (emailEl?.value || '').trim().toLowerCase();
    const password = passEl?.value || '';
    const u = getUser();
    if (emailErr) emailErr.textContent = '';
    if (passErr) passErr.textContent = '';
    if (!email) { if (emailErr) emailErr.textContent = 'Email is required.'; return false; }
    if (!password) { if (passErr) passErr.textContent = 'Password is required.'; return false; }
    if (email !== String(u.email).toLowerCase() || password !== String(u.password)) {
      if (passErr) passErr.textContent = 'Invalid email or password. Access denied.';
      return false;
    }
    if (!remember || remember.checked) {
      localStorage.setItem(AUTH_KEY, '1');
      sessionStorage.removeItem(AUTH_KEY);
    } else {
      sessionStorage.setItem(AUTH_KEY, '1');
      localStorage.removeItem(AUTH_KEY);
    }
    showPortal();
    notify('Welcome back, ' + u.name + '!');
    return false;
  }

  /* Override the legacy global functions used by inline HTML handlers. */
  window.openLogoutModal = openLogout;
  window.closeLogoutModal = function () {
    const modal = document.getElementById('logoutModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  };
  window.skilliantReliableLogout = logoutNow;
  window.skilliantOpenLogout = openLogout;
  window.__skilliantHardLogout = logoutNow;
  window.skilliantReliableLogin = loginNow;
  window.__skilliantHardLogin = loginNow;

  function handlePointer(event) {
    const target = event.target && event.target.closest ? event.target.closest('#confirmLogoutBtn, [data-profile-action="logout"], #d5Logout, .advanced-sidebar-logout, #loginSubmit') : null;
    if (!target) return;

    /* Only the critical auth controls are owned here. */
    event.preventDefault();
    event.stopImmediatePropagation();

    if (target.id === 'confirmLogoutBtn') logoutNow();
    else if (target.id === 'loginSubmit') loginNow(event);
    else if (target.matches('[data-profile-action="logout"], #d5Logout, .advanced-sidebar-logout')) openLogout();
  }

  function install() {
    /* Remove inline logout handlers so there is exactly one implementation. */
    document.querySelectorAll('[data-profile-action="logout"], #d5Logout, .advanced-sidebar-logout, #confirmLogoutBtn')
      .forEach(function (el) {
        el.removeAttribute('onclick');
        el.style.pointerEvents = 'auto';
      });

    /* Capture pointerdown first: this works even when a later click handler swallows click. */
    document.addEventListener('pointerdown', handlePointer, true);
    document.addEventListener('mousedown', handlePointer, true);
    document.addEventListener('touchstart', handlePointer, { capture: true, passive: false });
    document.addEventListener('click', handlePointer, true);

    const form = document.getElementById('loginForm');
    if (form) form.addEventListener('submit', loginNow, true);

    /* Keep dynamically-created/profile-menu logout controls owned by this controller. */
    const observer = new MutationObserver(function () {
      document.querySelectorAll('[data-profile-action="logout"], #d5Logout, .advanced-sidebar-logout, #confirmLogoutBtn')
        .forEach(function (el) {
          el.removeAttribute('onclick');
          el.style.pointerEvents = 'auto';
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
