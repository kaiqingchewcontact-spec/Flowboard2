-- ============================================
-- FLOWBOARD — Stripe Subscriptions Migration
-- Run this in your Supabase SQL Editor
-- ============================================

-- ─────────────────────────────────────────────
-- SUBSCRIPTIONS
-- ─────────────────────────────────────────────
create table if not exists public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null unique,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null default 'free' check (plan in ('free', 'creator', 'pro')),
  status text not null default 'active' check (status in ('active', 'past_due', 'canceled', 'incomplete')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for fast lookups
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_stripe_customer on public.subscriptions(stripe_customer_id);

-- RLS
alter table public.subscriptions enable row level security;

create policy "Users can view their own subscription"
  on public.subscriptions for select using (true);

create policy "Service can manage subscriptions"
  on public.subscriptions for all using (true);

-- Auto-update timestamp
create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();
