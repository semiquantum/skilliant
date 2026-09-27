# Skilliant Admin Portal — Login Setup

## Important distinction

The project has had more than one authentication implementation during development. The **latest v1.2.x build does not contain a hard-coded local admin password**. Login is intentionally controlled by Supabase Auth plus the `admin_users` authorization table.

### Historical initial local/demo credentials

An earlier local version used:

- Email: `admin@skilliant.com`
- Password: `admin123`

Another older local fallback version used the username/password pair:

- Username: `admin`
- Password: `adminpassword123`

These are **historical development credentials**, not guaranteed credentials for the current secure v1.2.x build.

## Current login flow

1. Create the administrator in Supabase Auth.
2. Confirm the administrator email.
3. Create/authorize the matching record in `public.admin_users` with an active role.
4. Open the Admin Portal.
5. Sign in with the Supabase email and password.
6. The portal verifies both the authenticated Supabase user and the authorized `admin_users` record.

An account that exists only in Supabase Auth but is not authorized in `admin_users` must not enter the Admin Portal.

## Do not hard-code production credentials

Do not put a real password into frontend JavaScript, GitHub, `.env.example`, screenshots, or public documentation. Use a real Supabase administrator account for the deployed environment and rotate any password that was used for testing.
