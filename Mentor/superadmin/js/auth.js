/* Superadmin Authentication Script */

const SUPERADMIN_EMAIL = 'test@gmail.com';
const SUPERADMIN_PASS = '123456789';
const STORAGE_KEY = 'skilliant_superadmin_auth';

function checkAuth() {
  const isAuth = localStorage.getItem(STORAGE_KEY);
  const isLoginPage = window.location.pathname.endsWith('login.html');

  if (!isAuth && !isLoginPage) {
    window.location.href = 'login.html';
  } else if (isAuth && isLoginPage) {
    window.location.href = 'index.html';
  }
}

function handleLogin(email, password) {
  if (email.trim() === SUPERADMIN_EMAIL && password.trim() === SUPERADMIN_PASS) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      email: SUPERADMIN_EMAIL,
      role: 'Super Admin',
      loginTime: new Date().toISOString()
    }));
    return { success: true };
  } else {
    return { success: false, message: 'Invalid credentials. Please use test@gmail.com / 123456789' };
  }
}

function handleLogout() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = 'login.html';
}

function autoFillDemo() {
  const emailInput = document.getElementById('emailInput');
  const passInput = document.getElementById('passInput');
  if (emailInput && passInput) {
    emailInput.value = SUPERADMIN_EMAIL;
    passInput.value = SUPERADMIN_PASS;
  }
}

// Execute auth check automatically on script load
checkAuth();
