SKILLIANT CONTRACTOR PORTAL - FUNCTIONAL BUG-FIX BUILD

This package preserves the existing portal structure and UI while fixing the requested functional issues.

FIXED
- Documents now persist in IndexedDB instead of filling LocalStorage with Base64 file data.
- Added documents appear immediately in the Documents table and survive refresh.
- Document View and Delete work on the selected entry.
- Header notification bell opens a working activity dropdown.
- Notifications page shows the complete stored activity history.
- Clear Notifications clears the same shared activity store from both the header and sidebar page.
- Labour, attendance, assignment, company, document, profile login/logout and theme actions are logged.
- All Active, Planning and Inactive projects are rendered from one shared project list.
- Active Projects count is calculated from that same list.
- Attendance is stored independently per worker and per date.
- Company edits remain synchronized across the portal.
- Existing Labour add/edit/delete behavior is preserved and activity logging is added around it.

RUN
1. Extract the ZIP.
2. Open skilliant/index.html in a modern browser, or run:
   python -m http.server 8000
3. Open http://localhost:8000/

STORAGE
- Labour/project/company/profile/activity metadata: LocalStorage
- Document files: IndexedDB

No framework, package installation, backend, or database is required for this frontend build.

LATEST DASHBOARD FIXES (15 Aug 2026)
- Removed the "Due in 7 days" text from the Dashboard Pending Payments card without changing the card structure.
- Dashboard Active Projects count is now calculated from the real PROJECTS data instead of a hard-coded value.
- Added an Inactive Projects section to the Dashboard; it reads directly from the project status data.
- Added an Inactive Labour section to the Dashboard; it reads directly from labour records with status "Inactive".
- Existing Projects and Labour pages remain unchanged and continue to use the same shared data.
