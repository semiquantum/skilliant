# Skilliant Admin Portal — Project Structure

## Root

- `index.html` — Admin login shell and application mount.
- `css/` — Reset, variables, layout, components, authentication, animations and main styles.
- `js/` — Application runtime.
- `js/pages/` — One module per Admin Portal page.
- `js/services/` — Data and payment service layers.
- `supabase/functions/` — Server-side privileged operations and OTP/password flows.
- `supabase/` — Supabase configuration and SQL/RLS setup.
- `scripts/` — Local server, config generation and automated validation.
- `assets/` — Static project assets.
- `.env.example` — Public configuration template only.
- `.gitignore` — Prevents local environment files and dependencies from being committed.

## Application modules

### Core
- Dashboard
- Users
- Labour
- Contractors
- Categories
- Skills
- Bookings
- Payments
- Reports
- Notifications
- Support Tickets
- Activity Logs
- Settings
- Security
- Administrators
- Roles & Permissions
- Reviews
- Wallet

### Analytics/reporting
The existing analytics modules remain available in the source and are integrated into the reporting/navigation layer where appropriate. No business module is silently removed.

## Data architecture

```text
Browser UI
   |
   +--> DataService
   |      |
   |      +--> LocalStorage cache
   |      |
   |      +--> Supabase portal_records
   |
   +--> Auth
          |
          +--> Supabase Auth
          +--> admin_users authorization
          +--> Edge Functions for privileged admin operations
```

## Security boundary

The browser contains only public Supabase configuration. Service-role/private credentials must remain in Supabase server-side secrets and must never be placed in `js/supabase-config.js`, `.env` committed to Git, or frontend JavaScript.

## Validation status

Run:

```bash
npm test
```

The current automated suite checks JavaScript syntax, local HTML references, authentication/OTP assets, public-only frontend configuration, Git-ignored environment files, dependency exclusion, CSV/print controls, route registration, RLS/security markers, and administrator lifecycle safeguards.


## Active module rule

Only modules registered in `js/app.js` are shipped as active page modules. Legacy/unregistered duplicate analytics/security/wallet page files were removed so the package does not expose buttons for pages that cannot be reached.
