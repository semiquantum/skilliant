SKILLIANT CONTRACTOR PORTAL

Open: skilliant/index.html

This build preserves the existing UI and structure. The latest repair focuses only on the requested functionality:
- Header theme is an icon-only Light/Dark toggle and persists.
- Portal Settings (language/date format) are removed.
- Company editing exists on the Company page only and persists everywhere, including dashboard/header.
- Company Documents section is removed.
- Profile dropdown supports My Profile, Login and Logout.
- Notification bell opens a persistent activity history panel with unread count and clear action.
- Activity history records company/profile changes, login/logout, labour add/edit/delete/delete-all, project assignment, attendance updates and theme changes.
- Existing Labour CRUD/search/filter/details, Projects, Wallet, Reports and Help modules are preserved.
- Project assignment and attendance persist in LocalStorage.
- Wallet and reports use stored financial data.

No backend, framework or external application server is required.
