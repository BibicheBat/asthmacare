-- ============================================================
-- À exécuter dans : supabase.com → votre projet → SQL Editor
-- ============================================================

-- 1. Table des profils (avec rôle)
create table if not exists public.profiles (
  id   uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null default 'user' check (role in ('user', 'viewer', 'admin'))
);

alter table public.profiles enable row level security;

-- Les utilisateurs voient leur propre profil
create policy "Lecture profil personnel"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Insertion profil personnel"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Mise à jour profil personnel"
  on public.profiles for update
  using (auth.uid() = id);

-- Les admins et viewers voient tous les profils
create policy "Admin/viewer voient tous les profils"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'viewer')
    )
  );

-- Les admins peuvent modifier les rôles
create policy "Admin modifie les rôles"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );


-- 2. Table des crises
create table if not exists public.crises (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  description text not null,
  lieu        text,
  ventoline   boolean not null,
  intensite   integer not null check (intensite between 1 and 5),
  created_at  timestamptz not null default now()
);

create index if not exists crises_user_id_idx on public.crises(user_id);

alter table public.crises enable row level security;

-- Chaque utilisateur gère ses propres crises
create policy "Lecture crises personnelles"
  on public.crises for select
  using (auth.uid() = user_id);

create policy "Insertion crises personnelles"
  on public.crises for insert
  with check (auth.uid() = user_id);

create policy "Mise à jour crises personnelles"
  on public.crises for update
  using (auth.uid() = user_id);

create policy "Suppression crises personnelles"
  on public.crises for delete
  using (auth.uid() = user_id);

-- Admins et viewers voient toutes les crises
create policy "Admin/viewer voient toutes les crises"
  on public.crises for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'viewer')
    )
  );

-- Admins peuvent supprimer n'importe quelle crise
create policy "Admin supprime toute crise"
  on public.crises for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );


-- ============================================================
-- CRÉER UN COMPTE ADMIN MANUELLEMENT
-- Après avoir créé votre premier compte via l'interface,
-- exécutez cette requête en remplaçant l'email :
-- ============================================================
-- update public.profiles
-- set role = 'admin'
-- where id = (select id from auth.users where email = 'votre@email.com');
