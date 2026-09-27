# Skilliant Admin Portal

## Version 1.2.0

This package contains the repaired Admin Portal with centralized module persistence, Reviews data-layer repair, Supabase collection synchronization, and strengthened password-reset validation. See `BUG_FIX_AUDIT.md` for the module-by-module audit and deployment validation checklist.

# Skilliant Admin Portal

Production-oriented static admin frontend using Supabase Auth, Google OAuth, OTP verification, RLS, protected Supabase Edge Functions, and functional management/export controls.

## What is intentionally NOT included
- No public Sign Up page.
- No administrator password in localStorage.
- No Supabase service-role/secret key in the browser.
- No Google OAuth client secret in frontend files.
- No fake administrator account is seeded in production mode.

## Latest bug fixes

- CSV controls without page-specific exporters now export the visible data table instead of being dummy buttons.
- CSV export excludes Actions/Options columns and safely escapes spreadsheet-formula prefixes.
- Pagination automatically clamps to the last valid page after filtering or deletion.
- Administrator edit output is HTML-escaped.
- Administrator updates cannot remove the last active Super Admin.
- Editing an administrator without changing the email no longer resets email verification.
- Administrator authentication/profile changes are synchronized with authorization data, with rollback attempted if the database update fails.
- New administrator creation rolls back if the required verification email cannot be issued.
- `.env` is explicitly Git-ignored; the packaged `.env` contains only public frontend configuration.

## Local run

```bash
npm install
npm start
```

Open `http://localhost:5173`.

## Environment

Copy `.env.example` to `.env` and set:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
VITE_DEMO_MODE=false
```

`VITE_DEMO_MODE=true` is only for local UI demonstrations. Keep it `false` for production.

## Supabase setup

1. Run `SUPABASE_SETUP.sql` in the Supabase SQL Editor.
2. Configure Google under Authentication -> Providers -> Google.
3. Google callback:
   `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
4. Configure the production/local redirect URLs in Authentication -> URL Configuration.
5. Deploy all functions under `supabase/functions/`.
6. Configure Edge Function secrets: `OTP_HASH_SECRET`, `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`, and optionally `ALLOWED_ORIGINS`. Supabase injects its own `SUPABASE_SECRET_KEYS` automatically; do not create a custom `SUPABASE_*` secret.
7. Create the first Supabase Auth user manually and add the same UUID to `public.admin_users` as an active `Super Admin`.

## Admin security model

There is no self-registration. Only an active administrator in `public.admin_users` can enter the portal. Only an active Super Admin can create, edit, or delete administrators. New admins receive email verification OTP. Password recovery uses a separate six-digit OTP.

## Vercel

Set only these browser variables in Vercel:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_DEMO_MODE=false`

Never put `EMAILJS_SERVICE_ID / EMAILJS_TEMPLATE_ID / EMAILJS_PUBLIC_KEY`, `OTP_HASH_SECRET`, or a Google Client Secret in frontend code.

## Forgot Password OTP flow
1. User clicks **Forgot Password?**
2. User enters the email already authorized in `admin_users`.
3. `request-password-otp` creates a 6-digit OTP, hashes it, stores it for 10 minutes, and sends it through the configured email provider.
4. User enters the OTP. `verify-password-otp` verifies it and issues a short-lived, one-time reset authorization token.
5. User enters and confirms a new password.
6. `reset-password` validates the reset authorization and updates the Supabase Auth password.
7. The reset authorization is invalidated after successful use.

The browser never receives or stores the OTP hash, service-role key, or Supabase secret key.


## Project Structure

See `PROJECT_STRUCTURE.md` for the module and data architecture.

## Login Setup

See `LOGIN_SETUP.md` for the current Supabase authentication flow and historical development credentials.


## Final interaction rule

The shipped build contains only active, registered Admin modules. Unreachable legacy page implementations were removed, inline button handlers are statically validated, and demo-mode data generation remains disabled by default. Buttons are not presented as working features unless a real handler exists.
