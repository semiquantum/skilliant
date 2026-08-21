/* =========================================================
   SKILLIANT AUTH + PROFILE LOGOUT ROOT FIX
   Makes profile/logout/login controls independent of legacy
   inline handlers and guarantees a single reliable auth flow.
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

  const $ = (id) => document.getElementById(id);

  function readUser() {
    try {
      return Object.assign({}, DEFAULT_USER, JSON.parse(localStorage.getItem(USER_KEY) || '{}'));
    } catch (_) {
      return DEFAULT_USER;
    }
  }

  function setLoggedOut() {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('skilliant_logged_out');
  }

  function showLoginScreen() {
    const gate = $('authGate');
    const shell = $('portalAppShell');
    if (gate) {
      gate.classList.remove('hidden');
      gate.setAttribute('aria-hidden', 'false');
      gate.style.display = 'grid';
      gate.style.pointerEvents = 'auto';
    }
    if (shell) {
      shell.classList.add('portal-hidden');
      shell.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('authenticated');
    $('loginEmail')?.focus();
  }

  function toast(message, type) {
    if (typeof window.showDay5Notification === 'function') {
      window.showDay5Notification(message, type === 'error' ? 'error' : undefined);
      return;
    }
    let n = $('day5Notification');
    if (!n) {
      n = document.createElement('div');
      n.id = 'day5Notification';
      n.className = 'day5-notification';
      document.body.appendChild(n);
    }
    n.textContent = message;
    n.classList.add('show');
    clearTimeout(n._authTimer);
    n._authTimer = setTimeout(() => n.classList.remove('show'), 2600);
  }

  function closeLogoutModal() {
    const modal = $('logoutModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }

  function openLogoutModalSafe() {
    const modal = $('logoutModal');
    if (!modal) {
      performLogout();
      return;
    }
    modal.classList.add('active');
    modal.style.display = 'flex';
    modal.style.zIndex = '100010';
    modal.setAttribute('aria-hidden', 'false');
    const confirm = $('confirmLogoutBtn');
    if (confirm) {
      confirm.type = 'button';
      confirm.style.pointerEvents = 'auto';
      confirm.disabled = false;
    }
  }

  function performLogout() {
    setLoggedOut();
    closeLogoutModal();
    document.querySelectorAll('.profile-dropdown').forEach((d) => {
      d.classList.remove('show');
      d.style.display = 'none';
    });
    document.querySelectorAll('.notification-panel').forEach((p) => {
      p.classList.remove('open');
      p.setAttribute('aria-hidden', 'true');
    });
    showLoginScreen();
    const form = $('loginForm');
    form?.reset();
    document.querySelectorAll('.auth-error').forEach((e) => { e.textContent = ''; });
    toast('You have been logged out successfully.');
  }

  function loginNow() {
    const emailEl = $('loginEmail');
    const passEl = $('loginPassword');
    const rememberEl = $('rememberMe');
    const emailError = $('loginEmailError');
    const passError = $('loginPasswordError');
    const email = (emailEl?.value || '').trim().toLowerCase();
    const password = passEl?.value || '';
    const user = readUser();

    if (emailError) emailError.textContent = '';
    if (passError) passError.textContent = '';

    let valid = true;
    if (!email) {
      if (emailError) emailError.textContent = 'Email is required.';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (emailError) emailError.textContent = 'Enter a valid email address.';
      valid = false;
    }
    if (!password) {
      if (passError) passError.textContent = 'Password is required.';
      valid = false;
    }
    if (!valid) return;

    if (email !== String(user.email).toLowerCase() || password !== String(user.password)) {
      if (passError) passError.textContent = 'Invalid email or password. Access denied.';
      toast('Invalid login details. Please try again.', 'error');
      return;
    }

    if (rememberEl?.checked !== false) {
      localStorage.setItem(AUTH_KEY, '1');
      sessionStorage.removeItem(AUTH_KEY);
    } else {
      sessionStorage.setItem(AUTH_KEY, '1');
      localStorage.removeItem(AUTH_KEY);
    }

    const gate = $('authGate');
    const shell = $('portalAppShell');
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
    toast('Welcome back, ' + user.name + '!');
  }

  function bind() {
    /* Profile dropdown logout — capture phase prevents legacy handlers from stealing the click. */
    document.addEventListener('click', function (event) {
      const logoutAction = event.target.closest('[data-profile-action="logout"]');
      if (logoutAction) {
        event.preventDefault();
        event.stopImmediatePropagation();
        openLogoutModalSafe();
        return;
      }

      const sidebarLogout = event.target.closest('.sidebar .menu li');
      if (sidebarLogout && /logout/i.test(sidebarLogout.textContent || '')) {
        event.preventDefault();
        event.stopImmediatePropagation();
        openLogoutModalSafe();
        return;
      }

      const confirm = event.target.closest('#confirmLogoutBtn');
      if (confirm) {
        event.preventDefault();
        event.stopImmediatePropagation();
        performLogout();
        return;
      }

      const stay = event.target.closest('#logoutModal .secondary-btn');
      if (stay) {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeLogoutModal();
      }
    }, true);

    /* Login button: request the form submit even if an older click handler interferes. */
    document.addEventListener('click', function (event) {
      const button = event.target.closest('#loginSubmit');
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      loginNow();
    }, true);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && event.target.closest('#loginForm')) {
        const form = event.target.closest('#loginForm');
        if (event.target.tagName === 'INPUT' && event.target.id !== 'loginPasswordToggle') {
          event.preventDefault();
          loginNow();
        }
      }
      if (event.key === 'Escape') closeLogoutModal();
    });

    /* Expose a single reliable API for any future menu/button. */
    window.skilliantReliableLogout = performLogout;
    window.skilliantOpenLogout = openLogoutModalSafe;
    window.skilliantReliableLogin = loginNow;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind, { once: true });
  } else {
    bind();
  }
})();
