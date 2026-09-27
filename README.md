# Skilliant Admin Portal

## Overview

Skilliant Admin Portal is the central administration interface for the **Skilliant Online Labour Finding Platform**. It provides authorized administrators with a single place to manage users, labour profiles, contractors, categories, skills, bookings, payments, reports, notifications, support, activity logs, settings, administrators, and roles.

## Main Modules

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
- Support
- Activity Logs
- Settings
- Admin Management
- Role Management

## Platform Connectivity

The Admin Portal is designed to work with the wider Skilliant platform:

- **Marketing / Public Website** — public-facing entry point
- **User Portal** — customer/user activities
- **Labour Portal** — labour-provider activities
- **Contractor Portal** — contractor activities
- **Admin Portal** — centralized administrative management

Navigation between these interfaces is separate from backend data synchronization. Shared authentication and shared live data require the corresponding Supabase/backend configuration to be deployed and configured correctly.

## Core Data Relationships

```text
Users
  │
  ├── Bookings ─── Payments
  │                  │
  │                  └── Wallet / Transactions
  │
  ├── Support
  └── Notifications

Labour ──────── Bookings
Contractors ─── Bookings
Categories ─── Skills ─── Labour
Bookings ────── Reports
Payments ────── Reports
Users ───────── Reports
Notifications ── Activity Logs
```

## Authentication and Security

The portal supports:

- Supabase Authentication
- Email/password authentication
- Google OAuth
- Authorized administrator accounts
- Super Admin and Admin role handling
- Email OTP verification
- Password-reset OTP verification
- Password reset
- Role-based administrative access
- Supabase Row Level Security (RLS)
- Protected administrative backend functions

### Password Reset

```text
Enter Admin Email
      ↓
Check Authorized Admin Account
      ↓
Request OTP
      ↓
Verify OTP
      ↓
Enter New Password
      ↓
Reset Password
      ↓
Login
```

An unregistered or unauthorized email must not be allowed to obtain administrative access through password reset.

## Backend / Supabase

The application is designed to use Supabase for authentication and administrative data persistence. The frontend should contain only public client-side configuration. Private credentials must remain on the server/Edge Function side.

Expected backend capabilities include:

- Create Admin
- Delete Admin
- List Admins
- Update Admin
- Request Email OTP
- Verify Email OTP
- Request Password OTP
- Verify Password OTP
- Reset Password

## Environment Configuration

Example public frontend configuration:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_DEMO_MODE=false
```

Do not place private Supabase service-role credentials, OTP secrets, or other privileged credentials in frontend environment variables.

Typical backend secrets include:

```text
OTP_HASH_SECRET
EMAILJS_SERVICE_ID
EMAILJS_TEMPLATE_ID
EMAILJS_PUBLIC_KEY
```

## Running Locally

### Requirements

- Node.js
- npm
- Modern web browser
- Supabase project for live authentication/data functionality
- Configured email service for OTP functionality

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Testing

Run:

```bash
npm test
```

The automated validation checks JavaScript syntax, local references, authentication/OTP files, environment configuration, Git-ignore configuration, navigation routes, Supabase security configuration, administrator safeguards, button/controller wiring, inline button handlers, and duplicate report-export handlers.

Static validation does not replace a live deployment test. Real Google OAuth, Supabase authentication, database operations, and email delivery depend on correct external service configuration.

## Functionality Policy

The active build exposes implemented functionality rather than fake demo buttons. Unreachable legacy page implementations have been removed from the active build.

Production demo mode is disabled:

```env
VITE_DEMO_MODE=false
```

## Project Structure

```text
Skilliant_Admin/
├── index.html
├── package.json
├── README.md
├── .env
├── .gitignore
├── css/
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── dataService.js
│   └── pages/
│       ├── dashboard.js
│       ├── users.js
│       ├── labour.js
│       ├── contractors.js
│       ├── categories.js
│       ├── skills.js
│       ├── bookings.js
│       ├── payments.js
│       ├── reports.js
│       ├── notifications.js
│       ├── support.js
│       ├── activity.js
│       ├── settings.js
│       ├── admins.js
│       └── roles.js
├── supabase/
│   └── functions/
└── scripts/
    └── test.cjs
```

## Deployment

The Admin Portal can be deployed on Vercel or another compatible hosting provider.

For Vercel:

1. Import the repository/project.
2. Set the required environment variables.
3. Configure the build command.
4. Deploy.
5. Configure Supabase authentication redirect URLs.
6. Configure Google OAuth redirect URLs if Google login is enabled.
7. Deploy and configure required Supabase Edge Functions and backend secrets.
8. Test authentication, OTP, database access, and administrative workflows.

Do not commit private credentials to GitHub.

## Git Workflow

Repository:

```text
https://github.com/semiquantum/skilliant
```

Use the `meet` branch for Admin Portal work and preserve existing history:

```bash
git checkout meet
git pull origin meet

git add skilliant-admin
git commit -m "Update Skilliant Admin Portal"
git push origin meet
```

Do not push these changes to `main` unless explicitly required.

## Production Verification

Before production use, verify:

- Supabase URL and public key
- Supabase Authentication settings
- Google OAuth configuration, if enabled
- Authentication redirect URLs
- Supabase database tables
- RLS policies
- Supabase Edge Functions
- Edge Function secrets
- Email/OTP service
- Production environment variables
- CORS/allowed origins where applicable

Never expose service-role keys, database passwords, private API keys, OTP hashing secrets, or other server-side credentials in the frontend.

## Troubleshooting

### Login does not work

Check Supabase environment variables, Auth configuration, the authorized admin record, browser console, network requests, and Supabase authentication logs.

### Google Sign-In does not work

Check Google OAuth provider configuration, Google Cloud OAuth credentials, Supabase redirect URLs, production domain, and authorized redirect URIs.

### OTP is not received

Check Edge Function deployment, email service configuration, backend secrets, email template/service identifiers, and Supabase Function logs.

### Data does not synchronize

Check the authenticated session, Supabase URL/key, database tables, RLS policies, Edge Functions, browser Network tab, and Supabase logs.

### Buttons do not respond

Check the browser console, required JavaScript files, controller registration, event-handler errors, and deployment asset paths. Then run:

```bash
npm test
```

## Final Checklist

- [ ] `npm install` completes successfully
- [ ] `npm test` passes
- [ ] `npm run build` succeeds
- [ ] `.env` is not committed
- [ ] private credentials are not exposed
- [ ] Supabase is configured
- [ ] RLS policies are enabled
- [ ] Edge Functions are deployed
- [ ] OTP service is configured
- [ ] Google OAuth is configured if required
- [ ] authorized Admin account exists
- [ ] password reset is tested
- [ ] module navigation is tested
- [ ] cross-module operations are tested with real backend data
- [ ] production environment variables are configured
- [ ] final deployment is tested

## Version

**Skilliant Admin Portal v1.4.0**

Central administration interface for the Skilliant Online Labour Finding Platform.
