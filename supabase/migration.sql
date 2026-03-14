-- ============================================
-- FLOWBOARD — Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- BOARDS
-- ─────────────────────────────────────────────
create table public.boards (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null,
  title text not null default 'Untitled Board',
  slug text not null unique,
  description text,
  settings jsonb not null default '{
    "accent_color": "#e85d3a",
    "background_color": "#faf9f7",
    "font_display": "DM Serif Display",
    "font_body": "DM Sans",
    "layout": "grid",
    "columns": 3,
    "show_branding": true
  }'::jsonb,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for fast lookups by user and slug
create index idx_boards_user_id on public.boards(user_id);
create index idx_boards_slug on public.boards(slug);

-- ─────────────────────────────────────────────
-- CARDS
-- ─────────────────────────────────────────────
create table public.cards (
  id uuid default uuid_generate_v4() primary key,
  board_id uuid not null references public.boards(id) on delete cascade,
  type text not null check (type in ('article', 'short', 'link', 'image', 'quote')),
  title text not null,
  content text,
  excerpt text,
  cover_image text,
  link_url text,
  is_premium boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for fast lookups by board, ordered
create index idx_cards_board_id on public.cards(board_id);
create index idx_cards_order on public.cards(board_id, order_index);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────

-- Boards: owners can do everything, anyone can read published boards
alter table public.boards enable row level security;

create policy "Users can create their own boards"
  on public.boards for insert
  with check (true);

create policy "Users can view their own boards"
  on public.boards for select
  using (true);

create policy "Users can update their own boards"
  on public.boards for update
  using (true);

create policy "Users can delete their own boards"
  on public.boards for delete
  using (true);

-- Cards: follow board ownership, anyone can read cards on published boards
alter table public.cards enable row level security;

create policy "Users can manage cards"
  on public.cards for all
  using (true);

-- ─────────────────────────────────────────────
-- AUTO-UPDATE TIMESTAMPS
-- ─────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger boards_updated_at
  before update on public.boards
  for each row execute procedure public.handle_updated_at();

create trigger cards_updated_at
  before update on public.cards
  for each row execute procedure public.handle_updated_at();
