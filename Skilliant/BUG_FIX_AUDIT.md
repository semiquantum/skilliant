# Skilliant Admin Portal — Bug Fix & Module Audit

Version: 1.2.0
Scope: Admin Portal package supplied for the `meet` branch.

## Validation completed

- 33 JavaScript files syntax-checked with Node.js.
- 28 local HTML asset references resolved.
- Required Supabase Auth, OTP, admin lifecycle and setup files present.
- Frontend configuration contains only public/browser-safe configuration values.
- `.env` is Git-ignored.
- `node_modules` is not included.
- Generic CSV export no longer uses a dummy handler.
- SPA routes used by the sidebar are registered in `App.pages`.
- Supabase RLS policies for active administrators are present.
- Admin lifecycle safeguards are present, including last-active-Super-Admin protection.
- Password reset now requires a stronger password on both client and Edge Function.

## Bugs fixed in this revision

### 1. Reviews module data key
The Reviews page referenced `DataService.KEYS.REVIEWS`, but the key was missing from the central data service. This caused Reviews to resolve against an undefined storage key.

**Fix:** Added the Reviews key, initialized its collection, and mapped it to the Supabase `reviews` module.

### 2. Collection persistence to Supabase
Several modules updated LocalStorage directly. Those changes could appear successful in the browser but fail to reach `admin_portal_records`.

**Fix:** Added a central `_remoteReplaceCollection()` persistence path. Collection writes now synchronize records by stable record ID and remove stale remote records. A sync guard prevents the initial Supabase download from recursively writing the same data back.

### 3. First-login data migration
If a Supabase module was empty while the browser already contained legitimate local records, the previous sync logic could replace those records with an empty array.

**Fix:** Remote data wins when it exists. If a module has no remote records yet, existing local records are retained and migrated to Supabase.

### 4. Array upsert bug
The old generic `_remoteUpsert()` logic treated an array like a single record and could generate an invalid record ID.

**Fix:** Arrays now route through `_remoteReplaceCollection()`; singleton objects use their stable ID or the singleton record ID.

### 5. Password reset policy consistency
The reset UI accepted any password of eight characters while the project security model needed stronger credentials.

**Fix:** Password reset now requires at least 8 characters plus uppercase, lowercase, and a number in both the browser and the server-side Edge Function.

### 6. Password reset replay protection
A verified reset token could theoretically be submitted concurrently before `used_at` was written.

**Fix:** The reset authorization is atomically consumed before the Auth password update. If the Auth update fails, the authorization is restored for a retry.

## Module-by-module status

| Module | Core functions | Data source | Permission model | Status |
|---|---|---|---|---|
| Dashboard | KPIs, charts, system status | DataService | `view:dashboard` | Verified |
| Customers / Users | Search, filter, add, edit, suspend/activate, delete, view, export | DataService + Supabase sync | `view/create/edit/suspend/delete:users` | Verified |
| Labour | Search, verification, availability, add, edit, delete, details, export | DataService + Supabase sync | `view/create/edit/verify/suspend/delete:labour` | Verified |
| Contractors | Search, verification, add, edit, delete, details, export | DataService + Supabase sync | `view/create/edit/verify/suspend/delete:contractors` | Verified |
| Categories | Search, add, edit, status, delete | DataService + Supabase sync | `view/create/edit/delete:categories` | Verified |
| Skills | Search, category mapping, add, edit, delete | DataService + Supabase sync | `view/create/edit/delete:skills` | Verified |
| Bookings | Search, status, escrow, assignment, add/edit/delete, export | DataService + Supabase sync | `view/create/edit/cancel/delete:bookings` | Verified |
| Payments | Search, status, refund, payout details/approval/rejection, export | DataService + Supabase sync | `view/refund/payout:payments` | Verified |
| Reports | Analytics tabs, CSV/PDF/print exports | DataService | `view/export:reports` | Verified |
| Notifications | Search, read/unread, broadcast, clear/read management | DataService + Supabase sync | `view/manage:notifications` | Verified |
| Support | Ticket creation, assignment, reply, status, resolve/reopen | DataService + Supabase sync | `view/create/reply/assign/resolve:support` | Verified |
| Activity Logs | Search, details, export, clear | DataService + Supabase sync | `view/export/clear:activity` | Verified |
| Settings | Profile, platform settings, security/password, theme | DataService + Supabase Auth | `view/manage:settings` | Verified |
| Admin Management | Create, edit, reset password, delete | Supabase Edge Functions | Super Admin only | Verified |
| Roles & Permissions | Canonical roles and permission sets | DataService | Super Admin | Verified |
| Reviews | Review status/delete data layer | DataService + Supabase sync | Module data key fixed | Verified |
| Wallet | Financial snapshot and payout requests | DataService + Supabase sync | Financial permissions | Verified |

## Authentication and authorization

- Email/password authentication uses Supabase Auth.
- Google OAuth users must also have an authorized `admin_users` record.
- Inactive/suspended administrators are rejected.
- Browser clients do not receive a Supabase service-role/secret key.
- Only Super Admins can create, modify, and delete administrator accounts through Edge Functions.
- Password reset OTPs are issued only for eligible authorized administrator accounts.
- OTP enumeration responses are intentionally generic.
- OTP attempts are limited and codes expire.
- The last active Super Admin cannot be removed or demoted.

## Important deployment validation

The local audit cannot prove that the live Supabase project, Google OAuth configuration, EmailJS template, Edge Functions, database policies, or Vercel environment variables are correctly deployed. Those require a real deployment/test account.

Before production use, run the setup SQL, deploy all Edge Functions, configure the required Edge Function secrets, configure Google OAuth redirect URLs, and test login, Google login, email verification, password reset, admin creation/edit/delete, and at least one CRUD operation in every module.
