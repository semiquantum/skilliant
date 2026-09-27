# Skilliant Admin Portal — EmailJS OTP Setup

This project uses EmailJS for OTP delivery, with the OTP generation, hashing, expiration and verification performed by Supabase Edge Functions. EmailJS documents the REST `/send` endpoint and the required `service_id`, `template_id`, `user_id` (public key), and `template_params`.

## EmailJS values

Service ID: `service_3esiw4r`
Template ID: `template_4lylecr`
Public Key: `fmGD7PC2sp_2Z3NTF`

Do not put an EmailJS private key in this project.

## Template variables

The EmailJS template must use exactly these dynamic variables:

- `{{email}}` — recipient
- `{{name}}` — administrator name
- `{{passcode}}` — six-digit OTP
- `{{validity}}` — `10` minutes
- `{{purpose}}` — `password reset` or `email verification`
- `{{subject}}` — message purpose subject

The template can have the following subject:

`Skilliant Admin Portal - Password Reset OTP`

The Gmail service is the sender; `{{email}}` is the recipient, so different authorized administrators can receive their own OTP.

## Supabase Edge Function secrets

Set these in Supabase Edge Function secrets:

```text
OTP_HASH_SECRET=...
EMAILJS_SERVICE_ID=service_3esiw4r
EMAILJS_TEMPLATE_ID=template_4lylecr
EMAILJS_PUBLIC_KEY=fmGD7PC2sp_2Z3NTF
ALLOWED_ORIGINS=http://localhost:5173,https://YOUR-VERCEL-DOMAIN.vercel.app
```

Only `OTP_HASH_SECRET` is sensitive. The EmailJS public key is public, but keeping the EmailJS configuration in Edge Function secrets avoids duplicating configuration in application code. Do not create any custom secret whose name starts with `SUPABASE_`.

## Deploy functions

```bash
supabase login
supabase link --project-ref panvkamncrfazyrqdcpm
supabase functions deploy request-password-otp --no-verify-jwt
supabase functions deploy verify-password-otp --no-verify-jwt
supabase functions deploy reset-password --no-verify-jwt
supabase functions deploy request-email-otp --no-verify-jwt
supabase functions deploy verify-email-otp --no-verify-jwt
supabase functions deploy create-admin
supabase functions deploy list-admins
supabase functions deploy update-admin
supabase functions deploy delete-admin
```

Password-reset and email-verification endpoints are intentionally callable before a session exists, but they only operate on active authorized administrator records and use generic responses to avoid account enumeration.
