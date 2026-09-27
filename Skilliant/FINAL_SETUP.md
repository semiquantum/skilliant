# Skilliant Final Deployment Checklist

This package contains the connected frontend, Supabase Auth integration, Google OAuth configuration, EmailJS OTP Edge Functions, admin authorization, password reset flow, RLS schema, and generic portal-record persistence.

## 1. Supabase SQL
Run `SUPABASE_SETUP.sql` once in the Supabase SQL Editor.

## 2. Edge Function custom secrets
In Supabase -> Edge Functions -> Secrets, configure only:

```text
OTP_HASH_SECRET
EMAILJS_SERVICE_ID=service_3esiw4r
EMAILJS_TEMPLATE_ID=template_4lylecr
EMAILJS_PUBLIC_KEY=fmGD7PC2sp_2Z3NTF
```

Do not create a custom secret beginning with `SUPABASE_`. Supabase automatically injects `SUPABASE_URL` and `SUPABASE_SECRET_KEYS` into Edge Functions.

## 3. Deploy
From this project folder:

```powershell
supabase login
supabase link --project-ref panvkamncrfazyrqdcpm
supabase functions deploy
```

## 4. Google OAuth
- Supabase -> Authentication -> Providers -> Google: enable Google.
- Put the Google Web Client ID and Client Secret there.
- Google Authorized redirect URI:
  `https://panvkamncrfazyrqdcpm.supabase.co/auth/v1/callback`
- After Vercel deployment, set Supabase Authentication -> URL Configuration Site URL and Redirect URLs to the real production URL.

## 5. First Super Admin
1. Create the first user in Supabase Authentication -> Users.
2. Copy that user's UUID.
3. Insert an active `Super Admin` row in `public.admin_users` using the example in `SUPABASE_SETUP.sql`.
4. Log into Skilliant with that same Auth account.

## 6. OTP template
EmailJS template `template_4lylecr` should accept:

```text
{{name}}
{{email}}
{{passcode}}
{{validity}}
{{purpose}}
{{subject}}
```

OTP generation, hashing, expiration, attempt limits, and verification happen inside the Edge Functions.

## 7. Frontend/Vercel variables
Only public variables belong in Vercel:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_GOOGLE_CLIENT_ID
VITE_EMAILJS_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID
VITE_EMAILJS_PUBLIC_KEY
VITE_DEMO_MODE=false
```

Never add a Supabase secret key, OTP hash secret, Google Client Secret, or EmailJS private key to Vercel frontend variables.

## 8. Important scope
The portal's existing business modules use the `admin_portal_records` JSON store for authenticated persistence. This keeps the current UI connected without inventing a new relational schema for Users, Labour, Contractors, Bookings, Payments, Wallet, Reports, etc. The production authentication/authorization and OTP paths are server-enforced.
