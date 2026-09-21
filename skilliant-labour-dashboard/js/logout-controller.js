/* =========================================================
   SKILLIANT LOGOUT — ROOT CONTROLLER
   Single owner. No inline handlers. Capture-phase hit handling.
========================================================= */
(function () {
  'use strict';

  const AUTH_KEY = 'skilliant_auth_session_v2';
  const $ = (id) => document.getElementById(id);
  let busy = false;

  function hideModal() {
    const modal = $('logoutModal');
    if (!modal) return;
    modal.classList.remove('active', 'open', 'show');
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    modal.style.visibility = 'hidden';
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
  }

  function showLogin() {
    const gate = $('authGate');
    const shell = $('portalAppShell');

    if (gate) {
      gate.classList.remove('hidden');
      gate.setAttribute('aria-hidden', 'false');
      gate.style.display = 'grid';
      gate.style.visibility = 'visible';
      gate.style.opacity = '1';
      gate.style.pointerEvents = 'auto';
      gate.style.zIndex = '100000';
    }

    if (shell) {
      shell.classList.add('portal-hidden');
      shell.setAttribute('aria-hidden', 'true');
      shell.style.display = 'none';
      shell.style.pointerEvents = 'none';
    }

    document.body.classList.remove('authenticated');
    document.body.style.overflow = '';
  }

  function clearAuth() {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('supabase_user');
    sessionStorage.removeItem('skilliant_google_login_pending');
    sessionStorage.removeItem('skilliant_otp_login_pending');
  }

  function notify() {
    try {
      if (typeof window.toast === 'function') window.toast('You have been logged out.');
      else if (typeof window.showDay5Notification === 'function') window.showDay5Notification('You have been logged out.');
    } catch (_) {}
  }

  async function logoutNow(event) {
    if (busy) return false;
    busy = true;

    if (event) {
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
    }

    // UI/session reset happens FIRST. Supabase network cleanup is secondary.
    clearAuth();
    hideModal();
    document.querySelectorAll('.profile-dropdown').forEach((el) => {
      el.classList.remove('show');
      el.style.display = 'none';
    });
    document.querySelectorAll('.notification-panel').forEach((el) => {
      el.classList.remove('open');
      el.setAttribute('aria-hidden', 'true');
    });

    showLogin();

    const form = $('loginForm');
    if (form) form.reset();
    document.querySelectorAll('.auth-error').forEach((el) => { el.textContent = ''; });

    try {
      if (typeof window.skilliantSupabaseSignOut === 'function') {
        await window.skilliantSupabaseSignOut();
      } else if (window.skilliantSupabaseClient?.auth) {
        await window.skilliantSupabaseClient.auth.signOut({ scope: 'local' });
      }
    } catch (error) {
      console.error('[Skilliant] Supabase logout cleanup failed:', error);
    }

    notify();
    setTimeout(() => { busy = false; }, 250);
    return false;
  }

  function openLogoutModal(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
    }

    const modal = $('logoutModal');
    if (!modal) return logoutNow(event);

    modal.classList.add('active');
    modal.classList.remove('open', 'show');
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    modal.style.zIndex = '1000000';

    const content = modal.querySelector('.modal-content');
    if (content) {
      content.style.pointerEvents = 'auto';
      content.style.position = 'relative';
      content.style.zIndex = '1000001';
    }

    const confirm = $('confirmLogoutBtn');
    if (confirm) {
      confirm.type = 'button';
      confirm.disabled = false;
      confirm.removeAttribute('disabled');
      confirm.style.pointerEvents = 'auto';
      confirm.style.cursor = 'pointer';
      confirm.style.position = 'relative';
      confirm.style.zIndex = '1000002';
      confirm.setAttribute('data-skilliant-confirm-logout', '');
    }
    return false;
  }

  function closeLogoutModal(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    hideModal();
    return false;
  }

  // Public compatibility API for any existing page code.
  window.openLogoutModal = openLogoutModal;
  window.closeLogoutModal = closeLogoutModal;
  window.skilliantLogout = logoutNow;
  window.__skilliantFinalLogout = logoutNow;

  // IMPORTANT: no inline onclick is required. Delegated capture handlers own
  // both pointer and click events so a child icon/span cannot break the hit.
  function routeEvent(event) {
    const target = event.target?.closest?.('#confirmLogoutBtn, [data-skilliant-confirm-logout]');
    if (target) {
      logoutNow(event);
      return;
    }

    const close = event.target?.closest?.('[data-skilliant-close-logout]');
    if (close) {
      closeLogoutModal(event);
      return;
    }

    const trigger = event.target?.closest?.('[data-skilliant-logout-trigger], .advanced-sidebar-logout, #d5Logout');
    if (trigger) {
      openLogoutModal(event);
    }
  }

  // Register immediately because this script is loaded after all markup.
  document.addEventListener('pointerdown', routeEvent, true);
  document.addEventListener('mousedown', routeEvent, true);
  document.addEventListener('touchstart', routeEvent, { capture: true, passive: false });
  document.addEventListener('click', routeEvent, true);

  // Also harden the button if any legacy code recreates or replaces it.
  const observer = new MutationObserver(() => {
    const button = $('confirmLogoutBtn');
    if (!button) return;
    button.type = 'button';
    button.disabled = false;
    button.removeAttribute('disabled');
    button.style.pointerEvents = 'auto';
    button.style.cursor = 'pointer';
    button.setAttribute('data-skilliant-confirm-logout', '');
  });
  if (document.body) observer.observe(document.body, { childList: true, subtree: true });

  hideModal();
  console.log('%c✔ Skilliant logout root controller ready', 'color:#D4AF57;font-weight:700');
})();
