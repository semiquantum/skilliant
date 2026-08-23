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
