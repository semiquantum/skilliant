/* ==================================================================
   SKILLIANT - DARK MODE & THEME CONTROLLER
   ================================================================== */

(function () {
  const currentTheme = localStorage.getItem('skilliant_theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  document.addEventListener('DOMContentLoaded', () => {
    const themeToggles = document.querySelectorAll('.theme-toggle');

    themeToggles.forEach(toggle => {
      updateToggleIcon(toggle, currentTheme);

      toggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('skilliant_theme', newTheme);
        updateToggleIcon(toggle, newTheme);

        if (window.showToast) {
          window.showToast(`Switched to ${newTheme.toUpperCase()} mode`, 'info');
        }
      });
    });
  });

  function updateToggleIcon(btn, theme) {
    if (!btn) return;
    btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
  }
})();
