# Production readiness

This ZIP contains no `node_modules` and no server-only secrets. The frontend includes only the Supabase URL, publishable key, Google Client ID, and EmailJS public identifiers.

Before production, you must still perform the live account configuration steps described in `SUPABASE_GOOGLE_SETUP.md`, `EMAILJS_SETUP.md`, and `VERCEL_SETUP.md`: run the SQL, create/bootstrap the first Super Admin, configure Google in Supabase, set Edge Function secrets, deploy Edge Functions, configure Supabase redirect URLs, add the final Vercel URL to Google/Supabase, and test an actual OTP email.

A local syntax/build check cannot prove a live OAuth or Gmail delivery transaction.
