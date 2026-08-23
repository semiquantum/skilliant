# Skilliant Admin Portal — Final HREF Connectivity Build

## What this build contains

This package contains **only `skilliant-admin/`**.

It does **not** copy, merge, extract, or duplicate the Marketing, User, Contractor, or Labour portal files into the Admin folder.

The Admin Portal connects to the existing sibling portals using normal HTML relative `href` links.

## Required repository structure

Keep the existing GitHub repository structure unchanged:

```text
Final Web/
├── Contractor Portal/
│   └── skilliant-shruti/
│       └── skilliant/
│           └── index.html
├── Marketing/
│   └── index.html
├── skilliant-admin/
│   └── index.html
├── skilliant-labour-dashboard/
│   └── index.html
└── user portal final/
    └── index.html
```

**Important:** The other portals must remain beside `skilliant-admin` under `Final Web`. Do not place them inside `skilliant-admin`.

## Portal links

The Admin Portal uses these portable relative links:

| From Admin | Destination |
|---|---|
| Marketing Website | `../Marketing/index.html` |
| User Portal | `../user%20portal%20final/index.html` |
| Contractor Portal | `../Contractor%20Portal/skilliant-shruti/skilliant/index.html` |
| Labour Portal | `../skilliant-labour-dashboard/index.html` |
| Sign Out | `../Marketing/index.html` |

These paths contain **no Windows `C:\Users\...` path**, so they remain portable when the complete repository is downloaded to another location or computer, provided the `Final Web` structure is preserved.

## Local testing

This is a static HTML/CSS/JavaScript portal. **`npm start` is not required.**

1. Put/replace `skilliant-admin` inside the existing `Final Web` directory.
2. Open Command Prompt in the **`Final Web` directory** — not inside `skilliant-admin`.
3. Run:

```cmd
npx serve .
```

4. Open:

```text
http://localhost:3000/skilliant-admin/
```

5. Test login, Admin modules, portal links, and Sign Out.

### Why a server is recommended

Opening `skilliant-admin/index.html` directly with `file://` does not provide the same environment as a web server. Cross-folder navigation and browser security rules can behave differently. `npx serve .` serves the complete `Final Web` directory so the relative links can resolve correctly.

## GitHub workflow

Commit the **Admin changes** into the existing repository without merging the other portals into Admin:

```cmd
git add Final Web/skilliant-admin
git commit -m "Finalize Admin Portal HREF connectivity and local setup"
git push origin main
```

When downloading the project from GitHub, download the **complete repository ZIP**, not only the `skilliant-admin` folder. After extracting it, preserve the `Final Web` directory structure and run `npx serve .` from `Final Web` for local testing.

## Sign Out behavior

Admin Sign Out is a real anchor link:

```html
<a href="../Marketing/index.html" id="logoutBtn">Sign Out</a>
```

The Admin session is cleared by the existing logout handler, and the browser then follows the real HREF to the Marketing website.

## OTP / Forgot Password

The working Admin verification flow is preserved. This connectivity build does not replace the OTP logic.

Current EmailJS configuration remains in `js/email-config.js`. Do not commit private EmailJS secret/private credentials to a public repository.

The OTP flow is intended to:

- verify an existing authorized Admin account;
- generate a fresh 6-digit OTP;
- send the OTP to the matched Admin email;
- expire the OTP after 60 seconds;
- invalidate the previous OTP when a new one is generated;
- prevent password reset for an unknown or inactive account.

## Verification checklist

Before committing, test:

- [ ] Admin login
- [ ] Admin dashboard loads
- [ ] Sidebar navigation works
- [ ] Refresh keeps the current Admin route/session as intended
- [ ] Marketing link opens Marketing
- [ ] User Portal link opens User Portal
- [ ] Contractor Portal link opens Contractor Portal
- [ ] Labour Portal link opens Labour Portal
- [ ] Sign Out clears the Admin session and opens Marketing
- [ ] Forgot Password opens its professional reset flow
- [ ] Authorized Admin receives/enters OTP successfully
- [ ] Invalid/unregistered Admin is rejected
- [ ] OTP expires after 60 seconds
- [ ] No portal files are copied into `skilliant-admin`

## Important limitation

The current phase is **frontend/static connectivity**. Relative HREF navigation connects the existing portal files; it does not create a shared backend session between separate portals. Shared authentication across portals requires a common backend/authentication service when that phase is implemented.
