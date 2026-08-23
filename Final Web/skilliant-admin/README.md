# Skilliant Admin Portal — Admin-Only Connected Build

This package contains **only `skilliant-admin/`**. Do not copy or merge Marketing, User, Contractor, or Labour source files into this folder.

## Portal connectivity
The Admin Portal uses portable relative HTML `href` links to the existing sibling portals in the repository:

- Marketing: `../Marketing/index.html`
- User Portal: `../user%20portal%20final/index.html`
- Contractor Portal: `../Contractor%20Portal/skilliant-shruti/skilliant/index.html`
- Labour Portal: `../skilliant-labour-dashboard/index.html`
- Admin logout: clears the Admin session and returns to `../Marketing/index.html`

These paths are intentionally relative. **Never replace them with a Windows path such as `C:\Users\...`.**

## Required repository layout
When this folder is committed, the repository should keep the existing structure:

```text
Final Web/
├── Marketing/
├── skilliant-admin/          # this folder
├── user portal final/
├── Contractor Portal/
│   └── skilliant-shruti/
│       └── skilliant/
└── skilliant-labour-dashboard/
```

Only the `skilliant-admin` folder is changed by this package. The other portals remain untouched.

## Local testing
Because the Admin links point to sibling folders, test the **parent `Final Web` folder**, not the Admin folder alone.

```cmd
cd "...\Final Web"
npx serve .
```

Then open:

```text
http://localhost:3000/skilliant-admin/
```

Do not double-click the Admin `index.html` for connectivity testing.

## Authentication / password reset
- Admin login uses the Admin records stored by the existing frontend `DataService`.
- Forgot Password checks the current active Admin records; it does not hard-code a single Admin email.
- A fresh 6-digit OTP is generated only after an authorized active Admin is found.
- OTP validity is 60 seconds.
- EmailJS sends the OTP automatically when the configured service/template is available.
- The new password is persisted in the frontend Admin data store (`localStorage`) so it survives refresh in this frontend-only phase.

> This is still a frontend-only implementation. For production security, password hashes, OTPs, sessions, and authorization must be moved to a backend/database.

## GitHub commit
Commit only this folder when updating the existing repository:

```cmd
git add "Final Web/skilliant-admin"
git commit -m "Fix Admin portal connectivity and authentication"
git push origin main
```

When you later download the complete repository ZIP, keep all sibling portal folders in their existing locations.
