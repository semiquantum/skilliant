# Skilliant Security Checklist

- [x] Supabase session is the authentication source of truth.
- [x] Google OAuth is supported.
- [x] Google accounts are checked against `admin_users`.
- [x] Active status is required.
- [x] Confirmed email is required.
- [x] Browser does not create admin passwords.
- [x] Admin creation goes through a trusted Edge Function.
- [x] Service-role key is not included in frontend files.
- [x] OTP is hashed and expires.
- [x] OTP attempts are limited.
- [x] OTP is invalidated after successful use.
- [x] RLS protects authorization records.

## Before production

- Configure Google OAuth in Supabase and Google Cloud.
- Configure your production Site URL and redirect URLs.
- Deploy the three Edge Functions.
- Set Edge Function secrets.
- Create and authorize the first Super Admin.
- Test authorized and unauthorized Google accounts.
- Test password login, email verification, OTP reset, logout, and inactive-admin blocking.
- Define production schemas/RLS for domain modules before replacing their local demo data.
