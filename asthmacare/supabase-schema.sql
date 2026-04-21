-- ============================================================
-- RESET COMPLET — exécutez ce script en entier dans
-- Supabase → SQL Editor → New query → Run
-- ============================================================

-- 1. Suppression des anciennes tables
drop table if exists public.crises cascade;
drop table if exists public.profiles cascade;


-- 2. Table profiles
create table public.profiles (
  id   uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null default 'user' check (role in ('user', 'viewer', 'admin'))
);

alter table public.profiles enable row level security;

create policy "profiles_select"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles_insert"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "profiles_update"
  on public.profiles for update
  to authenticated
  using (
    auth.uid() = id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "profiles_delete"
  on public.profiles for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );


-- 3. Table crises
create table public.crises (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  description text not null,
  lieu        text,
  ventoline   boolean not null,
  intensite   integer not null check (intensite between 1 and 5),
  created_at  timestamptz not null default now()
);

create index crises_user_id_idx on public.crises(user_id);

alter table public.crises enable row level security;

create policy "crises_select"
  on public.crises for select
  to authenticated
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'viewer')
    )
  );

create policy "crises_insert"
  on public.crises for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "crises_update"
  on public.crises for update
  to authenticated
  using (auth.uid() = user_id);

create policy "crises_delete"
  on public.crises for delete
  to authenticated
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
