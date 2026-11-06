create extension if not exists pgcrypto;

do $$ begin
  create type public.product_section as enum ('kiyimlar', 'look');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.order_status as enum ('pending', 'waiting_confirmation', 'paid', 'rejected');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.message_direction as enum ('in', 'out');
exception when duplicate_object then null; end $$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(), title text not null, description text,
  price numeric(12,2) not null check (price >= 0), sizes text[] not null default '{}',
  image_url text, section public.product_section not null, created_at timestamptz not null default now(),
  telegram_message_id bigint
);
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade, full_name text, phone text, created_at timestamptz not null default now()
);
create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
  text text not null, direction public.message_direction not null, telegram_message_id bigint, created_at timestamptz not null default now()
);
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
  items jsonb not null default '[]'::jsonb, total numeric(12,2) not null check (total >= 0),
  status public.order_status not null default 'pending', receipt_url text, created_at timestamptz not null default now()
);
create table if not exists public.bot_sessions (
  chat_id bigint primary key, step text not null, draft jsonb not null default '{}'::jsonb
);

alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.support_messages enable row level security;
alter table public.orders enable row level security;
alter table public.bot_sessions enable row level security;

drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products for select using (true);
drop policy if exists profiles_own on public.profiles;
create policy profiles_own on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists messages_own on public.support_messages;
create policy messages_own on public.support_messages for select using (auth.uid() = user_id);
drop policy if exists orders_own on public.orders;
create policy orders_own on public.orders for select using (auth.uid() = user_id);

insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict (id) do update set public = true;
insert into storage.buckets (id, name, public) values ('receipts', 'receipts', false) on conflict (id) do nothing;
drop policy if exists products_public_read on storage.objects;
create policy products_public_read on storage.objects for select using (bucket_id = 'products');
drop policy if exists receipts_own_read on storage.objects;
create policy receipts_own_read on storage.objects for select using (bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1]);
