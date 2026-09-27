# Skilliant Admin Portal — Vercel Deployment

## Before deployment

1. Run `SUPABASE_SETUP.sql` in the Supabase SQL Editor.
2. Configure Google in Supabase Authentication -> Providers -> Google.
3. Use the Supabase callback URI in Google:

`https://panvkamncrfazyrqdcpm.supabase.co/auth/v1/callback`

4. Deploy all Edge Functions in `supabase/functions/` with `supabase functions deploy`.
5. Configure Edge Function secrets from `SUPABASE_SECRETS.example`.

## Vercel environment variables

Add these under Vercel Project -> Settings -> Environment Variables:

```text
VITE_SUPABASE_URL=https://panvkamncrfazyrqdcpm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your publishable key>
VITE_GOOGLE_CLIENT_ID=<your Google Web Client ID>
```

Do not add the Supabase service-role/secret key as a browser variable.

## Build settings

Framework preset: `Other`

Build command:

`npm run build`

Output directory:

`.`

Install command:

`npm install`

The build script generates `js/supabase-config.js` from the public `VITE_*` environment variables.

## After the first Vercel deployment

Copy the exact production URL, for example:

`https://skilliant-admin.vercel.app`

Add it to:

### Google Cloud OAuth client

Authorized JavaScript origins:

`https://skilliant-admin.vercel.app`

Keep the Supabase callback as the Authorized redirect URI:

`https://panvkamncrfazyrqdcpm.supabase.co/auth/v1/callback`

### Supabase Authentication -> URL Configuration

Set the production Site URL to the Vercel URL and add the production URL to Redirect URLs.

For preview deployments, use the appropriate Vercel wildcard only if you intentionally want preview URLs to be allowed.
