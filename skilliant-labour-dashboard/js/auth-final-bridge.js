/* Compatibility shim. Logout is now owned exclusively by logout-controller.js. */
(function () {
  'use strict';
  if (typeof window.skilliantLogout === 'function') {
    window.__skilliantFinalLogout = window.skilliantLogout;
  }
})();
