# Skilliant Admin Portal — Button & Interaction Audit

## Issue fixed

The portal rendered many actions using inline `onclick="..."` handlers. JavaScript controllers were declared with top-level `const` bindings. Top-level `const` bindings are not properties of `window`, so browser inline handlers and code paths that explicitly used `window.Auth`, `window.App`, or `window.ModalManager` could fail even though the methods existed.

This was especially important for:

- Forgot Password
- Email Verification
- Google Sign-In state handling
- Admin management actions
- CRUD action buttons
- Pagination
- Export/Print controls
- Settings actions
- Security actions
- Notification actions
- Dynamic modal actions

## Fix

The final application explicitly exposes the shared controllers/services on `window` after all page modules have loaded. This keeps the existing HTML/module structure intact while making dynamic button handlers resolve correctly.

## Interaction coverage

### Authentication
- Sign In
- Google Sign In
- Password visibility toggle
- Forgot Password
- Send OTP
- Verify OTP
- Resend OTP
- Reset Password
- Email Verification
- Send verification OTP
- Verify email OTP

### Global UI
- Sidebar open/close
- Profile menu
- Notification menu
- Mark all notifications read
- Fullscreen
- Theme toggle
- Modal close/cancel/submit
- Global search
- Logout

### Management modules
- Add
- Edit
- View/details
- Status/verification toggles
- Delete
- Search/filter
- Pagination
- CSV export
- Print/PDF export where supported

### Administration
- Add administrator
- Edit administrator
- Reset administrator password flow
- Delete administrator
- Role/permission editing

### Security & Settings
- Change password
- Password visibility toggles
- Session revoke
- Profile save
- Platform settings save
- Light/Dark theme

## Validation

The project test suite now also verifies that the required controller/service globals used by dynamic button handlers are exposed.
