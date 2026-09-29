-- ORVIA Brand Control governance schema.
-- Internal control-plane tables. Server-side service-role access only.
-- RLS is enabled deliberately; no anon/authenticated policies are created.

create extension if not exists pgcrypto;

create table if not exists public.brand_system_releases (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  manifest jsonb not null,
  status text not null default 'draft'
    check (status in ('draft','approved','retired')),
  approved_by text,
  approved_at timestamptz,
  source_commit text,
  created_at timestamptz not null default now()
);

create table if not exists public.brand_site_registry (
  site_key text primary key,
  display_name text not null,
  product_id text,
  canonical_domain text,
  github_repo text,
  vercel_project text,
  template_class text,
  manifest_version text,
  lifecycle_state text not null default 'active'
    check (lifecycle_state in ('active','preview','hold','legacy','retired')),
  compliance_status text not null default 'not_verified'
    check (compliance_status in ('not_verified','pass','attention','blocked')),
  last_verified_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.brand_change_log (
  id uuid primary key default gen_random_uuid(),
  site_key text references public.brand_site_registry(site_key) on delete set null,
  instruction text not null,
  source_system text not null default 'IRIS',
  source_reference text,
  previous_commit text,
  new_commit text,
  approval_status text not null default 'required'
    check (approval_status in ('required','approved','rejected','not_required')),
  verification_status text not null default 'pending'
    check (verification_status in ('pending','pass','fail','rolled_back')),
  verified_by text,
  verified_at timestamptz,
  rollback_reference text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.brand_system_releases enable row level security;
alter table public.brand_site_registry enable row level security;
alter table public.brand_change_log enable row level security;

comment on table public.brand_system_releases is
'Canonical approved ORVIA Brand & Web System releases. Internal service-role access only.';
comment on table public.brand_site_registry is
'Controlled registry of ORVIA web properties and their inherited brand-system state.';
comment on table public.brand_change_log is
'Auditable IRIS-routed website and brand change history with VERA verification state.';
