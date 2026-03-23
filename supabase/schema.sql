create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'recipe_type') then
    create type public.recipe_type as enum ('homemade', 'takeout');
  end if;

  if not exists (select 1 from pg_type where typname = 'meal_type') then
    create type public.meal_type as enum ('breakfast', 'lunch', 'dinner');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type public.recipe_type not null default 'homemade',
  name text not null,
  description text not null default '',
  image_path text,
  steps jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  meal_type public.meal_type not null,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, date, meal_type)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''));

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.recipes enable row level security;
alter table public.meal_plans enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "recipes_select_own" on public.recipes;
create policy "recipes_select_own"
on public.recipes
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "recipes_insert_own" on public.recipes;
create policy "recipes_insert_own"
on public.recipes
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "recipes_update_own" on public.recipes;
create policy "recipes_update_own"
on public.recipes
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "meal_plans_select_own" on public.meal_plans;
create policy "meal_plans_select_own"
on public.meal_plans
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "meal_plans_insert_own" on public.meal_plans;
create policy "meal_plans_insert_own"
on public.meal_plans
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "meal_plans_update_own" on public.meal_plans;
create policy "meal_plans_update_own"
on public.meal_plans
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "meal_plans_delete_own" on public.meal_plans;
create policy "meal_plans_delete_own"
on public.meal_plans
for delete
to authenticated
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', false)
on conflict (id) do nothing;

drop policy if exists "recipe_images_select_own" on storage.objects;
create policy "recipe_images_select_own"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'recipe-images'
  and auth.uid()::text = split_part(name, '/', 1)
);

drop policy if exists "recipe_images_insert_own" on storage.objects;
create policy "recipe_images_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'recipe-images'
  and auth.uid()::text = split_part(name, '/', 1)
);

drop policy if exists "recipe_images_update_own" on storage.objects;
create policy "recipe_images_update_own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'recipe-images'
  and auth.uid()::text = split_part(name, '/', 1)
)
with check (
  bucket_id = 'recipe-images'
  and auth.uid()::text = split_part(name, '/', 1)
);

drop policy if exists "recipe_images_delete_own" on storage.objects;
create policy "recipe_images_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'recipe-images'
  and auth.uid()::text = split_part(name, '/', 1)
);
