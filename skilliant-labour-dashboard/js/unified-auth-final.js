/* SKILLIANT UNIFIED AUTH FINAL
   Email/password + Google OAuth + stable callback/session restore.
   Loaded last so it owns the final authentication handoff without changing
   dashboard or logout functionality.
*/
(function () {
  'use strict';

  const AUTH_KEY = 'skilliant_auth_session_v2';
  const DEFAULT_EMAIL = 'rahul.sharma@skilliant.com';
  const DEFAULT_PASSWORD = 'Skilliant@123';

  const $ = id => document.getElementById(id);

  function showPortal() {
    const gate = $('authGate');
    const shell = $('portalAppShell');
    if (gate) {
      gate.classList.add('hidden');
      gate.setAttribute('aria-hidden', 'true');
      gate.style.display = 'none';
      gate.style.visibility = 'hidden';
      gate.style.pointerEvents = 'none';
    }
    if (shell) {
      shell.classList.remove('portal-hidden');
      shell.setAttribute('aria-hidden', 'false');
      shell.style.display = '';
      shell.style.visibility = 'visible';
      shell.style.pointerEvents = 'auto';
    }
    document.body.classList.add('authenticated');
    sessionStorage.setItem(AUTH_KEY, '1');
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
    }
    if (shell) {
      shell.classList.add('portal-hidden');
      shell.setAttribute('aria-hidden', 'true');
      shell.style.display = 'none';
      shell.style.pointerEvents = 'none';
    }
    document.body.classList.remove('authenticated');
  }

  function clearErrors() {
    const a = $('loginEmailError'), b = $('loginPasswordError');
    if (a) a.textContent = '';
    if (b) b.textContent = '';
  }

  function setBusy(busy) {
    const btn = $('loginSubmit');
    if (!btn) return;
    btn.disabled = busy;
    btn.style.opacity = busy ? '.7' : '';
    btn.style.pointerEvents = 'auto';
  }

  function demoLogin(email, password) {
    return email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD;
  }

  async function emailLogin(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }

    clearErrors();

    const email = (($('loginEmail')?.value || '').trim()).toLowerCase();
    const password = $('loginPassword')?.value || '';

    if (!email) {
      if ($('loginEmailError')) $('loginEmailError').textContent = 'Email is required.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if ($('loginEmailError')) $('loginEmailError').textContent = 'Enter a valid email address.';
      return;
    }
    if (!password) {
      if ($('loginPasswordError')) $('loginPasswordError').textContent = 'Password is required.';
      return;
    }

    setBusy(true);

    // Keep the original built-in demo account working.
    if (demoLogin(email, password)) {
      localStorage.setItem(AUTH_KEY, '1');
      localStorage.setItem('skilliant_demo_user_v2', JSON.stringify({
        email: DEFAULT_EMAIL,
        password: DEFAULT_PASSWORD,
        name: 'Rahul Sharma'
      }));
      showPortal();
      setBusy(false);
      return;
    }

    // For real Supabase email/password accounts, use Supabase directly.
    const client = window.skilliantSupabaseClient;
    if (client?.auth?.signInWithPassword) {
      try {
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (!error && data?.user) {
          localStorage.setItem('supabase_user', JSON.stringify(data.user));
          localStorage.setItem(AUTH_KEY, '1');
          sessionStorage.setItem(AUTH_KEY, '1');
          showPortal();
          setBusy(false);
          return;
        }
        if ($('loginPasswordError')) {
          $('loginPasswordError').textContent =
            error?.message || 'Invalid email or password.';
        }
      } catch (err) {
        console.error('[Skilliant] Email sign-in error:', err);
        if ($('loginPasswordError')) {
          $('loginPasswordError').textContent =
            err?.message || 'Unable to sign in. Please try again.';
        }
      }
    } else if ($('loginPasswordError')) {
      $('loginPasswordError').textContent =
        'Authentication service is still loading. Please try again.';
    }

    setBusy(false);
  }

  function cleanOAuthUrl() {
    try {
      if (location.hash && /access_token=|refresh_token=|error=/.test(location.hash)) {
        history.replaceState({}, document.title, location.pathname + location.search);
      }
    } catch (_) {}
  }

  async function restoreSupabaseSession() {
    const client = window.skilliantSupabaseClient;
    if (!client?.auth?.getSession) return false;

    try {
      const { data } = await client.auth.getSession();
      if (data?.session?.user) {
        localStorage.setItem('supabase_user', JSON.stringify(data.session.user));
        localStorage.setItem(AUTH_KEY, '1');
        sessionStorage.setItem(AUTH_KEY, '1');
        showPortal();
        cleanOAuthUrl();
        return true;
      }
    } catch (err) {
      console.error('[Skilliant] Session restore error:', err);
    }
    return false;
  }

  function bindEmailLogin() {
    const form = $('loginForm');
    const button = $('loginSubmit');

    // Remove duplicate handlers installed by earlier auth code.
    if (button) {
      button.addEventListener('click', emailLogin, true);
    }
    if (form) {
      form.addEventListener('submit', emailLogin, true);
    }
  }

  // Supabase script is loaded immediately before this file.
  const client = window.skilliantSupabaseClient;
  if (client?.auth?.onAuthStateChange) {
    client.auth.onAuthStateChange((event, session) => {
      if (session?.user &&
          (event === 'INITIAL_SESSION' ||
           event === 'SIGNED_IN' ||
           event === 'TOKEN_REFRESHED')) {
        localStorage.setItem('supabase_user', JSON.stringify(session.user));
        localStorage.setItem(AUTH_KEY, '1');
        sessionStorage.setItem(AUTH_KEY, '1');
        showPortal();
        cleanOAuthUrl();
      }
    });
  }

  bindEmailLogin();

  // Start from a deterministic UI state. If a valid Supabase session exists,
  // the restore/auth-state handlers below immediately switch to the portal.
  // This prevents an older local-auth controller from winning the first
  // OAuth callback race.
  if (!sessionStorage.getItem(AUTH_KEY) && !localStorage.getItem(AUTH_KEY)) {
    showLogin();
  }

  // Restore OAuth session after all scripts are initialized. Multiple short
  // retries eliminate the first-login race between the OAuth callback and
  // the dashboard's older UI initializer.
  restoreSupabaseSession();
  setTimeout(restoreSupabaseSession, 250);
  setTimeout(restoreSupabaseSession, 750);
  setTimeout(restoreSupabaseSession, 1500);

  console.log('%c✔ Skilliant unified auth final loaded', 'color:#D4AF57;font-weight:700');
})();
