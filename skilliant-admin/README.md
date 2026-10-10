# Skilliant Admin Portal — 3-Way Connectivity (Admin Only)

Only `skilliant-admin/` is included. Marketing and DISC Digital User Portal files are not copied or modified.

## Portal connectivity
The Admin sidebar contains only these portal links:

- **Skilliant Admin** — `#dashboard`
- **Marketing Portal** — `../Marketing/index.html`
- **DISC Digital User Portal** — `../user%20portal%20final/index.html`

These are relative `href` links. No Windows-specific paths are used.

The Dashboard does not show a separate module/portal center.

## Repository structure
```text
Final Web/
├── Marketing/
├── skilliant-admin/
└── user portal final/
```

Keep the existing sibling folders unchanged.

## Local test
From the `Final Web` parent folder:

```cmd
npx serve .
```

Open:

```text
http://localhost:3000/skilliant-admin/
```

## Commit only Admin
```cmd
git add "Final Web/skilliant-admin"
git commit -m "Connect Admin with Marketing and DISC Digital User Portal"
git push origin main
```

## External Portal Connectivity

The Admin Portal keeps all other portal source files outside this folder. It uses relative `href` links to the existing sibling portals:

- `../Marketing/index.html` — Marketing Portal
- `../user%20portal%20final/index.html` — DISC Digital User Portal
- `../Contractor%20Portal/skilliant-shruti/skilliant/index.html` — Contractor Portal
- `../skilliant-labour-dashboard/index.html` — Labour Portal

The Admin sidebar does **not** contain a self-link to Skilliant Admin. The Admin logout action clears the Admin session and returns to `../Marketing/index.html`.

Keep the repository structure unchanged when testing or downloading as ZIP. Do not copy these portal folders into `skilliant-admin`.


## Current Connectivity Scope

This Admin Portal package changes **only `skilliant-admin`**. The Marketing, DISC Digital User, Contractor, and Labour portal source files are not copied into this folder. Navigation uses relative `href` links to the existing sibling portal folders in the repository.

Connected portals from Admin:
- Marketing Portal
- DISC Digital User Portal
- Contractor Portal
- Labour Portal

Admin logout clears the Admin session and redirects to `../Marketing/index.html`.

## Local Test

Run the server from the parent `Final Web` directory so sibling portal paths resolve:

```cmd
npx serve .
```

Then open:

```text
http://localhost:3000/skilliant-admin/
```

Do not open the Admin `index.html` with `file:///` when testing portal connectivity.

## User Data Cleanup

The Admin data layer normalizes legacy user records at startup, prevents duplicate demo records from appearing, converts missing booking/spend values to safe defaults, and keeps View/Edit/Suspend/Activate/Delete/CSV/Print actions connected to the same LocalStorage data source.


## Admin-only local Super Admin schema migration

The Admin data schema performs a one-time LocalStorage migration for the canonical Super Admin:
- Email: `meetmhatre2006@gmail.com`
- Local demo password: `141312`
- Role: `Super Admin`
- Status: `Active`

The migration updates only the Admin account record and does not clear or reseed the other Admin modules. Other portals and files are unchanged.

**Security limitation:** because this build is static and stores authentication data in browser LocalStorage, it is suitable only for a local/demo workflow. A static LocalStorage-only app cannot provide server-enforced authentication or authorization on a public deployment. Do not use this password for any real account; change it before sharing the deployed site.


## Run with npm (Windows / VS Code)

1. Extract the ZIP and open the `skilliant-admin` folder in VS Code.
2. Open **Terminal → New Terminal** in that folder.
3. Run:

```powershell
npm install
npm run dev
```

4. Open the local URL printed by Vite (normally `http://127.0.0.1:5173/`).
5. Keep the terminal open while using the website.

Other scripts:
- `npm start` — same as `npm run dev`
- `npm run build` — checks/builds the static frontend into `dist/`
- `npm run preview` — previews the production build after `npm run build`

The npm setup only adds the local development server; it does not alter the Admin UI or other portals. The Admin app continues to use browser LocalStorage. LocalStorage authentication is for demo/local use only and cannot enforce secure authorization on a public deployment. Third-party CDN resources require an internet connection.


## Admin module routing and shared data

The Admin Portal uses hash routes so each module has a direct URL fragment and can be opened/bookmarked after login:
- `#dashboard`
- `#users`, `#labour`, `#contractors`
- `#categories`, `#skills`, `#reviews`
- `#bookings`, `#payments`, `#reports`
- `#projects`, `#attendance`, `#documents`, `#availability`
- `#notifications`, `#support`, `#activity`, `#settings`, `#admins`, `#roles`

The four existing page modules for Projects, Attendance, Documents and Availability are now loaded, registered with the Admin router, and linked in the Admin sidebar. The modules continue using the shared `DataService` LocalStorage collections; this does not create cross-device or cross-browser synchronization.

Run from this folder with `npm install` then `npm run dev`. Vite should serve the Admin at `http://127.0.0.1:5173/`. Direct module navigation requires a logged-in session.
