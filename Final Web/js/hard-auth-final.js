/* =========================================================
   SKILLIANT HARD AUTH FINAL
   Last-resort, direct handlers for Login + Logout.
   These handlers intentionally avoid the legacy modal/event chain.
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

  function user() {
    try {
      return Object.assign({}, DEFAULT_USER, JSON.parse(localStorage.getItem(USER_KEY) || '{}'));
    } catch (_) {
      return DEFAULT_USER;
    }
  }

  function clearAuth() {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('skilliant_logged_out');
  }

  function login(email, password, remember) {
    const u = user();
    if (email.trim().toLowerCase() !== String(u.email).trim().toLowerCase() || password !== String(u.password)) {
      const err = document.getElementById('loginPasswordError');
      if (err) err.textContent = 'Invalid email or password. Access denied.';
      return false;
    }

    if (remember) {
      localStorage.setItem(AUTH_KEY, '1');
      sessionStorage.removeItem(AUTH_KEY);
    } else {
      sessionStorage.setItem(AUTH_KEY, '1');
      localStorage.removeItem(AUTH_KEY);
    }

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
      shell.style.display = '';
    }
    document.body.classList.add('authenticated');
    return true;
  }

  /* Direct Logout: clear session and reload into the login gate. */
  window.__skilliantHardLogout = function (event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    clearAuth();
    try {
      document.documentElement.removeAttribute('data-theme');
    } catch (_) {}
    window.location.reload();
    return false;
  };

  /* Direct Login: bypass submit/click chains that may be intercepted by legacy code. */
  window.__skilliantHardLogin = function (event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const emailEl = document.getElementById('loginEmail');
    const passEl = document.getElementById('loginPassword');
    const rememberEl = document.getElementById('rememberMe');
    const emailErr = document.getElementById('loginEmailError');
    const passErr = document.getElementById('loginPasswordError');
    const email = (emailEl ? emailEl.value : '').trim();
    const password = passEl ? passEl.value : '';

    if (emailErr) emailErr.textContent = '';
    if (passErr) passErr.textContent = '';

    let ok = true;
    if (!email) {
      if (emailErr) emailErr.textContent = 'Email is required.';
      ok = false;
    }
    if (!password) {
      if (passErr) passErr.textContent = 'Password is required.';
      ok = false;
    }
    if (!ok) return false;

    if (!login(email, password, !rememberEl || rememberEl.checked)) {
      return false;
    }
    return false;
  };

  /* Attach the hard handlers directly as well as through inline attributes. */
  function bindDirect() {
    const logout = document.getElementById('confirmLogoutBtn');
    if (logout) {
      logout.type = 'button';
      logout.setAttribute('onclick', 'return window.__skilliantHardLogout(event)');
      logout.style.pointerEvents = 'auto';
      logout.style.position = 'relative';
      logout.style.zIndex = '100012';
    }

    const loginBtn = document.getElementById('loginSubmit');
    if (loginBtn) {
      loginBtn.type = 'button';
      loginBtn.setAttribute('onclick', 'return window.__skilliantHardLogin(event)');
      loginBtn.style.pointerEvents = 'auto';
      loginBtn.style.position = 'relative';
      loginBtn.style.zIndex = '100002';
    }

    const form = document.getElementById('loginForm');
    if (form) form.setAttribute('onsubmit', 'return window.__skilliantHardLogin(event)');

    /* Every visible Logout trigger gets the same direct action. */
    document.querySelectorAll('[data-profile-action="logout"], .advanced-sidebar-logout, #d5Logout').forEach(function (el) {
      el.setAttribute('onclick', 'return window.__skilliantHardLogout(event)');
      el.style.pointerEvents = 'auto';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindDirect, { once: true });
  } else {
    bindDirect();
  }
})();
