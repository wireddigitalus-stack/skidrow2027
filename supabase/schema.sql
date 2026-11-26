-- Skid Row 2027 — Supabase PostgreSQL Schema
-- Run this entire script in your Supabase Project → SQL Editor

create extension if not exists "pgcrypto";

-- 1. Mailing List & Pre-Sale Leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null default '',
  last_name text not null default '',
  email text not null unique,
  phone text not null default '',
  zip_code text not null default '',
  source_page text not null default '/',
  utm_source text not null default '',
  utm_campaign text not null default '',
  status text not null default 'active' check (status in ('active', 'vip', 'unsubscribed')),
  mailerlite_status text not null default 'pending' check (mailerlite_status in ('pending', 'synced', 'error')),
  mailerlite_synced_at timestamptz,
  mailerlite_error text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);

-- Safe upgrade statements for existing databases
alter table public.leads add column if not exists zip_code text not null default '';
alter table public.leads add column if not exists mailerlite_status text not null default 'pending';
alter table public.leads add column if not exists mailerlite_synced_at timestamptz;
alter table public.leads add column if not exists mailerlite_error text not null default '';

create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_leads_status on public.leads (status);

-- 2. Live News / Blog Posts CMS
create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  date_label text not null,
  iso_date date not null default current_date,
  read_time text not null default '2 min read',
  category text not null default 'Band News' check (category in ('Tour', 'Music', 'Band News', 'Solo / Press')),
  image_url text not null default '/images/hero-band.jpg',
  excerpt text not null default '',
  body jsonb not null default '[]'::jsonb,
  cta_label text not null default '',
  cta_url text not null default '',
  tags text[] not null default '{}'::text[],
  status text not null default 'published' check (status in ('published', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_news_posts_status_date on public.news_posts (status, iso_date desc);

-- 3. First-Party Fan Telemetry & Click Analytics
create table if not exists public.telemetry_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  event_type text not null check (event_type in ('pageview', 'click', 'video_play', 'signup')),
  path text not null default '/',
  target_label text not null default '',
  target_url text not null default '',
  referrer text not null default '',
  utm_source text not null default '',
  device_type text not null default 'mobile' check (device_type in ('mobile', 'tablet', 'desktop')),
  country text not null default '',
  city text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_telemetry_created_at on public.telemetry_events (created_at desc);
create index if not exists idx_telemetry_event_type on public.telemetry_events (event_type);
create index if not exists idx_telemetry_path on public.telemetry_events (path);

-- 4. Backstage Admin Audit Logs
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  details text not null default '',
  ip text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_created_at on public.admin_audit_logs (created_at desc);

-- Lock down all tables with Row Level Security (only server-side service_role key can read/write)
alter table public.leads enable row level security;
alter table public.news_posts enable row level security;
alter table public.telemetry_events enable row level security;
alter table public.admin_audit_logs enable row level security;

-- Optional Storage Bucket for CMS Media Uploads (create via Dashboard or uncomment below)
-- insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict do nothing;
