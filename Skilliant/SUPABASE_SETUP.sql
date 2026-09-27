-- ============================================================
-- SKILLIANT ADMIN PORTAL - SUPABASE SECURITY SCHEMA
-- Run in Supabase SQL Editor.
-- Never put a service_role/secret key in browser code.
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  role text not null default 'Admin' check (role in ('Super Admin','Admin','Financial Admin')),
  status text not null default 'Active' check (status in ('Active','Inactive','Suspended')),
  profile_photo text,
  email_verified boolean not null default false,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_otp_codes (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.admin_users(id) on delete cascade,
  email text not null,
  otp_hash text not null,
  purpose text not null check (purpose in ('PASSWORD_RESET','EMAIL_VERIFICATION','LOGIN')),
  expires_at timestamptz not null,
  attempts integer not null default 0,
  max_attempts integer not null default 5,
  used_at timestamptz,
  verified_at timestamptz,
  reset_token_hash text,
  reset_token_expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.admin_otp_codes add column if not exists verified_at timestamptz;
alter table public.admin_otp_codes add column if not exists reset_token_hash text;
alter table public.admin_otp_codes add column if not exists reset_token_expires_at timestamptz;

create index if not exists admin_otp_email_purpose_idx on public.admin_otp_codes(email, purpose, created_at desc);
create index if not exists admin_otp_reset_token_idx on public.admin_otp_codes(reset_token_hash) where reset_token_hash is not null;
create index if not exists admin_users_status_idx on public.admin_users(status);

alter table public.admin_users enable row level security;
alter table public.admin_otp_codes enable row level security;

drop policy if exists "admin_users_self_read" on public.admin_users;
create policy "admin_users_self_read"
on public.admin_users for select to authenticated
using (id = auth.uid());

-- OTP rows are never readable/writable by browser clients.
drop policy if exists "otp_no_direct_client_access" on public.admin_otp_codes;
-- No policy means authenticated/anon users have no table access under RLS.

revoke insert, update, delete on public.admin_users from anon, authenticated;
revoke all on public.admin_otp_codes from anon, authenticated;
grant select on public.admin_users to authenticated;

-- Keep updated_at current.
create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_admin_users_updated_at on public.admin_users;
create trigger trg_admin_users_updated_at
before update on public.admin_users
for each row execute function public.set_updated_at();

-- IMPORTANT: Create your first Auth user in Supabase Dashboard, copy its UUID,
-- then insert an authorization row. Example:
-- insert into public.admin_users (id,email,full_name,role,status,email_verified)
-- values ('AUTH-USER-UUID','admin@example.com','Super Admin','Super Admin','Active',true);

-- ============================================================
-- GENERIC ADMIN PORTAL DATA STORE
-- The existing frontend modules use different record shapes. This
-- table stores each module's JSON record while RLS enforces that
-- only active administrators can access it. It can later be
-- migrated to dedicated relational tables without changing the UI.
-- ============================================================
create table if not exists public.admin_portal_records (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  record_id text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(module, record_id)
);

create index if not exists admin_portal_records_module_idx on public.admin_portal_records(module);
create index if not exists admin_portal_records_updated_idx on public.admin_portal_records(updated_at desc);

alter table public.admin_portal_records enable row level security;

create or replace function public.is_active_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users a
    where a.id = auth.uid() and a.status = 'Active'
  );
$$;

revoke all on function public.is_active_admin() from public;
grant execute on function public.is_active_admin() to authenticated;

drop policy if exists "active_admin_read_portal_records" on public.admin_portal_records;
create policy "active_admin_read_portal_records"
on public.admin_portal_records for select to authenticated
using (public.is_active_admin());

drop policy if exists "active_admin_insert_portal_records" on public.admin_portal_records;
create policy "active_admin_insert_portal_records"
on public.admin_portal_records for insert to authenticated
with check (public.is_active_admin());

drop policy if exists "active_admin_update_portal_records" on public.admin_portal_records;
create policy "active_admin_update_portal_records"
on public.admin_portal_records for update to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "active_admin_delete_portal_records" on public.admin_portal_records;
create policy "active_admin_delete_portal_records"
on public.admin_portal_records for delete to authenticated
using (public.is_active_admin());

create or replace function public.set_portal_record_updated_at()
returns trigger language plpgsql security invoker as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_admin_portal_records_updated_at on public.admin_portal_records;
create trigger trg_admin_portal_records_updated_at
before update on public.admin_portal_records
for each row execute function public.set_portal_record_updated_at();

-- After running this file, configure these CUSTOM Edge Function secrets in
-- Supabase Dashboard -> Edge Functions -> Secrets:
-- OTP_HASH_SECRET            (long random secret)
-- EMAILJS_SERVICE_ID         (EmailJS Service ID)
-- EMAILJS_TEMPLATE_ID        (EmailJS Template ID)
-- EMAILJS_PUBLIC_KEY         (EmailJS Public Key)
-- ALLOWED_ORIGINS             (comma-separated production/local origins; optional during testing)
--
-- Supabase's own SUPABASE_URL and SUPABASE_SECRET_KEYS are injected automatically
-- into Edge Functions. Do not create a custom secret whose name starts with SUPABASE_.
