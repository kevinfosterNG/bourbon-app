-- Bourbon Finder MVP schema for Supabase Postgres

create table if not exists public.bottles (
  id text primary key,
  name text not null,
  distillery text not null,
  proof numeric not null,
  category text not null,
  image_url text,
  flavor_tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.stores (
  id text primary key,
  name text not null,
  lat double precision not null,
  lng double precision not null,
  city text not null,
  state text not null,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.listings (
  id text primary key,
  bottle_id text not null references public.bottles(id) on delete cascade,
  store_id text not null references public.stores(id) on delete cascade,
  price numeric(10,2) not null,
  in_stock boolean not null default true,
  last_updated timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_listings_bottle_price on public.listings (bottle_id, price asc);
create index if not exists idx_stores_city_state on public.stores (state, city);

-- RLS policies for MVP: public read, restricted writes
alter table public.bottles enable row level security;
alter table public.stores enable row level security;
alter table public.listings enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'bottles' and policyname = 'bottles_public_read'
  ) then
    create policy bottles_public_read on public.bottles for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'stores' and policyname = 'stores_public_read'
  ) then
    create policy stores_public_read on public.stores for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'listings' and policyname = 'listings_public_read'
  ) then
    create policy listings_public_read on public.listings for select using (true);
  end if;
end $$;
