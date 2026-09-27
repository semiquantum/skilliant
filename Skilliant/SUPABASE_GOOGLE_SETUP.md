# Skilliant Admin Portal — Supabase + Google + OTP Setup

This project is prepared for:

- Supabase email/password authentication
- Google OAuth
- Active-admin authorization
- Email verification
- Password-reset OTP delivered to the administrator email
- Server-side administrator creation through an Edge Function
- RLS protection

## 1. Create/configure Supabase

1. Create a Supabase project.
2. Run `SUPABASE_SETUP.sql` in SQL Editor.
3. Create the first Auth user in Authentication -> Users.
4. Copy that user's UUID and insert the first `Super Admin` row using the example in the SQL file.
5. Configure Auth email templates and your production Site URL.
6. The current Supabase API-key system injects `SUPABASE_SECRET_KEYS` into Edge Functions; do not create a custom secret named `SUPABASE_SERVICE_ROLE_KEY`.

## 2. Frontend configuration

Edit `js/supabase-config.js`:

```js
window.SKILLIANT_SUPABASE = {
  url: 'https://YOUR_PROJECT.supabase.co',
  publishableKey: 'YOUR_PUBLISHABLE_KEY',
  functions: {
    requestPasswordOtp: 'request-password-otp',
    verifyPasswordOtp: 'verify-password-otp',
    createAdmin: 'create-admin'
  }
};
```

Only the public/publishable key belongs here. Never place `service_role` or a secret key in frontend JavaScript.

## 3. Google OAuth

In Google Cloud Console create a Web OAuth client and add the Supabase callback URL shown in Supabase Authentication -> Providers -> Google.

Enable Google provider in Supabase and enter the Client ID and Client Secret there.

For local development, add your local application URL to the allowed redirect/origin configuration as required by Google and Supabase.

## 4. Password-reset OTP email

The custom password-reset OTP uses a Supabase Edge Function. The function uses EmailJS as the email delivery provider so the OTP can be delivered to any Gmail/Google Workspace inbox.

Set Edge Function secrets (not frontend variables):

```text
OTP_HASH_SECRET=...
EMAILJS_SERVICE_ID / EMAILJS_TEMPLATE_ID / EMAILJS_PUBLIC_KEY=...
EmailJS Gmail service=Skilliant Admin <noreply@your-verified-domain.com>
```

`OTP_HASH_SECRET` should be a long random value. The service-role key must never be exposed to the browser.

## 5. Deploy Edge Functions

Install/login to the Supabase CLI, link the project, then deploy all functions:

```bash
supabase login
supabase link --project-ref panvkamncrfazyrqdcpm
supabase functions deploy
```

The project `supabase/config.toml` already marks the pre-session OTP endpoints with `verify_jwt = false`; the admin-management functions remain JWT-protected.

Configure these **custom** Edge Function secrets in Dashboard -> Edge Functions -> Secrets:

```text
OTP_HASH_SECRET=...
EMAILJS_SERVICE_ID=service_3esiw4r
EMAILJS_TEMPLATE_ID=template_4lylecr
EMAILJS_PUBLIC_KEY=fmGD7PC2sp_2Z3NTF
```

Do not create `SUPABASE_SERVICE_ROLE_KEY` as a custom secret. Supabase injects `SUPABASE_SECRET_KEYS` automatically into Edge Functions.

## 6. Admin creation

The Admin Management page now calls the `create-admin` Edge Function instead of storing a password in localStorage. Only an active `Super Admin` can create another administrator.

## 7. Login security

The browser accepts a Supabase session only after:

1. Supabase authentication succeeds.
2. The Auth user has a confirmed email.
3. A matching `admin_users` row exists.
4. `status = 'Active'`.
5. The account is therefore authorized for the portal.

A Google account that is not already authorized is denied access.

## 8. Password reset

`Forgot Password` requests a six-digit OTP. The OTP is hashed in `admin_otp_codes`, expires after 10 minutes, has limited attempts, and is invalidated after use. After successful OTP verification, the trusted Edge Function updates the Auth password.

## 9. Important scope note

The existing Skilliant dashboard/domain pages contain frontend demo/localStorage data structures. This package hardens and completes the authentication/authorization layer and removes insecure browser-side administrator password creation. To make Users, Contractors, Bookings, Payments, Wallet, Reports, Notifications, etc. fully database-backed, their corresponding production Supabase tables and CRUD policies must be defined against the real Skilliant data model; those tables should not be invented from UI mock data.
