# Skilliant User Portal - Favourite Labour Update

## Updates
- Improved Favourite Labour page dark-mode readability and contrast.
- Added a required "Why is this labour favourite?" reason when adding a new favourite.
- Added reason display and Edit reason action on every favourite card.
- Favourite reasons are persisted in localStorage.
- Existing favourite labour entries remain compatible; they can be given a reason using "Add reason".
- Light mode remains supported.

## Google sign-in setup

The portal now authenticates with Google through Supabase Auth. Before testing, complete the provider setup for the Supabase project referenced in `index.html`:

1. In Google Cloud / Google Auth Platform, create a **Web application** OAuth client. Add the deployed site URL (or `http://localhost:<port>` during development) to Authorized JavaScript origins.
2. Add the Supabase project's Google callback URL (`https://ufxjciojqupwhicaqngm.supabase.co/auth/v1/callback`) to Authorized redirect URIs.
3. In Supabase Dashboard, open **Authentication → Providers → Google**, enable the provider, and enter that client ID and client secret.
4. In **Authentication → URL Configuration**, set the Site URL and add the exact deployed portal URL to the Redirect URLs allow list.

Serve the folder through a local web server when developing; OAuth cannot reliably return to a `file://` page. For example: `npx serve .`
