-- ============================================================
-- À exécuter dans : supabase.com → votre projet → SQL Editor
-- ============================================================

-- 1. Table des profils utilisateurs
create table if not exists public.profiles (
  id   uuid primary key references auth.users(id) on delete cascade,
  name text not null
);

-- Sécurité : chaque utilisateur ne voit que son propre profil
alter table public.profiles enable row level security;

create policy "Lecture profil personnel"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Insertion profil personnel"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Mise à jour profil personnel"
  on public.profiles for update
  using (auth.uid() = id);


-- 2. Table des crises d'asthme
create table if not exists public.crises (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  description text not null,
  lieu        text,
  ventoline   boolean not null,
  intensite   integer not null check (intensite between 1 and 5),
  created_at  timestamptz not null default now()
);

-- Index pour accélérer les requêtes par utilisateur
create index if not exists crises_user_id_idx on public.crises(user_id);

-- Sécurité : chaque utilisateur ne voit que ses propres crises
alter table public.crises enable row level security;

create policy "Lecture crises personnelles"
  on public.crises for select
  using (auth.uid() = user_id);

create policy "Insertion crises personnelles"
  on public.crises for insert
  with check (auth.uid() = user_id);

create policy "Suppression crises personnelles"
  on public.crises for delete
  using (auth.uid() = user_id);
