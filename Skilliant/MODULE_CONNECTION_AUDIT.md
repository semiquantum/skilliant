# Skilliant Admin Portal — Module Connection Audit v1.4.0

## Scope
This release connects the active Admin modules through one shared DataService and Supabase persistence layer. No demo records are generated in production and no inactive legacy page is exposed.

## Active module relationships
- Users → Bookings, Payments, Support Tickets
- Labour → Bookings
- Contractors → Bookings
- Categories → Skills, Labour, Bookings
- Skills → Labour
- Bookings → Payments and financial/escrow calculations
- Payments → Bookings and Wallet/financial calculations
- Support → Users and Activity/Notifications
- Settings → Commission/financial calculations and theme
- Notifications → related module navigation and activity history
- Activity Logs → all important mutations
- Reports/Dashboard → derived from the same shared collections

## Persistence
All mapped production modules use `admin_portal_records` in Supabase. LocalStorage is the immediate UI cache. Remote writes are serialized per module so rapid edits/deletes cannot overwrite one another out of order.

## Data integrity fixes
- Stable IDs are ensured for collection records.
- Editing a user/labourer/contractor/category/skill propagates dependent display fields.
- Deleting a linked entity clears dependent references rather than leaving broken IDs.
- Deleting a booking removes its linked payment and recalculates financial state.
- Booking status changes keep its payment lifecycle aligned.
- Labour creation/editing now stores `skillId`, preserving the Skill → Labour relationship.
- Booking creation now stores `categoryId` and optional `contractorId`.

## Authentication boundary
Admin accounts and roles remain controlled by Supabase Auth + `admin_users` and their Edge Functions. The generic portal-record store is not used as a browser-side authentication bypass.

## Validation
- 25 JavaScript files syntax-checked.
- 28 local HTML references resolved.
- 58 inline button handlers validated.
- No duplicate Reports export-card click handlers.
- No `node_modules` included.
- Frontend contains only public Supabase configuration.

## Live integration note
The package is statically validated. A live Supabase request could not be executed in the build environment because external DNS/network access is unavailable. The actual Supabase Edge Functions, RLS, Google OAuth, and EmailJS delivery must therefore be verified after deployment in the user's Supabase/Vercel environment.
